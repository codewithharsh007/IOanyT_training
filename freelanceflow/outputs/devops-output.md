# `devops-output.md`

# Infrastructure and DevOps Design Document

## 1. Document Metadata
- **Version:** 1.0
- **Date:** April 29, 2026
- **Author:** DevOps Engineer
- **Input Sources:** eng-output.md (v1.0), qa-output.md (v1.0), ux-output.md (v2.0), ba-output.md (v2.0)
- **Frontend Platform:** Vercel
- **Backend Platform:** Render

---

## 2. Environment Strategy

| Environment | Purpose | Access Level | Data Policy |
|-------------|---------|--------------|-------------|
| Development (local) | Individual developer feature work | Developer only (localhost) | Seeded fake data only; no real user data |
| Staging | Pre-production integration testing, QA gates, product review | Team internal + CI/CD pipeline | Anonymized/seeded data only; mirrors production schema |
| Production | Live system serving real users | Public (frontend); restricted (backend admin routes) | Real user data; full audit logging; backups enabled |

---

## 3. Infrastructure Architecture

### Compute

| Component | Platform | Specification |
|-----------|----------|---------------|
| Frontend (React + Vite SPA) | Vercel | Serverless static hosting; global Edge CDN auto-provisioned by Vercel; zero cold starts |
| Backend API (Node.js + Express) | Render Web Service | Containerized Web Service; region: Oregon (US West); auto-deploy on push to `main`; free tier → upgrade to Starter ($7/mo) for always-on (no spin-down) |
| Background Jobs (overdue invoice cron) | Render Cron Job | Separate Render Cron Job service; schedule: `0 1 * * *` (1:00 AM UTC daily); runs overdue invoice status check |
| MongoDB Database | MongoDB Atlas (Free M0 → M10 for production) | Shared cluster for dev/staging; dedicated M10 cluster for production; region: same as backend (US West) |

---

### Frontend Hosting & Static Assets

- **Hosting Strategy:** Vercel static deployment; SPA output from `vite build` deployed to Vercel global CDN automatically on every push to `main` (production) and every PR (preview deployments)
- **Preview Deployments:** Every pull request gets a unique Vercel preview URL — no manual staging deploy needed for frontend reviews
- **Cache Invalidation Strategy:** Vercel automatically invalidates CDN cache on every deployment via unique content-hashed asset filenames (Vite default); HTML entry points set to `Cache-Control: no-cache` so users always get the latest shell
- **Asset Optimization:**
  - Vite build produces code-split chunks per route automatically
  - Images optimized at source (Cloudinary handles user-uploaded images per eng-output.md)
  - `gzip`/`brotli` compression handled by Vercel CDN layer automatically
- **Environment Variables:** Injected at build time via Vercel project settings; only `VITE_API_BASE_URL` required (points to Render backend URL)

---

### Storage

| Type | Platform | Purpose | Retention Policy |
|------|----------|---------|-----------------|
| Primary Database | MongoDB Atlas | All application data (Users, Clients, Projects, Invoices, TimeLogs, PaymentLedger, AuditLog, InviteTokens) | Indefinite (financial records); AuditLog append-only — never deleted |
| File Storage (PDFs, avatars) | Cloudinary | Invoice PDF storage, user avatar uploads | PDFs retained minimum 7 years (financial compliance); avatars until user deletion |
| In-Memory Cache | Render service memory (Node.js) | JWT refresh token blacklist (in-memory Map or Redis if upgraded) | Cleared on service restart; see DA-001 assumption |

---

### Networking

| Layer | Implementation |
|-------|----------------|
| DNS — Frontend | Vercel auto-manages DNS for custom domain; CNAME points to Vercel CDN |
| DNS — Backend | Render auto-assigns `[service-name].onrender.com`; custom domain available via Render dashboard |
| HTTPS / TLS | Vercel: auto-provisioned Let's Encrypt cert for all domains; Render: auto-provisioned TLS for all web services |
| CORS | Backend `cors` middleware configured to allow only Vercel frontend origin (`FRONTEND_URL` env var) and portal subdomain; all other origins blocked |
| Rate Limiting | Handled at Express middleware layer (`express-rate-limit`); no external gateway required at current scale |
| Load Balancing | Render auto-handles horizontal scaling on paid plans; not required on Starter tier at current scale |

---

### External Dependencies

| Service | Type | Purpose | Failover Plan |
|---------|------|---------|---------------|
| MongoDB Atlas | Managed DBaaS | Primary data store | Atlas M10+ has built-in replica sets (1 primary + 2 secondaries); automatic failover < 30 seconds |
| Cloudinary | Managed media CDN | PDF and image storage/serving | If Cloudinary unavailable: PDF generation falls back to streaming response (not stored); alert fires; no user data lost |
| Render | PaaS (Backend) | API server hosting | No automatic multi-region failover at Starter tier; manual redeploy on Render incident |
| Vercel | PaaS (Frontend) | SPA static hosting + CDN | Vercel 99.99% SLA; CDN multi-region by default; no failover action needed |
| SMTP Provider (e.g. Resend or SendGrid) | Email delivery | Invite emails, verification emails | If SMTP fails: operation succeeds in DB; email delivery retried up to 3 times; alert fired on 3rd failure |

---

## 4. CI/CD Pipeline Design

### Branch Strategy

**GitFlow (simplified):**
- `main` → Production (Vercel + Render auto-deploy)
- `staging` → Staging environment
- `feature/*` → Developer branches; PRs open against `staging`
- `hotfix/*` → Branches from `main`; merged directly to `main` + back-merged to `staging`

**Justification:** FreelanceFlow is a financial system. Direct-to-main pushes without review are prohibited. All code must pass CI gates before merging.

---

### Backend Build Pipeline

| Step | Action | Tool | Gate / Pass Condition |
|------|--------|------|-----------------------|
| 1 | Checkout code | Git | Always runs |
| 2 | Install dependencies | `npm ci` | Exit 0; lock file must exist |
| 3 | Lint | ESLint | 0 errors (warnings allowed) |
| 4 | Unit tests | Jest | 100% of tests pass; coverage ≥ 90% on `/services/` |
| 5 | Integration tests (API) | Supertest + Jest | All TC-API-xxx pass against in-memory test DB |
| 6 | Security tests | Supertest (BOLA, auth suites) | All TC-SEC-xxx pass; 0 failures allowed |
| 7 | Build check | `node --check` (or tsc if TS added) | No syntax errors |
| 8 | Deploy to Staging | Render deploy hook (staging service) | HTTP 200 on `/health` endpoint within 60s of deploy |
| 9 | Smoke test (staging) | curl / Supertest against staging URL | POST /api/auth/login returns 200 or 401 (not 500) |
| 10 | Manual approval gate | PR review (1 approver required) | PR approved before merge to `main` |
| 11 | Deploy to Production | Render auto-deploy on merge to `main` | HTTP 200 on `/health` within 60s; p99 latency < 500ms for 5 min post-deploy |

---

### Frontend Build Pipeline

| Step | Action | Tool | Gate |
|------|--------|------|------|
| 1 | Checkout code | Git | Always runs |
| 2 | Install dependencies | `npm ci` | Exit 0 |
| 3 | Lint | ESLint | 0 errors |
| 4 | Component tests | Vitest + Testing Library | All pass |
| 5 | Build | `vite build` | Exit 0; no build errors; bundle size < 500KB gzipped |
| 6 | Deploy to Vercel Preview | Vercel CLI / GitHub integration | Vercel preview URL generated; accessible |
| 7 | Deploy to Vercel Production | Vercel auto-deploy on merge to `main` | Deployment marked "Ready" in Vercel dashboard |

---

### Deployment Strategy

- **Strategy: Rolling (Render) + Atomic (Vercel)**
  - Render deploys new container while old container serves traffic; cuts over once health check passes — zero downtime on Starter tier with single instance
  - Vercel deploys are atomic: new deployment goes live instantly as a single CDN swap; old deployment remains accessible via previous deployment URL
- **Rollback Trigger:**
  - Backend: Error rate > 5% on any endpoint within 10 minutes post-deploy, OR health check fails, OR any P1 alert fires
  - Frontend: Vercel deployment marked "Error" OR core navigation broken (detected by uptime check)
- **Rollback Method:**
  - Backend: In Render dashboard → select previous successful deploy → click "Redeploy"; takes ~90 seconds
  - Frontend: In Vercel dashboard → previous deployment → "Promote to Production"; takes ~10 seconds (instant CDN swap)

---

## 5. Infrastructure-as-Code (IaC) Approach

- **Tooling:** Since Vercel and Render are fully managed PaaS platforms, traditional IaC (Terraform, Pulumi) is optional at current scale. However, the following IaC approach is recommended for reproducibility:
  - `vercel.json` — Vercel project config committed to repo (routes, headers, rewrites)
  - `render.yaml` — Render Blueprint file committed to repo (service definitions, env var references, cron schedule)
  - MongoDB Atlas provisioning: manual via Atlas UI at this scale; migrate to Terraform Atlas provider when team grows

- **Repository Structure:**
```
/infra
  render.yaml          ← Render Blueprint (backend service + cron job)
  vercel.json          ← Vercel project config
  /scripts
    seed-staging.js    ← Staging DB seeder
    health-check.sh    ← Post-deploy smoke test script
```

- **State Management:** No Terraform state to manage at current scale (PaaS handles it). If Terraform is added later: remote state in an S3-compatible bucket with state locking.

- **Secret Management:** See Section 6.

---

## 6. Configuration Management

| Config Type | Storage Method | Rotation Policy | Access Control |
|-------------|----------------|-----------------|----------------|
| `JWT_SECRET` | Render Environment Variable (encrypted at rest) | Rotate every 90 days; rotation requires coordinated redeploy to avoid invalidating active sessions | Backend service only; never exposed to frontend |
| `MONGODB_URI` | Render Environment Variable | Rotate on credential compromise; Atlas supports instant credential rotation | Backend service only |
| `CLOUDINARY_API_KEY / SECRET` | Render Environment Variable | Rotate every 180 days or on compromise | Backend service only |
| `SMTP credentials` | Render Environment Variable | Rotate every 180 days | Backend service only |
| `VITE_API_BASE_URL` | Vercel Environment Variable (build-time) | Update when backend URL changes | Frontend build only; baked into JS bundle at build time |
| `NODE_ENV` | Render Environment Variable | Never `development` in production | Backend service |
| Staging-specific vars | Render staging service env vars (separate service) | Same as production | Staging service only |

**Rules:**
- No secret is ever committed to the Git repository
- `.env` is in `.gitignore`; `.env.example` (with placeholder values only) is committed
- Render's encrypted environment variable storage is the single source of truth for all runtime secrets

---

## 7. Monitoring & Observability

### Backend Metrics

| Metric | Source | Alert Threshold | Severity |
|--------|--------|-----------------|----------|
| API error rate (5xx) | Render logs + uptime monitor | > 1% of requests in any 5-min window | Critical |
| API p99 response time | Render metrics | > 2000ms sustained for 5 min | High |
| POST /api/auth/login latency | Render metrics | > 500ms p99 | Medium |
| GET /api/dashboard latency | Render metrics | > 800ms p99 | Medium |
| Memory usage | Render metrics | > 80% of allocated memory for 10 min | High |
| CPU usage | Render metrics | > 90% sustained for 5 min | High |
| MongoDB connection pool exhaustion | Atlas metrics | > 90% connections used | Critical |
| MongoDB query latency | Atlas performance advisor | > 100ms average on indexed queries | High |
| Cron job (overdue check) failure | Render Cron logs | Job exits non-zero | High |

---

### Frontend Monitoring

| Metric | Source | Alert Threshold | Notes |
|--------|--------|-----------------|-------|
| Vercel deployment status | Vercel webhook | Any deployment with status "Error" | Triggers immediate rollback |
| Core Web Vitals — LCP | Vercel Analytics | LCP > 2.5s | Medium; indicates CDN or bundle size issue |
| Core Web Vitals — CLS | Vercel Analytics | CLS > 0.1 | Low; layout shift |
| Frontend uptime (homepage) | External uptime monitor (UptimeRobot free tier) | Any failure to load `/` within 10s | Critical |
| JS runtime errors | Browser console (Sentry free tier recommended) | Any uncaught exception volume > 10/min | High |

---

### Logging

| Component | Log Level | Retention | Aggregation |
|-----------|-----------|-----------|-------------|
| Express API (all requests) | INFO (method, path, status, duration) | 30 days | Render log stream (built-in) |
| Express API (errors) | ERROR (stack trace, request body sanitized) | 90 days | Render log stream; export to external log service if needed |
| Auth events (login, logout, token refresh) | INFO with userId | 90 days | Render log stream |
| Payment events | INFO with invoiceId, amount, userId | 365 days (financial audit) | Render log stream + MongoDB AuditLog collection |
| Cron job execution | INFO (start time, invoices updated count, duration) | 30 days | Render Cron log |
| MongoDB slow queries | WARN (queries > 50ms) | 30 days | Atlas Performance Advisor |

**Log Format:** Structured JSON — `{ timestamp, level, service, requestId, userId, method, path, statusCode, duration, message }`

---

### Alerting

| Alert | Condition | Notification Channel | Runbook |
|-------|-----------|----------------------|---------|
| API down | Health check fails 2× in a row | Email to team lead + Slack #alerts | Runbook: API Service Down |
| High 5xx error rate | > 1% errors in 5-min window | Slack #alerts | Runbook: Elevated Error Rate |
| Payment service error | Any 500 on POST /api/invoices/:id/payments | Slack #alerts (Critical) | Runbook: Payment Failure |
| DB connection failure | MongoDB connection refused or timeout | Email + Slack #alerts | Runbook: Database Unreachable |
| Render cron job failed | Cron exit code ≠ 0 | Slack #alerts | Runbook: Cron Job Failure |
| Vercel deploy failed | Deployment status = Error | Slack #alerts | Runbook: Frontend Deploy Failed |
| Memory > 80% | Sustained 10 min | Slack #alerts | Runbook: Memory Pressure |

---

### Dashboards

1. **API Health Dashboard** — Request rate (req/min), error rate (%), p50/p95/p99 latency per endpoint, active connections
2. **Business Metrics Dashboard** — Invoices created per day, payments recorded per day, new registrations per day (sourced from AuditLog aggregation)
3. **Infrastructure Dashboard** — CPU %, memory %, DB connection pool usage, cron job last-run status
4. **Frontend Performance Dashboard** — Vercel Analytics: Core Web Vitals, page load times per route, deployment history

---

## 8. SLA / SLO Targets

| Service / Endpoint | Availability Target | Latency Target (p99) | Error Rate Threshold |
|-------------------|--------------------|-----------------------|----------------------|
| Overall API (production) | 99.5% monthly uptime | < 2000ms | < 0.5% 5xx |
| POST /api/auth/login | 99.9% | < 500ms | < 0.1% 5xx |
| GET /api/dashboard | 99.5% | < 800ms | < 0.5% 5xx |
| POST /api/invoices | 99.5% | < 500ms | < 0.1% 5xx |
| PATCH /api/invoices/:id/send | 99.5% | < 1000ms | < 0.1% 5xx |
| POST /api/invoices/:id/payments | 99.9% | < 500ms | < 0.01% 5xx (financial critical) |
| GET /api/invoices/:id/pdf | 99.0% | < 3000ms | < 1% 5xx |
| Frontend (Vercel) | 99.99% (Vercel SLA) | < 1000ms FCP | < 0.01% |
| MongoDB Atlas (M10 production) | 99.95% (Atlas SLA) | < 100ms query p99 | N/A |

---

## 9. Security & Compliance at Infrastructure Level

| Area | Control | Implementation |
|------|---------|----------------|
| TLS in transit | HTTPS enforced everywhere | Vercel and Render auto-provision and renew TLS certs; HTTP → HTTPS redirect enabled on both platforms |
| Secrets management | No plaintext secrets in code or logs | All secrets in Render/Vercel environment variables; logs sanitize request bodies before writing |
| CORS | Restrict API to known origins | `cors` middleware configured with `FRONTEND_URL` env var; all other origins receive 403 |
| Security headers | Helmet.js on all API responses | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Content-Security-Policy` set via Helmet defaults |
| MongoDB network access | IP allowlist | Atlas IP Access List: only Render outbound IPs allowed + developer IPs for local dev; `0.0.0.0/0` NOT allowed in production |
| MongoDB auth | Credential-based access | Dedicated Atlas DB user per environment (prod user ≠ staging user); least-privilege roles (readWrite on app DB only) |
| Rate limiting | express-rate-limit middleware | Login: 10 req/15min per IP; register: 5 req/hour per IP; global: 100 req/15min per IP |
| Input sanitization | express-mongo-sanitize + xss-clean | Applied to req.body AND req.query on all routes (see Bug Prediction B-010 in qa-output.md) |
| Dependency security | npm audit in CI pipeline | CI fails if any high or critical CVE found in dependencies |
| Container/service isolation | Render isolates each service in its own container | Backend and cron job run as separate Render services; no shared process space |
| Audit trail | MongoDB AuditLog collection | All financial operations logged per ba-output.md BR-05; AuditLog collection has no delete permission for app DB user |

---

## 10. Backup & Disaster Recovery

| Asset | Backup Frequency | Retention | RTO | RPO |
|-------|-----------------|-----------|-----|-----|
| MongoDB Atlas (Production M10) | Continuous cloud backup (Atlas built-in) | Daily snapshots: 7 days; Weekly: 4 weeks; Monthly: 12 months | < 4 hours (restore from snapshot) | < 1 hour (continuous backup point-in-time) |
| MongoDB Atlas (Staging) | Daily snapshot only | 3 days | < 8 hours | < 24 hours |
| Cloudinary assets (PDFs, images) | Cloudinary built-in redundancy (multi-region storage) | Indefinite until deleted | N/A (Cloudinary serves directly) | N/A |
| Application code | Git repository (GitHub) | Indefinite | < 30 min (redeploy from any commit) | 0 (code is in Git) |
| Environment variables (secrets) | Documented in team password manager (e.g. 1Password) | Indefinite | < 15 min (re-enter in Render/Vercel) | 0 (stored out-of-band) |

**Disaster Recovery Procedure (Data Loss Event):**
1. Identify last known good timestamp from Atlas backup console
2. Restore Atlas cluster to point-in-time (Atlas UI → Backup → Restore)
3. Notify affected users if financial data was altered
4. Audit AuditLog collection to identify any records created after backup point
5. Reconcile manually if < 1 hour of data lost

---

## 11. Operational Runbooks

### Runbook: API Service Down
- **Trigger Condition:** Health check `GET /health` fails 2× consecutively; alert fires to Slack #alerts
- **Severity:** Critical
- **Steps:**
  1. Check Render dashboard → FreelanceFlow API service → verify service status (Running / Failing / Deploying)
  2. If status = Failing: check "Logs" tab for last error message (OOM, crash, unhandled exception)
  3. If crash loop: roll back to previous deploy — Render dashboard → Deploys → select last successful → "Redeploy"
  4. If OOM: upgrade instance type in Render service settings; redeploy
  5. Verify recovery: `curl https://api.[domain].com/health` should return `{ "status": "ok" }`
  6. If MongoDB is unreachable (check logs for connection error): proceed to Runbook: Database Unreachable
  7. Notify team lead; document incident in incident log
- **Escalation Path:** On-call developer → Team Lead → MongoDB Atlas support (if DB issue)

---

### Runbook: Elevated Error Rate
- **Trigger Condition:** 5xx error rate > 1% in any 5-minute window
- **Severity:** High
- **Steps:**
  1. Open Render logs; filter for `"level":"error"`; identify the failing endpoint and error type
  2. If error is unhandled exception in a specific route: check if recent deploy introduced a regression
  3. If regression confirmed: roll back backend immediately (Render dashboard → previous deploy)
  4. If error is DB query failure: check Atlas metrics for query latency and connection pool; proceed to DB runbook if needed
  5. If error is upstream (Cloudinary, SMTP): check Cloudinary/SMTP provider status page; errors are non-critical for core financial flows
  6. After stabilization: create a hotfix branch; write a regression test for the failing case; deploy fix through CI pipeline
- **Escalation Path:** On-call developer → Team Lead

---

### Runbook: Payment Failure (500 on /api/invoices/:id/payments)
- **Trigger Condition:** Any 500 response on the payment endpoint
- **Severity:** Critical (financial data integrity)
- **Steps:**
  1. Check Render error logs immediately; identify stack trace
  2. Determine if payment was partially written: query `db.paymentledger.find({ invoiceId: "<id>" })` to check DB state
  3. If payment written but invoice status not updated: run `db.invoices.updateOne(...)` manually to reconcile state; create AuditLog entry manually for the correction
  4. If payment NOT written: no data corruption; fix code; redeploy
  5. Notify affected freelancer via email if their payment record is affected
  6. Roll back backend if bug is in current deploy
  7. Write regression test (TC-PERF-019 pattern) before redeploying fix
- **Escalation Path:** On-call developer → Team Lead → Manual data reconciliation if needed

---

### Runbook: Database Unreachable
- **Trigger Condition:** Backend logs show `MongoNetworkError` or `connection refused` to Atlas
- **Severity:** Critical
- **Steps:**
  1. Check MongoDB Atlas status page for cluster health
  2. Check Atlas IP Access List — confirm Render outbound IPs are still allowlisted (Render IPs can change on service restart in some configurations)
  3. If IP changed: add new Render IP to Atlas allowlist
  4. If Atlas cluster is down: wait for Atlas automatic failover (< 30s for M10 replica set); monitor Atlas dashboard
  5. If MONGODB_URI rotated and not updated in Render: update env var in Render dashboard; redeploy
  6. Verify recovery: API health check returns 200
- **Escalation Path:** On-call developer → MongoDB Atlas support (if cluster-level failure)

---

### Runbook: Cron Job Failure (Overdue Invoice Check)
- **Trigger Condition:** Render Cron Job service exits with non-zero code
- **Severity:** High
- **Steps:**
  1. Check Render Cron Job logs for error message
  2. If DB connection error: resolve using DB runbook above; manually trigger cron script via Render "Run Now"
  3. If logic error (bug): identify invoices that should have been marked Overdue by running: `db.invoices.find({ dueDate: { $lt: new Date() }, status: { $in: ["Sent","Viewed","PartiallyPaid"] } })`
  4. Manually update statuses if cron has been down > 24 hours; create AuditLog entries for each update
  5. Deploy cron job fix through standard pipeline; verify next scheduled run succeeds
- **Escalation Path:** On-call developer → Team Lead if > 48 hours of missed runs

---

### Runbook: Frontend Deploy Failed
- **Trigger Condition:** Vercel deployment status = "Error"
- **Severity:** High (new features not live; existing deployment still serving)
- **Steps:**
  1. Open Vercel dashboard → Deployments → view build log for failing deployment
  2. Common causes: ESLint error, missing env var, `vite build` failure, bundle size exceeded
  3. Fix the build error in a new commit; push to trigger new deployment
  4. Existing production deployment continues serving users uninterrupted (Vercel never replaces a good deployment with a failed one)
  5. If env var missing: add it in Vercel project settings → Environment Variables; redeploy
- **Escalation Path:** On-call frontend developer

---

## 12. DevOps Assumptions

| ID | Assumption | Basis | Risk |
|----|------------|-------|------|
| DA-001 | JWT refresh token blacklist stored in Node.js in-memory Map (not Redis) | eng-output.md does not specify a Redis instance; Render free/starter tier does not include Redis | HIGH: In-memory store is lost on service restart; all logged-out tokens become valid again until they naturally expire. Mitigation: upgrade to Redis (Render Redis add-on or Upstash) before production launch |
| DA-002 | Render Starter tier ($7/month) used for backend to avoid cold starts | Free tier spins down after 15 min inactivity; cold starts of 30–60s are unacceptable for a production financial app | MEDIUM: Cost assumption; if budget is $0, cold starts must be accepted or a keep-alive ping must be configured |
| DA-003 | MongoDB Atlas M0 (free) used for staging; M10 ($57/month) for production | M0 has no backups, no dedicated resources, shared cluster; only acceptable for non-production | LOW for staging; MEDIUM cost risk for production if budget constrained |
| DA-004 | Single Render region (US West / Oregon) for backend | eng-output.md does not specify geo-distribution requirements; ba-output.md does not mention multi-region | LOW: Acceptable for single-market launch; add Render multi-region or Cloudflare Workers proxy if latency complaints arise from non-US users |
| DA-005 | External uptime monitoring via UptimeRobot (free tier) | No monitoring platform specified in eng-output.md or pm-output.md | LOW: UptimeRobot free tier checks every 5 minutes; upgrade to paid (1-min checks) for production SLO compliance |
| DA-006 | SMTP provider not selected | ba-output.md Q2 (email delivery) left open | MEDIUM: Invite and verification emails are blocked until SMTP provider is chosen. Recommended: Resend.com (generous free tier, good Node.js SDK) |

---

## 13. Blocked / Deferred Items

| Item | Reason | Dependency |
|------|--------|------------|
| Redis for refresh token blacklist | Not provisioned; in-memory assumed per DA-001 | Engineering decision on session management strategy |
| Multi-region backend deployment | Not required at launch; deferred | PM to define geographic user base and latency SLA |
| CDN for API responses (e.g. Cloudflare) | Not needed at current scale | Revisit when > 10,000 active users |
| Infrastructure-as-Code (full Terraform) | Overkill for 2-service PaaS deployment at launch | Adopt when team > 3 engineers or when moving off Render/Vercel |
| SMTP provider selection and email delivery tests | Provider not defined in any input document | BA/ENG to resolve qa-output.md GA-010 |
| Admin user provisioning | No admin panel or admin creation flow defined | BA/ENG to resolve qa-output.md GA-008 |
| Sentry (frontend error tracking) | Recommended but not mandated; free tier available | Team decision |

---

## 14. Traceability Matrix

| Infra Component | Eng Component (eng-output.md) | NFR Addressed |
|-----------------|-------------------------------|---------------|
| Render Web Service (Node.js) | Express API server, all routes | NFR: Availability, Latency, Scalability |
| Render Cron Job | Overdue invoice status check | NFR: Data accuracy, Business Rule BR-03/US-013 |
| MongoDB Atlas M10 (prod) | MongoDB primary datastore | NFR: Data isolation, Durability, ACID for payments |
| Vercel CDN + static hosting | React + Vite SPA frontend | NFR: Frontend performance, Global availability |
| Cloudinary | PDF storage, avatar uploads | NFR: File storage, durability |
| TLS (Vercel + Render auto-cert) | All API and frontend traffic | NFR: Security — data in transit |
| Helmet.js security headers | Express middleware layer | NFR: Security headers, XSS/clickjacking protection |
| express-rate-limit middleware | Auth and global API routes | NFR: Rate limiting per ba-output.md US-003 |
| express-mongo-sanitize + xss-clean | All req.body/req.query parsing | NFR: Input sanitization, NoSQL injection prevention |
| Atlas IP Access List | MongoDB network layer | NFR: Database network security |
| Render Environment Variables | All secrets and config | NFR: Secrets never hardcoded |
| UptimeRobot external monitor | Frontend + backend health | NFR: SLO monitoring, uptime alerting |
| Atlas Continuous Backup | MongoDB production cluster | NFR: RPO < 1 hour, RTO < 4 hours |
| Git + CI pipeline unit/integration tests | All service functions and API routes | QA gates: TC-API-xxx, TC-SEC-xxx per qa-output.md |
| CI `npm audit` step | All npm dependencies | NFR: Dependency vulnerability scanning |
```