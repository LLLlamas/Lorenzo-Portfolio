# CSS Utility Classes (`src/app/globals.css`)

| Class | What it does |
|---|---|
| `card-glow` | Accent shadow + border on hover. Baked into `<Card>` — don't apply twice |
| `btn-sweep` | Accent sweep from left on hover. Used by `<Button>` and header CTA. Override color via `style={{ ['--sweep-bg' as never]: 'var(--ink)' }}`. Replaced `btn-glow` — do not reintroduce `btn-glow` |
| `cascade-step` + `cascade-1/2/3` | Sequential hover cascade on `.group:hover`. `cascade-1` → fw 800; `cascade-2` → fw 600 + ink; `cascade-3` → accent + border. Used on Work cards + Package cards |
| `loading-blink` | 1.6s steps blink for placeholder text |
| `section-scan` | One-shot scan-line draw (used by `<ScanLine>`) |
| `motion-decorative` | Marks decorative animations — killed under `prefers-reduced-motion` |
| `nav-cube` / `nav-cube__inner` / `nav-cube__face` | 3D cube structure. Size via `--cube-w/h/d` on root |
| `brand-hex` / `brand-hex__inner` / `brand-hex__face` | Brand flip-card structure. Size via `--hex-w/h/d` on root (4.5rem × 18px depth) |
| `speed-slider` | Range input styling for `RotationSpeedSlider`. Track → `--line`, thumb → `--accent` |
| `scroll-scale` / `scroll-scale--featured` | Lusion grid enter scale 0.88→1.0. Chromium: native `animation-timeline: view()`. Safari/FF: `ScrollScaleMount` rAF fallback |
| `marquee-track` | Defined but **not applied** to `MarqueeTechStrip` (strip is static flex). Tagged `motion-decorative` |
| `pendulum-toggle` / `pendulum-toggle--active` | Pendulum button styles. Active adds accent border + radial glow |
| `cradle-string` | SVG path for HeroCradleSection strings. `pathLength=1` + `stroke-dashoffset` draw/retract |
| `pendulum-label` / `--left` / `--middle` / `--right` / `--active` | Tech-label motion in `NewtonsCradleStrip` |
| `btn-pendulum` | `transform-origin: 50% -20px`. Hover → `pendulum-swing` keyframes. Gated `(hover: hover)` + reduced-motion |
| `cradle-pair` / `cradle-left` / `cradle-right` | Newton's Cradle CTA pair. CSS `:has()` cross-triggers. 750ms keyframes |
| `scrollbar-none` | Hides scrollbar on filmstrip containers |
