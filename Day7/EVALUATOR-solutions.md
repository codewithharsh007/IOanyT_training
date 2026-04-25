# Day 7 — Evaluator Solutions & Notes

**Confidential — Evaluators Only**

---

## Backlog Prioritization — Strong Answers

### Bugs First (Must-Haves)
- #8 (timezone bug, 1 SP) — Users losing data, easy fix
- #2 (Samsung crash, 2 SP) — 8% users affected
- #15 (notification permission, 1 SP) — 60% deny rate, huge impact

### High-Value Next
- #9 (onboarding redesign, 5 SP) — 30% activation rate is a business problem
- #5 (workout reminders, 3 SP) — Engagement, quick win
- #11 (performance, 3 SP) — 4.2s launch time hurts retention

### Reasonable Sprint (30 SP)
Items 8, 2, 15, 9, 5, 11, 4 = 20 SP, or swap items to fill to ~30

### Red Flags in Candidates
- Picking Apple Watch (#3, 13 SP) in a 30 SP sprint — too risky
- Ignoring bugs to build features — poor prioritization
- Not considering business impact (just picking "cool" features)

---

## PM Scenario — Key Insights

### Math Reality
- 20 dev-days available (2 × 10)
- Feature estimates: A(4) + B(5) + C(6) + D(2.5) + E(8) = ~25.5 days minimum
- **Cannot deliver all 5** — good candidates realize this immediately

### Strong Plans Include
- Features A + D committed (most value per dev-day for the board presentation)
- Feature B partially committed (charts without export)
- Feature C deferred (most complex, can't rush RBAC)
- Feature E deferred (drag-and-drop builder is a month of work)

### Evaluation Criteria
| Behavior | Score |
|----------|-------|
| Identified it's impossible to deliver all 5 | Must-have |
| Made tough cuts with reasoning | Strong positive |
| Communicated "no" professionally | Communication skill |
| Over-promised ("we'll do all 5!") | Red flag |
| Suggested phasing or MVP versions | Creative problem-solving |
