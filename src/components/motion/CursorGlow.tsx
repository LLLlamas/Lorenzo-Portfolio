'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
const SIZE = 100;
const HALF = SIZE / 2;
const GLOW_R2 = 50 * 50;

const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, dt, dd, figcaption, label, a:not(.btn-sweep), .aura-pop, .pill-tag, .label-select';
const MIN_FONT_PX = 9;

type MeasuredTarget = {
  el: HTMLElement;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

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

function refreshOutlines(cx: number, cy: number, targets: MeasuredTarget[]) {
  for (const target of targets) {
    const dx = Math.max(target.left - cx, 0, cx - target.right);
    const dy = Math.max(target.top - cy, 0, cy - target.bottom);
    const inGlow = dx * dx + dy * dy < GLOW_R2;
    const cur = target.el.dataset.glow === '1';
    if (inGlow !== cur) target.el.dataset.glow = inGlow ? '1' : '0';
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
    if (!layerRef.current) return;

    let raf = 0;
    let cx = -HALF * 4;
    let cy = -HALF * 4;
    let visible = false;
    let rectsDirty = true;

    const seen = new WeakSet<Text>();
    let glowTargets: HTMLElement[] = [];
    let measuredTargets: MeasuredTarget[] = [];

    function scanAndWrap() {
      const containers = Array.from(
        document.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
      ).filter((node) => parseFloat(getComputedStyle(node).fontSize) >= MIN_FONT_PX);
      for (const c of containers) wrapWords(c, seen);

      const targetSet = new Set<HTMLElement>();
      document.querySelectorAll<HTMLElement>('[data-glow]').forEach((target) => {
        targetSet.add(target);
      });

      // Pick up explicitly-marked glow targets (e.g. logo image)
      document.querySelectorAll<HTMLElement>('[data-glow-target]').forEach((el) => {
        if (!el.dataset.glow) el.dataset.glow = '0';
        targetSet.add(el);
      });

      glowTargets = Array.from(targetSet);
      rectsDirty = true;
    }

    function measureTargets() {
      measuredTargets = glowTargets.map((target) => {
        const r = target.getBoundingClientRect();
        return {
          el: target,
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
        };
      });
      rectsDirty = false;
    }

    function scheduleUpdate() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const activeLayer = layerRef.current;
        if (!activeLayer) return;
        activeLayer.style.transform = `translate3d(${cx - HALF}px, ${cy - HALF}px, 0)`;
        if (!visible) return;
        if (rectsDirty) measureTargets();
        refreshOutlines(cx, cy, measuredTargets);
      });
    }

    document.documentElement.dataset.cursor = 'custom';

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
        layerRef.current?.style.setProperty('opacity', '1');
      }
      scheduleUpdate();
    };

    const onLayoutShift = () => {
      rectsDirty = true;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onLayoutShift, { passive: true });
    window.addEventListener('resize', onLayoutShift, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(debounceId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onLayoutShift);
      window.removeEventListener('resize', onLayoutShift);
      glowTargets.forEach((s) => { s.dataset.glow = '0'; });
      delete document.documentElement.dataset.cursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[600] opacity-0 transition-opacity duration-700"
      style={{
        width: SIZE,
        height: SIZE,
        willChange: 'transform',
        borderRadius: '50%',
        background:
          'radial-gradient(12px circle at 50% 50%, color-mix(in srgb, var(--glow-orb-color) 35%, transparent), transparent 100%), ' +
          'radial-gradient(50px circle at 50% 50%, color-mix(in srgb, var(--glow-orb-color) 28%, transparent), transparent 100%)',
      }}
    />
  );
}
