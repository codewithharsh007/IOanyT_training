# Architecture Diagram Analysis Exercise

## Instructions (Pairs, 60 min)

For each architecture below, use Claude to:
1. Explain what each component does
2. Trace the request flow from user to response
3. Identify single points of failure
4. Suggest one improvement

## Architecture 1: Simple Web App (Beginner)

```
User → CloudFront → S3 (React SPA)
                  ↘ API Gateway → Lambda → DynamoDB
```

**Questions**:
- What happens when a user loads the page?
- What happens when they submit a form?
- What breaks if Lambda goes down?
- How does this handle 1000 concurrent users?

## Architecture 2: E-Commerce Platform (Intermediate)

```
User → Route53 → ALB → EC2 (Node.js, Auto Scaling Group)
                      ↘ RDS (PostgreSQL, Multi-AZ)
                      ↘ ElastiCache (Redis)
                      ↘ S3 (Product Images via CloudFront)

SQS Queue → Lambda (Order Processing) → SES (Email Notifications)
```

**Questions**:
- Why use ALB instead of directly hitting EC2?
- What's ElastiCache for in this context?
- Why is SQS between the order and the email?
- What happens during a traffic spike on Black Friday?
- What's the single point of failure?

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

**Questions**:
- Why are some services on ECS Fargate and others on Lambda?
- What is EventBridge doing here?
- How does the Lambda Authorizer work?
- If the Search Service goes down, does it affect Orders?
- How would you monitor this system?
