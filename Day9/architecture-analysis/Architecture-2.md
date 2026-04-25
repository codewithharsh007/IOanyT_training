## Architecture 2: E-Commerce Platform (Intermediate)

```
User → Route53 → ALB → EC2 (Node.js, Auto Scaling Group)
                      ↘ RDS (PostgreSQL, Multi-AZ)
                      ↘ ElastiCache (Redis)
                      ↘ S3 (Product Images via CloudFront)

SQS Queue → Lambda (Order Processing) → SES (Email Notifications)
```

## 1) Components

- **Route53**: DNS routing.
- **ALB (Application Load Balancer)**: Distributes incoming traffic.
- **EC2 + Auto Scaling Group**: Runs backend servers and scales automatically.
- **RDS (PostgreSQL)**: Relational database for structured data.
- **ElastiCache (Redis)**: Caching layer.
- **S3 + CloudFront**: Stores and delivers product images.
- **SQS**: Message queue for async processing.
- **Lambda**: Background job processing.
- **SES**: Email service.

---

## 2) Request Flow

### Browsing
1. User → Route53 → ALB.
2. ALB routes to EC2.
3. EC2 fetches data:
   - From Redis (fast)
   - Or from RDS (fallback)
4. Images served via CloudFront + S3.

### Order Placement
1. EC2 writes order to RDS.
2. Sends message to SQS.
3. Lambda processes queue.
4. SES sends confirmation email.

---

## 3) Single Points of Failure

- RDS (primary database bottleneck).
- Redis (if not clustered).
- Improper Auto Scaling config.

---

## 4) Improvement

- Add RDS read replicas.
- Enable Redis clustering.
- Use circuit breakers.

---

## Answers

- **Why ALB?** Load balancing, health checks, SSL termination.
- **ElastiCache?** Reduces DB load with caching.
- **Why SQS?** Decouples async processing.
- **Black Friday Traffic?**
  - Auto Scaling adds EC2 instances
  - ALB distributes traffic
  - SQS buffers spikes
- **Single Point of Failure?** RDS.

---

