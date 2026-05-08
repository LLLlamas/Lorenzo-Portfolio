export type ProjectCategory = 'web' | 'mobile' | 'game';

/**
 * coverFit:
 *  - 'cover'   → image fills the 16:10 card and crops as needed (default for landscape shots)
 *  - 'contain' → image fits inside the card with side padding (use for portrait/mobile shots
 *                so the whole screen is visible)
 */
export type CoverFit = 'cover' | 'contain';

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  /** Path to the optimized webp under /projects/. Omit if no screenshot yet — the card falls back to a category-tinted gradient. */
  cover?: string;
  coverFit?: CoverFit;
  link?: string;
  year: number;
  featured: boolean;
  category: ProjectCategory;
};

export const projects: Project[] = [
  {
    slug: 'dogs-and-llamas',
    title: 'Dogs & Llamas',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'iOS', 'SwiftData'],
    cover: '/projects/dogs-and-llamas.webp',
    coverFit: 'cover',
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'llamas-cookbook',
    title: 'Llamas Cookbook',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'SwiftData', 'iOS'],
    cover: '/projects/llamas-cookbook.webp',
    coverFit: 'contain', // portrait mobile shot
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'bite-defense',
    title: 'Bite Defense',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'SpriteKit', 'iOS'],
    cover: '/projects/bite-defense.webp',
    coverFit: 'cover',
    year: 2025,
    featured: true,
    category: 'game',
  },
  {
    slug: 'sleepy-llamas',
    title: 'SleepyLlamas',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
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
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript', 'API'],
    cover: '/projects/train-watcher.webp',
    coverFit: 'contain', // portrait mobile shot
    year: 2024,
    featured: false,
    category: 'web',
  },
];
