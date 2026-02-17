# Task Management System - Technical Plan

## Backend Choice Justification

### Technology Stack

**Node.js 22 with Express.js 5 and TypeScript 5**

**Rationale:**

- **Node.js**: Asynchronous, event-driven architecture ideal for I/O-heavy operations like task management APIs. Large ecosystem with mature libraries for authentication, validation, and database connectivity.
- **Express.js**:
  Why I chose: Considering the task-management-api's scale, the desicion of choosing Express was made since its lightweight and flexible.

Other - Minimal, flexible framework with extensive middleware support. Well-documented and widely adopted, ensuring maintainability and community support.

- **TypeScript**:
  Why I chose it: Since TypeScript adds static typing to JavaScript, helping catch errors early and improving code quality. It enhances readability, maintainability, and developer productivity with features like IntelliSense and easier refactoring. Its strong adoption in the industry also makes it a reliable choice for building scalable, production-ready applications.

Provides static typing, enhancing code quality, reducing runtime errors, and improving developer experience with IntelliSense and refactoring capabilities.

- **PostgreSQL**:
  Why I chose: Since the Task model does have a stable data structure, my decision go towards to choose a relational database and because of that the desicision of choosing PostgreSQL was made.
  Other - ACID-compliant relational database ensures data integrity for user accounts and task relationships. Superior support for complex queries and concurrent transactions.
- **Sequelize ORM**:
  Why I chose: Since it is a widely used and production-ready ORM that simplifies database operations, especially with TypeScript. It makes writing queries easier, manages migrations efficiently. Its proven performance and strong community support make it a reliable choice for building scalable applications.

Simplifies database operations with TypeScript support, migration management, and protection against SQL injection.

- **Umzug**:
  Why I chose: Since Sequelize does not offer full TypeScript support for migrations, because of that I chose Umzug, which is a framework agnostic migration tool, works well with TypeScript.

A professional migration tool used alongside Sequelize to efficiently manage database changes and maintain version control over schemas.

## Architecture Overview

### Application Layers

**1. Presentation Layer (Routes)**

- `/auth` - Authentication endpoints (register, login, verify, refresh)
- `/users` - User management endpoints
- `/tasks` - Task CRUD operations

**2. Business Logic Layer (Controllers)**

- **auth.controller**: User registration with OTP verification, login with JWT issuance, token refresh
- **user.controller**: User profile retrieval and management
- **task.controller**: Task creation, retrieval, updates, deletion with ownership validation

**3. Data Access Layer (Models)**

- **User Model**: id, email, password (hashed), verification status, timestamps
- **Task Model**: id, title, description, status, priority, userId (foreign key), timestamps

**4. Middleware Layer**

- **Authentication**: JWT validation for protected routes
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for HTTP security
- **CORS**: Configured origin-based access control

**5. Database Layer**

- **Sequelize ORM** with connection pooling
- **Umzug** for version-controlled migrations

## Security Considerations

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with access/refresh token pattern. Tokens signed with SECRET environment variable.
- **Password Security**: bcrypt hashing (cost factor 10+) for password storage. Passwords never stored in plaintext.
- **OTP Verification**: Email-based one-time passwords for user registration confirmation, expiring after a set time period.
- **Route Protection**: Middleware-based authentication checks on all sensitive endpoints.

### Data Protection

- **Environment Variables**: Sensitive credentials (database, JWT secret, email) stored outside codebase using `.env` files.
- **Input Validation**: Zod schemas validate all incoming requests, preventing malformed data and injection attacks.
- **SQL Injection Prevention**: Sequelize ORM parameterizes queries automatically.
- **CORS Configuration**: Restricts API access to specified frontend origin only.

### Infrastructure Security

- **Helmet.js**: Sets security HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.).
- **Rate Limiting**: Prevents brute-force attacks and DoS attempts with express-rate-limit.
- **Cookie Security**: httpOnly and secure flags for cookie-based token storage (production).
- **Database Security**: Connection credentials secured via environment variables. Principle of least privilege for database user permissions.

### Deployment Security

- **Docker**: Multi-stage builds minimize attack surface. Non-root user (nodejs:1001) runs the application.
- **HTTPS**: Production deployment requires SSL/TLS encryption (configured at reverse proxy level).
- **Dependency Management**: Regular `npm audit` checks for vulnerable packages. CI/CD pipeline ensures code quality.

### Additional Measures

- **Error Handling**: Generic error messages to clients prevent information leakage.
- **Logging**: Sensitive data excluded from application logs.
- **Session Management**: Token expiration policies enforced. Refresh tokens enable secure token rotation.

---

**Document Version**: 1.0  
**Date**: February 2026  
**Status**: Active Development
