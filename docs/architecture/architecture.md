\# Nexora ERP — System Architecture



\## 1. Architecture Overview



Nexora ERP uses a three-tier architecture.



\### Presentation Layer

React and TypeScript provide the user interface.



\### Application Layer

Node.js and Express expose REST APIs, validate requests, enforce authorization, and execute business logic.



\### Data Layer

PostgreSQL stores relational business data. Prisma provides database access and migration management.



\## 2. Request Lifecycle



1\. A user interacts with the React application.

2\. The frontend sends an HTTP request.

3\. Express receives and routes the request.

4\. Middleware handles validation, authentication, and authorization.

5\. Controllers coordinate the request.

6\. Services execute business rules.

7\. Prisma communicates with PostgreSQL.

8\. The API returns a JSON response.



\## 3. Security



\- Password hashing using bcrypt.

\- JWT-based authentication.

\- Role-based authorization.

\- Request validation using Zod.

\- HTTP security headers using Helmet.

\- Environment-based configuration.

\- Separate migration and application database accounts.



\## 4. Database Integrity



The database uses relational constraints, foreign keys, unique indexes, and transactions to maintain business data consistency.



\## 5. Current Implementation



The PostgreSQL environment, initial Prisma schema, migrations, database seeding, and Express health endpoints have been implemented.



Authentication and business modules are planned for subsequent development days.

