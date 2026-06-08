# Project Memory & Developer Journey

## The Developer's Aim
The developer is transitioning from a "vibe coder" to a **solid Backend Developer/Engineer**. The goal is to build a deep understanding of *why* and *how* systems work, prioritizing industry standards, architectural design, and best practices over blind copy-pasting.

---

## Project Context: LancedIn
**Think:** LinkedIn meets Upwork — a freelance talent marketplace.

Two user roles:
1. **SEEKER (Recruiter):** Browses talent, posts job needs, messages freelancers to hire them.
2. **TALENT (Freelancer):** Uploads portfolio projects, browses job postings, messages recruiters.

**Live Local URLs:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

**GitHub Branch:** `feat/onboarding-portfolio-messaging`

---

## ⚡ How to Resume Tomorrow (READ THIS FIRST)

If you're starting a new session, do this:

### Step 1 — Start the servers
Open **two PowerShell terminals** in VS Code:

**Terminal 1 (Backend):**
```powershell
cd d:\new\server
npm run dev
```
You should see: `Server running on http://localhost:3000 - Database Connected & Sockets Enabled!`

**Terminal 2 (Frontend):**
```powershell
cd d:\new
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Step 2 — Check if port 3000 is stuck
If the backend says `EADDRINUSE` (port already in use):
```powershell
Get-NetTCPConnection -LocalPort 3000 | Where-Object State -eq 'Listen' | Select-Object OwningProcess
# Then kill it:
Stop-Process -Id <PID_FROM_ABOVE> -Force
```

### Step 3 — Tell the AI what to continue
Just open a new conversation and say:
> "Hey, we're building LancedIn. Read the Memory.md at `d:\new\Memory.md` and continue from where we left off."

That's it. The AI will pick up exactly where we stopped.

---

## Tooling & Workflows
- **Database GUI:** Prisma Studio (built-in, web-based) for quick edits. TablePlus or DBeaver for advanced desktop needs.
- **API Testing:** VS Code Extensions like Thunder Client or REST Client, or standalone apps like Bruno (moving away from heavy tools like Postman).
- **Local Dev:** Using Prisma's built-in local database runners (`npx prisma dev`) to avoid heavy Docker or local PostgreSQL installations during early development.

---

## Current Completed Work (as of June 8, 2026)

### ✅ Phase 1 — Foundation
- Full Google + LinkedIn OAuth login
- JWT via HTTP-only cookies
- PostgreSQL on Neon (cloud-hosted, already deployed)
- Prisma ORM with full schema

### ✅ Phase 2 — Onboarding & Profiles  
- Role selection (SEEKER vs TALENT) on first login
- Profile setup (bio, title, location, hourlyRate, skills)
- Route protection — unauthenticated users redirected to home
- Role-based routing — SEEKERs go to `/client`, TALENTs go to `/freelancer`

### ✅ Phase 3 — Core Features (Production Gap Filling)
- **Portfolio Projects:** TALENTs can upload projects with title, description, tags, media
- **Real-time Messaging:** WebSockets via Socket.io (replaced 3-second polling)
- **Zod Validation:** All API endpoints validate input and reject bad data
- **File Uploads:** Multer-based upload route (local for now)
- **Professional Git:** Conventional Commits, feature branch pushed to GitHub

### 🔴 Live Data in DB Right Now
| User | Role | Projects | Messages |
|------|------|----------|----------|
| Zoro | TALENT | 3 projects | 2 sent |
| Shashank | SEEKER | 0 (role enforced ✅) | 0 |
| Shashank Shelke 065 | SEEKER | 0 (role enforced ✅) | 3 sent |

---

## 🚧 Current Plan — Phase 4 + 5 (IN PROGRESS)

### Phase 4A — Connect Real Data to Home Pages
**Problem:** Both home pages show hardcoded fake/mock data.

**Tasks:**
- [x] `GET /api/talents` — return all TALENT users from DB (for SEEKER's discover page)
- [x] Wire `ClientHomePage.tsx` to call real API (replace `featuredFreelancers` mock)
- [ ] Wire `FreelancerHomePage.tsx` to call real API for jobs (replace `needsFeed` mock)

### Phase 4B — Job Board Feature
**Tasks:**
- [ ] Add `Job` model to `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev --name add-job-model`
- [ ] `POST /api/jobs` — SEEKER creates a job posting
- [ ] `GET /api/jobs` — anyone can browse job listings
- [ ] `DELETE /api/jobs/:id` — SEEKER deletes their own job
- [ ] New page: `PostJobPage.tsx` at route `/post-job`
- [ ] Register route in `App.tsx`

### Phase 5 — "The Hired Way" Deployment Stack

#### 5A — Cloudflare R2 File Storage (replaces local Multer)
**Why:** Local uploads get wiped on server restarts. R2 is permanent, free, and uses the same AWS S3 SDK.
**Resume line:** "Implemented AWS S3-compatible object storage using `@aws-sdk/client-s3`"
- [ ] Create Cloudflare account (free, no credit card)
- [ ] Create R2 bucket named `lancedin-media`
- [ ] Install `@aws-sdk/client-s3` in server
- [ ] Update `routes/upload.ts` to use S3Client pointed at R2
- [ ] Store returned URL in `Project.mediaUrl` field in DB
- [ ] Add R2 env vars to `.env`

#### 5B — Docker Container
**Why:** Every company runs backend services in Docker. Shows production thinking.
- [ ] Write `server/Dockerfile`
- [ ] Write `server/.dockerignore`
- [ ] Test locally with `docker build` + `docker run`

#### 5C — railway.toml Config File
**Why:** Infrastructure as Code — deployment is reproducible, not click-based.
- [ ] Write `server/railway.toml`

#### 5D — GitHub Actions CI/CD Pipeline
**Why:** The most impressive thing to show a recruiter. Automated test + deploy on every push.
- [ ] Write `.github/workflows/deploy.yml`
- [ ] Steps: checkout → install → tsc type check → deploy to Railway
- [ ] Add Railway API token as GitHub secret

#### 5E — Deploy Backend to Railway
- [ ] Sign up at railway.app with GitHub
- [ ] Connect `d:\new\server` directory
- [ ] Set all env vars in Railway dashboard
- [ ] Get public URL (e.g. `https://lancedin-api.up.railway.app`)
- [ ] Update Google OAuth redirect URI to Railway URL
- [ ] Update LinkedIn OAuth redirect URI to Railway URL

#### 5F — Deploy Frontend to Vercel
- [ ] Sign up at vercel.com with GitHub
- [ ] Import `d:\new` repo root
- [ ] Set `VITE_API_URL` env var = Railway backend URL
- [ ] Deploy → get URL like `lancedin.vercel.app`

#### 5G — End-to-End Live Test
- [ ] Sign in with Google on live Vercel URL
- [ ] Post a job as SEEKER
- [ ] Browse talents as SEEKER
- [ ] Upload project with image as TALENT (should go to R2)
- [ ] Send a message — confirm WebSocket works on Railway

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React + TypeScript + Vite | Port 5173 |
| Styling | Vanilla CSS (custom design tokens) | Dark/light mode |
| Backend | Node.js + Express + TypeScript | Port 3000 |
| Real-time | Socket.io | WebSockets |
| Auth | Passport.js (Google + LinkedIn OAuth) | JWT in HTTP-only cookie |
| Database | PostgreSQL (Neon — cloud) | Already deployed |
| ORM | Prisma 7 with `@prisma/adapter-pg` | |
| Validation | Zod | On all API endpoints |
| File Uploads | AWS S3 SDK → Cloudflare R2 | Free, S3-compatible |
| Container | Docker | For Railway deployment |
| CI/CD | GitHub Actions | Auto deploy on push |
| Backend Host | Railway | Free tier |
| Frontend Host | Vercel | Free tier |

---

## Key File Locations

```
d:\new\                          ← Root (frontend lives here)
├── src/
│   ├── pages/
│   │   ├── ClientHomePage.tsx   ← SEEKER discover page (currently mock data)
│   │   ├── FreelancerHomePage.tsx ← TALENT job board (currently mock data)
│   │   ├── MessagingPage.tsx    ← Real-time chat (WebSockets ✅)
│   │   ├── OnboardingPage.tsx   ← Role + profile setup ✅
│   │   ├── ProfilePage.tsx      ← View/edit profile ✅
│   │   └── PortfolioUploadPage.tsx ← Upload projects ✅
│   ├── context/AuthContext.tsx  ← Global auth state
│   └── App.tsx                  ← Routes
│
d:\new\server\                   ← Backend
├── src/
│   ├── index.ts                 ← Entry point, Socket.io setup
│   ├── routes/
│   │   ├── auth.ts              ← Google + LinkedIn OAuth
│   │   ├── users.ts             ← Profile endpoints
│   │   ├── projects.ts          ← Portfolio CRUD
│   │   ├── messages.ts          ← Conversations + messages
│   │   └── upload.ts            ← File upload (Multer → will become R2)
│   ├── middleware/
│   │   ├── auth.ts              ← requireAuth middleware
│   │   └── validation.ts        ← validateBody(zodSchema) middleware
│   └── lib/prisma.ts            ← Shared Prisma client
├── prisma/
│   └── schema.prisma            ← Database models
└── .env                         ← Secrets (never commit!)
```

---

## Important Patterns to Remember

### Port Issues (Windows)
```powershell
# Find what's on port 3000:
Get-NetTCPConnection -LocalPort 3000 | Where-Object State -eq 'Listen' | Select-Object OwningProcess
# Kill it:
Stop-Process -Id <PID> -Force
```

### Prisma (always run in d:\new\server)
```powershell
npx prisma migrate dev --name <migration-name>  # Schema change
npx prisma generate                              # Regenerate client
npx prisma studio                               # Visual DB editor
```

### Adding a new API route
1. Create/edit file in `server/src/routes/`
2. Add `import` + `app.use()` in `server/src/index.ts`
3. Protect with `requireAuth` middleware if needed
4. Add Zod schema + `validateBody()` middleware

### Conventional Commits (for git)
```
feat: add job posting API
fix: correct CORS origin for production
chore: add railway.toml config
docs: update Memory.md with deployment steps
```

---

## Resume Description (for job applications)

> **LancedIn** — Full-Stack Freelance Marketplace  
> *React · Node.js · TypeScript · PostgreSQL · Socket.io · Docker · GitHub Actions*
>
> Built a production-grade freelance marketplace from scratch with OAuth 2.0 authentication (Google + LinkedIn), real-time messaging via WebSockets, and role-based access control. Implemented AWS S3-compatible object storage using `@aws-sdk/client-s3` pointed at Cloudflare R2 for zero-cost media uploads. Containerized the backend with Docker, set up a GitHub Actions CI/CD pipeline for automated type-checking and deployment to Railway, and deployed the frontend to Vercel.
