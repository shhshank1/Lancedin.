# Project Memory & Developer Journey

## The Developer's Aim
The developer is transitioning from a "vibe coder" to a **solid Backend Developer/Engineer**. The goal is to build a deep understanding of *why* and *how* systems work, prioritizing industry standards, architectural design, and best practices over blind copy-pasting.

## Project Context: TalentFlow
A web application serving two distinct user types:
1. **Seekers:** Users searching for talent to hire/work with. They can scroll, search by tags, and message talent.
2. **Talent/Creators:** Users who post their projects, photos, videos, and tags to be discovered.

### Key Features:
- Modern UI with dynamic animations (2026 aesthetics).
- Google Sign-In Authentication (OAuth 2.0).
- Real-time or localized Messaging System between Seekers and Talent.
- Searchable project/portfolio database.

## Tech Stack (2026 Standards)
- **Frontend:** React, Vite, TailwindCSS (for utility), modern Glassmorphism/Dark Mode UI.
- **Backend:** Node.js, Express, TypeScript.
- **Authentication:** Passport.js (Google OAuth).
- **Database:** PostgreSQL.
- **ORM:** Prisma (for strict typing, migrations, and schema definitions).

## Tooling & Workflows
- **Database GUI:** Prisma Studio (built-in, web-based) for quick edits. TablePlus or DBeaver for advanced desktop needs.
- **API Testing:** VS Code Extensions like Thunder Client or REST Client, or standalone apps like Bruno (moving away from heavy tools like Postman).
- **Local Dev:** Using Prisma's built-in local database runners (`npx prisma dev`) to avoid heavy Docker or local PostgreSQL installations during early development.

## Log of Progress
- **Authentication:** Set up Google Auth route (`/auth/google`). Registered OAuth redirect URIs in Google Cloud Console.
- **Database Design:** Created the initial Prisma schema (`schema.prisma`) defining `User` and `Role` models with relations for the OAuth provider.
- **Session 1 (Backend Deep Dive):** 
  - Overcame Prisma 7 breaking changes by correctly wiring the `@prisma/adapter-pg` driver and managing `.env` configuration correctly.
  - Successfully navigated Windows OS port lock issues (`EADDRINUSE`) by manually terminating processes via PowerShell to maintain the OAuth redirect URI configuration.
  - Resolved `pg` connection drop errors by switching from the experimental `prisma+postgres://` protocol to the standard PostgreSQL raw connection string.
  - **Schema Architecting:** Expanded `schema.prisma` to include `Project`, `Tag`, `Conversation`, and `Message` models. Implemented One-to-Many and Many-to-Many relations, as well as cascading deletes.
  - **Frontend Integration:** Built the `AuthContext` to consume the backend's HTTP-only JWT cookie and dynamically update the `Navbar` component, bridging the gap between Express and React.
  - **Next Steps:** Build modular Express Routers (e.g., `projectRoutes.ts`) to handle API endpoints for creating and fetching portfolios.
