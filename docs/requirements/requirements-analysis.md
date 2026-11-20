# Requirements Analysis

## 1. Purpose

This document analyzes the business problem, stakeholders, system scope, assumptions, constraints, and operational workflows for Nexora ERP – Inventory, Sales and Purchasing Management MVP.

This analysis is based on Technical Proposal Version 3.

## 2. Business Problem

Small and medium-sized businesses may manage inventory, sales, and supplier purchasing through disconnected spreadsheets or tools.

This creates challenges such as:

- Duplicated product and customer information.
- Inaccurate or outdated stock quantities.
- Weak traceability of inventory changes.
- Difficulty tracking outstanding purchase quantities.
- Difficulty preventing sales beyond available stock.
- Limited operational visibility for managers.

## 3. Proposed Solution

Nexora ERP proposes a centralized web application connecting product, warehouse, inventory, sales, and purchasing records.

The backend will enforce business rules and database integrity. The frontend will provide role-aware screens for users.

## 4. Stakeholders and Actors

| Actor           | Responsibility                                         |
| --------------- | ------------------------------------------------------ |
| Admin           | User administration and approved operational functions |
| Manager         | Operational oversight, reports, and approved actions   |
| Sales           | Customers and sales order workflows                    |
| Warehouse       | Receiving and approved stock operations                |
| Project Manager | Reviews and approves the proposed system design        |

## 5. Functional Areas

1. Authentication and user management.
2. Product and category management.
3. Warehouse management.
4. Inventory and stock ledger.
5. Stock adjustments.
6. Customer management.
7. Sales order processing.
8. Supplier management.
9. Purchase order processing.
10. Partial goods receiving.
11. Audit history.
12. Dashboard and basic reports.

## 6. Main Business Workflows

### 6.1 Sales

Draft → Confirmed → Fulfilled.

- Draft orders do not reserve stock.
- Confirmation checks availability.
- Confirmation creates reservations.
- Fulfilment consumes reservations and reduces on-hand quantity.
- Cancellation from Draft or Confirmed is allowed.
- Cancellation of a confirmed order releases its active reservations.
- Fulfilled orders cannot be fulfilled or cancelled again.

### 6.2 Purchasing

Draft → Ordered → Partially Received → Fully Received.

- One purchase order can have multiple receipts.
- Every receipt item references a purchase order item.
- Total received quantity cannot exceed ordered quantity.
- Receipt, stock update, stock movement, and order status changes are atomic.
- Cancelled orders cannot receive additional goods.

### 6.3 Inventory

For each product and warehouse:

Available quantity = On-hand quantity − Reserved quantity.

Every stock-changing operation produces a stock movement.

Stock movements are append-only. Corrections are recorded through compensating movements.

## 7. Scope

### Included in the proposed MVP

- Authentication and users.
- Inventory and stock ledger.
- Sales with reservation and fulfilment.
- Purchasing with partial receiving.
- Minimum audit trail.
- Dashboard and basic reports.

### Excluded

- HR and payroll.
- Full accounting.
- Payment processing.
- Multi-company support.
- Advanced procurement.
- Rejected or damaged goods processing.
- Closing partially received orders short.

## 8. Assumptions and Proposed Decisions

| Item               | Proposed assumption / decision       | Status                                  |
| ------------------ | ------------------------------------ | --------------------------------------- |
| Database           | PostgreSQL                           | Awaiting approval                       |
| ORM                | Prisma                               | Awaiting approval                       |
| Architecture       | Modular Monolith                     | Awaiting approval                       |
| Stock reservation  | At sales order confirmation          | Awaiting approval                       |
| Purchase receiving | Partial receiving supported          | Awaiting approval                       |
| Sales order line   | One warehouse per line in MVP        | Awaiting approval                       |
| Quantities         | Whole units represented as INTEGER   | Awaiting approval                       |
| Money              | NUMERIC(12,2)                        | Currency and rounding need confirmation |
| Audit              | Minimum audit trail in committed MVP | Awaiting approval                       |
| Deployment         | Hosted or Docker-based demo          | To be confirmed                         |

## 9. Constraints

- Individual developer responsibility.
- Official 21-day delivery schedule.
- Management approval required before implementation.
- Proposed JavaScript-first stack.
- MVP scope must remain limited.
- Sensitive operations must be auditable.
- Stock changes must preserve data integrity.

## 10. Dependencies

- Project Manager approval of proposal and design.
- Confirmation of business currency and rounding policy.
- Confirmation of role permissions.
- Confirmation of deployment target.
- Access to GitHub repository for management review.

## 11. Risks

| Risk                                | Impact               | Proposed mitigation                                       |
| ----------------------------------- | -------------------- | --------------------------------------------------------- |
| Concurrent stock operations         | Incorrect stock      | Transactions, row locks and conditional updates           |
| Duplicate receiving requests        | Stock counted twice  | Idempotency keys and state validation                     |
| Incorrect role permissions          | Unauthorized actions | API-level RBAC and tests                                  |
| Inconsistent database relationships | Orphan records       | Foreign keys and constraints                              |
| Timeline pressure                   | Incomplete MVP       | Scope freeze and milestone acceptance                     |
| Secret exposure                     | Security incident    | `.gitignore`, environment variables and repository checks |

## 12. Approval

This analysis is part of the proposed technical design package. It does not represent formal management approval.
