# Nexora ERP

**Enterprise Resource Planning System**

Nexora ERP is a web-based ERP solution designed to centralize inventory, sales, purchasing, and business operations for small and medium-sized businesses.

## Project Overview

The system aims to provide a centralized platform for managing products, categories, suppliers, customers, warehouses, stock movements, and business transactions.

The project is being developed as part of the Nexora Technologies Internship Program.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Security | Helmet, CORS |
| Containerization | Docker Compose |
| Testing | Jest, Supertest |

## Current Implementation Status

### Completed

- Backend project initialization.
- Express API setup.
- PostgreSQL Docker environment.
- Prisma database schema.
- Initial database migration.
- Prisma Client configuration.
- Database seeding.
- Initial application roles.
- Product categories and main warehouse.
- API health endpoint.
- Database health endpoint.
- Error handling and unknown-route handling.

### In Progress

- Authentication and user management.
- Role-based authorization.
- Inventory management.
- Supplier and customer management.
- Sales and purchasing modules.
- Dashboard and reporting.

## Database

The initial database contains 11 models:

1. Role
2. User
3. Supplier
4. Customer
5. Category
6. Product
7. Warehouse
8. StockBalance
9. StockMovement
10. AuditLog
11. IdempotencyKey

Database migrations are managed using Prisma Migrate.

## Getting Started

### Prerequisites

- Node.js
- npm
- Docker Desktop
- PostgreSQL-compatible environment

### Setup

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Configure the database credentials.
4. Start PostgreSQL:

```bash
docker compose up -d
```

5. Install backend dependencies:

```bash
cd backend
npm install
```

6. Generate Prisma Client:

```bash
npx prisma generate
```

7. Apply database migrations:

```bash
npx prisma migrate dev
```

8. Seed initial data:

```bash
npm run db:seed
```

9. Start the API:

```bash
npm run dev
```

## API Health Checks

```text
GET /api/health
GET /api/health/db
```

Default development API address:

```text
http://localhost:8000
```

## Documentation

- Database design: `docs/database/`
- Requirements analysis: `docs/requirements/`
- System architecture: `docs/architecture/`
- Technical proposal: `docs/proposal/`

## Development

The project follows a modular backend architecture. Business logic will be separated into routes, controllers, services, middleware, and database access.

## Project Status

Day 7: Initial backend infrastructure and database foundation completed. Business module implementation continues in the following development phase.