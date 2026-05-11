# Mobile Animation & 3D Effects Guide
### For: `llllamas.github.io/Lorenzo-Portfolio`

> A field guide for turning desktop 3D magic into mobile-first "wow" moments.
> All techniques are ordered from **quickest win → deepest implementation**.

---

## Table of Contents

1. [The Core Problem](#the-core-problem)
2. [Technique 1 — Gyroscope Tilt (Highest Impact)](#technique-1--gyroscope-tilt)
3. [Technique 2 — Scroll-Driven Animations](#technique-2--scroll-driven-animations)
4. [Technique 3 — Spring Tap Feedback](#technique-3--spring-tap-feedback)
5. [Technique 4 — Scroll Snap + Swipe Carousel](#technique-4--scroll-snap--swipe-carousel)
6. [Technique 5 — View Transitions API](#technique-5--view-transitions-api)
7. [Technique 6 — Glassmorphism Sticky Nav](#technique-6--glassmorphism-sticky-nav)
8. [Technique 7 — Staggered Reveal Animations](#technique-7--staggered-reveal-animations)
9. [Technique 8 — Ripple Effect on Tap](#technique-8--ripple-effect-on-tap)
10. [Technique 9 — Perspective Scene Depth](#technique-9--perspective-scene-depth)
11. [Performance Rules](#performance-rules)
12. [Accessibility — prefers-reduced-motion](#accessibility--prefers-reduced-motion)
13. [Implementation Priority List](#implementation-priority-list)

---

## The Core Problem

Desktop 3D effects (card rotations, parallax, depth shifts) are driven by **mouse movement** — which doesn't exist on touch devices. Mobile users see a flat, static version of what desktop users experience as alive and dimensional.

The fix is not to remove the 3D — it's to **replace mouse input with touch-native inputs**: gyroscope data, scroll position, and tap events.

**Touch-native input sources:**
| Desktop Input | Mobile Replacement |
|---|---|
| Mouse X/Y position | `DeviceOrientation` (gyroscope beta/gamma) |
| Mouse hover | Scroll-triggered `IntersectionObserver` |
| Mouse click feedback | Spring tap animation + visual ripple |
| Drag to pan | CSS `scroll-snap` + touch momentum |

---

## Technique 1 — Gyroscope Tilt

**Impact: ⭐⭐⭐⭐⭐ | Effort: Medium | Timeline: ~2 hours**

This is the single biggest "wow" moment for mobile. When a user tilts their phone, your project cards tilt in 3D space with them. It's the same effect as an iPhone home screen in perspective mode, or a holographic trading card.

### How it works

The `DeviceOrientationEvent` gives you three angles:
- `beta` — front/back tilt (-180° to 180°)
- `gamma` — left/right tilt (-90° to 90°)
- `alpha` — compass direction (less useful here)

### Implementation

```js
// gyroTilt.js — drop into your portfolio
function initGyroTilt(selector = '.project-card') {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;

  const MAX_TILT = 12; // degrees — keep subtle

  function applyTilt(beta, gamma) {
    // Clamp values so extreme tilts don't break layout
    const tiltX = Math.min(Math.max(beta * 0.15, -MAX_TILT), MAX_TILT);
    const tiltY = Math.min(Math.max(gamma * 0.25, -MAX_TILT), MAX_TILT);

    cards.forEach(card => {
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  }

  function handleOrientation(e) {
    applyTilt(e.beta ?? 0, e.gamma ?? 0);
  }

  // iOS 13+ requires explicit permission from a user gesture
  async function requestGyro() {
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      // Android + older iOS — no permission needed
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  // Only run on mobile (touch devices)
  if ('ontouchstart' in window) {
    // Trigger permission on first meaningful tap
    document.addEventListener('touchstart', requestGyro, { once: true });
  }
}

initGyroTilt('.project-card');
```

```css
/* Add to your card CSS */
.project-card {
  transition: transform 0.08s linear; /* Very fast — feels live */
  will-change: transform;
  transform-style: preserve-3d;
}
```

### Notes
- **iOS 13+** requires `requestPermission()` triggered from a user gesture (tap). You can't auto-trigger it on page load.
- Always **check if values are null** — some low-end Android devices return null even though the event fires. Fall back gracefully.
- Keep tilt multipliers small (0.1–0.25). Overshooting looks broken.
- Fallback for devices without gyroscope: nothing happens, cards stay flat. This is fine.

---

## Technique 2 — Scroll-Driven Animations

**Impact: ⭐⭐⭐⭐⭐ | Effort: Low–Medium | Timeline: ~1–3 hours**

Replaces hover-triggered animations with scroll-triggered ones. As the user scrolls, elements animate into view with depth, fade, and movement. This is the primary "aliveness" technique when the page isn't being tilted.

### Option A — Pure CSS (2026 native, no JS)

```css
/* Fade + rise on scroll — no JS required */
.project-card {
  animation: fadeRise linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@keyframes fadeRise {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

> **Browser support note**: `animation-timeline: view()` is supported in Chrome/Edge 115+ and Safari 18+. Firefox support is in progress. Add a fallback (elements visible by default) for unsupported browsers using `@supports`.

### Option B — IntersectionObserver (broader support)

```js
// Works in all modern browsers
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Animate once only
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Option C — GSAP ScrollTrigger (most powerful)

```js
// If you want pinning, scrubbing, 3D cylinder text effects, etc.
gsap.from('.project-card', {
  scrollTrigger: {
    trigger: '#work',
    start: 'top 80%',
    scrub: 1, // Ties animation to scroll position (feels physical)
  },
  y: 60,
  opacity: 0,
  stagger: 0.1,
  rotateX: 15,
});
```

GSAP's `scrub: 1` is the key property — it makes the animation literally follow the user's thumb as they scroll, which feels native and physical.

---

## Technique 3 — Spring Tap Feedback

**Impact: ⭐⭐⭐⭐ | Effort: Very Low | Timeline: ~30 minutes**

The most underrated mobile technique. On desktop, users get hover feedback. On mobile, buttons and cards feel "dead" unless you add tap physics. A spring bounce on tap replicates the tactile feedback of native iOS apps and makes every touch feel intentional.

### CSS-only approach

```css
/* Add to any interactive element */
.project-card,
.cta-button,
.nav-link {
  /* Fast compress on press, slow spring release */
  transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent; /* Remove ugly default iOS tap flash */
}

/* Using :active for touch press state */
.project-card:active,
.cta-button:active {
  transform: scale(0.96);
}
```

The cubic-bezier `(0.34, 1.56, 0.64, 1)` is a **spring curve** — it overshoots slightly (goes past 1.0) before settling. This is what makes it feel like a native app bounce vs a flat CSS scale.

### JS approach (more control)

```js
document.querySelectorAll('.project-card, .cta-button').forEach(el => {
  el.addEventListener('touchstart', () => {
    el.style.transform = 'scale(0.96)';
    el.style.transition = 'transform 80ms ease-out';
  }, { passive: true });

  el.addEventListener('touchend', () => {
    el.style.transform = 'scale(1)';
    el.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  }, { passive: true });
});
```

### Timing cheat sheet
| Duration | Use case |
|---|---|
| 80–120ms | Tap compress (feels instant, physical) |
| 200ms | Standard UI state change |
| 300–500ms | Cards entering view |
| 400ms spring | Tap release / bounce back |
| 500–800ms | Page-level transitions |
| >1000ms | Almost always too slow |

---

## Technique 4 — Scroll Snap + Swipe Carousel

**Impact: ⭐⭐⭐⭐ | Effort: Low | Timeline: ~1 hour**

Replace your static project grid with a horizontal swipe carousel on mobile. This is one of the most "native app" feelings you can add to a web portfolio. Combined with momentum scrolling, it feels indistinguishable from an iOS app.

```css
/* Carousel container */
.projects-carousel {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
  scrollbar-width: none; /* Hide scrollbar on Firefox */
  padding: 1rem 1.5rem;
}
.projects-carousel::-webkit-scrollbar {
  display: none; /* Hide scrollbar on Chrome/Safari */
}

/* Each card snaps into place */
.project-card {
  scroll-snap-align: start;
  flex: 0 0 80vw; /* Cards are 80% of viewport width */
  max-width: 360px;
}
```

```css
/* On desktop: revert to normal grid */
@media (min-width: 768px) {
  .projects-carousel {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    overflow-x: visible;
    scroll-snap-type: none;
  }
  .project-card {
    flex: unset;
    max-width: unset;
  }
}
```

### Swipe indicator dots (optional but polished)
Add a simple IntersectionObserver to update dot indicators as cards snap into view. This signals to users that more cards exist and helps them track position.

---

## Technique 5 — View Transitions API

**Impact: ⭐⭐⭐⭐ | Effort: Medium | Timeline: ~2 hours**

Makes navigation between pages feel like a native app — elements morph between states rather than hard-cutting. Clicking a project card could smoothly zoom into a project detail view.

```js
// Wrap navigation in a view transition
async function navigateTo(url) {
  if (!document.startViewTransition) {
    // Fallback for unsupported browsers
    window.location.href = url;
    return;
  }

  const transition = document.startViewTransition(() => {
    window.location.href = url;
  });
}

// Add view-transition-name to matched elements
// The browser will animate between elements with the same name
```

```css
/* Give specific elements named transition identities */
.project-card[data-project="bite-defense"] {
  view-transition-name: project-bite-defense;
}

/* Customize the transition animation */
::view-transition-old(project-bite-defense) {
  animation: scale-out 250ms ease-in;
}
::view-transition-new(project-bite-defense) {
  animation: scale-in 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes scale-out {
  to { transform: scale(0.9); opacity: 0; }
}
@keyframes scale-in {
  from { transform: scale(1.05); opacity: 0; }
}
```

> **Browser support**: Chrome/Edge 111+, Safari 18+. Firefox has partial support. Always wrap in a feature check.

---

## Technique 6 — Glassmorphism Sticky Nav

**Impact: ⭐⭐⭐ | Effort: Very Low | Timeline: ~20 minutes**

On mobile, a frosted glass nav that appears on scroll adds premium feel without performance cost. `backdrop-filter` is GPU-accelerated.

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 15, 14, 0.6); /* Match your #0F0F0E */
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.3s ease;
}

/* More opaque when scrolled */
.nav.scrolled {
  background: rgba(15, 15, 14, 0.88);
}
```

```js
window.addEventListener('scroll', () => {
  document.querySelector('.nav')
    .classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
```

---

## Technique 7 — Staggered Reveal Animations

**Impact: ⭐⭐⭐⭐ | Effort: Low | Timeline: ~45 minutes**

Instead of all elements appearing at once, stagger their animation delays to create a cascading reveal effect. This makes the page feel orchestrated and intentional — like it was designed rather than just loaded.

```css
/* Hero section — words animate in one by one */
.hero-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(24px);
  animation: wordReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Apply via JS or nth-child */
.hero-word:nth-child(1) { animation-delay: 0.1s; }
.hero-word:nth-child(2) { animation-delay: 0.2s; }
.hero-word:nth-child(3) { animation-delay: 0.3s; }

@keyframes wordReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

```js
// Split hero text into animatable words dynamically
function splitWords(el) {
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words
    .map((w, i) => `<span class="hero-word" style="animation-delay:${i * 0.1}s">${w}</span>`)
    .join(' ');
}

splitWords(document.querySelector('.hero-headline'));
```

For project cards, stagger them as they scroll into view:

```css
.project-card:nth-child(1) { transition-delay: 0s; }
.project-card:nth-child(2) { transition-delay: 0.05s; }
.project-card:nth-child(3) { transition-delay: 0.1s; }
.project-card:nth-child(4) { transition-delay: 0.15s; }
```

---

## Technique 8 — Ripple Effect on Tap

**Impact: ⭐⭐⭐ | Effort: Low | Timeline: ~45 minutes**

Ripple effects are the mobile equivalent of hover states — they confirm the user's touch point and spread from where they tapped. Standard in Material Design, but can be styled elegantly for any aesthetic.

```js
function addRipple(e) {
  const el = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = el.getBoundingClientRect();
  
  // Calculate tap position relative to element
  const touch = e.touches?.[0] ?? e;
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  const size = Math.max(rect.width, rect.height) * 2;

  ripple.style.cssText = `
    position: absolute;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    transform: scale(0);
    animation: ripple-expand 500ms ease-out forwards;
    pointer-events: none;
  `;

  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  
  ripple.addEventListener('animationend', () => ripple.remove());
}

document.querySelectorAll('.project-card, .cta-button').forEach(el => {
  el.addEventListener('touchstart', addRipple, { passive: true });
});
```

```css
@keyframes ripple-expand {
  to {
    transform: scale(1);
    opacity: 0;
  }
}
```

---

## Technique 9 — Perspective Scene Depth

**Impact: ⭐⭐⭐⭐ | Effort: Low | Timeline: ~30 minutes**

Instead of adding `perspective()` per-element (which is what most 3D tutorials do), set it on a **wrapper** and use `translateZ` on children. This creates a true 3D scene where multiple elements live at different depths — making the gyro tilt from Technique 1 feel like the whole page has depth, not just individual cards.

```css
/* Apply to your hero or work section wrapper */
.scene-wrapper {
  perspective: 900px;
  perspective-origin: 50% 50%;
}

/* Layer elements at different Z depths */
.hero-headline {
  transform: translateZ(40px); /* Closer to user */
}

.hero-subtext {
  transform: translateZ(20px);
}

.hero-background-decoration {
  transform: translateZ(-30px); /* Further away */
}
```

When combined with gyroscope tilt, these elements shift at different rates relative to the tilt angle — creating genuine parallax depth across the scene.

### Layered depth cheat sheet
| Layer | Z value | Effect |
|---|---|---|
| Foreground text | `translateZ(40–60px)` | Most movement on tilt |
| Cards / mid elements | `translateZ(10–25px)` | Moderate movement |
| Background deco | `translateZ(-20px to -50px)` | Subtle counter-movement |

---

## Performance Rules

Mobile GPUs are powerful but have strict rules. Break these and animations become janky:

### Only animate these properties (GPU-accelerated)
- `transform` (translate, rotate, scale, perspective)
- `opacity`
- `filter` (blur, brightness — use sparingly)

### Never animate these on mobile (triggers layout)
- `width`, `height`, `top`, `left`, `bottom`, `right`
- `margin`, `padding`
- `box-shadow` (use `filter: drop-shadow()` instead)
- `border-radius` (unless very simple)

### Key hints
```css
/* Tell the browser to pre-promote elements that will animate */
.project-card {
  will-change: transform, opacity;
}

/* Remove will-change after animation completes to free memory */
/* Only add it to elements that WILL animate, not all elements */
```

### Event listener best practices
```js
// Always use passive: true for scroll and touch listeners
// This tells the browser it can scroll without waiting for your JS
window.addEventListener('scroll', handler, { passive: true });
el.addEventListener('touchstart', handler, { passive: true });
```

### Target 60fps
- Animations should complete in 16.67ms per frame
- Use Chrome DevTools > Performance tab to record and check for dropped frames
- Test on a real phone, not just desktop DevTools device simulation

---

## Accessibility — prefers-reduced-motion

Always wrap non-essential animations in this media query. Some users have vestibular disorders where motion causes real physical discomfort:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable gyro tilt */
  .project-card {
    transform: none !important;
    transition: none !important;
  }

  /* Replace scroll animations with instant appearance */
  .animate-on-scroll {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  /* Keep only essential feedback (opacity changes are fine) */
  .cta-button:active {
    opacity: 0.8;
    transform: none;
  }
}
```

```js
// Also check in JS before starting gyro
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'ontouchstart' in window) {
  initGyroTilt();
}
```

---

## Implementation Priority List

Start with the highest-impact items that require the least effort:

| Priority | Technique | Time | Why First |
|---|---|---|---|
| **1** | Spring Tap Feedback | 30 min | Zero risk, instant feel improvement on every touch |
| **2** | Glassmorphism Nav | 20 min | Instant premium look on scroll |
| **3** | Staggered Scroll Reveal | 45 min | Biggest visual upgrade to page feel |
| **4** | Scroll Snap Carousel | 1 hr | Makes the project section feel native |
| **5** | Gyroscope Tilt | 2 hrs | The "wow" moment — best on desktop/mobile split |
| **6** | Ripple Effect | 45 min | Polishes every tap interaction |
| **7** | Perspective Scene Depth | 30 min | Amplifies gyro effect once that's in |
| **8** | Scroll-Driven Animations | 1–3 hrs | Replaces static content with kinetic page |
| **9** | View Transitions API | 2 hrs | Premium page nav feel (save for last) |

---

## Quick Reference — Key CSS Snippet Collection

```css
/* Spring easing (use everywhere on mobile) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Smooth ease-out (for entering elements) */
--ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);

/* Duration tokens */
--dur-instant: 80ms;   /* Tap compress */
--dur-fast: 200ms;     /* UI state change */
--dur-normal: 350ms;   /* Card/element reveal */
--dur-slow: 500ms;     /* Page-level transition */

/* Mobile tap highlight removal */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Momentum scrolling (iOS) */
.scrollable {
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection on tap-hold */
.interactive-element {
  -webkit-user-select: none;
  user-select: none;
}
```

---

*Last updated: May 2026*
*Sources: MDN Web Docs (DeviceOrientation API), CSS-Tricks, Codrops, Josh W. Comeau, DEV Community*
