# ADR-001: Proposed Technology Stack

- **Status:** Proposed — awaiting Project Manager approval
- **Date:** 20 November 2026
- **Project:** Nexora ERP

## 1. Context

Nexora ERP is an individual full-stack internship project with a 21-day delivery period.

The application must support related inventory, sales, purchasing, and user-management records. Stock-changing operations require transactional consistency and traceability.

## 2. Decision

The proposed technology stack is:

### Frontend

- React
- Vite
- JavaScript ES6+
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Recharts

### Backend

- Node.js
- Express.js
- JavaScript ES6+
- Prisma ORM
- JWT
- bcrypt
- Zod
- REST API

### Database

- PostgreSQL

### Testing and Tools

- Jest
- Supertest
- Vitest
- React Testing Library
- Postman
- Swagger / OpenAPI
- Git and GitHub
- ESLint
- Prettier
- Docker Compose where feasible

## 3. Architecture Decision

Use a Modular Monolith.

The frontend and backend are separate applications. The backend contains modules for authentication, users, inventory, sales, purchasing, dashboard, and audit.

## 4. Reasons

- JavaScript ES6+ provides language consistency across frontend and backend.
- React supports reusable interface components.
- Express provides a straightforward REST API.
- PostgreSQL supports relational integrity and transactions.
- Prisma provides schema management and migrations.
- A Modular Monolith is manageable for one developer and a fixed 21-day schedule.

## 5. Alternatives Considered

### MongoDB

MongoDB supports flexible document data. PostgreSQL is preferred for this MVP because the main workflows involve related records, foreign keys, and multi-record transactions.

### Microservices

Microservices may be useful at larger scale but introduce deployment and distributed-transaction complexity that is unnecessary for the proposed MVP.

## 6. Consequences

Positive:

- One main backend application.
- Clear module boundaries.
- Relational integrity.
- Transactional stock operations.
- Consistent full-stack language.

Trade-offs:

- The backend must maintain clear module boundaries.
- PostgreSQL transaction behavior must be understood and tested.
- Deployment and environment configuration must be documented.

## 7. Approval

This ADR records a proposed technical decision. It becomes an approved project decision only after formal Project Manager approval.
