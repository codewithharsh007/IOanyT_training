# Backend Structure & Function Registry

## Tech Stack

Node.js 20
Express 4
MongoDB
JWT

---

## Packages

Production:
express, mongoose, jsonwebtoken, bcryptjs, dotenv, cors, helmet, morgan, express-rate-limit, nodemailer, joi

Dev:
jest, supertest, nodemon

---

## Env Variables

PORT
MONGO_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
EMAIL_HOST

---

## File Tree

/backend
/src
/config
db.js
constants.js
/models
User.js
Task.js
/middleware
auth.js
validate.js
errorHandler.js
/services
authService.js
taskService.js
emailService.js
/routes
authRoutes.js
taskRoutes.js
/utils
response.js
logger.js
app.js
server.js
/tests
.env.example
package.json

---

## Services

authService:

* registerUser()
* loginUser()
* verifyEmail()
* generateToken()

taskService:

* createTask()
* getTasks()
* updateTask()
* deleteTask()

emailService:

* sendVerificationEmail()

---

## Assumptions Locked

* multi-tags allowed
* user-defined categories
* no admin

