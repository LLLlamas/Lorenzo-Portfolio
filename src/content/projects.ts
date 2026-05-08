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
    coverFit: 'cover',
    year: 2025,
    featured: true,
    category: 'web',
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
    slug: 'bite-defense',
    title: 'Bite Defense',
    tagline: 'A tower-defense game — built native iOS, then ported to web.',
    description:
      'Started as a SwiftUI + SpriteKit iOS game built solo, then ported to a React + Vite desktop version to broaden the audience. The two versions share gameplay design but use platform-native rendering — SpriteKit for iOS, Canvas/React for web.',
    role: 'Solo developer',
    highlights: [
      'Original native iOS build: SwiftUI + SpriteKit',
      'Desktop port: React + Vite with Canvas-based renderer',
      'Shared gameplay design across both versions',
    ],
    stack: ['SwiftUI', 'SpriteKit', 'iOS', 'React', 'Vite'],
    cover: '/projects/bite-defense.webp',
    coverFit: 'cover',
    gallery: [
      { src: '/projects/bite-defense-1.webp', caption: 'iOS — gameplay layout', device: 'phone' },
      { src: '/projects/bite-defense-2.webp', caption: 'iOS — tutorial', device: 'phone' },
    ],
    year: 2025,
    featured: true,
    category: 'game',
  },
  {
    slug: 'sleepy-llamas',
    title: 'SleepyLlamas',
    tagline: 'An iOS sleep companion — quiet UI, helpful at 2 AM.',
    description:
      'A small SwiftUI app focused on calm, glanceable bedtime UX. Designed to be readable with one eye open in a dark room.',
    role: 'Solo developer',
    highlights: ['SwiftUI + dark-friendly typography', 'No notifications, no nags'],
    stack: ['SwiftUI', 'iOS'],
    cover: '/projects/sleepy-llamas.webp',
    coverFit: 'cover',
    year: 2024,
    featured: false,
    category: 'mobile',
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
