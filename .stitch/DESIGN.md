# Design System: Landing + Login/Signup
**Project ID:** `15420876026959801233`

## 1. Visual Theme & Atmosphere — "The Digital Curator"
High-end editorial strategy treating every screen as a gallery wall. Intentional asymmetry with text-heavy blocks balanced by generous negative space. Tonal layering creates depth through color shifts rather than heavy borders. Professional, premium, and calm.

## 2. Color Palette & Roles
- **Electric Violet** (#630ed4 → #7c3aed gradient) – Primary accent, "spotlight not floodlight"
- **Surface** (#f8f9fa) – Base layer background
- **Surface Container Low** (#f3f4f5) – Primary content blocks
- **Surface Container Lowest** (#ffffff) – Cards and floating modals
- **On Surface** (#191c1d) – Primary text (never pure black)
- **On Surface Variant** (#4a4455) – Body text, reduced contrast
- **Outline Variant** (#ccc3d8) – Ghost borders at 20% opacity max
- **Primary Fixed** (#eaddff) – Skill chip backgrounds
- **On Primary Fixed** (#25005a) – Skill chip text
- **Tertiary** (#7d3d00) – Availability indicators

## 3. Typography Rules
- **Font:** Inter (all: headline, body, label)
- **Display (3.5rem):** `-0.02em` letter-spacing for "tight, custom" feel
- **Headlines (1.75rem):** `line-height: 1.4` for breathing room
- **Body (1rem):** Use `on_surface_variant` (#4a4455) for soft contrast
- **Labels (0.75rem):** ALL-CAPS with `+0.05em` letter-spacing

## 4. Component Stylings
- **Buttons:** Gradient fill Electric Violet (135°), `xl` (1.5rem) roundness
- **Inputs:** `surface_container_highest` bg, no border, 2px ghost focus border
- **Cards:** `surface_container_lowest` on `surface_container_low`, `xl`/`lg` corners, no divider lines
- **Skill Chips:** `primary_fixed` bg, `on_primary_fixed` text, `full` (9999px) rounding
- **Shadows:** Ultra-diffused `0 12px 32px rgba(25, 28, 29, 0.04)`

## 5. Layout Principles
- **No-Line Rule:** NO 1px solid borders for sectioning. Use background color shifts.
- **Asymmetric margins:** (e.g., 8.5rem left, 4rem right) on landing pages
- **Whitespace:** When in doubt, add `spacing-8` (2.75rem) more vertical space
- **Glassmorphism nav:** 80% opacity surface_container_lowest + backdrop-blur: 12px

## 6. Design System Notes for Stitch Generation
**Copy this block into every baton prompt:**

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light (with dark toggle), Soft Minimalist, Editorial
- Background: Warm off-white (#f8f9fa)
- Surface: Container levels for depth (#f3f4f5, #ffffff)
- Primary Accent: Electric Violet gradient (#630ed4 → #7c3aed)
- Text Primary: Near-black (#191c1d), Body: Muted purple-gray (#4a4455)
- Font: Inter, clean and modernist
- Buttons: Gradient CTAs at 135°, xl rounding (1.5rem)
- Cards: No borders, tonal layering, xl corners, ambient shadows
- Layout: Gallery-like with asymmetric margins, generous whitespace
- No harsh shadows, no pure black, no 1px borders — serene and premium
