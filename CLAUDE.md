# CLAUDE.md — Lorenzo Portfolio

Agent-readable project brief. Keeps the critical facts agents need to navigate this codebase without spelunking. Long-form spec lives in [Lorenzo-Portfolio.md](Lorenzo-Portfolio.md).

## What this is

Two-page solo-freelance portfolio for **Lorenzo Llamas**.
- Focus: landing pages, websites, single-purpose web tools (web-first, iOS secondary).
- Goal: convert serious leads via the contact page.
- Tone: confident calm, cinematic, premium.

**Live:** <https://llllamas.github.io/Lorenzo-Portfolio/>
**Repo:** <https://github.com/LLLlamas/Lorenzo-Portfolio>

## Stack (current)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | `output: 'export'` — fully static, no server runtime |
| Language | TypeScript (strict) | `@/*` path alias → `src/*` |
| Styling | Tailwind v4 (CSS-first) | **No `tailwind.config.ts`** — tokens live in `globals.css` `@theme {}` |
| Theme | next-themes | Class-based on `<html>`, `dark` variant via `@custom-variant` |
| Motion | Motion 12 + GSAP 3.15 + Lenis 1.3 | All free; GSAP plugins all free post-May 2025 |
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
│   ├── layout.tsx           ← root: fonts, ThemeProvider, SmoothScroll, ScrollProgress, Header, Footer
│   ├── page.tsx             ← composes the 7 landing sections
│   ├── contact/page.tsx     ← contact form + cards + mini-FAQ
│   ├── globals.css          ← Tailwind v4 @theme + tokens + cinematic CSS layer + reduced-motion gate
│   └── not-found.tsx
├── components/
│   ├── sections/            ← Hero, About, Work, Capabilities, Packages, FAQ, ContactCTA
│   ├── ui/                  ← Button, Card, Tag, SectionHeader (Reveal-wrapped)
│   ├── motion/              ← Reveal, Stagger, SplitTextReveal, ScrollProgress, SmoothScroll
│   ├── nav/                 ← Header, Footer, ThemeToggle
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
| Capability cards | `src/content/copy.ts` → `copy.capabilities.items` |
| A project card | `src/content/projects.ts` (one entry; cover at `public/projects/<slug>.png`). The "rest" grid auto-detects trailing gaps and renders a `WorkGapFiller` ("Could be yours.") to fill them — no math needed |
| A price | `src/content/packages.ts` |
| An FAQ | `src/content/faqs.ts` |
| Contact email / Cal.com link | `src/content/copy.ts` → `copy.meta` |

## Motion conventions (Phase 2 onward)

- All motion primitives are `'use client'` and gate on `useReducedMotion()` (from `motion/react`) or `usePrefersReducedMotion()` (the project hook in `src/lib/`)
- Reduced-motion path returns plain HTML — never animate
- Decorative CSS animations (Ken Burns, blob drift, soft pulse, hairline draw) are tagged `motion-decorative` so the global `@media (prefers-reduced-motion: reduce)` rule kills them outright
- Lenis (smooth scroll) bypasses on touch devices and reduced-motion users — both via runtime checks in `SmoothScroll.tsx`
- Easings live as CSS custom properties: `--ease-out-expo`, `--ease-out-back`, `--ease-in-out-circ`, `--ease-physical`
- The `Stagger` primitive's `childAs` prop must be `"li"` when wrapping inside `<ul>`/`<ol>` to keep HTML valid (see `src/components/sections/FAQ.tsx`)
- New motion primitive? Mirror the reduced-motion gate from `Reveal.tsx` and `Stagger.tsx`

## Theming

- Two locked palettes: **Ink Purple** (default primary) + **Deep Navy** (secondary)
- Light + dark, both palettes locked as CSS custom properties in `globals.css`
- Live A/B switch (no rebuild): `document.documentElement.dataset.palette = 'navy'` (remove dataset to revert)
- All neutrals + accent vars exposed to Tailwind via `@theme` — use `bg-bg`, `text-ink`, `bg-accent`, etc.

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

## Phase status

- ✅ **Phase 0** — scaffold, tokens, deploy pipeline, palette A/B, plan committed
- 🟡 **Phase 1** (partial) — placeholder copy + gradient project covers; **need from user**: real contact email, 8 project taglines, screenshots, hero override (if any)
- 🔧 **Phase 2** — cinematic motion (in progress)
  - ✅ 2.1: core primitives + hero opening sequence + section reveals + smooth scroll + scroll progress
  - ⏳ 2.2: scroll-aware nav, magnetic links, active section indicator, inter-section scenes
  - ⏳ 2.3: 3D tilt + cover parallax, custom cursor, page transitions, FAQ height tween, form animations
- ⏳ **Phase 3** — Lighthouse 95+, real-device audit, OG image, polish
- ⏳ **Phase 4** — custom domain + analytics

## Performance budget

| Metric | Target | Current |
|---|---|---|
| First Load JS (`/`) | ≤ 140 kB | 150 kB ⚠️ (Phase 3 will trim via dynamic imports) |
| First Load JS (`/contact`) | ≤ 140 kB | 103 kB ✓ |
| LCP (4G mobile) | < 2.0s | unmeasured |
| CLS | < 0.05 | unmeasured |
| Lighthouse Perf (mobile) | ≥ 95 | unmeasured |

## Patterns to follow

- **Polymorphic primitives** (`Button`, `Reveal`, `Stagger`) accept an `as` prop. Use it instead of forking the component.
- **Class merging:** `cn(...inputs)` from `@/lib/utils` — wraps `clsx`. Don't import clsx directly.
- **Asset URLs that need basePath:** `withBasePath(path)` from `@/lib/utils`. Most cases don't need it because Next.js handles it for `<Link>`/`next/image`/CSS imports.
- **Section composition:** every landing section is a separate component in `sections/`, composed in `app/page.tsx`. Never inline a section's JSX into `page.tsx`.
- **Section header:** use `<SectionHeader>` (eyebrow + headline + subhead) — already wraps with `<Reveal>`.

## Don'ts

- Don't hard-code copy in section JSX — put it in `src/content/copy.ts`
- Don't add jQuery, Bootstrap, or any classic-era libs
- Don't add a `tailwind.config.ts` — Tailwind v4 is CSS-first
- Don't bypass `prefers-reduced-motion` in any motion code
- Don't add `next/image` with `loader` configs — `unoptimized: true` is the static-export reality
- Don't introduce server actions / route handlers — site is `output: 'export'`
- Don't push to `main` without a build that's locally green (`npm run build` first)
- Don't leave a project's `cover` referencing a missing `public/projects/<slug>.png` — add the file or the gradient placeholder will continue rendering

## When in doubt

- Long-form context, decisions, motion plan, deploy details: [Lorenzo-Portfolio.md](Lorenzo-Portfolio.md)
- Live deploy logs: `gh run list`
- Local preview: `npm run dev` then visit <http://localhost:3000>
