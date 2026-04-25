"""ShopEasy Checkout — Bug Hunting Exercise."""

from flask import Flask, jsonify, request, render_template_string

app = Flask(__name__)

# In-memory cart
# bug 1,5,6
# CART = [
#     {'id': 1, 'name': 'Wireless Headphones', 'price': 79.99, 'quantity': 1},
#     {'id': 2, 'name': 'Phone Case', 'price': 14.99, 'quantity': 2},
#     {'id': 3, 'name': 'USB-C Cable', 'price': 9.99, 'quantity': 3},
# ]

# bug 2
# CART = [
#   {'id': 1, 'name': 'Laptop', 'price': 3000, 'quantity': 3},
#   {'id': 2, 'name': 'Monitor', 'price': 1200, 'quantity': 2}
# ]

# bug 3
# CART = [
#   {'id': 1, 'name': 'Cable', 'price': 10, 'quantity': 1}
# ]

# bug 4
CART = [
  {'id': 1, 'name': 'Item A', 'price': 100, 'quantity': 1},
  {'id': 2, 'name': 'Item B', 'price': 20, 'quantity': 1},
  {'id': 3, 'name': 'Item C', 'price': 5, 'quantity': 1}
]

VALID_CODES = {
    'SAVE10': {'type': 'percent', 'value': 10},
    'SAVE20': {'type': 'percent', 'value': 20},
    'FLAT25': {'type': 'fixed', 'value': 25},
    'WELCOME15': {'type': 'percent', 'value': 15},
    'BOGO': {'type': 'bogo', 'value': 0},
}


def calculate_subtotal():
    # BUG 1: Doesn't multiply by quantity
    return sum(item['price'] for item in CART)


def apply_tiered_discount(subtotal):
    if subtotal >= 200:
        return subtotal * 0.15
    elif subtotal >= 100:
        return subtotal * 0.10
    elif subtotal >= 50:
        return subtotal * 0.05
    return 0


def apply_coupon(subtotal, code):
    code = code.upper()
    if code not in VALID_CODES:
        return 0, 'Invalid coupon code'

    coupon = VALID_CODES[code]

    if coupon['type'] == 'percent':
        discount = subtotal * (coupon['value'] / 100)
        # BUG 2: No maximum cap ($500 max per spec)
        return discount, None

    elif coupon['type'] == 'fixed':
        # BUG 3: Can make total negative (should floor at 0)
        return coupon['value'], None

    elif coupon['type'] == 'bogo':
        if len(CART) < 2:
            return 0, 'BOGO requires 2+ items'
        # BUG 4: Gets most expensive instead of cheapest
        prices = sorted([item['price'] for item in CART], reverse=True)
        return prices[0], None

    return 0, 'Unknown discount type'


def calculate_tax(amount):
    # BUG 5: Tax rate is 18% but applied as 1.8% (0.018 instead of 0.18)
    return round(amount * 0.018, 2)


def calculate_shipping(subtotal_after_discount):
    # BUG 6: Free shipping threshold check uses pre-discount subtotal condition
    # but the spec says "after discounts"
    base_shipping = 5.99
    if calculate_subtotal() > 75:  # Should use subtotal_after_discount
        return 0
    return base_shipping


@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify({
        'items': CART,
        'subtotal': calculate_subtotal(),
    })


@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.get_json() or {}
    coupon_code = data.get('coupon_code', '')
    shipping_address = data.get('shipping_address', {})

    # BUG 7: No validation on shipping address (can be empty)

    subtotal = calculate_subtotal()
    tiered_discount = apply_tiered_discount(subtotal)
    after_tiered = subtotal - tiered_discount

    coupon_discount = 0
    coupon_error = None
    if coupon_code:
        coupon_discount, coupon_error = apply_coupon(after_tiered, coupon_code)

    after_coupons = after_tiered - coupon_discount
    tax = calculate_tax(after_coupons)
    shipping = calculate_shipping(after_coupons)

    # BUG 8: No validation on shipping address (can be empty)
    total = after_coupons + tax + shipping

    return jsonify({
        'subtotal': round(subtotal, 2),
        'tiered_discount': round(tiered_discount, 2),
        'coupon_discount': round(coupon_discount, 2),
        'coupon_error': coupon_error,
        'tax': tax,
        'shipping': shipping,
        'total': round(total, 2),
        'order_valid': total >= 10,  # Should check after_coupons >= 10
    })


@app.route('/')
def index():
    return render_template_string('''
    <h1>ShopEasy Checkout</h1>
    <p>Test the checkout API:</p>
    <pre>
    GET  /api/cart              — View cart
    POST /api/checkout          — Process checkout
         Body: {"coupon_code": "SAVE10", "shipping_address": {...}}
    </pre>
    <p>Try with curl or Postman.</p>
    ''')


if __name__ == '__main__':
    app.run(debug=True, port=5002)
