# Delivery Plan — CloudMetrics Dashboard Implementation

---

## Project Overview

- **Project Name:** CloudMetrics Dashboard Implementation  
- **Client Name:** CloudMetrics  
- **Team Size:** 2 Developers  
- **Sprint Duration:** 2 Weeks (20 Developer-Days Total Capacity)  
- **PM:** Senior Product Manager  

---

## Feature Estimates (Refined)

| Feature | Subtasks | Estimate (dev-days) | Dependencies |
|---------|----------|---------------------|--------------|
| A. Real-Time Alert Dashboard | UI table + filters + acknowledge, alert API, state sync, testing | 4 | Core API readiness |
| B. Historical Trend Charts | Chart UI, time-series APIs, aggregation layer, export PNG, testing | 5 | Metrics data pipeline |
| C. Team-Based Access Control (MVP) | Basic RBAC, team-service mapping, auth middleware, DB schema changes | 4 | Auth system |
| D. Email + Slack Notifications | Email service integration, Slack webhooks, thresholds, UI preferences | 3 | Event trigger system |
| E. Custom Report Builder | Drag-drop UI, report engine, scheduler, PDF export, testing | 9 | Reporting infra |

---

### Capacity Summary
- **Total Available:** 20 dev-days  
- **Total Requested:** 25 dev-days  
- **Gap:** 5 dev-days (scope exceeds capacity)

---

## Sprint Plan

---

### ✅ Committed (Guaranteed Delivery)

| Feature | Dev | Days | Confidence |
|---------|-----|------|-------------|
| A. Real-Time Alert Dashboard | Dev A | 4 | High |
| B. Historical Trend Charts | Dev B | 5 | High |
| D. Email + Slack Notifications | Dev A | 3 | High |
| C. Access Control (MVP scoped) | Dev B | 4 | High |

**Total Committed:** 16 dev-days

> Remaining buffer used for integration + stabilization (4 dev-days)

---

### 🔶 Stretch (If Time Permits)

| Feature | Dev | Days | Confidence |
|---------|-----|------|-------------|
| E. Custom Report Builder (Partial: UI only or backend skeleton) | Dev A/B | 4–5 | Low |

---

### ❌ Deferred (Next Sprint)

| Feature | Reason | Risk to Client |
|---------|--------|----------------|
| E. Full Custom Report Builder | Too large (9 dev-days), requires full reporting engine + scheduler + PDF pipeline | Delays dashboard core stability if forced into sprint |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Report Builder complexity underestimated | High | High | Defer full scope, split into Phase 2 |
| Chart performance on large datasets | Medium | High | Use pre-aggregated metrics |
| RBAC integration complexity | Medium | Medium | MVP scope only (team-level access) |
| Integration overlap between APIs | Medium | Medium | Freeze API contracts early |
| Notification delivery reliability | Low | Medium | Queue-based retry system |

---

## Client Communication

---

### Core Message (Why Not Everything)

We reviewed the full scope against a fixed 20 developer-day capacity and identified a 25-day total effort requirement. Attempting to deliver all five features in this sprint would introduce unacceptable risk to system stability, particularly around reporting and access control complexity.

To maximize business value within the sprint window, we prioritized features that directly enable core dashboard usability: real-time monitoring, historical insights, alerting, and controlled access. The Custom Report Builder, while valuable, requires a significantly larger foundational architecture and is best delivered as a dedicated Phase 2 initiative to avoid compromising quality.

This approach ensures CloudMetrics receives a stable, production-ready dashboard on time, rather than a partially functional system with high post-release risk.

---

### Negotiation Strategy

#### If the client pushes:
- Offer phased delivery of Feature E:
  - Phase 1: UI skeleton or backend scaffolding
  - Phase 2: full report engine + PDF export + scheduling

#### Flexibility options:
- Reduce scope of charts export (PNG optional)
- Simplify notification preferences UI
- Delay advanced RBAC roles beyond MVP

#### Non-negotiable boundaries:
- Do not compress testing time for core features
- Do not include full Report Builder in this sprint (architectural risk too high)
- Do not expand RBAC beyond MVP scope in same sprint

---