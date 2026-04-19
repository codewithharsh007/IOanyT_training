# User Story Template

## User Stories

### US-001: Shopping Cart Management

As a shopper,
I want to add, remove, and update items in my shopping cart,
So that I can manage the products I want to purchase before checking out.

**Priority**: Must Have

**Estimate**: 8 Story points

Acceptance Criteria:

GIVEN the cart is empty, WHEN I add an item to the cart, THEN the item should appear in the cart with correct details and price.
GIVEN there are items in my cart, WHEN I remove an item, THEN the item should be removed from the cart and total price updated.
GIVEN the cart contains items, WHEN I update the quantity of an item, THEN the total price should adjust based on the updated quantity.

**Edge Cases**:

If the item is out of stock, it should not be added to the cart.
If the user updates quantity to 0, the item should be removed from the cart.

**Dependencies**: None

### US-002: Persistent Cart

As a shopper,
I want to retain my cart data after I close the app/browser,
So that I can come back and continue shopping from where I left off.

**Priority**: Must Have

**Estimate**: 5 Story points

Acceptance Criteria:

GIVEN I am logged in, WHEN I close the browser/app, THEN my cart should still be available when I log in again.
GIVEN I am logged in on different devices, WHEN I log in on another device, THEN my cart should be consistent with the previous device.
GIVEN I add items to the cart, WHEN I logout and log back in, THEN the items should remain in my cart.

**Edge Cases**:

If the user logs out, the cart should clear.
If session expires, cart data should be cleared.

**Dependencies**: US-001 (Shopping Cart Management)

### US-003: Checkout with Razorpay

As a shopper,
I want to complete payments using Razorpay,
So that I can successfully purchase the items in my cart.

**Priority**: Must Have

**Estimate**: 8 Story points

Acceptance Criteria:

GIVEN I have items in my cart, WHEN I proceed to checkout, THEN I should be directed to Razorpay’s payment gateway.
GIVEN I am on Razorpay’s payment gateway, WHEN I complete the payment, THEN I should receive an order confirmation with the payment details.
GIVEN the payment fails, WHEN I try to complete it, THEN I should see an error message and be able to retry the payment.

**Edge Cases**:

If payment fails, retry logic should be implemented.
The order should not be processed if payment fails.

**Dependencies**: US-001 (Shopping Cart Management), US-002 (Persistent Cart)

### US-004: Discount Codes

As a shopper,
I want to apply discount codes to my cart,
So that I can get discounts on my purchases.

**Priority**: Must Have

**Estimate**: 5 Story points

Acceptance Criteria:

GIVEN I have a valid discount code, WHEN I enter it during checkout, THEN the discount should be applied to the total price.
GIVEN I enter an invalid discount code, WHEN I submit it, THEN I should see an error message indicating the code is invalid.
GIVEN I have applied a discount, WHEN I proceed to checkout, THEN the discounted price should be reflected in the total.

**Edge Cases**:

Invalid codes should display a clear error message.
Multiple discount codes should not be stackable unless specified.

**Dependencies**: US-003 (Checkout with Razorpay)

### US-005: Tax & Shipping (Placeholder)

As a shopper,
I want to see estimated tax and shipping costs,
So that I can know the total cost of my purchase.

**Priority**: Must Have

**Estimate**: 5 Story points

Acceptance Criteria:

GIVEN I have items in my cart, WHEN I proceed to checkout, THEN I should see the estimated tax and shipping costs.
GIVEN shipping is applied, WHEN I view my cart, THEN I should see the shipping cost along with the total price.

**Edge Cases**:

Shipping cost should not exceed total price.
Tax should not be applied if it's not available.

**Dependencies**: US-003 (Checkout with Razorpay)


### US-006: Wishlist

As a shopper,
I want to add items to a wishlist and move them between cart and wishlist,
So that I can save items for later or purchase them later.

**Priority**: Should Have

**Estimate**: 6 Story points

Acceptance Criteria:

GIVEN I am logged in, WHEN I add items to my wishlist, THEN they should be saved in a separate wishlist database.
GIVEN I have items in my wishlist, WHEN I move them to the cart, THEN they should be added to the cart with the same details.
GIVEN I have items in my cart, WHEN I move them to my wishlist, THEN they should be removed from the cart and saved in my wishlist.

**Edge Cases**:

If the wishlist is full, the user should receive an error or warning.
Moving items from wishlist to cart should retain all item details (e.g., size, color).

**Dependencies**: US-001 (Shopping Cart Management), US-002 (Persistent Cart)

### US-007: Multi-Currency (Basic)

As a shopper,
I want to see prices in my preferred currency (USD, SGD, EURO, INR),
So that I can better understand the cost of my purchase.

**Priority**: Should Have

**Estimate**: 5 Story points

Acceptance Criteria:

GIVEN I am viewing the cart, WHEN I select a currency (USD, SGD, EURO, INR), THEN the prices should be displayed in the selected currency.
GIVEN I select a different currency, WHEN I view the cart, THEN the prices should update according to the exchange rate.
GIVEN the base currency is set, WHEN I view prices in any other currency, THEN the conversion logic should apply consistently.

**Edge Cases**:

Currency conversion should be consistent and based on current exchange rates.
Prices should round to two decimal places for currency values.

**Dependencies**: US-001 (Shopping Cart Management)

---

