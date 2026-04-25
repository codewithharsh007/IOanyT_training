# Snippet 4: Admin Search Endpoint
# Review this code for issues.

from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)
DATABASE = 'admin.db'


@app.route('/api/admin/search', methods=['GET'])
def admin_search():
    query = request.args.get('q', '')
    category = request.args.get('category', 'users')

    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row

    # SQL INJECTION: string formatting instead of parameterized query
    sql = f"SELECT * FROM {category} WHERE name LIKE '%{query}%'"
    results = conn.execute(sql).fetchall()

    # XSS: returning unsanitized user input
    html_results = f"<h2>Results for: {query}</h2>"
    for row in results:
        html_results += f"<div>{dict(row)}</div>"

    conn.close()

    return html_results, 200, {'Content-Type': 'text/html'}


@app.route('/api/admin/config', methods=['GET'])
def get_config():
    # Exposing sensitive configuration
    return jsonify({
        'database': DATABASE,
        'secret_key': os.environ.get('SECRET_KEY', 'default-secret-123'),
        'admin_password': os.environ.get('ADMIN_PASSWORD', 'admin123'),
        'debug': True,
    })



"""
Snippet 4 Review — Admin Search Endpoint

1. Structure & Readability
- [Minor] Mixed responsibilities: request handling + DB access + HTML rendering in same function
- [Minor] Hardcoded database name (`DATABASE = 'admin.db'`)
- [Minor] Direct string concatenation for HTML generation inside route
- [Minor] No separation of service layer / controller layer

Impact:
- Difficult to maintain and scale
- Hard to test individual components
- Violates clean architecture principles

--------------------------------------------------

2. Logic & Correctness
- [Major] SQL query built using f-string with user input
- [Major] Dynamic table name (`category`) directly injected into query
- [Minor] Default category fallback (`users`) not validated against allowed tables
- [Minor] No pagination or limit on results

Impact:
- Query behavior can break or be manipulated
- Potential unintended table access
- Performance degradation on large datasets

--------------------------------------------------

3. Edge Cases & Error Handling
- [Major] No validation for `category` input (invalid table names → runtime SQL errors)
- [Minor] Empty query handled implicitly but still runs LIKE '%%' (returns everything)
- [Major] No try/except for database operations
- [Minor] No handling for DB connection failure

Impact:
- API can crash on invalid inputs
- Risk of returning massive unintended datasets
- Poor resilience in production environments

--------------------------------------------------

4. Security
- [Critical] SQL Injection vulnerability via f-string query construction
- [Critical] Dynamic table name injection (`category`) is not sanitized
- [Critical] Cross-Site Scripting (XSS) via unsanitized `query` and `row` data in HTML response
- [Critical] Exposure of sensitive configuration in `/api/admin/config`
- [Critical] Default secrets (`admin123`, `default-secret-123`) are insecure

Impact:
- Full database compromise possible (SQL injection)
- Client-side script injection risk (XSS)
- Sensitive credentials exposed via API
- High risk of system takeover

--------------------------------------------------

5. Performance
- [Major] No query limits or pagination → risk of large unbounded result sets
- [Minor] Row-by-row HTML string concatenation (inefficient for large datasets)
- [Minor] No caching or indexing considerations for search endpoint

Impact:
- Slow responses on large datasets
- High memory usage under load
- Poor scalability

--------------------------------------------------

Severity Summary:
- Critical: 4 (SQL injection, XSS, config exposure, insecure defaults)
- Major: 4
- Minor: Several

--------------------------------------------------

Recommended Fix Focus:
- Use parameterized queries (never f-string SQL with user input)
- Whitelist allowed `category` table names
- Never return raw HTML from API (use JSON instead)
- Sanitize or escape all user-controlled output if HTML is unavoidable
- Remove sensitive config exposure from API endpoints
- Secure secrets via environment management tools
- Add pagination/limits for search results
- Add proper error handling for DB operations
"""