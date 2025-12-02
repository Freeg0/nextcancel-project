# Architecture & Implementation Guide

This document explains the technical architecture, design decisions, and implementation details of NextCancel.

## Architecture Overview

NextCancel follows a modern **full-stack architecture** using Next.js App Router with server-side rendering (SSR) and API routes.

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                  │
│  - Server Components (default)                      │
│  - Client Components ("use client")                 │
│  - Server Actions (forms, mutations)                │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│              Next.js App Router Layer               │
│  - Route Handlers (API endpoints)                   │
│  - Middleware (auth, redirects)                     │
│  - Server-side data fetching                        │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│                 Business Logic Layer                │
│  - Authentication (Auth.js)                         │
│  - Data validation (Zod)                            │
│  - Database queries (Prisma)                        │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                  │
│  - User data                                        │
│  - Celebrity data                                   │
│  - Vote data (with constraints)                     │
└─────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Server Components by Default

**Decision**: Use React Server Components (RSC) as the default, only adding `"use client"` when needed.

**Rationale**:
- Better performance (less JavaScript sent to client)
- Direct database access without API calls
- Automatic code splitting
- SEO-friendly

**Client Components Used**:
- `SearchBar.tsx` - needs useRouter, useState
- `VoteButton.tsx` - interactive voting
- `SessionProvider.tsx` - Auth.js session context
- Auth pages (signin/signup) - form state management

### 2. Database-Level Vote Constraint

**Decision**: Enforce one-vote-per-user with a unique constraint on `userId` in the database.

**Rationale**:
- **Data Integrity**: Cannot be bypassed by API bugs or direct DB access
- **Atomic Operations**: Database handles race conditions
- **Simple Logic**: No complex application-level locking needed

**Implementation**:
```prisma
model Vote {
  userId String @unique  // ← This enforces the constraint
  // ...
}
```

**Alternative Considered**: Application-level checking only
- **Rejected because**: Can be bypassed, race conditions possible

### 3. Authentication with Auth.js v5

**Decision**: Use Auth.js (NextAuth.js v5) with JWT strategy.

**Rationale**:
- **Industry Standard**: Well-tested, secure authentication
- **Flexible**: Supports credentials + OAuth providers
- **JWT Strategy**: Stateless, works well with serverless
- **Prisma Adapter**: Seamless database integration

**Session Strategy**:
```typescript
{
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },  // Stateless sessions
}
```

### 4. API Structure

**Decision**: Use Next.js Route Handlers for API endpoints, not separate backend.

**Routes**:
- `app/api/auth/[...nextauth]/route.ts` - Auth.js handler
- `app/api/auth/signup/route.ts` - User registration
- `app/api/celebrities/route.ts` - Celebrity listing
- `app/api/vote/route.ts` - Voting endpoint

**Rationale**:
- **Single Codebase**: No need for separate backend server
- **Type Safety**: Shared types between frontend and backend
- **Simplified Deployment**: Deploy as one unit
- **Performance**: Co-located with frontend, low latency

### 5. Pagination & Search

**Decision**: Server-side pagination with URL query parameters.

**Implementation**:
```typescript
// URL: /celebrities?page=2&search=tom
const page = parseInt(searchParams.page || "1");
const search = searchParams.search || "";
```

**Rationale**:
- **Shareable URLs**: Users can bookmark search results
- **SEO**: Search engines can index paginated pages
- **Server-Side**: Efficient for large datasets
- **Performance**: Only load 12 items at a time

### 6. Image Handling

**Decision**: Store image URLs (not files) and use Next.js Image component.

**Implementation**:
```tsx
<Image
  src={celebrity.imageUrl}
  alt={celebrity.displayName}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Rationale**:
- **Performance**: Automatic optimization, lazy loading
- **CDN-Ready**: Can use external CDNs (Cloudinary, etc.)
- **Responsive**: Automatic srcset generation
- **MVP-Friendly**: No file upload complexity

**Future Enhancement**: Add file upload with AWS S3 or Cloudflare R2

## Database Schema Design

### Vote Table Design

**Current (MVP)**: One vote per user globally
```prisma
model Vote {
  userId String @unique
  celebrityId String
}
```

**Future (Seasons)**: One vote per user per season
```prisma
model Vote {
  userId String
  celebrityId String
  seasonId String @default("season-1")

  @@unique([userId, seasonId])
}
```

### Indexes

Strategic indexes for performance:
```prisma
model Celebrity {
  @@index([displayName])  // For search queries
}

model Vote {
  @@index([celebrityId])  // For vote counting
}
```

## Security Considerations

### 1. Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with AUTH_SECRET
- HTTP-only cookies (managed by Auth.js)

### 2. Authorization
- Middleware protects voting routes
- Session validation on every request
- User ID from session (not client input)

### 3. Input Validation
- Zod schemas validate all inputs
- Type-safe API endpoints
- SQL injection prevented by Prisma

### 4. CSRF Protection
- Auth.js includes CSRF tokens
- Same-origin policy enforced

## Performance Optimizations

### 1. Database Queries

**Optimization**: Minimize N+1 queries with Prisma includes
```typescript
// ✅ Good: Single query with count
db.celebrity.findMany({
  include: {
    _count: { select: { votes: true } }
  }
})

// ❌ Bad: N+1 queries
const celebrities = await db.celebrity.findMany();
for (const celeb of celebrities) {
  const count = await db.vote.count({ where: { celebrityId: celeb.id } });
}
```

### 2. React Server Components

- Fetch data directly in components
- No waterfall requests
- Automatic request deduplication

### 3. Image Optimization

- Next.js Image component
- Automatic WebP/AVIF conversion
- Lazy loading with blur placeholder

### 4. Code Splitting

- Automatic route-based splitting
- Dynamic imports for large components
- Tree-shaking unused code

## Error Handling

### API Error Responses

Consistent error format:
```typescript
return NextResponse.json(
  { error: "Human-readable message" },
  { status: 400 }
);
```

### Database Errors

Handle Prisma errors gracefully:
```typescript
try {
  await db.vote.create({ data: { userId, celebrityId } });
} catch (error: any) {
  if (error.code === "P2002") {
    return NextResponse.json(
      { error: "You have already voted" },
      { status: 400 }
    );
  }
}
```

### Client-Side Errors

Display user-friendly messages:
```tsx
{error && (
  <div className="text-destructive bg-destructive/10 p-3">
    {error}
  </div>
)}
```

## Testing Strategy (Future)

### Unit Tests
- Utility functions (lib/utils.ts)
- Validation schemas (Zod)

### Integration Tests
- API endpoints
- Database operations
- Authentication flows

### E2E Tests (Playwright/Cypress)
- User registration
- Voting flow
- Search and pagination

## Deployment Considerations

### Environment Variables

Required for production:
```env
DATABASE_URL="postgresql://..."  # Production DB
AUTH_SECRET="random-secret"      # Generate new for prod
AUTH_URL="https://your-domain.com"
```

### Database Migration Strategy

For production:
1. Use `prisma migrate dev` in development
2. Use `prisma migrate deploy` in CI/CD
3. Keep `db:push` for rapid prototyping only

### Hosting Recommendations

**Option 1: Vercel (Recommended)**
- Native Next.js support
- Automatic deployments
- Edge functions
- Vercel Postgres integration

**Option 2: Railway**
- PostgreSQL included
- Easy environment management
- Good for full-stack apps

**Option 3: Self-hosted (Docker)**
- Full control
- Cost-effective at scale
- Requires DevOps knowledge

## Monitoring & Observability (Future)

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics / Plausible
- **Database**: Prisma Studio / pgAdmin
- **Performance**: Vercel Speed Insights

### Key Metrics to Track
- Vote success rate
- Authentication errors
- Page load times
- Database query performance
- API response times

## Scalability Considerations

### Current Limits (MVP)
- ~10,000 concurrent users (depending on DB)
- ~100,000 celebrities
- ~1,000,000 votes

### Scaling Strategies (Future)

**Database**:
- Add read replicas for queries
- Use connection pooling (PgBouncer)
- Implement Redis caching

**Application**:
- Enable Next.js edge runtime
- Add CDN for static assets
- Implement rate limiting

**Caching**:
- Cache leaderboard (Redis)
- Cache celebrity listings
- Revalidate on vote changes

## Future Architecture Enhancements

### 1. Real-time Updates
- Add WebSocket support
- Live vote count updates
- Real-time leaderboard

### 2. Admin Dashboard
- Manage celebrities
- View analytics
- Moderate content

### 3. Wikidata Integration
- Automated celebrity imports
- Keep data synchronized
- Enrich celebrity profiles

### 4. Multi-tenant Support
- Organizations can create contests
- Custom branding
- Separate leaderboards

## Conclusion

This architecture provides:
- **Simplicity**: Single codebase, minimal dependencies
- **Security**: Database-level constraints, proper authentication
- **Performance**: Server components, optimized queries
- **Scalability**: Easy to add features, scale infrastructure
- **Maintainability**: Type-safe, well-structured code

The design prioritizes **shipping a working MVP** while maintaining **clean architecture** for future enhancements.
