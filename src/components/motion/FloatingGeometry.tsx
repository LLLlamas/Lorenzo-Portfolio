'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { withBasePath } from '@/lib/utils';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
const ROTATION_SPEED = 0.18;
const MAX_DPR = 1.5;

/**
 * Slowly drifting tetrahedron rendered with Three.js. Sits behind the hero
 * content, mode-aware (dark = visible black faces + golden edges, light =
 * cream faces + amber edges, dimmed). The llama logo is composited onto each
 * face via a CanvasTexture — redrawn whenever the theme flips.
 *
 * Three is dynamic-imported so the chunk only loads on desktop motion users.
 */
export function FloatingGeometry({ className }: { className?: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (prefersReduced || !mounted) return;
    if (typeof window === 'undefined') return;
    if (!containerRef.current) return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const styles = getComputedStyle(document.documentElement);
      const readVar = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;

      // let so themeObserver can update and logoImg.onload picks up latest value
      let faceHex = readVar('--geo-face', '#0D0D0B');
      const edgeHex = readVar('--geo-edge', '#F0C040');
      const opacity = parseFloat(readVar('--geo-opacity', '1')) || 1;

      // ── Canvas texture: face color + llama logo composited per face ──
      const CANVAS_SIZE = 512;
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = CANVAS_SIZE;
      faceCanvas.height = CANVAS_SIZE;
      const ctx = faceCanvas.getContext('2d')!;

      const faceTexture = new THREE.CanvasTexture(faceCanvas);
      faceTexture.minFilter = THREE.LinearFilter;

      let logoLoaded = false;
      let logoEl: HTMLImageElement | null = null;

      const repaintCanvas = (face: string) => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = face;
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (logoLoaded && logoEl) {
          const maxDim = CANVAS_SIZE * 0.38;
          const scale = Math.min(maxDim / logoEl.naturalWidth, maxDim / logoEl.naturalHeight);
          const w = logoEl.naturalWidth * scale;
          const h = logoEl.naturalHeight * scale;
          ctx.drawImage(logoEl, (CANVAS_SIZE - w) / 2, (CANVAS_SIZE - h) / 2, w, h);
        }
        faceTexture.needsUpdate = true;
      };
      repaintCanvas(faceHex);

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        if (cancelled) return;
        logoLoaded = true;
        logoEl = logoImg;
        repaintCanvas(faceHex);
      };
      logoImg.src = withBasePath('/brand/llama-logo.webp');

      // ── Geometry with per-face UV mapping ──
      // TetrahedronGeometry uses sphere-projection UVs by default; override so
      // each triangular face maps the full canvas (logo centered on each face).
      const geom = new THREE.TetrahedronGeometry(2, 0);
      const uvData = new Float32Array(geom.attributes.position.count * 2);
      for (let i = 0; i < geom.attributes.position.count; i += 3) {
        const b = i * 2;
        uvData[b]     = 0;   uvData[b + 1] = 0;   // bottom-left
        uvData[b + 2] = 1;   uvData[b + 3] = 0;   // bottom-right
        uvData[b + 4] = 0.5; uvData[b + 5] = 1;   // top-center
      }
      geom.setAttribute('uv', new THREE.BufferAttribute(uvData, 2));

      const faceMat = new THREE.MeshBasicMaterial({
        map: faceTexture,
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
        opacity,
      });
      const wire = new THREE.LineSegments(edges, edgeMat);

      const group = new THREE.Group();
      group.add(mesh);
      group.add(wire);
      group.rotation.x = 0.4;
      group.rotation.y = 0.3;
      scene.add(group);

      let raf = 0;
      let resizeRaf = 0;
      let prev = performance.now();
      let visible = true;
      let running = false;

      const onResize = () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          if (!w || !h) return;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          if (visible && !document.hidden) renderer.render(scene, camera);
        });
      };
      window.addEventListener('resize', onResize);

      const tick = (now: number) => {
        if (!running) return;
        const dt = Math.min((now - prev) / 1000, 0.1);
        prev = now;
        group.rotation.x = Math.sin(now * 0.0004) * (20 * Math.PI / 180);
        group.rotation.y += dt * ROTATION_SPEED;
        group.position.y = Math.sin(now * 0.0006) * 0.15;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };

      const startLoop = () => {
        if (running || document.hidden) return;
        running = true;
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      };

      const stopLoop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        running = false;
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) startLoop();
          else stopLoop();
        },
        { threshold: 0 },
      );
      observer.observe(container);

      const onVisibilityChange = () => {
        if (document.hidden) stopLoop();
        else if (visible) startLoop();
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      startLoop();

      // Re-read CSS vars when theme flips; repaint canvas with new face color.
      const themeObserver = new MutationObserver(() => {
        const s = getComputedStyle(document.documentElement);
        const newFace = s.getPropertyValue('--geo-face').trim() || faceHex;
        const newEdge = s.getPropertyValue('--geo-edge').trim() || edgeHex;
        const newOpacity = parseFloat(s.getPropertyValue('--geo-opacity').trim()) || opacity;
        faceHex = newFace;
        repaintCanvas(newFace);
        edgeMat.color.set(newEdge);
        faceMat.opacity = newOpacity;
        edgeMat.opacity = newOpacity;
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-palette'],
      });

      cleanup = () => {
        stopLoop();
        cancelAnimationFrame(resizeRaf);
        observer.disconnect();
        themeObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        geom.dispose();
        edges.dispose();
        faceMat.dispose();
        edgeMat.dispose();
        faceTexture.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // resolvedTheme intentionally NOT in deps — MutationObserver handles it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, mounted]);

  return <div ref={containerRef} aria-hidden className={className} />;
}
