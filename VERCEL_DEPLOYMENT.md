# Vercel Deployment Guide

This guide explains how to deploy your Next.js frontend and Express backend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A PostgreSQL database (Vercel Postgres recommended for Vercel deployments)
3. The Vercel CLI (optional, for local testing): `npm i -g vercel`

## Deployment Steps

### 1. Set Up Vercel Postgres

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database** → Select **Postgres**
4. Choose a plan (Hobby plan is free for development)
5. Select a region closest to your users
6. Click **Create**

Vercel will automatically:

- Create a Postgres database
- Add the following environment variables to your project:
  - `POSTGRES_URL` - Pooled connection URL
  - `POSTGRES_URL_NON_POOLING` - Direct connection URL (used by Drizzle)
  - `POSTGRES_PRISMA_URL` - Prisma-specific URL
  - `POSTGRES_USER` - Database user
  - `POSTGRES_HOST` - Database host
  - `POSTGRES_PASSWORD` - Database password
  - `POSTGRES_DATABASE` - Database name

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Create a Postgres database
vercel postgres create

# Follow the prompts to select a plan and region
```

**Alternative Database Providers**

If you prefer not to use Vercel Postgres, you can use:

- **Neon** (free tier available)
- **Supabase** (free tier available)
- **Railway**, **Render**, or any other PostgreSQL provider

For these, you'll need to manually set the `DATABASE_URL` environment variable in Vercel.

### 2. Configure Environment Variables

**If using Vercel Postgres:**
Environment variables are automatically added when you create the database. No manual configuration needed!

**If using an external PostgreSQL provider:**
In your Vercel project settings → **Settings** → **Environment Variables**, add:

- `DATABASE_URL` - Your PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Or set individual variables:
    - `DB_HOST` - Database host
    - `DB_PORT` - Database port (usually 5432)
    - `DB_NAME` - Database name
    - `DB_USER` - Database user
    - `DB_PASSWORD` - Database password

**Optional:**

- `PORT` - Server port (Vercel sets this automatically, but you can override)
- `NEXT_PUBLIC_API_URL` - Override API URL if needed (defaults to Vercel deployment URL)

### 3. Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Vercel will auto-detect Next.js
4. Add your environment variables in the project settings
5. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### 4. Run Database Migrations

After deployment, you need to initialize your database schema. The database connection code automatically uses `POSTGRES_URL_NON_POOLING` (provided by Vercel Postgres) for migrations.

**Option 1: Run migrations locally (Recommended)**

```bash
# Pull environment variables from Vercel (includes POSTGRES_URL_NON_POOLING)
vercel env pull .env.local

# Run migrations using Drizzle push (creates tables from schema)
npm run db:push

# Or generate and run migrations (production recommended)
npm run db:generate
npm run db:migrate
```

**Option 2: Run migrations in Vercel build**

You can add a build script to run migrations automatically. Update `package.json`:

```json
{
  "scripts": {
    "build": "npm run db:push && next build"
  }
}
```

**Option 3: Use Vercel Postgres Dashboard**

1. Go to your Vercel project → **Storage** → Your Postgres database
2. Click on **Query** tab
3. Manually run SQL commands from your migration files

**Note:** For Vercel Postgres, `POSTGRES_URL_NON_POOLING` is automatically used by the database connection code, which is the recommended connection type for Drizzle ORM migrations.

### 5. Update Frontend API URL (if needed)

If your frontend needs to point to a different API URL, set:

- `NEXT_PUBLIC_API_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app/api`)

Vercel automatically provides this, but you can override it if needed.

## Project Structure

The deployment uses:

- **Next.js Frontend**: Automatically detected and deployed
- **Express Backend**: Deployed as a serverless function at `/api/index.ts`
  - All `/api/*` routes are handled by the Express app
  - Routes available:
    - `/api/health` - Health check
    - `/api/recruiters` - Recruiter CRUD operations
    - `/api/job-applications` - Job application CRUD operations
    - `/api/board` - Board data endpoint

## Testing Your Deployment

1. **Health Check**: Visit `https://your-app.vercel.app/api/health`
2. **API Endpoints**: Test your API endpoints using the routes listed above
3. **Frontend**: Visit `https://your-app.vercel.app` to see your Next.js app

## Troubleshooting

### Build Errors

- **TypeScript errors**: Make sure all TypeScript files compile correctly
- **Missing dependencies**: Ensure all packages are in `package.json` (not just `devDependencies`)

### Database Connection Issues

**For Vercel Postgres:**

- Verify environment variables are set (they should be automatic when you create the database)
- Check the **Storage** tab in your Vercel dashboard to ensure the database is running
- The code automatically uses `POSTGRES_URL_NON_POOLING` which is the correct connection type for Drizzle

**For External Databases:**

- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Check that your database allows connections from Vercel's IP ranges
- For some providers (like Neon), you may need to enable "Allow external connections"
- Ensure you're using the correct connection string format

### API Routes Not Working

- Check Vercel function logs in the dashboard
- Verify the `vercel.json` configuration is correct
- Ensure the Express app is properly exported in `api/index.ts`

### Environment Variables Not Loading

- Environment variables must be set in Vercel project settings
- Redeploy after adding/changing environment variables
- Use `vercel env pull` to verify variables locally

## Continuous Deployment

Vercel automatically deploys when you push to your connected Git branch:

- **Production**: Pushes to `main`/`master` branch
- **Preview**: All other branches and pull requests

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
