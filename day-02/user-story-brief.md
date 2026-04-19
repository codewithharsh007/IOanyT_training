# API Spec Exercise — User Story Brief

## Your Task

Starting from the user story below, produce a **complete API specification** using Claude Code. You should iterate with Claude through multiple rounds to refine the spec.

---

## User Story

> **As a user, I want to search products by name so I can find what I need quickly.**

---

## Context

You're building a product search API for an e-commerce platform called "ShopEasy." The platform has ~50,000 products across 200 categories. The search needs to be fast (< 200ms) and support partial matching (typing "head" should find "headphones").

## What Your API Spec Must Include

1. **Endpoint definition** (method, URL, query parameters)
2. **Request format** (headers, query params, body if applicable)
3. **Response format** (JSON structure with example)
4. **Error responses** (what happens when things go wrong)
5. **Edge cases** (empty search, special characters, very long queries)
6. **Pagination** (how to handle 1000+ results)
7. **Performance notes** (what makes this fast at 50K products)

## Deliverable

Push your completed API spec to your branch in the workshop repo as `day-2/api-spec.md`.

## Evaluation Focus

- How many prompt iterations did you need?
- Did you think of edge cases BEFORE Claude suggested them?
- Is the spec complete enough for a developer to implement from?
