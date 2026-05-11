import { Fragment } from 'react';

const ITEMS = [
  'React',
  'Next.js',
  'TypeScript',
  'SwiftUI',
  'Supabase',
  'Vercel',
  'Tailwind CSS',
  'GSAP',
  'Three.js',
  'SpriteKit',
  'PostgreSQL',
  'Figma',
];

const LOOP = [...ITEMS, ...ITEMS];

export function MarqueeTechStrip() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-line py-4"
    >
      <div className="marquee-track motion-decorative flex w-max items-center">
        {LOOP.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span className="px-6 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-ink-quiet">
              {item}
            </span>
            <span className="text-line">✦</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
