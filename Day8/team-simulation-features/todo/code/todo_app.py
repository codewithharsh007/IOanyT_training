from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field, validator, root_validator
from typing import Optional
from datetime import datetime, date
import sqlite3
import uuid

app = FastAPI(title="Todo API", version="1.0")

DATABASE = "todo.db"


# ---------------- UTIL ---------------- #

def now_utc():
    return datetime.utcnow().isoformat()


def error_response(code, message, request_id, field_errors=None, status=400):
    raise HTTPException(
        status_code=status,
        detail={
            "code": code,
            "message": message,
            "requestId": request_id,
            "fieldErrors": field_errors or []
        }
    )


# ---------------- DB ---------------- #

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db()
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
        title TEXT NOT NULL,
        description TEXT,
        categoryId INTEGER,
        dueDate TEXT,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        completedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
    )
    """)

    conn.commit()
    conn.close()


init_db()


# ---------------- SCHEMAS ---------------- #

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)

    @validator("name")
    def normalize(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be blank")
        return v.strip()


class TodoCreate(BaseModel):
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


class TodoUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    categoryId: Optional[int]
    dueDate: Optional[date]
    version: int

    @root_validator
    def check_fields(cls, values):
        if len(values) <= 1:  # only version present
            raise ValueError("At least one field must be updated")
        return values


class CompletionUpdate(BaseModel):
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
    conn = get_db()
    cur = conn.cursor()

    norm = normalize_name(payload.name)

    try:
        cur.execute("""
        INSERT INTO categories (name, normalizedName, createdAt)
        VALUES (?, ?, ?)
        """, (payload.name, norm, now_utc()))
        conn.commit()
    except sqlite3.IntegrityError:
        error_response("CATEGORY_EXISTS", "Category already exists", request_id, status=409)

    return format_response({"id": cur.lastrowid, "name": payload.name})


@app.get("/api/v1/categories")
def list_categories():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, name FROM categories")
    return format_response([dict(r) for r in cur.fetchall()])


# ---------------- TODO APIs ---------------- #

@app.post("/api/v1/todos")
def create_todo(req: Request, payload: TodoCreate):
    request_id = str(uuid.uuid4())
    conn = get_db()
    cur = conn.cursor()

    if payload.categoryId:
        cur.execute("SELECT id FROM categories WHERE id=?", (payload.categoryId,))
        if not cur.fetchone():
            error_response("INVALID_CATEGORY", "Category does not exist", request_id, status=422)

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

    conn.commit()

    return format_response({"id": cur.lastrowid})


@app.get("/api/v1/todos")
def list_todos(page: int = 1, pageSize: int = 20):
    if page < 1 or pageSize < 1 or pageSize > 100:
        raise HTTPException(status_code=400, detail="Invalid pagination")

    offset = (page - 1) * pageSize
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM todos")
    total = cur.fetchone()[0]

    cur.execute("""
    SELECT * FROM todos
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
    """, (pageSize, offset))

    return {
        "data": [dict(r) for r in cur.fetchall()],
        "page": page,
        "pageSize": pageSize,
        "total": total
    }


@app.get("/api/v1/todos/{todo_id}")
def get_todo(todo_id: int):
    if todo_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid ID")

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
    row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Todo not found")

    return format_response(dict(row))


@app.patch("/api/v1/todos/{todo_id}")
def update_todo(req: Request, todo_id: int, payload: TodoUpdate):
    request_id = str(uuid.uuid4())
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
    existing = cur.fetchone()

    if not existing:
        error_response("NOT_FOUND", "Todo not found", request_id, status=404)

    if existing["version"] != payload.version:
        error_response("VERSION_CONFLICT", "Version mismatch", request_id, status=409)

    updates = payload.dict(exclude_unset=True)
    updates.pop("version")

    if "categoryId" in updates:
        cur.execute("SELECT id FROM categories WHERE id=?", (updates["categoryId"],))
        if not cur.fetchone():
            error_response("INVALID_CATEGORY", "Category does not exist", request_id, status=422)

    updates["updatedAt"] = now_utc()
    updates["version"] = existing["version"] + 1

    set_clause = ", ".join([f"{k}=?" for k in updates])
    values = list(updates.values()) + [todo_id]

    cur.execute(f"UPDATE todos SET {set_clause} WHERE id=?", values)
    conn.commit()

    return format_response({"message": "Updated"})


@app.patch("/api/v1/todos/{todo_id}/completion")
def update_completion(req: Request, todo_id: int, payload: CompletionUpdate):
    request_id = str(uuid.uuid4())
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM todos WHERE id=?", (todo_id,))
    todo = cur.fetchone()

    if not todo:
        error_response("NOT_FOUND", "Todo not found", request_id, status=404)

    if todo["version"] != payload.version:
        error_response("VERSION_CONFLICT", "Version mismatch", request_id, status=409)

    completed_at = now_utc() if payload.isCompleted else None

    cur.execute("""
    UPDATE todos
    SET isCompleted=?, completedAt=?, updatedAt=?, version=?
    WHERE id=?
    """, (
        int(payload.isCompleted),
        completed_at,
        now_utc(),
        todo["version"] + 1,
        todo_id
    ))

    conn.commit()

    return format_response({"message": "Completion updated"})


@app.delete("/api/v1/todos/{todo_id}")
def delete_todo(req: Request, todo_id: int):
    request_id = str(uuid.uuid4())
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM todos WHERE id=?", (todo_id,))
    if not cur.fetchone():
        error_response("NOT_FOUND", "Todo not found", request_id, status=404)

    cur.execute("DELETE FROM todos WHERE id=?", (todo_id,))
    conn.commit()

    return {"message": "Deleted"}