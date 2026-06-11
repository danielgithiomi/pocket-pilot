# Pocket Pilot

> Developed by [Daniel Githiomi](https://github.com/danielgithiomi)

Pocket Pilot is a full-stack personal finance application built to help users track accounts,
transactions, bills, savings goals, preferences, and shared expenses from one consistent
interface. The current production focus is the Angular web application, backed by a NestJS API,
PostgreSQL database, Redis cache layer, Prisma ORM, and Docker Compose infrastructure.

![Pocket Pilot web login preview](docs/images/web_login_screenshot.png)

## Table of Contents

1. [Description](#description)
2. [Preview](#preview)
3. [Tech Stack](#tech-stack)
4. [Application Features](#application-features)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [Quick Start](#quick-start)
8. [Environment Variables](#environment-variables)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [Development Commands](#development-commands)
12. [Testing and Quality Checks](#testing-and-quality-checks)
13. [Roadmap](#roadmap)
14. [Maintainer](#maintainer)
15. [Contact](#contact)
16. [License](#license)

---

## Description

Pocket Pilot is designed as a finance command center for everyday money management. Users can
create accounts, record income and expense transactions, transfer money between accounts, manage
custom transaction categories, track recurring bills, plan financial goals, upload profile
pictures, customize preferences, and split shared expenses through the Splitr module.

This repository is organized as a TypeScript monorepo:

- **Backend:** NestJS 11 API with Prisma 7, PostgreSQL, Redis caching, cookie-based JWT auth,
  global response/error handling, and Swagger documentation.
- **Web frontend:** Angular 21 application with standalone routes, route guards, HTTP
  interceptors, shared types/constants, custom UI components, Lottie animations, Syncfusion
  calendars, and Tailwind CSS.
- **Shared package:** Cross-application constants, enums, types, and utility functions used by
  the web application and backend.
- **Infrastructure:** Docker Compose currently provisions PostgreSQL and Redis for local
  development.
- **Mobile:** React Native support is planned so the same backend contract can power mobile
  clients in the future.

The project is built around a consistent frontend-backend contract: the NestJS API wraps
successful responses in a global response shape, and the Angular response interceptor normalizes
that payload for application services. This keeps the web client clean today and gives the future
mobile app a predictable API surface.

---

## Preview

The current placeholder preview shows the web authentication experience.

![Pocket Pilot login screen](docs/images/web_login_screenshot.png)

More screenshots will be added as the dashboard, accounts, transactions, goals, bills, settings,
and Splitr flows are finalized.

---

## Tech Stack

Technologies used to develop this project:

| Layer          | Technologies                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| Monorepo       | npm workspaces, Turborepo                                                     |
| Backend        | NestJS 11, TypeScript, Prisma 7, PostgreSQL, Redis, Swagger                   |
| Authentication | JWT, HTTP-only cookies, Argon2 password hashing, route guards                 |
| Web            | Angular 21, RxJS, TypeScript, Angular Router, Angular HTTP interceptors       |
| UI             | Tailwind CSS 4, Syncfusion calendars, Lottie, Lucide icons, custom components |
| Storage        | AWS S3 presigned URLs for profile picture upload and retrieval                |
| DevOps         | Docker Compose for PostgreSQL and Redis                                       |
| Testing        | Jest for the server, Angular/Vitest tooling for the web app                   |

---

## Application Features

- **Secure authentication:** Register, log in, log out, session checks, cookie-backed JWT auth,
  password hashing, and account lock protection after repeated failed login attempts.
- **Onboarding flow:** New users complete preferences and setup before entering the main app.
- **Account management:** Create, update, view, and delete accounts with account type support,
  owner checks, and cached account lookups.
- **Transaction tracking:** Record income and expenses, view all user transactions, inspect
  account-specific transactions, and delete transactions.
- **Transfers:** Move money between accounts while updating balances and invalidating affected
  caches.
- **Custom categories:** Default categories are created on registration, and users can add or
  remove income and expense categories.
- **Goals:** Create financial goals with target amounts, monthly contributions, status, currency,
  category, and date ranges.
- **Bills:** Track bills by amount, type, currency, and due date.
- **Splitr:** Create squads, record shared events, split costs by strategy, verify totals, track
  payers, and mark events as settled or pending.
- **Preferences:** Store default currency, preferred language, monthly spending limit, and
  application theme.
- **Profile media:** Generate S3 presigned URLs for profile picture uploads and signed read URLs
  for retrieval.
- **Consistent API responses:** Global backend response wrapping and frontend normalization keep
  services predictable.

---

## Architecture

Pocket Pilot is split into three main source areas: the NestJS backend, the Angular web
application, and shared TypeScript contracts.

```mermaid
flowchart LR
    User["User"] --> Web["Angular 21 web app"]
    Web --> Guards["Route guards and auth service"]
    Web --> Client["API client and HTTP interceptors"]
    Client --> API["NestJS API /api/v1"]
    API --> Auth["Cookie JWT auth guard"]
    API --> Modules["Domain modules"]
    Modules --> Prisma["Prisma client"]
    Prisma --> Postgres["PostgreSQL"]
    Modules --> Cache["Redis cache manager"]
    Modules --> S3["AWS S3 presigned URLs"]
```

### Backend Flow

1. Requests enter the NestJS API under the global `/api/v1` prefix.
2. CORS allows the configured `CLIENT_URL` and sends credentials for cookie-based auth.
3. `cookie-parser` reads `access_token` and `refresh_token` cookies.
4. Protected routes use `CookiesAuthGuard` to validate the access token and attach the current
   user to the request.
5. Controllers delegate to services, services enforce business rules, and repositories talk to
   Prisma.
6. Redis-backed cache classes store frequently requested entities such as accounts, account
   details, categories, Splitr squads, and Splitr events.
7. Mutations invalidate the relevant cache keys so the next read returns fresh data.
8. `GlobalResponseInterceptor` wraps successful responses with status, summary, endpoint,
   request ID, and timestamp metadata.
9. `GlobalExceptionFilter` converts framework and application errors into a consistent error
   payload.

### Frontend Flow

1. Angular routes separate authentication, onboarding, and authenticated dashboard layouts.
2. `GuestGuard`, `AuthGuard`, `OnboardingGuard`, and `OnboardedGuard` direct users to the right
   flow based on session and onboarding state.
3. `AuthService` stores the current user in local storage and rehydrates sessions through
   `auth/me`.
4. `RequestInterceptor` adds app headers and sends credentials with API requests.
5. `ResponseInterceptor` maps backend responses from `body` into frontend-friendly `data`.
6. `ErrorInterceptor` clears expired sessions, routes users back to login, and displays toast
   messages for handled errors.
7. UI pages call API services and resource/mutation classes that share constants from the
   `shared` package.

### Backend Modules

| Module           | Responsibility                                                               |
| ---------------- | ---------------------------------------------------------------------------- |
| `identity`       | Registration, login, logout, current user, profile updates, password changes |
| `wallet`         | Accounts, transactions, transfers, transaction categories                    |
| `preferences`    | Onboarding and user preference updates                                       |
| `goals`          | Financial goal creation, listing, deletion, and goal category exposure       |
| `bills`          | Bill creation, listing, deletion, and bill type exposure                     |
| `splitr`         | Shared expense squads, events, splittables, payers, and settlement state     |
| `aws`            | S3 presigned upload and read URLs                                            |
| `infrastructure` | Database, validated config, and Redis cache setup                            |

---

## Project Structure

```text
.
|-- docs/
|   |-- CONTRIBUTING.md
|   `-- images/
|       `-- web_login_screenshot.png
|-- frontend/
|   `-- web/
|       |-- scripts/
|       `-- src/
|           |-- app/
|           |   |-- api/
|           |   |-- components/
|           |   |-- infrastructure/
|           |   `-- pages/
|           `-- environments/
|-- server/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   `-- src/
|       |-- common/
|       |-- infrastructure/
|       |-- libs/
|       `-- modules/
|-- shared/
|   |-- constants/
|   |-- enums/
|   |-- types/
|   `-- utils/
|-- package.json
`-- turbo.json
```

---

## Quick Start

Follow these steps to run Pocket Pilot locally.

### 1. Clone the repository

```bash
git clone https://github.com/danielgithiomi/pocket-pilot.git
cd pocket-pilot
```

### 2. Install dependencies

Install all workspace dependencies from the repository root:

```bash
npm install
```

### 3. Create environment files

```bash
cp server/.env-example server/.env
cp frontend/web/.env.example frontend/web/.env
```

Then update both files with the local values described in
[Environment Variables](#environment-variables).

### 4. Start PostgreSQL and Redis

```bash
npm run docker:up
```

This runs the Docker Compose file in `server/docker-compose.yml` and starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6666` mapped to container port `6379`

### 5. Generate Prisma client

```bash
npm run prisma:generate
```

### 6. Run database migrations

```bash
cd server
npm run prisma:migrate
cd ..
```

### 7. Start the full application

```bash
npm run dev
```

The root `dev` script runs the backend and web frontend through Turborepo.

### 8. Open the application

- Web app: [http://localhost:4200](http://localhost:4200)
- API base URL: [http://localhost:3005/api/v1](http://localhost:3005/api/v1)
- Swagger docs: [http://localhost:3005/api/v1/docs](http://localhost:3005/api/v1/docs)

---

## Environment Variables

### Server

Create `server/.env` from `server/.env-example`.

```env
PORT=3005
CLIENT_URL=http://localhost:4200

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pocket_pilot
POSTGRES_DB=pocket_pilot
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres

JWT_ACCESS_TOKEN_VALIDITY_DURATION=1h
JWT_REFRESH_TOKEN_VALIDITY_DURATION=1d
JWT_SECRET_ENCODING_KEY=replace-with-a-long-random-secret

REDIS_HOST=localhost
REDIS_PORT=6666
REDIS_DEFAULT_TTL_SECONDS=30

AWS_S3_REGION=us-east-1
AWS_MAX_ATTEMPTS=5
AWS_ACCESS_KEY_ID=replace-with-access-key
AWS_SECRET_ACCESS_KEY=replace-with-secret-key
AWS_MAX_SOCKET_TIMEOUT=5000
AWS_MAX_CONNECTION_TIMEOUT=5000
AWS_S3_BUCKET_NAME=replace-with-bucket-name
AWS_PRESIGNED_URL_EXPIRATION_IN_SECONDS=300
AWS_PRESIGNED_READ_URL_EXPIRATION_IN_SECONDS=86400
```

Notes:

- Use `REDIS_PORT=6666` when connecting from the host machine to the Redis container created by
  `server/docker-compose.yml`.
- `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USERNAME`, and `POSTGRES_PASSWORD` must agree with one
  another.
- AWS values are required for profile picture upload and signed image retrieval. Use real AWS S3
  credentials for that flow.

### Web

Create `frontend/web/.env` from `frontend/web/.env.example`.

```env
DEV_API_BASE_URL=http://localhost:3005/api/v1/
PROD_API_BASE_URL=https://your-production-api.example.com/api/v1/
SYNCFUSION_LICENSE_KEY=replace-with-syncfusion-license-key

AWS_S3_REGION=us-east-1
AWS_S3_BUCKET_NAME=replace-with-bucket-name
```

Notes:

- Keep the trailing slash on `DEV_API_BASE_URL` and `PROD_API_BASE_URL`.
- `npm run dev` in `frontend/web` runs `scripts/set-env.development.ts` before Angular starts.
- `npm run build` in `frontend/web` runs `scripts/set-env.production.ts` before creating a
  production build.

---

## Running the Application

### Run everything from the root

```bash
npm run dev
```

### Run the backend only

```bash
cd server
npm run dev
```

### Run the web app only

```bash
cd frontend/web
npm run dev
```

### Run infrastructure only

```bash
npm run docker:up
```

### Open Prisma Studio

```bash
npm run prisma:studio
```

---

## API Documentation

When the backend is running, Swagger documentation is available at:

[http://localhost:3005/api/v1/docs](http://localhost:3005/api/v1/docs)

The API is organized around these route groups:

| Group         | Base route                      |
| ------------- | ------------------------------- |
| Auth          | `/api/v1/auth`                  |
| Users         | `/api/v1/users`                 |
| Onboarding    | `/api/v1/onboarding`            |
| Preferences   | `/api/v1/preferences`           |
| Accounts      | `/api/v1/accounts`              |
| Transactions  | `/api/v1/accounts/transactions` |
| Categories    | `/api/v1/categories`            |
| Goals         | `/api/v1/goals`                 |
| Bills         | `/api/v1/bills`                 |
| Splitr events | `/api/v1/splitr`                |
| Splitr squads | `/api/v1/splitr/squads`         |
| AWS           | `/api/v1/aws`                   |

Successful API responses are wrapped like this:

```json
{
  "success": true,
  "statusCode": 200,
  "body": {},
  "summary": {
    "title": "Operation Successful",
    "details": null
  },
  "metadata": {
    "endpoint": "/api/v1/example",
    "requestId": "uuid",
    "timestamp": "2026-06-04T00:00:00.000Z"
  }
}
```

The Angular web app converts that response into a standard frontend shape with `data`,
`statusCode`, `summary`, `endpoint`, and `timestamp`.

---

## Development Commands

Run these from the repository root unless noted otherwise.

| Command                   | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `npm run dev`             | Start all workspace development servers through Turborepo  |
| `npm run build`           | Build all workspaces                                       |
| `npm run lint`            | Run lint tasks across workspaces                           |
| `npm run test`            | Run workspace tests                                        |
| `npm run docker:up`       | Start PostgreSQL and Redis for the backend                 |
| `npm run prisma:generate` | Generate Prisma client for the server                      |
| `npm run prisma:migrate`  | Run Prisma migrations for the server                       |
| `npm run prisma:reset`    | Reset the Prisma database                                  |
| `npm run prisma:studio`   | Open Prisma Studio                                         |
| `npm run clean`           | Remove generated caches, dependencies, and build artifacts |

Workspace-specific commands:

```bash
cd server
npm run dev
npm run build
npm run test
npm run test:e2e
npm run lint
```

```bash
cd frontend/web
npm run dev
npm run build
npm run test
```

---

## Testing and Quality Checks

Backend tests use Jest:

```bash
cd server
npm run test
npm run test:e2e
npm run test:cov
```

The Angular app uses Angular's unit-test builder with Vitest tooling available in the workspace:

```bash
cd frontend/web
npm run test
```

Before sharing or deploying changes, run:

```bash
npm run lint
npm run build
```

---

## Roadmap

- Add more GitHub README screenshots for dashboard, accounts, transactions, goals, bills, and
  Splitr flows.
- Add production Dockerfiles for the API and web app in addition to the current database/cache
  Docker Compose setup.
- Add the React Native mobile application and connect it to the same `/api/v1` backend contract.
- Expand automated test coverage for high-value finance workflows.
- Add deployment documentation once the first public environment is live.

---

## Maintainer

- [Daniel Githiomi](https://github.com/danielgithiomi)

---

## Contact

Contact Daniel through any of the following channels:

- Website: [danielgithiomi.com](https://danielgithiomi.com)
- GitHub: [danielgithiomi](https://github.com/danielgithiomi)
- LinkedIn: [danielgithiomi](https://www.linkedin.com/in/danielgithiomi)
- Email: [danielgithiomi@gmail.com](mailto:danielgithiomi@gmail.com)

---

## License

This project is licensed under the ISC License.

> Copyright (c) 2026 Daniel Githiomi.
