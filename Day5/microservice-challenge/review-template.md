# Code Review Findings

**Reviewer**: Harsh

**Date**: 20th APRIL

**Codebase**: BookShelf API

---

## Critical Issues

| # | Line(s)    | Issue                                                                                           | Impact                                                           |
|  ------ | -------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1  | 53   | Weak authentication (MD5 password hashing + no real session/JWT system)                         | Passwords can be cracked easily and users can impersonate anyone |
| 2  | 85, 94-112 | No authentication & authorization system (user_id is trusted from request, no ownership checks) | Any user can access/modify/delete any data                       |
| 3  | 101, 179   | SQL injection via string formatting in queries (`user_id`, search `q`)                          | Full database compromise possible                                |


## Major Issues

| # | Line(s)  | Issue                                                               | Impact                                                 |
|  ------ | ----------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| 1  |  115-118   | No input validation (rating, status, user_id, JSON body)            | Invalid or corrupted data stored, crashes possible     |
| 2  |  122-141   | Update/delete operations don’t verify record existence or ownership | Silent failures + unauthorized modifications           |
| 3  |  199-205   | Incorrect stats logic (ignores “reading” status, weak calculations) | Wrong analytics and misleading reports                 |
| 4  |  209       | Debug mode enabled in app run                                       | Security risk if deployed (remote code execution risk) |
| 5  |  173-180   | Stats endpoint exposes global system data                           | Cross-user information leakage                         |


## Minor Issues

| # | Line(s)   | Issue                                                 | Impact                            |
| ------ | --------- | ----------------------------------------------------- | --------------------------------- |
| 1  | Multiple  | No pagination or indexing on queries                  | Slow performance with large data  |
| 2  | Multiple  | No connection pooling (new DB connection per request) | Inefficient resource usage        |
| 4  | Multiple  | No rate limiting on login endpoint                    | Brute-force attack risk           |
| 5  | Multiple  | No security headers / CORS / HTTPS handling           | Weak deployment security          |
| 6  | Structure | Monolithic design (all logic in routes)               | Hard to maintain and scale        |


---

## Top 3 Issues — Fix Prompts

### Issue 1: [Weak authentication - Hashing/Session]
**Prompt to Claude**:
```
Context:
You are working on a Flask backend that currently uses MD5 for password hashing and has no proper authentication system. The app is insecure and not suitable for production.

Constraint:
- Do NOT change unrelated parts of the application
- Keep existing API endpoints unchanged
- Must maintain backward compatibility where possible

Execution:
Refactor the authentication system:
1. Replace MD5 hashing with a secure algorithm bcrypt
2. Implement JWT-based authentication
3. Modify /api/register to store securely hashed passwords
4. Modify /api/login to return a JWT token instead of user_id
5. Ensure JWT contains user identity and is securely signed

Output:
Return:
- Updated authentication-related Flask code
- JWT implementation code
- Required dependencies
- Brief explanation of what was fixed and why
```
**Expected outcome**: 
```
- Passwords are stored using a secure hashing algorithm bcrypt, not MD5
- /api/register saves only securely hashed passwords
- /api/login returns a JWT token instead of user_id
- JWT includes user identity (e.g., user_id) and is signed securely
- No plaintext or weak hashing remains in the system
- Authentication is required for protected routes using JWT verification middleware/helper
```

### Issue 2: [No authentication & authorization system ]
**Prompt to Claude**:
```
Context:
You are working on a Flask + SQLite API where there is currently no authorization system. Any user can access or modify any data.

Constraint:
- Do NOT change API endpoints or structure
- Assume JWT authentication already exists from previous step
- Must maintain existing functionality for valid users

Execution:
Fix authorization issues:
1. Remove all reliance on user_id from request body or query params
2. Use JWT token to identify the logged-in user
3. Enforce ownership checks so users can only access their own books
4. Apply authorization to:
   - GET /api/books
   - POST /api/books
   - PUT /api/books/<id>
   - DELETE /api/books/<id>

Output:
Return:
- Updated book-related routes
- JWT-based user extraction helper/middleware
- Explanation of how access control is enforced now
```
**Expected outcome**: 
```
- System no longer accepts user_id from client requests
- All user identity is derived from the JWT token
- Users can only:
    - View their own books
    - Create books under their own account automatically
    - Update only their own books
    - Delete only their own books
- Any attempt to access another user’s data is blocked with proper authorization error (e.g., 403 Forbidden)
-  Book queries are filtered by authenticated user automatically in backend logic
```

### Issue 3: [SQL injection via string formatting in queries]
**Prompt to Claude**:
```
Context:
You are reviewing a Flask + SQLite application that contains SQL injection vulnerabilities due to unsafe string formatting in SQL queries.

Constraint:
- Do NOT change API behavior or response format
- Must remain compatible with SQLite
- Do NOT introduce new features

Execution:
Fix all SQL injection issues:
1. Replace all string-formatted SQL queries with parameterized queries using ? placeholders
2. Fix vulnerable endpoints:
   - GET /api/books (remove unsafe user_id injection)
   - GET /api/books/search (fix unsafe LIKE query using q parameter)
3. Ensure no user input is directly concatenated into SQL anywhere in the code

Output:
Return:
- Updated secure SQL code for affected endpoints
- Before vs after query examples
- Short explanation of how SQL injection was eliminated
```
**Expected outcome**: 
```
- All SQL queries use parameterized statements (?)
- No string concatenation or f-string SQL building exists anywhere
- /api/books safely filters using parameters instead of raw SQL injection-prone logic
- /api/books/search safely handles LIKE queries using parameter binding
- User input is never directly inserted into SQL queries
- Application is fully resistant to SQL injection attacks
```
