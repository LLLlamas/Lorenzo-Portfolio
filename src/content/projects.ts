export type ProjectCategory = 'web' | 'mobile' | 'game';

/**
 * coverFit:
 *  - 'cover'   → image fills the 16:10 card and crops as needed (default for landscape shots)
 *  - 'contain' → image fits inside the card with side padding (use for portrait/mobile shots
 *                so the whole screen is visible)
 *
 * For category === 'mobile' + coverFit === 'contain', the card automatically
 * renders inside a phone-shaped 9:19.5 container with shadow so portrait
 * screenshots look like a device display instead of a cropped image.
 */
export type CoverFit = 'cover' | 'contain';

export type GalleryImage = {
  src: string;
  caption?: string;
  /** 'phone' renders this gallery shot in a phone-shaped container in the modal. */
  device?: 'phone' | 'browser';
};

export type Project = {
  slug: string;
  title: string;
  /** One sentence — shown on the card. */
  tagline: string;
  /** Longer paragraph shown in the modal. */
  description?: string;
  /** Bullet points shown in the modal — outcomes, what was learned, what was hard. */
  highlights?: string[];
  /** Role — e.g. "Solo developer". */
  role?: string;
  stack: string[];
  /** Path to the optimized webp under /projects/. Omit if no screenshot yet — the card falls back to a category-tinted gradient. */
  cover?: string;
  coverFit?: CoverFit;
  /** Additional shots for the modal gallery. */
  gallery?: GalleryImage[];
  link?: string;
  year: number;
  featured: boolean;
  category: ProjectCategory;
};

export const projects: Project[] = [
  {
    slug: 'dogs-and-llamas',
    title: 'Dogs & Llamas',
    tagline: 'A weekly newsletter platform for dog people.',
    description:
      'A React-based newsletter app where dog owners can subscribe to themed weekly digests. Built as a side project to explore React state management and email-friendly templating, then expanded into a small content publishing tool with subscription management.',
    role: 'Solo developer',
    highlights: [
      'React frontend with custom newsletter templating',
      'Lightweight subscription + send pipeline',
      'Mobile-responsive across breakpoints',
    ],
    stack: ['React', 'JavaScript', 'Web'],
    cover: '/projects/dogs-and-llamas.webp',
    coverFit: 'contain',
    year: 2025,
    featured: true,
    category: 'web',
  },
  {
    slug: 'bite-defense-web',
    title: 'Bite Defense Web',
    tagline: 'A React tower-defense game tuned for desktop play.',
    description:
      'A browser version of Bite Defense rebuilt around React and JavaScript. The port keeps the original tower-defense loop while adapting controls, pacing, and screen layout for desktop play.',
    role: 'Solo developer',
    highlights: [
      'React frontend with a Canvas-based playfield',
      'Desktop-first controls and responsive HUD layout',
      'Web port separated from the native iOS implementation',
    ],
    stack: ['React', 'JavaScript', 'Canvas', 'Web'],
    cover: '/projects/bite-defense.webp',
    coverFit: 'contain',
    year: 2025,
    featured: true,
    category: 'game',
  },
  {
    slug: 'llamas-cookbook',
    title: 'Llamas Cookbook',
    tagline: 'A native iOS recipe app with built-in cook-mode timers.',
    description:
      'A SwiftUI cookbook that turns recipes into a guided cook mode — multiple timers per recipe, ingredient checkoff, and a clean reading layout. Built solo on iOS 18 + SwiftData; designed around the "phone-on-the-counter" use case where you want big text and one-tap controls while your hands are messy.',
    role: 'Solo developer',
    highlights: [
      'SwiftData persistence; offline-first',
      'Multi-timer cook mode with haptic feedback',
      'iOS 18 features (Live Activities considered for v2)',
    ],
    stack: ['SwiftUI', 'SwiftData', 'iOS'],
    cover: '/projects/llamas-cookbook.webp',
    coverFit: 'contain',
    gallery: [
      { src: '/projects/llamas-cookbook-1.webp', caption: 'Cook mode timers', device: 'phone' },
    ],
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'bite-defense-ios',
    title: 'Bite Defense iOS',
    tagline: 'A native iOS tower-defense game built with SpriteKit.',
    description:
      'The original native Bite Defense build: a SwiftUI shell with SpriteKit gameplay, touch-friendly controls, and compact phone-first screens. This version focuses on fast reads and clean mobile interaction instead of sharing the web renderer.',
    role: 'Solo developer',
    highlights: [
      'SwiftUI app shell with SpriteKit gameplay scenes',
      'Touch-first tower placement and wave controls',
      'Compact HUD designed for portrait phone play',
    ],
    stack: ['SwiftUI', 'SpriteKit', 'iOS'],
    cover: '/projects/bite-defense-1.webp',
    coverFit: 'contain',
    gallery: [
      { src: '/projects/bite-defense-2.webp', caption: 'Tutorial flow', device: 'phone' },
    ],
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'sleepy-llamas',
    title: 'SleepyLlamas',
    tagline: 'A React sleep companion with a quiet bedtime interface.',
    description:
      'A small React and JavaScript web app focused on calm, glanceable bedtime UX. Designed to be readable with one eye open in a dark room.',
    role: 'Solo developer',
    highlights: ['React UI with dark-friendly typography', 'No notifications, no nags'],
    stack: ['React', 'JavaScript', 'Web'],
    cover: '/projects/sleepy-llamas.webp',
    coverFit: 'cover',
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'tranquil',
    title: 'Tranquil',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['React', 'TypeScript'],
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'condensed-reviews',
    title: 'Condensed Reviews',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript'],
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'flight-searcher',
    title: 'Flight Searcher',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript', 'API'],
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'train-watcher',
    title: 'Train Watcher',
    tagline: 'A live transit board for NYC bus and subway routes.',
    description:
      'A responsive React web app showing live arrivals for NYC bus + subway routes — pick a starting and ending point, see real-time arrival predictions and service alerts. Works on desktop and mobile.',
    role: 'Solo developer',
    highlights: [
      'Live MTA arrival predictions',
      'Responsive — desktop and mobile from one codebase',
      'Service alerts surfaced inline',
    ],
    stack: ['React', 'TypeScript', 'API', 'Web'],
    cover: '/projects/train-watcher.webp',
    coverFit: 'contain',
    year: 2024,
    featured: false,
    category: 'web',
  },
];
