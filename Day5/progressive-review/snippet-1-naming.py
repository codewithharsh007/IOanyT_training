# Snippet 1: User Registration Handler
# Review this code for issues.

def p(d):
    n = d.get('n')
    e = d.get('e')
    pw = d.get('pw')

    if not n or not e or not pw:
        return {'s': False, 'msg': 'Missing fields'}

    import re
    if not re.match(r'.+@.+\..+', e):
        return {'s': False, 'msg': 'Bad email'}

    if len(pw) < 6:
        return {'s': False, 'msg': 'Short pw'}

    u = {'name': n, 'email': e, 'password': pw, 'active': True}
    # Assume save_to_db exists
    # save_to_db('users', u)

    return {'s': True, 'msg': 'OK', 'user': u}



"""
Snippet 1 Review — User Registration Handler

1. Structure & Readability
- [Minor] Function name `p` is not meaningful
- [Minor] Variable names (`d`, `n`, `e`, `pw`) are unclear
- [Minor] Inline import (`import re`) inside function
- [Major] Function mixes validation + user creation responsibilities
- [Minor] Response keys (`s`, `msg`) are non-standard and unclear

Impact:
- Reduces readability and maintainability
- Harder for teams to understand and extend

--------------------------------------------------

2. Logic & Correctness
- [Minor] Email regex too weak (`.+@.+\..+`)
- [Major] Password rule too weak (only length >= 6)
- [Major] No normalization (email case sensitivity, trimming)
- [Critical] Returning password in response

Impact:
- Accepts invalid data
- Risk of duplicate accounts
- Sensitive data exposure

--------------------------------------------------

3. Edge Cases & Error Handling
- [Major] No check if input `d` is a dict
- [Minor] No trimming of input values
- [Minor] No max length validation
- [Major] No duplicate email handling

Impact:
- Possible runtime errors
- Dirty or inconsistent data
- Poor handling of unusual inputs

--------------------------------------------------

4. Security
- [Critical] Password stored in plaintext
- [Critical] Password exposed in API response
- [Major] Weak input validation

Impact:
- High risk of data breach
- Violates basic security standards

--------------------------------------------------

5. Performance
- [Minor] Inline import (`re`) inside function

Impact:
- Negligible, but avoidable inefficiency

--------------------------------------------------

Severity Summary:
- Critical: 2
- Major: 5
- Minor: Multiple

--------------------------------------------------

Recommended Fix Focus:
- Use meaningful names for functions and variables
- Do not store or return plaintext passwords
- Improve validation (email + password strength)
- Normalize inputs (trim + lowercase email)
- Validate input type (`dict`)
- Separate validation and processing logic
- Use clearer response structure (`success`, `message`)
- Add duplicate email handling
"""