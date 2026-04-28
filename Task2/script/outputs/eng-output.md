Here is the **clean copy-paste version** of the full engineering output (no formatting blocks, no IDs, no UI wrappers).

---

# =========================

# eng-output.md

# =========================

# Technical Design Document (TDD)

## 1. Document Metadata

* Version: 1.0
* Date: 2026-04-28
* Author: Engineer / Architect
* Input Sources: ba-output.md (v1.0), pm-output.md (v1.3), ux-output.md (v2.0)
* Mode: Full Stack
* Companion Files: backend-structure.md, frontend-structure.md

---

## 2. Architecture Decision

* Pattern: Layered MVC (Controller → Service → Model)
* Reason: Ensures separation of concerns and maintainability

---

## 3. Technology Stack

Runtime: Node.js 20
Backend: Express 4
Database: MongoDB + Mongoose
Auth: JWT
Password Hashing: bcryptjs
Email: Nodemailer
Frontend: React 18 + Vite
Styling: Tailwind CSS
State: Context API
HTTP: Axios
Testing: Jest, Supertest, Vitest

---

## 4. API Contracts

POST /api/auth/register
Auth: No
Request:
{
"name": "string",
"email": "string",
"password": "string"
}
Response:
{
"success": true,
"message": "User registered. Verification email sent"
}
Errors:
400 Validation error
409 Email exists
Story: US-001

---

GET /api/auth/verify-email
Auth: No
Query: token
Response:
{
"success": true,
"message": "Email verified"
}
Errors:
400 Invalid token
410 Expired token
Story: US-002

---

POST /api/auth/login
Auth: No
Response:
{
"token": "string",
"user": {}
}
Errors:
401 Invalid credentials
403 Not verified
Story: US-003

---

POST /api/tasks
Auth: Yes
Request:
{
"title": "string",
"category": "string",
"tags": [],
"dueDate": "date",
"priority": "low|medium|high"
}
Story: US-005, US-009

---

GET /api/tasks
Auth: Yes
Story: US-006

---

PUT /api/tasks/:id
Auth: Yes
Story: US-007

---

DELETE /api/tasks/:id
Auth: Yes
Story: US-008

---

## 5. Database Schema

User:

* name: String
* email: String (unique)
* password: String (hashed)
* isVerified: Boolean (default false)
* verificationToken: String
* tokenExpiry: Date

Task:

* userId: ObjectId
* title: String
* category: String
* tags: Array
* status: open/done
* dueDate: Date
* priority: low/medium/high

Relationship:
User → many Tasks

---

## 6. Authentication & Authorization

* JWT in Authorization header
* Expiry: 7 days
  Payload:
  {
  userId,
  email,
  isVerified
  }

---

## 7. API Response Format

Success:
{
success: true,
message,
data
}

Error:
{
success: false,
message,
error
}

---

## 8. Non-Functional Design

Security: JWT + bcrypt
Rate limit: 100 req / 15 min
Validation: Joi
Email: Nodemailer

---

## 9. Assumptions

* Categories are user-defined
* Multiple tags allowed
* Email via SMTP
* Admin excluded

---

## 10. Blocked

US-015 Admin panel undefined

---

## 11. Traceability

registerUser → US-001
verifyEmail → US-002
createTask → US-005

