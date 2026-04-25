# Test Plan – Todo API

## Objective
Validate that the Todo API meets functional, validation, security, and performance requirements defined in BA documentation.

## Scope
- Todo CRUD operations
- Category management
- Completion tracking
- Validation & error handling
- Concurrency control
- SQLite persistence

## Test Categories

### Functional Testing
- Verify all CRUD operations
- Validate category creation and listing
- Validate completion toggling
- Verify pagination logic
- Validate version-based concurrency

### Edge Case Testing
- Invalid inputs (blank, malformed, missing)
- Duplicate data handling
- Unknown fields in payload
- Repeated operations (delete, completion)
- Invalid IDs and pagination

### Security Testing
- SQL injection attempts
- Input validation robustness
- Payload boundary validation

### Performance Testing
- Pagination under max load
- Bulk insert scenarios
- Concurrent updates
- SQLite locking behavior

## Entry Criteria
- Application is running
- Database initialized
- API endpoints accessible

## Exit Criteria
- All critical test cases executed
- Major defects logged
- No blocker defects remaining

## Risks
- SQLite concurrency limitations
- Inconsistent error responses
- Missing observability/logging