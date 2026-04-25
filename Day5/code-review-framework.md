# Code Review Framework — 5 Dimensions

**IOanyT Workshop Reference Card**

---

Review every piece of code through these 5 lenses, in order:

## 1. Structure & Readability
- Are names meaningful? (`processOrder` vs `doStuff`)
- Is the code organized logically?
- Are functions small and single-purpose?
- Is there unnecessary duplication?

## 2. Logic & Correctness
- Does it do what it claims to do?
- Are all code paths handled (if/else, switch defaults)?
- Are loops correct (off-by-one, infinite loop risks)?
- Are return values used correctly?

## 3. Edge Cases & Error Handling
- What happens with empty input? Null? Undefined?
- What happens with very large input?
- What happens with unexpected types?
- Are errors caught and handled gracefully?

## 4. Security
- Is user input validated/sanitized?
- SQL injection risks? (string concatenation in queries)
- XSS risks? (unescaped HTML output)
- Sensitive data exposure? (passwords in logs, API keys in code)
- Authentication/authorization checks present?

## 5. Performance
- Any O(n²) or worse operations that could be O(n)?
- Unnecessary database calls in loops (N+1 problem)?
- Missing caching for expensive operations?
- Memory leaks? (event listeners not removed, growing arrays)

---

## Severity Classification

| Severity | Definition | Examples |
|----------|-----------|---------|
| **Critical** | Security vulnerability or data loss risk | SQL injection, auth bypass, data corruption |
| **Major** | Incorrect behavior or significant performance issue | Logic error, N+1 queries, race condition |
| **Minor** | Style, readability, or minor optimization | Naming, unused imports, missing comments |

---

*IOanyT Workshop | Use this framework for every code review exercise*
