# SpendWise — Personal Finance Tracker
## Project Specification and Build Instructions for Antigravity

> **Instruction to the coding agent:** Build a complete, working full-stack web application from this specification. Do not stop at a mockup or static UI. Implement the frontend, backend, MongoDB database integration using Mongoose, authentication, validation, testing, and project documentation. Do not leave core features as TODOs. Make sensible decisions where details are unspecified and document those decisions.

---

## 1. Project Overview

**Project name:** SpendWise — Personal Finance Tracker  
**Project type:** Full-stack web application  
**Primary purpose:** Help individuals record income and expenses, create budgets, and understand their spending patterns through clear summaries and reports.

### 1.1 Problem statement

Many students, salaried employees, and other individuals manage their money through memory, paper notes, or scattered spreadsheets. This makes it difficult to maintain an accurate record of daily transactions, identify unnecessary spending, compare expenses with a monthly budget, and understand how their financial habits change over time.

The project will provide a centralized, easy-to-use application where a user can securely record income and expenses, organize transactions by category, set monthly budgets, and view summaries of their financial activity. It is an educational personal-recordkeeping tool, not a banking application or a financial-advice service.

### 1.2 Proposed solution

SpendWise will provide an authenticated dashboard backed by MongoDB. Mongoose will define and validate the application's data models. Users will be able to manage transactions, categories, and budgets, filter transaction history, and review visual reports such as income versus expenses and spending by category.

### 1.3 Target users

- College students tracking allowances, part-time income, and daily expenses.
- Salaried individuals monitoring monthly income and spending.
- Freelancers recording income received from different sources.
- Anyone who wants a simple manual way to understand personal cash flow.

### 1.4 Project objectives

1. Provide secure registration, login, and logout.
2. Allow users to create, view, edit, and delete income and expense transactions.
3. Organize transactions by category, date, payment method, and optional notes.
4. Let users create monthly budgets and monitor their progress.
5. Calculate income, expenses, and net balance for selected periods.
6. Display clear charts and transaction summaries.
7. Support search, filters, pagination, and CSV export.
8. Store and validate records through Mongoose models.
9. Prevent one user from viewing or modifying another user's financial records.
10. Produce a complete project report suitable for conversion to a Word document.

### 1.5 Scope and assumptions

- Users enter transaction details manually.
- The initial release supports one preferred currency per user. Default currency: INR (₹), configurable in profile settings.
- The application does not connect to bank accounts, payment gateways, UPI services, or financial institutions.
- The application does not provide investment recommendations, tax advice, credit scoring, or automated financial advice.
- Transactions represent records entered by the user; the application does not verify that money was actually transferred.
- This is a student portfolio project. Do not claim production-grade financial compliance or independently verified financial outcomes.

---

## 2. Required Technology Stack

Use current stable, mutually compatible versions and record the versions actually installed in the README.

### Frontend
- Next.js with App Router.
- TypeScript.
- Tailwind CSS.
- A consistent accessible component system such as shadcn/ui.
- Recharts for dashboard charts.
- React Hook Form and Zod for form validation where appropriate.
- A suitable icon library such as Lucide.

### Backend
- Node.js.
- Express.js REST API.
- MongoDB.
- Mongoose ODM for all database models and queries.
- Zod or an equivalent schema-validation library for request validation.
- JWT-based authentication with secure handling. Prefer short-lived access tokens and secure, HTTP-only cookies when compatible with the chosen architecture.
- bcrypt or Argon2 for password hashing.
- Helmet, rate limiting, and CORS configured for the actual deployment origins.

### Testing and tools
- Vitest or Jest for unit tests.
- Supertest for API integration tests.
- A MongoDB test database or isolated test database for integration tests.
- ESLint and Prettier.
- Git and GitHub-ready repository structure.

### Architecture requirement

Use a clear separation between frontend and backend. A recommended layout is a frontend application and a backend API in separate folders within one repository. The frontend must call the API; do not bypass the API by connecting the browser directly to MongoDB.

If Antigravity selects a different structure, it must preserve the same separation of responsibilities and explain the decision in the documentation.

---

## 3. Functional Requirements

### 3.1 Authentication and profile

- Registration with name, email, password, and password confirmation.
- Login and logout.
- Profile page to edit display name and preferred currency.
- Validate email format and enforce unique normalized email addresses.
- Hash passwords before saving them. Never store or return plaintext passwords.
- Protect all private pages and API endpoints.
- Display useful errors for invalid credentials and duplicate registration.
- Allow users to delete their account with an explicit confirmation. Delete or appropriately anonymize their associated financial records as documented.
- Do not provide a public endpoint that reveals whether arbitrary email addresses are registered.

### 3.2 Dashboard

The dashboard should display data for the selected period, defaulting to the current month:

- Total income.
- Total expenses.
- Net cash flow (income minus expenses).
- Budget usage.
- Recent transactions.
- Expenses grouped by category.
- Income-versus-expense chart over time.
- Monthly spending trend.
- A short list of budgets nearing or exceeding their limits.

All totals must be calculated from the authenticated user's actual stored transactions. Empty states must be helpful and must not display fabricated totals as if they were real user data.

### 3.3 Transactions

Users can create, view, edit, and delete a transaction.

Each transaction should support:

- Type: income or expense.
- Amount: positive monetary value.
- Category.
- Description or title.
- Transaction date.
- Payment method: cash, UPI, card, bank transfer, or other.
- Optional notes.
- Created and updated timestamps.

Requirements:

- Store monetary values in a representation that avoids ordinary floating-point rounding errors. Prefer integer minor units (paise for INR) or a documented decimal-safe strategy. Do not repeatedly calculate currency totals using imprecise floating-point arithmetic.
- Validate that the amount is greater than zero and within a reasonable configured maximum.
- A transaction's category must be valid for the authenticated user and compatible with its transaction type.
- Support filtering by date range, type, category, and payment method.
- Support text search over transaction description and notes.
- Support sorting by date and amount.
- Use pagination for transaction history.
- Confirm before deletion.
- Show a clear success or failure message after each operation.
- Do not accept a user ID from the client as the owner of a new transaction. Derive ownership from the authenticated session.

### 3.4 Categories

- Provide default income categories, such as Salary, Allowance, Freelance, Scholarship, Gift, and Other Income.
- Provide default expense categories, such as Food, Transport, Rent, Education, Shopping, Bills, Health, Entertainment, and Other Expense.
- Users can add, rename, and deactivate their own custom categories.
- A category has a name, transaction type, optional color, owner, and timestamps.
- Category names must be unique per user and transaction type after normalization.
- Do not allow a category belonging to one user to be used by another user.
- Prevent deletion of a category that is referenced by transactions unless the user first reassigns those transactions or explicitly follows a documented safe workflow.
- Seed default categories per new account or provide a safe initialization mechanism. Do not create shared mutable categories that allow users to affect each other's data.

### 3.5 Budgets

Users can create budgets with:

- Name.
- Category (optional for an overall budget).
- Budget amount.
- Period: monthly for the initial release.
- Month and year.
- Active status and timestamps.

Requirements:

- Calculate actual expense against each budget from matching expense transactions in the relevant month.
- Show amount spent, remaining amount, and percentage used.
- Visually flag budgets approaching the limit (for example, at 80%) and budgets that exceed it.
- Prevent duplicate budgets for the same user, period, and category according to a documented uniqueness rule.
- A category budget includes only expenses for that category. An overall budget includes all expenses for the selected month.
- Budget calculations must use the user's preferred currency and consistent month-boundary rules.
- Editing or deleting transactions must update the displayed budget usage.
- Clearly label budget figures as based on records entered into the application.

### 3.6 Reports and exports

- Provide monthly and date-range summaries.
- Show total income, total expenses, and net cash flow.
- Show spending breakdown by category.
- Show a time-series chart of income and expenses.
- Allow export of the authenticated user's filtered transactions to CSV.
- Escape CSV cells correctly to avoid malformed exports and spreadsheet-formula injection.
- Exports must respect the same ownership, filters, and date-range rules as the transaction list.
- Include a helpful empty state when no records match the selected period.

### 3.7 UX and accessibility

- Responsive layout for desktop, tablet, and mobile.
- Sidebar or top navigation with Dashboard, Transactions, Budgets, Reports, Categories, and Settings.
- Consistent typography, spacing, form labels, and button styles.
- Loading indicators, empty states, error messages, and success feedback.
- Accessible keyboard navigation, visible focus states, adequate contrast, and labels for form controls.
- Use confirmation dialogs for destructive operations.
- Avoid decorative charts that imply data when there is no data.
- Use INR formatting by default, but format according to the user's selected currency.
- Include a theme toggle only if it can be implemented consistently; it is optional.

---

## 4. Pages and User Flows

### Required pages

1. **Landing page:** Brief description, key benefits, and sign-in/register actions.
2. **Register page:** Account creation and validation.
3. **Login page:** Authentication and helpful error states.
4. **Dashboard:** Financial summary, charts, recent transactions, and budget alerts.
5. **Transactions page:** Search, filters, pagination, and create/edit/delete actions.
6. **Add/Edit transaction form:** Validated transaction details.
7. **Budgets page:** Create and manage monthly budgets, usage progress, and alerts.
8. **Reports page:** Date-range controls, category breakdown, trend charts, and CSV export.
9. **Categories page:** Default and custom categories.
10. **Settings page:** Profile, currency, password change if implemented, and account deletion.

### Primary user flow

1. A user registers and logs in.
2. The application initializes the user's default categories.
3. The user adds income and expense records.
4. The dashboard updates based on the saved records.
5. The user creates a monthly budget.
6. The user checks budget progress and spending reports.
7. The user filters or exports transaction history.
8. The user can edit or delete records and see all related totals recalculate.

Provide a brief onboarding prompt or sample-data option for new users. Demo data must be clearly identified as sample data and must never be mixed into a real user's records without their explicit action.

---

## 5. Data Model and Mongoose Requirements

Implement well-structured Mongoose schemas, model files, validation, timestamps, and indexes. Use ObjectId references for independently managed records. Document the reasons for embedding or referencing in the report.

### 5.1 User model

Suggested fields:

- Display name.
- Normalized, unique email.
- Password hash.
- Preferred currency, default INR.
- Optional timezone.
- Created and updated timestamps.

Requirements:

- Never serialize the password hash in API responses.
- Add a unique index for normalized email.
- Validate allowed currencies and field lengths.
- Do not store bank account numbers, card numbers, UPI PINs, banking credentials, or other unnecessary sensitive data.

### 5.2 Transaction model

Suggested fields:

- Owner: reference to User, required.
- Type: income or expense.
- Amount in integer minor units or a documented decimal-safe representation.
- Currency code.
- Category: reference to Category, required.
- Description/title.
- Transaction date.
- Payment method.
- Optional notes.
- Created and updated timestamps.

Requirements:

- Validate positive amounts, valid dates, supported transaction types, payment methods, and text lengths.
- Index common queries, particularly owner plus transaction date, and owner plus type/date where justified by query patterns.
- Use compound indexes based on actual filters and sorting. Avoid adding indexes without a reason.
- Apply owner filters in every read, update, and delete query.
- Ensure the category belongs to the same user and matches the transaction type.
- Prevent mass assignment: only explicitly allowed fields may be updated.

### 5.3 Category model

Suggested fields:

- Owner: reference to User.
- Name.
- Type: income or expense.
- Optional display color.
- Is default or custom, if needed.
- Active/inactive status.
- Timestamps.

Requirements:

- Normalize category names.
- Enforce uniqueness per owner and type using a compound unique index.
- Prevent users from modifying system-level definitions in a way that affects other users.
- Ensure inactive categories cannot be selected for new transactions unless the design explicitly allows it.

### 5.4 Budget model

Suggested fields:

- Owner: reference to User.
- Name.
- Optional category reference; absence means an overall monthly budget.
- Amount in the same safe monetary representation as transactions.
- Period type, initially monthly.
- Month and year, or a normalized period-start date.
- Active status.
- Timestamps.

Requirements:

- Validate budget amount and period.
- Add an appropriate compound unique index based on the selected rule for one budget per user/category/month.
- Correctly handle the overall-budget case where category is absent.
- Validate that a selected category belongs to the same user and is an expense category.
- Compute usage from transactions rather than maintaining a potentially stale duplicated total, unless a documented and tested aggregation strategy is chosen.

### 5.5 Relationships

Document and implement these relationships:

- One user has many transactions.
- One user has many categories.
- One user has many budgets.
- Each transaction references one category and one owner.
- A category budget references one category; an overall budget has no category reference.

Create a Mermaid ER diagram in the documentation. Ensure the diagram accurately reflects the implemented models.

### 5.6 Mongoose-specific expectations

- Use Mongoose for database access, schemas, validation, references, and indexes.
- Use schema-level validation and request-level validation; neither replaces authorization checks.
- Handle duplicate-key errors and validation/casting errors gracefully.
- Use `.lean()` for suitable read-only queries where it improves simplicity or performance.
- Use `.populate()` selectively, only for required related fields.
- Use aggregation pipelines for reports when appropriate.
- Avoid unbounded queries and unpaginated transaction history.
- Avoid relying only on frontend validation.
- Document the trade-off between stored monetary values and display formatting.

---

## 6. REST API Requirements

Use a consistent JSON response format and central error handler. Prefix routes with `/api`. Exact route names may be refined, but all listed functionality must exist.

### Authentication and profile
- `POST /api/auth/register` — create account.
- `POST /api/auth/login` — authenticate.
- `POST /api/auth/logout` — log out and clear/invalidate authentication as supported by the chosen design.
- `GET /api/auth/me` — return the current user's safe profile.
- `PATCH /api/users/me` — update display name, currency, or supported profile settings.
- `DELETE /api/users/me` — delete account and associated data after confirmation and reauthentication if appropriate.

### Transactions
- `GET /api/transactions` — list current user's transactions with pagination, search, filters, and sorting.
- `POST /api/transactions` — create transaction.
- `GET /api/transactions/:id` — fetch one owned transaction.
- `PATCH /api/transactions/:id` — update an owned transaction.
- `DELETE /api/transactions/:id` — delete an owned transaction.
- `GET /api/transactions/export` — export filtered transactions to CSV.

### Categories
- `GET /api/categories` — list current user's categories.
- `POST /api/categories` — create custom category.
- `PATCH /api/categories/:id` — rename or update supported category fields.
- `DELETE /api/categories/:id` — safely delete or deactivate a category according to transaction references.

### Budgets
- `GET /api/budgets` — list budgets, optionally filtered by month/year.
- `POST /api/budgets` — create budget.
- `GET /api/budgets/:id` — get one budget with computed usage.
- `PATCH /api/budgets/:id` — update owned budget.
- `DELETE /api/budgets/:id` — delete owned budget.

### Dashboard and reports
- `GET /api/dashboard/summary` — summary for a selected period.
- `GET /api/reports/monthly` — income, expenses, and net cash flow by month.
- `GET /api/reports/categories` — expense breakdown by category.
- `GET /api/reports/cash-flow` — time-series income and expense data.

### API rules

- All private routes require authentication.
- Derive the current user ID from trusted authentication middleware.
- Never trust an owner ID submitted in the request body or query string.
- Return appropriate status codes: 200 for successful reads/updates, 201 for creation, 204 where a delete has no response body, 400 for invalid input, 401 for unauthenticated requests, 403 where access is forbidden, 404 for missing or inaccessible resources as appropriate, 409 for conflicts, and 500 for unexpected server errors.
- Do not expose stack traces, database connection strings, password hashes, JWT secrets, or internal error details to clients.
- Validate ObjectIds, query parameters, pagination bounds, date ranges, and allowed sort fields.
- Return stable, documented response shapes and actionable validation messages.
- Ensure transaction and dashboard totals use identical date, currency, and ownership rules.

---

## 7. Financial Calculation Rules

These rules are critical; implement them consistently and test them.

1. **Income total:** Sum income transactions in the requested date range for the authenticated user.
2. **Expense total:** Sum expense transactions in the requested date range for the authenticated user.
3. **Net cash flow:** Income total minus expense total for that period. Do not label this as bank balance.
4. **Expense category totals:** Sum expense transactions grouped by category for the selected period.
5. **Budget usage:** Sum matching expenses within the budget's month. Category budgets include only the chosen category; overall budgets include all expense categories.
6. **Remaining budget:** Budget amount minus amount spent. It may be negative when spending exceeds the budget.
7. **Percentage used:** Amount spent divided by budget amount multiplied by 100. Handle invalid or zero budget amounts through validation.
8. **Date boundaries:** Define and document the user's timezone and month-boundary behavior. Use a consistent inclusive-start/exclusive-end date-range strategy where possible.
9. **Currency:** The MVP should avoid mixing currencies in a single total. Use one preferred currency and ensure each transaction's stored currency matches the supported policy. If multi-currency transactions are added later, conversion must be explicit and use a documented exchange-rate source; do not silently add different currencies.
10. **Rounding:** Perform calculations in the safe stored representation, then format for display. Test paise/decimal edge cases.
11. **Updates/deletions:** All dashboard and report figures must reflect edits and deletions immediately after the relevant query is refreshed.
12. **No data:** Empty results should return valid zero totals and empty chart datasets, not errors or invented values.

---

## 8. Security, Privacy, and Reliability

Personal financial records are sensitive. Implement the following minimum safeguards:

- Hash passwords with bcrypt or Argon2.
- Store secrets in environment variables; provide only a placeholder `.env.example`.
- Never commit real credentials or a populated `.env` file.
- Use HTTPS in production.
- Configure CORS to allow only intended frontend origins.
- Use Helmet and rate limiting, especially for authentication endpoints.
- Validate and normalize every incoming request.
- Prevent NoSQL injection and mass-assignment vulnerabilities.
- Do not construct database filters directly from untrusted objects.
- Use authentication and ownership checks on every protected resource.
- Ensure user A cannot read, modify, export, or delete user B's data by changing an ID.
- Use secure, HTTP-only, SameSite cookies if cookies are used; configure CSRF protection appropriately for the selected authentication approach.
- Do not store access tokens in localStorage if a safer cookie-based architecture is practical.
- Avoid logging transaction descriptions, notes, passwords, tokens, or other private data.
- Use generic authentication errors where appropriate.
- Do not include advertising trackers or unnecessary third-party analytics.
- Provide clear account deletion behavior and avoid retaining data unnecessarily.
- Add a health-check endpoint that does not reveal sensitive system information.
- Handle database disconnection and shutdown gracefully.
- Set request body-size limits.
- Never claim that the project is certified or compliant with a financial regulation unless that has actually been independently established.

---

## 9. Testing Requirements

Write and run automated tests. Do not merely create test files that have not been executed.

### Unit tests
- Monetary amount validation and formatting.
- Income, expense, and net cash-flow calculations.
- Category grouping.
- Budget usage and over-budget conditions.
- Month boundaries and date-range filtering.
- Empty-data behavior.
- CSV escaping and export formatting.

### Mongoose/model tests
- Required fields and invalid transaction types.
- Rejection of zero and negative amounts.
- Unique email enforcement.
- Category uniqueness per user and type.
- Invalid category/transaction type combinations.
- Budget amount and period validation.
- Duplicate-key error handling.

### API integration tests
- Successful registration and login.
- Invalid credentials and duplicate registration.
- Protected endpoint rejects unauthenticated requests.
- User A cannot access User B's transactions, categories, budgets, or exports.
- Create, read, update, and delete transaction flows.
- Filtering, sorting, and pagination.
- Budget calculations after transaction changes.
- Dashboard/report totals for a known test dataset.
- CSV export respects ownership and filters.
- Malformed ObjectIds and invalid query parameters return controlled errors.

### Frontend checks
- Forms display validation errors.
- Loading, empty, and error states render correctly.
- Dashboard charts handle empty and populated datasets.
- Core pages are usable on mobile-sized viewports.
- Authentication state protects private routes.

### Completion gate

Run linting, type checking, and the automated test suite. Fix failures before declaring the project complete. In the README, state the actual commands run and their results. Do not invent passing test results.

---

## 10. Seed Data and Demo Experience

- Provide a safe development-only seed process.
- Include a clearly documented demo account only for local demonstration, if needed.
- Never use real personal financial data.
- Provide sample income, expenses, categories, and budgets with fictional values.
- Make it obvious when demo data is being shown.
- Do not seed demo data into production automatically.
- Ensure seed scripts are repeatable or safely detect existing records.
- Include enough sample records to demonstrate monthly summaries, category charts, and budget warnings.
- If providing a "Load demo data" action, require explicit user consent and ensure the sample data is associated only with that user.

---

## 11. UI and Design Direction

Build a polished, professional finance dashboard. Avoid an unfinished template appearance.

### Visual direction
- Clean, calm, modern interface suitable for a personal finance product.
- Neutral backgrounds, strong readable typography, consistent spacing, and restrained use of color.
- Use green or a similarly clear visual treatment for income, red/amber for expenses and budget warnings, while maintaining accessible contrast.
- Use cards for key metrics and charts for trends, not excessive decoration.
- Use a consistent design system across all pages.
- Include responsive navigation and clearly visible primary actions.
- Make currency and date formats easy to read.
- Provide a confirmation step for destructive actions.
- Ensure charts include titles, legends, and accessible labels or accompanying summaries.

### Dashboard layout
- Header with app name, selected month, profile menu, and add-transaction action.
- Summary cards for income, expenses, net cash flow, and budget usage.
- Income-versus-expense chart.
- Category spending chart.
- Budget progress list.
- Recent transactions table/list.
- Clear first-use empty state with a call to action.

Do not fabricate analytics, customer testimonials, bank integrations, or claims about money saved.

---

## 12. Project Structure and Code Quality

Use a maintainable structure with clear separation of concerns. The final repository should include, as applicable:

- Frontend pages, reusable components, form schemas, API client, and types.
- Backend configuration, routes, controllers, services, middleware, models, validators, and utilities.
- Shared types only if the selected repository structure supports them cleanly.
- Test folders for unit and integration tests.
- Seed scripts.
- `.env.example`.
- `.gitignore`.
- Root and application-level package scripts as appropriate.
- `README.md`.
- `PROJECT_REPORT.md`.
- `API_DOCUMENTATION.md`.
- `DATABASE_DESIGN.md` or an equivalent database section in the report.
- A Mermaid architecture diagram and ER diagram.
- A folder for report screenshots or a list of required screenshots.

Use consistent naming, small modules, clear error handling, and reusable UI components. Avoid one enormous controller or page component. Do not overengineer the MVP with microservices, payment integration, bank scraping, or unnecessary infrastructure.

---

## 13. Environment Configuration and Running the Project

Provide a `.env.example` with documented placeholders for the variables actually required by the implementation. These may include:

- Backend port.
- MongoDB connection URI.
- JWT signing secret or the required session secret.
- Frontend base URL / allowed CORS origin.
- Environment mode.
- Optional cookie configuration.

Requirements:

- Validate required environment variables at startup.
- Fail with a clear developer-facing message when configuration is missing, without printing secret values.
- Document local MongoDB and MongoDB Atlas setup.
- Document how to install dependencies, configure environment variables, seed demo data, run frontend and backend, and run tests.
- Explain that production secrets must be configured in the hosting provider, not committed to source control.
- Include troubleshooting for common database connection, CORS, and authentication configuration issues.

Do not hardcode credentials, hosts, or production URLs.

---

## 14. Deployment Requirements

Provide practical deployment instructions for a student portfolio project.

- Frontend may be deployed to Vercel or another suitable host.
- Express API may be deployed to Render or another Node-compatible host.
- MongoDB may use MongoDB Atlas or a local database for development.
- Configure production environment variables securely.
- Configure the production frontend origin in CORS and authentication settings.
- Use HTTPS and secure cookie settings in production.
- Configure the database network access narrowly where possible.
- Do not expose the database URI in frontend environment variables.
- Include a production smoke-test checklist.
- Document the actual deployed URLs only after deployment succeeds. If deployment is not performed, clearly label deployment instructions as instructions rather than claiming the app is live.

---

## 15. Required Documentation: College Project Report

Create a detailed and well-formatted `PROJECT_REPORT.md` that can later be converted into a `.docx` file. The report should describe the implementation that was actually built. Do not claim that unimplemented features exist.

Use formal but clear academic English. Include a title page section with placeholders for details the student must fill in. Do not invent college, department, supervisor, or submission details.

### Required report outline

1. **Title Page**
   - Project title: SpendWise — Personal Finance Tracker.
   - Student name, roll number, course, department, institution, supervisor, academic year, and submission date as editable placeholders.

2. **Certificate / Declaration / Acknowledgement**
   - Include optional templates with clearly marked placeholders.
   - Do not imply that a supervisor has approved or signed anything.

3. **Abstract**
   - Summarize the problem, proposed application, technology stack, core features, and outcome.
   - Write the final outcome only after implementation and testing.

4. **Table of Contents**
   - Provide headings suitable for automatic generation in a word processor.

5. **Introduction**
   - Explain personal expense tracking and why structured digital records may be useful.
   - Avoid unsupported statistics or exaggerated claims.

6. **Problem Statement**
   - Describe the limitations of manual, scattered, or unstructured expense tracking.
   - State the specific problem this application addresses.

7. **Aim and Objectives**
   - Provide one overall aim and measurable project objectives.

8. **Project Scope**
   - Explain what the application includes and excludes.
   - Distinguish current capabilities from future ideas.

9. **Existing System and Its Limitations**
   - Discuss manual notes, spreadsheets, or other generic tracking methods as possible existing approaches.
   - Do not make unsupported claims about specific products.

10. **Proposed System**
    - Describe SpendWise, its users, core modules, and expected practical benefits.
    - Do not claim that financial results or user behavior have improved unless measured.

11. **Requirements Analysis**
    - Functional requirements.
    - Non-functional requirements.
    - Hardware and software requirements.

12. **Technology Stack**
    - Explain the role of Next.js, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, charting, validation, and testing tools actually used.

13. **System Architecture**
    - Explain frontend, REST API, authentication middleware, business logic, Mongoose models, and MongoDB.
    - Include a Mermaid architecture diagram.

14. **Database Design**
    - Describe User, Transaction, Category, and Budget models.
    - Include important fields, validation, relationships, indexes, and design decisions.
    - Include a Mermaid ER diagram matching the implemented schema.

15. **Module Description**
    - Authentication and profile management.
    - Transaction management.
    - Category management.
    - Budget management.
    - Dashboard and reports.
    - CSV export.
    - Security and validation.

16. **System Workflow**
    - Describe registration, transaction creation, budget creation, dashboard aggregation, and report export.

17. **Implementation Details**
    - Explain how Mongoose models and validation are used.
    - Explain key API routes and business rules.
    - Describe frontend components and chart data flow.
    - Do not paste large source-code listings; short excerpts are optional and only if useful.

18. **Security and Privacy**
    - Explain password hashing, authentication, ownership checks, validation, secrets, and safe error handling.
    - Clearly state the application's limitations and that it is not connected to banks.

19. **Testing and Results**
    - Include a test plan and a table with test case, input/scenario, expected result, actual result, and status.
    - Fill actual results only from tests genuinely executed.
    - Include placeholders for screenshots of registration/login, dashboard, transactions, budgets, reports, and mobile layout.
    - Include a note on test environment and any limitations.

20. **Installation and User Guide**
    - Prerequisites.
    - Environment setup.
    - Database setup.
    - Running frontend and backend.
    - Creating an account and using the main features.
    - Running tests and seed data.

21. **Limitations**
    - Manual transaction entry.
    - No direct bank/UPI synchronization.
    - No automated exchange-rate conversion in the MVP.
    - No financial advice.
    - Other limitations discovered during implementation.

22. **Future Enhancements**
    - Optional recurring transactions.
    - Savings goals.
    - Receipt attachment/OCR with privacy safeguards.
    - Multi-currency support with a documented exchange-rate source.
    - Optional reminders.
    - Import from user-provided CSV with preview and validation.
    - These are future ideas, not completed features unless actually implemented.

23. **Conclusion**
    - Summarize what was built, what was learned about full-stack development and Mongoose, and what the tests demonstrated.
    - Base conclusions on the actual implementation.

24. **References**
    - Include links to official documentation actually consulted, such as MongoDB, Mongoose, Node.js, Express, Next.js, OWASP, and testing libraries.
    - Use a consistent citation style.
    - Do not fabricate articles, authors, statistics, or publication dates.

25. **Appendices**
    - API endpoint summary.
    - Additional diagrams.
    - Test evidence.
    - Screenshot placeholders.
    - Glossary of technical terms if useful.

### Documentation integrity rules

- Use placeholders for missing personal and institutional information.
- Clearly label assumptions.
- Never invent test results, deployment links, screenshots, user studies, statistics, citations, or supervisor approval.
- Ensure the report matches the final code and actual features.
- Keep report content suitable for a formal college submission and Word document conversion.
- Add a final checklist of details the student must fill in or verify before submission.

---

## 16. README Requirements

Create a concise but complete `README.md` containing:

- Project name and purpose.
- Problem statement and solution summary.
- Main features.
- Screenshots section with placeholders until real screenshots exist.
- Technology stack.
- Architecture overview.
- Prerequisites.
- Local setup and environment configuration.
- How to seed demo data.
- How to run frontend, backend, and tests.
- API documentation link.
- Deployment instructions or verified deployment links.
- Known limitations.
- Security and privacy note.
- Future enhancements.

---

## 17. Acceptance Criteria

The project is complete only when the following can be demonstrated:

- [ ] A user can register, log in, and log out.
- [ ] Passwords are securely hashed and never exposed by the API.
- [ ] A logged-in user can create, view, edit, and delete income and expense transactions.
- [ ] Transaction amounts, dates, types, and categories are validated.
- [ ] A user can manage custom categories safely.
- [ ] A user can create and manage monthly category and overall budgets.
- [ ] Budget usage reflects the correct transactions and month.
- [ ] Dashboard totals match a known test dataset.
- [ ] Reports show category spending and cash-flow trends.
- [ ] Transaction filtering, search, sorting, pagination, and CSV export work.
- [ ] Monetary calculations avoid ordinary floating-point precision errors.
- [ ] One user cannot access another user's records by changing an ID or query parameter.
- [ ] API errors are consistent and do not leak secrets.
- [ ] The interface is responsive and provides loading, empty, and error states.
- [ ] Mongoose models include appropriate validation, references, timestamps, and justified indexes.
- [ ] Automated unit and integration tests are present and have been run.
- [ ] Linting and type checking have been run, and known failures are fixed or clearly documented.
- [ ] `.env.example` exists and no real secrets are committed.
- [ ] README and project report describe the actual implementation.
- [ ] The report includes architecture and ER diagrams, testing evidence, screenshot placeholders, limitations, future work, conclusion, and references.
- [ ] Setup instructions work from a clean checkout.

---

## 18. Build Order for Antigravity

Implement the project in manageable phases, keeping the application runnable throughout.

### Phase 1 — Planning and foundation
- Inspect the repository before making changes.
- Propose the architecture and folder structure.
- Set up frontend, backend, linting, TypeScript, environment validation, and MongoDB connection.
- Create a concise implementation checklist.

### Phase 2 — Database and authentication
- Implement Mongoose models and indexes.
- Implement registration, login, logout, authentication middleware, and profile routes.
- Add validation and authentication tests.

### Phase 3 — Transactions and categories
- Implement transaction and category APIs and forms.
- Add ownership checks, filters, sorting, pagination, and tests.
- Confirm safe monetary calculations.

### Phase 4 — Budgets and reports
- Implement budget CRUD and budget calculations.
- Implement dashboard summaries, aggregation/report endpoints, charts, and CSV export.
- Test calculations against known datasets.

### Phase 5 — UI polish
- Build all required pages.
- Add loading, empty, error, and success states.
- Check mobile responsiveness and accessibility.

### Phase 6 — Quality and security
- Run unit and integration tests, linting, and type checking.
- Fix issues.
- Verify cross-user isolation, invalid input handling, and CSV safety.
- Review secret handling and production configuration.

### Phase 7 — Documentation and delivery
- Write README, API documentation, database design, and `PROJECT_REPORT.md`.
- Add accurate Mermaid architecture and ER diagrams.
- Include screenshot placeholders and a submission checklist.
- Provide a final summary of implemented features, tests actually run, commands to launch the project, environment variables required, known limitations, and deployment status.

**Important final instruction:** Prioritize a working, understandable, secure MVP over unnecessary complexity. Do not stop after generating a plan. Implement the application, run the available checks, fix issues, and create the documentation files requested above. Clearly identify anything that could not be completed or verified.
