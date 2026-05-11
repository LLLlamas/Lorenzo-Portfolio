'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
const SIZE = 160;          // orb diameter px — tight and precise
const HALF = SIZE / 2;
const GLOW_R2 = 80 * 80;   // GLOW_RADIUS² — avoids sqrt in hot path

const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, a:not(.btn-sweep)';
const MIN_FONT_PX = 11;

/**
 * Split every text node inside `container` into individual word <span>s.
 * Whitespace between words stays as plain text nodes so layout is unchanged.
 * The parent-check prevents double-wrapping on effect re-runs.
 */
function wrapWords(container: HTMLElement, seen: WeakSet<Text>): HTMLSpanElement[] {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);

  const spans: HTMLSpanElement[] = [];

  for (const tn of textNodes) {
    if (seen.has(tn)) continue;
    // Skip if already inside a word-span from a previous pass
    const par = tn.parentNode as HTMLElement | null;
    if (par?.dataset?.glow != null) continue;

    seen.add(tn);
    const raw = tn.textContent ?? '';
    if (!raw.trim()) continue;

    const parts = raw.split(/(\s+)/);
    const frag = document.createDocumentFragment();

    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.textContent = part;
        span.dataset.glow = '0';
        frag.appendChild(span);
        spans.push(span);
      }
    }

    par?.replaceChild(frag, tn);
  }

  return spans;
}

function refreshOutlines(cx: number, cy: number, spans: HTMLSpanElement[]) {
  // Read all rects first (single layout flush), then write
  const rects = spans.map((s) => s.getBoundingClientRect());
  for (let i = 0; i < spans.length; i++) {
    const r = rects[i];
    const dx = Math.max(r.left - cx, 0, cx - r.right);
    const dy = Math.max(r.top - cy, 0, cy - r.bottom);
    const inGlow = dx * dx + dy * dy < GLOW_R2;
    const cur = spans[i].dataset.glow === '1';
    if (inGlow !== cur) spans[i].dataset.glow = inGlow ? '1' : '0';
  }
}

export function CursorGlow() {
  const prefersReduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;
    setEnabled(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = layerRef.current;
    if (!el) return;

    let raf = 0;
    let cx = -HALF * 4;
    let cy = -HALF * 4;
    let visible = false;

    const seen = new WeakSet<Text>();
    const wordSpans: HTMLSpanElement[] = [];

    function scanAndWrap() {
      const containers = Array.from(
        document.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
      ).filter((node) => parseFloat(getComputedStyle(node).fontSize) >= MIN_FONT_PX);
      for (const c of containers) wordSpans.push(...wrapWords(c, seen));
    }

    // Initial pass
    scanAndWrap();

    // Re-scan whenever the DOM changes (route navigations, modals opening,
    // accordions expanding, etc.). Debounced so rapid mutations only cost one scan.
    let debounceId = 0;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceId);
      debounceId = window.setTimeout(scanAndWrap, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
      refreshOutlines(cx, cy, wordSpans);
    };

    const tick = () => {
      el.style.transform = `translate3d(${cx - HALF}px, ${cy - HALF}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(debounceId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      wordSpans.forEach((s) => { s.dataset.glow = '0'; });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[110] opacity-0 transition-opacity duration-700"
      style={{
        width: SIZE,
        height: SIZE,
        willChange: 'transform',
        background:
          'radial-gradient(18px circle at 50% 50%, color-mix(in srgb, white 20%, transparent), transparent 100%), ' +
          'radial-gradient(80px circle at 50% 50%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 100%)',
      }}
    />
  );
}
