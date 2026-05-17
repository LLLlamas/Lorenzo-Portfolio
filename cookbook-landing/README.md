# Llamas Cookbook — Landing Page

Self-contained marketing page for the Llamas Cookbook iOS app. No build step, no
dependencies. Open `index.html` in a browser to preview; deploy the folder as-is
to any static host (Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages).

## Files

| File | Purpose |
|---|---|
| `index.html` | The page — all content and structure |
| `styles.css` | Warm food-aesthetic styling (accent `#C97C5D`, the app's terracotta) |
| `script.js` | Scroll-reveal + footer year. Progressive enhancement only — page works without JS |
| `favicon.svg` | Pot mark, terracotta |

## Placeholders to replace before launch

Search the codebase for `PLACEHOLDER` — every spot is commented. Summary:

- **App Store links** — every `href="#"` on an `.appstore`, `.btn`, or footer link. Point at the real App Store URL once the app is approved.
- **App Store badge** — the inline Apple-logo SVG is a stand-in. Swap for Apple's official "Download on the App Store" badge ([developer.apple.com/app-store/marketing/guidelines](https://developer.apple.com/app-store/marketing/guidelines/)).
- **Screenshots** — three `.phone__screen--placeholder` blocks (hero, showcase) and one `.how__card--photo` block. Replace the placeholder `<div>` content with real screenshot `<img>` tags. Phone frame is 9:19.5 — export screenshots at that ratio.
- **Domain** — `REPLACE-WITH-DOMAIN.com` appears in the Open Graph tags and the contact `mailto:`. Replace with the real domain.
- **OG image** — create `og-image.png` (1200×630) and place it at the site root.
- **Privacy / Support pages** — footer links currently point to `#`. Wire to real pages.
- **Privacy wording** — the FAQ "Is my data private?" answer has a note to confirm against the final privacy policy.

## Content notes

- Pricing reflects current decisions: Free tier + Pro at **$2.99/mo · $29.99/yr**.
- Pro features flagged: AI photo import, multiple timers, iCloud sync, themes.
- The "how it works" section sells the AI photo import — the right-hand card is a
  real HTML recipe card (not a placeholder) so the *result* of the feature looks
  concrete even before screenshots are added.

## Hosting

It's a static folder. Drag it into Netlify, run `vercel`, push to a GitHub Pages
repo, or upload anywhere. No configuration needed.
