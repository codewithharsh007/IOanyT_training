# devops-output.md

# Infrastructure and DevOps Design Document

---

## 1. Document Metadata

* Version: 1.1
* Date: 2026-04-28
* Author: DevOps Engineer
* Input Sources:

  * eng-output.md (v1.0 updated)
  * qa-output.md (v1.1 updated)
  * ux-output.md (v2.0 updated)
  * pm-output.md (v1.3 unchanged)

---

## 2. Environment Strategy

| Environment | Purpose                                 | Access Level          | Data Policy                    |
| ----------- | --------------------------------------- | --------------------- | ------------------------------ |
| Development | Feature development + local integration | Dev team only         | Mock/synthetic data            |
| Staging     | QA + integration validation             | Dev + QA              | Sanitized production-like data |
| Production  | Live system for end users               | Restricted (Ops only) | Real user data with encryption |

---

## 3. Infrastructure Architecture

### Compute Layer

* Frontend: React 18 + Vite static build served via CDN
* Backend: Node.js 20 + Express 4 containerized service
* Workers: Email service (Nodemailer async worker)
* Database: MongoDB (replicated managed cluster)

---

### Frontend Hosting & Static Assets

* Hosting Strategy: CDN-backed static hosting
* Deployment: CI/CD push → CDN invalidation
* Cache Strategy:

  * Hashed assets (immutable caching)
  * CDN purge on release
* Optimization:

  * Code splitting (Vite)
  * Lazy loading routes
  * Image compression
  * Minification

---

### Storage Layer

* MongoDB:

  * Users, tasks, auth data
  * Replica set for HA
  * Backup enabled daily
* Backup retention:

  * 7–30 days rolling backup

---

### Networking

* VPC-based isolation
* Private subnet:

  * Backend + Database
* Public subnet:

  * Load balancer + CDN edge
* Load Balancer:

  * Routes API traffic to backend containers
* HTTPS:

  * TLS termination at edge/load balancer
* DNS:

  * Managed routing for frontend + API

---

### External Dependencies

| Service            | Type     | Purpose                   | Failover Plan            |
| ------------------ | -------- | ------------------------- | ------------------------ |
| SMTP Provider      | External | Email verification system | Retry + fallback SMTP    |
| CDN Provider       | External | Frontend asset delivery   | Multi-region fallback    |
| Container Registry | External | Image storage             | Mirror registry fallback |

---

## 4. CI/CD Pipeline Design

### Pipeline Stages

| Stage             | Trigger         | Actions                | Gate / Pass Condition       |
| ----------------- | --------------- | ---------------------- | --------------------------- |
| Commit            | Push/PR         | Lint + static checks   | No lint errors              |
| Build             | Commit          | Build backend/frontend | Build success               |
| Unit Tests        | Build           | Jest/Vitest tests      | 100% pass required          |
| Integration Tests | Build           | Supertest API tests    | ≥95% pass                   |
| Security Scan     | Build           | Dependency scan        | No critical vulnerabilities |
| Artifact Build    | After tests     | Docker image build     | Success                     |
| Staging Deploy    | Merge to main   | Deploy to staging      | Health check pass           |
| System Testing    | QA execution    | Full system validation | 0 critical bugs             |
| UAT               | Business review | Functional validation  | Sign-off required           |
| Production Deploy | Post-UAT        | Rolling deployment     | Health checks OK            |
| Regression        | Post-deploy     | Cypress UI regression  | ≥98% pass                   |

---

### Branch Strategy

* Strategy: Trunk-based development
* Reason:

  * Fast delivery cycle (MVP requirement)
  * Reduced merge complexity
  * Continuous integration aligned with QA gates

---

## 5. Frontend Build Pipeline

| Step     | Action                | Tool           | Gate            |
| -------- | --------------------- | -------------- | --------------- |
| Install  | Dependency install    | npm/yarn       | Success         |
| Build    | Vite production build | Vite           | No build errors |
| Test     | Unit/UI tests         | Vitest/Jest    | Pass required   |
| Optimize | Bundle + minify       | Vite           | Size threshold  |
| Deploy   | CDN upload            | CI/CD pipeline | Success         |

---

## 6. Backend Build Pipeline

| Step    | Action             | Tool           | Gate               |
| ------- | ------------------ | -------------- | ------------------ |
| Install | Dependency install | npm            | Success            |
| Lint    | Code quality check | ESLint         | No errors          |
| Test    | API/unit tests     | Jest/Supertest | 100% pass          |
| Build   | Docker image       | Docker         | Success            |
| Scan    | Security scan      | SAST tool      | No critical issues |
| Deploy  | Container deploy   | Orchestrator   | Health check OK    |

---

## 7. Deployment Strategy

* Strategy: Rolling Deployment

### Justification

* Minimal downtime acceptable for MVP
* Cost efficient (aligned with ₹3.5L constraint)
* Simpler rollback vs blue-green

### Rollback Trigger

* API failure rate > threshold
* Health check failure
* Regression test failure
* Elevated error rate (>2%)

### Rollback Method

1. Detect failure via monitoring
2. Stop current deployment
3. Redeploy last stable container
4. Validate health endpoints
5. Notify DevOps + QA

---

## 8. Infrastructure-as-Code (IaC)

* Tooling: Terraform-like declarative approach

### Structure

/infra
/environments
/dev
/staging
/prod
/modules
/network
/compute
/database
/cdn

### State Management

* Remote state storage
* State locking enabled

### Secrets Management

* Central secret manager
* No secrets in codebase
* Rotation enabled

---

## 9. Configuration Management

| Config           | Storage           | Rotation   | Access       |
| ---------------- | ----------------- | ---------- | ------------ |
| JWT Secret       | Secret manager    | 90 days    | Backend only |
| DB URI           | Secret manager    | On change  | Restricted   |
| SMTP credentials | Secret manager    | 60–90 days | Backend only |
| Env variables    | CI/CD environment | Versioned  | Role-based   |

---

## 10. Monitoring & Observability

### Metrics

| Metric       | Source   | Threshold    | Severity |
| ------------ | -------- | ------------ | -------- |
| API latency  | Backend  | >500ms (p95) | High     |
| Error rate   | API logs | >2%          | Critical |
| CPU usage    | Infra    | >80%         | Medium   |
| Memory usage | Infra    | >75%         | Medium   |
| DB latency   | MongoDB  | >200ms       | High     |

---

### Frontend Monitoring

| Metric           | Source        | Threshold    |
| ---------------- | ------------- | ------------ |
| Page load time   | RUM           | >3s          |
| JS errors        | Browser logs  | >1% sessions |
| API failure rate | Frontend logs | >2%          |

---

### Logging

| Layer    | Level         | Retention | System           |
| -------- | ------------- | --------- | ---------------- |
| Backend  | Info/Error    | 30 days   | Central logging  |
| Frontend | Error         | 14 days   | RUM logs         |
| Infra    | Warning/Error | 30 days   | Monitoring stack |

---

### Alerting

| Alert        | Condition         | Channel     | Runbook        |
| ------------ | ----------------- | ----------- | -------------- |
| API failure  | >2% errors        | Slack/Email | Runbook-API    |
| Service down | Health check fail | PagerDuty   | Runbook-Outage |
| DB latency   | >200ms            | Slack       | Runbook-DB     |

---

## 11. SLA / SLO Targets

| Service   | Availability | Latency (p99) | Error Rate |
| --------- | ------------ | ------------- | ---------- |
| Auth APIs | 99.5%        | <500ms        | <2%        |
| Task APIs | 99.5%        | <500ms        | <2%        |
| Frontend  | 99.9%        | <2s           | <1%        |
| Database  | 99.9%        | <200ms        | <1%        |

---

## 12. Security & Compliance

| Area          | Control                      |
| ------------- | ---------------------------- |
| Network       | VPC isolation                |
| Data          | Encryption at rest + transit |
| Auth          | JWT + secure secrets         |
| Access        | IAM least privilege          |
| Rate limiting | API gateway throttling       |
| Secrets       | Central vault                |

---

## 13. Backup & Disaster Recovery

| Asset   | Backup          | Retention | RTO   | RPO    |
| ------- | --------------- | --------- | ----- | ------ |
| MongoDB | Daily snapshots | 7–30 days | 2 hrs | 15 min |
| Configs | Versioned       | 30 days   | 1 hr  | 5 min  |
| Logs    | Continuous      | 30 days   | N/A   | N/A    |

---

## 14. Operational Runbooks

### API Failure

* Detect: Health check failure
* Steps:

  1. Check logs
  2. Verify DB connectivity
  3. Rollback deployment
  4. Restart service

---

### High Error Rate

* Detect: >2% errors
* Steps:

  1. Identify faulty release
  2. Rollback
  3. Patch issue
  4. Re-deploy

---

### Database Latency

* Detect: >200ms
* Steps:

  1. Inspect queries
  2. Optimize indexes
  3. Scale DB if needed

---

## 15. Assumptions

| ID | Assumption                | Risk                  |
| -- | ------------------------- | --------------------- |
| A1 | Moderate traffic load     | Scaling risk          |
| A2 | Stable SMTP provider      | Email delays          |
| A3 | CDN required for UX       | Cost increase         |
| A4 | Rolling deploy sufficient | Minimal downtime risk |

---

## 16. Blocked / Deferred Items

| Item                  | Reason                   |
| --------------------- | ------------------------ |
| Admin system infra    | Not defined in ENG       |
| Advanced load testing | Out of scope QA          |
| Password reset infra  | Missing UX + ENG support |

---

## 17. Traceability Matrix

| Infra Component | ENG Component   | NFR           |
| --------------- | --------------- | ------------- |
| Backend API     | Node.js service | Availability  |
| CDN             | React frontend  | Performance   |
| MongoDB         | Database schema | Persistence   |
| CI/CD pipeline  | Full system     | Reliability   |
| Monitoring      | Logs + metrics  | Observability |
| Secrets manager | Auth system     | Security      |

