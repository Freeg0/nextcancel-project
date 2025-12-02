# Quick Start Guide

Get NextCancel running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] pnpm installed (`npm install -g pnpm`)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
pnpm install
```

### 2. Set Up Environment (1 min)

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

**Update these values in `.env`:**

```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/nextcancel?schema=public"

# Generate with: openssl rand -base64 32
AUTH_SECRET="paste-generated-secret-here"

# Keep as-is for local development
AUTH_URL="http://localhost:3000"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database (2 min)

```bash
# Create the database schema
pnpm db:push

# Seed with sample celebrities
pnpm db:seed
```

**Expected output:**
```
✔ Generated Prisma Client
Starting seed...
Cleared existing data
Created 12 celebrities
Seed completed successfully
```

### 4. Run the App (1 min)

```bash
pnpm dev
```

**Open in browser:** [http://localhost:3000](http://localhost:3000)

## Test the Application

### Create an Account
1. Click "Sign Up" in the navbar
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Sign Up"

### Vote for a Celebrity
1. Navigate to "Celebrities"
2. Click on any celebrity
3. Click "Vote for this Celebrity"
4. Verify you can't vote again

### Check the Leaderboard
1. Navigate to "Leaderboard"
2. See your voted celebrity ranked

## Troubleshooting

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Make sure PostgreSQL is running: `pg_isready`
2. Check your DATABASE_URL in `.env`
3. Verify the database exists:
   ```sql
   psql -U postgres -c "CREATE DATABASE nextcancel;"
   ```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
pnpm dev --port 3001
```

### Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
pnpm prisma generate
```

### Build Scripts Warning

**Warning:** `Ignored build scripts: @prisma/client, bcrypt, prisma`

**Solution:**
```bash
pnpm rebuild @prisma/client bcrypt prisma
```

## Next Steps

- [ ] Explore the codebase structure
- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- [ ] Read [README.md](./README.md) for full documentation
- [ ] Customize the celebrity seed data in `prisma/seed.ts`
- [ ] Add your own styling to `app/globals.css`

## Common Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Build for production
pnpm start               # Run production build

# Database
pnpm db:push             # Update database schema
pnpm db:studio           # Open Prisma Studio UI
pnpm db:seed             # Reseed database

# Code Quality
pnpm lint                # Run ESLint
```

## What's Included

The seed script creates 12 sample celebrities:
- Timothée Chalamet
- Zendaya
- Florence Pugh
- Austin Butler
- Anya Taylor-Joy
- Tom Holland
- Millie Bobby Brown
- Jacob Elordi
- Jenna Ortega
- Pedro Pascal
- Sydney Sweeney
- Paul Mescal

## Need Help?

- **Documentation**: See [README.md](./README.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: Create an issue on GitHub
- **Questions**: Check the discussions section

## Success Indicators

Your setup is complete when you can:
- ✅ Sign up and sign in
- ✅ Browse celebrities with search
- ✅ Vote for a celebrity
- ✅ See updated leaderboard
- ✅ See "already voted" message when trying to vote again

Happy coding! 🚀
