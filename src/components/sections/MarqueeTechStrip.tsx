import { techStackItems } from '@/content/tech-stack';

export function MarqueeTechStrip() {
  return (
    <div className="border-y border-line px-6 py-5">
      <ul
        aria-label="Core technologies"
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {techStackItems.map((item) => (
          <li
            key={item}
            className="aura-pop whitespace-nowrap text-sm font-bold uppercase tracking-[0.16em] text-ink-quiet"
          >
            <span className="label-select">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
