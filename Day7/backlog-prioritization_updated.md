# HealthTrack Sprint Prioritization (RICE Framework)

## 1. RICE Table

| # | Feature | Reach | Impact | Confidence | Effort (SP) | RICE Score | Priority Rank |
|---|--------|-------|--------|------------|-------------|------------|--------------|
| 15 | Fix notification permission dialog | 90 | 3 | 1.0 | 1 | 270.0 | 1 |
| 8 | Fix timezone bug in streak counter | 50 | 3 | 1.0 | 1 | 150.0 | 2 |
| 2 | Fix crash on Samsung Galaxy S22 | 80 | 3 | 1.0 | 2 | 120.0 | 3 |
| 11 | Performance optimization (app launch time) | 100 | 3 | 0.9 | 3 | 90.0 | 4 |
| 5 | Push notification for workout reminders | 85 | 2 | 0.9 | 3 | 51.0 | 5 |
| 9 | Onboarding tutorial redesign | 70 | 2 | 0.8 | 5 | 22.4 | 6 |
| 7 | In-app purchase for premium features | 70 | 3 | 0.8 | 8 | 21.0 | 7 |
| 14 | Add heart rate zone training | 55 | 2 | 0.8 | 5 | 17.6 | 8 |
| 10 | Add yoga and stretching category | 65 | 1 | 0.8 | 3 | 17.3 | 9 |
| 13 | Offline mode (sync when back online) | 60 | 3 | 0.7 | 8 | 15.8 | 10 |
| 4 | Dark mode | 60 | 1 | 0.9 | 5 | 10.8 | 11 |
| 1 | Social sharing (workouts to social media) | 40 | 1 | 0.8 | 5 | 6.4 | 12 |
| 6 | Export data as CSV | 10 | 1 | 0.9 | 2 | 4.5 | 13 |
| 12 | Admin dashboard for support team | 20 | 2 | 0.8 | 8 | 4.0 | 14 |
| 3 | Apple Watch integration | 30 | 2 | 0.8 | 13 | 3.7 | 15 |

---

## 2. Sprint Selection (30 SP Total)

### Selected Features

| Feature | SP | Reason |
|--------|----|--------|
| Fix crash (Samsung S22) | 2 | Critical stability issue affecting 8% users |
| Fix timezone bug | 1 | Prevents streak loss (trust-critical) |
| Fix notification permission UX | 1 | Improves acquisition funnel |
| Performance optimization | 3 | Core app speed improvement |
| Push notifications | 3 | Retention & engagement driver |
| Onboarding redesign | 5 | Improves activation rate (currently 30%) |
| Yoga & stretching category | 3 | Expanding user segment |
| Dark mode | 5 | High user demand UX feature |
| Social sharing | 5 | Growth/virality loop |
| Export CSV | 2 | Enterprise/power user retention |

### Total: **30 SP**

---

## 3. Trade-offs (Excluded Features)

### Not included:

- **Apple Watch integration (13 SP)** → Too large for sprint, high complexity
- **Offline mode (8 SP)** → Requires major sync architecture change
- **In-app purchase (8 SP)** → Revenue critical but dependency-heavy
- **Heart rate zones (5 SP)** → Lower marginal impact vs selected features
- **Admin dashboard (8 SP)** → Internal tool, not user-impacting this sprint

---

## 4. Executive Summary

We prioritized features that maximize **system-wide user impact per engineering effort within 30 SP capacity**.

Instead of focusing on high-effort platform expansions like Apple Watch integration or offline mode, we focused on:

- Fixing **core stability issues (crashes, timezone bugs)**
- Improving **activation and retention (onboarding + notifications + performance)**
- Enhancing **daily engagement (social sharing, yoga category, dark mode)**

This ensures immediate improvements in **retention, trust, and engagement metrics**, while deferring large architectural investments to future dedicated sprints.