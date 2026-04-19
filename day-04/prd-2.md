# Product Requirements Document (PRD-2)

**Product**: GreenGrocers Shopping Cart System

**Version**: 2.0

**Author**: IOanyT Development Team

**Date**: [Date]

---

## 1. Problem Statement
GreenGrocers is looking to implement a cross-platform shopping cart system to allow users to easily browse, add/remove items, and checkout with payments. This is a critical feature to support business growth as the company prepares for its launch in Singapore. Additionally, the cart will need to be synchronized across mobile (React Native) and web (Next.js) platforms.

Why Now: Competitors have launched their shopping carts already, and our CEO wants to showcase this feature at an upcoming conference in 3 weeks.

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
- Add/remove items from the cart
- View cart with item details and total
- Persistent cart (user account-based)
- Checkout via Razorpay
- Discount codes (flat percentage and fixed amount)
- Tax & shipping (flat rate, placeholder)
- Cross-platform sync (web + mobile)
- Wishlist (separate database for storing wishlist items)

### Out of Scope
- Stripe integration
- Advanced multi-currency support (dynamic exchange rates)
- Advanced discount rules (stacking, targeting)
- Shipping integration (real rates from logistics partner)

---

## 4. User Personas
| Persona          | Description                           | Key Need                                       |
| ---------------- | ------------------------------------- | ---------------------------------------------- |
| Shopper (Mobile) | User browsing via mobile app          | Quick add-to-cart and seamless checkout        |
| Shopper (Web)    | User browsing via desktop/laptop      | Clear cart view and reliable persistence       |
| Marketing Team   | Manages discounts and promotions      | Ability to apply discount codes                |
| Finance Team     | Handles tax and shipping calculations | Visibility and flexibility in tax and shipping |



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
| Performance | Page load < 2 seconds |
| Availability | 99.5% uptime |
| Security | Secure payment handling, no sensitive data stored locally |
| Scalability | Support 10000+ concurrent users |
| Data Storage| Separate wishlist database |

## 7. Technical Constraints
- Frontend must support:
    - React Native (mobile)
    - Next.js (web)
- Backend must be designed to handle cart syncing across platforms
- Payment will use Razorpay for MVP
- Multi-currency display with fixed conversion rates
- Wishlist stored in a separate database

---

## 8. Dependencies
| Dependency                | Owner          | Status  | Risk                              |
| ------------------------- | -------------- | ------- | --------------------------------- |
| Razorpay integration      | Backend Team   | Pending | Blocks checkout functionality     |
| Currency conversion specs | Finance Team   | Pending | Affects multi-currency display    |
| Shipping rate data        | Logistics Team | Pending | Affects tax/shipping placeholders |

--- 

##  9. Timeline
| Week   | Deliverable                                                                       | Duration |
| ------ | --------------------------------------------------------------------------------- | -------- |
| Week 1 | Requirements finalization, system design, backend API contracts, setup            | 3–4 days |
| Week 2 | Complete backend API development + frontend integration (Next.js + React Native)  | 7–8 days |
| Week 3 | Complete cart sync, checkout flow, wishlist, testing, bug fixing, final demo prep | 7–8 days |

---

## 10. Open Questions
| # | Question                                      | Impact if Unresolved             |
| - | --------------------------------------------- | -------------------------------- |
| 1 | Confirm list of currencies to be displayed    | Affects multi-currency logic     |
| 2 | Confirm flat-rate shipping model details      | Affects tax/shipping display     |
| 3 | Confirm estimated delivery time display logic | Affects shipping details in cart |

