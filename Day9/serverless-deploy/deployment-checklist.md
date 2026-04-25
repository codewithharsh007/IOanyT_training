# Deployment Checklist

Use this to track your progress:

## Setup
- [ ] AWS CLI configured with sandbox credentials
- [ ] Python 3.9+ available
- [ ] Claude Code connected

## DynamoDB
- [ ] Table created: `workshop-notes`
- [ ] Partition key: `id` (String)
- [ ] Table is in `us-east-1` region

## Lambda
- [ ] Function created: `workshop-notes-api`
- [ ] Runtime: Python 3.9+
- [ ] Handler code written and deployed
- [ ] IAM role allows DynamoDB access
- [ ] Test event works in Lambda console

## API Gateway
- [ ] HTTP API created
- [ ] Routes configured (POST, GET, PUT, DELETE)
- [ ] Lambda integration set up
- [ ] Deployment stage created
- [ ] Endpoint URL recorded: _______________

## Testing
- [ ] POST /notes — creates a note ✓
- [ ] GET /notes — lists all notes ✓
- [ ] GET /notes/{id} — retrieves specific note ✓
- [ ] PUT /notes/{id} — updates a note ✓
- [ ] DELETE /notes/{id} — deletes a note ✓
- [ ] Edge case: empty title returns error ✓
- [ ] Edge case: non-existent ID returns 404 ✓

## Cleanup
- [ ] Lambda function deleted
- [ ] API Gateway deleted
- [ ] DynamoDB table deleted
- [ ] IAM role deleted
