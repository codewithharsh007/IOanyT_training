# BA Output: Todo Management API

Source Input: pm-output_todoApp.md

## 1. Functional Requirements (FRs)

FR-01: Create Todo
- The system shall allow creation of a todo item with fields: title (required), description (optional), categoryId (optional), dueDate (optional), and isCompleted (optional, default false).
- Validation:
  - title must be a non-empty string after trimming, length 1-120.
  - description length must be <= 2000 characters when provided.
  - dueDate must be a valid ISO date in YYYY-MM-DD format when provided.
  - categoryId must reference an existing category when provided.
- On successful creation, the system shall persist the todo and return a unique id, createdAt, updatedAt, and version.

FR-02: Retrieve Todo By ID
- The system shall return a single todo by id.
- Validation:
  - id must be a positive integer.
- If id does not exist, the system shall return a not-found response.

FR-03: List Todos
- The system shall return a list of todos.
- The list shall be sorted by createdAt in descending order by default.
- The API shall support pagination via page and pageSize query parameters.
- Pagination constraints:
  - page default = 1, minimum = 1.
  - pageSize default = 20, maximum = 100.

FR-04: Update Todo Details
- The system shall allow partial updates to title, description, categoryId, and dueDate.
- Validation:
  - At least one updatable field must be present.
  - Field-level validations from FR-01 apply.
  - Unknown fields shall be rejected.
- The system shall increment version and update updatedAt on successful update.

FR-05: Delete Todo
- The system shall allow deletion of a todo by id.
- Deletion behavior for MVP: hard delete.
- If the todo does not exist, the system shall return not-found.

FR-06: Update Completion Status
- The system shall allow marking a todo as complete or incomplete.
- If marked complete:
  - isCompleted = true.
  - completedAt must be set to current UTC timestamp.
- If marked incomplete:
  - isCompleted = false.
  - completedAt must be cleared (null).
- Repeating the same completion state update shall be idempotent.

FR-07: Category Management
- The system shall maintain categories as a controlled but extendable set.
- The system shall provide:
  - category listing.
  - category creation.
- Validation:
  - category name length 1-50.
  - category name uniqueness is case-insensitive.

FR-08: Standardized Validation and Error Responses
- All validation failures shall return a consistent error schema.
- Error schema shall include: code, message, fieldErrors (if applicable), and requestId.
- The system shall return HTTP status codes consistently based on error type.

FR-09: Persistence and Data Integrity
- The system shall persist data in SQLite.
- Writes shall be transactional.
- The database shall enforce key constraints (required fields, foreign keys, and check constraints).

FR-10: Audit-Oriented Metadata
- The system shall track createdAt and updatedAt for all todos.
- The system shall track completedAt for completion lifecycle traceability.
- The system shall maintain version for optimistic concurrency control.

## 2. Non-Functional Requirements (NFRs)

NFR-01: Performance
- p95 response time targets under normal load:
  - Create/Get/Update/Delete single todo: <= 300 ms.
  - List todos (pageSize <= 100): <= 500 ms.

NFR-02: Reliability
- All write operations shall be atomic and rollback on failure.
- Service shall fail gracefully with structured errors.

NFR-03: Availability
- Monthly availability target for internal use: >= 99.0%.

NFR-04: Security
- API input must be sanitized and validated to prevent injection attacks.
- No authentication is in scope for MVP; deployment access must be restricted to trusted internal networks.

NFR-05: Data Integrity
- Foreign key and check constraints must be enabled in SQLite.
- Invalid state combinations (for example, completed with null completedAt) must be blocked.

NFR-06: Observability
- Every request shall include or generate requestId.
- Logs shall include requestId, endpoint, statusCode, and error code for failures.

NFR-07: Maintainability
- API contracts shall be versioned (v1).
- Error codes shall be deterministic and documented.

NFR-08: Compliance and Privacy
- System shall not require sensitive personal data for core operation.
- Audit fields must support internal troubleshooting and operational audits.

## 3. User Stories

US-01: Create Todo
- As a developer consuming the API, I want to create a todo with required and optional fields, so that tasks can be tracked consistently.
- Acceptance Criteria:
  - GIVEN a valid payload WHEN POST /api/v1/todos is called THEN the system returns 201 with persisted todo details and id.
  - GIVEN title is missing or blank WHEN POST /api/v1/todos is called THEN the system returns 400 with field-level validation error for title.
  - GIVEN categoryId does not exist WHEN POST /api/v1/todos is called THEN the system returns 422 with category validation error.
- Edge Conditions:
  - title contains only whitespace.
  - description exceeds max length.

US-02: Retrieve Todo
- As a developer consuming the API, I want to retrieve a todo by id, so that I can display or process a specific task.
- Acceptance Criteria:
  - GIVEN an existing id WHEN GET /api/v1/todos/{id} is called THEN the system returns 200 with todo data.
  - GIVEN a non-existent id WHEN GET /api/v1/todos/{id} is called THEN the system returns 404.
  - GIVEN invalid id format WHEN GET /api/v1/todos/{id} is called THEN the system returns 400.
- Edge Conditions:
  - id is zero or negative.

US-03: Update Todo
- As a developer consuming the API, I want to update selected fields of a todo, so that task details stay current.
- Acceptance Criteria:
  - GIVEN a valid patch body WHEN PATCH /api/v1/todos/{id} is called THEN the system returns 200 with updated todo and incremented version.
  - GIVEN no updatable fields WHEN PATCH /api/v1/todos/{id} is called THEN the system returns 400.
  - GIVEN stale version WHEN PATCH /api/v1/todos/{id} is called THEN the system returns 409 conflict.
- Edge Conditions:
  - unknown request fields included in payload.

US-04: Manage Completion
- As a developer consuming the API, I want to mark a todo complete or incomplete, so that progress can be tracked.
- Acceptance Criteria:
  - GIVEN isCompleted=true WHEN PATCH /api/v1/todos/{id}/completion is called THEN the system sets completedAt and returns 200.
  - GIVEN isCompleted=false WHEN PATCH /api/v1/todos/{id}/completion is called THEN the system clears completedAt and returns 200.
  - GIVEN current state equals requested state WHEN update is called THEN the operation remains successful and idempotent.
- Edge Conditions:
  - toggling state repeatedly in quick succession.

US-05: Delete Todo
- As a developer consuming the API, I want to delete a todo, so that obsolete tasks can be removed.
- Acceptance Criteria:
  - GIVEN existing id WHEN DELETE /api/v1/todos/{id} is called THEN the system returns 204.
  - GIVEN non-existent id WHEN DELETE /api/v1/todos/{id} is called THEN the system returns 404.
- Edge Conditions:
  - repeated delete request for the same id.

US-06: Manage Categories
- As a developer consuming the API, I want to list and create categories, so that todos can be grouped consistently.
- Acceptance Criteria:
  - GIVEN GET /api/v1/categories WHEN called THEN system returns 200 with category list.
  - GIVEN valid category name WHEN POST /api/v1/categories is called THEN system returns 201 with created category.
  - GIVEN duplicate category name (case-insensitive) WHEN POST /api/v1/categories is called THEN system returns 409.
- Edge Conditions:
  - category name with leading/trailing spaces.

## 4. Data Model

Entity: Category
- id: integer, primary key, auto-increment, required.
- name: string, required, length 1-50.
- normalizedName: string, required, unique (lowercase trimmed name).
- isSystemDefined: boolean, required, default false.
- createdAt: datetime (UTC ISO-8601), required.

Entity: Todo
- id: integer, primary key, auto-increment, required.
- title: string, required, length 1-120.
- description: string, optional, max length 2000.
- categoryId: integer, optional, foreign key to Category.id.
- dueDate: date, optional, YYYY-MM-DD.
- isCompleted: boolean, required, default false.
- completedAt: datetime (UTC ISO-8601), optional.
- createdAt: datetime (UTC ISO-8601), required.
- updatedAt: datetime (UTC ISO-8601), required.
- version: integer, required, default 1.

Relationships
- One Category can have many Todos.
- One Todo can belong to zero or one Category.

Key Constraints
- Category.normalizedName must be unique.
- Todo.categoryId must reference existing Category when non-null.
- Todo.completedAt must be non-null when isCompleted=true.
- Todo.completedAt must be null when isCompleted=false.
- Todo.version increments by 1 on every successful update.

## 5. Workflow / Process Flow

Flow A: Create Todo
1. Actor submits create request with todo data.
2. System validates payload and category reference.
3. System writes todo to SQLite within transaction.
4. System returns created resource with state Active (isCompleted=false unless explicitly true).

Flow B: Update Todo Fields
1. Actor submits patch request with version and changed fields.
2. System validates fields and version.
3. System updates record, increments version, updates updatedAt.
4. System returns updated todo.

Flow C: Completion Transition
1. Actor submits completion update.
2. System validates todo existence.
3. System applies state transition:
   - Active -> Completed when isCompleted=true.
   - Completed -> Active when isCompleted=false.
4. System sets/clears completedAt accordingly and returns updated todo.

Flow D: Delete Todo
1. Actor submits delete request.
2. System verifies existence.
3. System removes record (hard delete).
4. System returns 204.

State Model
- Active: isCompleted=false.
- Completed: isCompleted=true.
- Deleted: terminal state after hard delete (resource unavailable).

Allowed Transitions
- Active -> Completed.
- Completed -> Active.
- Active -> Deleted.
- Completed -> Deleted.

Disallowed Transitions
- Deleted -> Active.
- Deleted -> Completed.

## 6. API Definitions

### 6.1 Create Todo
- Method: POST
- Endpoint: /api/v1/todos
- Request:
  - title: string (required)
  - description: string (optional)
  - categoryId: integer (optional)
  - dueDate: string date YYYY-MM-DD (optional)
  - isCompleted: boolean (optional)
- Response:
  - 201 Created with full todo object
- Validation Rules:
  - title required and non-blank
  - dueDate valid date format
  - categoryId exists when provided
- Error Scenarios:
  - 400 invalid payload/format
  - 422 invalid category reference

### 6.2 List Todos
- Method: GET
- Endpoint: /api/v1/todos?page={page}&pageSize={pageSize}
- Request: query params page and pageSize (optional)
- Response:
  - 200 OK with array of todos and pagination metadata (page, pageSize, total)
- Validation Rules:
  - page >= 1
  - pageSize between 1 and 100
- Error Scenarios:
  - 400 invalid pagination values

### 6.3 Get Todo By ID
- Method: GET
- Endpoint: /api/v1/todos/{id}
- Request: id path param
- Response:
  - 200 OK with todo object
- Validation Rules:
  - id positive integer
- Error Scenarios:
  - 400 invalid id format
  - 404 todo not found

### 6.4 Update Todo
- Method: PATCH
- Endpoint: /api/v1/todos/{id}
- Request:
  - Optional fields: title, description, categoryId, dueDate
  - version: integer (required for concurrency control)
- Response:
  - 200 OK with updated todo
- Validation Rules:
  - at least one updatable field present
  - version must match current record version
- Error Scenarios:
  - 400 validation error
  - 404 todo not found
  - 409 version conflict
  - 422 invalid category reference

### 6.5 Update Completion
- Method: PATCH
- Endpoint: /api/v1/todos/{id}/completion
- Request:
  - isCompleted: boolean (required)
  - version: integer (required)
- Response:
  - 200 OK with updated todo
- Validation Rules:
  - isCompleted must be boolean
  - version must match current record version
- Error Scenarios:
  - 400 invalid payload
  - 404 todo not found
  - 409 version conflict

### 6.6 Delete Todo
- Method: DELETE
- Endpoint: /api/v1/todos/{id}
- Request: id path param
- Response:
  - 204 No Content
- Validation Rules:
  - id positive integer
- Error Scenarios:
  - 400 invalid id
  - 404 todo not found

### 6.7 List Categories
- Method: GET
- Endpoint: /api/v1/categories
- Request: none
- Response:
  - 200 OK with array of categories
- Validation Rules: none
- Error Scenarios:
  - 500 internal error

### 6.8 Create Category
- Method: POST
- Endpoint: /api/v1/categories
- Request:
  - name: string (required)
- Response:
  - 201 Created with category object
- Validation Rules:
  - name non-blank, length 1-50
  - case-insensitive uniqueness
- Error Scenarios:
  - 400 invalid payload
  - 409 duplicate category

Standard Error Response Shape
- code: string
- message: string
- requestId: string
- fieldErrors: array of { field, issue } (optional)

## 7. Business Rules

BR-01: Title is mandatory and cannot be blank after trimming.

BR-02: Description is optional but cannot exceed 2000 characters.

BR-03: Category assignment is optional; if present, category must exist.

BR-04: Category names must be unique in case-insensitive form.

BR-05: dueDate is optional; if present, it must be a valid calendar date in YYYY-MM-DD.

BR-06: Marking todo complete must set completedAt.

BR-07: Marking todo incomplete must clear completedAt.

BR-08: Every successful update must increment version by exactly 1.

BR-09: Update and completion APIs must enforce optimistic concurrency using version.

BR-10: Deleting a todo permanently removes it in MVP (hard delete).

BR-11: Unknown fields in write payloads are rejected to prevent silent data drift.

BR-12: requestId must be present in all error responses for traceability.

## 8. Edge Cases

EC-01: Concurrent updates on the same todo should return 409 for stale version.

EC-02: categoryId references a deleted/non-existent category.

EC-03: dueDate is malformed (for example, 2026-02-30).

EC-04: Payload includes unsupported fields (schema drift).

EC-05: Completion update is called for an already completed/incomplete item (idempotent success).

EC-06: Delete is called twice for same id (first 204, then 404).

EC-07: Large description payload beyond limit should return deterministic validation error.

EC-08: Pagination values are negative, zero, or non-numeric.

EC-09: SQLite write lock contention during simultaneous writes should return retry-safe server error and no partial updates.

EC-10: Category names differ only by case or surrounding whitespace and should be treated as duplicates.

## 9. Risks & Gaps Identified

RG-01: PM input is ambiguous on category strategy (strict predefined vs fully flexible).
- Impact: inconsistent categorization behavior across clients.
- Recommendation: approve controlled-but-extendable category model.

RG-02: Timezone behavior for timestamps is not explicitly defined.
- Impact: inconsistent completedAt/updatedAt interpretation.
- Recommendation: enforce UTC ISO-8601 for datetime fields.

RG-03: Delete strategy is not specified (hard vs soft delete).
- Impact: audit/recovery limitations if hard delete.
- Recommendation: confirm hard delete for MVP and evaluate soft delete for v2.

RG-04: Update contract semantics are not specified (PUT vs PATCH, concurrency strategy).
- Impact: race conditions and client inconsistency.
- Recommendation: adopt PATCH with version-based optimistic concurrency.

RG-05: No explicit SLA/SLO targets in PM success metrics.
- Impact: difficult operational acceptance criteria.
- Recommendation: approve NFR performance and availability thresholds.

RG-06: No authentication in scope.
- Impact: potential misuse if API exposure broadens.
- Recommendation: restrict deployment to private/internal network and plan auth in future phase.

RG-07: SQLite scalability ceiling for concurrent traffic.
- Impact: degradation under higher write load.
- Recommendation: monitor lock/contention metrics and define migration trigger to managed RDBMS.

## 10. Assumptions

A-01: MVP is single-tenant/internal and does not require user identity context.

A-02: API version is v1 and endpoints are prefixed with /api/v1.

A-03: Category management supports listing and creation; category update/delete is out of scope for MVP.

A-04: Timestamps (createdAt, updatedAt, completedAt) are stored and returned in UTC ISO-8601.

A-05: Todo deletion in MVP is hard delete and non-recoverable.

A-06: No advanced filters/search are required beyond pagination for list endpoint.

A-07: System-generated id values are numeric and auto-incremented.

A-08: requestId is generated by middleware if not supplied by caller.
