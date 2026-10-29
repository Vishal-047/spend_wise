# SpendWise — Personal Finance Tracker

SpendWise is a practical full-stack MVP for recording income and expenses, managing monthly budgets, and reviewing personal cash flow. It stores amounts as integer minor units (paise for INR), uses MongoDB through Mongoose, and keeps the browser separate from the API.

## Features

- Secure registration/login/logout with bcrypt password hashes and HTTP-only JWT cookie.
- Ownership-protected transaction, category, budget, profile, dashboard, report, and CSV export APIs.
- Filtering, searching, sorting, pagination, safe CSV escaping, category compatibility, and account deletion.
- Responsive Next.js App Router UI with login, dashboard, transactions, budgets, categories, reports, and settings routes.

## Stack and structure

`backend/` is an Express + TypeScript + Mongoose REST API; `frontend/` is Next.js 15 + TypeScript + Tailwind. The browser never connects directly to MongoDB.

## Setup

Prerequisites: Node.js 20+, npm, and MongoDB 6+ locally or a MongoDB Atlas URI.

```bash
cp .env.example .env
npm run install:all
npm run dev
```

The API runs on `http://localhost:4000`, and the web app on `http://localhost:3000`. To seed fictional development data: `npm run seed --prefix backend` (add `"seed":"tsx src/seed.ts"` to scripts if using this command). Demo credentials are `demo@spendwise.local` / `DemoPass123!`.

If you start the applications separately, use these commands in two terminals:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

The backend requires a reachable MongoDB instance using `MONGODB_URI`. The frontend can start independently, but authenticated features require both services.

Validation commands:

```bash
npm run typecheck
npm test
npm run build
```

The commands above should be run after dependencies are installed. This workspace records outcomes only after they are actually executed; MongoDB-backed integration tests require a reachable test database.

## Documentation

- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [DATABASE_DESIGN.md](DATABASE_DESIGN.md)
- [PROJECT_REPORT.md](PROJECT_REPORT.md)

## Environment and deployment

See `.env.example`. Never commit `.env` or production secrets. Deploy the frontend to Vercel, API to Render/Fly.io/another Node host, and MongoDB to Atlas. Configure the exact frontend origin, HTTPS, secure cookies, and restricted Atlas network access in production. No deployment has been claimed for this repository.

## Design decisions and limitations

The MVP defaults to INR and Asia/Kolkata, with USD/EUR/GBP profile options. Dates are stored as instants and monthly reporting uses UTC boundaries; production deployments should align this with a user's timezone. Account deletion permanently removes the user and owned records. This is manual recordkeeping, not a bank/UPI integration, financial-advice service, or compliance-certified product.

## Screenshots

Screenshots are intentionally placeholders until the app is run: `[login] [dashboard] [transactions] [budgets] [reports] [mobile]`.
