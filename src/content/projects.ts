export type ProjectCategory = 'web' | 'mobile' | 'game';

/** Display labels for project categories (used by Work + ProjectModal). */
export const categoryLabels: Record<ProjectCategory, string> = {
  web: 'Web',
  mobile: 'iOS',
  game: 'Game',
};

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

/**
 * A modal highlight — an outcome, learning, or hard problem.
 * `metric` is optional: when present it renders as a large stat above `text`.
 */
export type Highlight = { text: string; metric?: string };

export type Project = {
  slug: string;
  title: string;
  /** One sentence — shown on the card. */
  tagline: string;
  /** Longer paragraph shown in the modal. */
  description?: string;
  /** Bullet points shown in the modal — outcomes, what was learned, what was hard. */
  highlights?: Highlight[];
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
      { text: 'React frontend with custom newsletter templating' },
      { text: 'Lightweight subscription + send pipeline' },
      { text: 'Mobile-responsive across breakpoints' },
    ],
    stack: ['React', 'JavaScript', 'Web'],
    cover: '/projects/dogs-and-llamas.webp',
    coverFit: 'contain',
    gallery: [
      { src: '/projects/dogs-and-llamas-1.webp', caption: 'Homepage' },
      { src: '/projects/dogs-and-llamas-2.webp', caption: 'Reviews' },
      { src: '/projects/dogs-and-llamas-3.webp', caption: 'Calendar' },
    ],
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
      { text: 'React frontend with a Canvas-based playfield' },
      { text: 'Desktop-first controls and responsive HUD layout' },
      { text: 'Web port separated from the native iOS implementation' },
    ],
    stack: ['React', 'JavaScript', 'Canvas', 'Web'],
    cover: '/projects/bite-defense.webp',
    coverFit: 'contain',
    gallery: [
      { src: '/projects/bite-defense-web-1.webp', caption: 'Gameplay' },
    ],
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
      { text: 'SwiftData persistence; offline-first' },
      { text: 'Multi-timer cook mode with haptic feedback' },
      { text: 'iOS 18 features (Live Activities considered for v2)' },
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
      { text: 'SwiftUI app shell with SpriteKit gameplay scenes' },
      { text: 'Touch-first tower placement and wave controls' },
      { text: 'Compact HUD designed for portrait phone play' },
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
    tagline: 'React based website with in-house calendar implementation.',
    description:
      'A small React and JavaScript web app focused on calm, glanceable bedtime UX with a custom-built calendar. Designed to be readable with one eye open in a dark room.',
    role: 'Solo developer',
    highlights: [
      { text: 'React UI with dark-friendly typography' },
      { text: 'No notifications, no nags' },
    ],
    stack: ['React', 'JavaScript', 'Web'],
    cover: '/projects/sleepy-llamas.webp',
    coverFit: 'cover',
    gallery: [
      { src: '/projects/sleepy-llamas-1.webp', caption: 'Landing page' },
      { src: '/projects/sleepy-llamas-2.webp', caption: 'Packages' },
    ],
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
];
