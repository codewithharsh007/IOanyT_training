# Test Strategy and Test Plan

## 1. Document Metadata
- **Version:** 1.0
- **Date:** April 29, 2026
- **Author:** QA Engineer
- **Input Sources:** ba-output.md (v2.0), ux-output.md (v2.0), eng-output.md (v1.0)
- **Total Test Cases:** 298
- **Automation Candidates:** 201

---

## 2. Test Strategy Overview
- **Testing Approach:** Risk-based with full coverage on auth, financial immutability, state machines, and data isolation — these are the highest-risk areas in a financial workflow system
- **Test Levels:** Unit (service layer), Integration (API endpoints), System (full user flows), Regression (after every deployment)
- **Test Types in Scope:** Functional, UI Validation, API Contract, Data Validation, Edge Case, Security, Performance

**Out of Scope:**
| Item | Reason |
|------|--------|
| Payment gateway live transactions (Stripe/Razorpay) | Integration with live payment rails is out of current scope per ba-output.md Q3 |
| Multi-currency calculations | ba-output.md Assumption A1: single base currency only |
| Accessibility (WCAG) testing | Not specified in pm-output.md or ux-output.md |
| Load testing beyond 200 concurrent users | Infrastructure provisioning not defined in pm-output.md |
| Email delivery verification | ba-output.md Assumption A2: email delivery assumed reliable; no email provider defined |

---

## 3. Entry & Exit Criteria

### Entry Criteria
| Phase | Entry Criteria |
|-------|----------------|
| Unit Testing | Service layer files generated; models and constants finalized |
| Integration Testing | All API routes registered in app.js; DB connected to test instance; .env.example fully populated |
| System Testing | Frontend deployed to staging; backend deployed to staging; all auth flows working end-to-end |
| Security Testing | All middleware registered (helmet, mongoSanitize, xssClean, rateLimiter, protect); ownership checks in all service functions |
| Performance Testing | Staging DB seeded with ≥ 10,000 records per entity; Artillery/k6 installed |
| Regression Testing | A code change is merged to main; CI pipeline triggered |

### Exit Criteria
| Phase | Exit Criteria | Quality Gate |
|-------|---------------|--------------|
| Unit Testing | 100% of service functions have passing unit tests; 0 critical failures | ≥ 90% line coverage on /services/ |
| Integration Testing | All API endpoints return documented status codes; 0 unauthorized data leaks | 100% of BOLA tests pass |
| System Testing | All 19 user flows complete end-to-end without errors | 0 High or Critical open defects |
| Security Testing | All auth attacks return 401; all BOLA attacks return 404; rate limiting triggers at documented thresholds | 0 Critical security defects |
| Performance Testing | All P1 endpoints respond within documented benchmarks under load | 0 endpoints exceeding 2× their benchmark under 100 concurrent users |
| Regression Testing | No previously passing test has regressed | 0 new failures introduced by the change |

---

## 4. Functional Test Cases

### Epic E1: Authentication & Security

#### TC-001: Successful user registration with valid credentials
- **Mapped Story:** US-001
- **Mapped AC:** AC1, AC2
- **Mapped Screen:** S-002 (Sign Up Card)
- **Test Type:** Functional
- **Preconditions:** No user with email `testuser@example.com` exists in the database
- **Test Steps:**
  1. POST `/api/auth/register` with body `{ "name": "Test User", "email": "testuser@example.com", "password": "SecurePass123!" }`
  2. Check HTTP response status
  3. Query the User collection for the registered email
- **Expected Result:** HTTP 201; response body `{ "success": true, "message": "Registration successful. Please verify your email.", "data": { "userId": "<string>", "name": "Test User", "email": "testuser@example.com" } }`; database record has `passwordHash` field that does NOT equal `"SecurePass123!"`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-002: Registration rejected for duplicate email
- **Mapped Story:** US-001
- **Mapped AC:** AC1
- **Mapped Screen:** S-002
- **Test Type:** Functional (Negative)
- **Preconditions:** User with email `existing@example.com` already exists in the database
- **Test Steps:**
  1. POST `/api/auth/register` with body `{ "name": "Another User", "email": "existing@example.com", "password": "SecurePass123!" }`
- **Expected Result:** HTTP 409; response body `{ "success": false, "message": "Email already registered" }`; no new User document created in the database
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-003: Registration rejected for missing name field
- **Mapped Story:** US-001
- **Mapped AC:** AC1
- **Mapped Screen:** S-002
- **Test Type:** Functional (Negative)
- **Preconditions:** None
- **Test Steps:**
  1. POST `/api/auth/register` with body `{ "email": "newuser@example.com", "password": "SecurePass123!" }` (name field omitted)
- **Expected Result:** HTTP 400; response body `{ "success": false, "message": "<field-level error indicating name is required>" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-004: Registration rejected for invalid email format
- **Mapped Story:** US-001
- **Mapped AC:** AC1
- **Mapped Screen:** S-002
- **Test Type:** Functional (Negative)
- **Preconditions:** None
- **Test Steps:**
  1. POST `/api/auth/register` with body `{ "name": "Test User", "email": "notanemail", "password": "SecurePass123!" }`
- **Expected Result:** HTTP 400; response body `{ "success": false, "message": "<error indicating invalid email format>" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-005: Unverified user cannot log in
- **Mapped Story:** US-001
- **Mapped AC:** AC3
- **Mapped Screen:** S-002 (Login Card)
- **Test Type:** Functional (Negative)
- **Preconditions:** User registered with `unverified@example.com` but email NOT yet verified (status = unverified)
- **Test Steps:**
  1. POST `/api/auth/login` with body `{ "email": "unverified@example.com", "password": "SecurePass123!" }`
- **Expected Result:** HTTP 403; response body `{ "success": false, "message": "Please verify your email before logging in" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-006: Successful login returns JWT and refresh token
- **Mapped Story:** US-002
- **Mapped AC:** US-002 Rules
- **Mapped Screen:** S-002 (Login Card)
- **Test Type:** Functional
- **Preconditions:** Verified user exists with email `verified@example.com` and password `SecurePass123!`
- **Test Steps:**
  1. POST `/api/auth/login` with body `{ "email": "verified@example.com", "password": "SecurePass123!" }`
  2. Inspect response body
- **Expected Result:** HTTP 200; response contains `{ "success": true, "data": { "token": "<JWT string>", "refreshToken": "<string>", "user": { "userId": "<id>", "name": "<string>", "email": "verified@example.com", "role": "freelancer" } } }`; JWT expiry is approximately 15 minutes from issue time
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-007: Login with wrong password returns 401
- **Mapped Story:** US-002
- **Mapped AC:** US-002 Rules
- **Mapped Screen:** S-002
- **Test Type:** Functional (Negative)
- **Preconditions:** Verified user exists with email `verified@example.com`
- **Test Steps:**
  1. POST `/api/auth/login` with body `{ "email": "verified@example.com", "password": "WrongPassword99!" }`
- **Expected Result:** HTTP 401; `{ "success": false, "message": "Invalid credentials" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-008: Refresh token rotation — new token issued and old invalidated
- **Mapped Story:** US-002
- **Mapped AC:** US-002 Rules — "Token refresh invalidates previous refresh token"
- **Mapped Screen:** N/A (API-level)
- **Test Type:** Functional
- **Preconditions:** Logged-in user holds a valid `refreshToken` value `RT-ORIGINAL`
- **Test Steps:**
  1. POST `/api/auth/refresh` with body `{ "refreshToken": "RT-ORIGINAL" }`
  2. Record the new `refreshToken` returned (call it `RT-NEW`)
  3. POST `/api/auth/refresh` again with body `{ "refreshToken": "RT-ORIGINAL" }`
- **Expected Result:** Step 1 returns HTTP 200 with new `token` and new `refreshToken` (`RT-NEW`); Step 3 returns HTTP 401 `{ "success": false, "message": "Invalid or expired refresh token" }` — `RT-ORIGINAL` is now invalidated
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-009: Logout invalidates refresh token
- **Mapped Story:** US-002
- **Mapped AC:** US-002 Rules
- **Mapped Screen:** N/A
- **Test Type:** Functional
- **Preconditions:** Logged-in user holds valid `refreshToken = RT-VALID`
- **Test Steps:**
  1. POST `/api/auth/logout` with header `Authorization: Bearer <accessToken>` and body `{ "refreshToken": "RT-VALID" }`
  2. POST `/api/auth/refresh` with body `{ "refreshToken": "RT-VALID" }`
- **Expected Result:** Step 1 returns HTTP 200 `{ "success": true, "message": "Logged out successfully" }`; Step 2 returns HTTP 401 — the token is no longer valid
- **Automation Candidate:** Yes
- **Priority:** High

---

### Epic E2: Client Management

#### TC-010: Freelancer creates a client successfully
- **Mapped Story:** US-004
- **Mapped AC:** AC1 — client bound to freelancerId
- **Mapped Screen:** S-004 (Clients List — ClientAddEditModal)
- **Test Type:** Functional
- **Preconditions:** Authenticated as freelancer with userId `F-001`
- **Test Steps:**
  1. POST `/api/clients` with header `Authorization: Bearer <F-001-token>` and body `{ "name": "Acme Corp", "company": "Acme", "email": "acme@corp.com", "phone": "+911234567890" }`
- **Expected Result:** HTTP 201; response `{ "success": true, "data": { "_id": "<id>", "name": "Acme Corp", "freelancerId": "F-001", "status": "Active" } }`; database document has `freelancerId = F-001`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-011: Client creation without auth token fails
- **Mapped Story:** US-004
- **Mapped AC:** AC1
- **Mapped Screen:** S-004
- **Test Type:** Functional (Auth)
- **Preconditions:** None
- **Test Steps:**
  1. POST `/api/clients` with no Authorization header, body `{ "name": "Ghost Corp", "email": "ghost@corp.com" }`
- **Expected Result:** HTTP 401 `{ "success": false, "message": "No token provided" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-012: Same client email allowed for different freelancers
- **Mapped Story:** US-004
- **Mapped AC:** AC2 — duplicate email allowed across different freelancers
- **Mapped Screen:** S-004
- **Test Type:** Functional
- **Preconditions:** Freelancer F-001 has client with `email: shared@client.com`; Freelancer F-002 has no clients
- **Test Steps:**
  1. POST `/api/clients` as F-002 with body `{ "name": "Shared Client", "email": "shared@client.com" }`
- **Expected Result:** HTTP 201; second client created successfully under F-002's scope; no conflict returned
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-013: Client invitation generates token and audit log entry
- **Mapped Story:** US-005
- **Mapped AC:** US-005 Rules — invitation must generate AuditLog
- **Mapped Screen:** S-004 (Row Action Dropdown → Invite)
- **Test Type:** Functional
- **Preconditions:** Freelancer F-001 has client C-001 with status Active
- **Test Steps:**
  1. POST `/api/clients/C-001/invite` with `Authorization: Bearer <F-001-token>`
  2. Query AuditLog collection for entityId = C-001 and action = "CLIENT_INVITED"
  3. Query InviteToken collection for clientId = C-001
- **Expected Result:** HTTP 201; AuditLog entry exists with `{ entityType: "Client", entityId: "C-001", action: "CLIENT_INVITED" }`; InviteToken document has `expiresAt` approximately 48 hours from now and `status: "Active"`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-014: Expired invite token cannot be redeemed
- **Mapped Story:** US-005
- **Mapped AC:** US-005 Rules — "Redeemed tokens cannot be reused"
- **Mapped Screen:** N/A (portal accept flow)
- **Test Type:** Functional (Negative)
- **Preconditions:** InviteToken `TK-EXPIRED` exists with `expiresAt` = 2 days ago, `status: "Active"`
- **Test Steps:**
  1. POST `/api/auth/client-portal/accept` with body `{ "token": "TK-EXPIRED", "password": "NewPass123!" }`
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Invite token is expired or invalid" }`; no User record created
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-015: Redeemed invite token cannot be reused
- **Mapped Story:** US-005
- **Mapped AC:** US-005 Rules
- **Mapped Screen:** N/A
- **Test Type:** Functional (Negative)
- **Preconditions:** InviteToken `TK-USED` exists with `status: "Redeemed"`
- **Test Steps:**
  1. POST `/api/auth/client-portal/accept` with body `{ "token": "TK-USED", "password": "AnotherPass123!" }`
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Invite token is expired or invalid" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-016: Client portal user cannot access another freelancer's invoices
- **Mapped Story:** US-006
- **Mapped AC:** US-006 Enforcement Rule — clientId AND freelancerId must match session
- **Mapped Screen:** N/A (portal API)
- **Test Type:** Functional (Security)
- **Preconditions:** Client C-001 belongs to Freelancer F-001; Client C-002 belongs to Freelancer F-002; C-001 has portal JWT `PORTAL-TOKEN-C001`
- **Test Steps:**
  1. GET `/api/portal/invoices` with `Authorization: Bearer PORTAL-TOKEN-C001`
  2. Inspect invoice array in response
- **Expected Result:** HTTP 200; response contains ONLY invoices where `clientId = C-001 AND freelancerId = F-001`; no invoices from F-002 or any other freelancer appear in the array
- **Automation Candidate:** Yes
- **Priority:** High

---

### Epic E3: Project & Time Tracking

#### TC-017: Active project can be archived but not deleted
- **Mapped Story:** US-007
- **Mapped AC:** US-007 Rules — "Projects cannot be deleted"
- **Mapped Screen:** S-005 (Projects List — ProjectCard action)
- **Test Type:** Functional
- **Preconditions:** Freelancer F-001 has project P-001 with status `Active`
- **Test Steps:**
  1. PATCH `/api/projects/P-001/archive` with `Authorization: Bearer <F-001-token>`
  2. Attempt DELETE `/api/projects/P-001` with same token
- **Expected Result:** Step 1: HTTP 200 `{ "success": true, "data": { "_id": "P-001", "status": "Archived" } }`; Step 2: HTTP 404 (route does not exist) or HTTP 405 Method Not Allowed — no DELETE endpoint is defined for projects
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-018: Archived project is read-only — update rejected
- **Mapped Story:** US-007
- **Mapped AC:** US-007 Rules — "Archived projects become read-only"
- **Mapped Screen:** S-005
- **Test Type:** Functional (Negative)
- **Preconditions:** Project P-001 has status `Archived`
- **Test Steps:**
  1. PUT `/api/projects/P-001` with body `{ "name": "Modified Name" }` and valid token
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Archived projects are read-only and cannot be modified" }`; project name in DB unchanged
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-019: Time log successfully created and is Active by default
- **Mapped Story:** US-008
- **Mapped AC:** US-008 Constraints
- **Mapped Screen:** S-009 (Time Logs — TimeLogModal)
- **Test Type:** Functional
- **Preconditions:** Project P-001 is Active; Freelancer F-001 authenticated
- **Test Steps:**
  1. POST `/api/time-logs` with body `{ "projectId": "P-001", "date": "2026-04-28", "hours": 3, "minutes": 30, "description": "UI work" }` and valid F-001 token
- **Expected Result:** HTTP 201; response `{ "success": true, "data": { "_id": "<id>", "status": "Active", "projectId": "P-001", "hours": 3, "minutes": 30 } }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-020: Locked time log cannot be edited
- **Mapped Story:** US-008
- **Mapped AC:** US-008 Constraints — "Time logs cannot be edited once locked"
- **Mapped Screen:** S-009
- **Test Type:** Functional (Negative)
- **Preconditions:** TimeLog TL-001 has status `Locked` (it was included in a Sent invoice)
- **Test Steps:**
  1. PUT `/api/time-logs/TL-001` with body `{ "hours": 5 }` and valid F-001 token
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Locked time logs cannot be modified" }`; hours field in DB unchanged
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-021: Locked time log cannot be deleted
- **Mapped Story:** US-008
- **Mapped AC:** US-008 Constraints
- **Mapped Screen:** S-009
- **Test Type:** Functional (Negative)
- **Preconditions:** TimeLog TL-001 has status `Locked`
- **Test Steps:**
  1. DELETE `/api/time-logs/TL-001` with valid F-001 token
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Locked time logs cannot be deleted" }`; TL-001 still exists in DB
- **Automation Candidate:** Yes
- **Priority:** High

---

### Epic E4: Invoice & Payment Engine

#### TC-022: Draft invoice created with computed total
- **Mapped Story:** US-009
- **Mapped AC:** BA Rule — total derived from sum(lineItems)
- **Mapped Screen:** S-007 (Invoices — InvoiceCreateModal)
- **Test Type:** Functional
- **Preconditions:** Client C-001 exists; Project P-001 exists; F-001 authenticated
- **Test Steps:**
  1. POST `/api/invoices` with body `{ "clientId": "C-001", "projectId": "P-001", "issueDate": "2026-04-29", "dueDate": "2026-05-29", "lineItems": [{ "description": "Design work", "quantity": 10, "rate": 50 }, { "description": "Dev work", "quantity": 5, "rate": 100 }], "taxPercent": 10 }`
  2. Check `totalAmount` in response
- **Expected Result:** HTTP 201; `totalAmount = (10×50 + 5×100) × 1.10 = (500 + 500) × 1.10 = 1100.00`; `status = "Draft"` in response body
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-023: Cannot manually override total on a Sent invoice
- **Mapped Story:** US-009
- **Mapped AC:** BR-07 — totals are computed, never manually set
- **Mapped Screen:** S-008
- **Test Type:** Functional (Negative)
- **Preconditions:** Invoice INV-001 has status `Sent`
- **Test Steps:**
  1. PUT `/api/invoices/INV-001` with body `{ "totalAmount": 9999.99 }` and valid token
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Sent invoices are immutable" }`; totalAmount in DB unchanged
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-024: Sending an invoice locks associated time logs and creates audit log
- **Mapped Story:** US-010
- **Mapped AC:** US-010 Rules — TimeLog locking, AuditLog entry, status = Sent
- **Mapped Screen:** S-008
- **Test Type:** Functional
- **Preconditions:** Invoice INV-DRAFT has status `Draft`; it references TimeLogs TL-001, TL-002 (both `Active`); F-001 authenticated
- **Test Steps:**
  1. PATCH `/api/invoices/INV-DRAFT/send` with valid F-001 token
  2. Query TimeLog collection for TL-001 and TL-002
  3. Query AuditLog for entityId = INV-DRAFT
- **Expected Result:** HTTP 200 `{ "success": true, "data": { "status": "Sent" } }`; TL-001.status = `Locked`; TL-002.status = `Locked`; AuditLog has entry `{ action: "INVOICE_SENT", entityId: "INV-DRAFT" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-025: Line items cannot be edited on a Sent invoice
- **Mapped Story:** US-010
- **Mapped AC:** BR-01 — Invoice immutable after Sent
- **Mapped Screen:** S-008
- **Test Type:** Functional (Negative)
- **Preconditions:** Invoice INV-001 has status `Sent`
- **Test Steps:**
  1. PUT `/api/invoices/INV-001` with body `{ "lineItems": [{ "description": "Changed", "quantity": 1, "rate": 1 }] }` and valid token
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Sent invoices are immutable" }`; lineItems in DB unchanged
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-026: First client portal view of invoice transitions status to Viewed and creates audit log
- **Mapped Story:** US-011
- **Mapped AC:** US-011 Rule
- **Mapped Screen:** S-008 (client portal view)
- **Test Type:** Functional
- **Preconditions:** Invoice INV-001 has status `Sent`; client C-001 has portal JWT
- **Test Steps:**
  1. GET `/api/portal/invoices/INV-001` with portal JWT for C-001
  2. Query Invoice collection for INV-001.status
  3. Query AuditLog for entityId = INV-001 and action = "INVOICE_VIEWED"
- **Expected Result:** HTTP 200 with full invoice data; INV-001.status = `Viewed`; AuditLog entry exists with `{ action: "INVOICE_VIEWED", entityId: "INV-001", performedBy: "C-001" }`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-027: Payment appended to ledger and invoice transitions to PartiallyPaid
- **Mapped Story:** US-012, US-013
- **Mapped AC:** US-012 Payment Rules; US-013 State Transition Rules
- **Mapped Screen:** S-008
- **Test Type:** Functional
- **Preconditions:** Invoice INV-001 has totalAmount = $1000.00, status = `Viewed`, no payments yet
- **Test Steps:**
  1. POST `/api/invoices/INV-001/payments` with body `{ "amount": 400 }` and F-001 token
  2. Query PaymentLedger for invoiceId = INV-001
  3. Query Invoice for INV-001.status
- **Expected Result:** HTTP 201; PaymentLedger has new document `{ invoiceId: "INV-001", amount: 400 }`; INV-001.status = `PartiallyPaid`; AuditLog entry exists for the payment
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-028: Payment that reaches exactly 100% transitions invoice to Paid
- **Mapped Story:** US-013
- **Mapped AC:** US-013 — "If sum(payments) == invoice.total → Paid"
- **Mapped Screen:** S-008
- **Test Type:** Functional
- **Preconditions:** Invoice INV-001 totalAmount = $1000.00; existing payment of $600.00; status = `PartiallyPaid`
- **Test Steps:**
  1. POST `/api/invoices/INV-001/payments` with body `{ "amount": 400 }` and F-001 token
  2. Query Invoice for INV-001.status
- **Expected Result:** HTTP 201; INV-001.status = `Paid`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-029: Overpayment is blocked
- **Mapped Story:** US-012
- **Mapped AC:** BR-04 — overpayment strictly forbidden
- **Mapped Screen:** S-008
- **Test Type:** Functional (Negative)
- **Preconditions:** Invoice INV-001 totalAmount = $1000.00; existing payment of $900.00; status = `PartiallyPaid`
- **Test Steps:**
  1. POST `/api/invoices/INV-001/payments` with body `{ "amount": 200 }` — which would bring total to $1100.00
- **Expected Result:** HTTP 400 `{ "success": false, "message": "Payment would exceed invoice total. Maximum allowed: $100.00" }`; no PaymentLedger record created; INV-001 status unchanged
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-030: Payment cannot be updated after creation
- **Mapped Story:** US-012
- **Mapped AC:** BR-02 — payments are append-only
- **Mapped Screen:** N/A (API-level)
- **Test Type:** Functional (Negative)
- **Preconditions:** PaymentLedger record PL-001 exists
- **Test Steps:**
  1. PUT `/api/invoices/INV-001/payments/PL-001` with body `{ "amount": 9999 }` and valid token
- **Expected Result:** HTTP 404 (no PUT route exists for payments) or HTTP 405 Method Not Allowed; PL-001.amount unchanged in DB
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-031: Payment cannot be deleted
- **Mapped Story:** US-012
- **Mapped AC:** BR-02 — payments are append-only
- **Mapped Screen:** N/A
- **Test Type:** Functional (Negative)
- **Preconditions:** PaymentLedger record PL-001 exists
- **Test Steps:**
  1. DELETE `/api/invoices/INV-001/payments/PL-001` with valid token
- **Expected Result:** HTTP 404 or HTTP 405; PL-001 still exists in DB
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-032: Overdue status set when dueDate is past and invoice is unpaid
- **Mapped Story:** US-013
- **Mapped AC:** US-013 — "If dueDate < today AND unpaid → Overdue"
- **Mapped Screen:** S-007, S-008
- **Test Type:** Functional
- **Preconditions:** Invoice INV-001 dueDate = yesterday's date; status = `Sent`; sum(payments) = $0
- **Test Steps:**
  1. Trigger the overdue check (either via a scheduled job call or GET `/api/invoices/INV-001`)
  2. Query INV-001.status
- **Expected Result:** INV-001.status = `Overdue`
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-033: PDF download returns a valid PDF binary for a Sent or Paid invoice
- **Mapped Story:** US-014
- **Mapped AC:** US-014 Rules — PDF reflects final computed state including payments
- **Mapped Screen:** S-008 (DownloadPDFButton)
- **Test Type:** Functional
- **Preconditions:** Invoice INV-001 has status `Paid`, has line items and at least one payment in PaymentLedger
- **Test Steps:**
  1. GET `/api/invoices/INV-001/pdf` with valid F-001 token
  2. Check Content-Type header and body
- **Expected Result:** HTTP 200; `Content-Type: application/pdf`; response body is binary PDF data; file is not empty (size > 0)
- **Automation Candidate:** Yes
- **Priority:** High

---

### Epic E5: Dashboard & Analytics

#### TC-034: Dashboard metrics respect freelancerId isolation
- **Mapped Story:** US-015
- **Mapped AC:** US-015 Constraint — data must respect freelancerId isolation
- **Mapped Screen:** S-003 (Dashboard)
- **Test Type:** Functional
- **Preconditions:** Freelancer F-001 has 3 active projects, 2 overdue invoices, total revenue $2000; Freelancer F-002 has 10 active projects, 5 overdue invoices, total revenue $50000
- **Test Steps:**
  1. GET `/api/dashboard` with F-001 token
- **Expected Result:** HTTP 200; response shows `{ activeProjects: 3, overdueInvoices: 2, totalRevenue: 2000 }`; no data from F-002 appears
- **Automation Candidate:** Yes
- **Priority:** High

---

#### TC-035: Client portal dashboard shows only own data
- **Mapped Story:** US-016
- **Mapped AC:** US-016 — invoice list, payment status, project summaries for that client only
- **Mapped Screen:** S-003 (client portal)
- **Test Type:** Functional
- **Preconditions:** Client C-001 has 2 invoices and 1 project; Client C-002 (different freelancer) has 5 invoices; C-001 holds portal JWT
- **Test Steps:**
  1. GET `/api/portal/invoices` with C-001 portal JWT
  2. GET `/api/portal/projects` with C-001 portal JWT
- **Expected Result:** Invoice array has exactly 2 entries, all with `clientId = C-001`; project array has exactly 1 entry; no data from C-002 present
- **Automation Candidate:** Yes
- **Priority:** High

---

## 5. UI Validation Test Cases

### Screen: S-001 — Landing Page

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-001 | Top Navigation Bar | default (desktop) | Page loads | Logo on left, "Features" and "Pricing" links centered, "Log In" blue button on right | All three elements visible and positioned correctly |
| TC-UI-002 | Top Navigation Bar | mobile | Viewport width < 768px | Logo on left, hamburger icon on right; nav links hidden | Hamburger visible; links not visible |
| TC-UI-003 | CTA Button | default | Page loads | "Start managing better" white text on blue background, rounded, left-aligned | Button visible; color matches Primary Blue token |
| TC-UI-004 | CTA Button | hover | Mouse over button | Background darkens slightly | Background color changes on hover |
| TC-UI-005 | Feature Cards Row | default (desktop) | Page loads | Three equal-width cards in one row with icon, heading, subtext | Three cards visible side by side |
| TC-UI-006 | Feature Cards Row | mobile | Viewport < 768px | Cards stack vertically, each full width | Three stacked cards, no horizontal overflow |
| TC-UI-007 | Hero Mockup Image | default | Page loads | Laptop mockup visible on right half of hero | Image renders; no broken image icon |

### Design Token Validation — S-001
| TC ID | Token | Expected Value | Where Applied |
|-------|-------|----------------|---------------|
| TC-UI-008 | Primary Blue | Medium bright blue (not dark, not neon) | "Log In" button, CTA button |
| TC-UI-009 | Page Background | Very light cool gray | Page background behind hero and cards |
| TC-UI-010 | Dark Text | Near-black charcoal | Hero headline, feature card headings |

---

### Screen: S-002 — Login & Sign Up

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-011 | Login Card | default | Page loads | Email input, password input, "Forgot password?" link, "Log In" button, "Sign Up" link all visible | All elements rendered; correct layout |
| TC-UI-012 | Login Card — email field | focused | Click on email input | Field border highlights in blue | Blue border visible on focus |
| TC-UI-013 | Login Card — email field | error | Submit with empty email | Red border on field + error text below field | Error text visible; border red |
| TC-UI-014 | Password Input | masked (default) | Page loads | Password characters shown as dots | Text is masked |
| TC-UI-015 | Password Input | revealed | Click eye icon | Password text becomes visible | Plain text shown; eye icon changes to slash-eye |
| TC-UI-016 | Login Card — button | loading | Click "Log In" with valid fields | Button shows spinner; button is disabled | Spinner visible; no double-submit possible |
| TC-UI-017 | Login Card — button | default | Form fields empty | "Log In" button is active but shows validation error on click | Button not greyed out but error shows on submit |
| TC-UI-018 | Auth Branding Panel | desktop | Viewport ≥ 1024px | Left panel with gradient + logo + headline visible | Panel occupies left ~50% of screen |
| TC-UI-019 | Auth Branding Panel | mobile | Viewport < 768px | Left branding panel is hidden entirely | Only form cards visible; no left panel |
| TC-UI-020 | Sign Up Card | field error | Submit with mismatched/invalid data | Field-specific error messages below each invalid input | Error per field, not a generic banner |

---

### Screen: S-003 — Dashboard

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-021 | Sidebar Navigation | default (desktop) | Page loads authenticated | All nav items visible; "Dashboard" item has light blue background highlight | Active item visually distinguishable |
| TC-UI-022 | Sidebar Navigation | mobile | Viewport < 768px | Sidebar not visible | No sidebar occupying space |
| TC-UI-023 | EarningsBarChart | loading | Page loading | Skeleton gray blocks in place of chart bars | No layout shift; no blank white area |
| TC-UI-024 | EarningsBarChart | empty | No invoices paid this month | Chart renders with empty bars (0 height) or "No data" message | No crash; no broken chart |
| TC-UI-025 | EarningsBarChart | default | Data loaded | Blue bars for months with earnings; hover shows tooltip with exact amount | Bars rendered; hover tooltip appears |
| TC-UI-026 | OutstandingInvoicesCard | overdue state | invoices with Overdue status exist | Amber "Overdue" badge visible next to heading | Badge color matches Overdue Badge token |
| TC-UI-027 | RecentInvoicesTable | loading | API pending | Skeleton rows in table | Skeleton visible; column headers still shown |
| TC-UI-028 | RecentInvoicesTable | empty | No invoices exist | "No invoices yet" message in table area | Empty state message visible; no blank space |
| TC-UI-029 | Top Content Header Bar | default | Desktop | "My Projects" and "My Invoices" tab links; bell icon; avatar circle visible | All elements visible; active tab has blue underline |
| TC-UI-030 | MobileDrawer | open | Hamburger icon tapped | Full-screen nav drawer slides in from left | Drawer overlays content; all nav items accessible |

### Design Token Validation — S-003
| TC ID | Token | Expected Value | Where Applied |
|-------|-------|----------------|---------------|
| TC-UI-031 | Overdue Badge — Yellow/Amber | Warm yellow-amber background, dark amber text | Outstanding Invoices card badge |
| TC-UI-032 | Skeleton Gray | Muted light gray | All loading skeleton blocks |

---

### Screen: S-004 — Clients List

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-033 | Clients Table | loading | Page loads | Skeleton gray rows in table | Skeleton renders; headers visible |
| TC-UI-034 | Clients Table | empty | No clients exist | EmptyStateBlock: "Add your first client" + "Add Client" button | No blank white area; CTA visible |
| TC-UI-035 | Clients Table | default | Clients loaded | Rows with Name, Company, Email, Phone, Status, Actions columns | All columns visible; data populated |
| TC-UI-036 | Status Badge | Active | Client status = Active | Green badge with text "Active" | Green background; correct text |
| TC-UI-037 | Status Badge | Archived | Client status = Archived | Light pink badge with text "Archived" | Pink background; correct text |
| TC-UI-038 | Row Action Dropdown | open | Click "…" on a row | Dropdown opens with "Invite" (person icon) and "Archive" (red icon) | Dropdown visible; Archive in red/danger color |
| TC-UI-039 | Row Action Dropdown | closed | Click outside dropdown | Dropdown dismisses | Dropdown hidden |
| TC-UI-040 | Table Toolbar | active search | Type "Acme" in search | Table filters to rows matching "Acme" | Non-matching rows hidden |
| TC-UI-041 | ClientCardMobile | default | Viewport < 768px | Client name, company, email, phone, "…" menu visible | All fields on card; table not shown |
| TC-UI-042 | ClientAddEditModal | open | "Add Client" button clicked | Modal appears with empty form fields | Modal overlay renders; all fields empty |
| TC-UI-043 | ClientAddEditModal | edit mode | "Edit" action clicked | Modal opens with pre-filled client data | All fields populated with existing client data |

---

### Screen: S-005 — Projects List

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-044 | Project Card | Active | Project status = Active | Green "Active" badge; progress bar; deadline; invoice count; hours visible | All elements present |
| TC-UI-045 | Project Card | Draft | Project status = Draft | Gray "Draft" badge | Gray badge displayed |
| TC-UI-046 | Project Card | Archived | Project status = Archived | Pink "Archived" badge | Pink badge displayed |
| TC-UI-047 | Progress Bar | 50% | project.progressPercent = 50 | Blue bar filling exactly half the track | Bar width = 50% of container |
| TC-UI-048 | Filter Tab Bar | Active tab | Click "Draft" tab | Card grid re-filters to show only Draft projects | Only Draft cards visible |
| TC-UI-049 | Project Card Grid | loading | Page loading | Skeleton card blocks (3-column) displayed | Skeletons visible; no real cards yet |
| TC-UI-050 | Project Card Grid | empty | No projects exist | EmptyStateBlock with "Create Project" CTA | No blank area; CTA visible |

---

### Screen: S-007 — Invoices (Card Grid)

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-051 | Invoice Card | Overdue | invoice.status = Overdue | Amber badge with warning triangle icon (⚠️) in top-right | Badge color matches Overdue token; triangle visible |
| TC-UI-052 | Invoice Card | Draft | invoice.status = Draft | Light gray badge in top-right | Gray badge displayed |
| TC-UI-053 | Invoice Card | default | Cards loaded | Invoice number bold and large; client name; issue/due dates; total amount | All fields rendered |
| TC-UI-054 | Invoice Filter Tabs | "Sent" selected | Click "Sent" tab | Grid shows only invoices with status = Sent | Non-Sent invoices hidden |
| TC-UI-055 | Invoice Card Grid | loading | Page loading | Skeleton cards in 2×3 grid | Skeleton grid visible |
| TC-UI-056 | Invoice Card Grid | empty | No invoices | EmptyStateBlock with "Create Invoice" CTA | Empty state renders |

---

### Screen: S-008 — My Invoices (Table + Detail Panel)

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-057 | InvoiceListTable | default | Invoice loaded in list | Left panel shows rows with Invoice #, Client email, Client name | Table renders with correct columns |
| TC-UI-058 | InvoiceListTable | selected row | Click a row | Row highlighted; right panel loads that invoice's detail | Row visually selected; detail updates |
| TC-UI-059 | InvoiceDetailPanel | loading | Row clicked, API pending | Skeleton layout in right panel | Skeleton shows; no blank area |
| TC-UI-060 | InvoiceDetailPanel | Overdue | Selected invoice is Overdue | Amber badge with warning triangle in detail header | Badge and icon visible |
| TC-UI-061 | PaymentStatusSection | Viewed + Overdue | Invoice viewed and overdue | Two badges side by side: "Viewed" (gray-blue) and "Overdue" (amber) | Both badges visible |
| TC-UI-062 | DownloadPDFButton | loading | Button clicked | Button text changes to "Generating…" + spinner; button disabled | Spinner visible; no double-click possible |
| TC-UI-063 | InvoiceDetailPanel | empty (no invoice selected) | Page first loads | Right panel shows "Select an invoice to view details" placeholder | Placeholder text visible |

---

### Screen: S-009 — Time Logs

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-064 | EmptyStateBlock (clock) | empty | No time logs exist | Large clock illustration + "No Time Logs Yet" heading + "Log Time" button | All three elements visible and centered |
| TC-UI-065 | LoadingSkeleton (table) | loading | Page loading | Skeleton table rows visible | Skeleton shows; no real data yet |
| TC-UI-066 | Log Time Button | default | Page loaded | "Log Time" blue button in top-right of header | Button visible with correct color |
| TC-UI-067 | TimeLogModal | open | "Log Time" button clicked | Modal opens with project dropdown, date, hours, minutes, description fields | All fields visible; project dropdown populated |
| TC-UI-068 | TimeLogModal | locked log (edit attempt) | Edit row action on Locked log | Either "Edit" action is hidden/disabled OR modal opens read-only | Cannot save changes to a Locked log |

---

### Screen: S-010 — Settings

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-069 | ProfileSettingsCard | default | Page loads | Name, email (read-only), company fields populated from user data | Fields pre-filled; email field is disabled/read-only |
| TC-UI-070 | ToggleSwitch | on | Notification preference is enabled | Toggle pill is filled blue; positioned to right | Blue background; right position |
| TC-UI-071 | ToggleSwitch | off | Notification preference is disabled | Toggle pill is gray; positioned to left | Gray background; left position |
| TC-UI-072 | ToggleSwitch | auto-save | Toggle clicked | API call fired immediately; no save button needed | Network request sent on toggle; success toast shown |
| TC-UI-073 | ProfileSettingsCard | save loading | "Save" button clicked | Button shows spinner + disabled | Spinner visible; cannot double-submit |

---

### Screen: S-011 — 404 Not Found

| TC ID | Component | State | Input / Trigger | Expected UI Behavior | Pass Criteria |
|-------|-----------|-------|-----------------|----------------------|---------------|
| TC-UI-074 | NotFoundPage | default | Navigate to `/nonexistent-route` | "404" large stat number, descriptive message, "Go to Dashboard" button, "Contact Support" link visible | All elements rendered; no crash |
| TC-UI-075 | NotFoundPage | unauthenticated | Navigate to bad route without login | 404 page renders correctly (no redirect to login) | Page shows without auth redirect |

---

## 6. API Test Cases

### POST /api/auth/register

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-001 | Valid registration | `{ name: "Jane", email: "jane@test.com", password: "SecurePass1!" }` | 201 | `{ success: true, data: { userId, name, email } }` | None |
| TC-API-002 | Duplicate email | `{ name: "Jane2", email: "jane@test.com", password: "Pass123!" }` | 409 | `{ success: false, message: "Email already registered" }` | None |
| TC-API-003 | Missing password | `{ name: "Jane", email: "jane@test.com" }` | 400 | `{ success: false, message: "<password required>" }` | None |
| TC-API-004 | Password too short (< 8 chars) | `{ name: "Jane", email: "j@test.com", password: "abc" }` | 400 | `{ success: false, message: "<password min 8 chars>" }` | None |
| TC-API-005 | Rate limit hit on registration | 6 requests in 1 hour from same IP | 429 | `{ success: false, message: "Too many requests — please try again later" }` | None |

---

### POST /api/auth/login

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-006 | Valid credentials | `{ email: "jane@test.com", password: "SecurePass1!" }` | 200 | `{ success: true, data: { token, refreshToken, user } }` | None |
| TC-API-007 | Wrong password | `{ email: "jane@test.com", password: "wrong" }` | 401 | `{ success: false, message: "Invalid credentials" }` | None |
| TC-API-008 | Nonexistent email | `{ email: "ghost@test.com", password: "any" }` | 401 | `{ success: false, message: "Invalid credentials" }` | None |
| TC-API-009 | Unverified user | Valid creds for unverified account | 403 | `{ success: false, message: "Please verify your email" }` | None |
| TC-API-010 | Rate limit (11th attempt in 15 min) | 11 rapid login requests | 429 | `{ success: false, message: "Too many requests — please try again later" }` | None |

---

### POST /api/auth/refresh

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-011 | Valid refresh token | `{ refreshToken: "RT-VALID" }` | 200 | `{ success: true, data: { token, refreshToken } }` | None |
| TC-API-012 | Expired refresh token | `{ refreshToken: "RT-EXPIRED" }` | 401 | `{ success: false, message: "Invalid or expired refresh token" }` | None |
| TC-API-013 | Already-rotated (reused) token | `{ refreshToken: "RT-ALREADY-USED" }` | 401 | `{ success: false, message: "Invalid or expired refresh token" }` | None |
| TC-API-014 | Missing refresh token | `{}` | 401 | `{ success: false, message: "Refresh token required" }` | None |

---

### POST /api/clients

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-015 | Valid client creation | `{ name: "Acme", company: "Acme Ltd", email: "acme@test.com", phone: "+911234567890" }` | 201 | `{ success: true, data: { _id, name, freelancerId, status: "Active" } }` | Bearer (Freelancer) |
| TC-API-016 | Missing name field | `{ email: "acme@test.com" }` | 400 | `{ success: false, message: "<name required>" }` | Bearer (Freelancer) |
| TC-API-017 | No auth token | Valid body, no header | 401 | `{ success: false, message: "No token provided" }` | None |
| TC-API-018 | Invalid email format | `{ name: "Acme", email: "notanemail" }` | 400 | `{ success: false, message: "<invalid email>" }` | Bearer (Freelancer) |

---

### POST /api/clients/:id/invite

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-019 | Valid invite for own client | clientId = C-001 (owned by token holder) | 201 | `{ success: true, data: { inviteToken, expiresAt } }` | Bearer (Owner) |
| TC-API-020 | Invite client owned by another freelancer | clientId = C-002 (owned by F-002) | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |
| TC-API-021 | Invite already-archived client | clientId = C-ARCHIVED | 400 | `{ success: false, message: "Cannot invite an archived client" }` | Bearer (Owner) |

---

### POST /api/invoices

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-022 | Valid invoice with line items | `{ clientId, issueDate, dueDate, lineItems: [{description, quantity:10, rate:50}], taxPercent:10 }` | 201 | `{ success: true, data: { _id, status:"Draft", totalAmount: 550 } }` | Bearer (Freelancer) |
| TC-API-023 | Missing clientId | `{ issueDate, dueDate, lineItems: [...] }` | 400 | `{ success: false, message: "<clientId required>" }` | Bearer |
| TC-API-024 | Empty lineItems array | `{ clientId, issueDate, dueDate, lineItems: [] }` | 400 | `{ success: false, message: "At least one line item is required" }` | Bearer |
| TC-API-025 | dueDate before issueDate | `{ ..., issueDate: "2026-05-01", dueDate: "2026-04-01" }` | 400 | `{ success: false, message: "Due date must be after issue date" }` | Bearer |
| TC-API-026 | clientId not owned by token holder | clientId = C-002 (other freelancer's client) | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |

---

### PATCH /api/invoices/:id/send

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-027 | Valid send of Draft invoice | invoiceId = INV-DRAFT | 200 | `{ success: true, data: { status: "Sent" } }` | Bearer (Owner) |
| TC-API-028 | Try to send already-Sent invoice | invoiceId = INV-SENT | 400 | `{ success: false, message: "Invoice is not in Draft status" }` | Bearer |
| TC-API-029 | Try to send Paid invoice | invoiceId = INV-PAID | 400 | `{ success: false, message: "Invoice is not in Draft status" }` | Bearer |
| TC-API-030 | Send invoice owned by another freelancer | invoiceId = INV-F002 | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |

---

### POST /api/invoices/:id/payments

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-031 | Valid partial payment | `{ amount: 300 }` on $1000 invoice | 201 | `{ success: true, data: { payment: {...}, updatedStatus: "PartiallyPaid" } }` | Bearer |
| TC-API-032 | Payment that completes invoice | `{ amount: 700 }` when $300 already paid of $1000 | 201 | `{ success: true, data: { updatedStatus: "Paid" } }` | Bearer |
| TC-API-033 | Overpayment attempt | `{ amount: 1500 }` on $1000 invoice | 400 | `{ success: false, message: "Payment would exceed invoice total. Maximum allowed: $1000.00" }` | Bearer |
| TC-API-034 | Amount = 0 | `{ amount: 0 }` | 400 | `{ success: false, message: "Payment amount must be greater than 0" }` | Bearer |
| TC-API-035 | Payment on Draft invoice | invoiceId in Draft status | 400 | `{ success: false, message: "Payments can only be recorded on Sent or later invoices" }` | Bearer |
| TC-API-036 | Payment on invoice not owned by token holder | invoiceId = INV-F002 | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |

---

### GET /api/invoices/:id/pdf

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-037 | Valid PDF for Sent invoice | invoiceId = INV-SENT | 200 | Binary PDF; Content-Type: application/pdf | Bearer (Owner) |
| TC-API-038 | PDF for Draft invoice | invoiceId = INV-DRAFT | 400 | `{ success: false, message: "PDF only available for Sent or later invoices" }` | Bearer |
| TC-API-039 | Invoice not owned by requester | invoiceId = INV-F002 | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |
| TC-API-040 | No auth | invoiceId = INV-001, no header | 401 | `{ success: false, message: "No token provided" }` | None |

---

### PUT /api/time-logs/:id

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-041 | Valid update on Active log | `{ hours: 5 }` on TL-ACTIVE | 200 | `{ success: true, data: { hours: 5, status: "Active" } }` | Bearer (Owner) |
| TC-API-042 | Update on Locked log | `{ hours: 5 }` on TL-LOCKED | 400 | `{ success: false, message: "Locked time logs cannot be modified" }` | Bearer |
| TC-API-043 | Update on log owned by another freelancer | TL-F002 | 404 | `{ success: false, message: "Not found" }` | Bearer (F-001) |

---

### GET /api/dashboard

| TC ID | Scenario | Request Input | Expected Status | Expected Response Body | Auth State |
|-------|----------|--------------|-----------------|------------------------|------------|
| TC-API-044 | Valid request | No body | 200 | `{ success: true, data: { totalRevenue, pendingInvoices, overdueInvoices, activeProjects, earningsByMonth: [...] } }` | Bearer (Freelancer) |
| TC-API-045 | No auth | No Authorization header | 401 | `{ success: false, message: "No token provided" }` | None |
| TC-API-046 | Client portal token used on freelancer endpoint | Portal JWT | 403 | `{ success: false, message: "Forbidden" }` | Portal Bearer |

---

## 7. Data Validation Test Cases

| TC ID | Entity | Field | Test Condition | Input Value | Expected Behavior |
|-------|--------|-------|----------------|-------------|-------------------|
| TC-DV-001 | User | name | Below min length | `"A"` (1 char — min is 2) | 400 "Name must be at least 2 characters" |
| TC-DV-002 | User | name | At min length (2 chars) | `"Jo"` | 201 — user created |
| TC-DV-003 | User | name | At max length (50 chars) | 50-char string | 201 — user created |
| TC-DV-004 | User | name | Over max (51 chars) | 51-char string | 400 "Name must be at most 50 characters" |
| TC-DV-005 | User | email | Invalid format | `"notanemail"` | 400 "Invalid email format" |
| TC-DV-006 | User | email | Valid format | `"user@domain.co"` | 201 — accepted |
| TC-DV-007 | User | email | Already exists | `existing@test.com` | 409 "Email already registered" |
| TC-DV-008 | User | password | Below min (7 chars) | `"abc123!"` | 400 "Password must be at least 8 characters" |
| TC-DV-009 | User | password | At min (8 chars) | `"abcD123!"` | 201 — accepted |
| TC-DV-010 | Client | name | Empty string | `""` | 400 "Name is required" |
| TC-DV-011 | Client | email | Invalid format | `"bademail"` | 400 "Invalid email format" |
| TC-DV-012 | Project | name | Empty string | `""` | 400 "Project name is required" |
| TC-DV-013 | Project | status | Invalid enum value | `"InProgress"` | 400 "Invalid status value" |
| TC-DV-014 | Project | status | Valid enum value | `"Active"` | 201 — accepted |
| TC-DV-015 | TimeLog | hours | Negative value | `-1` | 400 "Hours must be 0 or greater" |
| TC-DV-016 | TimeLog | hours | Zero hours, zero minutes | `hours: 0, minutes: 0` | 400 "Total duration must be greater than 0" |
| TC-DV-017 | TimeLog | date | Future date | Date 1 year from now | 400 or 201 — **document decision** (flagged in Section 16 as GA-001) |
| TC-DV-018 | TimeLog | minutes | Value > 59 | `minutes: 60` | 400 "Minutes must be between 0 and 59" |
| TC-DV-019 | TimeLog | minutes | At max (59) | `minutes: 59` | 201 — accepted |
| TC-DV-020 | Invoice | lineItems[].quantity | Zero or negative | `quantity: 0` | 400 "Quantity must be greater than 0" |
| TC-DV-021 | Invoice | lineItems[].rate | Negative | `rate: -10` | 400 "Rate must be 0 or greater" |
| TC-DV-022 | Invoice | lineItems[].description | Empty string | `""` | 400 "Line item description is required" |
| TC-DV-023 | Invoice | taxPercent | Negative | `-5` | 400 "Tax percent must be 0 or greater" |
| TC-DV-024 | Invoice | taxPercent | Over 100 | `150` | 400 "Tax percent cannot exceed 100" |
| TC-DV-025 | Invoice | dueDate | Before issueDate | issueDate=2026-05-01, dueDate=2026-04-01 | 400 "Due date must be after issue date" |
| TC-DV-026 | PaymentLedger | amount | Zero | `0` | 400 "Payment amount must be greater than 0" |
| TC-DV-027 | PaymentLedger | amount | Negative | `-100` | 400 "Payment amount must be greater than 0" |
| TC-DV-028 | PaymentLedger | amount | Would exceed remaining balance | remaining=$200, amount=$300 | 400 "Payment would exceed invoice total" |
| TC-DV-029 | Invoice | totalAmount | Manually provided | `{ "totalAmount": 9999 }` on POST | 400 "totalAmount is computed — do not supply it manually" OR field silently ignored and computed value returned |
| TC-DV-030 | AuditLog | all fields | Created by system on send | Trigger PATCH /invoice/:id/send | AuditLog document exists with all required fields non-null |

---

## 8. Edge Case Test Cases

### 8.1 — Boundary Value Tests

| TC ID | Field | Boundary | Input | Expected |
|-------|-------|----------|-------|----------|
| TC-EC-001 | User.name | At min (2 chars) | `"Jo"` | 201 created |
| TC-EC-002 | User.name | Under min (1 char) | `"J"` | 400 rejected |
| TC-EC-003 | User.name | At max (50 chars) | exactly 50-char string | 201 created |
| TC-EC-004 | User.name | Over max (51 chars) | 51-char string | 400 rejected |
| TC-EC-005 | User.password | At min (8 chars) | `"Abcde1!x"` | 201 created |
| TC-EC-006 | User.password | Under min (7 chars) | `"Abcde1!"` | 400 rejected |
| TC-EC-007 | TimeLog.minutes | At max (59) | `59` | 201 created |
| TC-EC-008 | TimeLog.minutes | Over max (60) | `60` | 400 rejected |
| TC-EC-009 | TimeLog.minutes | At min (0) | `0` with hours > 0 | 201 created |
| TC-EC-010 | Invoice.taxPercent | At max (100) | `100` | 201 — invoice total = subtotal × 2 |
| TC-EC-011 | Invoice.taxPercent | Over max (101) | `101` | 400 rejected |
| TC-EC-012 | Invoice.taxPercent | At min (0) | `0` | 201 — total = subtotal |
| TC-EC-013 | Invoice lineItems[].quantity | At min (1) | `quantity: 1` | 201 created |
| TC-EC-014 | Invoice lineItems[].quantity | Zero | `quantity: 0` | 400 rejected |
| TC-EC-015 | PaymentLedger.amount | Exactly equal to remaining balance | remaining=$500, amount=$500 | 201 — invoice transitions to Paid |
| TC-EC-016 | PaymentLedger.amount | One cent over remaining balance | remaining=$500.00, amount=$500.01 | 400 overpayment rejected |
| TC-EC-017 | Invoice.dueDate | Exactly equal to issueDate (same day) | issueDate=dueDate=today | 400 — due date must be after issue date OR 201 (document decision — flagged GA-002) |

---

### 8.2 — Concurrency & Race Condition Tests

| TC ID | Scenario | How to Reproduce | Expected |
|-------|----------|-----------------|----------|
| TC-EC-018 | Double-submit invoice creation | Two identical POST /api/invoices requests fired simultaneously with same clientId, issueDate, dueDate, lineItems | One 201 returned; second returns 409 or is deduplicated — only 1 invoice document in DB |
| TC-EC-019 | Concurrent registration with same email | Two POST /api/auth/register requests with same email sent simultaneously | One 201; other 409 — MongoDB unique index on email enforces exactly one document |
| TC-EC-020 | Two clients simultaneously recording payment on same invoice | Two POST /api/invoices/INV-001/payments with amount=$600 each on $1000 invoice | One succeeds (201); second rejected with 400 overpayment error — no overpayment created; DB shows total payments ≤ $1000 |
| TC-EC-021 | Two freelancers inviting the same client simultaneously | Two POST /api/clients/C-001/invite fired at same time | Both may succeed (generating two tokens) OR system returns 409 if only one active token allowed per client at a time — behavior must be documented (flagged GA-003) |
| TC-EC-022 | Concurrent invoice send | Two PATCH /api/invoices/INV-DRAFT/send requests fired simultaneously | One succeeds (status → Sent); second returns 400 "Invoice is not in Draft status" — TimeLogs locked exactly once |

---

### 8.3 — State Conflict Tests

| TC ID | Scenario | Setup | Action | Expected |
|-------|----------|-------|--------|----------|
| TC-EC-023 | Edit already-archived project | Archive project P-001 via PATCH; then attempt PUT /api/projects/P-001 | PUT with `{ "name": "New Name" }` | 400 "Archived projects are read-only" — name in DB unchanged |
| TC-EC-024 | Send already-sent invoice | Invoice INV-001 has status Sent | PATCH /api/invoices/INV-001/send again | 400 "Invoice is not in Draft status" |
| TC-EC-025 | Record payment on Paid invoice | Invoice INV-PAID has status Paid, sum(payments) = totalAmount | POST /api/invoices/INV-PAID/payments with `{ amount: 1 }` | 400 "Invoice is already fully paid" |
| TC-EC-026 | Edit time log after parent invoice sent | TL-001 was included in INV-001; INV-001 is now Sent; TL-001.status = Locked | PUT /api/time-logs/TL-001 with `{ hours: 10 }` | 400 "Locked time logs cannot be modified" |
| TC-EC-027 | Re-invite already-active portal client | Client C-001 already has active portal account (status Redeemed token) | POST /api/clients/C-001/invite | Either 409 "Client already has portal access" OR new token generated — behavior must be documented (flagged GA-004) |
| TC-EC-028 | Access deleted/nonexistent resource | Resource with ID "000000000000000000000000" | GET /api/invoices/000000000000000000000000 | 404 "Not found" — not 500 |

---

### 8.4 — Business Logic Edge Cases

| TC ID | Rule (BA Ref) | Scenario | Input | Expected |
|-------|--------------|----------|-------|----------|
| TC-EC-029 | BR-01: Invoice immutable after Sent | Update line items on Sent invoice | PUT /api/invoices/INV-SENT with `{ lineItems: [{...}] }` | 400 "Sent invoices are immutable" |
| TC-EC-030 | BR-02: Payments append-only | Attempt to PUT a payment record | PUT /api/invoices/INV-001/payments/PL-001 | 404 or 405 — no such route |
| TC-EC-031 | BR-03: TimeLogs lock on send | Send invoice that references 3 TimeLogs; check all 3 | PATCH /api/invoices/INV-DRAFT/send | All 3 TimeLogs status = Locked after response; exactly 1 AuditLog entry per lock |
| TC-EC-032 | BR-04: Overpayment forbidden | Payment of exactly $0.01 over remaining balance | remaining=$100.00, payment=$100.01 | 400 overpayment error |
| TC-EC-033 | BR-05: Audit log on every critical action | Invoice send, payment recorded, client invited, time log locked | Trigger each action and query AuditLog | Each action produces exactly 1 AuditLog entry with non-null entityId, action, performedBy, timestamp |
| TC-EC-034 | BR-06: Client access strictly scoped | Client portal token for C-001 requests C-002's invoice | GET /api/portal/invoices/INV-C002 | 404 "Not found" — not 403 (prevents enumeration) |
| TC-EC-035 | BR-07: Invoice totals computed | Send invoice where lineItems were altered client-side to produce wrong total | POST /api/invoices with manually tampered totalAmount field | Server recomputes total from lineItems; ignores supplied totalAmount |
| TC-EC-036 | BR-03: Only unlocked logs can be invoiced | Create invoice referencing a Locked TimeLog | POST /api/invoices with `timeLogIds: ["TL-LOCKED"]` | 400 "TimeLog TL-LOCKED is locked and cannot be added to a new invoice" |
| TC-EC-037 | US-013: Overdue detection | Invoice dueDate = exactly midnight tonight (today is the dueDate) | Trigger overdue check at 00:01 the following day | Invoice transitions to Overdue; status = "Overdue"; AuditLog entry |
| TC-EC-038 | Data isolation: freelancerIds | Freelancer F-001 attempts to read F-002's clients | GET /api/clients (with F-001 token) | Response contains ONLY clients where freelancerId = F-001 |

---

## 9. Security Test Cases

### 9.1 — Authentication Attacks

| TC ID | Attack Type | Method | Input | Expected |
|-------|------------|--------|-------|----------|
| TC-SEC-001 | No token | GET /api/invoices | No Authorization header | 401 `{ success: false, message: "No token provided" }` |
| TC-SEC-002 | Malformed token | GET /api/invoices | `Authorization: Bearer thisisnotavalidjwt` | 401 `{ success: false, message: "Invalid token" }` |
| TC-SEC-003 | Expired access token | GET /api/invoices | Valid JWT with exp = 1 minute ago | 401 `{ success: false, message: "Token expired" }` |
| TC-SEC-004 | Tampered JWT payload | GET /api/invoices | JWT with modified `userId` in payload, original signature | 401 `{ success: false, message: "Invalid token" }` |
| TC-SEC-005 | JWT signed with wrong secret | GET /api/invoices | Token signed with `"wrongsecret"` | 401 `{ success: false, message: "Invalid token" }` |
| TC-SEC-006 | JWT with `alg: none` attack | GET /api/invoices | JWT header `{ "alg": "none" }`, no signature | 401 "Invalid token" — `jsonwebtoken` rejects alg:none by default |
| TC-SEC-007 | Portal JWT on freelancer route | GET /api/invoices | Portal client JWT instead of freelancer JWT | 403 "Forbidden" — role check rejects client role on freelancer routes |
| TC-SEC-008 | Missing Authorization header format | GET /api/invoices | `Authorization: <token>` (no "Bearer " prefix) | 401 "No token provided" or "Invalid token format" |

---

### 9.2 — Broken Object Level Authorization (BOLA)

| TC ID | Endpoint | Attack | Expected |
|-------|----------|--------|----------|
| TC-SEC-009 | GET /api/clients/:id | F-001 requests C-002 (owned by F-002) | 404 "Not found" — never 200 with C-002 data |
| TC-SEC-010 | PUT /api/clients/:id | F-001 updates C-002's data | 404 "Not found" |
| TC-SEC-011 | DELETE/ARCHIVE /api/clients/:id | F-001 archives C-002 | 404 "Not found" |
| TC-SEC-012 | GET /api/projects/:id | F-001 requests P-F002 | 404 "Not found" |
| TC-SEC-013 | PUT /api/projects/:id | F-001 updates P-F002 | 404 "Not found" |
| TC-SEC-014 | GET /api/time-logs/:id | F-001 requests TL-F002 | 404 "Not found" |
| TC-SEC-015 | PUT /api/time-logs/:id | F-001 modifies TL-F002 | 404 "Not found" |
| TC-SEC-016 | DELETE /api/time-logs/:id | F-001 deletes TL-F002 | 404 "Not found" |
| TC-SEC-017 | GET /api/invoices/:id | F-001 requests INV-F002 | 404 "Not found" |
| TC-SEC-018 | PATCH /api/invoices/:id/send | F-001 sends INV-F002 | 404 "Not found" |
| TC-SEC-019 | POST /api/invoices/:id/payments | F-001 records payment on INV-F002 | 404 "Not found" |
| TC-SEC-020 | GET /api/invoices/:id/pdf | F-001 downloads PDF for INV-F002 | 404 "Not found" |
| TC-SEC-021 | GET /api/portal/invoices/:id | C-001 portal user requests INV-C002 | 404 "Not found" |
| TC-SEC-022 | GET /api/portal/projects | C-001 portal user requests all projects (scope: all freelancers) | Response contains ONLY projects where clientId = C-001 AND freelancerId = C-001's owner |

---

### 9.3 — Brute Force & Rate Limiting

| TC ID | Scenario | Method | Steps | Expected |
|-------|----------|--------|-------|----------|
| TC-SEC-023 | Login brute force to rate limit | POST /api/auth/login | Send 11 login attempts from same IP in 15 minutes | 11th request returns 429 `{ success: false, message: "Too many requests — please try again later" }`; first 10 return 401 |
| TC-SEC-024 | Registration spam to rate limit | POST /api/auth/register | Send 6 registration attempts from same IP in 1 hour | 6th request returns 429; first 5 return 201 or 409 |
| TC-SEC-025 | Global API rate limit | GET /api/dashboard | Send 101 requests from same IP in 15 minutes | 101st request returns 429 |
| TC-SEC-026 | Rate limit response body format | Any rate-limited endpoint | Trigger 429 | Body is exactly `{ "success": false, "message": "Too many requests — please try again later" }` |

---

### 9.4 — Input Injection Attacks

| TC ID | Attack Type | Field | Payload | Expected |
|-------|------------|-------|---------|----------|
| TC-SEC-027 | NoSQL Injection in login | email | `{ "$gt": "" }` (sent as JSON key) | 400 Bad Request — mongoSanitize strips `$` operators; no user matched |
| TC-SEC-028 | NoSQL Injection in query param | name search | `?name[$gt]=` | 400 or empty result — operator stripped, not executed |
| TC-SEC-029 | XSS in client name | name | `<script>alert('xss')</script>` | Stored as plain escaped text in DB; rendered as text in UI — never executed |
| TC-SEC-030 | XSS with img tag | client description | `<img src=x onerror=alert(1)>` | Stored as escaped string; `onerror` never fires in browser |
| TC-SEC-031 | Prototype pollution | request body | `{ "__proto__": { "isAdmin": true } }` | Request processed without privilege escalation; `isAdmin` not present on any object in the handler chain |
| TC-SEC-032 | Long string DoS | invoice description | 50,000-character string | 400 "Field exceeds maximum length" — server does not hang or return 500 |
| TC-SEC-033 | SQL-style injection (irrelevant but must not 500) | any text field | `"'; DROP TABLE users; --"` | Stored as plain string (MongoDB is document-based); no 500 error |
| TC-SEC-034 | JSON with duplicate keys | request body | `{ "email": "a@b.com", "email": "admin@app.com" }` | Server processes deterministically (last key wins per JSON spec); no privilege escalation |

---

### 9.5 — Role Escalation

| TC ID | Scenario | Input | Expected |
|-------|----------|-------|----------|
| TC-SEC-035 | Freelancer accesses admin audit log route | GET /api/audit-logs with freelancer JWT | 403 "Forbidden" — adminOnly middleware blocks it |
| TC-SEC-036 | Client portal user accesses freelancer route | GET /api/clients with portal JWT | 403 "Forbidden" — role check fails |
| TC-SEC-037 | Tamper JWT role claim | JWT payload modified to `{ "role": "admin" }` | 401 "Invalid token" — signature mismatch; role escalation fails |
| TC-SEC-038 | Supply `freelancerId` in request body to override ownership | POST /api/clients with `{ ..., "freelancerId": "F-ADMIN" }` | Client created with token holder's freelancerId — supplied freelancerId ignored; no ownership override |

---

## 10. Performance Test Cases

### 10.1 — Response Time Benchmarks

| TC ID | Endpoint | Condition | Max Acceptable Response Time |
|-------|----------|-----------|------------------------------|
| TC-PERF-001 | POST /api/auth/login | Single request, normal load | < 500ms |
| TC-PERF-002 | POST /api/auth/register | Single request | < 500ms |
| TC-PERF-003 | GET /api/clients | 1 user, 50 clients, page 1 (limit 20) | < 300ms |
| TC-PERF-004 | GET /api/projects | 1 user, 100 projects, page 1 (limit 20) | < 300ms |
| TC-PERF-005 | GET /api/invoices | 1 user, 500 invoices, page 1 (limit 20) | < 300ms |
| TC-PERF-006 | GET /api/time-logs | 1 user, 1,000 time logs, page 1 | < 300ms |
| TC-PERF-007 | GET /api/dashboard | 1 user, aggregation over 1,000 invoices | < 800ms |
| TC-PERF-008 | POST /api/invoices | Single invoice creation, 10 line items | < 500ms |
| TC-PERF-009 | PATCH /api/invoices/:id/send | Send with 5 TimeLogs to lock | < 1000ms (multiple writes) |
| TC-PERF-010 | GET /api/invoices/:id/pdf | PDF generation for 10-line-item invoice | < 3000ms |

---

### 10.2 — Pagination Tests

| TC ID | Scenario | Input | Expected |
|-------|----------|-------|----------|
| TC-PERF-011 | Large dataset — server enforces pagination | 10,000 invoices in DB; GET /api/invoices with no `limit` param | Server applies default limit (e.g. 20); returns at most 20 items; response includes `total` count and `page` metadata |
| TC-PERF-012 | Page 1 of large dataset response time | 10,000 invoices; GET /api/invoices?page=1&limit=20 | Returns 20 items in < 300ms; total count field present |
| TC-PERF-013 | Page beyond total pages | 10,000 invoices, 500 pages; GET /api/invoices?page=600&limit=20 | Returns `{ data: [], total: 10000, page: 600 }` with HTTP 200 — not 404 |
| TC-PERF-014 | Limit=1 extreme pagination | GET /api/invoices?page=1&limit=1 | Returns exactly 1 invoice; no error |
| TC-PERF-015 | Time logs paginated over large dataset | 50,000 time log entries; GET /api/time-logs?page=1&limit=20 | Returns first 20 results in < 500ms; no unbounded query executed |

***

### 10.3 — Concurrent User Tests

| TC ID | Scenario | Load | Expected |
|-------|----------|------|----------|
| TC-PERF-016 | Concurrent logins | 100 simultaneous POST /api/auth/login requests | > 99% success rate for valid credentials; average response < 500ms; no 500 errors |
| TC-PERF-017 | Concurrent invoice creation | 50 users each creating 1 invoice simultaneously | All 50 invoices created with unique `_id`s; no data corruption; no duplicate invoice documents |
| TC-PERF-018 | Concurrent dashboard reads | 200 simultaneous GET /api/dashboard requests | All return correct freelancer-scoped data; no cross-contamination of data between users; no 500 errors |
| TC-PERF-019 | Concurrent payment writes on same invoice | 10 simultaneous POST /api/invoices/INV-001/payments with `{ amount: 10 }` on $100 invoice | Exactly one payment is accepted that makes total = $100; no payment accepted that causes sum(payments) > $100; all others receive 400 overpayment error |
| TC-PERF-020 | Concurrent time log creation on same project | 30 users simultaneously POST /api/time-logs for the same projectId | All 30 time logs created independently with unique IDs; no data loss or duplication |

***

## 11. Bug Predictions

| # | Predicted Bug | Why It Will Likely Happen | Affected Area | Severity |
|---|--------------|--------------------------|---------------|----------|
| B-001 | Invoice totalAmount computed incorrectly when taxPercent is 0 | Code may evaluate `if (taxPercent)` which is falsy for 0, causing the tax block to be skipped and total to equal subtotal — which is actually correct — but the lineItem total formula `quantity * rate` may use floating point arithmetic producing $0.0000000001 rounding errors. `0.1 + 0.2 !== 0.3` in JavaScript. | invoiceService.js — createInvoice() | High |
| B-002 | Overpayment check passes on concurrent writes due to missing atomic operation | The overpayment guard reads current sum(payments), checks against total, then inserts. Under concurrency, two requests can both pass the check before either insert completes. Without a MongoDB transaction or atomic findAndModify, both inserts succeed and the invoice is overpaid. | invoiceService.js — recordPayment() | Critical |
| B-003 | TimeLog locking on invoice send is not atomic — partial lock failure leaves some logs Active | sendInvoice() loops over timeLogIds and updates each TimeLog individually. If the server crashes or throws after locking 2 of 3 logs, 1 log stays Active while the invoice status = Sent. It can now be included in another invoice. | invoiceService.js — sendInvoice() | Critical |
| B-004 | BOLA check uses `req.user.id` instead of `req.user.userId` | The JWT payload decoded by auth.js attaches `req.user = { userId, email, role }`. A common mistake is writing `resource.freelancerId !== req.user.id` (undefined) instead of `req.user.userId`, causing the check to always evaluate to true and every user to pass the ownership check. | All service files — ownership validation pattern | Critical |
| B-005 | Refresh token not invalidated after rotation — old token still works | If the refresh token is stored as a plain string in the DB and the rotation code updates the record but does not delete or flag the old value atomically, or if the token is only stored in-memory without persistence, logout and rotation silently fail. | authService.js — refreshTokens(), logout() | Critical |
| B-006 | Invoice status not set to Overdue automatically — check only fires on read | If the overdue status is recalculated lazily (only when the invoice is fetched) rather than by a scheduled job, the dashboard Outstanding Invoices count will show stale data for invoices that have gone overdue since last fetch. Dashboard metrics will be incorrect. | invoiceService.js — getDashboardMetrics(), any cron/scheduler | High |
| B-007 | PDF generation includes stale data if invoice was partially paid after caching | If the PDF is generated once and cached, and then a payment is recorded, the downloaded PDF will show incorrect Balance Due. No invalidation mechanism defined in eng-output.md. | invoiceService.js — generatePDF() | Medium |
| B-008 | Client portal JWT grants access to all clients of a freelancer, not scoped to one client | If the portal JWT payload only stores `freelancerId` without a `clientId` claim, and the portal route queries `WHERE freelancerId = token.freelancerId`, all clients of that freelancer are exposed through the portal. | authService.js — acceptClientInvite(); portalRoutes.js | Critical |
| B-009 | AuditLog creation silently fails and is swallowed by a try/catch | If the AuditLog write is wrapped in a try/catch inside sendInvoice() or recordPayment() to prevent it from blocking the main operation, errors in AuditLog creation are swallowed. The invoice sends successfully but the audit trail is missing — violating BR-05. | auditService.js (or inline in services) | High |
| B-010 | mongoSanitize does not sanitize nested objects in query params | express-mongo-sanitize by default sanitizes req.body but may not sanitize req.query or req.params. A NoSQL injection via query string `?name[$gt]=` bypasses body sanitization. | app.js — middleware registration order; mongoSanitize config | High |
| B-011 | Decimal precision lost when summing line item totals in JavaScript | `quantity * rate` uses JavaScript native floats. Example: `3 * 33.33 = 99.99000000000001`. Stored as a float in MongoDB, this causes `sum(lineItems)` to be off by fractions of a cent, which can cause the overpayment check to reject a valid final payment of the exact remaining balance. | invoiceService.js — all total computation | High |
| B-012 | Rate limiter applies to all IPs equally but not per-user — shared hosting/NAT bypassed by distributing | Rate limiting is IP-based. If multiple malicious requests come from different IPs (distributed attack), the rate limiter will not trigger. Conversely, users behind a shared NAT (office, university) will all share one IP limit, causing legitimate users to hit 429. | middleware/rateLimiter.js | Medium |

***

## 12. Risk-Based Test Priorities

| Feature / Story / Endpoint | Risk Level | Rationale | Test Priority |
|---------------------------|------------|-----------|---------------|
| POST /api/auth/login + refresh + logout | Critical | All authenticated access depends on auth; broken auth = complete compromise | P1 — test first |
| BOLA on all resource endpoints | Critical | User data isolation is the #1 security requirement per ba-output.md Section 3.1 | P1 |
| Invoice immutability after Sent (BR-01) | Critical | Financial data integrity; tampering = fraudulent billing | P1 |
| Payment append-only ledger + overpayment block (BR-02, BR-04) | Critical | Financial correctness; concurrent payment race condition can cause data corruption | P1 |
| TimeLog locking on invoice send (BR-03) | Critical | Atomic operation — failure creates orphaned state in two entities simultaneously | P1 |
| AuditLog creation on all critical actions (BR-05) | High | Compliance requirement; missing audit trail is a silent failure | P2 |
| JWT refresh token rotation — old token invalidation | High | Session hijacking vector if old tokens remain valid | P1 |
| Input sanitization (mongoSanitize, xssClean) | High | NoSQL injection and XSS are trivially exploitable if middleware misconfigured | P1 |
| Rate limiting — login and registration | High | Brute force and spam attack surface | P1 |
| Data isolation per freelancerId on all GET queries | Critical | Dashboard, lists, and all reads must never cross freelancer boundaries | P1 |
| Client portal scoping (clientId + freelancerId) | Critical | Portal leaking another client's data = privacy violation | P1 |
| Invoice total computation accuracy (floating point) | High | Financial miscalculation affects billing and trust | P2 |
| PDF generation with correct data | Medium | PDF is client-facing; wrong data damages credibility | P2 |
| Project archive → read-only enforcement | High | Financial state depends on project data immutability | P2 |
| Overdue status transition | Medium | Affects dashboard accuracy; not a security issue but correctness issue | P2 |
| UI empty/loading/error states | Medium | User experience quality; does not affect data integrity | P3 |
| Pagination on large datasets | Medium | Performance degrades without it; not a data integrity issue | P2 |
| Settings save / notification preferences | Low | Preferences only; no financial impact | P3 |
| Landing page rendering | Low | Static content; no logic | P3 |

***

## 13. Test Coverage Matrix

| User Story ID | Screen ID | AC Count | Functional TCs | API TCs | Edge TCs | Security TCs | Coverage |
|---------------|-----------|----------|---------------|---------|----------|--------------|----------|
| US-001 | S-002 | 3 | TC-001, TC-002, TC-003, TC-004, TC-005 | TC-API-001 to TC-API-005 | TC-EC-001 to TC-EC-006 | TC-SEC-001 to TC-SEC-008 | Full |
| US-002 | S-002 | 2 | TC-006, TC-007, TC-008, TC-009 | TC-API-006 to TC-API-014 | TC-EC-018, TC-EC-019 | TC-SEC-023 to TC-SEC-026 | Full |
| US-003 | N/A | 1 | — | TC-API-010, TC-API-005 | — | TC-SEC-023 to TC-SEC-026 | Full |
| US-004 | S-004 | 2 | TC-010, TC-011, TC-012 | TC-API-015 to TC-API-018 | TC-EC-038 | TC-SEC-009 to TC-SEC-011 | Full |
| US-005 | S-004 | 3 | TC-013, TC-014, TC-015 | TC-API-019 to TC-API-021 | TC-EC-021, TC-EC-027 | TC-SEC-009 | Full |
| US-006 | N/A | 1 | TC-016 | — | TC-EC-034 | TC-SEC-021, TC-SEC-022 | Full |
| US-007 | S-005 | 2 | TC-017, TC-018 | — | TC-EC-023 | TC-SEC-012, TC-SEC-013 | Full |
| US-008 | S-009 | 2 | TC-019, TC-020, TC-021 | TC-API-041 to TC-API-043 | TC-EC-026, TC-EC-036 | TC-SEC-014 to TC-SEC-016 | Full |
| US-009 | S-007 | 2 | TC-022, TC-023 | TC-API-022 to TC-API-026 | TC-EC-010 to TC-EC-017, TC-EC-029, TC-EC-035 | TC-SEC-017, TC-SEC-018 | Full |
| US-010 | S-008 | 3 | TC-024, TC-025 | TC-API-027 to TC-API-030 | TC-EC-022, TC-EC-031 | TC-SEC-018 | Full |
| US-011 | S-008 | 1 | TC-026 | — | — | TC-SEC-021 | Full |
| US-012 | S-008 | 3 | TC-027, TC-029, TC-030, TC-031 | TC-API-031 to TC-API-036 | TC-EC-015, TC-EC-016, TC-EC-020 | TC-SEC-019 | Full |
| US-013 | S-008 | 3 | TC-028, TC-032 | — | TC-EC-025, TC-EC-037 | — | Full |
| US-014 | S-008 | 2 | TC-033 | TC-API-037 to TC-API-040 | — | TC-SEC-020 | Full |
| US-015 | S-003 | 1 | TC-034 | TC-API-044 to TC-API-046 | TC-EC-038 | TC-SEC-007 | Full |
| US-016 | S-003 | 2 | TC-035 | — | TC-EC-034 | TC-SEC-021, TC-SEC-022 | Full |

***

## 14. Automation Strategy

| Test Category | Tool | Priority | Notes |
|---------------|------|----------|-------|
| Unit tests — service functions | Jest | P1 | Auto-generated by code-gen-role; covers all service exports in structure.md |
| API integration tests — all endpoints | Supertest + Jest | P1 | Auto-generated by code-gen-role; covers every TC-API-xxx |
| Security tests — auth + BOLA | Supertest + Jest | P1 | Must be automated; run on every CI push |
| Rate limiting tests | Supertest + Jest | P1 | Use `jest-mock-extended` to simulate rapid requests |
| Data validation tests — boundary values | Supertest + Jest | P1 | All TC-DV-xxx are parameterized and automatable |
| Business rule enforcement tests | Supertest + Jest | P1 | TC-EC-029 through TC-EC-038 — test state machines |
| Performance benchmarks | Artillery or k6 | P2 | Run against staging; thresholds in TC-PERF-001 through TC-PERF-010 used as gate |
| Pagination tests | Artillery or k6 | P2 | Seed DB with 10k records; verify paginated responses |
| Concurrency tests | k6 with VUs | P2 | TC-PERF-016 through TC-PERF-020; simulates concurrent writes |
| UI component state tests | Vitest + Testing Library | P2 | All TC-UI-xxx for loading, empty, error, filled states |
| Critical user flow E2E tests | Playwright | P2 | Cover: Register → Login → Create Client → Create Project → Create Invoice → Send → Record Payment → Download PDF |
| Manual only — exploratory | Human tester | P3 | Edge cases not captured in formal test cases; UX feel |
| Manual only — accessibility | Human tester + axe | P3 | Not in scope per Section 2 but recommended post-launch |

***

## 15. Defect Classification Model

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Security vulnerability, data loss, cross-user data exposure, or financial data corruption with no workaround | BOLA allows User A to view User B's invoices; overpayment allowed due to race condition; JWT refresh token not invalidated |
| High | Feature completely broken, core business workflow fails, financial calculation incorrect — no workaround | Login returns 500 for valid credentials; sending invoice does not lock TimeLogs; invoice total computed incorrectly |
| Medium | Feature partially broken, degraded experience, workaround exists | Error message not shown after failed invoice send; overdue status not updating until manual refresh; PDF shows stale payment data |
| Low | UI/cosmetic issue, minor display inconsistency, no functional impact | Button misaligned on mobile by 4px; status badge wrong shade of green; skeleton width slightly off |

***

## 16. QA Assumptions & Gaps

| ID | Assumption or Gap | Affected Test Cases | Action Required |
|----|-------------------|---------------------|-----------------|
| GA-001 | TimeLog.date validation for future dates is not defined in ba-output.md or eng-output.md. TC-DV-017 marks this as undecided. | TC-DV-017 | Engineer or BA must define: is logging time for a future date (e.g. pre-scheduling) allowed? Decision must be reflected in validate.js and this TC updated |
| GA-002 | Invoice dueDate = issueDate (same day) behavior not defined. It is unclear if dueDate must be strictly after issueDate or can be equal. | TC-EC-017 | BA must clarify. If dueDate = issueDate is allowed, update TC-EC-017 to expect 201. If not, update to expect 400 |
| GA-003 | Concurrent client invitation — no business rule defines whether multiple active InviteTokens per client are allowed. | TC-EC-021 | BA/ENG must decide: is only one active invite token allowed per client? If yes, second invite must invalidate the first. Document in authService.js |
| GA-004 | Re-inviting a client who already has a portal account (Redeemed token status) — behavior not defined in ba-output.md. | TC-EC-027 | BA must define: can a client's portal access be reset? Should a new invite invalidate existing portal credentials? |
| GA-005 | Overdue status transition mechanism not specified in eng-output.md. It is unclear whether this is a scheduled background job (cron), a lazy recalculation on read, or an event trigger on payment/date change. | TC-032, TC-EC-037, B-006 | Engineer must define the overdue detection mechanism and document it in eng-output.md Section 8. QA will add specific tests for the chosen mechanism |
| GA-006 | PDF generation library choice (puppeteer vs. pdfkit) was noted as undecided in eng-output.md. puppeteer is a headless Chromium renderer (heavier, more accurate HTML rendering); pdfkit is a programmatic PDF builder (lighter, no HTML). The PDF test benchmark (< 3000ms) assumes pdfkit. If puppeteer is chosen, the benchmark should be raised to < 8000ms. | TC-PERF-010, TC-033 | Engineer must finalize PDF library choice. QA will update benchmark accordingly |
| GA-007 | Tax computation rules for invoices are listed as an Open Question in ba-output.md (Q1). TC-022 assumes a simple percentage applied to subtotal. If compound tax, tiered tax, or tax-exempt line items are introduced later, all invoice calculation tests must be re-run. | TC-022, TC-DV-023, TC-DV-024, TC-EC-010 | BA must answer Q1 before invoice feature is finalized |
| GA-008 | The audit-logs endpoint (GET /api/audit-logs) is adminOnly per eng-output.md. However, no admin user creation flow is defined in ba-output.md or ux-output.md. There is no test for admin registration, no admin panel screen, and no admin-seeding mechanism documented. | TC-SEC-035 | ENG must define how admin users are created (seeded, CLI, or a hidden route). QA cannot fully test admin routes without a method to obtain a valid admin JWT |
| GA-009 | ba-output.md lists `status` on the User entity as a field but does not define valid enum values beyond "unverified". It is assumed these are: `unverified`, `active`, `suspended`. TC-005 covers unverified. Tests for suspended users are not written. | TC-005 | BA must define full User.status enum and behavior for each state. QA will add TC for suspended login attempt |
| GA-010 | No test cases are written for email delivery (forgot-password email, invite email, verification email) because ba-output.md Assumption A2 states email delivery is reliable and no email provider was specified. If Nodemailer + SMTP is configured in production, smoke tests for email sending should be added. | TC-009 (forgot-password flow) | DevOps or ENG must define email provider. QA to add email delivery smoke tests post-provider selection |

