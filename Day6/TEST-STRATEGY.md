# TEST STRATEGY – (ShopEasy Checkout)

---

## 1. Objective

Validate the correctness and reliability of discount calculations and checkout logic.

Ensure accurate behavior for:
- Percentage discounts
- Fixed discounts
- Tiered discounts
- BOGO (Buy-One-Get-One)
- First-time customer discounts
- Shipping rules
- Minimum order validation
- Tax calculation

---

## 2. Scope

### In Scope
- Discount calculation logic
- Coupon validation and application
- Final order total calculation
- Shipping eligibility
- Tax calculation
- Discount stacking rules
- Boundary and edge case handling

### Out of Scope
- UI/UX
- Payment gateway
- Database/storage

---

## 3. Test Dimensions

Key variables:
1. Cart subtotal
2. Number of items
3. Item price distribution
4. Coupon type
5. Coupon combinations / stacking
6. Order thresholds
7. Customer eligibility
8. Shipping threshold
9. Minimum order value
10. Rounding precision

---

## 4. Functional Test Cases

### 4.1 Percentage Discount

| Test ID | Input | Expected Result |
|--------|------|----------------|
| T1 | Subtotal = 100, SAVE10 | Discount = 10 |
| T2 | Subtotal = 200, SAVE20 | Discount = 40 |
| T3 | Subtotal = 1000, SAVE50 | Discount capped at 500 |
| T4 | Subtotal = 150, save10 | Accepted (case-insensitive) |

---

### 4.2 Fixed Discount

| Test ID | Input | Expected Result |
|--------|------|----------------|
| T5 | Subtotal = 100, FLAT25 | Final = 75 |
| T6 | Subtotal = 200, FLAT100 | Final = 100 |
| T7 | Subtotal = 25, FLAT25 | Final = 0 |

---

### 4.3 Tiered Discount

| Subtotal | Expected Discount |
|----------|------------------|
| < 50 | 0% |
| 50–99.99 | 5% |
| 100–199.99 | 10% |
| ≥ 200 | 15% |

---

### 4.4 BOGO Discount

| Scenario | Expected Result |
|----------|----------------|
| 2 items | Cheapest item free |
| 3 items | Cheapest item free |
| Same price items | One item free |

---

### 4.5 First-Time Customer Discount

| Scenario | Expected Result |
|----------|----------------|
| New user + WELCOME15 | 15% discount applied |
| Returning user + WELCOME15 | Rejected |

---

## 5. Edge Cases

### 5.1 Boundary Values

#### Tiered Discount

| Subtotal | Expected |
|----------|----------|
| 49.99 | 0% |
| 50 | 5% |
| 99.99 | 5% |
| 100 | 10% |
| 199.99 | 10% |
| 200 | 15% |

---

#### Free Shipping

| Subtotal | Expected |
|----------|----------|
| 74.99 | Shipping applied |
| 75 | Shipping applied |
| 75.01 | Free shipping |

---

#### Minimum Order

| Subtotal | Expected |
|----------|----------|
| 9.99 | Rejected |
| 10 | Accepted |
| 10.01 | Accepted |

---

#### Max Discount Cap

| Scenario | Expected |
|----------|----------|
| 10000 + SAVE40 | Max discount = 500 |
| 5000 + SAVE20 | Discount ≤ 500 |

---

### 5.2 Cart Edge Cases

- CEC1: Empty cart  
- CEC2: Single item  
- CEC3: Quantity = 0  
- CEC4: Negative quantity  
- CEC5: Very large quantity  
- CEC6: Zero price item  
- CEC7: Negative price item  
- CEC8: Decimal precision issues  

---

### 5.3 Coupon Edge Cases

- CEC9: Lowercase coupon  
- CEC10: Coupon with spaces  
- CEC11: Empty coupon  
- CEC12: Invalid coupon  
- CEC13: Multiple coupons attempted  
- EC14: Special characters  
- CEC15: Numeric coupon  

---

### 5.4 BOGO Edge Cases

- CEC16: Only 1 item → Error  
- CEC17: Identical prices → One free  
- CEC18: High price difference → Cheapest free  
- CEC19: Quantity vs unique items → Correct free item  
- CEC20: Large cart → Correct free item  

---

## 6. Error Handling

### Coupon Errors

| Test ID | Scenario | Expected |
|--------|----------|----------|
| ER1 | Invalid code | Error |
| ER2 | Expired coupon | Rejected |
| ER3 | Reused WELCOME15 | Rejected |
| ER4 | Unsupported coupon | Error |
| ER5 | Null coupon | Ignored |

---

### Business Rule Errors

| Test ID | Scenario | Expected |
|--------|----------|----------|
| ER6 | Order < minimum value | Rejected |
| ER7 | Discount > subtotal | Final = 0 |
| ER8 | BOGO with 1 item | Error |
| ER9 | Negative subtotal | Error |
| ER10 | Multiple coupons | Rejected |

---

## 7. Integration Tests

### Scenario 1

- Subtotal = 120  
- Tier (10%) = 12 → 108  
- SAVE10 → 10.8  
- Final = 97.2  
- Shipping = Free  

**Expected:** 97.2 + tax  

---

### Scenario 2

- Subtotal = 60  
- Tier (5%) = 3 → 57  
- FLAT25 → 32  
- Shipping applied  

**Expected:** 32 + tax + shipping  

---

### Scenario 3

- Subtotal = 15  
- FLAT25 → 0  

**Expected:** Rejected (minimum order rule)  

---

### Scenario 4

- Items = 10, 20, 30  
- BOGO → discount = 10  
- Tier applied if eligible  

**Expected:** Correct stacking and final total  

---

## 8. Risk Prioritization

High priority:
- Price calculation accuracy  
- Discount stacking logic  
- Negative total prevention  
- Shipping rules  
- Tax calculation  
- Coupon validation  
- Boundary conditions  
- Floating-point precision  

---

## 9. Acceptance Criteria

System is correct if:
- Discounts are applied correctly  
- Discount caps are enforced  
- BOGO selects cheapest item  
- Total never becomes negative  
- Shipping rules are correct  
- Minimum order is enforced  
- Tax is correct  
- Only one coupon is allowed  
- Discount application order is consistent  

---