# QA Deliverable — Expense Submission Feature

## 1. Test Plan (categories)

- Functional: form submission, CRUD endpoints, approval workflow, manager dashboard actions, email notification flows, file upload handling.
- Edge cases: missing/invalid fields, large attachments, concurrent approvals, duplicate submissions, user role boundaries.
- Security: auth/authorization checks, file upload validation / malware scanning, injection and parameter tampering, access control to receipts and approvals.
- Performance / Scale: manager queue load, large numbers of concurrent submissions, upload throughput and S3 latency, DB query performance for pending approvals.
- Usability / Accessibility: form validation messages, keyboard navigation, responsive layout on mobile.
- Integration: S3 upload success/failure handling, email provider retries, DB transactional integrity across expense + receipt records.

## 2. Ten Test Cases

Happy path (3)
1) Submit expense successfully
	- Input: Authenticated employee (role: employee) fills required fields (amount: 125.50, currency: USD, date: 2026-04-01, category: Travel), attaches receipt.pdf (valid PDF), clicks Submit.
	- Expected: 201 Created; response body contains expense id and status `Pending`; receipt uploaded to S3; DB has expense + receipt record linked; manager receives email notification.

2) Manager approves expense
	- Input: Authenticated manager opens manager dashboard, selects pending expense id, clicks Approve.
	- Expected: 200 OK; expense status changes to `Approved` in DB; approver id and timestamp stored; employee receives approval email.

3) Employee views submitted expense
	- Input: Authenticated employee requests GET /expenses/{id} for their expense.
	- Expected: 200 OK; response shows expense details, status `Pending`/`Approved`, and a presigned S3 URL or link to receipt.

Edge cases (3)
4) Submit with missing required field
	- Input: Authenticated employee submits with empty `amount` field.
	- Expected: 400 Bad Request; validation error message indicating `amount` is required; no DB record; no S3 upload.

5) Upload very large receipt file
	- Input: Authenticated employee attaches a 250 MB file (exceeds allowed limit, assuming 10 MB limit).
	- Expected: 413 Payload Too Large or 400 with clear message; upload rejected; expense not created.

6) Concurrent approvals race
	- Input: Two managers send Approve for the same pending expense concurrently.
	- Expected: One request succeeds and sets status to `Approved` with approver info; the second returns 409 Conflict or 400 with message `Expense already processed`; DB contains single final state and an approvals audit entry (if present).

Security tests (2)
7) Unauthorized access to another user's expense
	- Input: Authenticated employee A attempts GET /expenses/{id} where id belongs to employee B.
	- Expected: 403 Forbidden (or 404 to avoid disclosure). No expense data returned.

8) Upload malicious file disguised as PDF (content mismatch)
	- Input: Authenticated employee uploads `receipt.pdf` whose content is an executable or script.
	- Expected: File type/content validation rejects upload; 400 Bad Request; file not stored; log entry for rejected upload.

Performance / Scale (2)
9) Manager queue pagination / large list performance
	- Input: Simulate 50,000 pending expenses; manager requests dashboard list (no pagination implemented).
	- Expected: System should paginate; response time < 2s for first page; server should not OOM or time out. If pagination missing, note failure and high latency or OOM.

10) High concurrent submissions
	- Input: Simulate 500 concurrent employees submitting expenses with small receipts concurrently.
	- Expected: System accepts most requests with success rate > 99%; average API response time < 1s; S3 throughput sustained; no data loss or duplicated records.

Notes: include IDs, environment, and test data for automated tests; for manual tests include steps to reproduce and cleanup steps.

## 3. Bug Predictions (based on known limitations)

1) Manager dashboard will time out or OOM when many pending items are present (no pagination) — causes slow UI and backend memory spikes.
2) Users can upload disallowed file types (e.g., .exe, .js) or files with incorrect content under `.pdf` extension — potential malware risk and downstream processing failures.
3) Approval actions lack audit records — unable to trace who approved/rejected and when; introduces compliance risk.
4) Concurrent approval race leads to inconsistent state or duplicate approval emails if there is no optimistic locking / transactional guard.
5) Email notifications may be sent even if S3 upload fails or DB write partially succeeds, leading to users seeing receipts missing from storage.

---

Status: QA deliverable written to `qa-output.md` and duplicated here for visibility.

