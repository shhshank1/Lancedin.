# Project Context: The Digital Curator

## Overview
This is a new Vite React frontend application integrated with a custom design system ("The Digital Curator"). The application serves as a platform bringing together "clients" and "freelancers" with a variety of features including landing pages, dashboards, needs boards, and messaging.

## Tech Stack
- React 19 (Vite)
- TypeScript
- Tailwind CSS v4 with Vite plugin
- React Router DOM
- Lucide React (Icons)
- Class Variance Authority (CVA), Clsx, Tailwind Merge

## Design System
- **Theme:** High-end editorial strategy, intentional asymmetry, tonal layering.
- **Color Palette:**
  - Electric Violet (`#630ed4` to `#7c3aed`) as primary accent.
  - Surface layers: `#f8f9fa`, `#f3f4f5`, `#ffffff`.
  - On-Surface primary text: `#191c1d`, variant: `#4a4455`.
- **Typography:** Inter font for all text.
- **Component Styling:** Glassmorphism, 135° gradients, ultra-diffused drop shadows without harsh 1px borders, generous whitespace.

## Current Application Architecture (`src/App.tsx`)
The application implements a root layout (`AppLayout`) with `Navbar` and `Footer` surrounding a React Router `Routes` main content area.

### Developed Routes
- `/` - Landing Page
- `/client` - Client Home Page
- `/messages` - Messaging Page (Note: Footer is hidden on this page to allow the UI to take up the full view).

### Remaining / Placeholder Routes
- `/freelancer` - Freelancer Home
- `/board` - Needs Board
- `/profile` - Profile page
- `/portfolio/upload` - Portfolio Upload

## Active Environment Context
- The development server has been tested and successfully runs on `http://localhost:5173/`.
