# 🐛 BUG-REPORT-2.md — Additional Bugs (ShopEasy Checkout System)

---

## 🐛 Bug 1: BOGO ignores item quantity
- **Severity:** Major

- **Steps to reproduce:**
  1. Add a single item with quantity = 2
  2. Apply `BOGO` coupon

- **Expected behavior:**
  BOGO should apply when total quantity ≥ 2

- **Actual behavior:**
  BOGO checks only number of unique items, not quantity

- **Evidence:**
  Uses `len(CART)` instead of total item count

---

## 🐛 Bug 2: BOGO does not support multiple free items
- **Severity:** Major

- **Steps to reproduce:**
  1. Add 4 items in cart
  2. Apply `BOGO`

- **Expected behavior:**
  2 cheapest items should be free (Buy 2 Get 2 logic)

- **Actual behavior:**
  Only one item is discounted

- **Evidence:**
  Logic returns a single price instead of per-pair calculation

---

## 🐛 Bug 3: Coupon input not trimmed (whitespace issue)
- **Severity:** Minor

- **Steps to reproduce:**
  1. Apply coupon `" SAVE10 "` (with spaces)

- **Expected behavior:**
  Coupon should be trimmed and accepted

- **Actual behavior:**
  Coupon is rejected

- **Evidence:**
  `.upper()` is applied but `.strip()` is missing

---

## 🐛 Bug 4: Floating point precision issues in calculations
- **Severity:** Minor

- **Steps to reproduce:**
  1. Perform calculations with decimal values (e.g., 9.99 × 3)
  2. Observe totals

- **Expected behavior:**
  Values should be consistently rounded to 2 decimal places

- **Actual behavior:**
  Intermediate values may contain floating precision errors

- **Evidence:**
  Rounding only applied at final output

---

## 🐛 Bug 5: Negative intermediate totals allowed
- **Severity:** Major

- **Steps to reproduce:**
  1. Apply large discount on small subtotal
  2. Observe `after_coupons`

- **Expected behavior:**
  Intermediate totals should never go below 0

- **Actual behavior:**
  Negative values propagate to tax and final total

- **Evidence:**
  No safeguard after discount application

---

## 🐛 Bug 6: Tax calculated on negative amounts
- **Severity:** Major

- **Steps to reproduce:**
  1. Force negative subtotal after discounts
  2. Observe tax value

- **Expected behavior:**
  Tax should be 0 for non-positive amounts

- **Actual behavior:**
  Negative tax is calculated

- **Evidence:**
  No validation inside tax function

---

## 🐛 Bug 7: Checkout allows empty cart
- **Severity:** Critical

- **Steps to reproduce:**
  1. Set cart to empty
  2. Call `/api/checkout`

- **Expected behavior:**
  Checkout should be blocked

- **Actual behavior:**
  Order is processed

- **Evidence:**
  No validation for empty cart

---

## 🐛 Bug 8: No validation for negative or zero item values
- **Severity:** Major

- **Steps to reproduce:**
  1. Add item with price = 0 or negative
  2. Or quantity ≤ 0

- **Expected behavior:**
  Invalid items should be rejected

- **Actual behavior:**
  System processes invalid data

- **Evidence:**
  No input validation on CART items

---

## 🐛 Bug 9: Shipping applied even when order is invalid
- **Severity:** Minor

- **Steps to reproduce:**
  1. Create order below minimum threshold
  2. Observe shipping cost

- **Expected behavior:**
  Invalid orders should not include shipping

- **Actual behavior:**
  Shipping is still added

- **Evidence:**
  Shipping calculated before order validation

---

## 🐛 Bug 10: No enforcement of first-time user restriction (WELCOME15)
- **Severity:** Major

- **Steps to reproduce:**
  1. Apply `WELCOME15` multiple times

- **Expected behavior:**
  Should only work for first-time users

- **Actual behavior:**
  Always applied without restriction

- **Evidence:**
  No user eligibility check exists

---

## 🐛 Bug 11: Hardcoded business rules (magic numbers)
- **Severity:** Minor

- **Steps to reproduce:**
  1. Review code

- **Expected behavior:**
  Configurable values via constants/config

- **Actual behavior:**
  Values hardcoded (tax, shipping, thresholds)

- **Evidence:**
  Multiple hardcoded numeric values in logic

---

## 🐛 Bug 12: Global CART shared across users (no isolation)
- **Severity:** Critical

- **Steps to reproduce:**
  1. Simulate multiple users
  2. Modify cart

- **Expected behavior:**
  Each user should have separate cart

- **Actual behavior:**
  CART is global and shared

- **Evidence:**
  Single in-memory CART variable used

---

## 🐛 Bug 13: Shipping logic recalculates subtotal incorrectly
- **Severity:** Major

- **Steps to reproduce:**
  1. Apply discount
  2. Check shipping

- **Expected behavior:**
  Shipping should use post-discount subtotal

- **Actual behavior:**
  Function recalculates subtotal internally

- **Evidence:**
  Calls `calculate_subtotal()` instead of using parameter

---
