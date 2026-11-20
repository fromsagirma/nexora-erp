# Nexora ERP – Technical Proposal and System Design Document

**Project:** Nexora ERP – Inventory, Sales and Purchasing Management MVP  
**Version:** 3  
**Date:** 20 November 2026  
**Prepared by:** Individual Full Stack Developer Intern Applicant  
**Submitted to:** Project Manager, Nexora Technologies  
**Application ID:** NXT-2026-01156  
**Status:** Submitted for review and approval

> This document describes a proposed system. Scope, technology, and design decisions remain subject to formal approval by Nexora Technologies management. Implementation must not begin before approval.

---

## 1. Assigned Project Name

Nexora ERP – Inventory, Sales and Purchasing Management MVP.

A secure web-based ERP application connecting products, warehouses, stock, customers, suppliers, and orders through shared relational data and role-based permissions.

## 2. Project Overview and Objectives

### Overview

Small and medium-sized businesses may manage products, stock counts, customer orders, and supplier purchases using disconnected spreadsheets or tools. This can result in duplicated records, delayed updates, weak traceability, and unreliable reporting.

Nexora ERP proposes one centralized system for these operational workflows.

The proposed solution is a Modular Monolith with:

- React frontend.
- Node.js and Express backend.
- PostgreSQL database accessed through Prisma ORM.

The guiding engineering principle is data integrity. Sales fulfilment and purchase receiving must update order status, stock quantities, and stock movement history atomically. Business rules are enforced by the backend.

### Objectives

1. Centralize product, category, warehouse, customer, supplier, sales order, and purchase order information.
2. Maintain accurate stock quantities and traceable stock movements.
3. Enforce role-based access control.
4. Provide operational indicators for managers.
5. Deliver a documented and tested MVP within the 21-day program.

### Scope

Included:

- Authentication and user management.
- Inventory and stock ledger.
- Purchasing with partial goods receiving.
- Sales with stock reservation and fulfilment.
- Minimum audit trail for sensitive operations.
- Dashboard and basic reports.

Excluded:

- HR and payroll.
- Full accounting.
- Payment processing.
- Multi-company support.
- Advanced procurement.
- Rejected or damaged goods workflows.
- Closing partially received orders short.

### Proposed Roles

| Role      | Responsibility                                         |
| --------- | ------------------------------------------------------ |
| Admin     | User administration and approved operational functions |
| Manager   | Operational oversight, reports, and approved actions   |
| Sales     | Customer and sales order management                    |
| Warehouse | Receiving and approved stock operations                |

## 3. Proposed Frontend Technology

| Area         | Technology               | Purpose                                            |
| ------------ | ------------------------ | -------------------------------------------------- |
| Framework    | React + Vite             | Component-based interface and development feedback |
| Language     | JavaScript ES6+          | Shared language across the stack                   |
| Styling      | Tailwind CSS + shadcn/ui | Responsive interface and reusable components       |
| Routing      | React Router             | Module and protected routes                        |
| Server state | TanStack Query           | API fetching, caching, loading and error states    |
| Global state | Zustand                  | Authentication session and UI preferences          |
| Forms        | React Hook Form          | Form management                                    |
| Validation   | Zod                      | Reusable client-side validation                    |
| Charts       | Recharts                 | Dashboard visualizations                           |

Frontend principles:

- Organize screens by business module.
- Reuse tables, filters, forms, dialogs, and status components.
- Treat frontend route guards as a usability feature only.
- Enforce permissions independently on the backend.
- Use API responses as the source of truth.
- Provide clear validation, loading, empty, and error states.

## 4. Proposed Backend Technology

| Area              | Technology                         | Purpose                                   |
| ----------------- | ---------------------------------- | ----------------------------------------- |
| Runtime/framework | Node.js + Express                  | REST API                                  |
| Language          | JavaScript ES6+                    | Full-stack language consistency           |
| Architecture      | Modular Monolith                   | One deployable API with separated modules |
| ORM               | Prisma                             | Schema, migrations, database access       |
| Authentication    | JWT + bcrypt                       | Authentication and password hashing       |
| Authorization     | RBAC middleware and service checks | Role-based protection                     |
| Validation        | Zod                                | Server-side validation                    |
| API               | REST + JSON                        | Frontend/backend communication            |
| Documentation     | Swagger / OpenAPI                  | API contract                              |

### Backend request flow

Route → Authentication and authorization middleware → Zod validation → Controller → Service → Prisma/database → JSON response.

Controllers remain thin. Business rules belong in services.

## 5. Database Selection and Justification

**Selected database:** PostgreSQL, accessed through Prisma ORM.

PostgreSQL is proposed because the system contains related entities and transactional workflows.

Reasons:

- Foreign-key referential integrity.
- ACID transactions.
- Unique and check constraints.
- Relational reporting and aggregation.
- NUMERIC/DECIMAL support for monetary values.

### Inventory quantities

| Quantity           | Meaning                                   |
| ------------------ | ----------------------------------------- |
| on_hand_quantity   | Physical stock recorded at a warehouse    |
| reserved_quantity  | Stock committed to confirmed sales orders |
| available_quantity | On-hand quantity minus reserved quantity  |
| reorder_level      | Threshold used for low-stock warnings     |

Available quantity is calculated, not stored.

### Stock movement references

Every stock movement has exactly one source:

- `purchase_receipt_item_id`
- `sales_order_item_id`
- `stock_adjustment_id`

A database CHECK constraint requires exactly one source key. Each key is a real foreign key.

### Ledger rules

- Every stock movement records movement type, on-hand delta, reserved delta, actor, and timestamp.
- Movement idempotency keys are unique.
- Stock movements are append-only.
- Corrections use compensating movements.
- Historical records are not silently deleted.
- Foreign keys use restrictive delete behavior.

### Data conventions

- Primary keys: UUID or BIGINT identity.
- MVP quantities: INTEGER whole units.
- Money: NUMERIC(12,2).
- Timestamps: TIMESTAMPTZ in UTC.
- Statuses: PostgreSQL enums.
- Audit before/after data: JSONB.

Currency and rounding policy require Project Manager confirmation.

## 6. System Architecture

The proposed application uses a three-tier architecture:

1. Presentation layer: React frontend.
2. Application layer: Express REST API.
3. Data layer: PostgreSQL accessed through Prisma.

The browser never connects directly to PostgreSQL.

### Request flow

1. User interacts with React.
2. Browser sends an HTTPS request with an authentication token.
3. Express verifies identity and permission.
4. Zod validates the input.
5. The service applies business rules and transactions.
6. API returns a consistent JSON response or error.

### Architecture decision

A Modular Monolith is preferred over microservices for the individual 21-day MVP because it reduces deployment complexity and simplifies transactions spanning inventory, sales, and purchasing.

## 7. Initial Database ERD

The proposed V3 model contains 18 entities:

1. roles
2. users
3. categories
4. products
5. warehouses
6. stock_levels
7. stock_movements
8. stock_adjustments
9. customers
10. sales_orders
11. sales_order_items
12. stock_reservations
13. suppliers
14. purchase_orders
15. purchase_order_items
16. purchase_receipts
17. purchase_receipt_items
18. audit_logs

### Important relationships

- One role has many users.
- One category has many products.
- One product has stock levels in multiple warehouses.
- One stock level has many stock movements.
- One customer has many sales orders.
- One sales order has many sales order items.
- One supplier has many purchase orders.
- One purchase order has many purchase order items and many purchase receipts.
- One receipt has many receipt items.
- One receipt item references one purchase order item.
- One sales order item has at most one stock reservation in this MVP.
- One stock level can have many reservations.
- Each stock movement has exactly one source record.

The MVP assumes each sales order line reserves from one warehouse. This is a proposed scope decision requiring approval.

## 8. Main Modules and Planned Features

### Authentication and Users

- Login and logout.
- Password hashing.
- User management.
- Role assignment.
- Activation and deactivation.

### Inventory

- Products and categories.
- Warehouses.
- Stock levels.
- Stock ledger.
- Adjustments.
- Low-stock view.
- Search and filtering.

### Sales

- Customers.
- Sales orders and line items.
- Confirmation with stock reservation.
- Fulfilment.
- Cancellation and reservation release.

### Purchasing

- Suppliers.
- Purchase orders and line items.
- Multiple goods receipts.
- Partial and complete receiving.
- Ordered, received, and outstanding quantities.

### Dashboard and Reports

- Sales totals.
- Pending orders.
- Low-stock products.
- Recent activity.
- Basic sales chart.
- CSV exports.

### Audit Trail

- Read-only audit log.
- Actor, event, entity, timestamp, outcome, and approved before/after values.
- Restricted access.

### Purchasing workflow

Draft → Ordered → Partially Received → Fully Received.

A purchase order may be received in multiple deliveries. The total received quantity may not exceed the ordered quantity. Cancelled orders cannot accept receipts.

### Sales workflow

Draft → Confirmed → Fulfilled.

Draft orders reserve nothing. Confirmation reserves available stock. Fulfilment consumes the reservation and reduces on-hand stock atomically. Cancellation of a confirmed order releases active reservations.

## 9. Development Tools, Security, and Testing

### Tools

- Git and GitHub.
- Visual Studio Code.
- npm.
- Postman and Swagger UI.
- Jest and Supertest.
- Vitest and React Testing Library.
- ESLint and Prettier.
- Prisma Migrate and Prisma Studio.
- Mermaid or Draw.io.
- Docker Compose where feasible.

### Security baseline

- bcrypt password hashing.
- Short-lived access tokens and a defined refresh/revocation approach.
- HTTPS in deployed environments.
- Helmet and restrictive CORS.
- Authentication rate limiting.
- Server-side validation.
- Secrets stored in environment variables.
- API and service-layer authorization.
- No tokens, passwords, hashes, or stack traces in responses or logs.

### Concurrency control

Stock-changing operations run in Prisma transactions.

The proposed strategy uses:

- Row-level locks (`SELECT ... FOR UPDATE`).
- Conditional atomic updates.
- Consistent stock-row lock ordering.
- Transaction rollback on failure.
- Idempotency keys.
- Database CHECK constraints.

### Audit trail

Audit records are written in the same transaction as sensitive business changes.

Events include login failures, user activation/deactivation, role changes, product and warehouse changes, adjustments, receiving, sales confirmation, fulfilment, and cancellation.

Audit records are append-only and contain no passwords, tokens, or secrets.

## 10. Development Timeline

| Days  | Workstream                       | Deliverable                                                       |
| ----- | -------------------------------- | ----------------------------------------------------------------- |
| 1–2   | Requirements and proposal        | Revised proposal and repository                                   |
| 3–4   | System and database design       | ERD, architecture, API outline, permission matrix, screen designs |
| 5–7   | Development foundation           | Application skeleton, migrations and login                        |
| 8–9   | Inventory and purchasing         | Inventory, purchase orders and partial receipts                   |
| 10    | Sales                            | Reservation, fulfilment and cancellation                          |
| 11    | Dashboard and feature completion | Integrated MVP feature set                                        |
| 12–13 | Integration and testing          | Test report and fixes                                             |
| 14    | Documentation                    | README, setup guide and API documentation                         |
| 15–21 | Presentation and evaluation      | Stable demo, progress report and presentation                     |

Days 5–7 are the foundation tasks within the continuous Days 5–11 development period.

A milestone is accepted only when its deliverable is demonstrable, committed to GitHub, and supported by evidence.

## 11. Functional and Non-Functional Requirements

The functional requirements are FR-1 through FR-20 and are maintained in:

`docs/requirements/functional-requirements.md`

Non-functional requirements include:

- Data integrity.
- Security and authorization.
- Concurrency safety.
- Traceability.
- Audit data protection.
- Consistent API errors.
- Data retention.
- Backup and recovery.
- Performance.
- Usability.
- Maintainability.
- Documentation.
- Portability.

## 12. User Roles and Permissions

The API enforces permissions through RBAC middleware and service-level checks.

The proposed roles are Admin, Manager, Sales, and Warehouse.

The complete proposed permission matrix is maintained in the V3 proposal and must be confirmed by the Project Manager.

## 13. UI/UX Wireframes and Interface Design

The application uses a responsive single-page interface with:

- Persistent sidebar.
- Top bar showing user and role.
- Dashboard KPI cards.
- Module-specific screens.
- Reusable tables, forms, dialogs and status labels.
- Clear validation and confirmation for consequential actions.

The primary wireframes cover the dashboard and sales order screens.

The screen inventory includes login, dashboard, products, stock, customers, sales orders, suppliers, purchase orders, audit logs, and users.

## 14. Development Methodology

An iterative and incremental approach is proposed.

- Design and approval first.
- Build modules as vertical slices.
- Implement backend rules and tests before connecting screens.
- Integrate frontend and backend incrementally.
- Track tasks using GitHub Projects.
- Use a Definition of Done for every feature.
- Report progress and blockers promptly.

## 15. GitHub Repository and Version Control Plan

Repository name: `nexora-erp`

Repository URL: https://github.com/fromsagirma/nexora-erp

Owner: `fromsagirma`

Default branch: `main`

Visibility: To be confirmed.

Management access: Must be verified before resubmission.

The repository is organized as a monorepo containing:

- `frontend/`
- `backend/`
- `database/`
- `docs/`
- `.github/`

All secrets and environment files are excluded from version control. Only `.env.example` is committed.

Branches and commits follow the documented Git workflow. The README links to the proposal and design documentation.

### Repository verification

- Repository URL opens.
- Repository belongs to the individual developer.
- Project Manager can access it.
- README is visible.
- Proposal and design files are committed.
- No secrets are exposed.

---

## Source Basis and Approval Status

The official Nexora internship requirements define the ten proposal topics, first-week milestones, 21-day schedule and final deliverables.

The engineering choices in this proposal—including modular monolith architecture, partial receiving, stock reservation, source-specific movement references, concurrency handling, idempotency and audit logging—are proposed design recommendations submitted for management approval.

### Open decisions

- Business currency and rounding policy.
- Exact role permissions and audit-log access.
- Manager approval requirements for stock adjustments.
- Confirmation of partial receiving and reservation scope.
- Confirmation of one warehouse per sales order line.
- Deployment target.
- Backup and recovery expectations.

**Approval status:** Submitted for review and approval. Implementation is not authorized until formal approval is received.
