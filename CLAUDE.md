# CLAUDE.md — Lorenzo Portfolio

Solo-freelance portfolio for **Lorenzo Llamas** — landing pages, websites, single-purpose web tools.
Goal: convert serious leads via `/contact`. Tone: confident calm, cinematic, premium.

**Live:** <https://llllamas.github.io/Lorenzo-Portfolio/>  
**Repo:** <https://github.com/LLLlamas/Lorenzo-Portfolio>

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | `output: 'export'` — fully static |
| Language | TypeScript (strict) | `@/*` → `src/*` |
| Styling | Tailwind v4 (CSS-first) | **No `tailwind.config.ts`** — tokens in `globals.css @theme {}` |
| Theme | next-themes | `defaultTheme: 'dark'`, `enableSystem: false` |
| Fonts | Gotham → Helvetica (local/system stack) | All four `--font-*` tokens in `globals.css @theme` — no webfonts loaded |
| Motion | Motion 12 + GSAP 3.15 + Lenis 1.3 | All free |
| 3D | three.js (raw) | Dynamic-imported in `FloatingGeometry.tsx` — out of First Load JS |
| Icons | lucide-react | |
| Forms | Formspree `f/xvzlwoee` | `src/app/contact/page.tsx` |
| Hosting | GitHub Pages via Actions | `.github/workflows/deploy.yml` |

**No jQuery. No Bootstrap. No r3f/drei.**

## Routes

- `/` — HeroCradleSection · About · ProofStrip · Work · Capabilities · Packages · FAQ · ContactCTA
- `/contact` — email · calendar · form · mini-FAQ
- `/_not-found` — 404

## File map

```
src/
├── app/
│   ├── layout.tsx           ← root: ThemeProvider, SmoothScroll, ScrollProgress, CursorGlow,
│   │                          EntrySequence, GlobalRippleTap, ScrollScaleMount, Header, Footer
│   ├── page.tsx             ← composes landing sections (starts with HeroCradleSection)
│   ├── contact/page.tsx     ← contact form + cards + mini-FAQ
│   ├── globals.css          ← Tailwind @theme, cinematic CSS, reduced-motion gate, film-grain overlay
│   └── not-found.tsx
├── components/
│   ├── sections/            ← Hero, HeroCradleSection, NewtonsCradleStrip, MarqueeTechStrip,
│   │                          About, ProofStrip, Work, Capabilities, Packages,
│   │                          FAQ, ContactCTA, ProjectModal
│   ├── ui/                  ← Button, Card, Tag, SectionHeader, PhoneFrame
│   ├── motion/              ← Reveal, Stagger, SplitTextReveal, ScrollProgress, SmoothScroll,
│   │                          EntrySequence, FloatingGeometry, RotationSpeedSlider,
│   │                          CursorGlow, ScanLine, Modal, ScrollScaleMount, MagneticWrap,
│   │                          GyroTilt, PendulumToggle, RippleTap, GlobalRippleTap,
│   │                          VoidBackground, JourneyRail, ScrambleText, MosaicReveal
│   │                          (CustomCursor = legacy, unmounted)
│   ├── nav/                 ← Header (mono wordmark + bracket links + [ Menu ]), OverlayMenu,
│   │                          Footer, ThemeToggle
│   └── theme/               ← ThemeProvider
├── content/                 ← *** SINGLE SOURCE OF TRUTH — all copy/data ***
│   ├── copy.ts              ← hero · about · capabilities · CTA · contact · meta
│   ├── projects.ts          ← Project[] — one entry per card
│   ├── packages.ts          ← Spark / Studio tiers + modifiers
│   ├── faqs.ts              ← landing FAQ + contact mini-FAQ
│   └── tech-stack.ts        ← labels for MarqueeTechStrip + NewtonsCradleStrip
└── lib/
    ├── utils.ts             ← cn(), withBasePath()
    ├── motion.ts            ← shared easing / duration / stagger constants
    └── use-prefers-reduced-motion.ts
```

## The single rule

**All copy lives in `src/content/`.** → See [docs/content-guide.md](docs/content-guide.md) for the full edit table and screenshot workflow.

## Build & deploy

```bash
npm run dev              # localhost:3000 (no basePath in dev)
npm run build            # static export → ./out/
npm run typecheck        # tsc --noEmit
npm run resize-screenshots  # process screenshots/ → public/projects/ + public/brand/
```

Deploy is automatic: push to `main` → Actions runs → Pages deploys (~50–60s).

## Phase status

- ✅ **Phase 0** — scaffold, tokens, deploy pipeline
- 🟡 **Phase 1** (partial) — **still needed:** real project taglines, screenshots, About portrait
- ✅ **Phase 2** — full cinematic motion (EntrySequence, FloatingGeometry, CursorGlow, NavCube, Work revamp, ProjectModal prev/next, pendulum)
- ⏳ **Phase 3** — Lighthouse 95+, OG image, trim First Load JS (currently 171 kB, target ≤140 kB)
- ⏳ **Phase 4** — custom domain (remove `basePath`) + analytics

## Performance budget

| Metric | Target | Current |
|---|---|---|
| First Load JS `/` | ≤ 140 kB | 174 kB ⚠️ |
| First Load JS `/contact` | ≤ 140 kB | 103 kB ✓ |
| LCP (4G mobile) | < 2.0s | unmeasured |
| Lighthouse Perf mobile | ≥ 95 | unmeasured |

## Design conventions (current — "editorial void" system)

The site backdrop is `VoidBackground` (near-black ground + faint dot grid + canvas **parallax starfield** with three depth bands + two slow-drifting accent orbs + rare CSS shooting-star streaks). **No photo backdrops** — the NYC/LA city imagery was removed with the 2026-07 redesign. The language is brutalist-editorial with a scroll-as-voyage layer: giant uppercase display type, mono bracketed labels, hairline dividers, numbered waypoint indexes, HUD instrument chrome.

### Voyage layer (scroll-as-journey)
- **JourneyRail** (`motion/JourneyRail.tsx`): fixed right-edge telemetry — vertical hairline + ticks, accent diamond marker driven by **raw scroll fraction only** (deliberately NOT section-tracked, to stay clear of the banned active-section indicator), mono `ALT nnn // EN ROUTE` readout. Hidden `< lg` and under reduced motion.
- **Waypoint numbering**: nav links render `0N/ Label`; section eyebrows render `[ 0N // Label ]` via `SectionHeader`'s `index` prop (About=01 … ContactCTA=06; About and ContactCTA format theirs inline).
- **Status beacon**: pulsing accent dot + `copy.meta.availability` in the hero annotation row (`.status-beacon`).
- **Scroll hint**: `copy.hero.scrollHint` + animated dropping line (`.scroll-hint-line`) at the hero's base; hero is sized so it lands above the fold at 1440×900.
- **HUD corner ticks**: `.hud-corners` + four `.hud-tick--*` spans on Work card covers — faint ink at rest, accent on card hover.
- **Arrival glow**: `ContactCTA` ends the journey — bottom-anchored breathing accent radial (`.sun-breathe`) over a horizon hairline.

### Editorial idioms
- **Bracket links** (`.link-bracket` in `globals.css`): mono uppercase label with `[` `]` pseudo-element brackets that split apart + turn accent on hover. Used for nav links, hero CTAs, section eyebrows, and Work filter tabs. `.link-bracket--accent` fills the label with accent. Must stay `display: inline-block` — inline-flex collapses inner spaces.
- **ScrambleText** (`motion/ScrambleText.tsx`): glyph-scramble reveal on in-view; `rescrambleOnHover` for nav links.
- **Mono indexes**: `01/` numbering on Work cards and Capability rows, mono `text-accent`.
- **MosaicReveal** (`motion/MosaicReveal.tsx`): tile-grid dissolve over project covers on scroll-in.
- Section headlines are uppercase `font-display font-extrabold` (see `SectionHeader`); hero + footer carry giant wordmarks.

### Header + OverlayMenu
- Minimal editorial bar: llama logo + mono wordmark left (wordmark hidden `< sm`), numbered bracket links center (**`lg+` only** — they collide with the wordmark below that), `[ Start a project ]` (md+) + `[ Menu ]` + ThemeToggle right. Height stays `h-24` (coupled — see don'ts).
- `[ Menu ]` opens **OverlayMenu** (`nav/OverlayMenu.tsx`): full-screen dialog, five-column ground wipe, giant numbered destinations (from `navigation.overlay`) with clip-reveal stagger, status-beacon meta row at the bottom. Locks body scroll + Lenis like `Modal`; ESC closes; focus moves in and restores on close. This is the ONLY nav below `lg`.

### Showcase (Work section)
- Featured projects (`featured: true`) render as full-width **case rows**: alternating cover/meta columns, per-row `useScroll` cover parallax (`-inset-y-[8%]` wrapper + ±4.5% translate), MosaicReveal + HUD ticks on covers, mono index + category line, ghost-title hover, proof line = the project's first highlight, `[ Open case ]` opens ProjectModal.
- Non-featured projects render in the compact **archive grid** below (aspect-video covers, mono meta), capped by the availability CTA tile.
- **ProofStrip** (`sections/ProofStrip.tsx`): count-up stat tiles under About. Numbers live in `copy.proof` and MUST stay consistent with `packages.ts` timelines + contact reply copy.
- **Section watermarks**: `SectionHeader`'s `index` also renders a giant outline `.section-watermark` number behind the header; string headlines get a word-mask `SplitTextReveal` on scroll-in.

### Footer
- Mono link columns (`Menu/`, `Contact/`, `Base/`) above a giant full-width `LORENZO.LLAMAS` wordmark, compact legal row underneath.
- **No email address displayed in the footer.** Email lives in `ContactCTA` (ghost button) and the `/contact` page only.
- Uses `section-glass` (the only section that gets glass blur/dark-tint besides `Capabilities` and `FAQ`).

### Project card cover / PhoneCoverPreview / PhoneHero (ProjectModal)
- Cover container background: `bg-transparent` (card cover) / no inline background style (modal cover) — lets the parent's `bg-bg-elevated` surface show through. No accent-soft or accent-secondary-soft gradient overlays.
- `accent-soft` and `accent-secondary-soft` gradients are intentional in: `Hero` (full-page radial), `ContactCTA` (radial light pool), `About` placeholder portrait (decorative frame), and `EntrySequence`. Do **not** introduce them on card-cover or modal-cover containers.

### `section-glass` usage
- Applied to: `Footer`, `Capabilities` (border-y), `FAQ` (border-t). These are the only three. Do not add it to other sections.

## Critical don'ts

- Never hard-code copy in JSX — use `src/content/`
- Never import `three` synchronously outside `FloatingGeometry.tsx` (~150 kB hit)
- Never change Header `h-24` without updating `pt-24` + Lenis offset `-96` + `scroll-margin-top: 6rem` (all coupled)
- Never reintroduce `btn-glow`, the active-section nav indicator, or the WordMarquee scrolling word strip (all explicitly removed)
- Never load webfonts — typography is the Gotham → Helvetica local/system stack set in `globals.css @theme` (owner decision, 2026-07)
- Never add server actions / API routes — `output: 'export'` has no server runtime
- Never put accent-soft/accent-secondary-soft gradients on project card covers or modal covers — use `bg-transparent` (card covers) or no inline background style (modal covers)

→ Full don'ts list: [docs/patterns.md](docs/patterns.md)

## Reference docs

| Doc | Contents |
|---|---|
| [docs/content-guide.md](docs/content-guide.md) | What to edit and where; screenshot + brand asset workflow |
| [docs/motion.md](docs/motion.md) | Motion rules, Lenis, all cinematic primitives with file paths |
| [docs/css-classes.md](docs/css-classes.md) | All utility classes in `globals.css` |
| [docs/theming.md](docs/theming.md) | Palettes, tokens, header/layout coupling constants, section IDs |
| [docs/patterns.md](docs/patterns.md) | Patterns to follow, full don'ts list, static-export gotchas |
| [Lorenzo-Portfolio.md](Lorenzo-Portfolio.md) | Long-form spec and decisions |
| [design-improvements.md](design-improvements.md) | Aesthetic reference (cinematic / void-presence motif) |
