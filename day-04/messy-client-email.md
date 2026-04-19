# Messy Client Email — Requirements Extraction Exercise

**Instructions**: Read this email from the client. Extract requirements, identify contradictions, and generate clarifying questions.

---

**From**: Raj Mehta, VP Product at GreenGrocers
**To**: IOanyT Development Team
**Subject**: RE: RE: FW: Shopping cart thing — URGENT!!!

Hi team,

So we need this shopping cart feature ASAP. Our competitor launched theirs last week and our CEO is NOT happy. Here's what we need:

The cart should work like Amazon's cart basically. Users add items, see their cart, and checkout. Simple right?

A few things:
- We need it by end of month (that's 3 weeks from now)
- It has to work on mobile AND desktop
- Oh and Priya from finance says we need to support multiple currencies because we're launching in Singapore next quarter. Actually she said next month. Either way we need it.
- The cart should save even if the user closes the browser (Ravi from engineering mentioned something about local storage? Or was it session storage? Whatever works)
- We need a wishlist too. Or wait, maybe that's phase 2. Let me check with the CEO. Actually just include it, he'll probably want it.
- Discount codes are a MUST. We promised our marketing team.
- Priya also wants the cart to show estimated tax and shipping. But we don't have shipping rates yet from our logistics partner. Can you use placeholder values?
- One more thing — our current checkout uses Razorpay but the CEO saw a demo of Stripe and now wants to switch. But Razorpay has a 2-year contract. So maybe support both? Or just Razorpay for now and make it easy to switch later.

Oh I almost forgot — our mobile app is React Native and the website is Next.js. The cart needs to sync between both. Ravi says the API should be the same but I'm not sure what that means.

Timeline again: end of month. Non-negotiable. The CEO is presenting at a conference.

Budget: whatever it takes (but also please keep it reasonable, we just had layoffs)

Let me know if you have questions. Actually don't have too many questions, just build it.

Thanks,
Raj

P.S. Can you also look into why the product page is slow? Unrelated but it's been bugging me.
