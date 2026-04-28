# Test Strategy and Test Plan

## 1. Document Metadata

* Version: 1.1
* Date: 2026-04-28
* Author: QA Engineer
* Input Sources: ba-output.md (v1.0), ux-output.md (v2.0 updated), eng-output.md (v1.0 updated)

---

## 2. Test Strategy Overview

* **Testing Approach:** Risk-based + Coverage-based + UI-first validation + API contract testing

* **Test Levels:** Unit, Integration, System, UAT, Regression

* **Test Types in Scope:**

  * Functional Testing
  * UI Validation Testing
  * API Testing
  * Negative Testing
  * Edge Case Testing
  * Security Testing (Auth, JWT, access control)
  * Data Validation Testing

* **Out of Scope:**

  * Admin Panel (Design pending + backend blocked)
  * Advanced performance/load testing
  * Notifications/reminders (not in scope)

---

## 3. Entry & Exit Criteria

### Entry Criteria

| Phase               | Entry Criteria              |
| ------------------- | --------------------------- |
| Integration Testing | APIs deployed and reachable |
| System Testing      | UI integrated with backend  |
| UAT                 | Major defects resolved      |
| Regression          | Stable build available      |

### Exit Criteria

| Phase               | Exit Criteria                       | Quality Gate         |
| ------------------- | ----------------------------------- | -------------------- |
| Integration Testing | API success + error paths validated | ≥95% pass            |
| System Testing      | All functional flows executed       | 0 critical defects   |
| UAT                 | Business validation complete        | Stakeholder sign-off |
| Regression          | No regression in core flows         | ≥98% pass            |

---

## 4. Functional Test Cases

### Epic: User Registration & Email Verification

#### TC-001: User Registration Success

* Story: US-001
* AC: AC1
* Screen: S-001
* Type: Functional
* Steps:

  1. Enter valid name, email, password
  2. Submit registration
* Expected: User created, verification email sent
* Priority: High

#### TC-002: Duplicate Email Registration

* Story: US-001
* Type: Negative
* Expected: 409 error, user not created

#### TC-003: Email Verification Success

* Story: US-002
* Screen: S-002
* Expected: Account marked verified, login enabled

#### TC-004: Invalid/Expired Token

* Story: US-002
* Type: Edge
* Expected: 400/410 error message

---

### Epic: Authentication

#### TC-005: Login Success (Verified User)

* Story: US-003
* Screen: S-003
* Expected: JWT issued, redirect to dashboard

#### TC-006: Login Failure (Invalid Credentials)

* Expected: 401 error

#### TC-007: Login Attempt (Unverified User)

* Expected: 403 blocked access

#### TC-008: Unauthorized Task Access

* Story: US-004
* Expected: 401 Unauthorized

---

### Epic: Task Management

#### TC-009: Create Task Successfully

* Story: US-005
* Screen: S-005 (Modal)
* Expected: Task saved with category required

#### TC-010: Create Task Without Category

* Expected: Validation error (category required)

#### TC-011: View Tasks (User Isolation)

* Story: US-006
* Screen: S-004
* Expected: Only logged-in user tasks visible

#### TC-012: Empty Task State

* Expected: Empty UI state shown

#### TC-013: Update Task

* Story: US-007
* Expected: Changes saved correctly

#### TC-014: Delete Task

* Story: US-008
* Expected: Task removed permanently

#### TC-015: Multiple Tags Support

* Story: US-009
* Expected: Multiple tags stored and rendered

#### TC-016: Due Date Assignment

* Story: US-010
* Expected: Date saved correctly

#### TC-017: Priority Assignment

* Story: US-011
* Expected: low/medium/high saved correctly

---

## 5. UI Validation Test Cases

### Screen: S-001 Registration

| TC ID  | Component     | State            | Expected Result            |
| ------ | ------------- | ---------------- | -------------------------- |
| UI-001 | Form Inputs   | Validation error | Error messages shown       |
| UI-002 | Submit Button | Loading          | Disabled + spinner         |
| UI-003 | Success       | Redirect         | Navigates to verify screen |

---

### Screen: S-003 Login

| TC ID  | Component          | State         | Expected Result        |
| ------ | ------------------ | ------------- | ---------------------- |
| UI-004 | Login Button       | Loading       | Disabled state         |
| UI-005 | Error Banner       | Invalid login | Error shown clearly    |
| UI-006 | Unverified Warning | Block state   | Yellow alert displayed |

---

### Screen: S-002 Email Verification

| TC ID  | Component       | State         | Expected Result     |
| ------ | --------------- | ------------- | ------------------- |
| UI-007 | Success Message | Verified      | Green success text  |
| UI-008 | Error Message   | Invalid token | Red error displayed |

---

### Screen: S-004 Dashboard

| TC ID  | Component        | State      | Expected Result        |
| ------ | ---------------- | ---------- | ---------------------- |
| UI-009 | Task Cards       | Loaded     | Correct task rendering |
| UI-010 | Empty State      | No tasks   | Placeholder shown      |
| UI-011 | Sidebar          | Navigation | Routes functional      |
| UI-012 | Quick Add Button | Click      | Modal opens            |

---

### Screen: S-005 Task Modal

| TC ID  | Component       | State      | Expected Result        |
| ------ | --------------- | ---------- | ---------------------- |
| UI-013 | Category Select | Empty      | Required validation    |
| UI-014 | Tags Input      | Multiple   | Chips rendered         |
| UI-015 | Save Button     | Loading    | Disabled during submit |
| UI-016 | Success Toast   | Task saved | Green toast appears    |

---

## 6. API Test Cases

### POST /api/auth/register

| TC ID   | Scenario        | Expected       |
| ------- | --------------- | -------------- |
| API-001 | Valid input     | 200 success    |
| API-002 | Duplicate email | 409 error      |
| API-003 | Invalid email   | 400 validation |

---

### POST /api/auth/login

| TC ID   | Scenario        | Expected     |
| ------- | --------------- | ------------ |
| API-004 | Valid login     | JWT returned |
| API-005 | Wrong password  | 401 error    |
| API-006 | Unverified user | 403 error    |

---

### GET /api/tasks

| TC ID   | Scenario    | Expected            |
| ------- | ----------- | ------------------- |
| API-007 | Valid token | User tasks returned |
| API-008 | No token    | 401 unauthorized    |

---

### POST /api/tasks

| TC ID   | Scenario         | Expected     |
| ------- | ---------------- | ------------ |
| API-009 | Valid task       | Task created |
| API-010 | Missing category | 400 error    |

---

## 7. Data Validation Test Cases

| TC ID  | Entity | Field    | Condition | Expected       |
| ------ | ------ | -------- | --------- | -------------- |
| DV-001 | User   | email    | Duplicate | Reject         |
| DV-002 | Task   | category | Missing   | Reject         |
| DV-003 | Task   | tags     | Array     | Store multiple |
| DV-004 | Task   | priority | Invalid   | Reject         |

---

## 8. Negative & Edge Cases

| TC ID  | Scenario                   | Expected |
| ------ | -------------------------- | -------- |
| NE-001 | Expired verification token | Error    |
| NE-002 | Unverified login attempt   | Blocked  |
| NE-003 | Unauthorized task access   | 401      |
| NE-004 | Empty dashboard            | Empty UI |

---

## 9. Risk-Based Priorities

| Area           | Risk                | Priority      |
| -------------- | ------------------- | ------------- |
| Authentication | High security risk  | High          |
| Task ownership | Data isolation risk | High          |
| Task CRUD      | Core functionality  | High          |
| UI dashboard   | UX dependency       | Medium        |
| Admin module   | Undefined scope     | Low (blocked) |

---

## 10. Test Coverage Matrix

| Story  | Screen | AC Covered | TC Count | Status  |
| ------ | ------ | ---------- | -------- | ------- |
| US-001 | S-001  | Yes        | 3        | Covered |
| US-002 | S-002  | Yes        | 2        | Covered |
| US-003 | S-003  | Yes        | 3        | Covered |
| US-005 | S-005  | Yes        | 3        | Covered |
| US-006 | S-004  | Yes        | 2        | Covered |
| US-007 | S-005  | Yes        | 2        | Covered |
| US-008 | S-005  | Yes        | 2        | Covered |
| US-009 | S-005  | Partial    | 2        | Partial |
| US-010 | S-005  | Yes        | 1        | Covered |
| US-011 | S-005  | Yes        | 1        | Covered |

---

## 11. Automation Strategy

| Category   | Tool       | Priority |
| ---------- | ---------- | -------- |
| API tests  | Supertest  | High     |
| UI tests   | Cypress    | High     |
| Unit tests | Jest       | Medium   |
| Regression | Cypress CI | High     |

---

## 12. Defect Classification

| Severity | Meaning        | Example         |
| -------- | -------------- | --------------- |
| Critical | System down    | Login failure   |
| High     | Feature broken | Task not saving |
| Medium   | Partial issue  | UI misalignment |
| Low      | Cosmetic       | Spacing issue   |

---

## 13. QA Assumptions & Gaps

| ID | Gap                                         | Impact          | Action                |
| -- | ------------------------------------------- | --------------- | --------------------- |
| G1 | Admin panel undefined                       | Blocked feature | Ignore                |
| G2 | Category rules unclear (single vs multi)    | Task validation | BA clarification      |
| G3 | Task modal edge cases missing in API errors | Test gaps       | ENG update needed     |
| G4 | Email service failure handling undefined    | Auth risk       | Backend clarification |
