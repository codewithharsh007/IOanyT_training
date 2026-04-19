# Requirements Extraction Template

**Client**: Raj Mehta (VP Product, GreenGrocers)

**Project**: Shopping Cart System

**Analyst**: Harsh

---

## Extracted Requirements

### Must Have (Non-Negotiable)
| # | Requirement                                          | Source                         | Confidence |
| - | ---------------------------------------------------- | ------------------------------ | ---------- |
| 1 | Shopping cart with add/view/remove items             | “Cart should work like Amazon” | High       |
| 2 | Checkout functionality                               | Explicit                       | High       |
| 3 | Works on mobile (React Native) and desktop (Next.js) | Explicit                       | High       |
| 4 | Persistent cart after browser close                  | Explicit                       | High       |
| 5 | Discount codes support                               | “MUST”                         | High       |
| 6 | Estimated tax and shipping (placeholder allowed)     | Finance                        | High       |
| 7 | Delivery within 3 weeks                              | Explicit                       | High       |


### Should Have (Important)
| # | Requirement                                              | Source          | Confidence |
| - | -------------------------------------------------------- | --------------- | ---------- |
| 1 | Multi-currency support (scope undefined)                 | Finance         | Low        |
| 2 | Cart sync across mobile and web (implementation unclear) | Raj / Ravi      | Medium     |
| 3 | Backend API shared across platforms                      | Ravi            | Medium     |
| 4 | Razorpay payment integration                             | Existing system | High       |
| 5 | Cart persistence strategy (local vs backend unclear)     | Ravi mention    | Low        |


### Could Have (If Time Permits)
| # | Requirement                                                  | Source                                  | Confidence |
| - | ------------------------------------------------------------ | --------------------------------------- | ---------- |
| 1 | Wishlist feature                                             | Conflicting statements                  | Low        |
| 2 | Stripe integration or dual payment support                   | CEO                                     | Low        |
| 3 | Advanced multi-currency (regional pricing, tax localization) | Implied                                 | Low        |
| 4 | Guest + logged-in cart merging                               | Not stated but implied by “Amazon-like” | Low        |


### Won't Have (Explicitly Out of Scope)
| # | Item                         | Reason              |
| - | ---------------------------- | ------------------- |
| 1 | Product page performance fix | Marked as unrelated |


---

## Contradictions Found

| # | Contradiction                 | Details                                 | Resolution Needed From |
| - | ----------------------------- | --------------------------------------- | ---------------------- |
| 1 | Wishlist scope unclear        | Phase 2 vs include now                  | Raj / CEO              |
| 2 | Payment system conflict       | Razorpay contract vs Stripe request     | CEO / Finance          |
| 3 | Currency timeline unclear     | Next month vs next quarter              | Priya                  |
| 4 | Timeline vs scope mismatch    | 3 weeks vs large system                 | Raj / CEO              |
| 5 | Storage confusion             | Local vs session vs actual backend need | Engineering            |
| 6 | Budget contradiction          | “Whatever it takes” vs “reasonable”     | Raj                    |
| 7 | Cart sync expectation unclear | Real-time vs login-based sync           | Product / Engineering  |


---

## Assumptions Made

| # | Assumption                                            | Risk if Wrong                         |
| - | ----------------------------------------------------- | ------------------------------------- |
| 1 | Backend-driven cart required (not just local storage) | Sync will break across devices        |
| 2 | Wishlist can be deferred                              | Unexpected scope pressure             |
| 3 | Razorpay used for MVP                                 | Rework if Stripe required immediately |
| 4 | Placeholder tax/shipping is acceptable                | Incorrect pricing display             |
| 5 | Multi-currency = basic display conversion initially   | Re-architecture later                 |
| 6 | Cart sync happens after login (not real-time)         | UX mismatch                           |
| 7 | Discount system is simple (no complex rules)          | Rework for marketing needs            |
| 8 | Single-region pricing initially (India-first)         | Issues during Singapore launch        |


---

## Clarifying Questions (Priority Ordered)

| # | Question                                                        | Why It Matters      | Who to Ask    |
| - | --------------------------------------------------------------- | ------------------- | ------------- |
| 1 | Should wishlist be included in this release?                    | Scope control       | Raj / CEO     |
| 2 | Payment decision: Razorpay only or Razorpay + Stripe?           | Architecture impact | CEO / Finance |
| 3 | What level of cart sync is required (real-time vs login-based)? | Backend complexity  | Ravi          |
| 4 | Should cart support guest users, logged-in users, or both?      | Data model design   | Product       |
| 5 | Is multi-currency required in this phase or later?              | Scope feasibility   | Priya         |
| 6  | Which currencies need to be supported (SGD, USD, INR)?       | Defines scope             | Priya       |
| 7  | Should currency be auto-detected or user-selectable?         | UX + logic                | Product     |
| 8  | Should pricing be fixed per region or dynamically converted? | Pricing system design     | Finance     |
| 9  | What are discount code rules (types, limits, expiry)?        | Implementation complexity | Marketing   |
| 10 | How should placeholder tax/shipping be calculated?           | Avoid incorrect logic     | Finance     |
| 11 | Should cart data expire after a time period?                 | Storage + UX              | Product     |
| 12 | Will payment gateways support all required currencies?       | Integration risk          | Engineering |
| 13 | Any UI/UX reference beyond “Amazon-like”?              | Design clarity       | Product     |
| 14 | Should product page performance fix be included?       | Scope control        | Raj         |
| 15 | Should cart handle inventory validation (stock check)? | Checkout reliability | Engineering |






