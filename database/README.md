# Nexora ERP Database

## Overview

Nexora ERP proposes PostgreSQL as its relational database and Prisma ORM for schema management, migrations, and database access.

## Proposed Database Entities

The V3 design contains 18 entities:

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

## Database Integrity Rules

- Unique product SKU.
- Unique user email.
- One stock-level record per product and warehouse.
- Non-negative on-hand quantity.
- Non-negative reserved quantity.
- Reserved quantity cannot exceed on-hand quantity.
- Every stock movement must have exactly one source.
- Idempotency keys must be unique.
- Historical transactions must be retained.
- Stock-changing operations must be transactional.

## Inventory Formula

```text
available_quantity =
on_hand_quantity - reserved_quantity
```

Available quantity is calculated and is not stored as an independent database field.

## Purchase Receiving Formula

```text
received_quantity =
SUM(purchase_receipt_items.quantity_received)

outstanding_quantity =
quantity_ordered - received_quantity
```

The system must reject receiving beyond the outstanding quantity.

## Proposed Database Tooling

- PostgreSQL
- Prisma ORM
- Prisma Migrate
- Prisma Studio or pgAdmin

## Documentation

- Entity definitions: `docs/database/erd.md`
- Entity relationship diagram: `docs/database/erd-diagram.mmd`
- System architecture: `docs/architecture/system-architecture.md`

## Project Status

Database implementation and migrations have not started. The proposed schema requires review and formal approval.
