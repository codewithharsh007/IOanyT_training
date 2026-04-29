# Technical Design Document (TDD)

## 1. Document Metadata
- **Version:** 1.0
- **Date:** April 29, 2026
- **Author:** Engineer / Architect
- **Input Sources:** ba-output.md (v2.0), ux-output.md (v2.0), pm-output.md (v2.0)
- **Mode:** Full Stack
- **Companion Files:** backend-structure.md, frontend-structure.md

---

## 2. Architecture Decision
- **Pattern:** Layered MVC (Routes → Middleware → Services → Models)
- **Reason:** Enforces strict separation of concerns and makes the state-machine business logic in the invoice/payment engine independently testable and auditable.

---

## 3. Technology Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| Runtime | Node.js | 20 LTS | pm-output.md Section 16: "Fixed stack — Node" |
| Backend Framework | Express | 4.x | pm-output.md Section 16: "Fixed stack — Node" (defaults to Express) |
| Database | MongoDB + Mongoose | latest stable | pm-output.md Section 16: "Fixed stack — MongoDB" |
| Auth | JWT (jsonwebtoken) + Refresh Token rotation | latest stable | ba-output.md US-002: refresh token rotation required |
| Frontend Framework | React + Vite | React 19, Vite 5 | pm-output.md Section 16: "Fixed stack — React" |
| Styling | Tailwind CSS | 4.x | Non-negotiable default per eng-role.md |
| Email | Nodemailer | latest stable | F13 email notifications required; priority 2 implied |
| PDF | puppeteer or pdfkit | latest stable | F9 PDF export required; Priority 2 implied |
| Testing (Backend) | Jest + Supertest | latest stable | Default |
| Testing (Frontend) | Vitest + Testing Library | latest stable | Default |
| Package Manager | npm | — | Default |

---

## 4. API Contracts

---

### POST /api/auth/register
- **Description:** Register a new freelancer account
- **Auth Required:** No
- **Middleware applied:** rateLimiter (register), validateRegister, mongoSanitize, xssClean
- **Calls service:** authService.registerUser()
- **Request Body:**
  ```json
  {
    "name": "string, required, min:2 max:50",
    "email": "string, required, valid email format",
    "password": "string, required, min:8"
  }
  ```
- **Response 201:**
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": { "userId": "string", "name": "string", "email": "string" }
  }
  ```
- **Error Responses:**
  - 400: Validation failure (missing/invalid fields)
  - 409: Email already registered
  - 500: Server error
- **Mapped Story:** US-001

---

### POST /api/auth/login
- **Description:** Authenticate a freelancer and issue JWT + refresh token
- **Auth Required:** No
- **Middleware applied:** rateLimiter (login), validateLogin, mongoSanitize, xssClean
- **Calls service:** authService.loginUser()
- **Request Body:**
  ```json
  {
    "email": "string, required",
    "password": "string, required"
  }
  ```
- **Response 200:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "string (JWT, 15m expiry)",
      "refreshToken": "string (opaque, 7d expiry)",
      "user": { "userId": "string", "name": "string", "email": "string", "role": "string" }
    }
  }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 401: Invalid credentials
  - 403: Email not verified
  - 500: Server error
- **Mapped Story:** US-002

---

### POST /api/auth/refresh
- **Description:** Exchange a valid refresh token for a new JWT + rotated refresh token
- **Auth Required:** No
- **Middleware applied:** mongoSanitize
- **Calls service:** authService.refreshTokens()
- **Request Body:**
  ```json
  { "refreshToken": "string, required" }
  ```
- **Response 200:**
  ```json
  {
    "success": true,
    "message": "Token refreshed",
    "data": { "token": "string", "refreshToken": "string" }
  }
  ```
- **Error Responses:**
  - 401: Missing refresh token
  - 401: Invalid or expired refresh token
  - 500: Server error
- **Mapped Story:** US-002

---

### POST /api/auth/logout
- **Description:** Invalidate the current refresh token
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** authService.logout()
- **Request Body:**
  ```json
  { "refreshToken": "string, required" }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "Logged out successfully", "data": {} }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-002

---

### POST /api/auth/forgot-password
- **Description:** Send password reset email with OTP/token
- **Auth Required:** No
- **Middleware applied:** rateLimiter (auth), validateForgotPassword, mongoSanitize
- **Calls service:** authService.forgotPassword()
- **Request Body:**
  ```json
  { "email": "string, required" }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "If an account exists with this email, a reset link has been sent.", "data": {} }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 500: Server error
- **Note:** Always returns 200 to prevent email enumeration
- **Mapped Story:** US-AUTH-02 (S-016)

---

### POST /api/auth/reset-password
- **Description:** Reset password using a valid reset token
- **Auth Required:** No
- **Middleware applied:** rateLimiter (auth), validateResetPassword, mongoSanitize
- **Calls service:** authService.resetPassword()
- **Request Body:**
  ```json
  { "token": "string, required", "newPassword": "string, required, min:8" }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "Password reset successful", "data": {} }
  ```
- **Error Responses:**
  - 400: Invalid or expired token
  - 400: Validation failure
  - 500: Server error
- **Mapped Story:** US-AUTH-02

---

### POST /api/auth/verify-email
- **Description:** Verify email address using verification token
- **Auth Required:** No
- **Middleware applied:** mongoSanitize
- **Calls service:** authService.verifyEmail()
- **Request Body:**
  ```json
  { "token": "string, required" }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "Email verified successfully", "data": {} }
  ```
- **Error Responses:**
  - 400: Invalid or expired token
  - 500: Server error
- **Mapped Story:** US-001 AC3

---

### GET /api/clients
- **Description:** Get all clients for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** clientService.getAllClients()
- **Query Params:** `search` (string, optional), `status` (Active|Archived, optional), `page` (number, optional), `limit` (number, optional)
- **Response 200:**
  ```json
  {
    "success": true,
    "message": "Clients fetched",
    "data": {
      "clients": [ { "_id": "string", "name": "string", "company": "string", "email": "string", "phone": "string", "status": "string" } ],
      "total": "number",
      "page": "number"
    }
  }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-004, US-CLIENT-01

---

### POST /api/clients
- **Description:** Create a new client for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect, validateCreateClient
- **Calls service:** clientService.createClient()
- **Request Body:**
  ```json
  {
    "name": "string, required, min:2 max:100",
    "company": "string, optional, max:100",
    "email": "string, required, valid email",
    "phone": "string, optional",
    "notes": "string, optional, max:500"
  }
  ```
- **Response 201:**
  ```json
  { "success": true, "message": "Client created", "data": { "_id": "string", "name": "string", "email": "string", "status": "Active" } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 401: Not authenticated
  - 409: Email already exists for this freelancer
  - 500: Server error
- **Idempotency:** email + freelancerId unique — 409 on duplicate
- **Mapped Story:** US-004, US-CLIENT-02

---

### GET /api/clients/:id
- **Description:** Get a single client by ID
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** clientService.getClientById()
- **Response 200:**
  ```json
  { "success": true, "message": "Client fetched", "data": { ... full client object ... } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found (also returned if freelancerId mismatch — ownership pattern)
  - 500: Server error
- **Mapped Story:** US-CLIENT-03

---

### PUT /api/clients/:id
- **Description:** Update a client's details
- **Auth Required:** Yes
- **Middleware applied:** protect, validateUpdateClient
- **Calls service:** clientService.updateClient()
- **Request Body:** Same fields as POST /api/clients (all optional for update)
- **Response 200:**
  ```json
  { "success": true, "message": "Client updated", "data": { ... updated client ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-CLIENT-02

---

### PATCH /api/clients/:id/archive
- **Description:** Archive a client (soft delete — status → Archived)
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** clientService.archiveClient()
- **Request Body:** None
- **Response 200:**
  ```json
  { "success": true, "message": "Client archived", "data": { "_id": "string", "status": "Archived" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 409: Client already archived
  - 500: Server error
- **Mapped Story:** US-004

---

### PATCH /api/clients/:id/unarchive
- **Description:** Unarchive a client (status → Active)
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** clientService.unarchiveClient()
- **Request Body:** None
- **Response 200:**
  ```json
  { "success": true, "message": "Client unarchived", "data": { "_id": "string", "status": "Active" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 409: Client already active
  - 500: Server error
- **Mapped Story:** US-CLIENT-03

---

### POST /api/clients/:id/invite
- **Description:** Send a portal invitation email to a client
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** clientService.inviteClient()
- **Request Body:** None
- **Response 200:**
  ```json
  { "success": true, "message": "Invitation sent", "data": { "inviteToken": "string", "expiresAt": "ISO date" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 409: Active invite already pending
  - 500: Server error
- **Audit:** Generates AuditLog entry on send
- **Mapped Story:** US-005

---

### POST /api/auth/client-portal/accept
- **Description:** Accept a client invite token and create/link client portal session
- **Auth Required:** No
- **Middleware applied:** mongoSanitize
- **Calls service:** authService.acceptClientInvite()
- **Request Body:**
  ```json
  { "token": "string, required", "password": "string, required, min:8" }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "Portal access granted", "data": { "token": "string", "refreshToken": "string", "user": { ... } } }
  ```
- **Error Responses:**
  - 400: Token expired or invalid
  - 400: Already redeemed
  - 500: Server error
- **Mapped Story:** US-005

---

### GET /api/projects
- **Description:** Get all projects for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** projectService.getAllProjects()
- **Query Params:** `status` (Active|Draft|Completed|Archived|OnHold, optional), `clientId` (optional), `search` (optional), `page`, `limit`
- **Response 200:**
  ```json
  { "success": true, "message": "Projects fetched", "data": { "projects": [ ... ], "total": "number", "page": "number" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-007, US-PROJ-01

---

### POST /api/projects
- **Description:** Create a new project
- **Auth Required:** Yes
- **Middleware applied:** protect, validateCreateProject
- **Calls service:** projectService.createProject()
- **Request Body:**
  ```json
  {
    "name": "string, required, min:2 max:100",
    "clientId": "string, required, valid ObjectId",
    "status": "string, optional, enum:[Active, Draft, OnHold], default:Draft",
    "description": "string, optional, max:500",
    "startDate": "ISO date, optional",
    "deadline": "ISO date, optional, must be after startDate",
    "budget": "number, optional, min:0",
    "hourlyRate": "number, optional, min:0"
  }
  ```
- **Response 201:**
  ```json
  { "success": true, "message": "Project created", "data": { ... project object ... } }
  ```
- **Error Responses:**
  - 400: Validation failure or deadline before startDate
  - 401: Not authenticated
  - 404: clientId not found or not owned by freelancer
  - 500: Server error
- **Mapped Story:** US-007, US-PROJ-02

---

### GET /api/projects/:id
- **Description:** Get a single project by ID with linked time logs and invoices summary
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** projectService.getProjectById()
- **Response 200:**
  ```json
  { "success": true, "message": "Project fetched", "data": { ... full project with stats ... } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-PROJ-03

---

### PUT /api/projects/:id
- **Description:** Update project details
- **Auth Required:** Yes
- **Middleware applied:** protect, validateUpdateProject
- **Calls service:** projectService.updateProject()
- **Request Body:** Same fields as POST (all optional)
- **Business Rule:** Archived projects cannot be updated
- **Response 200:**
  ```json
  { "success": true, "message": "Project updated", "data": { ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 400: Cannot edit archived project
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-007

---

### PATCH /api/projects/:id/archive
- **Description:** Archive a project (status → Archived, read-only thereafter)
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** projectService.archiveProject()
- **Response 200:**
  ```json
  { "success": true, "message": "Project archived", "data": { "_id": "string", "status": "Archived" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 409: Already archived
  - 500: Server error
- **Note:** Projects cannot be deleted (BA audit requirement)
- **Mapped Story:** US-007

---

### GET /api/time-logs
- **Description:** Get all time logs for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** timeLogService.getAllTimeLogs()
- **Query Params:** `projectId` (optional), `search` (task description search, optional), `startDate`, `endDate` (ISO date range, optional), `page`, `limit`
- **Response 200:**
  ```json
  { "success": true, "message": "Time logs fetched", "data": { "timeLogs": [ ... ], "total": "number", "totalHours": "number", "billableHours": "number" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-008, US-TIME-01

---

### POST /api/time-logs
- **Description:** Create a new time log entry
- **Auth Required:** Yes
- **Middleware applied:** protect, validateCreateTimeLog
- **Calls service:** timeLogService.createTimeLog()
- **Request Body:**
  ```json
  {
    "projectId": "string, required, valid ObjectId",
    "date": "ISO date, required, cannot be future",
    "hours": "number, required, min:0, max:23",
    "minutes": "number, required, min:0, max:59",
    "description": "string, optional, max:500"
  }
  ```
- **Business Rule:** hours + minutes must total > 0
- **Response 201:**
  ```json
  { "success": true, "message": "Time logged", "data": { ... time log object ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 400: Duration must be > 0
  - 400: Date cannot be in the future
  - 401: Not authenticated
  - 404: Project not found or not owner
  - 500: Server error
- **Mapped Story:** US-008, US-TIME-02

---

### PUT /api/time-logs/:id
- **Description:** Update a time log entry
- **Auth Required:** Yes
- **Middleware applied:** protect, validateUpdateTimeLog
- **Calls service:** timeLogService.updateTimeLog()
- **Request Body:** Same fields as POST (all optional)
- **Business Rule:** Cannot update locked time logs
- **Response 200:**
  ```json
  { "success": true, "message": "Time log updated", "data": { ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 400: Time log is locked (included in sent invoice)
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-008

---

### DELETE /api/time-logs/:id
- **Description:** Delete a time log entry
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** timeLogService.deleteTimeLog()
- **Business Rule:** Cannot delete locked time logs
- **Response 200:**
  ```json
  { "success": true, "message": "Time log deleted", "data": {} }
  ```
- **Error Responses:**
  - 400: Time log is locked
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-008

---

### GET /api/invoices
- **Description:** Get all invoices for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** invoiceService.getAllInvoices()
- **Query Params:** `status` (Draft|Sent|Viewed|PartiallyPaid|Paid|Overdue, optional), `clientId` (optional), `search` (invoice number search, optional), `page`, `limit`
- **Response 200:**
  ```json
  { "success": true, "message": "Invoices fetched", "data": { "invoices": [ ... ], "total": "number" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-009, US-INV-01

---

### POST /api/invoices
- **Description:** Create a new invoice in Draft status
- **Auth Required:** Yes
- **Middleware applied:** protect, validateCreateInvoice
- **Calls service:** invoiceService.createInvoice()
- **Request Body:**
  ```json
  {
    "clientId": "string, required",
    "projectId": "string, optional",
    "invoiceNumber": "string, optional (auto-generated if absent)",
    "issueDate": "ISO date, required",
    "dueDate": "ISO date, required, must be after issueDate",
    "lineItems": [
      { "description": "string, required", "quantity": "number, required, min:0.01", "rate": "number, required, min:0" }
    ],
    "taxPercent": "number, optional, min:0, max:100, default:0",
    "notes": "string, optional, max:1000",
    "timeLogIds": ["ObjectId array, optional — unlocked logs to attach"]
  }
  ```
- **Business Rule:** totalAmount = sum(lineItems.quantity * lineItems.rate) * (1 + taxPercent/100), computed server-side
- **Response 201:**
  ```json
  { "success": true, "message": "Invoice created", "data": { ... invoice object with computed total ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 400: Locked time logs referenced
  - 401: Not authenticated
  - 404: clientId or projectId not found or not owner
  - 409: Invoice number already exists for this freelancer
  - 500: Server error
- **Mapped Story:** US-009, US-INV-03

---

### GET /api/invoices/:id
- **Description:** Get a single invoice with line items, payments, and status
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** invoiceService.getInvoiceById()
- **Response 200:**
  ```json
  { "success": true, "message": "Invoice fetched", "data": { ... full invoice with lineItems, payments, balanceDue ... } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-INV-02

---

### PUT /api/invoices/:id
- **Description:** Update an invoice (only allowed in Draft status)
- **Auth Required:** Yes
- **Middleware applied:** protect, validateUpdateInvoice
- **Calls service:** invoiceService.updateInvoice()
- **Business Rule:** Cannot update if status !== Draft
- **Request Body:** Same as POST /api/invoices (all optional)
- **Response 200:**
  ```json
  { "success": true, "message": "Invoice updated", "data": { ... } }
  ```
- **Error Responses:**
  - 400: Invoice is not in Draft status
  - 400: Validation failure
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-009, US-010

---

### PATCH /api/invoices/:id/send
- **Description:** Send an invoice (Draft → Sent), locks time logs, triggers email, creates audit log
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** invoiceService.sendInvoice()
- **Request Body:** None
- **Side Effects:**
  1. All attached time logs → status: Locked
  2. AuditLog entry created
  3. Email sent to client (if client has portal access)
- **Response 200:**
  ```json
  { "success": true, "message": "Invoice sent", "data": { "_id": "string", "status": "Sent" } }
  ```
- **Error Responses:**
  - 400: Invoice not in Draft status
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: Server error
- **Mapped Story:** US-010

---

### GET /api/invoices/:id/pdf
- **Description:** Generate and return a PDF of the invoice
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** invoiceService.generatePDF()
- **Response:** Binary PDF stream (Content-Type: application/pdf)
- **Error Responses:**
  - 401: Not authenticated
  - 404: Not found or not owner
  - 500: PDF generation failure
- **Mapped Story:** US-014

---

### POST /api/invoices/:id/payments
- **Description:** Record a payment against an invoice (append-only)
- **Auth Required:** Yes
- **Middleware applied:** protect, validateCreatePayment
- **Calls service:** paymentService.recordPayment()
- **Request Body:**
  ```json
  {
    "amount": "number, required, min:0.01",
    "method": "string, optional, default:manual, enum:[manual, bank_transfer, cash, cheque]",
    "notes": "string, optional"
  }
  ```
- **Business Rules:**
  1. Invoice must be in Sent, Viewed, PartiallyPaid, or Overdue status
  2. sum(existingPayments) + amount ≤ invoice.totalAmount — 400 if overpayment
  3. After payment: recalculate status → PartiallyPaid or Paid
  4. Create AuditLog entry
- **Response 201:**
  ```json
  { "success": true, "message": "Payment recorded", "data": { ... payment ledger entry + updated invoice status ... } }
  ```
- **Error Responses:**
  - 400: Overpayment — exceeds invoice total
  - 400: Invoice not in payable status
  - 401: Not authenticated
  - 404: Invoice not found or not owner
  - 500: Server error
- **Mapped Story:** US-012, US-013

---

### GET /api/dashboard
- **Description:** Get dashboard metrics for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** dashboardService.getMetrics()
- **Response 200:**
  ```json
  {
    "success": true,
    "message": "Dashboard data fetched",
    "data": {
      "totalEarningsThisMonth": "number",
      "earningsByMonth": [ { "month": "string", "amount": "number" } ],
      "outstandingInvoicesCount": "number",
      "outstandingInvoicesTotal": "number",
      "overdueCount": "number",
      "activeProjectsCount": "number",
      "recentInvoices": [ ... ]
    }
  }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-015, US-DASH-01

---

### GET /api/audit-logs
- **Description:** Get audit logs for the authenticated freelancer
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** auditService.getAuditLogs()
- **Query Params:** `entityType`, `entityId`, `page`, `limit`
- **Response 200:**
  ```json
  { "success": true, "message": "Audit logs fetched", "data": { "logs": [ ... ], "total": "number" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** BA Section 3.3

---

### GET /api/settings
- **Description:** Get current user settings and notification preferences
- **Auth Required:** Yes
- **Middleware applied:** protect
- **Calls service:** settingsService.getSettings()
- **Response 200:**
  ```json
  { "success": true, "message": "Settings fetched", "data": { "profile": { "name": "string", "email": "string", "company": "string" }, "notifications": { "emailOnInvoiceView": "boolean", "emailOnPaymentReceived": "boolean", "overdueInvoiceAlerts": "boolean", "emailOnTimeLogs": "boolean" } } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-SET-01

---

### PUT /api/settings
- **Description:** Update profile and notification settings
- **Auth Required:** Yes
- **Middleware applied:** protect, validateUpdateSettings
- **Calls service:** settingsService.updateSettings()
- **Request Body:**
  ```json
  {
    "name": "string, optional",
    "company": "string, optional",
    "notifications": {
      "emailOnInvoiceView": "boolean, optional",
      "emailOnPaymentReceived": "boolean, optional",
      "overdueInvoiceAlerts": "boolean, optional",
      "emailOnTimeLogs": "boolean, optional"
    }
  }
  ```
- **Response 200:**
  ```json
  { "success": true, "message": "Settings updated", "data": { ... updated settings ... } }
  ```
- **Error Responses:**
  - 400: Validation failure
  - 401: Not authenticated
  - 500: Server error
- **Mapped Story:** US-SET-01

---

### CLIENT PORTAL ROUTES (role: client)

### GET /api/portal/invoices
- **Description:** Get invoices visible to the authenticated client (scoped to clientId + freelancerId)
- **Auth Required:** Yes (client JWT)
- **Middleware applied:** protect, clientOnly
- **Calls service:** portalService.getClientInvoices()
- **Side Effect:** First access to an invoice triggers status → Viewed + AuditLog (handled in GET /api/portal/invoices/:id)
- **Response 200:**
  ```json
  { "success": true, "message": "Invoices fetched", "data": { "invoices": [ ... ], "total": "number" } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 403: Not a client role
  - 500: Server error
- **Mapped Story:** US-006, US-016

---

### GET /api/portal/invoices/:id
- **Description:** Get a single invoice detail (client portal view) — triggers Viewed status on first access
- **Auth Required:** Yes (client JWT)
- **Middleware applied:** protect, clientOnly
- **Calls service:** portalService.getClientInvoiceById()
- **Side Effects:** If status === Sent → status → Viewed, AuditLog entry created
- **Response 200:**
  ```json
  { "success": true, "message": "Invoice fetched", "data": { ... full invoice ... } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 403: Not a client role
  - 404: Invoice not accessible to this client
  - 500: Server error
- **Mapped Story:** US-011

---

### GET /api/portal/projects
- **Description:** Get projects visible to the authenticated client (read-only)
- **Auth Required:** Yes (client JWT)
- **Middleware applied:** protect, clientOnly
- **Calls service:** portalService.getClientProjects()
- **Response 200:**
  ```json
  { "success": true, "message": "Projects fetched", "data": { "projects": [ ... ] } }
  ```
- **Error Responses:**
  - 401: Not authenticated
  - 403: Not a client role
  - 500: Server error
- **Mapped Story:** US-006, US-016

---

## 5. Database Schema

### Entity: User
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| name | String | yes | — | min:2, max:50, trim | — |
| email | String | yes | — | unique, lowercase, trim | unique |
| passwordHash | String | yes | — | minlength:60 | — |
| role | String | yes | "freelancer" | enum:[freelancer, client] | — |
| isEmailVerified | Boolean | yes | false | — | — |
| emailVerificationToken | String | no | null | — | — |
| emailVerificationExpires | Date | no | null | — | — |
| passwordResetToken | String | no | null | — | — |
| passwordResetExpires | Date | no | null | — | — |
| clientId | ObjectId | no | null | ref:Client — only populated when role=client | — |
| freelancerId | ObjectId | no | null | ref:User — for client role: which freelancer owns them | — |
| company | String | no | "" | max:100 | — |
| notificationPreferences | Object | yes | all true | emailOnInvoiceView, emailOnPaymentReceived, overdueInvoiceAlerts, emailOnTimeLogs | — |
| timestamps | auto | — | — | createdAt, updatedAt | — |

### Entity: RefreshToken
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| userId | ObjectId | yes | — | ref:User | indexed |
| token | String | yes | — | unique, hashed | unique |
| expiresAt | Date | yes | — | TTL index | TTL |
| isRevoked | Boolean | yes | false | — | — |
| timestamps | auto | — | — | createdAt | — |

### Entity: Client
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| name | String | yes | — | min:2, max:100, trim | — |
| company | String | no | "" | max:100 | — |
| email | String | yes | — | lowercase, trim | compound(freelancerId+email) unique |
| phone | String | no | "" | — | — |
| notes | String | no | "" | max:500 | — |
| status | String | yes | "Active" | enum:[Active, Archived] | indexed |
| timestamps | auto | — | — | createdAt, updatedAt | — |

### Entity: InviteToken
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| clientId | ObjectId | yes | — | ref:Client | indexed |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| token | String | yes | — | unique (hashed) | unique |
| expiresAt | Date | yes | — | 48 hours from creation | TTL |
| status | String | yes | "Active" | enum:[Active, Expired, Redeemed] | — |
| timestamps | auto | — | — | createdAt | — |

### Entity: Project
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| clientId | ObjectId | yes | — | ref:Client | indexed |
| name | String | yes | — | min:2, max:100, trim | — |
| description | String | no | "" | max:500 | — |
| status | String | yes | "Draft" | enum:[Active, Draft, OnHold, Completed, Archived] | indexed |
| startDate | Date | no | null | — | — |
| deadline | Date | no | null | must be > startDate | — |
| budget | Decimal128 | no | null | min:0 | — |
| hourlyRate | Decimal128 | no | null | min:0 | — |
| timestamps | auto | — | — | createdAt, updatedAt | — |

### Entity: TimeLog
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| projectId | ObjectId | yes | — | ref:Project | indexed |
| date | Date | yes | — | cannot be future | — |
| hours | Number | yes | — | min:0, max:23, integer | — |
| minutes | Number | yes | — | min:0, max:59, integer | — |
| description | String | no | "" | max:500 | — |
| status | String | yes | "Active" | enum:[Active, Locked] | indexed |
| invoiceId | ObjectId | no | null | ref:Invoice — set when locked | — |
| timestamps | auto | — | — | createdAt, updatedAt | — |

### Entity: Invoice
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| clientId | ObjectId | yes | — | ref:Client | indexed |
| projectId | ObjectId | no | null | ref:Project | indexed |
| invoiceNumber | String | yes | — | unique per freelancer: compound(freelancerId+invoiceNumber) | compound unique |
| status | String | yes | "Draft" | enum:[Draft, Sent, Viewed, PartiallyPaid, Paid, Overdue] | indexed |
| issueDate | Date | yes | — | — | — |
| dueDate | Date | yes | — | must be after issueDate | indexed |
| taxPercent | Decimal128 | yes | 0 | min:0, max:100 | — |
| subtotal | Decimal128 | yes | 0 | computed server-side | — |
| totalAmount | Decimal128 | yes | 0 | computed: subtotal*(1+tax/100) | — |
| notes | String | no | "" | max:1000 | — |
| timestamps | auto | — | — | createdAt, updatedAt | — |

### Entity: InvoiceLineItem
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| invoiceId | ObjectId | yes | — | ref:Invoice | indexed |
| description | String | yes | — | min:1, max:200, trim | — |
| quantity | Decimal128 | yes | — | min:0.01 | — |
| rate | Decimal128 | yes | — | min:0 | — |
| total | Decimal128 | yes | — | computed: quantity*rate, server-side | — |

### Entity: PaymentLedger
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| invoiceId | ObjectId | yes | — | ref:Invoice | indexed |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| amount | Decimal128 | yes | — | min:0.01 | — |
| method | String | yes | "manual" | enum:[manual, bank_transfer, cash, cheque] | — |
| notes | String | no | "" | max:500 | — |
| recordedAt | Date | yes | — | immutable, set at creation only | — |
| recordedBy | String | yes | "freelancer" | enum:[freelancer, system] | — |

**Note:** PaymentLedger has NO updateOne / findByIdAndUpdate operations — append-only enforced at service layer.

### Entity: AuditLog
| Field | Type | Required | Default | Constraints | Index |
|-------|------|----------|---------|-------------|-------|
| _id | ObjectId | auto | — | — | primary |
| freelancerId | ObjectId | yes | — | ref:User | indexed |
| entityType | String | yes | — | enum:[Invoice, Payment, Client, TimeLog, InviteToken] | indexed |
| entityId | String | yes | — | — | — |
| action | String | yes | — | e.g., INVOICE_SENT, PAYMENT_RECORDED, CLIENT_INVITED, INVOICE_VIEWED | — |
| performedBy | ObjectId | yes | — | ref:User | — |
| metadata | Mixed | no | {} | additional context JSON | — |
| createdAt | Date | yes | — | immutable, auto-set | TTL (optional, 2 years) |

**Note:** AuditLog has NO update or delete operations — immutable by design.

### Relationships
- User (freelancer) 1→N Client
- User (freelancer) 1→N Project
- Client 1→N Project
- User (freelancer) 1→N TimeLog
- Project 1→N TimeLog
- User (freelancer) 1→N Invoice
- Client 1→N Invoice
- Project 0→N Invoice
- Invoice 1→N InvoiceLineItem
- Invoice 1→N PaymentLedger
- Invoice 1→N AuditLog (via entityId)
- Client 1→N InviteToken
- Client 1→1 User (portal user, role=client)

---

## 6. Authentication & Authorization Model

- **Strategy:** JWT (short-lived access token) + Refresh Token rotation
- **Token location:** Authorization Header (Bearer token for access), request body for refresh
- **Access token expiry:** 15 minutes
- **Refresh token expiry:** 7 days (rotated on every refresh call)
- **Password hashing:** bcryptjs, salt rounds = 12
- **Token payload:**
  ```json
  { "userId": "string", "email": "string", "role": "freelancer|client", "clientId": "string (only for client role)", "freelancerId": "string (only for client role)" }
  ```

| Role | Permissions |
|------|------------|
| freelancer | Full CRUD on own clients, projects, time logs, invoices, payments. Read own audit logs, settings. |
| client | Read-only: own invoices (scoped to clientId + freelancerId), own projects. Cannot write anything. |

**Ownership Validation Pattern (enforced in every service):**
1. Fetch resource by ID
2. If not found → throw 404 "Not found"
3. If resource.freelancerId.toString() !== req.user.userId → throw 404 "Not found" (never 403)
4. Proceed with mutation

**Client Role Additional Check:**
If role === client: also enforce resource.clientId.toString() === req.user.clientId

---

## 7. Standardized API Response Format

**Success:**
```json
{ "success": true, "message": "Human-readable message", "data": { } }
```

**Error:**
```json
{ "success": false, "message": "Human-readable message", "error": "Technical detail (dev only, stripped in production)" }
```

**Rate Limit (429):**
```json
{ "success": false, "message": "Too many requests — please try again later" }
```

---

## 8. Non-Functional Design Decisions

| NFR | Approach | Package Used |
|-----|----------|-------------|
| Rate Limiting | IP-based limits per route group | express-rate-limit |
| NoSQL Injection Prevention | Strip $ and . from inputs | express-mongo-sanitize |
| XSS Prevention | Strip HTML/script from string inputs | xss-clean |
| Security Headers | helmet() as first middleware | helmet |
| Password Hashing | bcryptjs, 12 salt rounds | bcryptjs |
| Input Validation | Joi schema validation on all routes | joi |
| Logging | Console logger (upgradeable to winston) | built-in |
| Monetary Precision | MongoDB Decimal128 for all monetary values | mongoose Decimal128 |
| Overdue Detection | Scheduled check: cron job runs daily, updates invoices where dueDate < now AND status not in [Paid, Draft] | node-cron |
| PDF Generation | Server-side HTML-to-PDF | pdfkit |
| Email | SMTP via Nodemailer | nodemailer |
| CORS | Whitelist-based CORS with configurable origins | cors |
| Data Isolation | Every query includes freelancerId filter at service layer | enforced in every service function |
| Audit Immutability | AuditLog model has no update/delete operations | enforced at service layer |

**Rate Limit Configuration:**
| Route Group | Max Requests | Window | Response |
|-------------|-------------|--------|----------|
| POST /api/auth/login | 10 | 15 minutes per IP | 429 |
| POST /api/auth/register | 5 | 1 hour per IP | 429 |
| All other /api/auth/* | 10 | 15 minutes per IP | 429 |
| All other API routes | 100 | 15 minutes per IP | 429 |

---

## 9. Engineering Assumptions

| ID | Assumption | Affects | Risk |
|----|------------|---------|------|
| EA-01 | Single currency (USD) — all monetary values stored as Decimal128 without currency code | Schema, frontend display | Future multi-currency would require migration |
| EA-02 | Invoice number format: INV-[sequential per freelancer] — stored as string, generated server-side | invoiceService, Invoice schema | Collision under concurrent requests — mitigated by compound unique index |
| EA-03 | Progress % on projects is manually calculated from (hours logged / budget * hourlyRate) if hourlyRate and budget are set, else 0 | projectService, ProjectDetailPage | If no rate/budget set, progress bar always shows 0 |
| EA-04 | Email verification is required before login is allowed (AC3 US-001) | authService.loginUser() | Unverified users get 403 not 401 |
| EA-05 | Refresh tokens are stored hashed (SHA-256) in the database, raw value returned to client | RefreshToken model, authService | If DB is compromised, tokens cannot be recovered |
| EA-06 | Overdue detection runs as a cron job at 00:05 UTC daily — not real-time | invoiceService, server.js | Invoices may show incorrect status for up to 24 hours |
| EA-07 | PDF generation uses pdfkit (no headless browser) — layout is programmatic, not pixel-perfect from React | invoiceService.generatePDF() | PDF appearance differs from UI rendering |
| EA-08 | Payment methods are enum-limited (manual, bank_transfer, cash, cheque) — no payment gateway integration | PaymentLedger model | Out of scope per pm-output.md Section 11 |
| EA-09 | Client portal user is a separate User record (role=client) linked to a Client document via clientId field | User model, authService.acceptClientInvite() | Requires careful cleanup if client is archived |
| EA-10 | Q1 (invoice numbering scope) from pm-output.md: sequential per freelancer, not global | invoiceService | Resolved as EA-02 |
| EA-11 | Q2 (duplicate client email): same email is allowed across different freelancers (unique only within freelancer scope) | Client schema, compound index | Resolved by compound unique index on (freelancerId + email) |
| EA-12 | Tax computation (Q3) is a simple flat percentage applied to subtotal — no per-line-item tax | Invoice schema, invoiceService | Acceptable for MVP |

---

## 10. Blocked Items

No stories are tagged [PENDING]. No blocked items.

---

## 11. Traceability Matrix

| Component | Function | User Story ID | BA AC Reference |
|-----------|----------|---------------|-----------------|
| authService.registerUser | POST /api/auth/register | US-001 | AC1, AC2, AC3 |
| authService.loginUser | POST /api/auth/login | US-002 | Session management |
| authService.refreshTokens | POST /api/auth/refresh | US-002 | Refresh rotation rule |
| clientService.createClient | POST /api/clients | US-004 | AC1, AC2 |
| clientService.inviteClient | POST /api/clients/:id/invite | US-005 | Token 48h, AuditLog |
| portalService.getClientInvoiceById | GET /api/portal/invoices/:id | US-006, US-011 | Scope enforcement, Viewed status |
| projectService.archiveProject | PATCH /api/projects/:id/archive | US-007 | No delete rule |
| timeLogService.updateTimeLog | PUT /api/time-logs/:id | US-008 | Lock rule BR-03 |
| invoiceService.createInvoice | POST /api/invoices | US-009 | BR-07 computed totals |
| invoiceService.sendInvoice | PATCH /api/invoices/:id/send | US-010 | BR-01, BR-03, AuditLog |
| paymentService.recordPayment | POST /api/invoices/:id/payments | US-012, US-013 | BR-02, BR-04 |
| invoiceService.generatePDF | GET /api/invoices/:id/pdf | US-014 | Line items + payments |
| dashboardService.getMetrics | GET /api/dashboard | US-015 | freelancerId isolation |
| auditService.getAuditLogs | GET /api/audit-logs | BA 3.3 | Immutability |