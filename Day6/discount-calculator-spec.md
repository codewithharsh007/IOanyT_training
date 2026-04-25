# Feature Spec: Discount Calculator

## Overview
The "ShopEasy" e-commerce platform needs a discount calculator that applies various discount types during checkout.

## Discount Types

### 1. Percentage Discount
- Code: `SAVE10`, `SAVE20`, `SAVE50`
- Applies percentage off the subtotal
- Maximum discount cap: $500

### 2. Fixed Amount Discount
- Code: `FLAT25`, `FLAT100`
- Subtracts a fixed amount from subtotal
- Cannot reduce total below $0

### 3. Tiered Discount (Automatic)
- $0-$49.99: No discount
- $50-$99.99: 5% off
- $100-$199.99: 10% off
- $200+: 15% off
- Applied BEFORE any coupon code

### 4. Buy-One-Get-One (BOGO)
- Code: `BOGO`
- Applies to cheapest item in cart (free)
- Only works if cart has 2+ items

### 5. First-Time Customer
- Code: `WELCOME15`
- 15% off, one-time use per customer
- Cannot stack with other percentage discounts

## Rules
- Only ONE coupon code per order
- Tiered discount + coupon code CAN stack
- Free shipping on orders over $75 (after discounts)
- Minimum order: $10 (after discounts)

## Your Task
Create a comprehensive test strategy covering:
1. Happy path tests (each discount type works correctly)
2. Edge case tests (boundary values, combinations)
3. Error cases (invalid codes, expired, already used)
4. Integration tests (discount + tax + shipping)

Use Claude to help generate test cases, then critically evaluate:
- What did Claude include that's unnecessary?
- What did Claude miss that's critical?
- Are the test cases actually testable (specific input + expected output)?
