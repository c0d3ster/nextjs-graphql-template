# Next.js GraphQL Template

A minimal, production-ready template for modern web applications built with Next.js, GraphQL, and TypeScript.

## 🎯 What This Template Provides

- **Modern Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **GraphQL API**: Apollo Server with type-graphql for schema-first development <!-- @module:graphql -->
- **Authentication**: Supabase Auth with email/password and Google sign-in <!-- @module:auth -->
- **Atomic Design**: Organized component structure (atoms, molecules, organisms, templates)
- **Type Safety**: Full TypeScript coverage with automatic GraphQL type generation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Developer Experience**: ESLint, Prettier, automated workflows
- **Database**: Supabase Postgres with Drizzle ORM for queries, Supabase CLI for migrations <!-- @module:database -->
- **Realtime**: Supabase Realtime (Postgres changes, broadcast) <!-- @module:realtime -->
- **Code Quality**: Commitlint, semantic release, dependency checking

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat)
![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat) <!-- @module:database -->
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?logo=graphql&logoColor=white&style=flat) <!-- @module:graphql -->

<!-- #region @module:graphql -->

## 🏗️ Architecture

Clean, layered architecture designed for scalability:

```
FRONTEND (React / Next.js)
──────────────────────────
components/pages/hooks
   │
   ▼
apiClients/ (GraphQL operations)
   - ContactApiClient.ts # @module:email
   - UserApiClient.ts # @module:auth
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
   - ContactResolver.ts # @module:email
   - UserResolver.ts # @module:auth
   │
   ▼
SERVICE LAYER
   - ContactService.ts # @module:email
   - UserService.ts # @module:auth
   - Authentication & permission checking # @module:auth
   │
   ▼
DATABASE / EXTERNAL APIs
   - Drizzle ORM / Supabase Auth / Supabase Postgres
```

### Key Features

- **Frontend**: React components with TypeScript and Tailwind CSS
- **API Layer**: GraphQL with Apollo Client and automatic code generation
- **Business Logic**: Service layer with authentication and permission handling
- **Data Layer**: Supabase Postgres with Drizzle ORM <!-- @module:database -->
- **Authentication**: Supabase Auth with cookie sessions (`@supabase/ssr`) <!-- @module:auth -->
- **Testing**: Vitest for unit tests, Playwright for E2E tests

<!-- #endregion @module:graphql -->

## ⚙️ Quick Start

1. **Clone and install:**

   ```bash
   git clone <this-template-repo>
   cd <project-name>
   npm install
   npm run init -- --features=database,auth,email # @module:init
   ```

   Run `init` once, right after installing, to keep only the features you need. See [Choosing Features](#-choosing-features) for the options. <!-- @module:init -->

2. **Set up environment:**

   This template follows the pattern from [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate):
   - **`.env`** files contain non-sensitive, template/example values (committed to git)
   - **`.env.local`** files contain sensitive values (git-ignored, never committed)
   - Sensitive variables like API keys, secrets, and database URLs should always go in `.local` files

   Create a `.env.local` file (git-ignored) with your values:

   ```bash
   # #region @module:auth
   # Supabase — Dashboard → Project Settings → API Keys
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   # #endregion @module:auth

   # #region @module:database
   # Supabase Postgres — Dashboard → Connect
   # Runtime: transaction pooler (port 6543). Migrations and db:pull: direct/session connection (port 5432)
   DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres
   # #endregion @module:database

   # Optional
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   SUPABASE_SECRET_KEY=sb_secret_... # @module:auth
   RESEND_API_KEY=re_... # @module:email
   PORTFOLIO_SECRET_TOKEN=your-secret-token
   PROJECT_LOGO_KEY=logo.png # @module:file_uploads
   R2_ACCOUNT_ID=... # @module:file_uploads
   R2_ACCESS_KEY_ID=... # @module:file_uploads
   R2_SECRET_ACCESS_KEY=... # @module:file_uploads
   R2_BUCKET_NAME=... # @module:file_uploads
   ```

   **For production**, create `.env.production.local` with production values.

   **For CI/CD**, add `CODECOV_TOKEN` as a repository secret to upload coverage reports (optional).
   No other secrets are needed. Auth and database access are skipped when Supabase is not configured. <!-- @module:auth -->

<!-- #region @module:database -->

3. **Set up database:**

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npm run db:push
   ```

   Migrations are plain SQL in `supabase/migrations`. Create one with `npm run db:new <name>`.
   Drizzle is used for queries only. After changing the schema, run `npm run db:pull` (introspects the database
   into `.drizzle/`) and port the result into `src/models`.

   <!-- #region @module:auth -->

   **Google sign-in:** create an OAuth client in Google Cloud Console (Web application) with the authorized
   redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`, then enable Authentication → Providers → Google
   in Supabase and paste the client ID and secret. Each environment (dev, prod) needs its own setup.

   **Local Google sign-in:** use `http://127.0.0.1:54321/auth/v1/callback` as the redirect URI, then create
   `supabase/.env` (git-ignored) and restart with `npx supabase stop && npx supabase start`:

   ```bash
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<client id>
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<client secret>
   ```

   In the Supabase dashboard, set Authentication → URL Configuration → Redirect URLs to include
   `http://localhost:3000/auth/callback` (and your production URL).
   <!-- #endregion @module:auth -->

<!-- #endregion @module:database -->

4. **Start development:**
   ```bash
   npm run dev
   ```

<!-- #region @module:init -->

## 🧩 Choosing Features

The template ships with every feature switched on. `npm run init` deletes the unused code, dependencies,
scripts, env vars and CI steps, then removes itself.

```bash
npm run init -- --features=database,auth,email
npm run init -- --features=database,auth,email,realtime --variant=supabase
```

| Feature        | Keeps                                                             | Needs      |
| -------------- | ----------------------------------------------------------------- | ---------- |
| `database`     | Drizzle ORM, Postgres connection, migrations                      |            |
| `auth`         | Sign-in, protected routes and user profiles                       | `database` |
| `email`        | Resend, the contact form and its GraphQL mutation                 |            |
| `file_uploads` | Cloudflare R2 (S3) presigned file URLs, such as the homepage logo |            |
| `realtime`     | Live updates to the browser (supabase variant only)               | `auth`     |

- GraphQL (Apollo Server and Client, codegen) is kept automatically whenever `auth` or `email` is.
- Features that are required by another are added for you, and the script says so.
- Other feature names (`seo`, `custom_design`, ...) are ignored.
- `--features=` keeps none, and `--dry-run` previews the changes.

### Variants

`auth` and `database` come in two flavors, chosen with `--variant`:

| Variant      | Auth                                      | Migrations                                     | Notes                                                       |
| ------------ | ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `clerk-neon` | Clerk sessions, user sync by webhook      | Drizzle (`db:generate`, `db:migrate`)          | The default                                                 |
| `supabase`   | Supabase Auth (email/password and Google) | SQL files through the Supabase CLI (`db:push`) | Includes Realtime. Needs `supabase/.env` for Google locally |

Asking for `realtime` selects `supabase` for you; combining it with `--variant=clerk-neon` is an error.
The variant only matters when `auth` or `database` is kept.

### Options

| Flag             | Effect                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| `--features=a,b` | Features to keep. `--features=` keeps none                                         |
| `--variant=name` | `clerk-neon` or `supabase`. Defaults to `clerk-neon`, or `supabase` for `realtime` |
| `--config=file`  | JSON file: `{ "features": ["database", "auth"], "variant": "supabase" }`           |
| `--dry-run`      | Print what would change without touching anything                                  |
| `--skip-install` | Do not refresh `package-lock.json`                                                 |
| `--skip-format`  | Do not run Prettier on changed files                                               |
| `--keep-tooling` | Keep `scripts/init`, `variants` and the feature matrix workflow                    |
| `--strict`       | Fail if a kept file imports a package that was pruned                              |
| `--root=dir`     | Project root (defaults to the current directory)                                   |

Developing the template itself? Add `--keep-tooling`, and read [docs/TEMPLATING.md](docs/TEMPLATING.md)
for how the markers, variants and pruning work.

<!-- #endregion @module:init -->

<!-- #region @module:auth -->

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

<!-- #endregion @module:auth -->

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
├── molecules/      # Simple combinations of atoms (ContactForm, etc.) # @module:email
├── organisms/      # Complex UI components (SiteHeader, etc.)
└── templates/      # Page-level layouts
```

## 📦 Available Scripts

- `npm run dev` - Start development server with GraphQL codegen watch
- `npm run build` - Build for production
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run lint` - Run ESLint
- `npm run db:new <name>` - Create a new SQL migration <!-- @module:database -->
- `npm run db:push` - Apply migrations to the linked Supabase project <!-- @module:database -->
- `npm run db:reset` - Reset the local Supabase database (needs Docker) <!-- @module:database -->
- `npm run db:pull` - Introspect the database into Drizzle schema files <!-- @module:database -->
- `npm run codegen` - Generate GraphQL types <!-- @module:graphql -->
- `npm run codegen:watch` - Watch and regenerate GraphQL types <!-- @module:graphql -->

<!-- #region @module:realtime -->

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

<!-- #endregion @module:realtime -->

## 🧪 Testing

- **Unit Tests**: Vitest with comprehensive coverage
- **E2E Tests**: Playwright for end-to-end testing
- **Mocking**: Centralized mocks in `tests/mocks/` <!-- @module:graphql -->
- **Test Setup**: Configured for both unit and E2E testing

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Protected routes # @module:auth
│   │   └── profile/       # User profile page # @module:auth
│   ├── (public)/          # Public routes
│   │   └── page.tsx       # Homepage
│   └── api/               # API routes # @module:graphql
│       └── graphql/       # GraphQL endpoint # @module:graphql
├── components/            # React components (atomic design)
├── graphql/              # GraphQL schema, resolvers, and context # @module:graphql
├── services/             # Business logic layer # @module:graphql
├── libs/                 # Utility libraries (DB, Logger, etc.)
├── models/               # Database models # @module:database
├── validations/          # Form validation schemas # @module:email
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
