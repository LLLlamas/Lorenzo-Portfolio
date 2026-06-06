# Content Guide

**All copy lives in `src/content/`.** Section components consume; never hard-code copy in JSX.

## What to edit and where

| Want to change | File | Key |
|---|---|---|
| Hero headline / subhead | `src/content/copy.ts` | `copy.hero` |
| About paragraphs / pull-quote | `src/content/copy.ts` | `copy.about` |
| Capability cards | `src/content/copy.ts` | `copy.capabilities.items` — each item has a `tags[]` driving hover tech-pills |
| Contact email / Cal.com link | `src/content/copy.ts` | `copy.meta` |
| Tech strip labels | `src/content/tech-stack.ts` | used by both `MarqueeTechStrip` and `NewtonsCradleStrip` |
| A project card | `src/content/projects.ts` | one entry per card; cover → `public/projects/<slug>.webp` |
| A project highlight | `src/content/projects.ts` | `highlights: Highlight[]` — `{ text, metric? }`. `metric` renders as large stat above text |
| A price | `src/content/packages.ts` | |
| An FAQ | `src/content/faqs.ts` | landing FAQ + contact mini-FAQ |
| Nav links | `src/components/nav/Header.tsx` | `navLinks` array → each becomes a `<NavCube>` |

## Project covers & screenshots

1. Drop source PNG into `screenshots/<anything>.PNG` (gitignored)
2. Add `[filename, outputName]` row to `MAPPINGS` in `scripts/resize-screenshots.mjs`
   - Cover: `<slug>` → `public/projects/<slug>.webp`
   - Gallery: `<slug>-1`, `<slug>-2`, … → same dir
3. Run `npm run resize-screenshots`

Brand assets: same flow but use `BRAND_MAPPINGS` → outputs to `public/brand/<name>.webp` (512px, q92).
Current logo: `public/brand/llama-logo.webp` (rendered by `BrandHexPrism` in Header).

## About portrait

Drop at `public/about/portrait.{webp,jpg}`, then replace `<AboutPlaceholder />` in `About.tsx` with `<Image>`.
Layout uses 4:5 aspect — no reflow on swap.

## Project cards — notes

- Omit `cover` field → card falls back to category-tinted gradient
- `coverFit: 'cover'` (default) → landscape screenshots, fills 16:10 card
- `coverFit: 'contain'` → portrait/mobile screenshots; when `category === 'mobile'`, auto-wraps in `<PhoneFrame>`
- Use `device: 'phone'` on gallery images for the same phone-frame treatment in the modal
- Modal shows `description`, `highlights`, `role`, `gallery`, `link`
- Gap filler (`WorkGapFiller`) auto-renders for odd counts in any category row > 1
