# Theming & Layout Constants

## Palettes

- **Default: dark** (`defaultTheme: 'dark'`, `enableSystem: false` in `layout.tsx`)
- Two locked palettes in `globals.css`:
  - **Ink Purple** (primary): `#3D2E5C` light / `#A697C8` dark
  - **Deep Navy** (secondary)
- Live A/B switch (no rebuild): `document.documentElement.dataset.palette = 'navy'` — remove to revert
- All vars exposed to Tailwind via `@theme`: `bg-bg`, `text-ink`, `bg-accent`, `--line-accent`, etc.
- Tailwind: **CSS-first (v4), no `tailwind.config.ts`** — all tokens in `globals.css @theme {}`

## Key tokens

| Token | Value | Notes |
|---|---|---|
| `--ink-quiet` dark | `#828280` (~5.3:1) | WCAG AA on dark bg |
| `--ink-quiet` light | `#6E6D68` (~4.8:1) | WCAG AA on light bg |
| `--ink-soft` | `#B5B4AE` dark / `#5A5A5A` light | |
| `--line-accent` | rgba accent | Hover ring on cards / nav boxes / hexagon |
| `--geo-face` / `--geo-edge` / `--geo-opacity` | Per-mode | `FloatingGeometry` CSS-var MutationObserver reads these on dark class flip |

Global theme transition: 600ms expo-out on `background-color`, `color`, `border-color`, `fill`, `stroke`.

## Header height coupling — change all four together

Header is `h-24`. These are all linked:

| Location | Value |
|---|---|
| `src/components/nav/Header.tsx` | `h-24` |
| `src/app/layout.tsx` `<main>` | `pt-24` |
| `src/components/motion/SmoothScroll.tsx` | `offset: -96` |
| `src/app/globals.css` sections | `scroll-margin-top: 6rem` |

The 3D cubes/hex prism need the extra vertical room for perspective during hover flip.

## Section IDs (anchor targets)

`#hero` · `#about` · `#work` · `#capabilities` · `#packages` · `#faq` · `#contact-cta`

All get `scroll-margin-top: 5rem` from `globals.css` to clear the fixed header.

**No active-section indicator** — removed by user request. Do not reintroduce. If ever needed: rAF-throttled scroll check for which section straddles a reading line ≈33% from top — not IntersectionObserver (behaves poorly on variable-height sections).

## Film grain overlay

`body::after` in `globals.css`: SVG noise, `z-9999`, `pointer-events: none`, killed under `prefers-reduced-motion`.
