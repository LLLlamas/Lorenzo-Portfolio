const ITEMS = [
  'React & React Native',
  'Next.js',
  'JavaScript / TypeScript',
  'SwiftUI',
  'UX / UI',
];

export function MarqueeTechStrip() {
  return (
    <div className="border-y border-line px-6 py-5">
      <ul
        aria-label="Core technologies"
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {ITEMS.map((item) => (
          <li
            key={item}
            className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.16em] text-ink-quiet"
          >
            <span className="label-select">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
