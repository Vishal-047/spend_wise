# SpendWise API

Base URL: `http://localhost:4000/api`. JSON responses use `{ success, data }`; errors use `{ success:false, error, details? }`. Private routes authenticate with the `spendwise_token` HTTP-only cookie (a Bearer token is accepted for API clients).

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | Auth lifecycle |
| GET | `/auth/me` | Safe current profile |
| PATCH/DELETE | `/users/me` | Profile or permanent account deletion |
| GET/POST | `/transactions` | Paginated list/create |
| GET/PATCH/DELETE | `/transactions/:id` | Owned transaction operations |
| GET | `/transactions/export` | Filtered CSV export |
| GET/POST | `/categories` | List/create categories |
| PATCH/DELETE | `/categories/:id` | Update/deactivate owned category |
| GET/POST | `/budgets` | List/create monthly budgets |
| GET/PATCH/DELETE | `/budgets/:id` | Owned budget operations |
| GET | `/dashboard/summary` | Current/selected month totals and progress |
| GET | `/reports/monthly`, `/reports/categories`, `/reports/cash-flow` | Aggregated report data |
| GET | `/health` | Non-sensitive health response |

Transaction list query parameters include `page`, `limit`, `type`, `category`, `paymentMethod`, `from`, `to`, `search`, `sort=amount|date`, and `order=asc|desc`. Dashboard/report month selection accepts `year` and `month`. Ownership is always derived from authentication, never request input.

