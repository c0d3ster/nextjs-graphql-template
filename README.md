# Next.js GraphQL Template

A minimal, production-ready template for modern web applications built with Next.js, GraphQL, and TypeScript.

> **Inspired by**: [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) - A comprehensive Next.js starter template

## 🎯 What This Template Provides

- **Modern Frontend**: Next.js 15 with App Router, React 19, TypeScript, Tailwind CSS
- **GraphQL API**: Apollo Server with type-graphql for schema-first development
- **Authentication**: Clerk integration for user management
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

- **Frontend**: React components with TypeScript and Tailwind CSS
- **API Layer**: GraphQL with Apollo Client and automatic code generation
- **Business Logic**: Service layer with authentication and permission handling
- **Data Layer**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk for user management and authentication
- **Testing**: Vitest for unit tests, Playwright for E2E tests

**[📋 View Detailed Architecture →](./ARCHITECTURE.md)**

## ⚙️ Quick Start

1. **Clone and install:**

   ```bash
   git clone <this-template-repo>
   cd <project-name>
   npm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env.local
   # Configure your environment variables
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

**[🔧 Full Development Setup →](./DEVELOPMENT.md)**

## 🎨 Component Structure

Organized using Atomic Design principles:

```
src/components/
├── atoms/          # Basic building blocks (buttons, inputs, etc.)
├── molecules/      # Simple combinations of atoms
├── organisms/      # Complex UI components
└── templates/      # Page-level layouts
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open database studio

---

**Template for modern web applications** 🚀
