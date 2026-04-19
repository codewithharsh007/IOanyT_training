# Risk & Assumption Log

**Project**: Shopping Cart System

**Analyst**: Harsh

---

## Risks

| ID | Risk                                                                 | Likelihood | Impact | Mitigation Strategy                                                                    | Owner               |
| -- | -------------------------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------- | ------------------- |
| R1 | Scope too large for 3-week deadline                                  | High       | High   | Define MVP scope and defer non-critical features (wishlist, Stripe, advanced currency) | Product Manager     |
| R2 | Payment gateway decision unclear (Razorpay vs Stripe)                | High       | High   | Lock Razorpay for MVP; design abstraction layer for future Stripe                      | Tech Lead           |
| R3 | Cart sync across mobile & web not properly designed                  | High       | High   | Implement backend-driven cart API (avoid local/session storage reliance)               | Backend Lead        |
| R4 | Multi-currency requirements unclear                                  | High       | Medium | Implement basic currency display for MVP; confirm full requirements for Phase 2        | Product + Finance   |
| R5 | Placeholder tax/shipping logic may not match real-world expectations | Medium     | Medium | Use configurable placeholder values; design system for future integration              | Backend Lead        |
| R6 | Discount system complexity underestimated                            | Medium     | Medium | Start with simple rules (flat/percentage); confirm advanced rules early                | Backend + Marketing |
| R7 | Cross-platform inconsistency (React Native vs Next.js)               | Medium     | High   | Use shared API contracts and consistent validation logic                               | Tech Lead           |
| R8 | Cart persistence misunderstood (local vs backend)                    | Medium     | High   | Standardize backend persistence with optional local cache fallback                     | Backend Lead        |


---

## Assumptions

| ID | Assumption                                          | Impact if Wrong                              | How to Validate                 |
| -- | --------------------------------------------------- | -------------------------------------------- | ------------------------------- |
| A1 | Backend-driven cart is required for sync            | Cart will not sync across devices            | Confirm with Engineering (Ravi) |
| A2 | Wishlist can be deferred to Phase 2                 | Scope creep and missed expectations          | Confirm with Raj / CEO          |
| A3 | Razorpay will be used for MVP                       | Rework needed if Stripe required immediately | Confirm with CEO / Finance      |
| A4 | Multi-currency basic display conversion initially | Requires redesign for full pricing system    | Confirm with Finance (Priya)    |
| A5 | Cart sync happens on login (not real-time)          | UX mismatch if real-time expected            | Confirm with Product            |
| A6 | Discount logic is simple (no advanced rules)        | Rework for marketing campaigns               | Confirm with Marketing          |
| A7 | Placeholder tax/shipping is acceptable for now      | Incorrect estimates shown to users           | Confirm with Finance            |
| A8 | Initial launch is India-first (Singapore later)     | Multi-currency urgency misjudged             | Confirm with Finance            |


---

## Dependencies

| ID | Dependency                                          | External? | Status               | Risk if Delayed                      |
| -- | --------------------------------------------------- | --------- | -------------------- | ------------------------------------ |
| D1 | Payment gateway (Razorpay access/config)            | Yes       | Pending confirmation | Blocks checkout implementation       |
| D2 | Decision on Stripe integration                      | Yes       | Unclear              | May cause rework in payment system   |
| D3 | Tax & shipping calculation rules (even placeholder) | Yes       | Not defined          | Incorrect pricing display            |
| D4 | Currency requirements (which currencies, logic)     | Yes       | Not defined          | Blocks multi-currency implementation |
| D5 | Backend API design approval                         | No        | Not started          | Blocks frontend integration          |
| D6 | Product decisions (wishlist, guest cart, sync type) | Yes       | Pending              | Scope confusion, delays              |
| D7 | Logistics partner data (future shipping rates)      | Yes       | Not available        | Limits production readiness          |
