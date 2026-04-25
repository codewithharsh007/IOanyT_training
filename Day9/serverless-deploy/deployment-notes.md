# Deployment Notes — Serverless Notes API

## 1. What did you just deploy? (Architecture description)

I deployed a **serverless Notes API** using AWS services. The architecture consists of:

* **API Gateway (HTTP API):** Handles incoming HTTP requests and routes them to the backend.
* **AWS Lambda:** Contains the business logic for handling CRUD operations (Create, Read, Update, Delete).
* **DynamoDB:** A NoSQL database used to store notes.

### Flow:

Client → API Gateway → Lambda → DynamoDB → Lambda → API Gateway → Client

This architecture is fully serverless, meaning there are no servers to manage, and it automatically scales based on demand.

---

## 2. What happens when a user calls `POST /notes`? (Trace the request)

1. The client sends an HTTP POST request to `/notes` with JSON data (title and content).
2. API Gateway receives the request and forwards it to the Lambda function.
3. Lambda:

   * Parses the request body.
   * Validates that the `title` is not empty.
   * Generates a unique `id` using UUID.
   * Adds timestamps (`created_at`, `updated_at`).
4. Lambda stores the note in DynamoDB using `PutItem`.
5. DynamoDB saves the data.
6. Lambda returns a response with status code **201** and the created note.
7. API Gateway sends the response back to the client.

---

## 3. What would break if 10,000 users hit this simultaneously?

* **DynamoDB Scan Limitation:** The `GET /notes` endpoint uses `Scan`, which is not efficient at scale and can become slow.
* **Lambda Concurrency Limits:** AWS Lambda has concurrency limits; too many requests could throttle execution.
* **API Gateway Throttling:** API Gateway has rate limits that may block excessive traffic.
* **Cold Starts:** Increased traffic may cause more cold starts, increasing latency.

However, the system will not completely crash because AWS services automatically scale, but performance may degrade.

---

## 4. How much would this cost per month with 1000 daily users?**

Estimated usage:

* 1000 users/day ≈ 30,000 requests/month

### Cost breakdown (approx):

* **Lambda:** Free tier covers 1M requests → $0
* **API Gateway (HTTP API):** ~$1 per million requests → ~$0.03
* **DynamoDB (On-demand):** Minimal reads/writes → ~$1–$2

### Total estimated cost:

👉 **~$1–$3 per month**

This fits well within the $5 budget.

---

## 5. What security concerns exist? (Authentication, authorization)

Currently, the API has **no security**, which leads to:

* ❌ No authentication → Anyone can access the API
* ❌ No authorization → Anyone can modify or delete any note
* ❌ No rate limiting → Vulnerable to abuse or spam
* ❌ No input sanitization → Risk of malicious input
* ❌ Open CORS policy → Allows requests from any origin

### Improvements:

* Add authentication (JWT, API keys, or AWS Cognito)
* Implement authorization (user-based access control)
* Enable rate limiting in API Gateway
* Validate and sanitize inputs
* Restrict CORS to trusted domains

---

## Conclusion

This project demonstrates a fully functional serverless backend with CRUD operations, proper error handling, and basic validation. While it is scalable and cost-efficient, additional improvements are needed for production-level security and performance optimization.
