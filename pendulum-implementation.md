# Newton's Cradle Pendulum — Implementation Plan

## Overview

A toggle button/icon sits in the hero section (between the subhead/CTAs and the MarqueeTechStrip). When clicked, it activates a Newton's Cradle effect on the five tech-stack labels in the `MarqueeTechStrip` component: **React & React Native**, **Next.js**, **JavaScript / TypeScript**, **SwiftUI**, **UX / UI**.

The effect: vertical "strings" (lines) attach from a shared horizontal bar down to each label, and the labels begin swinging as pendulums — the outermost one pulls back, swings, transfers momentum through the middle three (which stay still), and the opposite end swings out. Classic Newton's Cradle physics.

---

## Current Architecture

### Hero (`src/components/sections/Hero.tsx`)
- Client component, uses `motion/react`
- Layout: `section#hero` → radial backdrop, FloatingGeometry (right), RotationSpeedSlider (right, below geometry), then a `max-w-5xl` content column: eyebrow → headline → subhead → CTA buttons
- CTA buttons already have a Newton's Cradle-style hover animation (`.cradle-pair` / `.cradle-left` / `.cradle-right` in `globals.css`)
- The toggle button should sit **inside** the hero section, visually between the CTA row and the MarqueeTechStrip below

### MarqueeTechStrip (`src/components/sections/MarqueeTechStrip.tsx`)
- **Server component** (no `'use client'` directive)
- Hardcoded items: `['React & React Native', 'Next.js', 'JavaScript / TypeScript', 'SwiftUI', 'UX / UI']`
- Layout: `<div>` with `border-y border-line px-6 py-5` → `<ul>` with `flex flex-wrap items-center justify-center gap-x-10 gap-y-3`
- Each `<li>` has `aura-pop` + `label-select` styling
- Currently purely static — no animation on the items themselves (the `marquee-track` class exists in CSS but isn't applied)

### Page composition (`src/app/page.tsx`)
```
<Hero />
<MarqueeTechStrip />
<About />
...
```

### Existing pendulum CSS (`globals.css:648-725`)
- `@keyframes pendulum-swing` — damped oscillation (0→-9°→7°→-4.5°→2.8°→-1.5°→0.8°→0°) over 700ms
- `.btn-pendulum` — `transform-origin: 50% -20px`
- Cradle pair keyframes — `cradle-send-right/left`, `cradle-receive-right/left` with staggered energy transfer
- Easing: `cubic-bezier(0.36, 0.07, 0.19, 0.97)` — the project's "physics" curve

---

## Design Decisions

### 1. Toggle button placement
**Where:** Centered below the CTA buttons, above the bottom edge of the hero section — roughly where the user drew the red circle (vertically centered between the CTAs and MarqueeTechStrip).

**What it looks like:** A small, minimal icon — could be:
- A pendulum/Newton's Cradle silhouette icon (custom SVG, ~20×20)
- A simple circle/orb that hints at "tap me" (matches the accent dot from CustomCursor)
- A lucide-react icon like `Activity` (wave/oscillation) or `Orbit`

**Recommendation:** Custom inline SVG of a minimal pendulum (3 circles on strings) — small, recognizable, on-brand. Alternatively, use `Disc` or `Circle` from lucide-react as the minimal trigger, with a tooltip or subtle pulse to signal interactivity.

### 2. Component architecture
The toggle + pendulum state must be **client-side** (click handler, animation state). Two approaches:

**Option A: Lift MarqueeTechStrip to client, add state**
- Convert MarqueeTechStrip to `'use client'`
- Add a `pendulumActive` prop (or internal state)
- Render strings + pendulum animation when active
- Toggle button lives in MarqueeTechStrip or is passed down

**Option B: New wrapper component**
- Create `NewtonsCradle.tsx` in `components/motion/`
- Wraps or replaces MarqueeTechStrip when active
- Toggle button + animation logic self-contained
- MarqueeTechStrip stays a server component (imported inside the client wrapper)

**Recommendation: Option B.** Keep MarqueeTechStrip pure. The new `NewtonsCradle` client component wraps it and overlays the pendulum effect. The toggle icon can live in Hero.tsx (where the user pointed) and communicate via a shared state (prop drilling through page.tsx, or a simple context/callback).

**Simplest approach:** Actually, since both Hero and MarqueeTechStrip are composed in `page.tsx`, the cleanest pattern is:
1. Make `page.tsx` a client component (it's already simple composition) **OR**
2. Create a `PendulumToggle` component in `motion/` that renders the toggle icon AND uses a portal/global to signal the MarqueeTechStrip wrapper

**Revised recommendation:** Create a `CradleSection` client component that wraps both the toggle (positioned in the hero gap) and a modified MarqueeTechStrip. Compose it in `page.tsx` right after `<Hero />`, replacing the bare `<MarqueeTechStrip />`.

### 3. Animation approach

**The pendulum physics:**

Each of the 5 labels hangs from a "string" (a thin vertical line) attached to a shared horizontal rail. When activated:

1. **Strings draw in** (0→full length, staggered 50ms per item, 400ms each) — lines extend downward from the rail to each label's top-center
2. **Labels get `transform-origin: top center`** — they pivot from where the string meets the label
3. **Cradle animation begins:**
   - Left-most label (`React & React Native`) pulls back (rotates -25° to -30°)
   - Swings forward, hits the stationary middle 3
   - Right-most label (`UX / UI`) swings out (+25° to +30°)
   - Momentum bounces back and forth with damping
   - Cycle repeats (infinite loop with gradual dampening, or a clean loop)
4. **On toggle off:** Labels swing to rest (spring-to-zero), strings retract, back to normal

**CSS vs JS animation:**

| Approach | Pros | Cons |
|----------|------|------|
| Pure CSS `@keyframes` | No JS overhead, matches existing patterns | Hard to chain the multi-ball transfer; can't easily loop with physics | 
| GSAP timeline | Already in the project, precise sequencing, physics easing | Heavier; GSAP is currently only used in FloatingGeometry |
| Motion (framer-motion) | Already imported everywhere, spring physics built-in | Pendulum loop is complex with `animate` sequences |
| Canvas/SVG animation | True physics simulation possible | Overkill, doesn't animate DOM labels |

**Recommendation: GSAP timeline.** GSAP is already a dependency (used in FloatingGeometry). A GSAP timeline gives precise control over the multi-ball energy transfer sequence, supports `yoyo` and `repeat` for the continuous swing, and the `CustomEase` / standard easing curves match the project's physics feel. The labels stay as DOM elements — GSAP animates their `rotation` with `transformOrigin: 'top center'`.

**Alternative: CSS @keyframes with delays.** If we want to stay pure CSS (matching the cradle-pair pattern), we can define 5 keyframe sets — one for each ball position — and trigger them via a `.cradle-active` class. The timing math is trickier but doable.

### 4. String rendering

**SVG overlay approach:**
- An absolutely-positioned `<svg>` sits on top of the MarqueeTechStrip
- For each label, calculate its center-x position
- Draw a `<line>` from a shared y (the "rail" at the top) to each label's top-center
- Lines rotate with their label (attached at the pivot point)

**CSS pseudo-element approach:**
- Each `<li>` gets a `::before` that's a thin vertical line (`width: 1px; background: var(--line)`)
- Positioned above the label, extending upward to the rail
- Rotates with the label since it's a child

**Recommendation: CSS pseudo-element.** Simpler, no coordinate math, rotates naturally with the parent `<li>`. The "rail" is just the `border-top` of the MarqueeTechStrip container (already has `border-y border-line`).

### 5. Reduced motion / touch

- Gate everything on `prefers-reduced-motion: no-preference`
- Under reduced motion: toggle still works, but labels just get a subtle highlight/pulse instead of swinging
- Touch devices: toggle works (it's a click, not hover), animation plays — pendulums are visual-only, no interaction needed
- The toggle button itself should be keyboard-accessible (`<button>` with `aria-label`)

---

## Implementation Steps

### Step 1: Create the toggle icon component

**File:** `src/components/motion/PendulumToggle.tsx`

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';

interface PendulumToggleProps {
  active: boolean;
  onToggle: () => void;
}

export function PendulumToggle({ active, onToggle }: PendulumToggleProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      onClick={onToggle}
      aria-label={active ? 'Stop pendulum animation' : 'Start pendulum animation'}
      aria-pressed={active}
      className="group relative mx-auto flex size-8 items-center justify-center rounded-full 
                 text-ink-quiet transition-colors hover:text-accent"
      whileHover={prefersReduced ? {} : { scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Minimal pendulum icon — 3 circles on strings */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" y1="2" x2="10" y2="2" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="1" />
        {/* Left string + ball */}
        <line x1="7" y1="2" x2="7" y2="14" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="7" cy="15" r="2" fill="currentColor" />
        {/* Center string + ball */}
        <line x1="10" y1="2" x2="10" y2="14" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="10" cy="15" r="2" fill="currentColor" />
        {/* Right string + ball — pulled back when active */}
        <line x1="13" y1="2" x2="13" y2="14" stroke="currentColor" strokeWidth="0.75" 
              className={active ? 'origin-top transition-transform' : ''} />
        <circle cx="13" cy="15" r="2" fill="currentColor" />
      </svg>
    </motion.button>
  );
}
```

### Step 2: Create the Newton's Cradle wrapper

**File:** `src/components/motion/NewtonsCradleStrip.tsx`

This is the main component. It:
- Renders the MarqueeTechStrip items (duplicated from the server component, since we need refs)
- Adds string pseudo-elements when active
- Runs the GSAP pendulum animation

```tsx
'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const ITEMS = [
  'React & React Native',
  'Next.js',
  'JavaScript / TypeScript',
  'SwiftUI',
  'UX / UI',
];

interface NewtonsCradleStripProps {
  active: boolean;
}

export function NewtonsCradleStrip({ active }: NewtonsCradleStripProps) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  const buildTimeline = useCallback(() => {
    // ...GSAP timeline construction
  }, []);

  useEffect(() => {
    if (active && !prefersReduced) {
      // Build and play the pendulum timeline
    } else {
      // Kill timeline, spring labels back to rotation: 0
    }
    return () => { tlRef.current?.kill(); };
  }, [active, prefersReduced]);

  return (
    <div className="border-y border-line px-6 py-5 relative">
      {/* Horizontal rail — visible when active */}
      {/* ... */}
      
      <ul
        aria-label="Core technologies"
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {ITEMS.map((item, i) => (
          <li
            key={item}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={cn(
              'aura-pop whitespace-nowrap text-sm font-bold uppercase tracking-[0.16em] text-ink-quiet',
              active && 'pendulum-ball'
            )}
          >
            <span className="label-select">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Step 3: GSAP pendulum timeline — the physics

The Newton's Cradle animation sequence:

```
Time →
Ball:  [0]  [1]  [2]  [3]  [4]
       React Next  JS   Swift UX

Phase 1 — Left ball pulls back:
  Ball 0: rotate from 0° to -30° (ease-out, ~300ms)
  Balls 1-4: stay at 0°

Phase 2 — Left ball swings down, hits:
  Ball 0: rotate from -30° to 0° (ease-in, ~200ms, accelerating)
  Balls 1-3: tiny micro-jolt (±0.5°, 50ms) — energy ripple
  Ball 4: starts swing from 0° to +30° (ease-out, ~250ms)

Phase 3 — Right ball at apex, returns:
  Ball 4: rotate from +30° to 0° (ease-in, ~200ms)
  Balls 1-3: micro-jolt again
  Ball 0: starts swing from 0° to -28° (slightly damped)

Phase 4+: Repeat with decreasing amplitude:
  30° → 28° → 25° → 22° → 18° → ... → restart at 30°

Or: clean infinite loop at constant amplitude (no damping, pure toy feel)
```

**GSAP implementation sketch:**

```ts
const SWING_DEG = 30;
const DURATION = 0.5;  // half-swing
const EASE_PULL = 'power2.out';
const EASE_FALL = 'power2.in';

const tl = gsap.timeline({ repeat: -1 });

// Left ball swings out
tl.to(balls[0], { rotation: -SWING_DEG, duration: DURATION, ease: EASE_PULL })
// Left ball falls back
  .to(balls[0], { rotation: 0, duration: DURATION * 0.7, ease: EASE_FALL })
// Right ball knocked out (starts slightly before left arrives — overlap)
  .to(balls[4], { rotation: SWING_DEG, duration: DURATION, ease: EASE_PULL }, '-=0.05')
// Right ball falls back  
  .to(balls[4], { rotation: 0, duration: DURATION * 0.7, ease: EASE_FALL })
// Left ball knocked out again
  .to(balls[0], { rotation: -SWING_DEG, duration: DURATION, ease: EASE_PULL }, '-=0.05');
```

### Step 4: CSS for strings and pendulum state

Add to `globals.css`:

```css
/* ─── Newton's Cradle pendulum strip ─── */
.pendulum-ball {
  transform-origin: 50% -40px;   /* pivot ~40px above label top */
  will-change: transform;
}

/* String (pseudo-element line from rail to label) */
.pendulum-ball::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 1px;
  height: 0;
  background: var(--line);
  transform: translateX(-50%);
  transition: height 400ms var(--ease-out-expo);
}

.cradle-active .pendulum-ball::before {
  height: 40px;  /* matches transform-origin offset */
}

/* Rail line across the top */
.cradle-rail {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 1px;
  background: var(--line);
  transition: width 500ms var(--ease-out-expo);
}

.cradle-active .cradle-rail {
  width: 80%;  /* spans across the labels */
}
```

### Step 5: Wire the toggle into the page

Modify `src/app/page.tsx` to wrap Hero + MarqueeTechStrip in a client boundary with shared state:

**Option A: Minimal — add a `HeroCradleSection` wrapper**

```tsx
// src/components/sections/HeroCradleSection.tsx
'use client';
import { useState } from 'react';
import { Hero } from './Hero';
import { NewtonsCradleStrip } from '../motion/NewtonsCradleStrip';
import { PendulumToggle } from '../motion/PendulumToggle';

export function HeroCradleSection() {
  const [cradleActive, setCradleActive] = useState(false);
  
  return (
    <>
      <Hero />
      {/* Toggle centered below hero, above strip */}
      <div className="flex justify-center -mt-12 mb-0 relative z-10">
        <PendulumToggle 
          active={cradleActive} 
          onToggle={() => setCradleActive(prev => !prev)} 
        />
      </div>
      <NewtonsCradleStrip active={cradleActive} />
    </>
  );
}
```

Then in `page.tsx`:
```tsx
import { HeroCradleSection } from '@/components/sections/HeroCradleSection';

export default function Home() {
  return (
    <main>
      <HeroCradleSection />
      <About />
      ...
    </main>
  );
}
```

**Option B: Keep page.tsx as server, use URL hash or global state**
Less clean — Option A is better.

### Step 6: The toggle icon position (from the screenshot)

The user drew the red circle at roughly `center-x of viewport, ~100px above the MarqueeTechStrip`. This is the gap between the hero section's bottom padding (`pb-24`) and the strip's top border.

Position the toggle:
- Horizontally: centered (`mx-auto`)
- Vertically: in the gap between hero bottom and strip top — use negative margin-top on the toggle wrapper to pull it up into the hero's bottom padding

---

## Detailed GSAP Timeline

Here's the full pendulum animation with proper Newton's Cradle physics:

```ts
function buildCradleTimeline(balls: HTMLElement[]): gsap.core.Timeline {
  const DEG = 28;
  const HALF = 0.45;     // seconds per half-swing
  const EASE_OUT = 'power2.out';   // decelerating (swinging up)
  const EASE_IN = 'power2.in';    // accelerating (swinging down)
  
  // Set pivot point for all balls
  gsap.set(balls, { transformOrigin: '50% -40px' });
  
  const tl = gsap.timeline({ 
    repeat: -1,
    defaults: { duration: HALF }
  });
  
  // ── Right-to-left swing (ball 4 pulls right, ball 0 knocked left) ──
  
  // Ball 4 (UX/UI) lifts to the right
  tl.to(balls[4], { rotation: DEG, ease: EASE_OUT })
  // Ball 4 swings back to center (falls)
    .to(balls[4], { rotation: 0, ease: EASE_IN, duration: HALF * 0.75 })
  // Ball 0 (React) knocked to the left — starts just before impact
    .to(balls[0], { rotation: -DEG, ease: EASE_OUT }, `-=${HALF * 0.08}`)
  // Ball 0 swings back to center
    .to(balls[0], { rotation: 0, ease: EASE_IN, duration: HALF * 0.75 })
  // Ball 4 knocked right again — loop continues
    .to(balls[4], { rotation: DEG, ease: EASE_OUT }, `-=${HALF * 0.08}`);
  
  // The last keyframe overlaps with the first, creating seamless repeat
  
  return tl;
}
```

### Physics tuning notes

- **Angle (DEG):** 28° gives a dramatic but not cartoonish swing. Real Newton's Cradles use ~15-20°, but the labels need more visual drama since they're text, not spheres
- **String length (transform-origin offset):** 40px above the label feels proportional. Too short = frantic wobble, too long = slow lazy arc
- **Easing:** `power2.in` for the downswing (gravity accelerates), `power2.out` for the upswing (gravity decelerates). This is physically accurate
- **Overlap (`-=0.08`):** The "clack" moment — ball 0 starts moving slightly before ball 4 fully arrives. In a real cradle the energy transfer is near-instantaneous; the tiny overlap sells it
- **No middle-ball movement:** In a real 5-ball cradle, the 3 middle balls don't move. They transmit energy as a compression wave. Keeping them perfectly still is correct physics and makes the effect cleaner

---

## Visual Polish Ideas

1. **String glow on impact:** Brief `accent` flash on the strings when the "clack" happens (the moment of energy transfer)
2. **Micro-shake on middle balls:** Instead of staying perfectly still, add a ±0.3° tremor on the middle 3 balls during impact (barely visible, but sells the physics)
3. **Sound option:** Tiny "tick" sound on each impact (Web Audio API, very short sample). Optional, maybe too much
4. **Toggle animation:** The toggle icon itself could have its pendulum balls start swinging when active
5. **String draw-in stagger:** When activating, strings appear from center outward (items 2 first, then 1+3, then 0+4)
6. **Gradual start:** First swing starts at 15° and builds to 28° over 2-3 cycles — feels like someone just tapped it vs. full force from frame 1

---

## Files to Create / Modify

| File | Action | What |
|------|--------|------|
| `src/components/motion/NewtonsCradleStrip.tsx` | **Create** | Client component: cradle animation + strip rendering |
| `src/components/motion/PendulumToggle.tsx` | **Create** | Toggle icon button |
| `src/components/sections/Hero.tsx` | **Modify** | Add toggle button in the gap below CTAs (or compose externally) |
| `src/app/page.tsx` | **Modify** | Wrap Hero + strip in a shared-state client boundary, or use HeroCradleSection |
| `src/app/globals.css` | **Modify** | Add `.pendulum-ball`, `.cradle-rail`, string pseudo-element styles |
| `src/components/sections/MarqueeTechStrip.tsx` | **Keep** | Unchanged — the new component duplicates its item list but with refs + animation capability |

---

## Accessibility

- Toggle is a `<button>` with `aria-label` and `aria-pressed`
- Under `prefers-reduced-motion`: animation doesn't play; toggle still works but just highlights the labels
- Strings and rail are `aria-hidden` (decorative)
- Labels remain readable throughout the animation (text doesn't rotate past legibility — 28° is fine, text is still readable)
- The pendulum doesn't block scroll or interaction
- Keyboard: toggle is focusable, Enter/Space activates

---

## Risk / Edge Cases

| Risk | Mitigation |
|------|------------|
| Labels wrap on narrow screens (flex-wrap) | Disable pendulum below `md` breakpoint — the flex-wrap layout breaks the horizontal cradle metaphor |
| GSAP import size | Already in the bundle (FloatingGeometry uses it). No new cost |
| `transform-origin` with flex layout | Test that `50% -40px` works correctly when items are flex-positioned with gaps |
| Safari `transform-origin` percentage bug | May need to use explicit pixel calculations via `getBoundingClientRect()` |
| Performance on low-end devices | Only 5 elements rotating — negligible. GSAP uses `requestAnimationFrame`, same as everything else |
| Toggle Z-index vs FloatingGeometry | Toggle is in the content flow (z-10), geometry is z-(-10). No conflict |
| Lenis scroll interference | Pendulum is purely visual rotation, doesn't affect scroll at all |
