# Task Management API

A robust REST API for task management built with Node.js, Express, TypeScript, and PostgreSQL. This API provides authentication, user management, and task CRUD operations with security features like rate limiting, helmet protection, and JWT-based authentication.

## Features

- **User Authentication & Authorization**
  - User registration with email verification (OTP)
  - Secure login with JWT tokens
  - Refresh token mechanism
  - Password hashing with bcrypt

- **Task Management**
  - Create, read, update, and delete tasks
  - Task ownership and access control
  - User-specific task retrieval

- **Security**
  - Helmet.js for security headers
  - Rate limiting (100 requests per 15 minutes)
  - CORS configuration
  - Cookie-based authentication
  - Environment-based configuration

- **Database**
  - PostgreSQL with Sequelize ORM
  - Migration support with Umzug
  - Database connection pooling

- **Code Quality**
  - TypeScript for type safety
  - ESLint for code linting
  - Prettier for code formatting
  - Vitest for testing

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express.js 5
- **Language:** TypeScript 5
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, Express Rate Limit, bcrypt
- **Email:** Nodemailer
- **Validation:** Zod
- **Testing:** Vitest
- **Linting:** ESLint
- **Formatting:** Prettier
- **Build Tool:** TypeScript Compiler (tsc)
- **Dev Tool:** tsx (TypeScript execution)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher)
- **Docker** (optional, for containerized deployment)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Configure the following environment variables in your `.env` file:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_URL=postgresql://username:password@localhost:5432/taskdb
PGHOST=localhost
PGDATABASE=taskdb
PGUSER=your_db_username
PGPASSWORD=your_db_password

# JWT Secret
SECRET=your_jwt_secret_key_here

# Email Configuration (for OTP verification)
APP_USER=your_email@gmail.com
APP_PASSWORD=your_app_password

# Frontend URL (for CORS)
FRONTEND_PREFIX=http://localhost:3000
```

#### Environment Variables Explained:

| Variable          | Description               | Example                                        |
| ----------------- | ------------------------- | ---------------------------------------------- |
| `PORT`            | Server port number        | `5000`                                         |
| `DB_URL`          | PostgreSQL connection URL | `postgresql://user:pass@localhost:5432/dbname` |
| `PGHOST`          | PostgreSQL host           | `localhost`                                    |
| `PGDATABASE`      | Database name             | `taskdb`                                       |
| `PGUSER`          | Database user             | `postgres`                                     |
| `PGPASSWORD`      | Database password         | `yourpassword`                                 |
| `SECRET`          | JWT secret key            | `your-super-secret-key`                        |
| `APP_USER`        | Email sender address      | `your-email@gmail.com`                         |
| `APP_PASSWORD`    | Email app password        | `your-app-password`                            |
| `FRONTEND_PREFIX` | Frontend URL for CORS     | `http://localhost:3000`                        |

**Note:** For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskdb;

# Exit psql
\q
```

#### Run Migrations

```bash
npm run migrate
```

This will create all necessary tables in your database.

#### Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Create a new migration file
npm run migration:create -- --name=migration-name
```

## Running the Application

### Development Mode

Run the application with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Production Mode

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

### Health Check

Verify the API is running:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "message": "API is active..."
}
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t task-management-api .
```

### Run Docker Container

```bash
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name task-api \
  task-management-api
```

### Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskdb
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      DB_URL: postgresql://postgres:postgres@postgres:5432/taskdb
      PGHOST: postgres
      PGDATABASE: taskdb
      PGUSER: postgres
      PGPASSWORD: postgres
      SECRET: your-secret-key
      APP_USER: your-email@gmail.com
      APP_PASSWORD: your-app-password
      FRONTEND_PREFIX: http://localhost:3000
    depends_on:
      - postgres

volumes:
  postgres-data:
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## 📡 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint         | Description              | Auth Required       |
| ------ | ---------------- | ------------------------ | ------------------- |
| POST   | `/auth/register` | Register new user        | No                  |
| POST   | `/auth/verify`   | Verify email with OTP    | No                  |
| POST   | `/auth/login`    | Login user               | No                  |
| POST   | `/auth/code`     | Resend verification code | No                  |
| POST   | `/auth/refresh`  | Refresh access token     | Yes (Refresh Token) |

### User Routes (`/users`)

| Method | Endpoint      | Description           | Auth Required |
| ------ | ------------- | --------------------- | ------------- |
| GET    | `/users/self` | Get current user info | Yes           |

### Task Routes (`/tasks`)

| Method | Endpoint     | Description        | Auth Required |
| ------ | ------------ | ------------------ | ------------- |
| GET    | `/tasks`     | Get all user tasks | Yes           |
| POST   | `/tasks`     | Create new task    | Yes           |
| GET    | `/tasks/:id` | Get specific task  | Yes           |
| PATCH  | `/tasks/:id` | Update task        | Yes           |
| DELETE | `/tasks/:id` | Delete task        | Yes           |

### Authentication

Protected routes require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

Or via cookies (recommended for browser-based clients).

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests Once

```bash
npm run test:run
```

### Run Tests with UI

```bash
npm run test:ui
```

### Generate Coverage Report

```bash
npm run coverage
```

## Code Quality

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
# Check linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Formatting

```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format
```

## CI/CD

The project includes GitHub Actions workflow for continuous integration:

**Workflow:** `.github/workflows/ci.yml`

**Triggers:** Push to `main` branch

**Steps:**

1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run TypeScript type checking
5. Run ESLint and fix issues
6. Format with Prettier
7. Check for remaining errors

## Project Structure

```
task-management-api/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI configuration
├── app/
│   ├── index.ts                # Application entry point
│   ├── configs/
│   │   ├── database.ts         # Database connection setup
│   │   └── dbConfig.ts         # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.ts  # Authentication logic
│   │   ├── task.controller.ts  # Task management logic
│   │   └── user.controller.ts  # User management logic
│   ├── middlewares/
│   │   └── auth.ts             # Authentication middleware
│   ├── models/
│   │   ├── index.ts            # Model exports
│   │   ├── task.model.ts       # Task model
│   │   └── user.model.ts       # User model
│   ├── routes/
│   │   ├── auth.route.ts       # Authentication routes
│   │   ├── task.route.ts       # Task routes
│   │   └── user.route.ts       # User routes
│   ├── schemas/
│   │   └── index.ts            # Zod validation schemas
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── utils/
│       ├── generateOTP.ts      # OTP generation utility
│       ├── jwt.ts              # JWT utility functions
│       └── sendEmail.ts        # Email sending utility
├── migrations/                  # Database migrations
│   ├── 2026.02.16T13.36.33.create-user.ts
│   ├── 2026.02.17T07.32.48.new-column-to-user.ts
│   └── 2026.02.17T14.50.44.task-create.ts
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Docker configuration
├── eslint.config.ts            # ESLint configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── tsconfig.build.json         # TypeScript build configuration
└── umzug.ts                    # Migration runner configuration
```

## Security Best Practices

1. **Never commit `.env` files** - Keep your secrets secure
2. **Use strong JWT secrets** - Generate using cryptographic methods
3. **Update dependencies regularly** - Run `npm audit` and `npm update`
4. **Use HTTPS in production** - Configure SSL/TLS certificates
5. **Validate all inputs** - Using Zod schemas
6. **Implement rate limiting** - Already configured (100 req/15min)
7. **Use environment variables** - Never hardcode credentials
8. **Enable CORS properly** - Configure allowed origins

## Available Scripts

| Script                     | Description                              |
| -------------------------- | ---------------------------------------- |
| `npm run dev`              | Start development server with hot reload |
| `npm start`                | Start production server                  |
| `npm run build`            | Build TypeScript to JavaScript           |
| `npm run type-check`       | Run TypeScript type checking             |
| `npm run lint`             | Check for linting errors                 |
| `npm run lint:fix`         | Fix linting errors automatically         |
| `npm run format`           | Format code with Prettier                |
| `npm run format:check`     | Check code formatting                    |
| `npm test`                 | Run tests in watch mode                  |
| `npm run test:run`         | Run tests once                           |
| `npm run test:ui`          | Run tests with UI                        |
| `npm run coverage`         | Generate test coverage report            |
| `npm run migrate`          | Run database migrations                  |
| `npm run migrate:rollback` | Rollback last migration                  |
| `npm run migration:create` | Create new migration file                |


## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**Issue:** Cannot connect to database

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Issue:** JWT token errors

- Verify `SECRET` is set in `.env`
- Check token expiration time
- Ensure token is sent in correct format

**Issue:** Email not sending

- Verify email credentials
- Use Gmail App Password
- Check network/firewall settings

**Issue:** Port already in use

- Change `PORT` in `.env`
- Kill process using the port: `npx kill-port 5000`

**Issue:** Migration errors

- Check database connection
- Verify migration files
- Try rolling back and re-running migrations

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

## Related Projects

- **Task Management Web** - Frontend application for this API
- Built with Next.js, React, and TypeScript

---

**Developed by Anuka Samuditha using Node.js, Express, and TypeScript**
