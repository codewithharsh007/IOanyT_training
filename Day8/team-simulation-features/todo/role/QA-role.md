# QA Deliverable — Todo Management API

## 1. Test Plan (categories)

- Functional: category creation/listing, todo CRUD operations, completion status updates, pagination, optimistic concurrency/version handling, SQLite persistence behavior.
- Edge cases: blank or whitespace-only title/category name, invalid IDs, invalid category references, malformed dates, duplicate categories with case/space variations, repeated delete, repeated completion update, unknown payload fields.
- Security: SQL injection attempts in payloads/path params, oversized input handling, validation bypass attempts, error response consistency without sensitive leakage.
- Performance / Scale: large todo lists with max pagination, concurrent updates on same todo, moderate concurrent create operations, SQLite lock/contention behavior.
- Usability / API Contract: consistent status codes, standardized error schema, predictable response bodies, clear validation errors for clients.
- Integration / Data Integrity: SQLite foreign key enforcement, metadata persistence (`createdAt`, `updatedAt`, `completedAt`, `version`), category-todo relationship integrity.

## 2. Ten Test Cases

Happy path (3)

1) Create category successfully
	- Input: POST `/api/v1/categories` with `{ "name": "Work" }`.
	- Expected: Success response with category id and name; category stored in DB; category appears in category listing.

2) Create todo successfully
	- Input: POST `/api/v1/todos` with valid payload such as `{ "title": "Finish report", "description": "Complete QA handoff pack", "categoryId": 1, "dueDate": "2026-05-01", "isCompleted": false }`.
	- Expected: Success response with created todo id; DB record created with `version = 1`, valid timestamps, `isCompleted = false`, `completedAt = null`.

3) Update completion status successfully
	- Input: PATCH `/api/v1/todos/{id}/completion` with `{ "isCompleted": true, "version": 1 }` for an existing active todo.
	- Expected: 200 OK; `isCompleted = true`; `completedAt` populated; `updatedAt` refreshed; `version` incremented.

Edge cases (3)

4) Create todo with blank title
	- Input: POST `/api/v1/todos` with `{ "title": "   " }`.
	- Expected: Validation failure; request rejected; no DB record created.

5) Create duplicate category with case/space variation
	- Input: First create `Work`, then POST `/api/v1/categories` with `{ "name": "  work  " }`.
	- Expected: 409 Conflict or duplicate-category error; second category not created.

6) Repeat completion update with same state
	- Input: PATCH `/api/v1/todos/{id}/completion` twice with `isCompleted = true` using latest version.
	- Expected: Per BA, operation should be idempotent with no meaningful state change on second call. Actual code is likely to increment version and refresh timestamp, so defect should be logged if observed.

Security tests (2)

7) SQL injection-like payload in title
	- Input: POST `/api/v1/todos` with title `x'); DROP TABLE todos; --`.
	- Expected: Input treated as plain text; request stored or validated safely; DB tables remain intact because parameterized SQL is used.

8) Oversized description payload
	- Input: POST `/api/v1/todos` with valid title and `description` > 2000 characters.
	- Expected: Validation error; request rejected; no DB insert.

Performance / Scale (2)

9) Large pagination request at supported maximum
	- Input: Seed at least 120 todos, then GET `/api/v1/todos?page=1&pageSize=100`.
	- Expected: 200 OK; exactly 100 todos returned; records sorted by `createdAt DESC`; metadata (`page`, `pageSize`, `total`) correct.

10) Concurrent update/version conflict behavior
	- Input: Two clients read same todo version and both PATCH `/api/v1/todos/{id}` using the same version value.
	- Expected: One request succeeds; second request returns 409 Conflict due to version mismatch; final DB state remains consistent.

Notes: include request/response payloads, test environment, and cleanup steps for automation. For manual execution, capture actual status codes, response schema, and DB verification where possible.

## 3. Bug Predictions (based on actual code and current limitations)

1) Completion update is not idempotent
   - Repeating the same `isCompleted=true` request updates `completedAt` again and increments `version`, which violates BA idempotency expectations.

2) Unknown fields may be silently accepted
   - Pydantic models do not explicitly forbid extra fields, so unsupported payload keys may not be rejected even though BA requires rejection of unknown fields.

3) Error schema is inconsistent across endpoints
   - Some failures use custom `error_response(...)`, while others use raw `HTTPException(...)`, so clients may receive different error shapes depending on the endpoint.

4) Delete API contract mismatch
   - BA expects `204 No Content`, but current code returns a success message body instead, which can break strict API-contract consumers.

5) Update API response contract mismatch
   - BA expects the updated todo object to be returned, but current implementation returns only a generic success message, forcing an extra GET call.

6) DB integrity risk for `isCompleted` / `completedAt`
   - No SQLite CHECK constraint ensures `completedAt` must be set when `isCompleted=true`, so invalid states are possible if future code changes or manual DB edits occur.

7) SQLite lock/contention risk under concurrent writes
   - No retry handling or robust rollback strategy exists around concurrent writes, so moderate concurrency may surface `database is locked` style failures.

---

Status: QA deliverable prepared for `QA_role.md` and aligned to the actual Todo API code, BA requirements, and identified implementation gaps.
