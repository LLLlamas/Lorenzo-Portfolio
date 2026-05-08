'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

/**
 * Slowly drifting tetrahedron rendered with Three.js. Sits behind the hero
 * content, mode-aware (dark = visible black faces + golden edges, light =
 * cream faces + amber edges, dimmed). Skipped under reduced-motion + on
 * touch (where the perf cost isn't worth it for a decorative scene).
 *
 * Three is dynamic-imported so the chunk only loads on desktop motion users.
 */
export function FloatingGeometry({ className }: { className?: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (prefersReduced || !mounted) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    if (!containerRef.current) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const styles = getComputedStyle(document.documentElement);
      const readVar = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;

      const faceHex = readVar('--geo-face', '#0D0D0B');
      const edgeHex = readVar('--geo-edge', '#F0C040');
      const opacity = parseFloat(readVar('--geo-opacity', '1')) || 1;

      const geom = new THREE.TetrahedronGeometry(2, 0);
      const faceMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(faceHex),
        transparent: true,
        opacity,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const mesh = new THREE.Mesh(geom, faceMat);

      const edges = new THREE.EdgesGeometry(geom);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(edgeHex),
        transparent: true,
        opacity: opacity,
      });
      const wire = new THREE.LineSegments(edges, edgeMat);

      const group = new THREE.Group();
      group.add(mesh);
      group.add(wire);
      group.rotation.x = 0.4;
      group.rotation.y = 0.3;
      scene.add(group);

      let raf = 0;
      let prev = performance.now();
      let visible = true;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      observer.observe(container);

      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      const tick = (now: number) => {
        const dt = Math.min((now - prev) / 1000, 0.1);
        prev = now;
        if (visible) {
          // window.__geoSpeed is set by RotationSpeedSlider (default 1, 0–4).
          const speed = window.__geoSpeed ?? 1;
          group.rotation.x += dt * 0.12 * speed;
          group.rotation.y += dt * 0.18 * speed;
          group.position.y = Math.sin(now * 0.0006) * 0.15;
          renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Re-read CSS vars when theme flips (next-themes mutates html.class).
      const themeObserver = new MutationObserver(() => {
        const s = getComputedStyle(document.documentElement);
        const newFace = s.getPropertyValue('--geo-face').trim() || faceHex;
        const newEdge = s.getPropertyValue('--geo-edge').trim() || edgeHex;
        const newOpacity =
          parseFloat(s.getPropertyValue('--geo-opacity').trim()) || opacity;
        faceMat.color.set(newFace);
        edgeMat.color.set(newEdge);
        faceMat.opacity = newOpacity;
        edgeMat.opacity = newOpacity;
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        themeObserver.disconnect();
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        geom.dispose();
        edges.dispose();
        faceMat.dispose();
        edgeMat.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // resolvedTheme intentionally NOT in deps — the MutationObserver
    // handles theme changes without re-mounting the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, mounted]);

  return <div ref={containerRef} aria-hidden className={className} />;
}
