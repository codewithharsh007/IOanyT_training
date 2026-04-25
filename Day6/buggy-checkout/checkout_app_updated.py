"""ShopEasy Checkout — Production Grade Version"""

from flask import Flask, jsonify, request, g
from decimal import Decimal, ROUND_HALF_UP

app = Flask(__name__)

# =========================
# MOCK DATABASE (replace with real DB in production)
# =========================
USER_CARTS = {
    "user_1": [
        {'id': 1, 'name': 'Wireless Headphones', 'price': 79.99, 'quantity': 1},
        {'id': 2, 'name': 'Phone Case', 'price': 14.99, 'quantity': 2},
        {'id': 3, 'name': 'USB-C Cable', 'price': 9.99, 'quantity': 3},
    ]
}

VALID_CODES = {
    'SAVE10': {'type': 'percent', 'value': 10},
    'SAVE20': {'type': 'percent', 'value': 20},
    'FLAT25': {'type': 'fixed', 'value': 25},
    'WELCOME15': {'type': 'percent', 'value': 15},
    'BOGO': {'type': 'bogo', 'value': 0},
}

# =========================
# UTILITIES (FINANCIAL SAFE)
# =========================

def money(value):
    """Production-safe rounding (prevents floating point drift)."""
    return float(Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def get_user_id():
    """Mock auth layer (replace with JWT/session auth)."""
    return request.headers.get("X-USER-ID", "user_1")


# =========================
# CART SERVICE
# =========================

def get_cart():
    user_id = get_user_id()
    return USER_CARTS.get(user_id, [])


def calculate_subtotal(cart):
    """Correct subtotal with quantity."""
    return money(sum(item["price"] * item["quantity"] for item in cart))


# =========================
# DISCOUNTS
# =========================

def apply_tiered_discount(subtotal):
    if subtotal >= 200:
        return money(subtotal * 0.15)
    elif subtotal >= 100:
        return money(subtotal * 0.10)
    elif subtotal >= 50:
        return money(subtotal * 0.05)
    return 0.0


def apply_coupon(subtotal, code, cart):
    if not isinstance(code, str):
        return 0.0, "Invalid coupon format"

    code = code.strip().upper()

    if code not in VALID_CODES:
        return 0.0, "Invalid coupon code"

    coupon = VALID_CODES[code]

    if coupon["type"] == "percent":
        discount = subtotal * (coupon["value"] / 100)
        discount = min(discount, 500)  # $500 cap
        return money(discount), None

    if coupon["type"] == "fixed":
        return money(min(coupon["value"], subtotal)), None

    if coupon["type"] == "bogo":
        expanded = []
        for item in cart:
            expanded.extend([item["price"]] * item["quantity"])

        if len(expanded) < 2:
            return 0.0, "BOGO requires 2+ items"

        return money(min(expanded)), None

    return 0.0, "Unknown coupon type"


# =========================
# TAX & SHIPPING
# =========================

def calculate_tax(amount):
    return money(amount * 0.18)


def calculate_shipping(subtotal_after_discount):
    return 0.0 if subtotal_after_discount >= 75 else 5.99


# =========================
# VALIDATION
# =========================

def validate_shipping_address(addr):
    if not isinstance(addr, dict):
        return False

    required = ["line1", "city", "zip"]
    if not all(addr.get(f) for f in required):
        return False

    # basic zip validation (production: use country-specific rules)
    if not str(addr.get("zip", "")).strip().isalnum():
        return False

    return True


# =========================
# API
# =========================

@app.route("/api/cart", methods=["GET"])
def cart_api():
    cart = get_cart()
    return jsonify({
        "items": cart,
        "subtotal": calculate_subtotal(cart)
    })


@app.route("/api/checkout", methods=["POST"])
def checkout():
    data = request.get_json(silent=True) or {}

    user_id = get_user_id()
    cart = get_cart()

    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    shipping_address = data.get("shipping_address")
    if not validate_shipping_address(shipping_address):
        return jsonify({"error": "Invalid shipping address"}), 400

    coupon_code = data.get("coupon_code", "")

    # -------------------------
    # PRICING PIPELINE
    # -------------------------
    subtotal = calculate_subtotal(cart)

    tiered_discount = apply_tiered_discount(subtotal)
    after_tier = subtotal - tiered_discount

    coupon_discount, coupon_error = apply_coupon(after_tier, coupon_code, cart)

    after_coupon = max(after_tier - coupon_discount, 0)

    tax = calculate_tax(after_coupon)
    shipping = calculate_shipping(after_coupon)

    total = money(after_coupon + tax + shipping)

    # Minimum order check (business rule)
    order_valid = after_coupon >= 10

    return jsonify({
        "user_id": user_id,
        "subtotal": money(subtotal),
        "tiered_discount": tiered_discount,
        "coupon_discount": coupon_discount,
        "coupon_error": coupon_error,
        "after_discounts": after_coupon,
        "tax": tax,
        "shipping": shipping,
        "total": total,
        "order_valid": order_valid
    })


@app.route("/")
def index():
    return """
    <h2>ShopEasy Production Checkout</h2>
    <p>POST /api/checkout</p>
    """

if __name__ == "__main__":
    app.run(debug=True, port=5002)