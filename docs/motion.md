# Motion

## Rules (apply to every primitive)

- All motion primitives are `'use client'` and gate on `useReducedMotion()` (from `motion/react`) or `usePrefersReducedMotion()` (`src/lib/use-prefers-reduced-motion.ts`)
- Reduced-motion path returns plain HTML — never animate
- Tag decorative CSS animations with `motion-decorative` → killed by global `@media (prefers-reduced-motion: reduce)`
- New primitive? Mirror the reduced-motion gate from `Reveal.tsx` and `Stagger.tsx`
- `Reveal` / `Stagger` use `filter: blur(8px/6px) → blur(0)` on enter — the signature, don't drop it
- Easings as CSS custom props: `--ease-out-expo`, `--ease-out-back`, `--ease-in-out-circ`, `--ease-physical`

## Lenis (smooth scroll)

- Bypasses on touch + reduced-motion (`SmoothScroll.tsx`)
- **`window.__lenis = { stop, start }`** — overlays must call `stop()` on open, `start()` on close. `body.overflow:hidden` alone is not enough (Lenis runs its own RAF)
- Any new overlay that owns scroll: mirror `Modal.tsx`
- **`Modal` panels must have `data-lenis-prevent`** so wheel scrolls the panel, not the page

## Globals

- **`window.__geoSpeed`** (0–4, default 1) — set by `RotationSpeedSlider`, read each RAF tick in `FloatingGeometry`
- **`window.__lenis`** — set by `SmoothScroll`, consumed by `Modal` and any future overlays

## Stagger / Reveal quirks

- `Stagger childAs="li"` when wrapping inside `<ul>`/`<ol>` (see `FAQ.tsx`)
- `Stagger` accepts `childClassName: ReadonlyArray<string | undefined>` for per-child styling — function form not supported (can't cross server→client boundary in `output: 'export'`)
- Work section uses `AnimatePresence mode="popLayout"` on cards, NOT `Stagger`

## basePath + images

`images.unoptimized: true` means Next's loader is bypassed — `basePath` is **not** auto-prepended to `next/image` src.
Always wrap with `withBasePath()` from `@/lib/utils` for any `/public/*` asset in `next/image` or `<img>`.
`_next/*` chunks are handled correctly by Next — don't wrap those.

## Pendulum / Newton's Cradle

- `PendulumToggle` is click-driven (not hover). Located in `Hero.tsx`, `hidden md:flex` — desktop only
- Clicking draws SVG strings from button bottom-center to each tech label center (`HeroCradleSection`)
- CSS keyframes: left + right labels swing; middle three jiggle on impact
- `HeroCradleSection` owns string overlay + ref sharing between button and labels

## ProjectModal

- Gallery: horizontal scroll-snap filmstrip (`-mx-5 md:-mx-8 flex snap-x snap-mandatory overflow-x-auto scrollbar-none`)
  - Phone shots: `w-[48vw] md:w-48`; browser shots: `w-[75vw] md:w-80`
  - `GalleryLightbox`: `createPortal` at `z-[500]`, spring entrance `rotateX: 18→0 + scale: 0.74→1 + blur: 20px→0`
  - ESC in lightbox: `stopImmediatePropagation` (capture phase) — closes lightbox only, not the modal
- Prev/next navigation: `prevProject?`, `nextProject?`, `onPrev?`, `onNext?`, `projectIndex?`, `projectCount?` props
  - Footer bar with chevrons + `NN / NN` counter; disables at boundaries
  - Cross-fade via `AnimatePresence mode="wait"` keyed on `project.slug`
  - `useEffect` on slug change → `document.querySelector('[data-lenis-prevent]').scrollTop = 0`

## Cinematic primitives

| Component | File | Role |
|---|---|---|
| `EntrySequence` | `motion/EntrySequence.tsx` | 4-act page-load overlay (glow → scan → fade). Once per session via `sessionStorage`. Mounted in `layout.tsx` |
| `FloatingGeometry` | `motion/FloatingGeometry.tsx` | Raw three.js tetrahedron, `next/dynamic ssr:false`. CSS-var MutationObserver for dark/light. Skip touch + reduced-motion |
| `CursorGlow` | `motion/CursorGlow.tsx` | Radial-gradient orb `z-[110]`. Splits text into `<span data-glow>`, highlights within 50px radius. Desktop + reduced-motion gated. Mounted in `layout.tsx` |
| `RippleTap` | `motion/RippleTap.tsx` | Per-element touch ripple. Prepends `relative overflow-hidden` on touch — never pass positioning classes directly |
| `GlobalRippleTap` | `motion/GlobalRippleTap.tsx` | Document-level touch ripple `z-[55]`. Mounted in `layout.tsx` |
| `GyroTilt` | `motion/GyroTilt.tsx` | Device-orientation wrapper. `beta`/`gamma` → rotateX/Y ±12°. iOS 13+ permission on first touch. Used on Work grid |
| `ScanLine` | `motion/ScanLine.tsx` | Thin accent rule, draws on viewport entry. Above every `<SectionHeader>` |
| `Modal` | `motion/Modal.tsx` | Generic dialog: backdrop fade + spring panel, body scroll lock, focus trap, Lenis pause, `data-lenis-prevent` |
| `ScrollScaleMount` | `motion/ScrollScaleMount.tsx` | Chromium: native `animation-timeline: view()`. Safari/Firefox: rAF lerp scale `0.88→1.0`. Mounted in `layout.tsx` |
| `MagneticWrap` | `motion/MagneticWrap.tsx` | Cursor-follow button wrapper. Strength 0.25. Desktop + reduced-motion gated. Used on Hero CTAs + ContactCTA |
| `RotationSpeedSlider` | `motion/RotationSpeedSlider.tsx` | Discrete range 0–4 (0.5 steps). Sets `window.__geoSpeed`. Hidden touch + reduced-motion. Mounted in `Hero.tsx` |
| `NavCube` | `nav/Header.tsx` | 6-face CSS 3D cube. Flat at rest, spins `rotateY(180deg)` on hover. `backface-visibility: hidden` on all faces |
| `BrandHexPrism` | `nav/Header.tsx` | 2-face flip card with llama logo. Hover `rotateY(180deg)` — back face counter-rotates so logo isn't mirrored |
| `HeroCradleSection` | `sections/HeroCradleSection.tsx` | Client wrapper: `Hero` + SVG string overlay + `NewtonsCradleStrip`. Owns refs + active state |
| `NewtonsCradleStrip` | `sections/NewtonsCradleStrip.tsx` | Interactive tech strip. CSS keyframes, gated `prefers-reduced-motion` + `min-width: 768px` |
| `CustomCursor` | `motion/CustomCursor.tsx` | **Legacy, unmounted.** Superseded by `CursorGlow`. File on disk but unused |
