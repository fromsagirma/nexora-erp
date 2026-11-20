# Database Design and Entity Relationships

**Database:** PostgreSQL  
**ORM:** Prisma  
**Model:** 18 proposed entities  
**Status:** Proposed — awaiting management approval

## 1. Overview

The Nexora ERP database is designed to maintain relational consistency across inventory, sales, purchasing, users, and audit records.

The V3 proposal extends the original 13-entity model to 18 entities.

## 2. Entity List

|   # | Entity                 | Purpose                                 |
| --: | ---------------------- | --------------------------------------- |
|   1 | roles                  | User roles                              |
|   2 | users                  | System users                            |
|   3 | categories             | Product categories                      |
|   4 | products               | Product catalogue                       |
|   5 | warehouses             | Storage locations                       |
|   6 | stock_levels           | Stock balance per product and warehouse |
|   7 | stock_movements        | Append-only inventory ledger            |
|   8 | stock_adjustments      | Manual stock correction records         |
|   9 | customers              | Sales customers                         |
|  10 | sales_orders           | Customer orders                         |
|  11 | sales_order_items      | Sales order lines                       |
|  12 | stock_reservations     | Reserved stock for sales lines          |
|  13 | suppliers              | Vendors                                 |
|  14 | purchase_orders        | Supplier orders                         |
|  15 | purchase_order_items   | Purchase order lines                    |
|  16 | purchase_receipts      | Goods receipt headers                   |
|  17 | purchase_receipt_items | Received quantities by order line       |
|  18 | audit_logs             | Sensitive operation history             |

## 3. Important Fields

### roles

- id — primary key
- name — unique role name

### users

- id — primary key
- role_id — foreign key to roles
- name
- email — unique
- password_hash
- is_active
- created_at

### categories

- id — primary key
- name — unique

### products

- id — primary key
- category_id — foreign key to categories
- sku — unique
- name
- unit_price
- cost_price
- reorder_level
- is_active

### warehouses

- id — primary key
- name — unique
- location
- is_active

### stock_levels

- id — primary key
- product_id — foreign key to products
- warehouse_id — foreign key to warehouses
- on_hand_quantity
- reserved_quantity

Unique constraint: product_id + warehouse_id.

### stock_movements

- id — primary key
- stock_level_id — foreign key to stock_levels
- created_by — foreign key to users
- purchase_receipt_item_id — optional foreign key
- sales_order_item_id — optional foreign key
- stock_adjustment_id — optional foreign key
- movement_type
- on_hand_delta
- reserved_delta
- idempotency_key — unique
- created_at

Exactly one source foreign key must be populated.

### stock_adjustments

- id — primary key
- stock_level_id — foreign key to stock_levels
- created_by — foreign key to users
- approved_by — optional foreign key to users
- quantity_delta
- reason
- status: PENDING, APPROVED, REJECTED

### customers

- id — primary key
- name
- email
- phone
- address
- is_active

### sales_orders

- id — primary key
- customer_id — foreign key to customers
- created_by — foreign key to users
- status
- order_date
- total

### sales_order_items

- id — primary key
- sales_order_id — foreign key to sales_orders
- product_id — foreign key to products
- quantity
- unit_price

Unique constraint: sales_order_id + product_id.

### stock_reservations

- id — primary key
- sales_order_item_id — foreign key to sales_order_items
- stock_level_id — foreign key to stock_levels
- quantity
- status: ACTIVE, CONSUMED, RELEASED

The V3 MVP allows at most one reservation per sales order item. Each order line reserves from one warehouse.

### suppliers

- id — primary key
- name
- email
- phone
- address
- is_active

### purchase_orders

- id — primary key
- supplier_id — foreign key to suppliers
- created_by — foreign key to users
- status
- order_date
- total

### purchase_order_items

- id — primary key
- purchase_order_id — foreign key to purchase_orders
- product_id — foreign key to products
- quantity_ordered
- unit_cost

Unique constraint: purchase_order_id + product_id.

### purchase_receipts

- id — primary key
- purchase_order_id — foreign key to purchase_orders
- received_by — foreign key to users
- receipt_date
- status

### purchase_receipt_items

- id — primary key
- purchase_receipt_id — foreign key to purchase_receipts
- purchase_order_item_id — foreign key to purchase_order_items
- quantity_received

### audit_logs

- id — primary key
- actor_id — foreign key to users; empty only for unknown-account login failures
- action
- entity_type
- entity_id
- before_data
- after_data
- outcome
- timestamp

## 4. Relationship Cardinalities

- roles 1:N users.
- categories 1:N products.
- products 1:N stock_levels.
- warehouses 1:N stock_levels.
- stock_levels 1:N stock_movements.
- users 1:N stock_movements.
- stock_levels 1:N stock_adjustments.
- customers 1:N sales_orders.
- sales_orders 1:N sales_order_items.
- products 1:N sales_order_items.
- sales_order_items 1:0..1 stock_reservations.
- stock_levels 1:N stock_reservations.
- suppliers 1:N purchase_orders.
- purchase_orders 1:N purchase_order_items.
- products 1:N purchase_order_items.
- purchase_orders 1:N purchase_receipts.
- purchase_receipts 1:N purchase_receipt_items.
- purchase_order_items 1:N purchase_receipt_items.
- users 1:N audit_logs.

Stock movements have exactly one source:

- purchase receipt item,
- sales order item, or
- stock adjustment.

## 5. Stock Invariants

- on_hand_quantity >= 0.
- reserved_quantity >= 0.
- reserved_quantity <= on_hand_quantity.
- available_quantity = on_hand_quantity - reserved_quantity.
- Quantity values are whole units in the proposed MVP.
- Money uses NUMERIC(12,2).
- Historical movements are append-only.

## 6. Purchase Receiving Rules

For every purchase order item:

received_quantity = SUM(receipt item quantities)

outstanding_quantity = quantity_ordered - received_quantity

Rules:

- Multiple receipts are allowed.
- Received quantity must be at least one.
- Total received must not exceed ordered quantity.
- A receipt must reference an item belonging to its purchase order.
- Cancelled purchase orders cannot receive goods.
- Receipt, stock balance, movement, and order status changes are atomic.

## 7. Sales Reservation Rules

available_quantity = on_hand_quantity - reserved_quantity

- Draft orders reserve nothing.
- Confirmation reserves stock.
- Fulfilment consumes reservations.
- Cancellation releases active reservations.
- Fulfilled or cancelled orders cannot be fulfilled again.

## 8. Delete Behaviour

All foreign keys use ON DELETE RESTRICT and ON UPDATE NO ACTION in the proposed model.

Historical orders, movements, and audit records are retained. Related users, products, suppliers, and customers are deactivated rather than deleted.

## 9. Indexes and Constraints

Proposed constraints:

- Unique user email.
- Unique product SKU.
- Unique role name.
- Unique category name.
- Unique warehouse name.
- Unique product/warehouse stock pair.
- Unique idempotency key.
- Non-negative stock constraints.
- Exactly one movement source.
- Positive order and receipt quantities.

Frequently filtered columns should be indexed.

## 10. Design Status

This is the proposed initial ERD. Final field types, indexes, constraints, migrations, and implementation details require review during the system-design phase.
