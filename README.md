# Next.js GraphQL Template

A minimal, production-ready template for modern web applications built with Next.js, GraphQL, and TypeScript.

## 🎯 What This Template Provides

- **Modern Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **GraphQL API**: Apollo Server with type-graphql for schema-first development
- **Authentication**: Clerk integration with modal-based sign-in/sign-up
- **Atomic Design**: Organized component structure (atoms, molecules, organisms, templates)
- **Type Safety**: Full TypeScript coverage with automatic GraphQL type generation
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Developer Experience**: ESLint, Prettier, automated workflows
- **Database**: PostgreSQL with Drizzle ORM
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
   - Drizzle ORM / Clerk / PostgreSQL
```

### Key Features

- **Frontend**: React components with TypeScript and Tailwind CSS
- **API Layer**: GraphQL with Apollo Client and automatic code generation
- **Business Logic**: Service layer with authentication and permission handling
- **Data Layer**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk for user management with modal-based auth
- **Testing**: Vitest for unit tests, Playwright for E2E tests

## ⚙️ Quick Start

1. **Clone and install:**

   ```bash
   git clone <this-template-repo>
   cd <project-name>
   npm install
   ```

2. **Set up environment:**

   **Development:**

   ```bash
   cp .env .env.local
   # Edit .env.local with your development values
   ```

   **Production:**

   ```bash
   cp .env.production .env.production.local
   # Edit .env.production.local with your production values
   ```

   Required environment variables:

   ```bash
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname

   # Clerk Authentication
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   Optional environment variables:

   ```bash
   # Clerk Webhooks (if using webhooks)
   CLERK_WEBHOOK_SECRET=whsec_...

   # Portfolio Site Integration (for theme updates)
   PORTFOLIO_SECRET_TOKEN=your-secret-token

   # Email (Resend - for contact form)
   RESEND_API_KEY=re_...
   ```

3. **Set up database:**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

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

## 🎨 Theming System

This template includes a powerful, runtime-configurable theming system using Tailwind CSS v4 and CSS variables.

### Color Customization

The template supports five semantic color variables:

- `primary` - Main brand color (buttons, links, highlights)
- `secondary` - Secondary brand color (accents, backgrounds)
- `accent` - Accent color (call-to-actions, highlights)
- `background` - Main background color
- `surface` - Card/section backgrounds

### Usage in Components

Use clean Tailwind syntax - CSS variables work behind the scenes:

```tsx
<button className="bg-primary hover:bg-primary/80 text-white">
  Primary Button
</button>

<div className="bg-surface text-accent border-primary/50">
  Themed Card
</div>
```

### Changing Theme Colors

#### Option 1: Template Configuration (Initial Setup)

Edit `src/styles/global.css`:

```css
:root {
  --color-primary: 59 130 246; /* RGB: blue-500 */
  --color-secondary: 139 92 246; /* RGB: violet-500 */
  --color-accent: 16 185 129; /* RGB: emerald-500 */
  --color-background: 17 24 39; /* RGB: gray-900 */
  --color-surface: 31 41 55; /* RGB: gray-800 */
}
```

**Note**: Colors must be in RGB format (space-separated, no `rgb()` wrapper) for opacity support.

#### Option 2: Runtime API (Dynamic Theming)

Use the GraphQL `updateTheme` mutation to change colors at runtime. **Requires authentication** via the `PORTFOLIO_SECRET_TOKEN` environment variable.

**Setup:**

```bash
# In your .env.local file
PORTFOLIO_SECRET_TOKEN=your-secret-token-here
```

**From your portfolio site:**

```typescript
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

// Create client for the client site
const client = new ApolloClient({
  uri: 'https://client-site.com/api/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-portfolio-token': process.env.CLIENT_SITE_SECRET_TOKEN, // Must match client's PORTFOLIO_SECRET_TOKEN
  },
})

// Update theme colors
const UPDATE_THEME = gql`
  mutation UpdateTheme($colors: ThemeColorsInput!) {
    updateTheme(colors: $colors) {
      colors {
        primary
        secondary
        accent
        background
        surface
      }
      css
    }
  }
`

const { data } = await client.mutate({
  mutation: UPDATE_THEME,
  variables: {
    colors: {
      primary: '239 68 68', // red-500
      accent: '34 197 94', // green-500
    },
  },
})

// Use data.updateTheme.css to inject or trigger rebuild
```

**Security Notes:**

- The `updateTheme` mutation requires the `x-portfolio-token` header
- If `PORTFOLIO_SECRET_TOKEN` is not set, theme updates are allowed (development mode)
- Store the token securely in your portfolio site's environment variables

#### Option 3: Portfolio Site Integration

For projects managed via a portfolio site:

1. Portfolio site calls GraphQL `updateTheme` mutation with new colors
2. Changes are committed to the repository
3. Site rebuilds automatically with new theme
4. Or use CSS injection for instant preview

### Converting Hex to RGB

Tailwind uses RGB format for opacity support. Convert hex colors:

```javascript
// Hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${Number.parseInt(result[1], 16)} ${Number.parseInt(result[2], 16)} ${Number.parseInt(result[3], 16)}`
    : null
}

hexToRgb('#3B82F6') // Returns: "59 130 246"
```

### Benefits

- ✅ **Clean syntax**: Use `bg-primary` instead of complex CSS var syntax
- ✅ **Opacity support**: Works with Tailwind's opacity modifiers (`bg-primary/50`)
- ✅ **Runtime changes**: Update colors without rebuilding (via CSS injection)
- ✅ **Type-safe**: Full Tailwind IntelliSense support
- ✅ **All Tailwind features**: Hover, focus, responsive, etc.

## 🎨 Component Structure

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
- `npm run db:studio` - Open database studio
- `npm run codegen` - Generate GraphQL types
- `npm run codegen:watch` - Watch and regenerate GraphQL types

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

**Template for modern web applications** 🚀

> **Inspired by**: [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) - A comprehensive Next.js starter template
