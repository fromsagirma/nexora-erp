# Nexora ERP Testing Plan

**Status:** Proposed test plan — no test execution results claimed.

## 1. Testing Objectives

The purpose of testing is to verify that Nexora ERP enforces business rules, protects data, controls user permissions, and maintains accurate stock records.

Testing will focus especially on sales fulfilment, purchase receiving, stock reservations, concurrency, idempotency, and audit logging.

## 2. Proposed Testing Tools

| Layer                         | Tool                         |
| ----------------------------- | ---------------------------- |
| Backend unit tests            | Jest                         |
| Backend API/integration tests | Supertest                    |
| Frontend tests                | Vitest                       |
| React component tests         | React Testing Library        |
| API exploration               | Postman                      |
| API documentation             | Swagger UI                   |
| Database verification         | PostgreSQL integration tests |

## 3. Test Categories

### 3.1 Authentication

- Correct credentials are accepted.
- Incorrect password is rejected.
- Inactive users cannot log in.
- Missing or invalid JWT is rejected.
- Failed login attempts are audited.
- Password hashes and tokens are never returned.

### 3.2 Authorization

- Sales cannot perform warehouse-only stock adjustments.
- Warehouse users cannot manage users and roles.
- Unauthorized users cannot access audit logs.
- Unauthorized requests return HTTP 403.
- Missing or invalid authentication returns HTTP 401.

### 3.3 Inventory

- Product SKU uniqueness is enforced.
- One stock level exists per product/warehouse pair.
- Stock adjustments require a reason.
- Negative stock is prevented.
- Every stock change produces one movement.
- Movement source references remain valid.

### 3.4 Purchase Receiving

Scenario:

A purchase order contains 100 units.

1. Receive 60 units.
2. Verify received quantity is 60.
3. Verify outstanding quantity is 40.
4. Verify on-hand stock increased by 60.
5. Receive the remaining 40.
6. Verify received quantity is 100.
7. Verify outstanding quantity is 0.
8. Verify order status becomes FULLY_RECEIVED.

Expected result:

- First receipt: PARTIALLY_RECEIVED.
- Second receipt: FULLY_RECEIVED.
- Stock increases by 100 in total.
- Two receipt records and corresponding stock movements exist.

### 3.5 Over-Receiving

Given 40 units outstanding, attempt to receive 50.

Expected:

- Request rejected with HTTP 422.
- No receipt is persisted.
- No stock increase occurs.
- No stock movement is created.

### 3.6 Sales Reservation

Scenario:

- On-hand quantity = 20.
- Existing reserved quantity = 5.
- Available quantity = 15.
- Confirm a sales order for 10 units.

Expected:

- On-hand remains 20.
- Reserved becomes 15.
- Available becomes 5.
- One RESERVE movement is created.

### 3.7 Sales Fulfilment

For the confirmed 10-unit order:

Expected:

- On-hand becomes 10.
- Reserved becomes 5.
- Available remains 5.
- Reservation becomes CONSUMED.
- One FULFILMENT movement is created.
- Order becomes FULFILLED.

### 3.8 Cancellation

Cancel a confirmed order before fulfilment.

Expected:

- Order becomes CANCELLED.
- Active reservation becomes RELEASED.
- Reserved quantity decreases.
- On-hand quantity does not change.
- A RELEASE movement is created.

### 3.9 Duplicate Operations

Repeat a receiving or fulfilment request using the same idempotency key.

Expected:

- Stock changes only once.
- Original result is returned where supported, or a conflict is returned.
- No duplicate movement is created.

## 4. Concurrency Tests

### Test A — Two requests compete for one unit

Initial available quantity: 1.

Send two simultaneous confirmation requests, each requesting one unit.

Expected:

- Exactly one request succeeds.
- The other returns HTTP 409.
- Reserved quantity is 1.
- One active reservation exists.
- One RESERVE movement exists.

### Test B — Twenty requests compete for five units

Initial available quantity: 5.

Send twenty simultaneous confirmations, each requesting one unit.

Expected:

- Exactly five requests succeed.
- Fifteen requests return HTTP 409.
- Reserved quantity becomes 5.
- Available quantity becomes 0.

### Test C — Opposite product lock order

Two orders contain the same two products in opposite line order.

Expected:

- Rows are locked in a consistent order.
- No deadlock error reaches the client.
- Final stock matches successful orders.

### Test D — Duplicate receipt requests

Send the same receiving request five times concurrently using the same idempotency key.

Expected:

- Stock increases once.
- Duplicate stock movements are not created.

## 5. Atomic Rollback Test

Force a failure during sales fulfilment after a stock update has been attempted.

Expected:

- Stock balances remain unchanged.
- Reservation status remains unchanged.
- Order status remains unchanged.
- No partial movement or audit record is committed.

## 6. Audit Tests

Perform:

- Sales confirmation.
- Sales fulfilment.
- Purchase receiving.
- Stock adjustment.
- User activation/deactivation.
- Role changes.

Expected:

- Audit records contain actor, action, entity, outcome, timestamp, and approved before/after data.
- No passwords, password hashes, tokens, or secrets are stored.
- Audit records cannot be modified or deleted through the application.
- Unauthorized roles cannot read audit logs.

## 7. Frontend Tests

Verify:

- Forms display validation messages.
- Loading states appear.
- Empty states appear.
- API errors are handled clearly.
- Confirmation dialogs protect consequential actions.
- Screens respect role-based visibility.
- The frontend handles 401, 403, 409, and 422 responses.

## 8. Definition of Done

A feature is complete only when:

1. Backend business rules are implemented.
2. Database migration and constraints are present.
3. Authorization is enforced.
4. Input validation is implemented.
5. Frontend behavior is integrated.
6. Relevant tests pass.
7. Documentation is updated.
8. Changes are committed to GitHub.

## 9. Test Report Template

| Test ID | Scenario               | Expected Result                         | Actual Result | Status  | Date |
| ------- | ---------------------- | --------------------------------------- | ------------- | ------- | ---- |
| T-001   | Invalid login          | Request rejected                        | Not executed  | Pending | —    |
| T-002   | Insufficient stock     | 409; no reservation                     | Not executed  | Pending | —    |
| T-003   | Partial receiving      | Correct received/outstanding quantities | Not executed  | Pending | —    |
| T-004   | Over-receiving         | 422; no stock change                    | Not executed  | Pending | —    |
| T-005   | Concurrent reservation | Only available units succeed            | Not executed  | Pending | —    |
| T-006   | Duplicate receipt      | Stock changes once                      | Not executed  | Pending | —    |
| T-007   | Audit event            | Correct audit record                    | Not executed  | Pending | —    |

**Important:** Do not change Pending to Passed until you have executed and recorded the test.
