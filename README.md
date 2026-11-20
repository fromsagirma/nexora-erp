# Nexora ERP

## Inventory, Sales and Purchasing Management MVP

A proposed full-stack Enterprise Resource Planning (ERP) application developed as an individual project for the Nexora Technologies Internship Program.

Nexora ERP aims to centralize inventory, sales, purchasing, and operational records in one web-based system.

---

## Project Overview

Small and medium-sized businesses may manage products, stock counts, customer orders, and supplier purchases using disconnected spreadsheets or separate tools. This can lead to duplicated records, delayed updates, weak traceability, and unreliable reporting.

Nexora ERP proposes a centralized application connecting:

- Product and category management
- Warehouse and inventory management
- Stock movements and adjustments
- Customer and sales order management
- Supplier and purchase order management
- Partial goods receiving
- Stock reservation and fulfilment
- Role-based access control
- Audit history
- Dashboard and basic reporting

The proposed architecture is a **Modular Monolith** with a React frontend, Node.js/Express backend, and PostgreSQL database accessed through Prisma ORM.

## Project Objectives

1. Centralize product, category, warehouse, customer, supplier, sales-order, and purchase-order information.
2. Maintain accurate stock quantities and a traceable record of stock movements.
3. Apply role-based access so users can perform only permitted operations.
4. Provide managers with operational indicators such as sales totals, pending orders, and low-stock products.
5. Deliver a documented and tested MVP within the internship program's 21-day schedule.

## MVP Scope

### Included

- Authentication and user management
- Product and category management
- Warehouse and inventory management
- Stock ledger and stock adjustments
- Customer and sales order management
- Stock reservation and fulfilment
- Supplier and purchase order management
- Partial and complete purchase receiving
- Minimum audit trail for sensitive operations
- Dashboard and basic reports
- CSV exports

### Excluded from the 21-day MVP

- Human resources
- Payroll
- Full accounting and finance
- Payment processing
- Multi-company support
- Advanced procurement
- Rejected or damaged goods workflows
- Closing partially received purchase orders short

These scope boundaries are proposed and subject to Project Manager approval.

## Proposed Technology Stack

### Frontend

- React
- Vite
- JavaScript (ES6+)
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
- JavaScript (ES6+)
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- Zod validation
- REST API
- Swagger / OpenAPI

### Database

- PostgreSQL
- Prisma Migrate
- Prisma Studio or pgAdmin

### Development and Testing Tools

- Git and GitHub
- Visual Studio Code
- npm
- Postman
- Jest
- Supertest
- Vitest
- React Testing Library
- ESLint
- Prettier
- Mermaid / Draw.io
- Docker Compose where feasible

## Proposed Architecture

The system follows a three-tier architecture:

1. Presentation layer: React frontend.
2. Application layer: Node.js and Express REST API.
3. Data layer: PostgreSQL accessed through Prisma ORM.

The frontend communicates with the backend through REST APIs. The backend enforces authentication, authorization, validation, and business rules. The frontend never connects directly to PostgreSQL.

## Main Business Workflows

### Sales

Draft → Confirmed → Fulfilled

- Draft orders do not reserve stock.
- Confirmation checks available stock and creates reservations.
- Fulfilment consumes reservations and reduces on-hand stock atomically.
- Cancellation from Draft or Confirmed releases active reservations.
- Fulfilled orders cannot be cancelled or fulfilled again.

### Purchasing

Draft → Ordered → Partially Received → Fully Received

- A purchase order may have multiple receipts.
- Each receipt records quantities received against purchase order items.
- Total received quantity cannot exceed ordered quantity.
- Receipt records, stock balances, movements, and order status update in one transaction.
- Cancelled purchase orders cannot receive further goods.

## Inventory Principles

- On-hand quantity: physical stock recorded at a warehouse.
- Reserved quantity: stock committed to confirmed sales orders.
- Available quantity: on-hand quantity minus reserved quantity.
- Every stock-changing operation creates a stock movement.
- Stock movements are append-only.
- Stock-changing operations use database transactions and concurrency-safe updates.
- Repeated requests must not apply stock changes twice.

## User Roles

| Role      | Main responsibility                                    |
| --------- | ------------------------------------------------------ |
| Admin     | User administration and approved operational functions |
| Manager   | Operational oversight, reports, and approved actions   |
| Sales     | Customer and sales order workflows                     |
| Warehouse | Receiving and approved stock operations                |

The proposed permission matrix is documented in the technical proposal and remains subject to approval.

## Repository Structure

```text
nexora-erp/
├── README.md
├── .gitignore
├── .editorconfig
|├── docs/
│   ├── proposal/
│   ├── requirements/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── testing/
│   └── decisions/
├── frontend/
├── backend/
├── database/
└── .github/
```

See the `docs/` directory for the proposal and technical design documents.

## Project Documentation

| Document                | Location                                       |
| ----------------------- | ---------------------------------------------- |
| Technical proposal      | `docs/proposal/technical-proposal.md`          |
| Requirements analysis   | `docs/requirements/requirements-analysis.md`   |
| Functional requirements | `docs/requirements/functional-requirements.md` |
| System architecture     | `docs/architecture/system-architecture.md`     |
| Architecture diagram    | `docs/architecture/architecture-diagram.mmd`   |
| Database ERD            | `docs/database/erd.md`                         |
| ERD diagram             | `docs/database/erd-diagram.mmd`                |
| API specification       | `docs/api/openapi.yaml`                        |
| Testing plan            | `docs/testing/testing-plan.md`                 |
| Technology decision     | `docs/decisions/ADR-001-technology-stack.md`   |

## Project Timeline

The proposed delivery period follows the official 21-day Nexora internship schedule:

| Days  | Workstream                          |
| ----- | ----------------------------------- |
| 1–2   | Requirements and proposal           |
| 3–4   | System and database design          |
| 5–7   | Development foundation              |
| 8–9   | Inventory and purchasing            |
| 10    | Sales                               |
| 11    | Dashboard and feature completion    |
| 12–13 | Integration and testing             |
| 14    | Documentation and final preparation |
| 15–21 | Presentation and evaluation         |

Days 5–7 are the foundation portion of the continuous Days 5–11 development phase.

## Project Status

**Version 3 — Submitted for review and approval.**

This repository currently represents the project proposal and technical design. Application implementation is subject to formal approval by the Nexora Project Manager.

No completed implementation, test results, deployment, or management approval is claimed by this documentation.

## Individual Repository

Repository: https://github.com/fromsagirma/nexora-erp

Owner: fromsagirma

Default branch: main

Management access: To be verified before resubmission.

## Developer

Prepared by Firomsa Girma Worku '/n'
Position Full Stack Developer Intern Applicant '/n'
Application ID : NXT-2026-01156

## License

No open-source license has been selected. Reuse and distribution permissions must be confirmed before adding a license.
