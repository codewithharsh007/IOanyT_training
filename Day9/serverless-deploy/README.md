# Deploy Serverless API — Hands-On Exercise

## Goal
Use Claude Code to deploy a serverless "Notes" API on AWS.

## Stack
- **API Gateway** — HTTP API (REST endpoints)
- **Lambda** — Python function (business logic)
- **DynamoDB** — NoSQL database (data storage)

## API Specification

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /notes | Create a new note |
| GET | /notes | List all notes |
| GET | /notes/{id} | Get a specific note |
| PUT | /notes/{id} | Update a note |
| DELETE | /notes/{id} | Delete a note |

## Note Schema
```json
{
    "id": "uuid",
    "title": "string",
    "content": "string",
    "created_at": "ISO timestamp",
    "updated_at": "ISO timestamp"
}
```

## Your Task (150 min)

### Phase 1: Deploy (90 min)
Use Claude Code to:
1. Write the Lambda function code
2. Create the DynamoDB table
3. Set up API Gateway
4. Deploy and test each endpoint

### Phase 2: Verify (30 min)
- Test all 5 endpoints with curl
- Verify data persists across requests
- Try edge cases (empty title, very long content, non-existent ID)

### Phase 3: Explain (30 min)
Write a short document answering:
1. What did you just deploy? (Architecture description)
2. What happens when a user calls `POST /notes`? (Trace the request)
3. What would break if 10,000 users hit this simultaneously?
4. How much would this cost per month with 1000 daily users?
5. What security concerns exist? (Authentication, authorization)

## Deliverable
Push to your branch:
- `lambda/handler.py` — Your Lambda function
- `deployment-notes.md` — Phase 3 answers
- `test-results.md` — Screenshot or curl output of working endpoints

## Important
- Use your AWS sandbox account (ask evaluator for credentials)
- Budget guardrail: $5 maximum for this exercise
- Clean up resources when done!
