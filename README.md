# Lorenzo Portfolio

Solo freelance portfolio. Two pages: landing + `/contact`.

Build plan: see [`Lorenzo-Portfolio.md`](./Lorenzo-Portfolio.md).

## Stack

- Next.js 15 (App Router, static export)
- TypeScript, Tailwind v4
- next-themes (light/dark)
- Lucide icons
- Deploy: GitHub Pages via Actions

Motion (Motion / GSAP / Lenis) lands in Phase 2.

## Local dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

In dev, `basePath` is empty so the app runs at `/`. In a production build it switches to `/Lorenzo-Portfolio` to match the GitHub Pages deploy URL.

## Palette swap (Phase 0 review)

Both palettes are locked as CSS custom properties in [`src/app/globals.css`](src/app/globals.css). Ink Purple is the default primary; to preview Deep Navy live, set the attribute on `<html>`:

```js
document.documentElement.dataset.palette = 'navy';
// remove with: delete document.documentElement.dataset.palette
```

## Deploy

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) which builds and publishes `./out` to GitHub Pages.

Live URL: <https://llllamas.github.io/Lorenzo-Portfolio/>

When a custom domain is added (Phase 4):
1. Drop the domain into `public/CNAME`
2. Remove `basePath` from [`next.config.ts`](next.config.ts)
3. Update `copy.meta.siteUrl` in [`src/content/copy.ts`](src/content/copy.ts)
