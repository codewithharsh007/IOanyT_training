# Defects & Missing — Weather Data Aggregation API

## ❌ Critical Defects (Against BA Requirements)

### 1. Cache Layer Not Implemented or Incomplete
- BA Requirement: Cache lookup, TTL (30 min), stale fallback (6 hours) :contentReference[oaicite:1]{index=1}
- Issue:
  - No proper cache mechanism observed OR only in-memory without TTL/stale handling
- Impact:
  - Every request hits external API → performance + cost issue
  - No cacheHit / cacheMiss metadata
- Severity: High

---

### 2. Stale Fallback Logic Missing
- BA Requirement: Return stale cached data on provider failure (<= 6 hours) :contentReference[oaicite:2]{index=2}
- Issue:
  - No fallback mechanism if provider fails
- Impact:
  - API returns error instead of degraded but usable response
- Severity: High

---

### 3. Standardized Error Schema Not Enforced
- BA Requirement:
  - requestId, code, message, fieldErrors :contentReference[oaicite:3]{index=3}
- Issue:
  - Mixed or raw error responses likely used
- Impact:
  - Clients cannot rely on consistent error format
- Severity: High

---

### 4. Missing RequestId in Responses
- BA Requirement:
  - requestId must be included in all responses :contentReference[oaicite:4]{index=4}
- Issue:
  - requestId not consistently generated/returned
- Impact:
  - No traceability for debugging/logging
- Severity: High

---

### 5. Forecast Requirement Not Strictly Enforced
- BA Requirement:
  - Exactly 3 forecast days OR fallback rule applied :contentReference[oaicite:5]{index=5}
- Issue:
  - API may return variable number of days without metadata
- Impact:
  - Contract inconsistency
- Severity: Medium

---

### 6. Input Validation Gaps for City
- BA Requirement:
  - Only allowed characters + length 2–100 :contentReference[oaicite:6]{index=6}
- Issue:
  - Likely only basic validation (non-empty)
- Impact:
  - Invalid inputs like `@@@`, `123`, or scripts may pass
- Severity: Medium

---

### 7. City Normalization Missing or Partial
- BA Requirement:
  - Trim + lowercase + collapse spaces :contentReference[oaicite:7]{index=7}
- Issue:
  - Normalization not fully implemented
- Impact:
  - Cache inefficiency and inconsistent responses
- Severity: Medium

---

### 8. No Provider Timeout / Retry Logic
- BA Requirement:
  - Timeout (3s) + retry policy :contentReference[oaicite:8]{index=8}
- Issue:
  - Direct API call without timeout/retry
- Impact:
  - Requests may hang or fail unpredictably
- Severity: High

---

### 9. Response Schema Not Fully Canonical
- BA Requirement:
  - Strict response structure for current + forecast :contentReference[oaicite:9]{index=9}
- Issue:
  - External API payload may be passed through directly
- Impact:
  - Breaks API contract consistency
- Severity: High

---

### 10. Missing Metadata Block in Response
- BA Requirement:
  - cacheHit, stale, sourceProvider, dataTimestampUtc :contentReference[oaicite:10]{index=10}
- Issue:
  - Metadata likely missing or incomplete
- Impact:
  - Client cannot interpret freshness or source
- Severity: Medium

---

## ⚠️ Major Gaps (Non-Functional / System Design)

### 11. Observability Not Implemented
- BA Requirement:
  - Logs + metrics (cache hit rate, provider latency, etc.) :contentReference[oaicite:11]{index=11}
- Issue:
  - No structured logging or metrics
- Impact:
  - Difficult debugging and monitoring
- Severity: High

---

### 12. No Metrics Endpoint
- BA Requirement:
  - `/api/v1/metrics` endpoint :contentReference[oaicite:12]{index=12}
- Issue:
  - Endpoint missing
- Impact:
  - No operational visibility
- Severity: Medium

---

### 13. No Health Check Endpoint
- BA Requirement:
  - `/api/v1/health` :contentReference[oaicite:13]{index=13}
- Issue:
  - Not implemented
- Impact:
  - Cannot verify system readiness
- Severity: Medium

---

### 14. No Protection Against Thundering Herd
- BA Edge Case:
  - Concurrent requests on cache miss :contentReference[oaicite:14]{index=14}
- Issue:
  - Multiple requests may hit provider simultaneously
- Impact:
  - Performance degradation + API cost spike
- Severity: Medium

---

### 15. No Rate Limiting / Abuse Protection
- BA Risk:
  - Open API misuse :contentReference[oaicite:15]{index=15}
- Issue:
  - No throttling
- Impact:
  - Overload + cost escalation
- Severity: Medium

---

## 🔒 Security Gaps

### 16. API Key Exposure Risk
- Issue:
  - API key may be hardcoded or exposed in logs/errors
- Impact:
  - Security breach
- Severity: High

---

### 17. Input Sanitization Weak
- BA Requirement:
  - Prevent injection/malformed inputs :contentReference[oaicite:16]{index=16}
- Issue:
  - Limited validation on city input
- Impact:
  - Potential injection or malformed requests
- Severity: Medium

---

## ⚡ Performance Risks

### 18. No Caching = High Latency
- Issue:
  - All requests depend on external API
- Impact:
  - High response time (>900ms BA limit)
- Severity: High

---

### 19. No Timeout Handling
- Issue:
  - Slow external API blocks request
- Impact:
  - Poor user experience
- Severity: High

---

### 20. No Data Freshness Control
- BA Requirement:
  - TTL + stale tolerance :contentReference[oaicite:17]{index=17}
- Issue:
  - Data freshness not tracked
- Impact:
  - Stale or inconsistent data served
- Severity: Medium

---

## 🧠 BA → Engineer Missing Implementation Summary

| Area | Status |
|------|------|
| Caching (TTL + reuse) | ❌ Missing |
| Stale fallback | ❌ Missing |
| Retry + timeout | ❌ Missing |
| Standard error schema | ⚠️ Partial |
| RequestId tracking | ❌ Missing |
| Observability (logs/metrics) | ❌ Missing |
| Forecast contract | ⚠️ Partial |
| Response metadata | ❌ Missing |
| Input validation (strict) | ⚠️ Partial |

---

## 🎯 Final QA Verdict

**Status: FAIL for BA compliance, PASS for basic MVP functionality**

### Reason:
- Core functionality (weather fetch) may work  
- But **major architectural requirements from BA are not implemented**, especially:
  - caching
  - fallback
  - observability
  - error standardization

---

## 📌 Recommendation

Before moving forward:
1. Implement caching layer (Redis or in-memory with TTL)
2. Add stale fallback logic
3. Standardize error response
4. Add requestId + logging middleware
5. Implement timeout + retry for provider
6. Enforce strict validation