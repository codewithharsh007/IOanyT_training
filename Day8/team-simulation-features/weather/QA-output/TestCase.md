# Test Case Summary

| ID        | Type        | Description |
|----------|------------|-------------|
| TC-HP-01 | Happy Path | Create category successfully |
| TC-HP-02 | Happy Path | Create todo successfully |
| TC-HP-03 | Happy Path | Retrieve todo by ID |
| TC-HP-04 | Happy Path | Update todo |
| TC-HP-05 | Happy Path | Mark todo complete |

| TC-EC-01 | Edge Case | Blank title validation |
| TC-EC-02 | Edge Case | Duplicate category |
| TC-EC-03 | Edge Case | Invalid categoryId |
| TC-EC-04 | Edge Case | Invalid pagination |
| TC-EC-05 | Edge Case | Version conflict |
| TC-EC-06 | Edge Case | Idempotency failure |
| TC-EC-07 | Edge Case | Unknown field handling |
| TC-EC-08 | Edge Case | Double delete |
| TC-EC-09 | Edge Case | Invalid ID |

| TC-ST-01 | Security | SQL injection in title |
| TC-ST-02 | Security | SQL injection in path |
| TC-ST-03 | Security | Oversized payload |

| TC-PT-01 | Performance | Max pagination |
| TC-PT-02 | Performance | Bulk create |
| TC-PT-03 | Performance | Concurrent update |