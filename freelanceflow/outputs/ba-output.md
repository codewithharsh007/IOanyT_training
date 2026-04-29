# Functional Specification Document (FSD)


## 1. Document Metadata

* Version: 2.0 (Senior BA Spec)
* Date: April 29, 2026
* Author: Business Analyst
* Input Source: pm-output.md (Version: 2.0)

---

## 2. Scope Summary

FreelanceFlow is a financial workflow system for freelancers that manages the complete lifecycle of client work:

**Client → Project → Time Logs → Invoice → Payments → Audit Trail**

This specification defines a **state-driven, audit-compliant, data-isolated system** ensuring:

* Accurate billing from work logs
* Immutable financial records after finalization
* Strict client-level data visibility controls
* Fully traceable financial operations

---

## 3. Core System Principles (Non-Negotiable)

### 3.1 Data Ownership Model

Every record MUST be scoped by:

* `freelancerId` (hard boundary)
* `clientId` (soft boundary for portal access)

No query, API, or workflow may bypass this constraint.

---

### 3.2 Financial Immutability Rules

* Draft invoices → fully editable
* Sent invoices → immutable line items
* Paid invoices → completely locked
* Payments → append-only ledger (never updated or deleted)

---

### 3.3 Auditability Requirement

All critical actions MUST generate immutable audit logs:

* Invoice status changes
* Payment creation
* Client invitations
* Client invoice views
* Time log locking events

---

### 3.4 State-Driven System

All financial entities follow strict state machines (defined below). No free-form status changes allowed.

---

## 4. User Stories (Refined + System-Critical)

---

# Epic E1: Authentication & Security (F1, F15)

---

## US-001: Secure User Registration

* **As a** freelancer
* **I want to** register securely
* **So that** I can access the system

### Acceptance Criteria

* AC1: System creates user only if email is unique globally
* AC2: Password is stored using encryption (never plaintext)
* AC3: Email verification is required before activation

### Edge Cases

* Duplicate email rejection
* Invalid email format
* Unverified user login attempt

---

## US-002: Authentication Session Management

* JWT-based authentication with refresh token rotation
* Sessions expire after inactivity threshold

### Rules

* Token refresh invalidates previous refresh token
* Multiple active sessions allowed per freelancer

---

## US-003: Rate Limiting & Abuse Prevention

* IP-based throttling enforced at gateway level
* Brute force attempts must trigger temporary IP blocking

---

# Epic E2: Client Management (F2, F3, F14)

---

## US-004: Client Creation with Ownership Binding

* Clients are always bound to a freelancer

### Acceptance Criteria

* AC1: Client cannot exist without freelancerId
* AC2: Duplicate email allowed only across different freelancers (resolved via scope isolation)

---

## US-005: Client Invitation Lifecycle

### State Machine: InviteToken

* Active → Expired → Redeemed

### Rules

* Token validity = 48 hours
* Redeemed tokens cannot be reused
* Invitation logs MUST be stored in AuditLog

---

## US-006: Client Portal Access Control

* Clients can only access:

  * Their own invoices
  * Their own projects (read-only view)

### Enforcement Rule

All queries must enforce:

```
WHERE clientId = session.clientId AND freelancerId = owner
```

---

# Epic E3: Project & Time Tracking (F4, F5)

---

## US-007: Project Lifecycle Management

### State Machine: Project

* Active → Archived

### Rules

* Projects cannot be deleted (audit requirement)
* Archived projects become read-only

---

## US-008: Time Logging System

### State Machine: TimeLog

* Active → Locked

### Lock Rule (Critical)

A TimeLog becomes LOCKED when:

> It is included in a Sent Invoice

### Constraints

* Time logs cannot be edited or deleted once locked
* Only unlocked logs can be invoiced

---

# Epic E4: Invoice & Payment Engine (F6, F7, F8, F12)

---

## US-009: Invoice Creation (Draft State)

### Invoice State Machine

* Draft → Sent → Viewed → PartiallyPaid → Paid → Overdue

---

## Data Structure: InvoiceLineItem

Each invoice contains:

* description
* quantity (hours/items)
* rate
* total

### Rule

Invoice total is ALWAYS derived:

```
sum(lineItems) + manual adjustments
```

No manual override allowed in Sent state.

---

## US-010: Invoice Sending (State Transition Control)

### Rules

* Sending invoice triggers:

  * TimeLog locking
  * AuditLog entry
  * status = Sent

### Constraint

Once Sent:

* No edits allowed on:

  * line items
  * totals
  * associated time logs

---

## US-011: Invoice Viewing (Client Event Tracking)

### Rule

* First client access triggers:

  * status = Viewed
  * AuditLog entry created

---

## US-012: Payment Ledger System (Append-Only Model)

### Entity: PaymentLedger

| Field      | Rule                 |
| ---------- | -------------------- |
| amount     | must be > 0          |
| timestamp  | immutable            |
| invoiceId  | required             |
| recordedBy | system or freelancer |

---

### Payment Rules

* Payments are APPEND ONLY
* No update/delete allowed
* Overpayment is strictly blocked:

```
sum(payments) ≤ invoice.total
```

---

## US-013: Invoice Completion Logic

### State Transition Rules

* If sum(payments) == invoice.total → Paid
* If dueDate < today AND unpaid → Overdue
* Partial payments → PartiallyPaid

---

## US-014: PDF Generation

### Rules

* PDF reflects FINAL computed invoice state
* Must include:

  * line items
  * payments summary
  * outstanding balance

---

# Epic E5: Dashboard & Analytics (F10, F11)

---

## US-015: Freelancer Dashboard

Displays:

* Total revenue
* Pending invoices
* Overdue invoices
* Active projects

### Constraint

Data must respect freelancerId isolation

---

## US-016: Client Portal Dashboard

Displays:

* Invoice list
* Payment status
* Project summaries

---

# 5. Data Entities (Normalized System Model)

---

## 5.1 Core Entities

### User

* id
* email
* passwordHash
* role (freelancer/client)
* status

---

### Client

* id
* freelancerId (FK)
* email
* name
* status

---

### Project

* id
* freelancerId
* clientId
* status (Active/Archived)

---

### TimeLog

* id
* projectId
* freelancerId
* hours (decimal)
* status (Active/Locked)

---

### Invoice

* id
* freelancerId
* clientId
* status
* totalAmount
* dueDate
* createdAt

---

### InvoiceLineItem

* id
* invoiceId
* description
* quantity
* rate
* total

---

### PaymentLedger (CRITICAL)

* id
* invoiceId
* amount
* timestamp (immutable)
* method (manual/system)
* recordedBy

---

### AuditLog (CRITICAL)

| Field       | Type     |
| ----------- | -------- |
| id          | UUID     |
| entityType  | string   |
| entityId    | string   |
| action      | string   |
| performedBy | string   |
| timestamp   | datetime |
| metadata    | JSON     |

---

### InviteToken

* id
* clientId
* token
* expiresAt
* status (Active/Expired/Redeemed)

---

## 6. Business Rules (System-Level)

| Rule ID | Description                                     |
| ------- | ----------------------------------------------- |
| BR-01   | Invoice is immutable after Sent                 |
| BR-02   | Payments are append-only                        |
| BR-03   | TimeLogs lock on invoice send                   |
| BR-04   | Overpayment is forbidden                        |
| BR-05   | All critical actions generate AuditLog          |
| BR-06   | Client access is strictly scoped                |
| BR-07   | Invoice totals are computed, never manually set |

---

## 7. System Workflows

---

### 7.1 Invoice Lifecycle Workflow

1. Create Draft Invoice
2. Attach TimeLogs + LineItems
3. Validate totals
4. Send Invoice

   * Lock TimeLogs
   * Create AuditLog
5. Client Views Invoice

   * Status → Viewed
6. Payments Added

   * Append to PaymentLedger
7. System Recalculates State:

   * Paid / PartiallyPaid / Overdue

---

### 7.2 Payment Processing Workflow

1. Payment submitted
2. Validate remaining balance
3. Append to PaymentLedger
4. Recalculate invoice state
5. Generate AuditLog

---

## 8. System State Machines

---

### Invoice States

* Draft
* Sent
* Viewed
* PartiallyPaid
* Paid
* Overdue

---

### TimeLog States

* Active
* Locked

---

### Payment Ledger

* Append-only (no state mutation)

---

## 9. Screen Inventory (Complete UX Coverage)

| Screen          | Purpose                |
| --------------- | ---------------------- |
| Auth            | Login/Register         |
| Client List     | Manage clients         |
| Project View    | Manage projects        |
| Time Tracker    | Log work               |
| Invoice Builder | Create invoices        |
| Invoice Detail  | Lifecycle + payments   |
| Client Portal   | External view          |
| Dashboard       | Metrics                |
| Audit Viewer    | System logs (internal) |

---

## 10. Non-Functional Requirements

* 100% data isolation enforcement
* Financial calculations must be deterministic
* Audit logs are immutable
* System must support concurrent payment writes safely
* All monetary values must use high-precision decimal handling

---

## 11. Assumptions

| ID | Assumption                                      |
| -- | ----------------------------------------------- |
| A1 | Single base currency                            |
| A2 | Email delivery is reliable                      |
| A3 | Freelancers are sole owners of clients/projects |

---

## 12. Open Questions

| ID | Question                           | Impact              |
| -- | ---------------------------------- | ------------------- |
| Q1 | Tax computation rules?             | Invoice calculation |
| Q2 | Multi-currency support future?     | Schema design       |
| Q3 | Payment gateway integration scope? | Payment model       |

---

## 13. Traceability Matrix

| Story  | Feature | Outcome             |
| ------ | ------- | ------------------- |
| US-009 | F6      | Invoice creation    |
| US-012 | F8      | Payment integrity   |
| US-010 | F7      | Lifecycle control   |
| US-016 | F10     | Client transparency |

