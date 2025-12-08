# Backend Setup Guide

This project uses a Node.js/Express backend with Drizzle ORM and PostgreSQL.

## Prerequisites

1. **PostgreSQL** - Choose one of these options:

   **Option A: Docker (Recommended - Easiest)**
   ```bash
   # Start PostgreSQL using Docker Compose
   docker-compose up -d
   
   # This will start PostgreSQL on port 5432 with:
   # - Database: jobs_tracker
   # - User: postgres
   # - Password: postgres
   ```

   **Option B: Install PostgreSQL locally (macOS)**
   ```bash
   # Using Homebrew
   brew install postgresql@16
   brew services start postgresql@16
   
   # Add to PATH (add to ~/.zshrc or ~/.bash_profile)
   echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **Option C: Standalone Docker container**
   ```bash
   docker run --name jobs-tracker-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=jobs_tracker \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **Node.js** - Version 18+ (already installed for Next.js)

## Database Setup

**If using Docker Compose (Option A):**
The database is automatically created when the container starts. Skip to step 2.

**If using local PostgreSQL (Option B):**
1. **Create the database:**
   ```bash
   # Using createdb (if in PATH)
   createdb jobs_tracker
   
   # Or using psql:
   psql -U postgres -c "CREATE DATABASE jobs_tracker;"
   
   # Or connect to psql and run:
   psql -U postgres
   CREATE DATABASE jobs_tracker;
   \q
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=jobs_tracker
   DB_USER=postgres
   DB_PASSWORD=postgres
   PORT=3001
   ```

3. **Generate and run migrations:**
   ```bash
   # Generate migration files from schema
   npm run db:generate
   
   # Push schema to database (creates tables)
   npm run db:push
   ```

   Alternatively, you can use migrations:
   ```bash
   npm run db:migrate
   ```

## Running the Backend

1. **Development mode (with auto-reload):**
   ```bash
   npm run dev:server
   ```

2. **Production mode:**
   ```bash
   npm run server
   ```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Recruiters
- `GET /api/recruiters` - Get all recruiters
- `GET /api/recruiters/:id` - Get recruiter by ID
- `POST /api/recruiters` - Create new recruiter
  ```json
  { "name": "John Doe" }
  ```
- `PUT /api/recruiters/:id` - Update recruiter
- `DELETE /api/recruiters/:id` - Delete recruiter

### Job Applications
- `GET /api/job-applications` - Get all job applications
- `GET /api/job-applications/status/:status` - Get applications by status
- `GET /api/job-applications/:id` - Get application by ID
- `POST /api/job-applications` - Create new application
  ```json
  {
    "companyName": "Acme Corp",
    "jobTitle": "Senior Engineer",
    "status": "inMotion",
    "recruiterId": "uuid-here" // optional
  }
  ```
- `PUT /api/job-applications/:id` - Update application
- `DELETE /api/job-applications/:id` - Delete application

### Board
- `GET /api/board` - Get all board data (recruiters + applications organized by status)

## Database Schema

### Recruiters Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR 255)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Job Applications Table
- `id` (UUID, Primary Key)
- `company_name` (VARCHAR 255)
- `job_title` (VARCHAR 255, nullable)
- `status` (ENUM: 'recruiters', 'inMotion', 'sentApps')
- `recruiter_id` (UUID, Foreign Key to recruiters, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Drizzle ORM Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema directly to database (development)
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Frontend Integration

The frontend is configured to connect to the backend API. Make sure:

1. Backend is running on port 3001
2. Set `NEXT_PUBLIC_API_URL` in `.env.local` if using a different URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

## Quick Start with Docker

The easiest way to get started:

```bash
# 1. Start PostgreSQL database
npm run db:docker:up
# or: docker-compose up -d

# 2. Configure environment
cp .env.example .env
# Edit .env if needed (defaults work with Docker setup)

# 3. Initialize database schema
npm run db:push

# 4. Start backend server
npm run dev:server

# 5. In another terminal, start frontend
npm run dev
```

## Troubleshooting

**Database connection errors:**
- **Docker**: Check container is running: `docker ps | grep jobs-tracker-db`
- **Local**: Check PostgreSQL is running: `pg_isready` or `brew services list`
- Verify credentials in `.env` match your setup
- Check database exists: `psql -U postgres -l | grep jobs_tracker` (or use Docker: `docker exec -it jobs-tracker-db psql -U postgres -l`)

**Docker issues:**
- View logs: `docker-compose logs postgres`
- Restart: `docker-compose restart postgres`
- Reset database: `docker-compose down -v && docker-compose up -d`

**Port already in use:**
- Change `PORT` in `.env` to a different port
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**Migration errors:**
- Drop and recreate database: `dropdb jobs_tracker && createdb jobs_tracker`
- Run `npm run db:push` to recreate schema
