/**
 * The void — fixed near-black canvas that replaced the city-photo backdrop.
 * Three cheap CSS layers, no images, no JS:
 *   1. base ground (--bg, near-black in dark mode)
 *   2. faint dot grid, radially masked so it dissolves toward the edges
 *   3. two huge blurred accent orbs drifting on 50–70s loops (.void-orb)
 * All motion is decorative → tagged .motion-decorative for the reduced-motion gate.
 */
export function VoidBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1, background: 'var(--bg)' }}
    >
      {/* Dot grid — barely-there technical texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--ink) 7%, transparent) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage:
            'radial-gradient(120% 90% at 50% 30%, black 0%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(120% 90% at 50% 30%, black 0%, transparent 78%)',
        }}
      />

      {/* Drifting accent orbs */}
      <div
        className="void-orb void-orb--a motion-decorative absolute"
        style={{
          width: '55vw',
          height: '55vw',
          top: '-18%',
          left: '-12%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)',
        }}
      />
      <div
        className="void-orb void-orb--b motion-decorative absolute"
        style={{
          width: '48vw',
          height: '48vw',
          bottom: '-20%',
          right: '-10%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent-secondary) 11%, transparent) 0%, transparent 66%)',
        }}
      />

      {/* Horizon hairline — anchors the lower third like a studio floor */}
      <div
        className="absolute inset-x-0 bottom-[22%] h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--ink) 8%, transparent) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
