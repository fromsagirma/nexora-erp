# Nexora ERP Backend

## Overview

This directory will contain the Node.js and Express REST API for Nexora ERP.

The backend is responsible for authentication, authorization, business rules, validation, transactional inventory operations, and communication with PostgreSQL.

## Proposed Technology Stack

- Node.js
- Express.js
- JavaScript ES6+
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Swagger / OpenAPI

## Proposed Backend Modules

| Module     | Responsibility                            |
| ---------- | ----------------------------------------- |
| auth       | Authentication and token handling         |
| users      | User management                           |
| roles      | Role-based permissions                    |
| products   | Product management                        |
| categories | Category management                       |
| warehouses | Warehouse management                      |
| inventory  | Stock levels, movements and adjustments   |
| sales      | Sales orders, reservations and fulfilment |
| purchasing | Purchase orders and receipts              |
| dashboard  | Dashboard data and reporting              |
| audit      | Audit event creation and read-only access |

## Proposed Request Flow

Route → Middleware → Validation → Controller → Service → Prisma → PostgreSQL.

## Important Business Rules

### Inventory

- Available quantity = on-hand quantity − reserved quantity.
- Stock quantities must never become negative.
- Every stock-changing operation must produce a movement.

### Sales

- Draft orders do not reserve stock.
- Confirmation reserves available stock.
- Fulfilment consumes reservations and reduces on-hand stock.
- Cancellation releases active reservations.

### Purchasing

- Purchase orders may be received in multiple deliveries.
- Received quantities cannot exceed outstanding quantities.
- Receipt and stock updates must be atomic.

### Concurrency

Stock-changing operations use transactions, row locks, conditional updates, and idempotency protection.

### Audit

Sensitive operations must create audit records. Audit records are append-only and cannot be edited or deleted through the application.

## Proposed Commands

Once the backend application is initialized:

```bash
npm install
npm run dev
npm run test
npm run test:integration
```

Exact scripts will be defined in `package.json`.

## Project Status

Backend implementation has not started. Development is subject to formal Project Manager approval.
