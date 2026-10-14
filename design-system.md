# Sapori - AI Agent Design System & Coding Guidelines

This document serves as the absolute source of truth for the Sapori app's design system, UI patterns, and domain logic. Always reference these rules before writing layout or styling code.

## 1. Brand & Aesthetic Core

- **Vibe:** Warm, Mediterranean-inspired, inviting, organic, and clean.
- **Domain Terminology:** Always use the term **"reheat"** (never "fork" or "copy") when referring to adapting a recipe.
- **Tone of Voice:** Hospitable, encouraging, and polite. (e.g., Use _"Let's add some fresh ingredients!"_ rather than _"List is empty"_). I want to write from my own tone of voice so just add in placeholders like "<placeholder text for asking to add ingredients here>"

## 2. Layout Architecture

- **Desktop:** Responsive layout with a **left sidebar** for flattened navigation.
- **Mobile/Tablet:** Uses a semi-glassmorphic **bottom navbar** island for grouped navigation. Allow UI to feel native mobile-like, including gestures and layouts, during smaller-than-desktop viewports.
- **Recipe Creation Flow:** Uses sliding drawers/modals. It features smart prep/cook time inputs and an advanced ingredient tagging system allowing partial quantity distribution across steps.

## 3. Typography

We use two main fonts configured in Tailwind v4 (`src/index.css`):

- **Headings (`font-fraunces`):** Use for recipe titles, major headings (`h1`, `h2`), and editorial moments.
- **Body & UI (`font-outfit`):** Use for all body text, buttons, inputs, captions, and general UI.
- **Accents (`font-pacifico`):** Use extremely sparingly for playful, stylistic signatures.

## 4. Color Palette & Usage (Raw Tokens)

Use exact Tailwind variables defined in the `@theme` block. When custom SVGs, canvases, or inline styles require hex codes, map to these exact values:

### Core Brand Colors

- **Offwhite (Canvas):** `#FEFEFD` -> `bg-offwhite`
- **Burgundy (Primary):** `#A84124` -> `bg-burgundy`
- **Olive (Secondary):** `#48734F` -> `bg-olive`
- **Olive Dark:** `#325238` -> `bg-olive-dark`

### Neutral Scale

- `neutral-50`: `#F8F7F6`
- `neutral-100`: `#EFECE9`
- `neutral-200`: `#E0DAD5`
- `neutral-300`: `#C9C1BA`
- `neutral-400`: `#AFA59D`
- `neutral-500`: `#93877F`
- `neutral-600`: `#786C64`
- `neutral-700`: `#5C514B`
- `neutral-800`: `#4A3024` (Tertiary Dark Brown)
- `neutral-900`: `#1B1918` (Near-black for copy)
- `neutral-950`: `#12100F`

### Application Rules

- **Backgrounds:** `bg-offwhite` (Primary app canvas). Cards sit on top using `bg-white` or `bg-neutral-50`.
- **Primary Action:** `bg-burgundy text-white`. Use for primary buttons, active states, and major emphasis.
- **Secondary/Fresh:** `bg-olive` and `bg-olive-dark`. Use for secondary actions, healthy tags, or success states.
- **Text Hierarchy:**
  - `text-neutral-900` / `text-neutral-950`: Primary copy.
  - `text-neutral-800`: Tertiary emphasis (dark brown).
  - `text-neutral-600` / `text-neutral-500`: Muted text (descriptions, timestamps, empty states).
- **Borders:** `border-neutral-200` or `border-neutral-300`.

## 5. UI Components & States

### Interactive States

- **Hover:** Use an opacity shift (`hover:opacity-90`) or slight darkening for buttons.
- **Focus (A11y):** Form elements and buttons must use: `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-olive focus-visible:outline-none`.
- **Disabled:** `opacity-50 cursor-not-allowed pointer-events-none`.

### Shapes & Shadows (The "Soft" UI)

- **Radii:** Favor generous rounding. Use `rounded-2xl` or `rounded-3xl` for main cards and drawers. Use `rounded-xl` or `rounded-full` for buttons, inputs, and tags. Avoid sharp corners.
- **Shadows:**
  - `shadow-sm` for subtle depth on inputs or ingredient tags.
  - `shadow-md` or `shadow-lg` to elevate floating elements (drawers, navbars).

### Glassmorphism (Mobile Nav & Sticky Headers)

When building floating or sticky overlapping elements, use this exact stack:

- `bg-white/80 backdrop-blur-md border border-white/20 shadow-sm`

### Inputs & Forms (Recipe Creation)

Standardized input appearance:

- `bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-olive focus:ring-1 focus:ring-olive outline-none transition-colors`

### Ingredient Tags

Standardized pill/tag appearance:

- `bg-white border border-neutral-200 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm inline-flex items-center gap-1`

## 6. Media & Motion

- **Icons (`lucide-react`):** Default to `w-5 h-5` with `strokeWidth={1.5}` for a refined, elegant look.
- **Images:** Recipe photos must fill their containers nicely: `object-cover rounded-2xl` (unless spanning edge-to-edge on mobile screens).
- **Animation:** Keep it fluid, not rigid. Use `transition-all duration-300 ease-in-out` for hover states. For modals/drawers, use `duration-500`.

## 7. Advanced Domain Logic constraints

- **Ingredient Tagging:** Prevent duplicate ingredients from being added to the main list.
- **Quantity Distribution:** The UI must support splitting/distributing partial quantities of an ingredient across different instruction steps (e.g., half the garlic for the sauce, half for the garnish).
- **State Sync:** Total ingredient quantities must remain strictly editable and perfectly synced with the distributed step amounts.
