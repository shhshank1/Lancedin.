# LancedIn 

> **A premium, high-end marketplace connecting seekers and creative talent, built with a robust backend architecture, secure OAuth session management, and a meticulously styled editorial UI.**

---

## 🚀 Project Overview
**LancedIn** (developed under the design system *The Digital Curator*) is a modern, high-end platform built to connect two distinct user bases: **Seekers (Clients)** who want to discover and recruit top talent, and **Talent (Creators/Freelancers)** looking to showcase their portfolios. 

This project represents a deliberate transition to **production-ready backend engineering**, prioritizing system design, relational database schemas, secure authentication flows, and clean API design.

- **Frontend Live Demo:** `http://localhost:5173` (Local Development)
- **Backend Service:** `http://localhost:3000` (Local API)

---

## 🛠️ The Tech Stack (2026 Standards)

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Core** | Node.js, Express, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM (v7+) with `@prisma/adapter-pg` driver |
| **Authentication** | Passport.js (Google OAuth 2.0 & LinkedIn OpenID OAuth), JWT, Cookie-Parser |
| **Frontend Core** | React 19, Vite, TypeScript |
| **Styling & System** | Tailwind CSS v4, Lucide React, Glassmorphism, Custom HSL Gradients |
| **State & Routing** | React Router DOM, React Context API (`AuthContext`) |

---

## 📐 System Architecture & Key Features

### 1. Relational Database Design & Schema Modeling
Instead of relying on schema-less solutions, this platform models a relational PostgreSQL database using **Prisma ORM** to enforce strict data integrity, cascading deletes, and complex relationships:
*   **User & Role Mapping:** Distinct enum-based roles (`SEEKER` vs `TALENT`) provisioning different permissions and UI dashboards.
*   **Portfolio Architecture:** A `Project` model with a **One-to-Many** relationship to `User`, and a **Many-to-Many** relationship with customizable `Tag` models for granular skill-filtering.
*   **Unified Messaging Engine:** A unique constraint-driven `Conversation` model linking exactly one Seeker and one Talent, containing a chronological relationship to `Message` items with instant delivery status tracking (`isRead` flags).

### 2. Secure, Stateless Authentication Flow
To move away from insecure LocalStorage tokens, the authentication workflow implements:
*   **Dual-Provider OAuth Integration:** Seamless sign-in using Google and LinkedIn APIs via Passport.js strategies.
*   **HTTP-Only Cookies:** Upon successful OAuth callbacks, the server generates a JSON Web Token (JWT) containing the user payload and injects it into a secure, `HttpOnly`, `SameSite: Lax` cookie. This mitigates Cross-Site Scripting (XSS) attacks while keeping sessions stateless and secure.
*   **Auth Bridge Middleware:** An `/api/me` verification endpoint reads the secure cookie to supply authentication state to the frontend `AuthContext` on mount.

### 3. High-End Premium Front-End Design System
The frontend implements an editorial design called **The Digital Curator**:
*   **Editorial Aesthetics:** A curated color palette based on *Electric Violet* (`#7c3aed`), deep surface layering, and smooth 135° gradient accents.
*   **Glassmorphism Layouts:** Subtle, ultra-diffused drop shadows without harsh borders, emphasizing generous whitespace and high-end visual hierarchy.
*   **Modular Component Architecture:** Split into specialized namespaces (`client`, `freelancer`, `messaging`, `layout`, `ui`) to maintain a highly maintainable, scalable React code base.

---

## 💡 Engineering Highlights & Problem-Solving (The "STAR" Moments)

### 🔧 Resolving Prisma 7 & PostgreSQL Driver Adapters
*   **Challenge:** Migrating to Prisma 7 introduced strict requirements for explicit driver adapters when interfacing with Postgres pools.
*   **Action:** Configured a native `pg.Pool` driver adapter using `@prisma/adapter-pg` inside `index.ts` to ensure connections were pooled and recycled reliably.
*   **Result:** Avoided memory leaks and connection drop-outs during high-frequency API calls.

### ⚡ Troubleshooting Local Port Binding Conflicts (`EADDRINUSE`)
*   **Challenge:** The local development server frequently ran into Windows port lock errors during fast code reloads.
*   **Action:** Developed a custom workflow utilizing PowerShell network port querying command lines to trace the offending PID and clean up system ports dynamically.
*   **Result:** Guaranteed uninterrupted local testing of OAuth redirect URIs which rely on fixed port mapping (`localhost:3000`).

### 🌉 Bridging Express Tokens and React State
*   **Challenge:** Syncing secure HTTP-Only cookies with client-side React UI navigation.
*   **Action:** Built a custom React `AuthContext` provider that polls the secure backend token status on page load, automatically initializing navigation routes (`/client` dashboard or `/freelancer` dashboard) based on user roles and login states.

---

## 📈 Future Roadmap
*   [ ] **WebSockets Integration:** Transition the messaging system from REST polling to real-time communication via `Socket.io`.
*   [ ] **Portfolio Media Uploads:** Connect the `Project` media upload routes to AWS S3 or Cloudinary storage.
*   [ ] **Search & Recommendation Engine:** Implement advanced PostgreSQL full-text search to filter projects and creators by tags instantly.

***

### 🎓 Takeaway from this Project
> "Building **LancedIn** allowed me to step out of the frontend comfort zone. Writing Express routers in TypeScript, modeling database migrations with Prisma, and securing user state with HttpOnly OAuth cookies gave me the confidence to design, write, and debug complete, full-stack systems from the ground up."
