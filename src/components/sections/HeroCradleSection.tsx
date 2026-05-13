'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { PendulumToggle } from '@/components/motion/PendulumToggle';
import { Hero } from '@/components/sections/Hero';
import { NewtonsCradleStrip } from '@/components/sections/NewtonsCradleStrip';
import { techStackItems } from '@/content/tech-stack';

type CradleLine = {
  key: string;
  path: string;
};

function areLinesEqual(a: CradleLine[], b: CradleLine[]) {
  if (a.length !== b.length) return false;
  return a.every((line, index) => (
    line.key === b[index]?.key && line.path === b[index]?.path
  ));
}

function PendulumStrings({
  active,
  sourceRef,
  wrapperRef,
  itemRefs,
}: {
  active: boolean;
  sourceRef: RefObject<HTMLButtonElement | null>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<Array<HTMLLIElement | null>>;
}) {
  const [lines, setLines] = useState<CradleLine[]>([]);
  const progress = active ? 1 : 0;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const source = sourceRef.current;
    if (!wrapper || !source) return;

    let measureRaf = 0;
    let loopRaf = 0;
    let loopRunning = false;
    let visible = true;

    const readLines = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const sourceRect = source.getBoundingClientRect();
      const startX = sourceRect.left + sourceRect.width / 2 - wrapperRect.left;
      const startY = sourceRect.bottom - wrapperRect.top;

      const nextLines = itemRefs.current.flatMap((item, index) => {
        if (!item) return [];
        const itemRect = item.getBoundingClientRect();
        const endX = itemRect.left + itemRect.width / 2 - wrapperRect.left;
        const endY = itemRect.top + itemRect.height / 2 - wrapperRect.top;

        return [{
          key: techStackItems[index],
          path: `M ${startX.toFixed(2)} ${startY.toFixed(2)} L ${endX.toFixed(2)} ${endY.toFixed(2)}`,
        }];
      });

      setLines((current) => (
        areLinesEqual(current, nextLines) ? current : nextLines
      ));
    };

    const measure = () => {
      cancelAnimationFrame(measureRaf);
      measureRaf = requestAnimationFrame(readLines);
    };

    const stopLoop = () => {
      cancelAnimationFrame(loopRaf);
      loopRaf = 0;
      loopRunning = false;
    };

    const tick = () => {
      if (!loopRunning) return;
      readLines();
      loopRaf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!active || !visible || loopRunning) return;
      loopRunning = true;
      loopRaf = requestAnimationFrame(tick);
    };

    measure();
    startLoop();

    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(source);
    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(wrapper);

    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(measureRaf);
      stopLoop();
      observer.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [active, itemRefs, sourceRef, wrapperRef]);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[20] h-full w-full overflow-visible"
    >
      {lines.map((line) => (
        <path
          key={line.key}
          d={line.path}
          pathLength={1}
          className="cradle-string"
          style={{
            opacity: progress > 0 ? 1 : 0,
            strokeDashoffset: 1 - progress,
          }}
        />
      ))}
    </svg>
  );
}

export function HeroCradleSection() {
  const [active, setActive] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const handleToggle = useCallback(() => {
    setActive((current) => !current);
  }, []);

  return (
    <div ref={wrapperRef} className="relative isolate">
      <PendulumStrings
        active={active}
        sourceRef={buttonRef}
        wrapperRef={wrapperRef}
        itemRefs={itemRefs}
      />
      <Hero
        pendulumControl={
          <PendulumToggle
            ref={buttonRef}
            active={active}
            onToggle={handleToggle}
          />
        }
      />
      <NewtonsCradleStrip
        active={active}
        itemRefs={itemRefs}
      />
    </div>
  );
}
