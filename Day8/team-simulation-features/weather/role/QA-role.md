# QA Deliverable — Weather API Project

## 0. QA Role & Responsibilities

As a QA Engineer, my role in this project was to ensure that the Weather API system meets functional requirements, handles edge cases robustly, and maintains reliability, security, and performance under expected usage.

### Responsibilities performed:

- Reviewed PM requirements and clarified ambiguities
- Validated BA documentation (functional + non-functional requirements)
- Verified API contract consistency (request/response, status codes)
- Designed comprehensive test plan covering all scenarios
- Created structured test cases (happy path, edge, security, performance)
- Identified gaps between BA expectations and implementation
- Predicted real-world failure scenarios based on code behavior
- Prepared automation-ready test scripts (pytest-based)
- Documented defects and improvement areas

---

## 1. Project Understanding

The Weather API system provides:

- Current weather data retrieval
- Location-based weather queries (city/coordinates)
- Optional forecast data (if implemented)
- Structured API responses
- External API integration (if applicable)

The system is expected to:
- Validate inputs (city, coordinates, units)
- Handle API failures gracefully
- Return consistent responses
- Perform efficiently under moderate load

---

## 2. Test Plan (categories)

### Functional Testing
- Fetch weather by city name
- Fetch weather by coordinates
- Validate response structure and data fields
- Verify error handling for invalid inputs
- Validate integration with external weather provider (if used)

### Edge Case Testing
- Invalid city names
- Empty or missing query parameters
- Special characters in input
- API timeout or failure from external service
- Duplicate or rapid requests

### Security Testing
- Injection attempts in query parameters
- Input validation bypass attempts
- Exposure of sensitive API keys
- Error message leakage

### Performance / Scale Testing
- High-frequency requests
- Concurrent API calls
- Response time validation
- External API dependency latency impact

### Integration Testing
- External weather API success/failure handling
- Retry/fallback behavior
- Data mapping consistency

---

## 3. Ten Test Cases

### Happy Path (3)

1) Fetch weather by valid city
- Input: GET `/weather?city=Delhi`
- Expected: 200 OK with weather data (temperature, humidity, etc.)

2) Fetch weather by coordinates
- Input: GET `/weather?lat=28.6&lon=77.2`
- Expected: 200 OK with correct weather data

3) Valid response structure
- Input: Valid request
- Expected: JSON response with consistent schema (data fields present and correctly typed)

---

### Edge Cases (3)

4) Invalid city name
- Input: GET `/weather?city=InvalidCity123`
- Expected: 404 or error response indicating location not found

5) Missing query parameters
- Input: GET `/weather`
- Expected: 400 Bad Request with validation error

6) External API failure simulation
- Input: Valid request but external API unavailable
- Expected: Graceful failure (e.g., 503 Service Unavailable or fallback message)

---

### Security Tests (2)

7) Injection attempt in query
- Input: GET `/weather?city=Delhi; DROP TABLE`
- Expected: Input treated as string; no system impact; safe handling

8) API key exposure check
- Input: Trigger error response
- Expected: API keys or sensitive configs not exposed in response/logs

---

### Performance / Scale (2)

9) High request rate
- Input: Simulate 100+ requests/sec
- Expected: Stable responses; no crashes; acceptable latency

10) Concurrent requests
- Input: Multiple parallel weather queries
- Expected: Consistent responses; no data corruption or failures

---

## 4. Bug Predictions (based on realistic scenarios)

1) External API dependency failure
   - System may return unhandled errors or crash if API is down

2) API key leakage risk
   - Improper error handling/logging could expose API keys

3) Input validation gaps
   - Special characters or malformed inputs may bypass validation

4) Rate limiting absence
   - High traffic may overload the system or external API

5) Response inconsistency
   - Different error formats depending on failure source (internal vs external)

6) Timeout handling issue
   - Slow external API could block requests without timeout fallback

7) Incorrect data mapping
   - External API fields may not align with internal response structure

---

## 5. Work Done Across Lifecycle

### PM Phase
- Understood business goal: provide reliable weather data API
- Identified key features and constraints

### BA Phase
- Documented API endpoints and expected behaviors
- Defined validation rules and response structure
- Highlighted edge cases and assumptions

### Engineer Phase
- Implemented API endpoints
- Integrated external weather service (if applicable)
- Added validation and response handling

### QA Phase (My Work)
- Validated implementation against BA requirements
- Designed full test coverage (functional, edge, security, performance)
- Identified contract mismatches and risks
- Created automation-ready test scripts
- Documented defects and improvement recommendations

---

## 6. Final QA Assessment

### Strengths
- Core functionality implemented correctly
- API responds to valid requests
- Basic validation in place

### Risks / Gaps
- External dependency reliability
- Potential lack of standardized error responses
- Missing rate limiting and observability
- Security risks around API keys and inputs

---

## 7. QA Verdict

**Status: Pass for MVP testing with risks noted**

The Weather API is functionally usable but requires:
- stronger validation
- improved error handling consistency
- better resilience to external API failures

before being considered production-ready.

---