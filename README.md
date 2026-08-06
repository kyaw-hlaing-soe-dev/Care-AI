# Aura Health

Act as a Senior UI/UX Designer and Lead Frontend Engineer. Your task is to completely refactor the entire frontend application to deliver an exceptional, ultra-clean user experience featuring Apple’s Liquid Glass (Glassmorphism) visual aesthetic, adhering strictly to all project specification files and matching the exact layout from the provided reference images.

### Step 1: Ingestion & Spec Analysis

* **Read Project Specs:** Thoroughly analyze all specification files, design briefs, system requirements, and routing documentation in the repository before generating code.

* **Image Layout Alignment:** Inspect the provided reference images and duplicate their spatial layout, component structure, padding, and element placement precisely.

### Step 2: Apple Liquid Glass Visual System

* **Glass Card & Container Styling:**

  * Apply active backdrop blur and saturation filters (`backdrop-filter: blur(20px) saturate(180%)`).

  * Utilize semi-transparent dynamic glass backgrounds (`rgba(255, 255, 255, 0.08)` dark mode / `rgba(255, 255, 255, 0.45)` light mode).

  * Render ultra-thin light-refracting borders (`1px solid rgba(255, 255, 255, 0.18)`).

  * Layer soft ambient drop shadows and subtle top specular glare highlights to create tangible depth.

* **Typography & Visual Hierarchy:** Modern, high-legibility sans-serif typography (SF Pro / Inter) with strict WCAG AA contrast compliance across dynamic backgrounds.

### Step 3: Fluid Motion & Interactivity

* **Spring Physics:** Implement smooth Apple-style spring easing (`cubic-bezier(0.16, 1, 0.3, 1)` or Framer Motion springs).

* **Card Interactivity:** Micro-interactions on hover (subtle `translateY(-4px)` lift, intensified glass border reflection, ambient light glow shift).

* **Page Transitions:** Staggered, fluid entrance animations (`opacity` fade + `translateY` slide) for layout components and card grids.

### Step 4: Refactoring Rules

* **Zero Functional Regressions:** Maintain all existing business logic, hooks, state management, routes, and API implementations intact—only replace styling, layout wrappers, and rendering logic.

* **Reusable Glass Primitives:** Abstract recurring glass styles into centralized tokens and flexible UI components (`<GlassCard />`, `<GlassModal />`, `<GlassButton />`, `<GlassInput />`).

### Immediate Action Plan

1. Scan and summarize key rules from the local spec files.

2. Outline the visual structure mapped from the reference images.

3. Begin refactoring starting with: [Insert Page or Component File Name].# UI Specification

**Project:** AI Health Vitals MVP  
**Framework:** React 18 + Vite  
**Routing:** React Router DOM v6  

This spec defines a responsive wellness interface that works cleanly on both desktop and mobile. The visual direction is soft mint, clinical green, and airy neutrals with rounded cards, subtle depth, and clear emergency states.

---

## Routes

| Route | Page Component | Auth Required | Description |
|-------|---------------|---------------|-------------|
| `/` | `LandingPage` | No | Marketing / hero page |
| `/login` | `LoginPage` | No | Google Sign-In |
| `/dashboard` | `Dashboard` | ✅ | Latest analysis view |
| `/add` | `AddVitalPage` | ✅ | Submit new vital signs |
| `/history` | `HistoryPage` | ✅ | Paginated record list |
| `/history/:id` | `VitalDetailPage` | ✅ | Full analysis for one record |

---

## Design System

### Color Tokens

```css
/* client/src/index.css */
:root {
  /* Brand */
  --color-primary:        #16a34a;   /* Green-600 */
  --color-primary-dark:   #15803d;   /* Green-700 */
  --color-primary-light:  #dcfce7;   /* Green-100 */

  /* Accent */
  --color-accent:         #0f766e;   /* Teal-700 */
  --color-accent-light:   #ccfbf1;   /* Teal-100 */

  /* Status — Good */
  --status-good:          #16a34a;   /* Green-600 */
  --status-good-bg:       #dcfce7;   /* Green-100 */
  --status-good-text:     #166534;   /* Green-800 */

  /* Status — Attention Needed */
  --status-warn:          #f59e0b;   /* Amber-500 */
  --status-warn-bg:       #fef3c7;   /* Amber-100 */
  --status-warn-text:     #92400e;   /* Amber-800 */

  /* Status — Urgent */
  --status-urgent:        #ef4444;   /* Red-500 */
  --status-urgent-bg:     #fee2e2;   /* Red-100 */
  --status-urgent-text:   #b91c1c;   /* Red-700 */

  /* Status — Pending */
  --status-pending:       #64748b;   /* Slate-500 */
  --status-pending-bg:    #e2e8f0;   /* Slate-200 */

  /* Backgrounds */
  --bg-page:              #f4fbf7;
  --bg-surface:           #ffffff;
  --bg-card:              #ffffff;
  --bg-card-hover:        #f0fdf4;
  --bg-input:             #f8fffb;

  /* Text */
  --text-primary:         #1f2937;
  --text-secondary:       #4b5563;
  --text-muted:           #6b7280;

  /* Border */
  --border:               #d7eadf;
  --border-focus:         var(--color-primary);

  /* Border radius */
  --radius-sm:            10px;
  --radius-md:            16px;
  --radius-lg:            24px;
  --radius-xl:            32px;
  --radius-full:          9999px;

  /* Shadows */
  --shadow-card:          0 10px 30px rgba(16, 24, 40, 0.08);
  --shadow-glow:          0 0 40px rgba(22, 163, 74, 0.14);

  /* Transitions */
  --transition-fast:      150ms ease;
  --transition-base:      250ms ease;
  --transition-slow:      400ms ease;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(180deg, #f7fcf9 0%, #eefaf3 100%);
  color: var(--text-primary);
}
```

---

## Pages

---

### `LandingPage` — `/`

**Purpose:** First impression. Convert visitor to sign-up.

**Sections:**

1. **Navbar** — Logo left, "Sign In" button right
2. **Hero** — Full-viewport section
   - Headline: *"Know Your Health, Instantly"*
   - Subline: *"Log your vital signs and get AI-powered health insights in seconds."*
   - CTA button: **"Get Started Free"** → `/login`
3. **Feature Cards** — 3-column grid
   - 🔒 *Google Sign-In* — Secure, one-click login
   - 📋 *Log Vitals* — Enter temperature, BP, heart rate, oxygen
   - 🤖 *AI Analysis* — Powered by Google Gemini
4. **Footer** — Disclaimer text

---

### `LoginPage` — `/login`

**Purpose:** Authenticate the user.

**Layout:** Centered card on page

**Elements:**

- App logo / name at top
- One-line tagline
- **"Sign in with Google"** button
  - Calls `signInWithPopup(provider)`
  - On success → redirect to `/dashboard`
  - On error → show inline error message
- Disclaimer below button

---

### `Dashboard` — `/dashboard`

**Purpose:** Show the user's most recent vital analysis.

**Data source:** `GET /api/vitals?limit=1`

**Layout (top to bottom):**

1. **`EmergencyBanner`** — shown only when `emergency === true`
2. **Page Header** — "Your Latest Health Check" + date
3. **`VitalSummaryGrid`** — 4 boxes: Temperature · BP · Heart Rate · Oxygen
4. **`StatusBadge`** — Large centered pill with status label
5. **`SummaryCard`** — AI-generated summary paragraph
6. **`GoodList`** — "✅ What Looks Good"
7. **`ConcernsList`** — "⚠️ Areas to Watch"
8. **`RecommendationsList`** — "💡 Recommendations"
9. **`RecordedAt`** — "Recorded Today at 8:45 PM"
10. **`DisclaimerFooter`** — Always visible
11. **FAB** — "＋ Add New Record" → `/add`

**Empty state (no records yet):**

- Illustration + text: *"No records yet. Start by logging your vitals."*
- CTA button → `/add`

---

### `AddVitalPage` — `/add`

**Purpose:** Collect vital signs from the user and submit to the API.

**Form Fields:**

| Label | Input ID | Type | Placeholder | Step |
|-------|----------|------|-------------|------|
| Temperature (°C) | `input-temperature` | number | `36.5` | 0.1 |
| Systolic (mmHg) | `input-systolic` | number | `120` | 1 |
| Diastolic (mmHg) | `input-diastolic` | number | `80` | 1 |
| Heart Rate (bpm) | `input-heartrate` | number | `72` | 1 |
| Oxygen Saturation (%) | `input-oxygen` | number | `98` | 0.1 |

**Range Hints** (shown below each input — informational, not blocking):

| Field | Normal Range Hint |
|-------|------------------|
| Temperature | Normal: 36.1°C – 37.2°C |
| Systolic | Normal: 90 – 120 mmHg |
| Diastolic | Normal: 60 – 80 mmHg |
| Heart Rate | Normal: 60 – 100 bpm |
| Oxygen | Normal: 95% – 100% |

**Submission States:**

| State | UI Behavior |
|-------|-------------|
| Default | "Analyze My Vitals" button enabled |
| Loading | Button disabled + spinner + "Analyzing with AI…" |
| Success | Redirect to `/dashboard` |
| Error | Toast notification (see error-handling in [api-spec.md](./api-spec.md)) |

---

### `HistoryPage` — `/history`

**Purpose:** Show all past vital records.

**Data source:** `GET /api/vitals?limit=20`

**List Row:**

```
┌──────────────────────────────────────────────┐
│  📅 Aug 5, 2026 · 8:45 PM     🟡 Attention  │
│  Several vital signs are outside normal...   │
└──────────────────────────────────────────────┘
```

Each row is clickable → `/history/:id`

**Pagination:** "Load More" button; fetches with `startAfter` cursor.

**Empty State:** "No records yet." + CTA to `/add`

---

### `VitalDetailPage` — `/history/:id`

**Purpose:** Full analysis view for a historical record.

**Data source:** `GET /api/vitals/:id`

**Layout:** Identical to `Dashboard` analysis section, plus:

- Back button → `/history`
- Record date prominently shown

---

## Components

---

### `StatusBadge`

```tsx
<StatusBadge status="Good" />
<StatusBadge status="Attention Needed" />
<StatusBadge status="Urgent" />
```

| Status | Background | Text Color | Icon |
|--------|-----------|-----------|------|
| Good | `--status-good-bg` | `--status-good-text` | 🟢 |
| Attention Needed | `--status-warn-bg` | `--status-warn-text` | 🟡 |
| Urgent | `--status-urgent-bg` | `--status-urgent-text` | 🔴 |
| Pending | `--status-pending-bg` | `--status-pending` | ⚪ |

---

### `EmergencyBanner`

- **Shown only when** `emergency === true`
- Full-width, fixed at top of page
- Background: `--status-urgent` (solid red)
- Text: `"⚠️ Urgent: One or more readings require immediate attention. Please seek medical care now."`
- **Cannot be dismissed**
- Always renders above all other page content (z-index: 1000)

---

### `VitalSummaryGrid`

Four equal-width cards in a 2×2 grid (stacks to 1 column on mobile):

```
┌──────────────┐  ┌──────────────┐
│  🌡️ Temp     │  │  🩸 BP       │
│  38.6°C      │  │  145 / 95    │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  ❤️ Heart    │  │  💨 Oxygen   │
│  115 bpm     │  │  92%         │
└──────────────┘  └──────────────┘
```

---

### `GoodList`

```
✅ What Looks Good
  • All good items from analysis.good[]
```

Rendered in green. Hidden if `good` array is empty.

---

### `ConcernsList`

```
⚠️ Areas to Watch
  • All concern items from analysis.concerns[]
```

Rendered in yellow/amber. Hidden if `concerns` array is empty.

---

### `RecommendationsList`

```
💡 Recommendations
  • All items from analysis.recommendations[]
```

Rendered in blue/indigo.

---

### `DisclaimerFooter`

Always rendered below any AI analysis content.

```
This AI analysis is for informational purposes only and is not a 
substitute for professional medical advice, diagnosis, or treatment. 
Always consult a qualified healthcare professional for medical concerns.
```

Style: small text, muted color, centered.

---

### `ProtectedRoute`

```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

Behavior:
- If `loading === true` → show fullscreen spinner
- If `user === null` → `<Navigate to="/login" replace />`
- If `user` exists → render children

---

### `LoadingSpinner`

Used during API calls and protected route auth checks.

- Centered on screen or within a container
- Animated CSS spinner (no library dependency)
- Optional label prop: `<LoadingSpinner label="Analyzing with AI…" />`

---

## Auth Context Shape

```tsx
interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string>;
}
```

---

## Responsive Breakpoints

| Breakpoint | Min Width | Layout |
|-----------|----------|--------|
| Mobile | 0px | Single column, stacked |
| Tablet | 640px | 2-column grid for vitals |
| Desktop | 1024px | Sidebar nav optional, wider cards |

---

## Navigation

**Authenticated users** see a navbar / topbar with:

- Dashboard
- Vital Tracker
- Sysmtom Checker
- Chatbot

**Unauthenticated users** see:

- Landing page with Sign In CTA

---

## Animations & Micro-Interactions

| Element | Animation |
|---------|-----------|
| Page transitions | Fade-in (opacity 0→1, 200ms) |
| Status badge | Scale-in on mount (scale 0.8→1) |
| Emergency banner | Slide-down from top |
| History rows | Stagger fade-in (50ms delay each) |
| Submit button loading | Pulse animation on spinner |
| Card hover | Subtle `translateY(-2px)` + box-shadow lift |

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vitals-glass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f6a0525-6ee9-4bb8-9853-b368cbdd09f0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
