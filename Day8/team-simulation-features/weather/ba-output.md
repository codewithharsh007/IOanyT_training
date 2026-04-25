# BA Output: Weather Data Aggregation API

Source Input: pm-output_weatherApp.md

## 1. Functional Requirements (FRs)

FR-01: Fetch Weather by City
- The system shall provide a weather lookup endpoint that accepts a city name and returns current weather plus a 3-day forecast.
- Validation:
  - city is required.
  - city length must be 2-100 characters after trimming.
  - city may contain letters, spaces, hyphens, apostrophes, and periods.
- The system shall normalize city input for cache key usage (trim, collapse internal spaces, lowercase).

FR-02: Current Weather Response
- The system shall return current weather attributes for the requested city:
  - cityName
  - countryCode (if available)
  - observationTimeUtc
  - temperatureC
  - condition
  - humidityPercent
  - windSpeedKph (if available)
- The response shall include data source metadata and freshness indicators.

FR-03: 3-Day Forecast Response
- The system shall return exactly 3 forecast day entries when provider data is available.
- Each forecast entry shall include:
  - date (YYYY-MM-DD)
  - minTempC
  - maxTempC
  - expectedCondition
  - expectedHumidityPercent (if available)
- If provider returns fewer than 3 days, system behavior shall follow fallback rule BR-09.

FR-04: Cache Lookup and Reuse
- The system shall check cache before calling external provider.
- Cache key must be deterministic by normalized city.
- If cache entry is valid (not expired), the system shall return cached response and flag cacheHit=true.

FR-05: Cache Write and Expiry
- On successful external fetch, the system shall store normalized response in cache.
- Cache TTL shall be 30 minutes.
- Response shall include cache metadata:
  - cacheHit
  - cacheTtlSeconds
  - dataTimestampUtc

FR-06: External Provider Integration
- The system shall integrate with one configured weather provider or mock provider.
- Provider adapter shall transform provider-specific payloads into internal canonical schema before API response.
- Provider timeout threshold shall be configurable (default 3 seconds).

FR-07: Invalid and Unknown City Handling
- For malformed city input, system shall return validation error.
- For well-formed but unknown city, system shall return a domain not-found error with clear message.

FR-08: External Failure Handling
- If provider call fails and valid cached data exists (including stale data up to staleTolerance), system shall return fallback cached data with stale=true.
- If provider call fails and no acceptable cache exists, system shall return dependency failure error.
- Default staleTolerance for fallback shall be 6 hours.

FR-09: Standardized API Response
- Success response shall have consistent structure across cache hit and miss paths.
- Error responses shall follow standardized error schema with requestId for traceability.

FR-10: Observability and Traceability
- System shall capture request-level logs for:
  - city (normalized)
  - cacheHit/cacheMiss
  - provider latency
  - final status code
  - requestId
- System shall expose operational counters for cache hit rate and provider error rate.

## 2. Non-Functional Requirements (NFRs)

NFR-01: Performance
- p95 latency targets:
  - cache hit response <= 150 ms.
  - cache miss (provider success) <= 900 ms.

NFR-02: Reliability
- Service shall return deterministic error schemas for all failures.
- Partial or malformed provider payloads must not be passed through directly.

NFR-03: Availability
- Monthly availability target: >= 99.5% for internal consumers.

NFR-04: External Dependency Resilience
- Provider calls must enforce timeout and retry policy.
- Recommended policy: max 1 retry for transient failures (5xx/timeouts) with exponential backoff.

NFR-05: Data Freshness
- Normal cache freshness window: 30 minutes.
- Stale fallback maximum age: 6 hours.

NFR-06: Security
- No authentication is in MVP scope, but endpoint exposure must be limited to internal trusted network.
- Input sanitization is required to mitigate injection and malformed payload attacks.

NFR-07: Scalability (MVP)
- System shall support moderate request volume with cache-backed throughput.
- Cache implementation must support concurrent read access.

NFR-08: Maintainability
- Provider adapter must be modular so external provider can be replaced with minimal API contract impact.
- API must be versioned using /api/v1.

NFR-09: Observability
- Logs must include requestId and provider correlation metadata when available.
- Metrics required:
  - total requests
  - cache hit count
  - cache miss count
  - provider failure count
  - validation failure count

## 3. User Stories

US-01: Request Weather Data
- As a developer consuming the API, I want to fetch current weather and a 3-day forecast for a city, so that my application can display reliable weather information.
- Acceptance Criteria:
  - GIVEN a valid city with fresh cached data WHEN GET /api/v1/weather?city=London is called THEN system returns 200 with cacheHit=true and weather payload.
  - GIVEN a valid city with no cache WHEN request is called THEN system fetches provider data, caches it, and returns 200 with cacheHit=false.
  - GIVEN missing city parameter WHEN request is called THEN system returns 400 with field error for city.
- Edge Conditions:
  - city contains leading/trailing spaces.
  - city uses mixed case and punctuation.

US-02: Handle Unknown City
- As a developer consuming the API, I want clear errors for unknown city names, so that I can prompt users with corrective input.
- Acceptance Criteria:
  - GIVEN city format is valid but provider cannot resolve it WHEN request is called THEN system returns 404 with code CITY_NOT_FOUND.
  - GIVEN malformed city input WHEN request is called THEN system returns 400 VALIDATION_ERROR.
- Edge Conditions:
  - city has unsupported characters.

US-03: Cached Fallback on Provider Failure
- As a developer consuming the API, I want stale cached weather to be used during provider outages, so that my application still receives useful data.
- Acceptance Criteria:
  - GIVEN provider failure and stale cache age <= 6 hours WHEN request is called THEN system returns 200 with stale=true and fallbackSource=cache.
  - GIVEN provider failure and no acceptable cache WHEN request is called THEN system returns 503 DEPENDENCY_UNAVAILABLE.
- Edge Conditions:
  - stale cache exists but exceeds stale tolerance.

US-04: Consistent Response Contract
- As a QA engineer, I want a consistent response structure across all successful weather requests, so that test automation remains stable.
- Acceptance Criteria:
  - GIVEN cache hit or cache miss success WHEN request is called THEN both responses match the same schema.
  - GIVEN provider payload missing optional fields WHEN transformed THEN API still returns schema-compliant response with null for missing optional fields.
- Edge Conditions:
  - provider sends extra unknown fields.

US-05: Operational Monitoring
- As a platform engineer, I want cache and provider metrics exposed, so that I can monitor reliability and tune system behavior.
- Acceptance Criteria:
  - GIVEN any request WHEN processed THEN requestId appears in logs.
  - GIVEN cacheable response WHEN served THEN cache hit/miss counters are updated correctly.

## 4. Data Model

Entity: WeatherRequestLog
- id: string (UUID), primary key, required.
- requestId: string, required, unique.
- cityInput: string, required.
- cityNormalized: string, required.
- requestedAtUtc: datetime, required.
- responseStatusCode: integer, required.
- cacheHit: boolean, required.
- staleServed: boolean, required, default false.
- providerLatencyMs: integer, optional.

Entity: WeatherCacheEntry
- cacheKey: string, primary key, required. Example: weather:city:{normalizedCity}
- cityNormalized: string, required.
- cityDisplayName: string, required.
- countryCode: string, optional.
- payloadJson: json, required. Canonical weather payload.
- sourceProvider: string, required.
- fetchedAtUtc: datetime, required.
- expiresAtUtc: datetime, required.
- staleUntilUtc: datetime, required.
- schemaVersion: string, required, default v1.

Entity: CurrentWeather (embedded in payloadJson)
- observationTimeUtc: datetime, required.
- temperatureC: number, required.
- condition: string, required.
- humidityPercent: integer, required, range 0-100.
- windSpeedKph: number, optional.

Entity: ForecastDay (embedded array in payloadJson)
- date: date (YYYY-MM-DD), required.
- minTempC: number, required.
- maxTempC: number, required.
- expectedCondition: string, required.
- expectedHumidityPercent: integer, optional, range 0-100.

Relationships
- One WeatherCacheEntry contains exactly one CurrentWeather object.
- One WeatherCacheEntry contains up to three ForecastDay items in ordered sequence.
- One WeatherRequestLog references one request/response event.

Key Constraints
- cacheKey unique and deterministic from cityNormalized.
- expiresAtUtc must be greater than fetchedAtUtc.
- staleUntilUtc must be greater than or equal to expiresAtUtc.
- ForecastDay.date values in one response must be unique and ascending.

## 5. Workflow / Process Flow

Flow A: Weather Request Happy Path (Cache Hit)
1. Actor sends GET /api/v1/weather?city={city}.
2. System validates and normalizes city.
3. System checks cache using deterministic key.
4. Cache entry exists and current time <= expiresAtUtc.
5. System returns cached payload with cacheHit=true, stale=false.
6. System logs request outcome.

Flow B: Weather Request Happy Path (Cache Miss)
1. Actor sends request with valid city.
2. System checks cache and finds miss or expired entry.
3. System calls provider adapter.
4. Provider response is validated and transformed to canonical schema.
5. System writes cache entry with 30-minute TTL and staleUntilUtc.
6. System returns payload with cacheHit=false, stale=false.

Flow C: Provider Failure with Fallback
1. Actor sends request.
2. Cache is expired or missing fresh data.
3. Provider call fails (timeout/5xx/network).
4. System checks stale fallback eligibility:
   - if stale cache exists and current time <= staleUntilUtc, return stale payload.
   - else return 503 dependency error.
5. System logs failure and fallback decision.

Flow D: Validation Failure
1. Actor sends invalid city parameter.
2. System fails validation before cache/provider access.
3. System returns 400 with field-level validation details.

State Model for Request Processing
- Received -> Validated -> CacheChecked ->
  - ServedFromCache (terminal)
  - ProviderFetch ->
    - ServedFresh (terminal)
    - ProviderFailure ->
      - ServedStale (terminal)
      - FailedDependency (terminal)
- ValidationFailed (terminal)

## 6. API Definitions

### 6.1 Get Weather by City
- Method: GET
- Endpoint: /api/v1/weather
- Query Parameters:
  - city: string (required)
- Request Example:
  - /api/v1/weather?city=New York
- Success Response (200):
  - requestId: string
  - city: { input, normalized, displayName, countryCode }
  - current: { observationTimeUtc, temperatureC, condition, humidityPercent, windSpeedKph }
  - forecast: [ { date, minTempC, maxTempC, expectedCondition, expectedHumidityPercent } ]
  - metadata: { cacheHit, stale, sourceProvider, dataTimestampUtc, cacheTtlSeconds }
- Validation Rules:
  - city required and valid character set.
  - city length 2-100 after trim.
- Error Scenarios:
  - 400 VALIDATION_ERROR (missing/invalid city)
  - 404 CITY_NOT_FOUND (unknown city)
  - 503 DEPENDENCY_UNAVAILABLE (provider failed and no fallback)
  - 500 INTERNAL_ERROR

### 6.2 Health Check (Operational)
- Method: GET
- Endpoint: /api/v1/health
- Request: none
- Response:
  - 200 with service status and provider connectivity snapshot
- Validation Rules: none
- Error Scenarios:
  - 500 when core dependencies are unavailable

### 6.3 Metrics Endpoint (Internal)
- Method: GET
- Endpoint: /api/v1/metrics
- Request: none
- Response:
  - 200 with counters and latency histograms
- Validation Rules: internal access only (network-level restriction)
- Error Scenarios:
  - 500 for metrics collection failures

Standard Error Response Shape
- requestId: string
- code: string
- message: string
- fieldErrors: array of { field, issue } (optional)
- timestampUtc: datetime

## 7. Business Rules

BR-01: City parameter is mandatory for weather lookup.

BR-02: City input is normalized (trim + lowercase + space normalization) for cache key generation.

BR-03: Cache TTL is fixed at 30 minutes for fresh data validity.

BR-04: Fresh cache data must be returned without external provider call.

BR-05: On cache miss/expiry, provider must be queried before returning success (except validation failures).

BR-06: Provider data must be transformed into canonical response schema before returning to clients.

BR-07: Unknown city from provider maps to 404 CITY_NOT_FOUND.

BR-08: If provider fails and stale cache is available within staleTolerance (6 hours), return stale response with stale=true.

BR-09: If provider returns fewer than 3 forecast days, return available days and set metadata.forecastCompleteness=partial.

BR-10: If provider fails and no valid fallback exists, return 503 DEPENDENCY_UNAVAILABLE.

BR-11: All errors must include requestId and deterministic error code.

BR-12: Forecast day entries must be date-ordered ascending and unique per response.

## 8. Edge Cases

EC-01: City has extra spaces or unusual casing (for example, "  nEw   yOrK  ").

EC-02: City includes punctuation like apostrophes or hyphens (for example, "St. John's", "Ho-Chi-Minh City").

EC-03: Provider returns incomplete payload (missing humidity or wind fields).

EC-04: Provider returns temperatures in unexpected unit; transform layer must normalize to Celsius.

EC-05: Cache entry expires during request processing window.

EC-06: Concurrent requests for same city on cache miss causing thundering herd behavior.

EC-07: Provider timeout followed by stale fallback availability.

EC-08: Provider timeout with no cache and no fallback should return 503.

EC-09: Cache backend temporary failure should not expose internal details in error responses.

EC-10: Forecast contains duplicate dates or out-of-order dates; system must normalize or reject malformed provider payload.

## 9. Risks & Gaps Identified

RG-01: City uniqueness assumption is ambiguous (same city name in different countries).
- Impact: ambiguous or incorrect weather results.
- Recommendation: extend request contract to support country code in v1.1.

RG-02: PM input does not define stale fallback tolerance window.
- Impact: inconsistent outage behavior.
- Recommendation: adopt explicit staleTolerance=6 hours and review with stakeholders.

RG-03: Provider selection and failover strategy are undefined.
- Impact: uncertain reliability under provider outage.
- Recommendation: define primary provider and optional mock fallback policy.

RG-04: Caching technology and eviction policy are not specified.
- Impact: unpredictable memory usage and expiry behavior.
- Recommendation: define cache backend (in-memory/Redis) and LRU eviction settings.

RG-05: Unit expectations from provider not explicitly defined.
- Impact: inconsistent output temperature interpretation.
- Recommendation: enforce canonical Celsius output contract in API.

RG-06: No explicit SLO acceptance thresholds in PM input.
- Impact: difficult production readiness decisions.
- Recommendation: align on p95 latency and error-rate thresholds.

RG-07: No security/auth scope increases misuse risk if endpoint is publicly exposed.
- Impact: abuse and elevated provider cost.
- Recommendation: restrict access at network gateway and add API key in future iteration.

## 10. Assumptions

A-01: API is internal and does not require user authentication in MVP.

A-02: City input alone is used for lookup in MVP; country disambiguation is deferred.

A-03: Forecast horizon is exactly 3 days unless provider data is partially unavailable.

A-04: Cache TTL is 30 minutes and stale fallback is permitted up to 6 hours.

A-05: Canonical response unit for temperature is Celsius.

A-06: Datetime values are UTC ISO-8601.

A-07: External provider endpoint and API key management are handled via environment configuration.

A-08: API version prefix is /api/v1.
