export type ProjectCategory = 'web' | 'mobile' | 'game';

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  cover: string;
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
    cover: '/projects/dogs-and-llamas.png',
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'llamas-cookbook',
    title: 'Llamas Cookbook',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'SwiftData', 'iOS'],
    cover: '/projects/llamas-cookbook.png',
    year: 2025,
    featured: true,
    category: 'mobile',
  },
  {
    slug: 'bite-defense',
    title: 'Bite Defense',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'SpriteKit', 'iOS'],
    cover: '/projects/bite-defense.png',
    year: 2025,
    featured: true,
    category: 'game',
  },
  {
    slug: 'sleepy-llamas',
    title: 'SleepyLlamas',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['SwiftUI', 'iOS'],
    cover: '/projects/sleepy-llamas.png',
    year: 2024,
    featured: false,
    category: 'mobile',
  },
  {
    slug: 'tranquil',
    title: 'Tranquil',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['React', 'TypeScript'],
    cover: '/projects/tranquil.png',
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'condensed-reviews',
    title: 'Condensed Reviews',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript'],
    cover: '/projects/condensed-reviews.png',
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'flight-searcher',
    title: 'Flight Searcher',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript', 'API'],
    cover: '/projects/flight-searcher.png',
    year: 2024,
    featured: false,
    category: 'web',
  },
  {
    slug: 'train-watcher',
    title: 'Train Watcher',
    tagline: 'Tagline TBD — replace before Phase 1 ship.',
    stack: ['Next.js', 'TypeScript', 'API'],
    cover: '/projects/train-watcher.png',
    year: 2024,
    featured: false,
    category: 'web',
  },
];
