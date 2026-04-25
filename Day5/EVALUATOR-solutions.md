# Day 5 — Evaluator Solutions & Answer Key

**Confidential — Evaluators Only**

---

## Progressive Review — Expected Findings

### Snippet 1: Naming (Minor)
- All variable names are single letters (p, d, n, e, pw, u)
- Function name `p` is meaningless
- Missing input validation (type + normalization)
- No duplicate email handling
- Weak password rules
- Response keys are abbreviated ('s', 'msg')
- Password stored in plain text in the user dict (security!)

### Snippet 2: Logic (Major)
- Incorrect pagination math (doesn’t round up)
- Breaks when dataset is empty (page becomes 0)
- No validation for per_page
- Edge cases not handled properly
- Not safe for invalid inputs

### Snippet 3: Performance (Major)
- Classic N+1 query pattern: 4 queries per order (order, items, customer, products)
- For 1000 orders: 4000+ database queries instead of ~4 with JOINs
- Connection never closed on error (no try/finally)
- No batching or optimization in queries
- Resource handling not safe (no safe DB context management)
- Fix: Single JOIN query or batch queries

### Snippet 4: Security (Critical)
- **SQL injection**: f-string in query with both `category` (table name!) and `query`
- **XSS**: User input directly in HTML response
- **Sensitive data exposure**: `/api/admin/config` returns passwords and secrets
- **No authentication**: Admin endpoints are publicly accessible
- Table name injection is especially dangerous — attacker can query ANY table

### Snippet 5: Maintainability (Major)
- Function takes 15 parameters — way too many
- Deeply nested if/else tree (8 levels deep, hard to maintain)
- Combinatorial explosion of private methods
- God class doing too much
- Hard to extend or test (no strategy pattern / abstraction)
- Fix: Use builder pattern, strategy pattern, or configuration objects

---

## Microservice Review — All Issues

### Critical
1. **SQL injection** in `list_books` (f-string with user_id) and `search_books` (f-string with query)
2. **Insecure password hashing**: MD5 — should use bcrypt or argon2
3. **No authentication on any route** except register/login (login returns user_id but nothing uses it)

### Major
4. **No authorization**: Any user can update/delete any book
5. **No input validation**: Rating can be any value (negative, 1000, etc.)
6. **Stats calculation wrong**: `unread = total - read` ignores 'reading' status
7. **Debug mode in production**: `debug=True` exposes stack traces
8. **No error handling**: If book doesn't exist in update, 404 comes AFTER the update

### Minor
9. **Database connections**: No connection pooling, no context managers
10. **No CORS headers**: Frontend can't call this API
11. **No pagination**: list_books returns ALL books
12. **Rate Limiting**: SNo rate limiting on login endpoint  
13. **Inconsistent responses**: Some return envelope, some don't
