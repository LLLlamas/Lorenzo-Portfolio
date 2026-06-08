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
| Fonts | DM Sans · Fraunces · Share Tech Mono | Loaded in `layout.tsx` |
| Motion | Motion 12 + GSAP 3.15 + Lenis 1.3 | All free |
| 3D | three.js (raw) | Dynamic-imported in `FloatingGeometry.tsx` — out of First Load JS |
| Icons | lucide-react | |
| Forms | Formspree `f/xvzlwoee` | `src/app/contact/page.tsx` |
| Hosting | GitHub Pages via Actions | `.github/workflows/deploy.yml` |

**No jQuery. No Bootstrap. No r3f/drei.**

## Routes

- `/` — HeroCradleSection · About · Work · Capabilities · Packages · FAQ · ContactCTA
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
│   │                          About, Work, Capabilities, Packages, FAQ, ContactCTA, ProjectModal
│   ├── ui/                  ← Button, Card, Tag, SectionHeader, PhoneFrame
│   ├── motion/              ← Reveal, Stagger, SplitTextReveal, ScrollProgress, SmoothScroll,
│   │                          EntrySequence, FloatingGeometry, RotationSpeedSlider,
│   │                          CursorGlow, ScanLine, Modal, ScrollScaleMount, MagneticWrap,
│   │                          GyroTilt, PendulumToggle, RippleTap, GlobalRippleTap
│   │                          (CustomCursor = legacy, unmounted)
│   ├── nav/                 ← Header (BrandHexPrism + NavCube links), Footer, ThemeToggle
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
| First Load JS `/` | ≤ 140 kB | 171 kB ⚠️ |
| First Load JS `/contact` | ≤ 140 kB | 103 kB ✓ |
| LCP (4G mobile) | < 2.0s | unmeasured |
| Lighthouse Perf mobile | ≥ 95 | unmeasured |

## Design conventions (current)

### Footer
- Compact single-row: `py-5 flex items-center justify-between` with copyright + Contact link only.
- **No email address displayed in the footer.** Email lives in `ContactCTA` (ghost button) and the `/contact` page only.
- Uses `section-glass` (the only section that gets glass blur/dark-tint besides `Capabilities` and `FAQ`).

### Button variants
- **Ghost:** `border-white/45 bg-transparent text-ink` — legible over city backdrops without a glass overlay.
- **Accent:** `border-accent/70 bg-accent/20` — solid accent-glass pill with amplified glow on hover.
- **Primary:** glass pill `border-white/20 bg-white/10 text-ink` — used inside the Header and for non-featured package CTAs.

### Project card cover / PhoneCoverPreview / PhoneHero (ProjectModal)
- Cover container background: `bg-transparent` (card cover) / no inline background style (modal cover) — lets the parent's `bg-bg-elevated` surface show through. No accent-soft or accent-secondary-soft gradient overlays.
- `accent-soft` and `accent-secondary-soft` gradients are intentional in: `Hero` (full-page radial), `About` placeholder portrait (decorative frame), `Capabilities` icon pill (`bg-accent-soft`), `EntrySequence`, and `HeroBackground`. Do **not** introduce them on card-cover or modal-cover containers.

### Text color conventions over city backdrop (no glass overlay)
- Headings and subheads visible directly over city imagery: use `text-ink` (not `text-ink-soft`) + `[text-shadow:...]` for punch. See `Hero` subhead and `ContactCTA` subhead/headline.
- Eyebrow labels directly over city imagery: `text-ink-soft` + `[text-shadow:0_1px_8px_rgba(16,15,28,0.9)]`. See `ContactCTA` eyebrow.
- Eyebrow labels in glass-backed or card-backed sections: `text-ink-quiet` is fine (e.g. `SectionHeader`, `About`, `Packages`, `Work`).

### `section-glass` usage
- Applied to: `Footer`, `Capabilities` (border-y), `FAQ` (border-t). These are the only three. Do not add it to other sections.

## Critical don'ts

- Never hard-code copy in JSX — use `src/content/`
- Never import `three` synchronously outside `FloatingGeometry.tsx` (~150 kB hit)
- Never change Header `h-24` without updating `pt-24` + Lenis offset `-96` + `scroll-margin-top: 6rem` (all coupled)
- Never reintroduce `btn-glow` or the active-section nav indicator (both explicitly removed)
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
