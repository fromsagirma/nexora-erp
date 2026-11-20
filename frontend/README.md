
# Nexora ERP Frontend

## Overview

This directory will contain the React frontend application for Nexora ERP.

The frontend will provide the user interface for authentication, inventory, sales, purchasing, dashboard, reports, and audit history.

## Proposed Technology Stack

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

## Proposed Feature Modules

| Module | Responsibility |
|---|---|
| auth | Login and authentication interface |
| dashboard | Operational indicators and charts |
| products | Product and category management |
| inventory | Stock levels, movements and adjustments |
| customers | Customer management |
| sales | Sales order creation and processing |
| suppliers | Supplier management |
| purchasing | Purchase orders and receiving |
| users | User and role management |
| audit | Read-only audit history |

## Frontend Responsibilities

- Render responsive interfaces.
- Validate forms.
- Communicate with backend REST APIs.
- Display loading, empty, success and error states.
- Respect user permissions in the interface.
- Refresh relevant server data after successful operations.

The backend remains responsible for enforcing permissions and business rules.

## Proposed Commands

Once the frontend application is initialized:

```bash
npm install
npm run dev
npm run build
npm run test
```

The exact scripts will be defined in `package.json`.

## Project Status

Frontend implementation has not started. Development is subject to formal Project Manager approval.
