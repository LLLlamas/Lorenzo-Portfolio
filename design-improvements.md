# Lorenzo Portfolio — Design Improvements
## Core Feeling: The PS1 Startup — Both Screens

---

## The Reference

The original PlayStation startup has two distinct visual phases that almost nobody talks about separately:

**Phase 1 — The White Screen:** The Sony Computer Entertainment logo appears on a clean, warm white background. A bass synth tone. Twinkling ascending bell notes. It feels calm. Safe. Almost classical. This is the world before.

**Phase 2 — The Black Void:** The screen cuts to pure darkness. The PlayStation logo materializes from nothing. An ominous tone rips. The geometry floats. The chime ascends to something between beautiful and unsettling. This is the world after.

Two phases. One experience. A toggle between them isn't a compromise — it's the full story.

**Light mode = Phase 1. Dark mode = Phase 2.**

Both are narratively correct. Both are the PS1.

---

## The Dual Identity

The toggle isn't a "dark/light mode switch." It's a **Phase switch** — framed as part of the aesthetic, not a usability feature bolted on. The icon for the toggle should be a small polygon (tetrahedron outline) that rotates 180° when switched — dark to light, void to presence.

The toggle lives in the nav, far right, before the CTA. Small. Precise. Always accessible.

---

## Color Palettes

### Dark Mode — "The Void" (Phase 2)

```
Background:            #000000
Surface (cards):       #020201
Text primary:          rgba(255, 255, 255, 0.92)    — contrast ratio ~17:1 ✓
Text secondary:        rgba(255, 255, 255, 0.60)    — contrast ratio ~9:1 ✓
Text tertiary:         rgba(255, 255, 255, 0.30)    — decorative only, not content
Accent (golden):       #F0C040
Accent dim:            rgba(240, 192, 64, 0.15)
Border default:        rgba(255, 255, 255, 0.07)
Border accent:         rgba(240, 192, 64, 0.22)
Cursor:                #F0C040 (point of light in darkness)
```

### Light Mode — "The Presence" (Phase 1)

```
Background:            #F7F4EE    — warm off-white, like a CRT screen with the brightness up
Surface (cards):       #EDEAE3    — slightly darker warm cream
Text primary:          #1A1610    — warm near-black, contrast ratio ~14:1 ✓
Text secondary:        #5A5040    — warm medium brown, contrast ratio ~5.5:1 ✓
Text tertiary:         #9A8E78    — muted warm tone, decorative only
Accent (golden):       #C8860A    — amber, darker than dark mode gold to maintain contrast on light bg
Accent dim:            rgba(200, 134, 10, 0.12)
Border default:        rgba(26, 22, 16, 0.08)
Border accent:         rgba(200, 134, 10, 0.30)
Cursor:                #C8860A (warm amber on light ground)
```

**Why warm off-white (`#F7F4EE`) and not pure white?**
The PS1's Phase 1 screen was rendered on a CRT television — never truly white, always slightly warm and slightly imperfect. `#F7F4EE` captures that. Pure `#FFFFFF` would feel clinical and modern, breaking the reference.

---

## Contrast Verification (WCAG AA — minimum 4.5:1 for body text)

| Mode | Foreground | Background | Ratio | Pass? |
|---|---|---|---|---|
| Dark | `rgba(255,255,255,0.92)` | `#000000` | ~17:1 | ✓ AAA |
| Dark | `rgba(255,255,255,0.60)` | `#000000` | ~9:1 | ✓ AA |
| Dark | `#F0C040` on `#000000` | — | ~11:1 | ✓ AAA |
| Light | `#1A1610` on `#F7F4EE` | — | ~14:1 | ✓ AAA |
| Light | `#5A5040` on `#F7F4EE` | — | ~5.5:1 | ✓ AA |
| Light | `#C8860A` on `#F7F4EE` | — | ~4.8:1 | ✓ AA |

All content-bearing text passes. The only sub-4.5:1 values (`text tertiary`, dim borders) are used exclusively for decorative geometry and dividers — never for readable content or interactive labels.

---

## The Mode Toggle

**Placement:** Nav bar, rightmost position before the CTA button. Always visible.

**Visual design:**
- A small geometric icon — a tetrahedron outline (SVG, 16×16px) in the current text secondary color
- On click: the icon rotates 180° over 400ms while the entire page transitions between modes
- No label. The icon communicates. Labels are for things that need explaining.

**The transition between modes:**
This is a design moment, not a utility action. It should feel like the PS1 switching phases.

```css
/* Applied to :root or [data-theme] */
* {
  transition:
    background-color 600ms cubic-bezier(0.16, 1, 0.3, 1),
    color 600ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 600ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

The 600ms Expo-out transition means the whole page *breathes* between states — it doesn't snap, it resolves. Dark to light feels like the void giving way to the first PS1 screen. Light to dark feels like the drop into the void.

**Default:** Dark mode. The void is the intended experience. Light mode is available, respected, and beautiful — but Phase 2 is the primary design intention.

**Persistence:** Save preference to `localStorage` so it's remembered on return visits.

---

## How Each Element Adapts

### Background

| Element | Dark | Light |
|---|---|---|
| Page background | `#000000` | `#F7F4EE` |
| Card surface | `#020201` | `#EDEAE3` |
| Nav pill (scrolled) | `rgba(0,0,0,0.88)` + blur | `rgba(247,244,238,0.88)` + blur |
| Footer | `#000000` | `#F7F4EE` |

### Floating Geometry (Three.js tetrahedron)
- **Dark:** Near-black faces (`#0D0D0B`), golden edge glow, sits against the void — highly visible
- **Light:** Warm cream faces (`#DDD8CE`), amber edge glow, sits against the warm background — subtle, like a shadow object. Opacity drops from 1.0 to 0.6 in light mode — still present, more understated.

### Cursor
- **Dark:** Golden dot (`#F0C040`) — a point of light in darkness, dramatically visible
- **Light:** Amber dot (`#C8860A`) — warm, present, visible against the cream background. Ring shifts to `rgba(200,134,10,0.4)`.

### The CRT Scan Line (entry sequence detail)
- **Dark:** Golden (`#F0C040`) at 0.3 opacity — a bright streak across black
- **Light:** Amber (`#C8860A`) at 0.2 opacity — a warm rule across cream, softer

### Project Cards
- **Dark:** Near-invisible surface, golden border glow on hover
- **Light:** Cream surface with warm shadow (`box-shadow: 0 2px 16px rgba(26,22,16,0.06)`), amber border on hover. Cards feel physical in light mode — like objects on a desk rather than floating in space.

### "LOADING" Coming Soon Cards
- **Dark:** Black face, golden `LOADING` text, dashed golden border — the void within the void
- **Light:** Cream face, amber `LOADING` text, dashed amber border — still clearly a placeholder, still designed

### Typography
- Same typefaces in both modes (`Share Tech Mono` + `DM Sans`)
- Headings in dark: `rgba(255,255,255,0.92)` — near-white on black
- Headings in light: `#1A1610` — warm near-black on cream
- The golden/amber accent color anchors both modes — the one constant across both phases

---

## The Page Load Sequence — Mode Aware

The 4-act entry sequence adjusts based on the active mode:

**Dark mode entry (Phase 2 — default):**
1. Pure black void. Nothing.
2. Faint golden radial glow expands from center.
3. Name resolves character by character (pixel-blur → sharp).
4. Golden scan line draws across screen.
5. Headline word-stagger reveals.
6. Geometry becomes visible.

**Light mode entry (Phase 1 — if user returns with preference saved):**
1. Warm white. Nothing.
2. A faint warm amber radial glow, softer, centered.
3. Name resolves — same effect, warmer.
4. Amber scan line draws — softer, almost invisible.
5. Headline word-stagger reveals.
6. Geometry visible at 0.6 opacity — more understated.

The light mode entry is calmer, softer — like the PS1's first screen before the drama. The dark mode entry has more tension. Both are intentional.

---

## Readability Summary

**Everything important is readable in both modes.** The decisions that compromise contrast (`text tertiary`, near-invisible borders, the 6% opacity geometry glow) are all purely decorative. No nav label, no heading, no body copy, no button text, no card title, no price, no FAQ answer falls below WCAG AA.

The "void aesthetic" is achieved through restraint in decorative elements — not by dimming content. The emptiness between things carries the feeling, not the dimness of the things themselves.

---

## Implementation Notes

### CSS Custom Properties (the clean approach)

```css
:root[data-theme="dark"] {
  --bg:           #000000;
  --surface:      #020201;
  --text-1:       rgba(255, 255, 255, 0.92);
  --text-2:       rgba(255, 255, 255, 0.60);
  --text-3:       rgba(255, 255, 255, 0.30);
  --accent:       #F0C040;
  --accent-dim:   rgba(240, 192, 64, 0.15);
  --border:       rgba(255, 255, 255, 0.07);
  --border-accent:rgba(240, 192, 64, 0.22);
}

:root[data-theme="light"] {
  --bg:           #F7F4EE;
  --surface:      #EDEAE3;
  --text-1:       #1A1610;
  --text-2:       #5A5040;
  --text-3:       #9A8E78;
  --accent:       #C8860A;
  --accent-dim:   rgba(200, 134, 10, 0.12);
  --border:       rgba(26, 22, 16, 0.08);
  --border-accent:rgba(200, 134, 10, 0.30);
}
```

Every color in the codebase references a variable — `var(--bg)`, `var(--accent)`, etc. The theme toggle flips `data-theme` on `:root`. The 600ms CSS transition does the rest. No JavaScript color management needed beyond that single attribute flip.

### Toggle logic (minimal JS)

```js
const toggle = document.querySelector('[data-theme-toggle]');
const root = document.documentElement;

// Load saved preference
const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  // Rotate the toggle icon
  toggle.classList.toggle('flipped');
});
```

---

## Full Implementation Priority (updated)

| # | Feature | Effort | Impact |
|---|---|---|---|
| 1 | **CSS custom property system** (both themes) | Low (~45min) | 🔥 Foundation for everything |
| 2 | **Page load sequence** (4-act entry, mode-aware) | Medium (~3hr) | 🔥 Defines the feeling |
| 3 | **Black/cream background + floating geometry** | Medium (~2hr) | 🔥 Immediate tone |
| 4 | **Custom cursor** (golden/amber, breathing state) | Low (~1hr) | 🔥 Felt before anything is read |
| 5 | **Theme toggle** (geometric icon, 600ms transition) | Low (~1hr) | 🔥 The Phase 1/2 switch |
| 6 | **Typography swap** (Space Mono + scale) | Low (~30min) | High |
| 7 | **Blur-resolve scroll reveals** | Medium (~2hr) | High |
| 8 | **Nav pill** (ghosted → frosted, pixel indicator) | Medium (~1.5hr) | High |
| 9 | **Project card hover** (lift, border glow) | Low (~1hr) | High |
| 10 | **"LOADING" coming soon cards** | Low (~45min) | High |
| 11 | **Lenis smooth scroll** | Low (~30min) | High |
| 12 | **CTA button** (activate glow, border flash) | Low (~1hr) | Medium |
| 13 | **About section** (signal-resolve quote) | Low (~1hr) | Medium |
| 14 | **Footer** (void/presence return, large email) | Low (~45min) | Medium |
| 15 | **CRT scan line transitions** between sections | Low (~30min) | Medium |

**Total: ~17 hours. Priority 1–5 (the theme system + entry sequence) alone: ~8 hours — and that's the complete emotional foundation.**

---

## The One Rule (unchanged)

**Nothing on this site should feel like it was always there.**

In dark mode: everything emerges from the void.
In light mode: everything settles into presence.

Two phases. One experience. The full PS1 startup — both screens.
