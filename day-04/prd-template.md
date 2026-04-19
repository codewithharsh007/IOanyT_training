# Product Requirements Document (PRD)

**Product**: GreenGrocers Shopping Cart System
**Version**: 1.0
**Author**: IOanyT Development Team
**Date**: [Date]

---

## 1. Problem Statement
GreenGrocers currently lacks a robust shopping cart system while competitors have already launched similar Features, creating business pressure and executive urgency.

The company needs a reliable, cross-platform cart and checkout system that works on both web (Next.js) and mobile (React Native), enabling users to: add and manage items
persist cart data
complete purchases

This must be delivered quickly (within 3 weeks) to support a CEO-facing conference demo, while also laying the foundation for future Features like multi-currency and advanced payments.

---

## 2. Goals & Success Metrics
| Goal                               | Metric                          | Target      |
| ---------------------------------- | ------------------------------- | ----------- |
| Enable users to complete purchases | Cart → Checkout conversion rate | > 60%       |
| Ensure cart reliability            | Cart persistence success rate   | > 95%       |
| Cross-platform consistency         | Cart sync success rate          | > 95%       |
| Fast user experience               | Cart page load time             | < 2 seconds |
| On-time delivery                   | MVP delivery timeline           | ≤ 3 weeks   |

---

## 3. Scope

### In Scope
- Add/remove items from cart
- View cart
- Persistent cart (backend-driven)
- Checkout with Razorpay
- Discount code application (basic)
- Placeholder tax and shipping calculation
- Cross-platform cart sync (web + mobile via backend API)

### Out of Scope
- Wishlist Feature
- Stripe integration
- Advanced multi-currency (regional pricing, tax localization)
- Real shipping rate integration
- Product page performance optimization
- Advanced discount rules (stacking, targeting, etc.)

---

## 4. User Personas
| Persona          | Description                 | Key Need                                 |
| ---------------- | ---------------------------- | ---------------------------------------- |
| Shopper (Mobile) | User browsing via mobile app | Quick add-to-cart and seamless checkout  |
| Shopper (Web)    | Desktop/laptop user          | Clear cart view and reliable persistence |
| Marketing Team   | Runs promotions              | Ability to apply discount codes          |
| Finance Team     | Handles pricing/tax          | Visibility of tax and currency handling  |


## 5. Functional Requirements
| Feature                | Description                              | Priority    | Acceptance Criteria                                                  |
| ---------------------- | ---------------------------------------- | ----------- | -------------------------------------------------------------------- |
| Cart Management        | Add, remove, update, and view cart items | Must Have   | Add/remove/update items; correct totals displayed                    |
| Persistent Cart        | Cart data saved across sessions/devices  | Must Have   | Cart restored after return; consistent across sessions/devices       |
| Checkout (Razorpay)    | Complete purchase via Razorpay           | Must Have   | Checkout flow works; payment success; order confirmation shown       |
| Discount Codes         | Apply discounts to cart                  | Must Have   | Valid codes apply; invalid codes rejected; totals updated            |
| Tax & Shipping         | Show estimated costs (placeholder)       | Must Have   | Tax & shipping displayed; values configurable                        |
| Cart Sync              | Sync cart across web & mobile            | Should Have | Same cart across platforms; updates reflect after sync; no data loss |
| Multi-Currency (Basic) | Display prices in multiple currencies    | Should Have | ≥2 currencies supported; consistent conversion; single base currency |


---

## 6. Non-Functional Requirements
| Requirement | Target |
|------------|--------|
| Performance | Page load < X2 seconds |
| Availability | 99.5% uptime |
| Security | Secure payment handling, no sensitive data stored locally |
| Scalability | Support 10000+ concurrent users |

## 7. Technical Constraints
- Frontend must support:
    - React Native (mobile)
    - Next.js (web)
- Backend API must be shared across platforms
- Payment initially via Razorpay
- Timeline constraint: 3 weeks
- Must support future extensibility (Stripe, multi-currency expansion)

## 8. Dependencies
| Dependency                                 | Owner         | Status    | Risk                   |
| ------------------------------------------ | ------------- | --------- | ---------------------- |
| Razorpay integration                       | Backend Team  | Pending   | Blocks checkout        |
| Payment decision (Stripe vs Razorpay only) | CEO / Finance | Unclear   | Rework risk            |
| Currency requirements                      | Finance       | Undefined | Impacts pricing system |
| Tax & shipping logic                       | Finance       | Undefined | Incorrect calculations |
| Product decisions (wishlist, guest cart)   | Product       | Pending   | Scope creep            |


##  9. Timeline
| Week   | Deliverable                                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Week 1 | Requirements finalization, system design, API contracts, and backend development start (cart system, persistence, discount codes, placeholder tax/shipping) |
| Week 2 | Complete backend APIs + frontend integration (Next.js + React Native) + Razorpay checkout integration + basic cart sync implementation                      |
| Week 3 | End-to-end testing, bug fixing, cross-platform sync stabilization, performance tuning, and final demo preparation                                           |


## 10. Open Questions
| # | Question                               | Impact if Unresolved      |
| - | -------------------------------------- | ------------------------- |
| 1 | Should wishlist be included in MVP?    | Scope and timeline risk   |
| 2 | Razorpay only or Stripe also?          | Payment architecture risk |
| 3 | What level of cart sync is required?   | Backend complexity        |
| 4 | Which currencies need to be supported? | Multi-currency design     |
| 5 | How should tax/shipping be calculated? | Incorrect pricing         |
| 6 | Should guest users have carts?         | Data model complexity     |
| 7 | Real-time sync or login-based sync?    | UX vs complexity tradeoff |
