# 📌 Todo Management API

A lightweight REST API built using **FastAPI** and **SQLite** for managing todos with categories, due dates, and completion tracking.

---

## 🚀 Features

### 📝 Todo Management
- Create, read, update, delete todos  
- Assign categories to todos  
- Set and update due dates  
- Mark todos as complete/incomplete  
- Pagination support for listing todos  
- Partial updates supported  

### 📁 Category Management
- Create categories  
- List all categories  
- Case-insensitive uniqueness enforcement  

### ✔️ Completion Tracking
- Mark todo as complete or incomplete  
- Auto-set `completedAt` when completed  
- Clear `completedAt` when marked incomplete  

### 🔁 Optimistic Concurrency Control
- Each todo has a `version` field  
- Update operations require matching version  
- Prevents concurrent update conflicts (409 error on mismatch)  

### ⚠️ Validation & Error Handling
- Field-level validation (title, description, etc.)  
- Category existence validation  
- Pagination limits enforced  
- Structured error responses:
  - error code  
  - message  
  - requestId  
  - fieldErrors (if applicable)  

### 💾 Persistence
- SQLite database (`todo.db`)  
- Auto-created on startup  
- Foreign key constraints enabled  

### 📦 API Design
- RESTful architecture  
- Versioned endpoints (`/api/v1/...`)  
- Proper HTTP status codes:
  - 200, 201, 204, 400, 404, 409, 422  

---

## 🛠️ Tech Stack

- Python 3.8+  
- FastAPI  
- SQLite  

---

## ⚙️ Setup Instructions

### 1. Clone Project
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn
```

### 3. Run Server
```bash
uvicorn main:app --reload
```

### 4. Open API Docs

- Swagger UI:  
  http://127.0.0.1:8000/docs  

- ReDoc:  
  http://127.0.0.1:8000/redoc  

---

## 📂 Database

- SQLite database (`todo.db`) is created automatically  
- No manual setup required  

---

## 🔗 API Endpoints

### 📁 Categories
- POST /api/v1/categories → Create category  
- GET /api/v1/categories → List categories  

### 📝 Todos
- POST /api/v1/todos → Create todo  
- GET /api/v1/todos → List todos (pagination supported)  
- GET /api/v1/todos/{id} → Get todo by ID  
- PATCH /api/v1/todos/{id} → Update todo  
- PATCH /api/v1/todos/{id}/completion → Update completion status  
- DELETE /api/v1/todos/{id} → Delete todo  

---

## 📥 Sample Request

```json
{
  "title": "Finish assignment",
  "description": "Complete API project",
  "categoryId": 1,
  "dueDate": "2026-05-01",
  "isCompleted": false
}
```

---

## 🧪 Testing

- Swagger UI (recommended)  
- Postman  
- cURL  

---

## 📌 Architecture Notes

- Single-file FastAPI application  
- PM → BA → Engineer → QA workflow simulation  
- Clean and testable API design  

---

## ⚠️ Known Limitations

### 🏗️ Architecture
- No service/repository layer separation  
- Single-file implementation  

### 🔐 Security
- No authentication or authorization  

### 📊 Features
- No search/filter/sort beyond pagination  
- No bulk operations  

### 🧾 Logging
- No centralized logging system  
- requestId not globally logged  

### 🗄️ Database
- SQLite only (not production-grade)  
- Limited concurrency handling  

### ⏳ Trade-offs
- No soft delete  
- No retry mechanism  
- No category update/delete endpoints  

### 🌍 Timezone
- UTC only storage  
- No timezone conversion  

---

## 📌 Summary

A clean MVP Todo Management API built with:

- FastAPI  
- SQLite  
- CRUD operations  
- Category system  
- Pagination  
- Optimistic concurrency control  
- Structured error handling  