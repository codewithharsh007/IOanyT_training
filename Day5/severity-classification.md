# Severity Classification Guide

**IOanyT Workshop Reference Card**

---

## Three Levels

### 🔴 Critical
**Impact**: Security breach, data loss, system crash, or complete feature failure.
**Action**: Must fix before any deployment. Block the PR.

**Examples**:
- SQL injection vulnerability
- Authentication bypass
- Unhandled exception that crashes the server
- Data corruption (writing wrong data to DB)
- Exposed secrets (API keys, passwords in code)

### 🟡 Major
**Impact**: Incorrect behavior, significant performance degradation, or poor user experience.
**Action**: Should fix before deployment. Request changes on PR.

**Examples**:
- Logic error that produces wrong results for some inputs
- N+1 database query (works but very slow at scale)
- Missing input validation (won't crash but gives garbage output)
- Race condition under concurrent access
- Missing error handling for expected failure cases

### 🟢 Minor
**Impact**: Code quality, readability, or minor optimization.
**Action**: Nice to fix. Can approve PR with comments.

**Examples**:
- Poor variable naming
- Unused imports or dead code
- Missing documentation on complex logic
- Inconsistent code style
- Slightly inefficient but functionally correct approach

---

## Decision Tree

```
Does it risk security or data loss?
  YES → 🔴 Critical
  NO  → Does it produce incorrect behavior?
          YES → 🟡 Major
          NO  → Does it cause significant performance issues?
                  YES → 🟡 Major
                  NO  → 🟢 Minor
```

---

*IOanyT Workshop | Apply consistently across all review exercises*
