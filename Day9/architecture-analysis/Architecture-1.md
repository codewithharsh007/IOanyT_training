## Architecture 1: Simple Web App (Beginner)

```
User → CloudFront → S3 (React SPA)
                  ↘ API Gateway → Lambda → DynamoDB
```

## 1) Components

- **CloudFront**: CDN that caches and delivers static content globally.
- **S3**: Hosts the React Single Page Application (HTML, CSS, JS).
- **API Gateway**: Entry point for backend API requests.
- **Lambda**: Executes backend logic (serverless compute).
- **DynamoDB**: NoSQL database for storing application data.

---

## 2) Request Flow

### Page Load
1. User requests website.
2. Request goes to CloudFront.
3. CloudFront serves cached content or fetches from S3.
4. React app loads in browser.

### Form Submission
1. React app sends request to API Gateway.
2. API Gateway triggers Lambda.
3. Lambda processes logic and interacts with DynamoDB.
4. Response returned to user.

---

## 3) Single Points of Failure

- Lambda (core backend logic).
- API Gateway misconfiguration.
- DynamoDB is highly available (not typically a SPOF).

---

## 4) Improvement

- Add retries and Dead Letter Queue (DLQ) for Lambda.
- Enable API Gateway caching.

---

## Answers

- **Page Load?** CloudFront → S3 → React app loads.
- **Form Submit?** API Gateway → Lambda → DynamoDB.
- **Lambda Down?** All API calls fail.
- **1000 Users?** Easily handled via auto-scaling (CloudFront, Lambda, DynamoDB).

---


