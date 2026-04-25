# Defects & Gaps

## Critical Defects

1. Delete API returns JSON instead of 204 No Content
2. Update API does not return updated object
3. Completion API is not idempotent
4. Unknown fields are not rejected
5. Error response format inconsistent across endpoints

## Data Integrity Issues

6. No DB-level constraint for completedAt vs isCompleted
7. Possible invalid state combinations in DB

## Observability Gaps

8. requestId not logged
9. No centralized logging system

## Performance Risks

10. SQLite locking under concurrent writes
11. No retry mechanism for DB failures

## BA to Engineer Gaps

- Standardized error schema not enforced globally
- Idempotency requirement not implemented
- API response contracts partially broken
- Validation completeness not aligned (unknown fields)
- Observability requirements missing