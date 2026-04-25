## Architecture 3: Microservices (Advanced)

```
User → API Gateway → Lambda Authorizer → {
    /users   → User Service (ECS Fargate) → RDS
    /orders  → Order Service (ECS Fargate) → DynamoDB
    /search  → Search Service (Lambda) → OpenSearch
    /files   → File Service (Lambda) → S3
}

EventBridge → {
    order.created → Notification Lambda → SNS → Email/SMS
    order.created → Analytics Lambda → Kinesis → S3 (Data Lake)
    user.signup  → Welcome Lambda → SES
}
```

## 1) Components

- **API Gateway**: Routes incoming API requests.
- **Lambda Authorizer**: Handles authentication and authorization.
- **ECS Fargate**: Runs containerized microservices.
- **Lambda**: Serverless functions for lightweight tasks.
- **RDS / DynamoDB**: Databases per service.
- **OpenSearch**: Search engine.
- **S3**: File storage.
- **EventBridge**: Event bus for decoupled communication.
- **SNS / SES / Kinesis**: Notifications and analytics.

---

## 2) Request Flow

### API Request
1. User → API Gateway.
2. Lambda Authorizer validates request.
3. Routed to appropriate service.
4. Service interacts with database.
5. Response returned.

### Event Flow (Order Created)
1. Order Service emits event to EventBridge.
2. Event triggers:
   - Notification Lambda → SNS → Email/SMS
   - Analytics Lambda → Kinesis → S3

---

## 3) Single Points of Failure

- API Gateway (entry point).
- EventBridge misconfiguration.
- Individual service databases.

---

## 4) Improvement

- Add service mesh (e.g., App Mesh).
- Implement centralized logging and tracing.

---

## Answers

- **ECS vs Lambda?**
  - ECS: Long-running services
  - Lambda: Event-driven tasks

- **EventBridge?**
  Central event bus enabling loose coupling.

- **Lambda Authorizer?**
  Validates authentication before routing requests.

- **Search Service Down?**
  No impact on Orders (service isolation).

- **Monitoring?**
  - CloudWatch
  - X-Ray
  - Alerts and dashboards

---