# Nexora ERP Backend

## Overview

The Nexora ERP backend provides a REST API built with Node.js, Express 5, PostgreSQL, and Prisma 7.

## Architecture

The backend follows a modular architecture:

```text
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── utils/
└── server.js
```

These folders represent the intended application organization and will be populated as modules are implemented.

## Database Configuration

The application uses two PostgreSQL database accounts:

- `nexora_migrator`: database migrations and schema management.
- `nexora_app`: application-level database operations.

Configure the following variables in the root `.env` file:

```env
DATABASE_URL_MIGRATOR=
DATABASE_URL_APP=
```

Never commit actual credentials.

## Available Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma migrate status
npm run db:seed
npm run dev
```

## Health Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API availability |
| GET | `/api/health/db` | Database connectivity |

## Database

Prisma schema:

```text
prisma/schema.prisma
```

Migration history:

```text
prisma/migrations/
```

Database seeding:

```text
prisma/seed.js
```

## Current Status

The database foundation, initial migration, seed data, and Express health endpoints are operational.

Authentication, authorization, and ERP business modules remain under development.