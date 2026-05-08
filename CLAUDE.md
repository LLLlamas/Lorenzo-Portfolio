# CLAUDE.md — Lorenzo Portfolio

Agent-readable project brief. Keeps the critical facts agents need to navigate this codebase without spelunking. Long-form spec lives in [Lorenzo-Portfolio.md](Lorenzo-Portfolio.md).

## What this is

Two-page solo-freelance portfolio for **Lorenzo Llamas**.
- Focus: landing pages, websites, single-purpose web tools (web-first, iOS secondary).
- Goal: convert serious leads via the contact page.
- Tone: confident calm, cinematic, premium. Geometry-coded — rotating SVG outlines in nav, floating tetrahedron in hero, custom cursor on desktop.

**Live:** <https://llllamas.github.io/Lorenzo-Portfolio/>
**Repo:** <https://github.com/LLLlamas/Lorenzo-Portfolio>

## Stack (current)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | `output: 'export'` — fully static, no server runtime |
| Language | TypeScript (strict) | `@/*` path alias → `src/*` |
| Styling | Tailwind v4 (CSS-first) | **No `tailwind.config.ts`** — tokens live in `globals.css` `@theme {}` |
| Theme | next-themes | Class-based on `<html>`, `dark` variant via `@custom-variant`. **`defaultTheme: 'dark'`, `enableSystem: false`** |
| Fonts | DM Sans (sans + display) · Fraunces (serif) · Share Tech Mono (mono) | Loaded in `layout.tsx`. DM Sans loaded with weights `400/500/600/700/800` so the project-card hover cascade can step through them |
| Motion | Motion 12 + GSAP 3.15 + Lenis 1.3 | All free; GSAP plugins all free post-May 2025 |
| 3D | three.js (raw, no r3f/drei) | Dynamic-imported in `FloatingGeometry.tsx` — not in First Load JS |
| Icons | lucide-react | |
| Forms | Formspree (`f/xvzlwoee`) | Wired in `src/app/contact/page.tsx` |
| Hosting | GitHub Pages via Actions | Workflow: `.github/workflows/deploy.yml` |

**No jQuery.** Don't add it. Don't suggest it.

## Routes

- `/` — landing (Hero · About · Work · Capabilities · Packages · FAQ · ContactCTA)
- `/contact` — email · calendar · short form · mini-FAQ
- `/_not-found` — 404

## Where things live

```
src/
├── app/
│   ├── layout.tsx           ← root: fonts, ThemeProvider (dark default), SmoothScroll, ScrollProgress, CustomCursor, EntrySequence, Header, Footer
│   ├── page.tsx             ← composes the 7 landing sections
│   ├── contact/page.tsx     ← contact form + cards + mini-FAQ
│   ├── globals.css          ← Tailwind v4 @theme + tokens + cinematic CSS layer + reduced-motion gate
│   └── not-found.tsx
├── components/
│   ├── sections/            ← Hero, About, Work, Capabilities, Packages, FAQ, ContactCTA, ProjectModal
│   ├── ui/                  ← Button, Card, Tag, SectionHeader, PhoneFrame
│   ├── motion/              ← Reveal, Stagger, SplitTextReveal, ScrollProgress, SmoothScroll,
│   │                          EntrySequence, FloatingGeometry, CustomCursor, ScanLine, Modal
│   ├── nav/                 ← Header (3D hex-prism brand + 3D cube nav links), Footer (large mailto), ThemeToggle (tetrahedron icon)
│   └── theme/               ← ThemeProvider (next-themes wrapper)
├── content/                 ← *** SINGLE SOURCE OF TRUTH for all copy/data ***
│   ├── copy.ts              ← hero/about/capabilities/CTA/contact copy + meta
│   ├── projects.ts          ← typed Project[]; one entry per card
│   ├── packages.ts          ← Spark / Studio tiers + modifiers
│   └── faqs.ts              ← landing FAQ + contact mini-FAQ
└── lib/
    ├── utils.ts             ← cn() class-merge, withBasePath()
    ├── motion.ts            ← shared easing / duration / stagger constants
    └── use-prefers-reduced-motion.ts ← reduced-motion gating hook
```

## The single rule

**All copy lives in `src/content/`.** Section components consume; never hard-code copy in JSX.

| Want to change | Edit |
|---|---|
| Hero headline / subhead | `src/content/copy.ts` → `copy.hero` |
| About paragraphs / pull-quote | `src/content/copy.ts` → `copy.about` |
| About portrait | Drop a real photo at `/public/about/portrait.{webp,jpg}` and replace `<AboutPlaceholder />` in `About.tsx` with `<Image>`. Layout uses 4:5 aspect — no reflow on swap |
| Capability cards | `src/content/copy.ts` → `copy.capabilities.items` |
| A project card | `src/content/projects.ts` (one entry). Cover lives at `public/projects/<slug>.webp`; omit the `cover` field for projects without a screenshot — card falls back to a category-tinted gradient. Card click opens a modal showing `description`, `highlights`, `role`, `gallery`, and `link`. The "rest" grid auto-detects trailing gaps and renders a `WorkGapFiller` (LOADING placeholder) to fill them |
| Add / replace a project screenshot | Drop the source file into `screenshots/<anything>.PNG`, add a `[filename, outputName]` row to `MAPPINGS` in `scripts/resize-screenshots.mjs` (use `<slug>` for the cover, `<slug>-1`, `<slug>-2`, … for gallery shots), then run `npm run resize-screenshots`. Outputs optimized webp to `public/projects/`. The `screenshots/` directory is gitignored — only the optimized webp is committed |
| A modal anywhere | `src/components/motion/Modal.tsx` is the generic primitive — backdrop fade + spring panel, slides up on mobile, ESC / click-outside / X close, body scroll lock, focus trap, **pauses Lenis + sets `data-lenis-prevent` so wheel scrolls the panel not the page**. Compose project-specific content inside it (see `src/components/sections/ProjectModal.tsx`) |
| A price | `src/content/packages.ts` |
| An FAQ | `src/content/faqs.ts` |
| Contact email / Cal.com link | `src/content/copy.ts` → `copy.meta` |
| Nav links (Work / Capabilities / Packages / FAQ) | `navLinks` array in `src/components/nav/Header.tsx`. Each becomes a `<NavCube>` — a true CSS 3D cube (6 faces) that flips on hover via `rotateY`. There is **no active-section indicator**; nav links don't change appearance based on scroll position |

## Motion conventions

- All motion primitives are `'use client'` and gate on `useReducedMotion()` (from `motion/react`) or `usePrefersReducedMotion()` (the project hook in `src/lib/`)
- Reduced-motion path returns plain HTML — never animate
- Decorative CSS animations (Ken Burns, blob drift, soft pulse, hairline draw, loading-blink, cursor-breathe) are tagged `motion-decorative` so the global `@media (prefers-reduced-motion: reduce)` rule kills them outright
- Lenis (smooth scroll) bypasses on touch devices and reduced-motion users — both via runtime checks in `SmoothScroll.tsx`
- **`SmoothScroll` exposes `window.__lenis = { stop, start }`** so overlays (Modal) can pause/resume Lenis when they take over the scroll surface. Lenis runs on its own RAF loop, so `body.overflow:hidden` alone is not enough.
- **`Modal` panels must have `data-lenis-prevent`** so wheel events on the panel scroll the panel rather than bleeding into Lenis. Already wired in `Modal.tsx`.
- Easings live as CSS custom properties: `--ease-out-expo`, `--ease-out-back`, `--ease-in-out-circ`, `--ease-physical`
- The `Stagger` primitive's `childAs` prop must be `"li"` when wrapping inside `<ul>`/`<ol>` to keep HTML valid (see `src/components/sections/FAQ.tsx`)
- The `Stagger` primitive accepts a `childClassName: ReadonlyArray<string | undefined>` for per-child styling (e.g. variable col-spans on a trailing gap-filler). Function form is **not** supported because it can't cross the server→client component boundary in `output: 'export'` builds
- `Reveal` and `Stagger` use `filter: blur(8px)` / `blur(6px)` → `blur(0)` on enter for a stronger "resolve" feel. Don't drop the blur — it's the signature.
- Project covers: `coverFit: 'cover'` for landscape screenshots (default — fills the 16:10 card, crops as needed); `coverFit: 'contain'` for portrait / mobile screenshots (fits inside the card with padding so the whole screen is visible). When `category === 'mobile'` AND `coverFit === 'contain'`, the card automatically wraps the screenshot in a `<PhoneFrame>` (9:19.5 rounded container with shadow) so iOS shots look intentional. Use `device: 'phone'` on a gallery image to apply the same treatment in the modal
- The hero `.split-word` mask has `padding-top: 0.18em` / `padding-bottom: 0.22em` (with negative margins to compensate) to prevent ascender/descender clipping during the word reveal animation
- **`next/image` src + basePath:** because `images.unoptimized: true` bypasses Next's loader, `basePath` is **not** auto-prepended to image `src`. Always wrap with `withBasePath()` from `@/lib/utils` for any `/public/*` asset rendered through `next/image` — otherwise the deployed site emits bare `/foo.webp` paths that 404 under `/Lorenzo-Portfolio/`. (Plain `<img>` and CSS `background-image` have the same issue.) `_next/*` chunks are NOT affected — Next.js handles those correctly.
- New motion primitive? Mirror the reduced-motion gate from `Reveal.tsx` and `Stagger.tsx`

## Cinematic primitives

| Component | Role |
|---|---|
| `EntrySequence` | 4-act page-load overlay (radial accent glow → scan-line sweep → ground fade). Plays once per session via `sessionStorage`, gated on reduced-motion. Mounted in `layout.tsx` |
| `FloatingGeometry` | Raw three.js tetrahedron behind the hero. Dynamic-imported (`next/dynamic`, `ssr: false`) so three.js stays out of First Load JS. Mode-aware via CSS-var MutationObserver — re-reads `--geo-face` / `--geo-edge` / `--geo-opacity` when the `dark` class flips. Skipped on touch + reduced-motion |
| `CustomCursor` | Golden/accent dot + lerping reticle ring. Sets `data-cursor="custom"` on `<html>` so global CSS hides the system cursor. Auto-disabled on touch + reduced-motion. **`z-[120]`** — sits above modals (z-100) |
| `ScanLine` | Thin accent rule that draws across when scrolled into viewport. Used above every `<SectionHeader>` eyebrow |
| `Modal` | Generic dialog primitive. Pauses `window.__lenis`, sets `data-lenis-prevent` on the panel, body scroll lock, focus management |
| `NavCube` (in `Header.tsx`) | True 3D cube nav link. 6 face divs (front/back/top/bottom/left/right) on a `transform-style: preserve-3d` parent. Sits FLAT at rest (`rotateY(0)`) — the 3D-ness reveals during the hover spin to `rotateY(180deg)`, ending on the accent-bordered back face. All faces use `backface-visibility: hidden` so only the camera-facing side renders (prevents the back-face label from bleeding through the front) |
| `BrandHexPrism` (in `Header.tsx`) | 2-face hex prism for the brand mark. Each face is an SVG outline of a flat-top horizontal hexagon, sitting at ±depth/2 along Z. Same flat-at-rest / `rotateY(180deg)`-on-hover pattern as `NavCube`. `backface-visibility: hidden` is **load-bearing** here — without it the mirrored back-face label leaks through the transparent front face (the cubes hide this naturally with their opaque face backgrounds; the hex faces only have an SVG outline). No wrapping side faces — true hex sides require 6 rotated rects per edge, too much DOM for the visual gain |

## Theming

- Two locked palettes: **Ink Purple** (default primary, `#3D2E5C` light / `#A697C8` dark) + **Deep Navy** (secondary)
- **Default theme is `dark`** (`defaultTheme: 'dark'`, `enableSystem: false` in `layout.tsx`). The void grounding is intentional.
- Light + dark, both palettes locked as CSS custom properties in `globals.css`
- Live A/B switch (no rebuild): `document.documentElement.dataset.palette = 'navy'` (remove dataset to revert)
- All neutrals + accent vars exposed to Tailwind via `@theme` — use `bg-bg`, `text-ink`, `bg-accent`, etc.
- New token: `--line-accent` (rgba accent, used for hover ring around cards / nav boxes / hexagon)
- New tokens for FloatingGeometry: `--geo-face`, `--geo-edge`, `--geo-opacity` — derived from the active palette per-mode
- Global 600ms expo-out CSS transition on `background-color`, `color`, `border-color`, `fill`, `stroke` so dark↔light feels like a phase switch — not a snap

## Reusable utility classes (in `globals.css`)

| Class | What it does |
|---|---|
| `card-glow` | Soft accent shadow + accent border on hover. Baked into `<Card>`. Don't apply twice |
| `btn-sweep` | Accent-color sweep slides in from the left on hover. Drives `<Button>` and the header CTA. Reads `--sweep-bg` (default `var(--accent)`); pass `style={{ ['--sweep-bg' as never]: 'var(--ink)' }}` to invert. **Replaced** the old `btn-glow` (which produced ugly double-ring outlines — don't reintroduce it) |
| `cascade-step` + `cascade-1` / `cascade-2` / `cascade-3` | Sequential bold/brighten/accent cascade on `.group:hover`. `cascade-1` → font-weight 800; `cascade-2` → font-weight 600 + color brightens to `--ink`; `cascade-3` → color shifts to `--accent` + border-color to `--line-accent` (designed for `<Tag>` chips). Per-element `transitionDelay` inline-style controls the wave timing. Used on Work cards (title → tagline → tag chips) and Package cards (name → description → price → feature lines) |
| `loading-blink` | 1.6s steps blink for "LOADING" placeholder text |
| `section-scan` | One-shot scan-line draw used by `<ScanLine>` |
| `motion-decorative` | Tag for purely decorative animations — globally killed under reduced-motion |
| `nav-cube` / `nav-cube__inner` / `nav-cube__face` (`--front` / `--back` / `--top` / `--bottom` / `--left` / `--right`) | CSS classes that build the 3D cube. Sized via `--cube-w` / `--cube-h` / `--cube-d` custom properties on the root |
| `brand-hex` / `brand-hex__inner` / `brand-hex__face` / `brand-hex__svg` / `brand-hex__label` | CSS classes for the 3D hex prism. Sized via `--hex-w` / `--hex-h` / `--hex-d` custom properties on the root |

## Build & deploy

```bash
npm run dev        # http://localhost:3000 (basePath empty in dev)
npm run build      # static export → ./out/
npm run typecheck  # tsc --noEmit
```

**Deploy is automatic.** Push to `main` → `.github/workflows/deploy.yml` runs (Node 22, `npm ci`, `next build`, upload `out/`, deploy to Pages). Cycle is ~50–60s.

`next.config.ts` toggles `basePath: '/Lorenzo-Portfolio'` only when `NODE_ENV === 'production'`. Dev runs at `/`. When a custom domain is added in Phase 4, **remove `basePath`** and update `copy.meta.siteUrl`.

## Static-export gotchas

`output: 'export'` means:
- ❌ No API routes, no server actions, no `next start`
- ❌ No `next/image` optimization (`images: { unoptimized: true }` already set)
- ✅ Everything pre-rendered to HTML at build time

`public/.nojekyll` is **critical** — without it, GitHub Pages strips the `_next/` directory.

## Section IDs (anchor targets)

`#hero`, `#about`, `#work`, `#capabilities`, `#packages`, `#faq`, `#contact-cta`. All sections with `id` attribute get `scroll-margin-top: 5rem` from `globals.css` to clear the fixed header.

There is **no active-section indicator** — the user removed it. Nav links don't change appearance based on scroll. If you ever need it back, the right pattern is a scroll-driven check (rAF-throttled) for whichever section straddles a "reading line" ≈33% from the top of the viewport — not IntersectionObserver thresholds, which behave poorly on variable-height sections.

Header is **`h-24`** (the 3D hex prism + cubes need extra vertical room for perspective during the hover flip). Coupling: `<main>` uses `pt-24`, Lenis anchor scroll offset is `-96`, and section `scroll-margin-top` is `6rem`. **Change one, change all four.**

## Phase status

- ✅ **Phase 0** — scaffold, tokens, deploy pipeline, palette A/B, plan committed
- 🟡 **Phase 1** (partial) — placeholder copy + gradient project covers; **need from user**: real contact email, real project taglines for tagline-TBD slugs, screenshots, hero override (if any), real About portrait
- ✅ **Phase 2** — cinematic motion
  - ✅ 2.1: core primitives + hero opening sequence + section reveals + smooth scroll + scroll progress
  - ✅ 2.2: scroll-aware nav (3D NavCube + 3D BrandHexPrism with perspective + preserve-3d), inter-section scan lines. Active-section indicator was removed by user request
  - ✅ 2.3: floating Three.js tetrahedron, custom cursor, EntrySequence, project-card sequential bold cascade, btn-sweep, blur-resolve reveals, modal scroll fix
- ⏳ **Phase 3** — Lighthouse 95+, real-device audit, OG image, polish, dynamic-import audit to trim First Load JS
- ⏳ **Phase 4** — custom domain + analytics

## Performance budget

| Metric | Target | Current |
|---|---|---|
| First Load JS (`/`) | ≤ 140 kB | 165 kB ⚠️ (Phase 3 will trim; three.js already dynamic-imported and not in this number) |
| First Load JS (`/contact`) | ≤ 140 kB | 103 kB ✓ |
| LCP (4G mobile) | < 2.0s | unmeasured |
| CLS | < 0.05 | unmeasured |
| Lighthouse Perf (mobile) | ≥ 95 | unmeasured |

## Patterns to follow

- **Polymorphic primitives** (`Button`, `Reveal`, `Stagger`) accept an `as` prop. Use it instead of forking the component.
- **Class merging:** `cn(...inputs)` from `@/lib/utils` — wraps `clsx`. Don't import clsx directly.
- **Asset URLs that need basePath:** `withBasePath(path)` from `@/lib/utils`. Most cases don't need it because Next.js handles it for `<Link>`/`next/image`/CSS imports.
- **Section composition:** every landing section is a separate component in `sections/`, composed in `app/page.tsx`. Never inline a section's JSX into `page.tsx`.
- **Section header:** use `<SectionHeader>` (eyebrow + headline + subhead) — already wraps with `<Reveal>` and renders a `<ScanLine>` above the eyebrow.
- **New CTA?** Use `<Button>`. It already wires `btn-sweep` per variant; just pick `primary` / `ghost` / `accent`. Don't hand-roll a new hover effect with rings or pseudo-borders.
- **Pausing Lenis:** any new full-screen overlay that owns scroll should call `window.__lenis?.stop()` on open and `window.__lenis?.start()` on close, mirroring `Modal.tsx`.

## Don'ts

- Don't hard-code copy in section JSX — put it in `src/content/copy.ts`
- Don't add jQuery, Bootstrap, or any classic-era libs
- Don't add a `tailwind.config.ts` — Tailwind v4 is CSS-first
- Don't bypass `prefers-reduced-motion` in any motion code
- Don't add `next/image` with `loader` configs — `unoptimized: true` is the static-export reality
- Don't introduce server actions / route handlers — site is `output: 'export'`
- Don't push to `main` without a build that's locally green (`npm run build` first)
- Don't leave a project's `cover` referencing a missing `public/projects/<slug>.webp` — add the file or the gradient placeholder will continue rendering
- Don't reintroduce `btn-glow` — it produced a double-ring outline that read as ugly. Use `btn-sweep`
- Don't import `three` synchronously anywhere outside `FloatingGeometry.tsx` — it's only allowed there because the component is dynamic-imported with `ssr: false`. Synchronous import will pull ~150 kB into First Load JS
- Don't import `@react-three/fiber` or `@react-three/drei` — they were tried and removed; raw three.js is the chosen path
- Don't change the Header's `h-24` without also updating `<main>` `pt-24`, the Lenis anchor offset (`SmoothScroll.tsx` `offset: -96`), and section `scroll-margin-top: 6rem`. The 3D cubes/hex prism need the extra vertical room for perspective during the hover flip
- Don't reintroduce the active-section indicator (the pixel/dot under nav links). The user explicitly removed it. If you must add a "you are here" cue back, ask first
- Don't switch `next-themes` `defaultTheme` away from `'dark'` without checking the FloatingGeometry CSS vars and the EntrySequence radial-glow values still read sensibly under the new default

## When in doubt

- Long-form context, decisions, motion plan, deploy details: [Lorenzo-Portfolio.md](Lorenzo-Portfolio.md)
- Aesthetic reference (PS1 void/presence motif): [design-improvements.md](design-improvements.md) — the doc that drove the cinematic primitives even though the palette ended up purple/navy not gold
- Live deploy logs: `gh run list`
- Local preview: `npm run dev` then visit <http://localhost:3000>
