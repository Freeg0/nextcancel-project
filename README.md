# NextCancel - Celebrity Voting Platform

A modern web application built with Next.js that allows users to vote for celebrities they predict will become the next trendy star.

## Features

- **Celebrity Catalog**: Browse, search, and paginate through a list of celebrities
- **Voting System**: Authenticated users can vote for their favorite celebrity (one vote per user)
- **Leaderboard**: View rankings of celebrities by vote count
- **Authentication**: Secure user authentication with email/password (Auth.js v5)
- **Database Constraints**: Enforces one-vote-per-user at the database level with Prisma

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth.js v5)
- **UI**: shadcn/ui + Tailwind CSS
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (install with `npm install -g pnpm`)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nextcancel-project
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up your database

Create a PostgreSQL database and update the `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nextcancel?schema=public"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

Generate an `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Initialize the database

```bash
# Push the schema to your database
pnpm db:push

# Seed the database with sample celebrities
pnpm db:seed
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextcancel-project/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── celebrities/     # Celebrity data endpoints
│   │   └── vote/            # Voting endpoints
│   ├── auth/                # Auth pages (signin, signup)
│   ├── celebrities/         # Celebrity pages
│   │   └── [id]/           # Celebrity detail page
│   ├── leaderboard/         # Leaderboard page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── Pagination.tsx
│   └── VoteButton.tsx
├── lib/                     # Utilities
│   ├── db.ts               # Prisma client
│   └── utils.ts            # Helper functions
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── types/                   # TypeScript type definitions
│   └── next-auth.d.ts      # Auth.js types
├── auth.config.ts          # Auth.js configuration
├── auth.ts                 # Auth.js setup
└── middleware.ts           # Next.js middleware
```

## Database Schema

### User
- Managed by Auth.js adapter
- Fields: id, email, name, password, etc.

### Celebrity
- id (uuid)
- firstName, lastName, displayName
- birthDate
- imageUrl
- bio (optional)
- wikidataId (optional)

### Vote
- id (uuid)
- userId (unique) - **enforces one vote per user**
- celebrityId
- createdAt

**Key Constraint**: `userId` is unique in the Vote table, ensuring each user can only vote once.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with credentials
- `GET /api/auth/signout` - Sign out

### Celebrities
- `GET /api/celebrities?page=1&search=query` - Get paginated celebrities with search

### Voting
- `POST /api/vote` - Cast a vote (requires authentication)
- `GET /api/vote` - Get current user's vote

## Key Features Explained

### One Vote Per User

The application enforces the one-vote-per-user rule at multiple levels:

1. **Database Level**: Unique constraint on `userId` in the Vote table
2. **API Level**: Check for existing vote before creating new one
3. **UI Level**: Show appropriate messaging based on vote status

### Vote States

- **Not Authenticated**: "You must be signed in to vote"
- **Not Voted**: Shows vote button
- **Voted for Current Celebrity**: "You voted for [Celebrity Name]"
- **Voted for Another Celebrity**: "You already voted for [Other Celebrity]. You can only vote once."

### Search & Pagination

- Full-text search across firstName, lastName, and displayName
- 12 celebrities per page
- Maintains search query across pagination

## Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database with sample data
```

## Future Enhancements

### Planned Features (Not in MVP)
- **Seasons**: Add multi-season support with `@@unique([userId, seasonId])`
- **Vote Changes**: Allow users to change their vote
- **OAuth Providers**: Add Google, GitHub authentication
- **Admin Panel**: Manage celebrities through UI
- **Wikidata Integration**: Auto-import celebrity data
- **Analytics**: Vote trends and statistics
- **Social Features**: Comments, sharing

### Implementing Seasons

To add seasonal voting, update the Vote model:

```prisma
model Vote {
  id          String    @id @default(cuid())
  userId      String
  celebrityId String
  seasonId    String    @default("season-1")

  // Change from @unique to composite unique constraint
  @@unique([userId, seasonId])
}
```

## Production Deployment

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or Vercel Postgres)
2. Update environment variables in your hosting platform
3. Run migrations: `pnpm db:push`
4. Deploy to Vercel, Railway, or your preferred platform
5. Seed production database if needed: `pnpm db:seed`

## Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="https://your-domain.com"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
