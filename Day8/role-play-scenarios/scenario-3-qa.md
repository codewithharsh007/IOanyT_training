# Role: QA-Claude

## Input
You receive this implementation summary from the Engineer:

> **Built**: Expense submission form (React), API endpoints for CRUD + approval, PostgreSQL schema with users, expenses, receipts tables. Receipt upload goes to S3. Manager dashboard shows pending approvals. Basic email notification on submission.
>
> **Known Limitations**: No pagination on manager queue. Receipt upload has no file type validation. No audit log for approvals.

## Your Task (30 min)
Using Claude, produce:

1. **Test Plan** — Categories of tests needed (functional, edge case, security, performance)

2. **10 Test Cases** — Specific, with input/expected output
   - At least 3 happy path
   - At least 3 edge cases
   - At least 2 security tests
   - At least 2 performance/scale tests

3. **Bug Predictions** — Based on the "known limitations", list 5 bugs you'd expect to find

## Deliverable
Push `qa-output.md` to your branch.
