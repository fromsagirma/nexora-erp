# Functional Requirements

**Project:** Nexora ERP  
**Document Version:** 1.0  
**Basis:** Technical Proposal Version 3  
**Status:** Proposed requirements awaiting approval

## FR-1 — Authentication

Users shall sign in with email and password. Invalid credentials and inactive users shall be rejected.

**Verification:** Authentication tests.

## FR-2 — User Management

An Admin shall create users, assign one role to each user, and activate or deactivate accounts.

**Verification:** Authorization and audit tests.

## FR-3 — Product and Category Management

Authorized users shall create, edit, and deactivate products and categories. Product SKUs shall be unique.

**Verification:** Validation and uniqueness tests.

## FR-4 — Warehouse and Stock Visibility

The system shall manage warehouses and display on-hand, reserved, and available stock per product and warehouse.

**Verification:** Stock-level tests.

## FR-5 — Stock Adjustments

Authorized users shall request or record stock adjustments with a reason. Every approved stock change shall create a stock movement.

**Verification:** Authorization and audit tests.

## FR-6 — Low-Stock View

The system shall display products at or below their reorder level with search and filters.

**Verification:** Inventory tests.

## FR-7 — Customers and Sales Orders

The system shall manage customers and sales orders with line items. Order totals shall be calculated by the backend.

**Verification:** Validation tests.

## FR-8 — Sales Order Workflow

Sales orders shall move through Draft, Confirmed, and Fulfilled states. Cancellation shall be allowed from Draft or Confirmed. Invalid transitions shall be rejected.

**Verification:** State-transition and duplicate fulfilment tests.

## FR-9 — Suppliers and Purchase Orders

The system shall manage suppliers and purchase orders with line items.

**Verification:** Validation tests.

## FR-10 — Purchase Order Workflow

Purchase orders shall move through Draft, Ordered, Partially Received, and Fully Received states. Cancelled orders shall not accept receipts.

**Verification:** Partial receiving tests.

## FR-11 — Dashboard

The dashboard shall display sales totals, pending orders, low-stock items, recent activity, and a basic sales chart.

**Verification:** Dashboard tests.

## FR-12 — CSV Reports

The system shall export sales and stock data to CSV with date and status filters.

**Verification:** Report tests.

## FR-13 — Multiple Purchase Receipts

The system shall record multiple purchase receipts against one purchase order.

**Verification:** Partial receiving tests.

## FR-14 — Received and Outstanding Quantities

The system shall calculate received and outstanding quantities for each purchase order item.

**Verification:** Partial receiving tests.

## FR-15 — Over-Receiving Prevention

The system shall reject a receipt quantity that exceeds the outstanding quantity.

**Verification:** Over-receiving test.

## FR-16 — Stock Reservation

The system shall reserve available stock when an eligible sales order is confirmed.

**Verification:** Insufficient-stock and concurrent-reservation tests.

## FR-17 — Reservation Release

The system shall release active reservations when a confirmed sales order is cancelled.

**Verification:** Reservation-release test.

## FR-18 — Atomic Fulfilment

The system shall consume reserved stock and reduce on-hand quantity atomically during sales fulfilment.

**Verification:** Atomic rollback test.

## FR-19 — Duplicate Operation Prevention

The system shall prevent duplicate purchase receiving and sales fulfilment operations.

**Verification:** Duplicate receipt and fulfilment tests.

## FR-20 — Audit Logging

The system shall record audit events for sensitive inventory, sales, purchasing, and access-control operations.

**Verification:** Audit-event creation tests.

---

# Non-Functional Requirements

## NFR-1 — Data Integrity

Foreign keys, unique constraints, check constraints, and database transactions shall protect related records and stock quantities.

## NFR-2 — Security

Passwords shall be hashed using bcrypt. Authentication and authorization shall be enforced by the backend.

## NFR-3 — Concurrency

Concurrent stock-changing operations shall not over-reserve or over-consume available stock.

## NFR-4 — Traceability

Every stock change shall have a stock movement with one source, an actor, and a timestamp.

## NFR-5 — Audit Data Protection

Audit records shall be append-only, accessible only to authorized roles, and shall never contain passwords, tokens, or secrets.

## NFR-6 — API Error Consistency

Conflicts shall use HTTP 409. Invalid input shall use HTTP 400 or 422 as appropriate. Responses shall use a consistent error format and shall not expose stack traces.

## NFR-7 — Data Retention

Orders, stock movements, and audit records shall not be hard-deleted. Related records shall be cancelled or deactivated.

## NFR-8 — Backup and Recovery

The demonstration database shall be backed up before the demo, with a documented restore procedure tested once.

## NFR-9 — Performance

List endpoints shall support pagination and server-side filtering. Frequently filtered fields shall be indexed.

## NFR-10 — Usability

The interface shall provide responsive layouts, accessible labels, validation feedback, and loading, empty, and error states.

## NFR-11 — Maintainability

The application shall use modular code organization, thin controllers, consistent naming, ESLint, and Prettier.

## NFR-12 — Documentation

The repository shall contain the README, setup guide, OpenAPI documentation, ERD, architecture diagram, and testing report.

## NFR-13 — Portability

Docker Compose shall be used for repeatable local PostgreSQL and application setup where feasible.

---

## Requirement Status

All requirements are proposed. Verification results must be recorded only after the corresponding implementation and tests exist.
