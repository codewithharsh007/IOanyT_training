# Snippet 3: Order Report Generator
# Review this code for issues.

def generate_order_report(order_ids):
    """Generate a sales report for given orders."""
    import sqlite3

    conn = sqlite3.connect('shop.db')
    report = []

    for order_id in order_ids:
        # N+1 query problem: one query per order
        order = conn.execute(
            'SELECT * FROM orders WHERE id = ?', (order_id,)
        ).fetchone()

        if order:
            # Another query per order for items
            items = conn.execute(
                'SELECT * FROM order_items WHERE order_id = ?', (order_id,)
            ).fetchall()

            # Yet another query per order for customer
            customer = conn.execute(
                'SELECT * FROM customers WHERE id = ?', (order['customer_id'],)
            ).fetchone()

            total = 0
            for item in items:
                # And ANOTHER query per item for product name
                product = conn.execute(
                    'SELECT name FROM products WHERE id = ?', (item['product_id'],)
                ).fetchone()
                total += item['quantity'] * item['price']

            report.append({
                'order_id': order_id,
                'customer': customer['name'] if customer else 'Unknown',
                'total': total,
                'item_count': len(items),
            })

    conn.close()
    return report



"""
Snippet 3 Review — Order Report Generator

1. Structure & Readability
- [Minor] Function name is clear and descriptive
- [Minor] Variable names are generally meaningful
- [Minor] Inline import (`sqlite3`) inside function
- [Major] Function handles DB access + business logic + aggregation (multiple responsibilities)
- [Minor] Repeated query patterns reduce readability

Impact:
- Harder to test and maintain
- Violates separation of concerns

--------------------------------------------------

2. Logic & Correctness
- [Major] Assumes `order`, `item`, `customer` rows support dict-style access (`row['field']`) → not default in sqlite3
- [Minor] Product query result is unused (name fetched but never used)
- [Minor] No handling if `order_ids` is empty
- [Minor] Silent skipping of missing orders (may hide issues)

Impact:
- Potential runtime errors depending on DB config
- Unnecessary queries
- Hidden data inconsistencies

--------------------------------------------------

3. Edge Cases & Error Handling
- [Major] No error handling for DB connection or query failures
- [Major] Connection not safely closed if exception occurs (no try/finally or context manager)
- [Minor] No validation for `order_ids` (None, non-iterable, large input)
- [Minor] No handling for missing related data (e.g., broken foreign keys beyond simple fallback)

Impact:
- Resource leaks (open DB connections)
- Crashes on DB errors
- Unpredictable behavior with bad input

--------------------------------------------------

4. Security
- [Minor] Uses parameterized queries → good (prevents SQL injection)
- [Minor] No exposure of sensitive data in current logic
- [Minor] No input validation on `order_ids`

Impact:
- Generally safe, but input validation should still be enforced upstream

--------------------------------------------------

5. Performance
- [Critical] Severe N+1 query problem:
    - 1 query per order
    - 1 query per order (items)
    - 1 query per order (customer)
    - 1 query per item (product)
- [Major] Total queries grow exponentially with number of orders/items
- [Major] No batching or joins used
- [Major] Inefficient for large datasets

Impact:
- Extremely slow at scale
- High database load
- Not production viable for real systems

--------------------------------------------------

Severity Summary:
- Critical: 1 (N+1 query problem)
- Major: Multiple (connection handling, assumptions, architecture)
- Minor: Several

--------------------------------------------------

Recommended Fix Focus:
- Eliminate N+1 queries using JOINs or batch queries
- Fetch all required data in as few queries as possible
- Separate DB access from report generation logic
- Use proper row factory if dict-style access is required
- Add error handling and safe connection management (context manager)
- Validate `order_ids` input
- Remove unused queries (product name if not needed)
- Consider aggregation at DB level (SUM, COUNT) instead of Python loops
"""