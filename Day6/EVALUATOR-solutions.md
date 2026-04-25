# Day 6 — Evaluator Solutions & Answer Key

**Confidential — Evaluators Only**

---

## Buggy Checkout — All 8 Bugs

### Bug 1: Subtotal ignores quantity (Critical)
- **Location**: `calculate_subtotal()` — sums prices, not price×quantity
- **Expected**: $79.99 + (14.99×2) + (9.99×3) = $139.94
- **Actual**: $79.99 + 14.99 + 9.99 = $104.97

### Bug 2: No max cap on percentage discount (Major)
- **Location**: `apply_coupon()` percent branch
- **Spec says**: Maximum discount cap $500
- **Impact**: On large orders, discount could exceed $500

### Bug 3: Fixed discount can make total negative (Major)
- **Location**: `apply_coupon()` fixed branch
- **Example**: Subtotal $20, FLAT25 code → total becomes -$5
- **Fix**: `return min(coupon['value'], subtotal), None`

### Bug 4: BOGO takes most expensive, not cheapest (Major)
- **Location**: `apply_coupon()` bogo branch
- **Sorted `reverse=True`** then takes `[0]` = most expensive
- **Fix**: Sort ascending or use `min()`

### Bug 5: Tax rate wrong — 1.8% instead of 18% (Critical)
- **Location**: `calculate_tax()` — `0.018` should be `0.18`
- **Impact**: Tax wildly undercharged on every order

### Bug 6: Free shipping uses pre-discount subtotal (Major)
- **Location**: `calculate_shipping()` calls `calculate_subtotal()` instead of using parameter
- **Impact**: Gets free shipping based on original price, not discounted

### Bug 7: No shipping address validation (Major)
- **Location**: `checkout()` — `shipping_address` can be empty dict
- **Impact**: Order can be placed with no delivery address

### Bug 8: Minimum order check uses wrong value (Minor)
- **Location**: `checkout()` — checks `total` (includes tax+shipping) against $10
- **Spec says**: $10 minimum after discounts (before tax/shipping)
- **Impact**: Orders slightly below $10 might pass due to tax/shipping padding

---

## What to Evaluate

| Behavior | Score Impact |
|----------|-------------|
| Found 6+ bugs | Excellent — thorough tester |
| Found 4-5 bugs | Good — solid QA instincts |
| Found 2-3 bugs | Average — needs improvement in systematic testing |
| Found 0-1 bugs | Concern — not testing methodically |
| Bug reports are clear and reproducible | Strong positive |
| Used boundary value analysis | Shows methodology |
| Tested combinations (coupon + tiered) | Advanced thinking |
