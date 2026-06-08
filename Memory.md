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
  - **Session 2 (User Onboarding & Profile Setup):** Completed Phase 1 of the product roadmap. Updated the Prisma database schema with profile attributes and many-to-many skills relationships. Integrated dynamic user fetching inside GET `/api/me` and added profile updating inside PUT `/api/users/profile`. Built the frontend OnboardingPage layout, and implemented central route protections and automatic redirects inside AppLayout.
  - **Session 3 (Refactoring, Portfolio API & Persistent Messaging):** Completed Phase 2 and Phase 3 of the product roadmap:
    - **Phase 2 (Refactoring & Portfolio API):** Refactored the backend into modular routers (`routes/auth.ts`, `routes/users.ts`, `routes/projects.ts`, `routes/messages.ts`). Created a shared Prisma client instance to prevent connection leaks. Built a complete PostgreSQL-backed CRUD system for portfolio projects with skill tags, and created the premium glassmorphic `/portfolio/upload` form on the frontend.
    - **Phase 3 (Persistent Messaging):** Implemented database-backed conversations and message history threads between opposite roles (Seekers and Talent). Created the `/api/users/contacts` discovery API. Replaced frontend mock messages with a live message feed, contact selection modal, and a robust 3-second auto-polling loop. Resolved EADDRINUSE port conflicts and verified E2E flow using automated browser subagents.
  - **Next Steps (Future Phases):**
    - **WebSockets Integration:** Transition from short-polling (3s interval) to active WebSocket connections (e.g. Socket.io) for instantaneous, event-driven message updates.
    - **Cloud Media Uploads:** Replace Unsplash/static URLs with secure image/video uploads (e.g. via Cloudinary, AWS S3, or Supabase Storage) on the portfolio upload form.
    - **Search & Recommendation Engine:** Implement advanced seeker searching and filtering for Talent based on skills tags, locations, and hourly rates.

## Product Roadmap (Production-Aligned Flow)
To build LancedIn like a professional engineering team, we execute features in order of their logical dependencies:

### Phase 1: User Onboarding, Profile Setup, and Role Management (Option 3)
*   **Why first?** A user must have a role (`SEEKER` or `TALENT`) and a profile (bio, skills, avatar) before they can upload portfolios or initiate/receive messages.
*   **Backend Tasks:**
    *   Implement `PUT /api/users/profile` to update user details, including `role` and skills (synchronizing tags in PostgreSQL).
*   **Frontend Tasks:**
    *   Create a frontend onboarding screen shown to users right after Google/LinkedIn signup if their profile is incomplete.
    *   Dynamically route users to `/client` (if Seeker) or `/freelancer` (if Talent) based on their role.

### Phase 2: Refactoring & Portfolio API (Option 1)
*   **Why second?** Once users are established as Talent, they need to upload work. Seekers need to browse this work before they decide to message anyone. Refactoring routes early avoids technical debt.
*   **Backend Tasks:**
    *   Refactor `server/src/index.ts` to separate routes (e.g., `routes/auth.ts`, `routes/projects.ts`, `routes/users.ts`).
    *   Create custom `requireAuth` middleware to load the complete user context.
    *   Implement CRUD endpoints for Projects (`POST /api/projects`, `GET /api/projects`, `DELETE /api/projects/:id`).
*   **Frontend Tasks:**
    *   Replace the frontend `/portfolio/upload` placeholder with a functional upload form.

### Phase 3: Persistent Messaging System (Option 2)
*   **Why third?** Messages require both users (Seeker & Talent) to exist in the database.
*   **Backend Tasks:**
    *   Implement messaging API endpoints (`POST /api/conversations`, `GET /api/conversations`, `POST /api/conversations/:id/messages`, `GET /api/conversations/:id/messages`).
    *   Verify sender/recipient permissions on each message.
*   **Frontend Tasks:**
    *   Update the frontend Messaging page to fetch and persist real database threads instead of using mock files.

