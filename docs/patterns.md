# Patterns, Don'ts & Static Export

## Patterns to follow

- **Polymorphic primitives** (`Button`, `Reveal`, `Stagger`) accept `as` prop — use it, don't fork
- **Class merging:** `cn(...inputs)` from `@/lib/utils` — do not import `clsx` directly
- **basePath on assets:** `withBasePath(path)` from `@/lib/utils` — required for `/public/*` in `next/image` and `<img>`; NOT needed for `<Link>`, CSS imports, or `_next/*` chunks
- **Section composition:** each landing section = separate file in `sections/`, composed in `app/page.tsx` — never inline JSX into `page.tsx`
- **Section header:** always use `<SectionHeader>` (wraps `<Reveal>` + `<ScanLine>` already)
- **New CTA:** use `<Button variant="primary|ghost|accent">` — already wires `btn-sweep`; don't hand-roll hover effects
- **Lenis in overlays:** `window.__lenis?.stop()` on open, `window.__lenis?.start()` on close; add `data-lenis-prevent` to the scrollable panel

## Don'ts

| Don't | Why |
|---|---|
| Hard-code copy in JSX | All copy lives in `src/content/` |
| Add jQuery / Bootstrap | Explicitly banned |
| Add `tailwind.config.ts` | Tailwind v4 is CSS-first |
| Bypass `prefers-reduced-motion` | Accessibility requirement |
| Add `next/image` loader configs | `unoptimized: true` is static-export reality |
| Add server actions / route handlers | `output: 'export'` — no server runtime |
| Push to `main` with a failing build | Run `npm run build` locally first |
| Leave `cover` pointing to a missing webp | Card will show gradient placeholder forever |
| Reintroduce `btn-glow` | Produced double-ring outlines — replaced by `btn-sweep` |
| Pass positioning classes to `RippleTap className` | On touch it prepends `relative overflow-hidden`, overriding them — wrap in a positioned parent |
| Import `three` synchronously outside `FloatingGeometry.tsx` | Pulls ~150 kB into First Load JS |
| Import `@react-three/fiber` or `@react-three/drei` | Tried and removed — raw three.js is the path |
| Change Header `h-24` in isolation | Must update `pt-24`, Lenis offset `-96`, and `scroll-margin-top: 6rem` together — see [theming.md](theming.md) |
| Reintroduce active-section indicator | Explicitly removed by user — ask before adding any "you are here" cue |
| Change `defaultTheme` from `'dark'` | Check FloatingGeometry CSS vars + EntrySequence glow values first |

## Static-export gotchas (`output: 'export'`)

- ❌ No API routes, no server actions, no `next start`
- ❌ No `next/image` optimization (`images: { unoptimized: true }` set)
- ✅ Everything pre-rendered to HTML at build time
- `public/.nojekyll` is **critical** — GitHub Pages strips `_next/` without it
- `next.config.ts` sets `basePath: '/Lorenzo-Portfolio'` only in production. Remove when custom domain is added (Phase 4) and update `copy.meta.siteUrl`
