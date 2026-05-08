# Lorenzo Llamas — Portfolio Site Build Plan

> Solo freelance. Web apps & landing pages first, iOS second. Two pages: landing + contact.

---

## 1. The Brief

A two-page portfolio that sells Lorenzo Llamas as a **solo developer who ships landing pages, websites, and web apps fast** — with iOS as a strong secondary capability when clients need it. Clear, confident, motion that earns its place.

**Tone target:** Confident Calm — between warm cookbook and robotic spec sheet.
**Feeling after 5 seconds:** *Capable & Inventive.*

**Two pages. That's it:**
1. **Landing page** — everything on one scroll
2. **Contact page** (`/contact`) — email, calendar link, short form

---

## 2. Scope

### IN
- Landing page (Hero · Story · Work · Capabilities · Packages · FAQ · Contact CTA)
- Contact page (`/contact`)
- 8 projects on the landing page as cards (no individual case study pages)
- **Web-first positioning, iOS as a secondary capability**
- Light + dark mode
- Motion that earns its place
- GitHub Pages → custom domain later

### OUT
- ~~Per-project case study pages~~
- ~~Process section~~
- ~~Horizontal scroll-pin showcase~~ (simple grid instead)
- ~~`/uses` page~~
- ~~Testimonials section~~ (until you have them)
- ~~Signature tier~~ (out of scope for solo focus)

---

## 3. Tone Target — "Confident Calm"

| Dimension | Too warm | **Lorenzo's Target** | Too cold |
|---|---|---|---|
| Color | Cream, terracotta | Off-white / soft charcoal + one accent | Pure black/white |
| Type | Rounded serif | Clean sans + one editorial moment | Mono everywhere |
| Motion | Bouncy springs | Smooth, restrained, eased | Linear or none |
| Voice | "Hey friend" | "Here's what I make. Here's how it works." | "v1.0.3 — 24kb" |

---

## 4. Information Architecture

```
/                   → Hero · Story · Work · Capabilities · Packages · FAQ · Contact CTA
/contact            → Email · Calendar · Short form · Mini-FAQ
```

### Landing page section order
1. **Hero** — One sentence + subtitle. Two CTAs: *See work* / *Start a project*.
2. **Story / About** — Two short paragraphs + a pull quote.
3. **Work** — 8 projects as a simple grid. Featured 3 on top (Dogs & Llamas, Llamas Cookbook, Bite Defense). Each card: screenshot + title + one-line tagline + tech tags + link out.
4. **Capabilities** — Three cards in this order: ***Landing Pages & Websites · Web Apps & MVPs · iOS Apps***. Order matters — it's the sales pitch.
5. **Packages** — Two tiers (Spark / Studio). Modifiers below.
6. **FAQ** — 5–6 honest questions.
7. **Contact CTA** — Big, simple, links to `/contact`.
8. **Footer** — Tiny.

### `/contact` page
- Headline + one sentence
- **Email** (prominent, copyable)
- **Cal.com link** (optional, recommended) — *"Book a 20-min intro"*
- **Short form** (name, email, message). Formspree backend.
- Mini FAQ (3 questions): *"What's your turnaround?"*, *"Do you sign NDAs?"*, *"What if I just have an idea?"*

---

## 5. Story / About — draft

**Background:** frontend developer, financial systems engineer, real estate technology developer, UX researcher.

**Draft:**

> I'm Lorenzo Llamas. I build websites, landing pages, and web apps that solve real problems for real people — and iOS apps when the project calls for one.
>
> Before going solo, I worked across financial systems, real estate technology, and frontend product teams, with UX research underneath all of it. That's why what I ship tends to feel obvious instead of clever.
>
> I move fast when the scope is clear. I bring the design — or build to yours.

**Pull quote** (Fraunces serif, the single editorial moment):
> *"Software is just an answer to a question someone actually had."*

---

## 6. Capabilities Section (the new sales order)

Three cards, in this exact order:

### 1. Landing Pages & Websites *(primary)*
*Marketing sites, product launches, portfolios, brand sites.*
Fast, polished, performant. Built with motion that converts, not motion that distracts. Your design or mine.

### 2. Web Apps & MVPs *(primary)*
*Auth, data, real logic — no fluff.*
Single-purpose tools, internal dashboards, founder MVPs. Built on Next.js + a managed backend (Supabase / Neon / Convex) so you own it and it scales.

### 3. iOS Apps *(secondary)*
*Native iOS when the project calls for it.*
SwiftUI, App Store submission, post-launch support. Best for projects where mobile-native really matters (camera, location, notifications, on-device performance).

---

## 7. Packages & Pricing

**Web-first, solo senior tier. US 2026 rates ($100–$150/hr basis).**

### Tier 1 — Spark
**Starting at $2,500**
*A landing page or single-purpose site. ~1–2 weeks.*
- Marketing site, landing page, or simple web tool (~3–5 sections/screens)
- Your design **or** mine
- 1 round of revisions
- Deployed (Vercel / Cloudflare / GitHub Pages)
- Analytics + basic SEO baked in
- 14-day post-launch bug-fix window

### Tier 2 — Studio *(most projects land here)*
**Starting at $7,500**
*A real web app or MVP. ~3–5 weeks.*
- Web app or MVP with backend, auth, and meaningful state
- **Or** a multi-page marketing site with CMS
- **Or** an iOS app (Spark-equivalent scope)
- UX conversation + wireframes if you don't bring designs
- 2 rounds of revisions
- Deployment, analytics, App Store submission if applicable
- 30-day post-launch support window

### Modifiers
| Modifier | Adjustment |
|---|---|
| **Rush delivery** | +35% |
| **Design provided** (finalized Figma) | −15% |
| **iOS instead of web** (within Studio) | +$1,500 (App Store + native overhead) |
| **Maintenance retainer** | $750/mo, capped 8 hrs |

**Why these numbers (research-grounded, 2026 US market):**
- Senior US solo full-stack rates: $100–$180/hr; landing-page-focused solos cluster at $100–$130/hr
- Spark = ~20–30 hrs (sweet spot for a polished landing page)
- Studio = ~50–80 hrs (sweet spot for a simple MVP or multi-page site)
- Small business sites cluster $3K–$8K with a freelancer in 2026 — Spark sits at the credible low end
- Web MVPs cluster $15K–$40K — Studio sits well below that as the "starting at" anchor; quotes scale up on call
- iOS surcharge reflects the real native-overhead delta from research ($20K–$50K mobile-vs-web premium, scaled down for solo simple-MVP scope)

**Public display strategy:** "Starting at $X" with the full quote on a call. Filters serious leads, leaves scoping room.

---

## 8. Tech Stack

**Next.js (App Router) with `output: 'export'` → static site → GitHub Pages → custom domain via CNAME.**

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (static export) | Two pages, file routing, image handling, future-proof |
| Language | TypeScript | Senior craft signal |
| Styling | Tailwind CSS v4 | Token-driven, fast |
| Motion (90%) | Motion (formerly Framer Motion) | Declarative React motion: hover/tap/focus, AnimatePresence, scroll-driven, springs |
| Cinematic moments | GSAP + ScrollTrigger + SplitText + Observer | Hero text choreography, scrubbed scenes, pinning, character/word splits — all dynamic-imported |
| Smooth scroll | Lenis | Soft-eased scroll with native momentum on touch (~3kb) |
| Page transitions | View Transitions API (native, progressive) | Cross-page fade with AnimatePresence fallback |
| Scroll-linked CSS | CSS `@property` + custom-properties | Color/blur/gradient shifts that scrub with scroll, no JS |
| Icons | Lucide | Clean, single weight |
| Theme | next-themes | Dark/light toggle |
| Form backend | Formspree | Works with static GitHub Pages |
| Fonts | Inter Display + Inter + Fraunces (one moment) + JetBrains Mono | Editorial restraint |

**No jQuery.** React + native CSS + Motion covers everything jQuery used to (DOM diffing, animation, AJAX). jQuery on a senior portfolio in 2026 reads as a junior signal — we ship without it.

---

## 9. Folder Structure

```
Lorenzo-Portfolio/
├── .github/workflows/deploy.yml
├── public/
│   ├── .nojekyll                ← critical: stops Jekyll filtering _next/
│   ├── CNAME                    ← added when custom domain bought
│   ├── og.png
│   ├── favicons/
│   └── projects/                ← screenshots
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← root, fonts, theme provider
│   │   ├── page.tsx             ← landing page sections composed here
│   │   ├── contact/page.tsx     ← contact page
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── sections/            ← Hero, About, Work, Capabilities, Packages, FAQ, ContactCTA
│   │   ├── ui/                  ← Button, Card, Tag
│   │   ├── motion/              ← Reveal, Stagger primitives
│   │   └── nav/
│   ├── content/
│   │   ├── projects.ts          ← typed array, single source of truth
│   │   ├── packages.ts
│   │   ├── faqs.ts
│   │   └── copy.ts              ← all hero/about copy here
│   ├── lib/
│   │   ├── motion.ts            ← shared easings, durations
│   │   └── utils.ts
│   └── styles/
│       └── tokens.css           ← CSS custom properties
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

**Single rule:** all *content* lives in `src/content/`. Adding a project = one entry in `projects.ts`. Page components never get touched for content updates.

---

## 10. Design System — Tokens

Mock both **deep navy** and **ink purple** in Phase 0 and pick. Neutrals shared across both palettes so accent swaps cleanly.

### Light mode neutrals (shared)
```css
--bg            #FAFAF7   /* warm off-white */
--bg-elevated   #FFFFFF
--ink           #141414   /* near-black, never pure */
--ink-soft      #5A5A5A
--ink-quiet     #9A9A95
--line          #E8E6E0   /* warm hairline */
```

### Dark mode neutrals (shared)
```css
--bg            #0F0F0E
--bg-elevated   #18181A
--ink           #F5F4EE
--ink-soft      #B5B4AE
--ink-quiet     #6E6E68
--line          #2A2A28
```

### Option A — Deep Navy
```css
/* Light */
--accent        #1B2A4E
--accent-soft   #E5EAF3
--accent-on     #FFFFFF

/* Dark */
--accent        #6B85C0
--accent-soft   #1F2A45
--accent-on     #0F0F0E
```
*Feel: trustworthy, financial-systems-confident, classic-with-bite. Anchors "capable."*

### Option B — Ink Purple
```css
/* Light */
--accent        #3D2E5C
--accent-soft   #ECE7F2
--accent-on     #FFFFFF

/* Dark */
--accent        #A697C8
--accent-soft   #2A2240
--accent-on     #0F0F0E
```
*Feel: inventive, considered, slightly editorial. Anchors "inventive."*

**Recommendation:** Ink Purple as the primary accent, Deep Navy as a secondary used sparingly (footer, code-tag backgrounds, hairlines). Both adjectives in one palette. See them side-by-side in Phase 0 before locking.

### Typography
- **Display:** Inter Display (headlines, hero, section labels)
- **Body:** Inter
- **Pull-quote moment:** Fraunces (one place — the About quote)
- **Mono (tags, code):** JetBrains Mono

### Motion tokens (no magic numbers)
```css
--ease-out-soft   cubic-bezier(0.22, 0.61, 0.36, 1)
--ease-in-out     cubic-bezier(0.65, 0, 0.35, 1)
--dur-fast        150ms
--dur-base        320ms
--dur-slow        650ms
--dur-cinematic   1100ms
```

### Spacing & radii
- Tailwind defaults
- `--radius-card: 14px` for project cards
- `--radius-pill: 999px` for tags

---

## 11. Animation Plan — Cinematic & Premium

> Premium = restraint + craft, not abundance. Every animation answers: *where am I, what just happened, what's important here?* The bar is "almost cinematic" — scrubbed timing, masked reveals, smooth physics. Never bouncy, never linear.

### 11.1 Libraries — and what we're explicitly not using

This codebase **does not use jQuery** (see §8). The full motion toolkit is:

| Layer | Library | Job |
|---|---|---|
| 90% of UI motion | **Motion** (formerly Framer Motion) | Declarative React motion: hover/tap/focus, layout, AnimatePresence, scroll-driven |
| Cinematic moments | **GSAP** + ScrollTrigger + SplitText + Observer | Hero text choreography, scrubbed scenes, pinning, character splits |
| Smooth scroll | **Lenis** | Soft-eased scroll, native momentum on touch (~3kb) |
| Page transitions | **View Transitions API** (progressive) | Cross-page fade with AnimatePresence fallback |
| Custom timing | **CSS `@property`** + custom-properties | Scroll-linked color/blur/gradient shifts without JS |

GSAP, SplitText, ScrollTrigger, Observer, and Lenis are all **dynamic-imported at first use** to keep initial JS payload tight.

### 11.2 Custom CSS easings (extend §10's tokens)

```css
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back:    cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
--ease-physical:    cubic-bezier(0.22, 1, 0.36, 1);   /* default */
```

Spring presets (Motion):
```ts
soft   = { stiffness: 120, damping: 20 }   // hovers, micro-interactions
snappy = { stiffness: 220, damping: 24 }   // CTAs, modals
heavy  = { stiffness: 80,  damping: 18 }   // cinematic reveals
```

### 11.3 Per-section choreography

#### Hero — the 1.2s opening sequence

| t | Element | Move |
|---|---|---|
| 0ms | Page-load veil | Cross-fade out as fonts settle |
| 200ms | Eyebrow tag | Fade in (200ms, `ease-out-expo`) |
| 240ms | Headline | Word-by-word mask reveal (GSAP SplitText, 60ms stagger, `ease-physical`) |
| 700ms | Subhead | Line-mask reveal (450ms) |
| 900ms | CTAs | Stagger up + scale 0.96→1 (snappy spring) |
| Continuous | Background blob | 30s gradient drift (CSS `@keyframes`) |
| Continuous | Cursor parallax | Soft accent shape lags pointer 60ms (Motion `useSpring`) |
| Optional | Film grain | SVG noise overlay, 3-frame loop, opacity 0.04 |

#### Nav — scroll-aware, magnetic, alive

- **Hide on scroll-down, reveal on scroll-up** (velocity threshold ~50px/s)
- **Glass density scrubs with scroll** — `backdrop-blur` 0→12px over the first 200px
- **Magnetic links** — cursor within 40px attracts the underline indicator (Motion)
- **Active section indicator** — sliding underline that rides between nav items as you scroll through `<section id="…">` blocks (IntersectionObserver-driven, snappy spring)
- **Logo wordmark** — character-spacing tween on hover (subtle, restrained — never animate the word itself)

#### Inter-section transitions

- **Section header reveal** — `clip-path` inset from `inset(0 50% 0 50%)` → `inset(0 0 0 0)` at 30% in viewport (700ms, `ease-out-expo`)
- **Hairline draw** — every other section gets a top hairline that draws across via `stroke-dashoffset` (800ms, on enter)
- **Background tone shift** — `--bg` transitions subtly between adjacent sections (600ms, color-only — no transform)
- **Scroll-velocity blur** — at high scroll velocity, sections gain ~2px blur, settles to 0 on stop (Motion `useScrollVelocity`, gated)

#### Story / About

- Pull-quote uses **text-mask shimmer** that scrubs left-to-right with scroll — `background-clip: text` + scroll-linked CSS `@property --shimmer-x`
- Paragraphs fade-up sequentially when in view (80ms stagger)
- Decorative quote-mark `"` SVG draws in via `stroke-dashoffset`

#### Work grid — pan / zoom / tilt / parallax

This is where the cinematic budget gets spent. Each card is a small scene.

- **Stagger up** on scroll-in, 80ms between
- **Cover parallax** — image translates within frame at 0.92× of card scroll speed
- **Hover 3D tilt** — perspective 1000, max 8° on each axis, mouse-tracked, settles via spring on leave (Motion `useMotionValue` + `useTransform`)
- **Hover scale** — image scales 1.04, soft shadow grows, hairline appears bottom edge
- **Featured covers — Ken Burns** — slow continuous pan/zoom (CSS `@keyframes`, 24s loop, scale 1→1.06 + translate 0→2%)
- **Photo / motion blend** — featured cards can swap static cover → muted-loop video on hover (5s loop, MP4 + WebM, no audio, `preload="metadata"`)
- **External-link icon** — `ArrowUpRight` rotates 45° + translates 2px on hover (200ms `ease-out-expo`)

#### Capabilities

- **SVG icon draw-on** — `stroke-dashoffset` 100→0 as card enters viewport
- **Bottom hairline** — animates 0→100% width on hover (300ms)
- **Card lift** — `translateY -6px` + soft shadow grows (200ms `ease-out-expo`)

#### Packages

- Tier cards stagger up, 100ms between
- Studio (popular) gets a soft accent glow on enter — 200ms after Spark lands, breathes once, settles
- Price text uses CSS `@property --price-counter` to scrub the number in (300ms)
- "Most projects land here" badge — subtle pulse (1.2s, scale 1→1.02→1, infinite, paused on reduced-motion)
- Modifier rows fade in sequentially as the table scrolls into view

#### FAQ

- `<details>` open: smooth height transition via Motion's AnimatePresence (auto-height with measured fallback)
- Plus icon rotates 45°→x on open (200ms `ease-out-expo`)
- First question pulses once on initial scroll-in to cue interactivity (then never again)

#### Contact CTA

- Section background — slow gradient drift (12s `@keyframes`, very subtle)
- Headline — word-by-word reveal on enter
- Email button — hover triggers a tiny "tap" feedback (scale 1→0.98→1, 120ms)

#### Contact page

- **Page enter** — cross-fade from `/` with 80ms upward slide (View Transitions API where supported, AnimatePresence fallback)
- **Form input focus** — border-color tween + ring scale 0.96→1 (180ms)
- **Submit success** — SVG checkmark draws in via `stroke-dashoffset`, then card scales out

### 11.4 Photo / motion blends

- **Hero option** — subtle video background at low opacity, MP4 + WebM with poster fallback. Off by default; one toggle in `copy.ts` flips it on.
- **Featured covers** — static PNG by default; if a `coverVideo` field is set on a project, hover swaps to muted loop.
- **About ambient field** — optional low-density particle drift (Canvas, 60 particles, 0.4 opacity). Behind a feature flag; off until we measure perf cost on mid-tier mobile.

### 11.5 Scrubbed scroll scenes (GSAP ScrollTrigger)

- **Hero → About** — eyebrow + headline scrub up + fade as you scroll past; accent blob parallaxes opposite direction
- **About → Work** — pull-quote scales subtly (0.96→1.04→1) as it crosses center, rebuilding focus on the next section
- **Work → Capabilities** — top hairline draws across as you cross the boundary
- **End of page** — Footer fades up from below the contact CTA (parallax effect, 0.85× scroll speed)

### 11.6 Smooth scroll (Lenis)

- `lerp: 0.1`, `wheelMultiplier: 1`
- Disabled on touch devices (native momentum is better)
- Disabled entirely on `prefers-reduced-motion: reduce`
- Programmatic anchor scroll (`/#work`) uses `Lenis.scrollTo` with `ease-in-out-expo`, 900ms

### 11.7 Modals (when added)

- Backdrop — fade + blur to 8px (200ms)
- Panel — `translateY(12px) scale(0.97)` → settled, snappy spring
- Focus trap, Escape closes, click-outside closes
- Body scroll lock via `Lenis.stop()`
- Content gets a 60ms enter delay so the panel is in place before its contents reveal

### 11.8 Custom cursor (pointer-fine only)

- Small ring (8px) that morphs to a larger ring (32px) on links, buttons, and project covers
- Lags pointer by ~80ms via Motion `useSpring`
- Hidden on touch, reduced-motion, during text selection, and inside form inputs

### 11.9 Performance budget (non-negotiable)

| Metric | Phase 0 measured | Phase 2 budget |
|---|---|---|
| First Load JS (root) | 106 kB | ≤ 140 kB |
| LCP (4G mid-tier mobile) | — | < 2.0s |
| CLS | — | < 0.05 |
| FPS during animation | — | ≥ 55 (target 60) |
| Lighthouse Performance (mobile) | — | ≥ 95 |

Levers:
- GSAP, SplitText, ScrollTrigger, Observer, Lenis are **dynamic-imported** at first use
- Cursor follower mounts only when `(pointer: fine)` matches AND reduced-motion is off
- All scroll animations use `transform` + `opacity` only — never `width`/`height`/`top`/`left`
- `will-change: transform` set on enter, removed on settle
- Video blends: `<video preload="metadata">`, swap on hover only, lazy-mounted

### 11.10 Reduced motion (`prefers-reduced-motion: reduce`)

**Disabled entirely**: scroll-scrubbed animations, parallax, Ken Burns, cursor follower, Lenis, gradient drifts, pulse loops, video blends, magnetic links, SplitText character reveals, 3D tilt.

**Kept (instant or simple fade)**: color transitions, focus rings, `<details>` open/close (instant), cross-page transition (instant fade only), CTA hover state.

This is wired one place: a `usePrefersReducedMotion()` hook + a single CSS media query block. No per-component opt-in.

### 11.11 Motion primitives (what to build in Phase 2)

In `src/components/motion/`:

| Primitive | Purpose |
|---|---|
| `<Reveal>` | Fade-up + clip-path mask on in-view; configurable delay |
| `<Stagger>` | Auto-staggers children with configurable step |
| `<SplitTextReveal>` | GSAP SplitText word/char reveal; falls back to `<Reveal>` on reduced-motion |
| `<ParallaxImage>` | Image with scroll-linked transform |
| `<Tilt>` | 3D mouse-tracked tilt; gated to pointer-fine |
| `<MagneticLink>` | Cursor magnet within 40px |
| `<ScrollProgress>` | Top-of-viewport read-progress bar |
| `<ActiveSectionIndicator>` | Sliding nav underline tied to current section |
| `<CursorFollower>` | Custom cursor (root-level, pointer-fine + non-touch) |
| `<SmoothScroll>` | Lenis wrapper (root-level) |
| `<PageTransition>` | View Transitions API + AnimatePresence fallback |
| `usePrefersReducedMotion` | Single source of truth for reduced-motion gating |

### 11.12 Risks & tradeoffs

- **GSAP plugins add ~25kb gzipped** — within budget if dynamic-imported on hero only
- **Lenis fights native anchor scroll** — wire programmatic `Lenis.scrollTo` for every `/#anchor` link
- **3D tilt hurts low-end GPUs** — gated to pointer-fine + non-touch + a "high-motion" preference
- **Custom cursor shipped badly = jank** — ship only after device-testing; if it's not native-feeling, remove
- **Cinematic surface = bug surface** — Phase 3 includes a real-device audit checkpoint (mid-tier Android, iPhone SE-class iOS)
- **Awwwards-style sites can feel try-hard** — restraint is the play. Cut animations that don't earn their place during Phase 3 polish.

---

## 12. Project Showcase

**Type definition for `projects.ts`:**
```ts
type Project = {
  slug: string;
  title: string;
  tagline: string;          // one sentence
  stack: string[];          // 3–5 tags
  cover: string;            // hero image
  link?: string;            // live URL or App Store
  year: number;
  featured: boolean;        // top-3 in the grid
  category: 'web' | 'mobile' | 'game';
};
```

### The 8 projects

| Project | Category | Featured? | Status |
|---|---|---|---|
| Dogs & Llamas | mobile | ⭐ | Screenshots needed |
| Llamas Cookbook | mobile | ⭐ | Screenshots needed |
| Bite Defense | game | ⭐ | Screenshots needed |
| SleepyLlamas | mobile | — | Screenshots needed |
| Tranquil | mobile/web | — | Screenshots needed |
| Condensed Reviews | web | — | Screenshots needed |
| Flight Searcher | web | — | Screenshots needed |
| Train Watcher | web | — | Screenshots needed |

### Per project needed
- 📸 **One hero screenshot** (1600×1000 or device-mockup-framed)
- 📝 **One-sentence tagline** (rough draft fine)
- 🏷️ **3–5 tech tags**
- 📅 **Year**
- 🔗 **Live link / App Store / GitHub**

Phase 1 can ship with placeholder gradients where screenshots are missing.

---

## 13. FAQ — draft

1. **What's your turnaround?** *Spark in ~1–2 weeks. Studio in ~3–5 weeks. Rush delivery available at +35%.*
2. **Do you do design too?** *Yes. UX/UI is built into Studio pricing. If you bring finalized Figma, that's −15%.*
3. **What stack do you use?** *Next.js + TypeScript + Tailwind for web. SwiftUI for iOS. Supabase / Neon / Convex for backends. Vercel or Cloudflare for hosting.*
4. **Do you sign NDAs?** *Yes, mutual NDA before any scoping call.*
5. **What if I just have an idea, not a spec?** *Most clients start there. The first call is free and we'll figure out scope together.*
6. **What's not in scope?** *Marketing, paid ads, content writing beyond UX copy, ongoing product management. I can recommend people for those.*

---

## 14. Performance Budget (non-negotiable)

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 95 mobile |
| LCP | < 2.0s on 4G |
| CLS | < 0.05 |
| Initial JS bundle | < 100kb gzipped |
| Hero image | < 60kb, AVIF/WebP, dimensions explicit |
| GSAP | Dynamic import, hero only |
| Fonts | Subsetted, `font-display: swap`, max 2 families |

---

## 15. SEO & Social

- Per-section meta tags
- OG image (1200×630), branded
- Schema.org `Person` + `WebSite` JSON-LD
- Sitemap + robots.txt
- Custom 404

---

## 16. Deployment Plan

### Phase 1 — GitHub Pages
1. Repo: **`Lorenzo-Portfolio`** (lives at `<username>.github.io/Lorenzo-Portfolio`)
2. `next.config.ts`:
   ```ts
   const nextConfig: NextConfig = {
     output: 'export',
     basePath: '/Lorenzo-Portfolio',
     images: { unoptimized: true },
   };
   ```
3. `public/.nojekyll` — empty file. **Critical** — without it, GitHub strips `_next/`.
4. `.github/workflows/deploy.yml` — GitHub Actions: build on push to `main`, deploy `out/` to Pages.
5. Settings → Pages → Source: **GitHub Actions**
6. Live at `https://<username>.github.io/Lorenzo-Portfolio`

### Phase 2 — Custom domain
1. Buy domain (Cloudflare Registrar = cheapest + best DNS)
2. Add `public/CNAME` containing your domain
3. DNS: A records to GitHub's 4 IPs (`185.199.108.153`, `109`, `110`, `111`) **or** CNAME `www` → `<username>.github.io`
4. GitHub Pages → enable HTTPS (free, auto, ~24hr propagation)
5. **Remove** `basePath` from `next.config.ts`
6. Done

### Phase 3 — Forms & analytics
- **Formspree** for the contact form (free tier, works with GitHub Pages)
- **Plausible** or **Cloudflare Web Analytics** (privacy-friendly, lightweight)

---

## 17. Build Phases

**Phase 0 — Foundation (Day 1)**
- Next.js + TS + Tailwind scaffold, two routes (`/`, `/contact`)
- Design tokens locked (both palettes mocked)
- Empty section components, placeholder copy
- GitHub Actions deploying
- ✅ *Live skeleton with name*

**Phase 1 — Content & layout (Days 2–3)**
- Real copy, real screenshots (or placeholders), real project entries
- All sections styled, **no scroll choreography yet**
- Mobile responsive
- Contact page with Formspree wired
- ✅ *Complete static portfolio that works*

**Phase 2 — Motion (Days 4–7)** *(scope expanded — see §11 cinematic plan)*
- Motion primitives in `src/components/motion/` (full set per §11.11)
- `usePrefersReducedMotion` + reduced-motion CSS block (gating layer first, before any animation)
- Hero choreography (SplitText word reveal, parallax blob, cursor-follow accent shape)
- Smooth-scroll layer (Lenis) with reduced-motion + touch bypass
- Scroll-aware nav (hide/reveal, glass-density scrub, magnetic links, active section indicator)
- Inter-section reveals + scrubbed scenes (clip-path masks, hairline draws, subtle bg-tone shifts)
- Work grid: cover parallax, 3D tilt, Ken Burns on featured, photo/motion blends
- Capabilities icon draw-on, Packages stagger + popular glow, FAQ height tween
- Page transitions (View Transitions API + AnimatePresence fallback)
- Custom cursor (pointer-fine + non-touch only)
- Real-device audit pass on mid-tier Android + iPhone SE-class iOS
- ✅ *Cinematic version — premium, restrained, performant*

**Phase 3 — Polish (Day 8)**
- Lighthouse 95+ pass (mobile, throttled)
- Reduced-motion audit (toggle via OS settings, walk every section)
- OG image (1200×630), social preview check
- Final copy edit
- Cut animations that don't earn their place
- ✅ *1.0*

**Phase 4 — Custom domain & analytics (when ready)**

**Total: ~8 working days for 1.0** (was 6 — cinematic Phase 2 adds 2 days).

---

## 18. Decisions Locked In ✅

- **Repo name:** `Lorenzo-Portfolio`
- **Name:** Lorenzo Llamas
- **Pages:** Landing + `/contact` (two pages, no case studies)
- **Capability priority:** 1. Landing pages & websites · 2. Web apps & MVPs · 3. iOS apps
- **Theme:** Both light & dark
- **Accent palettes:** Deep Navy + Ink Purple (mock both, recommend Ink Purple primary + Navy secondary)
- **Feeling:** Capable & Inventive
- **Featured 3:** Dogs & Llamas, Llamas Cookbook, Bite Defense
- **Pricing:** "Starting at $X" public, full quote on call
- **Tiers:** Spark $2,500 / Studio $7,500
- **Modifiers:** +35% rush, −15% design provided, +$1,500 iOS surcharge in Studio
- **Contact:** mock email (placeholder until real one provided)

---

## 19. Still Open

- **Real contact email** to swap in
- **Cal.com link?** — recommended next to email
- **Domain you're eyeing**
- **Screenshots** — start with placeholders, fill in as you go
- **Project taglines** — draft from earlier descriptions, you approve

---

## 20. Next Action for Claude Code

When ready to start **Phase 0**, hand this file to Claude Code with the following instruction:

> *"Read Lorenzo-Portfolio.md and execute Phase 0 (Foundation). Scaffold the Next.js + TypeScript + Tailwind project at the structure specified in section 9, set up GitHub Actions deploy workflow per section 16, lock both color palettes from section 10 as CSS custom properties, and create empty section components with placeholder copy from sections 4 and 5. Do not start motion work — that's Phase 2."*

Then Phase 1, Phase 2, Phase 3 each in their own session.

Items still needed before Phase 1:
1. Real contact email
2. Any screenshots ready (Phase 1 can use placeholders)
3. A 1-line tagline for each of the 8 projects (rough drafts fine)
