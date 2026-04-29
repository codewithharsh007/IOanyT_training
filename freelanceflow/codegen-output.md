# Code Generation Output

## Summary
Generated the full FreelanceFlow backend and frontend per the provided structure files and requirements.

## Backend
- Express API with JWT auth, refresh tokens, rate limiting, sanitization, and audit logs
- MongoDB models for users, clients, projects, time logs, invoices, line items, payments, and audit logs
- Services and routes for CRUD operations, portal access, and dashboard metrics
- Tests (unit + integration) scaffolded for critical services and endpoints

## Frontend
- React + Vite app with Tailwind CSS v4
- Auth flows, dashboard, client/project/invoice/time log pages, and settings
- Reusable component library and data hooks

## Skipped (per requirements)
- docker-compose.yml
- backend/Dockerfile
- frontend/Dockerfile
- .github/workflows/deploy.yml
- tailwind.config.js
- postcss.config.js

## Notes
- Backend services include rule, edge case, and security tags.
- API base URL must be set via `VITE_API_BASE_URL` in the frontend environment.
