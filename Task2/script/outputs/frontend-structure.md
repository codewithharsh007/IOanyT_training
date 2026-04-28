# Frontend Structure & Component Registry

## Tech Stack

React 18 + Vite
Tailwind CSS
Context API
Axios

---

## Packages

react
react-router-dom
axios

---

## Env

VITE_API_BASE_URL

---

## File Tree

/frontend
/src
/pages
RegisterPage.jsx
LoginPage.jsx
VerifyPage.jsx
DashboardPage.jsx
TaskFormPage.jsx
/components
Button.jsx
Input.jsx
Card.jsx
Modal.jsx
Sidebar.jsx
/hooks
useAuth.js
useTasks.js
/context
AuthContext.jsx
/services
api.js
/routes
ProtectedRoute.jsx
App.jsx
main.jsx
index.html

---

## Pages

RegisterPage → /register → US-001
LoginPage → /login → US-003
VerifyPage → /verify → US-002
DashboardPage → /dashboard → US-012
TaskFormPage → /task-form → US-005

---

## Components

Button → props: type, onClick, disabled
Input → props: value, onChange
Card → props: children
Modal → props: isOpen, onClose
Sidebar → props: items

---

## API Functions

registerUser()
loginUser()
verifyEmail()
getTasks()
createTask()
updateTask()
deleteTask()

---

## Hooks

useAuth → auth
useTasks → tasks

---

## Routes

/register
/login
/verify
/dashboard

