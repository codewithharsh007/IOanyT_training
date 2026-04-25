from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator, root_validator
from typing import Optional
from datetime import datetime, date
import sqlite3
import uuid

app = FastAPI(title="Todo API", version="3.0")

DATABASE = "todo.db"

# ---------------- UTIL ---------------- #

def now_utc():
    return datetime.utcnow().isoformat()

def error_response(code, message, request_id, status=400):
    raise HTTPException(
        status_code=status,
        detail={
            "code": code,
            "message": message,
            "requestId": request_id
        }
    )

# ---------------- GLOBAL ERROR HANDLER ---------------- #

@app.exception_handler(HTTPException)
def http_exception_handler(request, exc):
    detail = exc.detail if isinstance(exc.detail, dict) else {}
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": detail.get("code", "HTTP_ERROR"),
                "message": detail.get("message", str(exc.detail)),
                "requestId": detail.get("requestId")
            }
        }
    )

# ---------------- DB ---------------- #

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    with get_db() as conn:
        cur = conn.cursor()

        cur.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            normalizedName TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL
        )
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL CHECK(length(title) <= 120),
            description TEXT CHECK(length(description) <= 2000),
            categoryId INTEGER,
            dueDate TEXT,
            isCompleted INTEGER NOT NULL DEFAULT 0,
            completedAt TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
            FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
            CHECK (
                (isCompleted = 1 AND completedAt IS NOT NULL)
                OR
                (isCompleted = 0 AND completedAt IS NULL)
            )
        )
        """)

        # Indexes for performance
        cur.execute("CREATE INDEX IF NOT EXISTS idx_todos_createdAt ON todos(createdAt)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_todos_categoryId ON todos(categoryId)")

init_db()

# ---------------- SCHEMAS ---------------- #

class BaseStrictModel(BaseModel):
    class Config:
        extra = "forbid"

class CategoryCreate(BaseStrictModel):
    name: str = Field(..., min_length=1, max_length=50)

    @validator("name")
    def normalize(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be blank")
        return v.strip()

class TodoCreate(BaseStrictModel):
    title: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = Field(None, max_length=2000)
    categoryId: Optional[int]
    dueDate: Optional[date]
    isCompleted: Optional[bool] = False

    @validator("title")
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be blank")
        return v.strip()

class TodoUpdate(BaseStrictModel):
    title: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = Field(None, max_length=2000)
    categoryId: Optional[int]
    dueDate: Optional[date]
    version: int

    @root_validator
    def check_fields(cls, values):
        updates = {k: v for k, v in values.items() if v is not None and k != "version"}
        if not updates:
            raise ValueError("At least one field must be updated")
        return values

class CompletionUpdate(BaseStrictModel):
    isCompleted: bool
    version: int

# ---------------- HELPERS ---------------- #

def normalize_name(name: str):
    return name.strip().lower()

def format_response(data):
    return {"data": data}

# ---------------- CATEGORY APIs ---------------- #

@app.post("/api/v1/categories")
def create_category(req: Request, payload: CategoryCreate):
    request_id = str(uuid.uuid4())

    try:
        with get_db() as conn:
            cur = conn.cursor()
            norm = normalize_name(payload.name)

            cur.execute("""
            INSERT INTO categories (name, normalizedName, createdAt)
            VALUES (?, ?, ?)
            """, (payload.name, norm, now_utc()))

            return format_response({"id": cur.lastrowid, "name": payload.name})

    except sqlite3.IntegrityError:
        error_response("CATEGORY_EXISTS", "Category already exists", request_id, 409)

@app.get("/api/v1/categories")
def list_categories():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT id, name FROM categories")
        return format_response([dict(r) for r in cur.fetchall()])

# ---------------- TODO APIs ---------------- #

@app.post("/api/v1/todos")
def create_todo(req: Request, payload: TodoCreate):
    request_id = str(uuid.uuid4())

    try:
        with get_db() as conn:
            cur = conn.cursor()

            if payload.categoryId:
                cur.execute("SELECT id FROM categories WHERE id=?", (payload.categoryId,))
                if not cur.fetchone():
                    error_response("INVALID_CATEGORY", "Category does not exist", request_id, 422)

            now = now_utc()
            completed_at = now if payload.isCompleted else None

            cur.execute("""
            INSERT INTO todos (title, description, categoryId, dueDate, isCompleted, completedAt, createdAt, updatedAt, version)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                payload.title,
                payload.description,
                payload.categoryId,
                str(payload.dueDate) if payload.dueDate else None,
                int(payload.isCompleted),
                completed_at,
                now,
                now
            ))

            return format_response({"id": cur.lastrowid})

    except Exception:
        raise

@app.get("/api/v1/todos/{todo_id}")
def get_todo(todo_id: int):
    request_id = str(uuid.uuid4())

    if todo_id <= 0:
        error_response("INVALID_ID", "Invalid ID", request_id, 400)

    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
        row = cur.fetchone()

        if not row:
            error_response("NOT_FOUND", "Todo not found", request_id, 404)

        return format_response(dict(row))

@app.patch("/api/v1/todos/{todo_id}")
def update_todo(req: Request, todo_id: int, payload: TodoUpdate):
    request_id = str(uuid.uuid4())

    with get_db() as conn:
        cur = conn.cursor()

        updates = payload.dict(exclude_unset=True)
        version = updates.pop("version")

        if "categoryId" in updates:
            cur.execute("SELECT id FROM categories WHERE id=?", (updates["categoryId"],))
            if not cur.fetchone():
                error_response("INVALID_CATEGORY", "Category does not exist", request_id, 422)

        updates["updatedAt"] = now_utc()
        updates["version"] = version + 1

        set_clause = ", ".join([f"{k}=?" for k in updates])
        values = list(updates.values()) + [todo_id, version]

        cur.execute(f"""
            UPDATE todos
            SET {set_clause}
            WHERE id=? AND version=?
        """, values)

        if cur.rowcount == 0:
            error_response("VERSION_CONFLICT", "Version mismatch", request_id, 409)

        cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
        return format_response(dict(cur.fetchone()))

@app.patch("/api/v1/todos/{todo_id}/completion")
def update_completion(req: Request, todo_id: int, payload: CompletionUpdate):
    request_id = str(uuid.uuid4())

    with get_db() as conn:
        cur = conn.cursor()

        cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
        todo = cur.fetchone()

        if not todo:
            error_response("NOT_FOUND", "Todo not found", request_id, 404)

        if todo["version"] != payload.version:
            error_response("VERSION_CONFLICT", "Version mismatch", request_id, 409)

        if bool(todo["isCompleted"]) == payload.isCompleted:
            return format_response({"message": "No change"})

        completed_at = now_utc() if payload.isCompleted else None

        cur.execute("""
        UPDATE todos
        SET isCompleted=?, completedAt=?, updatedAt=?, version=?
        WHERE id=? AND version=?
        """, (
            int(payload.isCompleted),
            completed_at,
            now_utc(),
            todo["version"] + 1,
            todo_id,
            payload.version
        ))

        if cur.rowcount == 0:
            error_response("VERSION_CONFLICT", "Version mismatch", request_id, 409)

        return format_response({"message": "Completion updated"})

@app.delete("/api/v1/todos/{todo_id}", status_code=204)
def delete_todo(req: Request, todo_id: int):
    request_id = str(uuid.uuid4())

    with get_db() as conn:
        cur = conn.cursor()

        cur.execute("SELECT id FROM todos WHERE id=?", (todo_id,))
        if not cur.fetchone():
            error_response("NOT_FOUND", "Todo not found", request_id, 404)

        cur.execute("DELETE FROM todos WHERE id=?", (todo_id,))

    return Response(status_code=204)