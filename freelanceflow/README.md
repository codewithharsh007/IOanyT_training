# FreelanceFlow

FreelanceFlow is a full-stack workspace for freelancers to manage clients, projects, time logs, invoices, payments, and audit history.

## Features
- Client and project management
- Time tracking and invoice creation
- Payment recording with audit logs
- Freelancer dashboard metrics
- Client portal access (read-only)

## Tech Stack
- Backend: Node.js, Express, MongoDB
- Frontend: React + Vite, Tailwind CSS v4

## Prerequisites
- Node.js 20+
- MongoDB instance

## Backend Setup
1. Open a terminal in the project root.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a local environment file:
   ```bash
   cp .env.example .env
   ```
4. Update values in `.env` (see `.env.example`).
5. Start the server:
   ```bash
   npm run dev
   ```

Backend will run on `http://localhost:5000` by default.

## Frontend Setup
1. Open a second terminal in the project root.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create a `.env` file and set your API URL:
   ```bash
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173` by default.

## Tests
Backend tests:
```bash
cd backend
npm test
```

## Notes
- Docker and deployment workflows were intentionally skipped per requirements.
- Tailwind v4 uses the Vite plugin and does not require `tailwind.config.js` or `postcss.config.js`.
