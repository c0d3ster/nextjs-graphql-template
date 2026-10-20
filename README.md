# Next.js GraphQL Template

A minimal, production-ready template for modern web applications built with Next.js, GraphQL, and TypeScript.

## 🎯 What This Template Provides

- **Modern Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **GraphQL API**: Apollo Server with type-graphql for schema-first development
- **Authentication**: Supabase Auth with email/password sign-in and sign-up
- **Atomic Design**: Organized component structure (atoms, molecules, organisms, templates)
- **Type Safety**: Full TypeScript coverage with automatic GraphQL type generation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Developer Experience**: ESLint, Prettier, automated workflows
- **Database**: Supabase Postgres with Drizzle ORM for queries, Supabase CLI for migrations
- **Realtime**: Supabase Realtime (Postgres changes, broadcast)
- **Code Quality**: Commitlint, semantic release, dependency checking

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat)
![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?logo=graphql&logoColor=white&style=flat)

## 🏗️ Architecture

Clean, layered architecture designed for scalability:

```
FRONTEND (React / Next.js)
──────────────────────────
components/pages/hooks
   │
   ▼
apiClients/ (GraphQL operations)
   - ContactApiClient.ts
   - UserApiClient.ts
   │
   ▼
APOLLO CLIENT
   - GraphQL query/mutation execution
   - Caching and state management
   - Type-safe operations
   │
   ▼
APOLLO SERVER (GraphQL API)
   - type-graphql schema generation
   - Resolver execution
   - Authentication & authorization
   │
   ▼
GRAPHQL RESOLVERS
   - ContactResolver.ts
   - UserResolver.ts
   │
   ▼
SERVICE LAYER
   - ContactService.ts
   - UserService.ts
   - Authentication & permission checking
   │
   ▼
DATABASE / EXTERNAL APIs
   - Drizzle ORM / Supabase Auth / Supabase Postgres
```

### Key Features

- **Frontend**: React components with TypeScript and Tailwind CSS
- **API Layer**: GraphQL with Apollo Client and automatic code generation
- **Business Logic**: Service layer with authentication and permission handling
- **Data Layer**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth with cookie sessions (`@supabase/ssr`)
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## ⚙️ Quick Start

1. **Clone and install:**

   ```bash
   git clone <this-template-repo>
   cd <project-name>
   npm install
   ```

2. **Set up environment:**

   This template follows the pattern from [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate):
   - **`.env`** files contain non-sensitive, template/example values (committed to git)
   - **`.env.local`** files contain sensitive values (git-ignored, never committed)
   - Sensitive variables like API keys, secrets, and database URLs should always go in `.local` files

   Create a `.env.local` file (git-ignored) with your values:

   ```bash
   # Supabase — Dashboard → Project Settings → API Keys
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

   # Supabase Postgres — Dashboard → Connect
   # Runtime: transaction pooler (port 6543). Migrations and db:pull: direct/session connection (port 5432)
   DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres

   # Optional
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   SUPABASE_SECRET_KEY=sb_secret_...
   RESEND_API_KEY=re_...
   PORTFOLIO_SECRET_TOKEN=your-secret-token
   ```

   **For production**, create `.env.production.local` with production values.

   **For CI/CD**, no secrets are required. Auth and database access are skipped when Supabase is not configured.

3. **Set up database:**

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npm run db:push
   ```

   Migrations are plain SQL in `supabase/migrations`. Create one with `npm run db:new <name>`.
   Drizzle is used for queries only. After changing the schema, run `npm run db:pull` (introspects the database
   into `.drizzle/`) and port the result into `src/models`.

   **Google sign-in:** create an OAuth client in Google Cloud Console (Web application) with the authorized
   redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`, then enable Authentication → Providers → Google
   in Supabase and paste the client ID and secret. Each environment (dev, prod) needs its own setup.

   In the Supabase dashboard, set Authentication → URL Configuration → Redirect URLs to include
   `http://localhost:3000/auth/callback` (and your production URL).

4. **Start development:**
   ```bash
   npm run dev
   ```

## 🔐 Authentication Demo

This template includes a complete authentication demonstration:

- **Public Pages**: Homepage with contact form
- **Protected Pages**: `/profile` (requires authentication)
- **Authentication Flow**:
  - Sign in/up on the `/login` page (email and password)
  - Automatic redirects for protected routes
  - User session management
  - Sign out functionality

Try accessing `/profile` without signing in - you'll be redirected to `/login`.

## 🎨 Theming

Six color variables in `src/styles/global.css`:

- `primary`, `accent`, `background`, `surface`, `text`, `text-muted`

Use as Tailwind classes: `bg-primary`, `text-text`, `bg-surface`, etc.

Colors must be in RGB format (space-separated) for opacity support: `59 130 246`

## 📦 Component Structure

Organized using Atomic Design principles:

```
src/components/
├── atoms/          # Basic building blocks (buttons, inputs, etc.)
├── molecules/      # Simple combinations of atoms (ContactForm, etc.)
├── organisms/      # Complex UI components (SiteHeader, etc.)
└── templates/      # Page-level layouts
```

## 📦 Available Scripts

- `npm run dev` - Start development server with GraphQL codegen watch
- `npm run build` - Build for production
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run lint` - Run ESLint
- `npm run db:new <name>` - Create a new SQL migration
- `npm run db:push` - Apply migrations to the linked Supabase project
- `npm run db:reset` - Reset the local Supabase database (needs Docker)
- `npm run db:pull` - Introspect the database into Drizzle schema files
- `npm run codegen` - Generate GraphQL types
- `npm run codegen:watch` - Watch and regenerate GraphQL types

## ⚡ Realtime

Use `useRealtimeTable` from `@/hooks` to react to Postgres changes in the browser. A table only emits events when it is
in the realtime publication and has an RLS `select` policy for the signed-in user. Add both in a migration:

```sql
alter publication supabase_realtime add table public.messages;

create policy "Users can read their messages" on public.messages
  for select to authenticated using ((select auth.uid()) = author_auth_id);
```

Pair it with Apollo by refetching the matching query on each event:

```ts
useRealtimeTable({ table: 'messages', onChange: () => refetch() })
```

## 🧪 Testing

- **Unit Tests**: Vitest with comprehensive coverage
- **E2E Tests**: Playwright for end-to-end testing
- **Mocking**: Centralized mocks in `tests/mocks/`
- **Test Setup**: Configured for both unit and E2E testing

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Protected routes
│   │   └── profile/       # User profile page
│   ├── (public)/          # Public routes
│   │   └── page.tsx       # Homepage
│   └── api/               # API routes
│       └── graphql/       # GraphQL endpoint
├── components/            # React components (atomic design)
├── graphql/              # GraphQL schema, resolvers, and context
├── services/             # Business logic layer
├── libs/                 # Utility libraries (DB, Logger, etc.)
├── models/               # Database models
├── validations/          # Form validation schemas
└── utils/                # Helper utilities
```

## 🚀 Deployment

This template is ready for deployment on platforms like:

- Vercel (recommended for Next.js)
- Railway
- Render
- DigitalOcean App Platform

Make sure to configure your environment variables in your deployment platform.

---

**Template for modern web applications**

> **Inspired by**: [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) - A comprehensive Next.js starter template
