# Next.js GraphQL Template

A minimal, production-ready template for modern web applications built with Next.js, GraphQL, and TypeScript.

<!-- #region @module:init -->
## 🧩 Choosing Features

The template ships with every feature switched on. Run the setup script once, right after cloning, to keep
only what the project needs. It deletes the unused code, dependencies, scripts, env vars and CI steps, then
removes itself.

```bash
npm install
npm run init -- --features=database,auth,email
```

| Feature    | Keeps                                                           | Needs      |
| ---------- | --------------------------------------------------------------- | ---------- |
| `database` | Drizzle ORM, Postgres connection, migrations                    |            |
| `auth`     | Clerk sign-in, protected routes, user profiles and the webhook  | `database` |
| `email`    | Resend, the contact form and its GraphQL mutation               |            |

- GraphQL (Apollo Server and Client, codegen) is kept automatically whenever `auth` or `email` is.
- Features that are required by another are added for you, and the script says so.
- Other feature names (`seo`, `custom_design`, ...) are ignored.
- Use `--features=` to keep none, `--dry-run` to preview, and `--config=features.json` for automation.

Developing the template itself? Add `--keep-tooling` or just skip this step.
<!-- #endregion @module:init -->

## 🎯 What This Template Provides

- **Modern Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **GraphQL API**: Apollo Server with type-graphql for schema-first development <!-- @module:graphql -->
- **Authentication**: Clerk integration with modal-based sign-in/sign-up <!-- @module:auth -->
- **Atomic Design**: Organized component structure (atoms, molecules, organisms, templates)
- **Type Safety**: Full TypeScript coverage with automatic GraphQL type generation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Developer Experience**: ESLint, Prettier, automated workflows
- **Database**: PostgreSQL with Drizzle ORM <!-- @module:database -->
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
   - Drizzle ORM / Clerk / PostgreSQL
```

### Key Features

- **Frontend**: React components with TypeScript and Tailwind CSS
- **API Layer**: GraphQL with Apollo Client and automatic code generation
- **Business Logic**: Service layer with authentication and permission handling
- **Data Layer**: PostgreSQL with Drizzle ORM <!-- @module:database -->
- **Authentication**: Clerk for user management with modal-based auth <!-- @module:auth -->
- **Testing**: Vitest for unit tests, Playwright for E2E tests

<!-- #endregion @module:graphql -->

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
   # #region @module:auth
   # Clerk authentication — https://clerk.com → Dashboard → API Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   # #endregion @module:auth

   # #region @module:database
   # PostgreSQL connection string
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   # #endregion @module:database

   # Optional
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CLERK_WEBHOOK_SECRET=whsec_... # @module:auth
   RESEND_API_KEY=re_... # @module:email
   PORTFOLIO_SECRET_TOKEN=your-secret-token
   ```

   **For production**, create `.env.production.local` with production values.

   <!-- #region @module:auth -->
   **For CI/CD**, the only secret required is:
   - Navigate to: Repository → Settings → Secrets and variables → Actions
   - Add: `CLERK_SECRET_KEY`
   <!-- #endregion @module:auth -->

<!-- #region @module:database -->
3. **Set up database:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

<!-- #endregion @module:database -->

4. **Start development:**
   ```bash
   npm run dev
   ```

<!-- #region @module:auth -->
## 🔐 Authentication Demo

This template includes a complete authentication demonstration:

- **Public Pages**: Homepage with contact form
- **Protected Pages**: `/profile` (requires authentication)
- **Authentication Flow**:
  - Sign in/up via Clerk modals
  - Automatic redirects for protected routes
  - User session management
  - Sign out functionality

Try accessing `/profile` without signing in - you'll be redirected to the sign-in modal.

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
- `npm run db:studio` - Open database studio <!-- @module:database -->
- `npm run codegen` - Generate GraphQL types <!-- @module:graphql -->
- `npm run codegen:watch` - Watch and regenerate GraphQL types <!-- @module:graphql -->

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
