# Process Mapping Template

**Team**: [Team Name / Members]

---

## Phase 1: Requirements & Discovery

**Who**: Divyanshu
**Activities**:
------------------------------------------------------------------------------
- Stakeholder alignment sessions (Owner, Managers, Ops staff) to define:
    What qualifies as negative feedback
    Expected alert behavior and response workflow

- Define core user journeys:
    Customer (QR → feedback → exit)
    Manager (login → live feedback → act)
    Owner (dashboard → trends → decisions)
    
- Finalize functional requirements:
    QR-based feedback submission
    Location-scoped dashboards
    Negative feedback alerting
    
- Define non-functional requirements:
    Submission latency (<2 sec)
    Alert latency (<5 sec)
    Availability expectations

- Resolve ambiguities from brief:
    Platform → mobile-first web app (PWA)
    Real-time → near real-time (2–5 sec)
    Multi-language → out of MVP scope

- Define data model (v1):
    Feedback, Restaurant, User (roles), Alerts

- Define alert logic:
    Thresholds (e.g., rating ≤ 2)
    Delivery channels (dashboard + optional SMS/WhatsApp)

- Create initial API contracts (feedback submission, dashboard fetch, alerts)

- Conduct risk identification workshop:
    Engagement, alert fatigue, infra limitations

----------------------------------------------------------------------------

**Outputs**:
- Product Requrement document
- User journey & flow diagrams
- Functional + Non-functional requirement spec
- Er modwl
- API contract draft (OpenAPI/Postman collection)
- Alert rules definition
- Risk register (with mitigation strategies)

---------------------------------------------------------------------------

**Duration**: 1-2 Hrs for this phase, 1-2 weeks for all phases combined.

---------------------------------------------------------------------------

**Risks**:

- Misalignment with stakeholders
    Mitigation: Early validation of flows + sign-off on PRD

- Over-scoping (feature creep)
    Mitigation: Strict MVP definition, defer non-critical features

- Incorrect definition of “negative feedback”
    Mitigation: Use simple rule initially (rating threshold), refine later

- Unclear real-time expectations
    Mitigation: Define SLA explicitly (2–5 sec latency)

- Ignoring ground realities (low engagement, staff behavior)
    Mitigation: Validate QR usage flow with actual restaurant staff

---------------------------------------------------------------------------

## Phase 2: Design & Architecture

**Who**: Vinay
**Activities**:
------------------------------------------------------------------------------
1. System Architecture Design

We define how all components interact to deliver feedback insights efficiently.

Architecture Style

3-tier architecture
Presentation layer (UI)
Application layer (Backend logic)
Database layer (Data storage)
Cloud-based scalable architecture for future expansion

High-Level Components

Customer Feedback Web App (QR-based access)
Manager Dashboard (location-specific insights)
Owner Analytics Dashboard (overall trends)
Backend API (business logic)
Database (feedback storage)
Alerting Service (real-time notifications)

2. Technology Stack Selection
-------------------------------------------------------------------------------------------------
Layer	                Technology	                Why Chosen
--------------------------------------------------------------------------------------------------
Frontend	            React.js	                fast, scalable UI
UI Styling	            Tailwind CSS	            responsive mobile-first design
Backend	                Node.js + Expres            efficient API development
Database	            PostgreSQL	                structured relational data
ORM	                    Prisma / Sequelize	        simplifies database queries
Authentication	        JWT	                        secure login mechanism
Hosting	                AWS / Vercel	            reliable cloud deployment
Notifications	        SendGrid / WhatsApp API	    real-time alerts
Analytics	            Chart.js / Recharts	        visual dashboards
QR Generation	        QRCode npm library	        unique QR per restaurant
Version                 Control	GitHub	            team collaboration
CI/CD	                GitHub Actions	            automated deployment

3. Database Design
We design structured schema to store and retrieve feedback efficiently.
Tables

Restaurant

id (Primary Key)
name
city
qr_code_url
----------

Feedback

id
restaurant_id (Foreign Key)
rating (1–5)
comment
language
created_at

----------

Manager

id
restaurant_id
email
phone_number

-----------

Alert_Log

id
feedback_id
alert_sent_at

4. API Design

Defines communication between frontend and backend.

Customer APIs
-------------
POST /api/feedback → submit feedback
GET /api/restaurants/{id} → fetch restaurant details

Manager APIs
-------------
GET /api/manager/feedback → view feedback list
GET /api/manager/alerts → view negative feedback alerts

Owner APIs
------------
GET /api/owner/dashboard → performance overview
GET /api/owner/trends → analytics insights

5. Real-time Alert Design

Ensures immediate notification for negative feedback.

Alert Logic

If rating ≤ 2 → trigger alert instantly

Alert Channels

Email notification
SMS notification
WhatsApp notification

Architecture Approach

Event-driven notification system

Tools

Node.js Event Emitter
Message queues (RabbitMQ / Kafka for scalability)

6. Multi-language Strategy

Supports customers from multiple cities with different language preferences.

Design Considerations

Feedback form supports multiple languages
Language preference stored in database
UI language toggle option

Technology

react-i18next (internationalization library)

Languages

English
Hindi
Optional regional language

7. UX Design

Defines smooth and intuitive user journeys.

Customer Flow
Scan QR → open feedback form → select rating → submit → confirmation page

Manager Flow
Login → view dashboard → monitor alerts → analyze feedback

Owner Flow
Login → analytics dashboard → compare performance trends

Tools

Figma (UI wireframes)
Miro (process flow diagrams)

8. Scalability Planning

Ensures system can support future business growth.

Future Considerations

expand from 25 → 100+ restaurants
increase feedback volume

Design Decisions

modular backend architecture
cloud hosting for flexible scaling
database indexing for faster queries
---------------------------------------------------
**Outputs**:
---------------------------------------------------
--- System Architecture Diagram
--- Database Schema Design
--- API Specification Document
--- UI Wireframes
--- Technology Stack Documentation
--- Alert Workflow Design
--- QR Code Structure Plan
--- Security Design Plan
---------------------------------------------------
**Duration**:
---------------------------------------------------
 1-2 hours for this specific phase , 7 to 8 days for full project completion.
---------------------------------------------------
**Risks**:
---------------------------------------------------
1)  Language compatibility issues
    Customers may prefer different languages
    Mitigation: use i18n support
2)  Real-time alert delays
    network or service failure may delay alerts
    Mitigation: retry mechanism and queue-based alerts
3)  Incorrect database structure
    may cause future performance issues
    Mitigation: normalized schema and indexing
4)  Spam feedback submissions   
    users may submit fake responses
    Mitigation: submission limits or captcha
5)  Scalability challenges
    future expansion may increase load
    Mitigation: cloud infrastructure and modular backend
6)  Security risks
    unauthorized dashboard access
    Mitigation: JWT authentication and role-based access
7)  Poor internet connectivity
    restaurants may have slow internet
    Mitigation: lightweight responsive UI
---------------------------------------------------


## Phase 3: Implementation

**Who**: Harsh
-----
**Activities**:
### 1. Project Setup & Delivery Foundation
- Create monorepo structure with separate apps for `customer`, `admin`, and `api` and a shared `packages/types` layer for DTO reuse across apps 
- Set up `.env` templates covering DB URL, JWT secret, mail/SMS/WhatsApp keys, and frontend API base URL — no hardcoded values anywhere 
- Configure ESLint, Prettier, Husky commit hooks, branch protection, and GitHub Actions CI pipeline for test, build, and deploy steps 
- Add centralised logging, request ID middleware, standardised error response envelope, and startup config validation 
- Seed 25 restaurant records with stable location identifiers for QR mapping and generate QR assets per location 

### 2. Authentication & Authorization
- Build login API with bcrypt password hashing, JWT issuance, short-lived token expiry, and secure logout 
- Add role-based middleware for `manager` and `owner` roles; enforce location-scoped access so managers cannot read another branch's data 
- Create user, role, and restaurant-mapping tables/relations in the database; add one owner record spanning all 25 locations 
- Build login UI, protected routes, token expiry redirect, brute-force protection on login endpoint, and sign-in audit logging 

### 3. Feedback Submission System (QR-Based Flow)
- Build QR resolution route where each QR contains a signed location token that auto-loads restaurant context without requiring customer login 
- Create mobile-first feedback form: rating selector → optional comment → submit → success screen; include duplicate-submission guard per session 
- Implement server-side validation: rating range, comment length, restaurant ID existence, and IP/device-level rate limiting 
- Sanitize comment input (strip HTML, escape special chars) before persist and before render; use ORM parameterized queries for all inserts 
- Handle edge cases: invalid/expired QR, already-disabled location, empty comment, API timeout, and network failure with clear UI fallback states 

### 4. Backend APIs & Database
- Convert all approved API contracts into route → controller → service → repository layers; keep controllers thin 
- Write Prisma/Sequelize migrations for `restaurants`, `users`, `manager_locations`, `feedback`, and `alert_log` tables 
- Add indexes on `feedback(restaurant_id, created_at)`, `feedback(rating, created_at)`, and `alert_log(feedback_id)` for dashboard read performance 
- Add pagination, date-range filtering, and sorting on feedback list endpoints; standardise response envelopes and error codes for predictable QA 
- Write seed scripts for sample feedback volume across all 25 locations to support staging demos and analytics verification 

### 5. Manager Dashboard
- Build authenticated manager dashboard with widgets: recent feedback list, negative feedback queue, average rating, daily trend sparkline, and unread alert badge 
- Set up polling every 3–5 seconds on critical widgets only; cache non-critical summary queries to reduce backend load across 25 active sessions 
- Add filters for rating, date range, alert status, and keyword search; include feedback detail drawer showing timestamp, rating, comment, and alert state 
- Enforce location scoping on every server-side query using the authenticated manager's context, not request parameters 
- Add skeleton loaders, empty states with action prompts, last-updated timestamps, and explicit retry buttons for all data widgets 

### 6. Owner Analytics Dashboard
- Build owner-only cross-location analytics dashboard: ratings by city, trend over time, top/bottom performing branches, and negative feedback volume chart 
- Create aggregation endpoints that pre-compute summaries by day, week, city, and location; avoid heavy computation on the client 
- Add date-range selectors, city/location filters, and drill-down from trend view into branch-level detail list 
- Prepare clean chart-ready response shapes; stub export service interface for future CSV download without changing controllers 
- Validate metric consistency against seeded data so averages, counts, and trend lines match expected values in QA checks 

### 7. Notification & Alert System
- Evaluate `rating ≤ 2` immediately in the feedback service layer post-insert, dispatch alert event asynchronously so submission API response stays fast 
- Create `alert_log` records with statuses: `pending → sent → failed → acknowledged`; add retry logic with exponential backoff and dead-letter error logging 
- Integrate notification providers behind a single adapter interface (email first, then SMS, then WhatsApp) to avoid vendor lock-in 
- Add per-location cooldown windows and deduplication to prevent alert storms during a bad service period 
- Surface active alerts in manager dashboard with acknowledge/resolve action to distinguish new from already-seen issues 

### 8. Security, QA Readiness & Deployment Hardening
- Apply CORS config, security headers (Helmet.js), HTTPS-only enforcement, rate limiting, and audit logs for all privileged routes 
- Write unit tests for service logic, integration tests for all API routes, role/auth tests, and end-to-end flows for: QR submission → alert trigger → manager dashboard visibility 
- Prepare QA seed packs covering: happy path, invalid QR, empty comment, max-length comment, provider failure simulation, no-data dashboard, and unauthorized route access 
- Configure structured logging, API error rate monitoring, slow-query thresholds, and notification delivery failure alerts in staging before production cut 
- Prepare deployment manifests for staging and production; run migration dry-run, rollback plan check, and smoke tests after each deployment 

**Outputs**:
---
- Working project skeleton with CI/CD, environment config structure, and seeded location + QR data 
- Secure JWT auth system with role-based middleware and location-scoped access enforcement 
- End-to-end QR-to-feedback flow: mobile-optimised form, validated submission API, restaurant-linked feedback persisted to database 
- Stable database schema with migrations, indexes, seed data, and standardised API layer covering all customer, manager, and owner routes 
- Manager dashboard with live location-specific feedback visibility, negative feedback queue, and near-real-time alert badges 
- Owner analytics dashboard with cross-location trends, city-level comparisons, and drill-down into branch performance 
- Alert engine with dashboard visibility, external provider delivery, retry-safe queue, deduplication, and alert lifecycle tracking 
- Production-ready deployment with security hardening, automated test suites, QA seed packs, monitoring, and rollback support 

**Duration**: 
---
4–5 weeks** for a small team (2–3 developers).

**Risks**:
---
### Feedback Submission Module

- Unsanitized comment input creating XSS or injection vulnerabilities (handled via server-side sanitization, encoding, and parameterized queries)
- Tampered QR tokens routing feedback to wrong location (handled via signed tokens validated server-side before DB write)
- Spam or repeated submissions affecting analytics (handled via rate limiting and session-based cooldown)

### Authentication / Authorization Module

- Misconfigured JWT exposing cross-location data (handled via strict backend authorization middleware using session context)
- Hardcoded secrets leaking into source code (handled via environment-based config with validation at startup)

###  Dashboard / Analytics Module

- Poor indexing causing slow queries at scale (handled via early indexing and query optimization)
- Metrics mismatch between manager and owner views (handled via shared backend logic for calculations)

### Notification System

- Third-party notification failure (handled via async queues and retry mechanisms)
- Alert storms flooding managers (handled via cooldowns and deduplication rules)

### Deployment / System Level

- Environment mismatch between staging and production (handled via validation and pre-deploy checks)
- Weak test coverage causing production bugs (handled via integration tests and QA datasets)

---

## Phase 4: Testing & QA

**Who**: Abhimanyu Singh

**Activities**:
- Embed QA into Phase 3 work: author unit, integration, and end-to-end test cases as features are implemented.
- Define automation gate criteria for CI: passing unit tests, smoke tests, API contract validation, and security checks before merge.
- Build the QA test plan for customer feedback, manager dashboard, owner analytics, and alerting workflows.
- Define acceptance criteria for core features, including QR-based submission, location-scoped access, rating-based alerting, and latency SLAs.
- Run iterative validation cycles after each development sprint, capturing defects early and confirming fixes through regression tests.
- Perform security and access control checks for JWT auth, role-based routes, tenant scoping, and data isolation.
- Execute performance validation tied to non-functional requirements: submission latency, alert delay, dashboard refresh, and alert storm behavior.
- Prepare deployment readiness checks and post-deployment verification steps for Phase 5 and Phase 6.

**Outputs**:
- QA test plan and traceability matrix tied to requirements and design
- Automated test suite, CI gating rules, and smoke test scripts
- Defect report, remediation plan, and regression validation summary
- Acceptance criteria checklist and release readiness checklist
- Post-deployment verification plan for maintenance handoff

**Duration**: 1 week for formal QA phase, with continuous QA activities throughout implementation
**Risks**:
- Incomplete coverage of implementation edge cases
    -> Mitigation: include invalid QR, unauthorized access, empty comments, and notification failure cases in QA
- Performance expectations not validated before deployment
    -> Mitigation: add latency and alert-delay checks to test scope
- Role and tenant scoping bugs leaking data across branches
    -> Mitigation: run targeted auth/scoping tests for manager and owner endpoints
- Critical bugs discovered late in Phase 4
    -> Mitigation: begin QA as soon as core Phase 3 artifacts are available and keep a rapid fix loop
- Deployment readiness gaps between QA and Phase 5
    -> Mitigation: define release criteria, handover checklist, and production smoke tests before deployment.

---

## Phase 5: Deployment

**Who**:    Divyanshu
**Activities**:

- Define tenancy model & request routing
        -> Lock: shared DB + tenant_id
        -> Tenant resolution via subdomain (tenant.app.com) or header fallback
        -> Middleware enforcement (non-negotiable)

- Provision core infra (keep it structured, not overbuilt)
    AWS base:
        -> ECS (Fargate) for services
        -> RDS (PostgreSQL)
        -> Redis (Elasticache)
    VPC + security groups (minimal but correct)
    
- Service packaging & runtime setup
    Dockerize:
        -> API service
        -> Worker (alerts/events)
    Define resource limits (CPU/mem) → avoid noisy neighbor issues
    
- Backend deployment (tenant-aware)
        -> Single API serving all tenants
        -> Inject tenant context at request layer
        -> Strict query scoping (WHERE tenant_id = ? everywhere)

- Frontend deployment (multi-tenant entry point)
        -> Vercel deployment
        -> Subdomain routing (wildcard domain)
        -> Environment separation (staging/prod)

- Data layer setup
    PostgreSQL:
        -> Indexed on tenant_id, restaurant_id
        -> Basic connection pooling
    Migration strategy (no manual DB drift)
    
- Async + alert pipeline
    Redis-backed queue (BullMQ or equivalent)
    Worker consumes:
        -> Negative feedback events
        -> Sends alerts (dashboard first, external optional)
    Retry + dead-letter handling
    
- Realtime strategy (practical, not ideological)
    Start:
        -> Polling (3–5 sec) for dashboards
    Optional:
        -> WebSockets if manager usage justifies it

- CI/CD (must be boring and reliable)
    GitHub Actions:
        -> Build → test → docker push → deploy ECS
    Separate:
        -> dev / staging / prod
    No manual deployments
    
- Observability (minimum viable but effective)
    Logs → CloudWatch
    Metrics:
        -> API latency
        -> alert delay
        -> error rate
    Alerts:
        -> API failure spikes
        -> queue backlog
- Tenant onboarding pipeline
    Script/admin flow to:
        -> Create tenant
        -> Map restaurants
        -> Generate QR codes
        -> Create manager accounts
- Release strategy
        -> First tenant = FoodieReview
        -> Gradual rollout (few locations → all)
        -> No “big bang” deploy


**Outputs**:
- Running multi-tenant SaaS platform (prod environment)
- Containerized services (API + worker)
- Tenant-aware schema (with enforced isolation)
- CI/CD pipeline (fully automated, no manual steps)
- Infra baseline (ECS + RDS + Redis)
- Observability hooks (logs + basic metrics + alerts)
- Tenant onboarding workflow (scripted or internal tool)
- Deployment playbook (how to release safely)

**Duration**:   ~4–5 days

**Risks**:
- Tenant isolation bugs (this kills SaaS credibility)
    Mitigation:
        -> Enforce tenant in middleware (not optional)
        -> Add automated tests for cross-tenant access
        
    Why it matters:
        -> One leak = all clients lose trust

- Query-level mistakes (missing tenant filters)
    Mitigation:
        -> Centralized data access layer (no raw queries everywhere)
        -> Code reviews specifically for tenant scope
    Why:
        -> Most common real-world SaaS failure

- Alert pipeline lag or failure
    Mitigation:
        -> Queue + retry + visibility (queue depth monitoring)
    Why:
        -> Alerts are the core product value here
        
- Overengineering too early
    Mitigation:
        -> No microservices split yet
        -> No Kubernetes
    Why:
        -> You’ll slow delivery without real scale pressure

- Underestimating traffic bursts (dinner peaks)
    Mitigation:
        -> ECS auto-scaling
        -> Load test basic scenarios
    Why:
        -> Traffic is spiky, not uniform

- Single deploy breaking all tenants
    Mitigation:
        -> Staging env mandatory
            -> Feature flags for risky changes
        -> Gradual rollout
    Why:
        -> SaaS blast radius is huge

- Weak observability (you don’t know it’s broken)
    Mitigation:
        -> Track:
            feedback submission rate
            alert delay
            API errors
    Why:
        -> Silent failures are worse than crashes

- Onboarding friction (business blocker, not tech)
    Mitigation:
        -> Automate tenant + QR setup
    Why:
        -> SaaS growth depends on speed of onboarding

-

---

## Phase 6: Maintenance & Iteration

**Who**:Vinay 
Activities
1. System Monitoring & Health Tracking

- Continuously track system performance and errors.

Monitor:
---------
- API response time
- server uptime
- database performance
- error frequency
- feedback submission success rate

Tools:

AWS CloudWatch
Sentry (error tracking)
Log monitoring (Winston / Morgan)
uptime monitoring (UptimeRobot)
2. Bug Fixing & Issue Resolution

Identify and fix issues reported by:

restaurant managers
owner
customers

Examples:

feedback form not loading
alerts not triggering
dashboard data mismatch
login issues

Process:
bug reported → ticket created → developer fixes → patch deployed

Tools:

Jira / Trello (issue tracking)
GitHub Issues
3. Performance Optimization

Improve speed and scalability as usage increases.

Optimizations:

database query optimization
API caching
pagination improvements
reduce page load size

Tools:

Redis caching
database indexing
API performance monitoring tools
4. Feature Improvements (Iteration)

Enhance system based on feedback.

Possible improvements:

sentiment analysis of feedback comments
feedback category tagging (food, service, ambience)
manager response feature
customer satisfaction trends
export reports (PDF/Excel)
mobile app version

Process:
collect feedback → prioritize features → release updates

5. Security Updates

Protect system from vulnerabilities.

Tasks:

dependency updates
security patch updates
authentication improvements
prevent spam submissions

Tools:

npm audit
OWASP security guidelines
CAPTCHA integration
6. Data Backup & Recovery Planning

Ensure feedback data is never lost.

Setup:

automated database backups
daily backup schedule
recovery testing

Tools:

AWS RDS backup
cron jobs
7. User Support & Training

Help managers and owner use system effectively.

Activities:

user training guide
dashboard documentation
FAQ support

Deliverables:

help guide PDF
demo video
8. Continuous Deployment Improvements

Release small updates regularly without downtime.

Process:
code update → testing → deployment

Tools:

CI/CD pipelines (GitHub Actions)
version control releases

Outputs:

Technical Outputs
System monitoring dashboard
bug fix releases
performance optimization updates
updated versions of software
security patch updates
database backups
feature enhancement roadmap
usage analytics reports
Business Outputs
improved customer satisfaction
better restaurant ratings
faster issue resolution
data-driven decision making

Risks
1. System downtime

Problem:
server crash affects feedback collection

Mitigation:
cloud hosting with auto-restart
uptime monitoring alerts

2. Increasing data volume

Problem:
database slows as feedback grows

Mitigation:
database indexing
archiving old feedback

3. Feature creep

Problem:
too many feature requests increase complexity

Mitigation:
prioritize high-value features only

4. Security vulnerabilities

Problem:
system becomes target of spam or attacks

Mitigation:
regular security updates
input validation
rate limiting

5. Low adoption by restaurant staff

Problem:
managers do not use dashboard regularly

Mitigation:
simple UI
training guide
weekly email summary reports

6. Notification fatigue

Problem:
too many alerts reduce effectiveness

Mitigation:
alert threshold tuning
daily summary option

7. Data loss risk

Problem:
server failure deletes feedback history

Mitigation:
automatic backups
recovery testing
---

## Risk Summary

| Risk                                                                         | Likelihood | Impact | Mitigation                                                                                                                        |
| ---------------------------------------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 1) Real-time alerts not delivered instantly due to network/API delays        | Medium     | High   | Implement retry mechanism, use message queue (RabbitMQ), fallback email alerts, enable monitoring logs                            |
| 2) Low customer participation (customers may ignore QR feedback form)        | High       | Medium | Keep feedback form short, mobile-friendly UI, provide incentives (discount coupon), place QR visibly on receipt/table             |
| 3) Multi-language misunderstanding causing incorrect feedback interpretation | Medium     | Medium | Start with English + Hindi support, use i18n library (react-i18next), allow language selection, test translations with real users |
| 4) Hardcoded secrets leaking into source code                                | Medium     | High   | Use environment-based configuration and avoid hardcoding sensitive values in implementation                                       |
| 5) Misconfigured authorization exposing cross-location data                  | Medium     | High   | Enforce backend authorization using authenticated session context, not request parameters                                         |
| 6) Tampered QR tokens routing feedback to wrong location                     | Medium     | High   | Validate signed tokens server-side before processing any feedback submission                                                      |
| 7) Unsanitized user input causing XSS or injection attacks                   | High       | High   | Apply input validation, sanitization, and safe database query practices                                                           |
| 8) Spam or repeated submissions affecting analytics accuracy                 | Medium     | Medium | Implement rate limiting and submission cooldown logic at API level                                                                |
| 9) Poor database indexing leading to slow dashboard performance              | Medium     | Medium | Plan indexes during implementation and optimize query structure early                                                             |
| 10) Data inconsistency between feedback and alerts                           | Low        | High   | Use transactional operations to ensure atomic data handling                                                                       |
| 11) Excessive polling causing backend performance issues                     | Medium     | Medium | Limit polling frequency and implement basic response caching                                                                      |
| 12) Analytics mismatch between different dashboards                          | Low        | Medium | Use shared backend logic for all analytics calculations                                                                           |
| 13) Notification failures for critical alerts                                | Low        | High   | Design system to support retry mechanisms and asynchronous processing                                                             |
| 14) Alert flooding during high negative feedback periods                     | Medium     | Medium | Implement alert throttling and grouping logic in system design                                                                    |
| 15) Weak testability of implementation leading to QA issues                  | Medium     | Medium | Keep code modular and predictable to support easy testing                                                                         |
| 16) Environment configuration mismatch affecting deployment                  | Low        | High   | Use consistent environment-based configuration and avoid hardcoded setup                                                          |
| 17) Deployment readiness gaps between QA and production                      | Medium     | High   | Define release criteria, perform staging smoke tests, maintain rollback plan, and validate deployment readiness before cutover    |
| 18) Production monitoring and incident response gaps                         | Medium     | High   | Set up production observability, alerting, incident playbooks, and run response drills before launch                              |




---

## Key Decisions Made

| Decision                                                        | Reasoning                                                                               | Alternatives Considered                         |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Use QR-based feedback collection (no login for customers)       | Reduces friction and increases participation; aligns with real restaurant behavior      | Mobile app download, login-based system         |
| Build as a mobile-first PWA instead of native app               | Faster development, no app install required, works across devices                       | Native Android/iOS apps                         |
| Define “real-time” as near real-time (2–5 sec)                  | Practical balance between UX and infrastructure complexity                              | True real-time using WebSockets                 |
| Use rating threshold (≤ 2) for negative feedback alerts         | Simple, clear, and easy to implement for MVP                                            | AI-based sentiment analysis, dynamic thresholds |
| Implement event-driven alert system                             | Decouples feedback submission from alert delivery, improves performance and reliability | Synchronous alert triggering                    |
| Start with polling (3–5 sec) instead of WebSockets              | Simpler, reliable, sufficient for MVP scale                                             | WebSockets, Server-Sent Events                  |
| Use shared multi-tenant architecture (single DB with tenant_id) | Cost-efficient, scalable, easier to manage for MVP SaaS                                 | Separate DB per tenant                          |
| Enforce tenant isolation at middleware level                    | Prevents cross-tenant data leaks (critical for SaaS trust)                              | Handling tenant logic at query level only       |
| Use JWT-based authentication                                    | Stateless, scalable, widely supported                                                   | Session-based authentication                    |
| Use role-based access (manager vs owner)                        | Ensures proper data access and security boundaries                                      | Flat user model                                 |
| Use PostgreSQL as primary database                              | Strong relational support, consistency, and analytics-friendly queries                  | MongoDB (NoSQL)                                 |
| Add early database indexing strategy                            | Prevents performance bottlenecks as data grows                                          | Optimize later after issues arise               |
| Use ORM (Prisma/Sequelize)                                      | Faster development, safer queries, reduces SQL errors                                   | Raw SQL queries                                 |
| Implement server-side validation & sanitization                 | Protects against XSS, injection, and malformed data                                     | Client-side validation only                     |
| Use signed QR tokens for location identification                | Prevents tampering and incorrect routing of feedback                                    | Plain restaurant IDs in URL                     |
| Introduce rate limiting & cooldown for submissions              | Prevents spam and analytics distortion                                                  | No submission restrictions                      |
| Design alert throttling & deduplication                         | Prevents alert fatigue during high negative feedback                                    | Send alert for every negative feedback          |
| Use async queue (Redis/BullMQ) for alerts                       | Ensures reliability, retry, and non-blocking processing                                 | Direct API-based alert sending                  |
| Start with email alerts, extend to SMS/WhatsApp later           | Reduces dependency complexity for MVP                                                   | Full multi-channel alerts from start            |
| Use React + Tailwind for frontend                               | Fast development, responsive UI, strong ecosystem                                       | Angular, plain CSS                              |
| Use Node.js + Express for backend                               | Lightweight, fast API development, event-driven support                                 | Django, Spring Boot                             |
| Use cloud deployment (AWS + Vercel)                             | Scalability, reliability, managed infrastructure                                        | On-premise hosting                              |
| Use CI/CD with GitHub Actions                                   | Automated, consistent deployments, reduces manual errors                                | Manual deployments                              |
| Use centralized logging & monitoring (CloudWatch, Sentry)       | Enables quick debugging and incident response                                           | No structured monitoring                        |
| Define strict MVP scope                                         | Prevents feature creep and ensures timely delivery                                      | Building full-featured system upfront           |
| Defer multi-language support from MVP                           | Reduces complexity, faster launch                                                       | Full multilingual support from start            |
| Use modular backend architecture                                | Improves maintainability, testability, and scalability                                  | Monolithic unstructured code                    |
| Implement staging environment before production                 | Reduces deployment risk and ensures stability                                           | Direct production deployment                    |
| Introduce QA early in development lifecycle                     | Catches bugs early, reduces cost of fixes                                               | QA only at final stage                          |
| Plan rollback strategy for deployments                          | Ensures quick recovery from failures                                                    | No rollback planning                            |
| Use seeded data for testing & demos                             | Enables realistic QA and validation                                                     | Testing with empty/minimal data                 |


