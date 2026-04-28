# Functional Specification Document (FSD)

## 1. Document Metadata
- Version: 1.0
- Date: 2026-04-27
- Author: Business Analyst
- Input Source: pm-output.md (Version: 1.3)

## 2. Scope Summary
This document defines the functional specification for a full-stack task management system with mandatory email verification, authentication, categorized task management, and a UI dashboard. The system ensures secure, persistent, and user-isolated task management.

## 3. User Stories

### Epic: User Registration & Email Verification (F1, F2, F4)

#### US-001: User Registration
- As a new user
- I want to register an account
- So that I can access the system
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Given valid input, when registration is submitted, then user is created
  - AC2: Given duplicate email, then system rejects registration
- Edge Cases:
  - Invalid email format
- Screen/Flow Context: Registration UI + API

#### US-002: Email Verification
- As a user
- I want to verify my email
- So that I can activate my account
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Verification email is sent after registration
  - AC2: Account remains inactive until verification completed
  - AC3: Valid token activates account
- Edge Cases:
  - Expired token
  - Already verified account
- Screen/Flow Context: Email verification page

---

### Epic: Authentication (F3, F12)

#### US-003: Login
- As a verified user
- I want to log in
- So that I can access my tasks
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Only verified users can log in
  - AC2: Invalid credentials rejected
- Edge Cases:
  - Unverified account login attempt
- Screen/Flow Context: Login UI

#### US-004: Authentication Enforcement
- As a system
- I want to restrict access to authenticated users
- So that data remains secure
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Unauthenticated users cannot access task APIs/UI
- Edge Cases:
  - Expired sessions

---

### Epic: Task Management (F5–F10, F13, F15, F16)

#### US-005: Create Task
- As a user
- I want to create a task
- So that I can track work
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Task must include title + category
- Edge Cases:
  - Missing category

#### US-006: View Tasks
- As a user
- I want to view my tasks
- So that I can manage them
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Only user-specific tasks shown
- Edge Cases:
  - No tasks

#### US-007: Update Task
- As a user
- I want to update tasks
- So that I can modify details
- Priority: Must Have

#### US-008: Delete Task
- As a user
- I want to delete tasks
- So that I can remove unnecessary items
- Priority: Must Have

#### US-009: Task Categories/Tags
- As a user
- I want to assign categories/tags
- So that I can organize tasks
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Each task must have at least one category
  - AC2: Multiple tags allowed [ASSUMPTION]
- Edge Cases:
  - Invalid category
- Screen/Flow Context: Task form UI

#### US-010: Due Dates
- As a user
- I want to assign due dates
- So that I can track deadlines
- Priority: Should Have

#### US-011: Task Priority
- As a user
- I want to set priority
- So that I can organize importance
- Priority: Could Have

---

### Epic: UI Dashboard (F14)

#### US-012: Task Dashboard UI
- As a user
- I want a dashboard
- So that I can manage tasks easily
- Priority: Must Have
- Acceptance Criteria:
  - AC1: Display tasks grouped by category
  - AC2: Allow CRUD operations from UI
- Edge Cases:
  - Empty dashboard state

---

### Epic: Security & Data Integrity (F9, F10)

#### US-013: Task Ownership Enforcement
- As a system
- I want to restrict task access
- So that users only see their data
- Priority: Must Have

#### US-014: Persistent Storage
- As a system
- I want to persist all data
- So that nothing is lost
- Priority: Must Have

---

### Epic: Admin (F17)

#### US-015: Admin Panel
- As an admin
- I want to view users and tasks
- So that I can monitor system
- Priority: Could Have
- Notes: Scope not confirmed

---

## 4. Data Entities & Attributes

| Entity | Attribute | Type | Required | Constraints |
|--------|----------|------|----------|-------------|
| User | user_id | UUID | Yes | Unique |
| User | email | String | Yes | Unique |
| User | password | String | Yes | Hashed |
| User | is_verified | Boolean | Yes | Default false |
| Task | task_id | UUID | Yes | Unique |
| Task | user_id | UUID | Yes | FK |
| Task | title | String | Yes | Non-empty |
| Task | category | String | Yes | Required |
| Task | tags | Array | No | Multiple allowed |
| Task | status | Enum | Yes | open/done |
| Task | due_date | Date | No | Optional |
| Task | priority | Enum | No | low/med/high |

---

## 5. Business Rules

| Rule ID | Description | Applies To |
|---------|-------------|------------|
| BR-01 | Email must be verified before login | User |
| BR-02 | Each task must have category | Task |
| BR-03 | Users can only access own tasks | Task |
| BR-04 | Password must be hashed | User |
| BR-05 | Tasks must persist | System |
| BR-06 | Only verified users can access system | Auth |

---

## 6. System Workflows

### Workflow: Registration & Verification
1. User registers
2. System creates inactive account
3. Email sent
4. User verifies email
5. Account activated

---

### Workflow: Task Lifecycle
1. User logs in
2. User creates task (with category)
3. User updates/views/deletes task
4. System validates ownership
5. Changes persisted

---

## 7. System States

| Entity | States |
|--------|--------|
| User | Unverified → Verified → Active |
| Task | Created → Updated → Completed → Deleted |

---

## 8. Screen Inventory

| Screen ID | Name | Actions |
|-----------|------|--------|
| S1 | Registration UI | Register |
| S2 | Email Verification UI | Verify |
| S3 | Login UI | Login |
| S4 | Dashboard UI | Manage Tasks |
| S5 | Task Form UI | Create/Edit Task |
| S6 | Admin Panel | View Data |

---

## 9. Non-Functional Requirements
- Secure authentication required
- Email verification mandatory
- High consistency between UI and API
- Data persistence guaranteed
- Responsive UI required

---

## 10. Assumptions

| ID | Assumption | Risk |
|----|------------|------|
| A1 | Email service available | Medium |
| A2 | Categories are user-defined | Low |
| A3 | Admin scope not finalized | High |

---

## 11. Open Questions

| ID | Question | Blocking |
|----|----------|----------|
| Q1 | Predefined vs custom categories? | Yes |
| Q2 | Multi-tag support rules? | Yes |
| Q3 | Admin scope final? | Yes |
| Q4 | Email provider decided? | Yes |

---

## 12. Traceability Matrix

| Story | Feature |
|------|--------|
| US-001 | F1  |
| US-002 | F2  |
| US-003 | F3  |
| US-004 | F12 |
| US-005 | F5  |
| US-006 | F6  |
| US-007 | F7  |
| US-008 | F8  |
| US-009 | F13 |
| US-010 | F15 |
| US-011 | F16 |
| US-012 | F14 |
| US-013 | F9  |
| US-014 | F10 |
| US-015 | F17 |

