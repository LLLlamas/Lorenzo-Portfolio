// Shared motion tokens — wired into Phase 2 motion primitives.
// Values mirror the CSS custom properties in globals.css so JS-driven
// animations stay consistent with CSS-driven ones.

export const easings = {
  outSoft: [0.22, 0.61, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const durations = {
  fast: 0.15,
  base: 0.32,
  slow: 0.65,
  cinematic: 1.1,
};

export const stagger = {
  cards: 0.08,
  words: 0.04,
};
