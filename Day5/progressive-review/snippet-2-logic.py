# Snippet 2: Pagination Helper
# Review this code for issues.

def paginate(items, page, per_page=10):
    """Return a page of items with metadata."""
    total = len(items)
    total_pages = total // per_page  # BUG: doesn't round up

    if page < 1:
        page = 1
    if page > total_pages:
        page = total_pages  # BUG: if total is 0, total_pages is 0, page becomes 0

    start = (page - 1) * per_page
    end = start + per_page

    return {
        'items': items[start:end],
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': total_pages,
        'has_next': page < total_pages,
        'has_prev': page > 1,
    }


"""
Snippet 2 Review — Pagination Helper

1. Structure & Readability
- [Minor] Function is generally clear and well-structured
- [Minor] Variable names are meaningful (`items`, `page`, `per_page`)
- [Minor] Comment notes a bug but shouldn't exist in production code

Impact:
- Mostly readable, but leaving known bugs in comments is unprofessional

--------------------------------------------------

2. Logic & Correctness
- [Major] total_pages uses floor division (`total // per_page`) → does not round up
- [Major] When total = 0 → total_pages = 0 → page becomes 0 (invalid state)
- [Major] Pagination logic breaks when page becomes 0 (negative slicing risk)
- [Minor] No handling when `per_page` is 0 → division by zero crash

Impact:
- Incorrect pagination results
- Invalid page values (page 0)
- Potential runtime errors

--------------------------------------------------

3. Edge Cases & Error Handling
- [Major] Empty list (`items = []`) not handled properly (page becomes 0)
- [Major] No validation for `per_page <= 0`
- [Minor] No validation for `items` type (assumes list-like with len + slicing)
- [Minor] Large `page` values silently adjusted instead of explicit handling

Impact:
- Unexpected behavior for empty datasets
- Crashes on invalid inputs
- Silent corrections may hide bugs upstream

--------------------------------------------------

4. Security
- [Minor] No direct security vulnerabilities
- [Minor] No input validation (could be abused in APIs if untrusted input is passed)

Impact:
- Low risk here, but unsafe in API context without validation

--------------------------------------------------

5. Performance
- [Minor] Uses slicing (`items[start:end]`) → fine for lists, but expensive for large datasets
- [Major] Not suitable for database-backed pagination (loads full dataset into memory)

Impact:
- Inefficient for large datasets
- Doesn’t scale beyond in-memory use

--------------------------------------------------

Severity Summary:
- Critical: 0
- Major: 5
- Minor: Several

--------------------------------------------------

Recommended Fix Focus:
- Fix total_pages calculation (should round up)
- Ensure page never becomes 0 (minimum should be 1)
- Handle empty dataset correctly
- Validate `per_page > 0`
- Add input validation for `items`
- Consider behavior for out-of-range pages (return empty vs clamp)
- Avoid loading full dataset if used with databases (use query-level pagination)
"""