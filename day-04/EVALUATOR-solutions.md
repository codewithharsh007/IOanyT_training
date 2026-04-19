# Day 4 — Evaluator Solutions & Notes

**Confidential — Evaluators Only**

---

## Messy Email — Key Contradictions to Find

1. **Singapore launch timing**: "next quarter" vs "next month" — which is it?
2. **Wishlist scope**: "phase 2" vs "just include it" — contradictory
3. **Payment gateway**: Razorpay (2-year contract) vs CEO wants Stripe
4. **Budget**: "whatever it takes" vs "keep it reasonable, we just had layoffs"
5. **Timeline**: 3 weeks for a feature comparable to Amazon's cart — unrealistic
6. **Cart persistence**: "local storage or session storage" — these have very different behaviors

## Requirements Candidates Should Extract

**Must Have**: Add to cart, view cart, checkout with Razorpay, mobile+desktop, cart persistence, discount codes
**Should Have**: Multi-currency, estimated tax/shipping (with placeholder), Stripe abstraction layer
**Could Have**: Wishlist, cart sync between web and mobile
**Out of Scope**: Product page performance (unrelated), full Stripe migration

## Clarifying Questions (Good Ones)

1. What's the exact Singapore launch date? (Impacts currency requirement urgency)
2. Is Razorpay contract breakable? What's the penalty? (Payment gateway decision)
3. What does "cart like Amazon" mean specifically? (Scope definition)
4. Who is the decision-maker — Raj, Priya, CEO, or Ravi? (RACI)
5. Can we phase the delivery? MVP by conference, full by end of quarter?

## What to Evaluate

| Behavior | Score Impact |
|----------|-------------|
| Found 4+ contradictions | Strong positive |
| Generated 5+ clarifying questions | Strong positive |
| Accepted everything at face value | Red flag |
| Challenged the 3-week timeline | Shows maturity |
| Prioritized using a framework (MoSCoW) | Process thinking |
