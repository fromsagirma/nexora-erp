# System Architecture

**Project:** Nexora ERP  
**Architecture:** Three-Tier Architecture with Modular Monolith Backend  
**Status:** Proposed — awaiting management approval

## 1. Architecture Overview

Nexora ERP is designed as a web-based application with three main layers:

1. Presentation Layer — React frontend.
2. Application Layer — Node.js and Express REST API.
3. Data Layer — PostgreSQL database accessed through Prisma ORM.

The React frontend communicates with the Express API over HTTP/HTTPS using JSON. The frontend does not access the database directly.

## 2. Presentation Layer

**Technology:** React + Vite + JavaScript ES6+

Responsibilities:

- Render the user interface.
- Provide module navigation.
- Display dashboard and reports.
- Collect and validate user input.
- Manage loading, success, empty and error states.
- Communicate with backend APIs.
- Display actions according to user permissions.

Proposed libraries:

- React Router for routing.
- TanStack Query for server state.
- Zustand for lightweight global state.
- React Hook Form for forms.
- Zod for validation.
- Tailwind CSS and shadcn/ui for UI.
- Recharts for dashboard charts.

Frontend route guards are not security boundaries. The backend must independently enforce authorization.

## 3. Application Layer

**Technology:** Node.js + Express + JavaScript ES6+

The backend follows a Modular Monolith architecture.

Proposed modules:

- Authentication
- Users and roles
- Products and categories
- Warehouses
- Inventory
- Sales
- Purchasing
- Dashboard and reports
- Audit

Each module contains routes, controllers, services, validation schemas, and data-access logic where appropriate.

### Request processing

1. Express receives the request.
2. Authentication middleware verifies the JWT.
3. Authorization middleware checks the user's role and permission.
4. Zod validates request parameters and body.
5. Controller passes the request to a service.
6. Service applies business rules.
7. Prisma accesses PostgreSQL.
8. The API returns a standardized JSON response.

Controllers should remain thin. Business rules and transaction logic belong in services.

## 4. Data Layer

**Database:** PostgreSQL  
**ORM:** Prisma

The database stores:

- Users and roles.
- Products and categories.
- Warehouses and stock levels.
- Stock movements and adjustments.
- Customers and sales orders.
- Suppliers and purchase orders.
- Purchase receipts.
- Stock reservations.
- Audit records.

Database constraints and transactions protect important business invariants.

## 5. Main Data Integrity Rules

- Product SKU is unique.
- User email is unique.
- One stock-level row exists per product and warehouse pair.
- On-hand quantity cannot be negative.
- Reserved quantity cannot be negative.
- Reserved quantity cannot exceed on-hand quantity.
- Every stock movement references exactly one valid source.
- Stock-changing operations execute transactionally.
- Historical records are not hard-deleted.

## 6. Authentication and Security

- Passwords are stored as bcrypt hashes.
- JWTs identify authenticated users.
- RBAC middleware protects API operations.
- Zod validates untrusted input.
- Secrets are loaded through environment variables.
- HTTPS is required in deployed environments.
- Helmet, restrictive CORS, and authentication rate limiting are proposed.
- Sensitive operations generate audit records.

## 7. Transactional Workflows

### Sales confirmation

Check stock → Lock affected stock rows → Verify available quantities → Create reservations → Increase reserved quantities → Write RESERVE movements → Change order status → Write audit record → Commit.

### Sales fulfilment

Lock affected stock rows → Verify active reservations → Reduce on-hand quantities → Reduce reserved quantities → Mark reservations consumed → Write FULFILMENT movements → Change order status → Write audit record → Commit.

### Purchase receiving

Validate purchase order state → Lock relevant purchase order items and stock rows → Check outstanding quantities → Create receipt and receipt items → Increase on-hand quantities → Write RECEIPT movements → Update purchase order status → Write audit record → Commit.

If a step fails, the transaction rolls back.

## 8. Concurrency and Idempotency

The proposed stock concurrency strategy uses:

- PostgreSQL row-level locks.
- Conditional atomic updates.
- Consistent row-lock ordering.
- Prisma transactions.
- Unique idempotency keys.
- Database check constraints.

A repeated operation must not apply the same stock change twice.

## 9. Error Handling

Proposed API status codes:

| Status | Meaning                           |
| ------ | --------------------------------- |
| 400    | Malformed request                 |
| 401    | Missing or invalid authentication |
| 403    | Insufficient permission           |
| 404    | Resource not found                |
| 409    | State or stock conflict           |
| 422    | Business validation failure       |
| 500    | Unexpected server error           |

Error responses must not expose stack traces or sensitive information.

## 10. Architecture Decision

A Modular Monolith is proposed rather than microservices because it is more practical for one developer and a 21-day MVP. It keeps transactional operations inside one application and simplifies local development, testing, and deployment.

## 11. Approval Status

This architecture is proposed for Project Manager review. It is not an implemented architecture until approved and built.
