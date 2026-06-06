'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GyroTilt } from '@/components/motion/GyroTilt';
import { RippleTap } from '@/components/motion/RippleTap';
import { copy } from '@/content/copy';
import { projects, type Project, type ProjectCategory } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

const ProjectModal = dynamic(
  () =>
    import('@/components/sections/ProjectModal').then(
      (module) => module.ProjectModal,
    ),
  { ssr: false },
);

type FilterCategory = 'all' | ProjectCategory;

const filterLabels: Record<FilterCategory, string> = {
  all: 'All',
  web: 'Web',
  mobile: 'Mobile',
  game: 'Game',
};

const filterOrder: FilterCategory[] = ['all', 'web', 'mobile', 'game'];

type CategoryConfig = { category: ProjectCategory; label: string };

const CATEGORY_ROWS: CategoryConfig[] = [
  { category: 'web', label: 'Web' },
  { category: 'mobile', label: 'Mobile' },
  { category: 'game', label: 'Game' },
];

export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [hasLoadedModal, setHasLoadedModal] = useState(false);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const prefersReduced = useReducedMotion();

  const activeCategories =
    filter === 'all'
      ? CATEGORY_ROWS
      : CATEGORY_ROWS.filter((c) => c.category === filter);

  const visibleProjects = activeCategories.flatMap(({ category }) =>
    projects.filter((p) => p.category === category),
  );

  const openIndex = openProject
    ? visibleProjects.findIndex((p) => p.slug === openProject.slug)
    : -1;
  const prevProject = openIndex > 0 ? visibleProjects[openIndex - 1] : null;
  const nextProject =
    openIndex >= 0 && openIndex < visibleProjects.length - 1
      ? visibleProjects[openIndex + 1]
      : null;

  const handleSelectProject = (project: Project) => {
    setHasLoadedModal(true);
    setOpenProject(project);
  };

  return (
    <>
      <section id="work" className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={copy.work.eyebrow}
            headline={copy.work.headline}
            subhead={copy.work.subhead}
          />

          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2">
            {filterOrder.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={isActive}
                  className={cn(
                    'relative rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-accent text-accent-on'
                      : 'border-line text-ink-quiet hover:border-line-accent hover:text-ink',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                  <span className="relative z-10">{filterLabels[category]}</span>
                </button>
              );
            })}
          </div>

          {/* Category rows */}
          <div className="space-y-14">
            <AnimatePresence mode="popLayout">
              {activeCategories.map(({ category, label }) => {
                const catProjects = projects.filter((p) => p.category === category);
                if (catProjects.length === 0) return null;
                const showGapFiller = catProjects.length > 1 && catProjects.length % 2 === 1;

                return (
                  <motion.div
                    key={category}
                    layout={!prefersReduced}
                    initial={prefersReduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReduced ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Category label — visible only when showing all */}
                    {filter === 'all' && (
                      <div className="mb-5 flex items-center gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-quiet">
                          {label}
                        </span>
                        <div className="h-px flex-1 bg-line" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-5 md:gap-6">
                      {catProjects.map((project, i) => (
                        <motion.div
                          key={project.slug}
                          initial={
                            prefersReduced
                              ? false
                              : { opacity: 0, y: 18, filter: 'blur(6px)' }
                          }
                          whileInView={
                            prefersReduced
                              ? undefined
                              : { opacity: 1, y: 0, filter: 'blur(0px)' }
                          }
                          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                          transition={{
                            delay: i * 0.06,
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <ProjectCard
                            project={project}
                            isSelected={openProject?.slug === project.slug}
                            onSelect={handleSelectProject}
                          />
                        </motion.div>
                      ))}
                      {showGapFiller ? <WorkGapFiller /> : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {visibleProjects.length === 0 && (
            <div className="py-20 text-center text-sm text-ink-quiet">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      {hasLoadedModal ? (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenProject(null)}
          prevProject={prevProject}
          nextProject={nextProject}
          onPrev={prevProject ? () => setOpenProject(prevProject) : undefined}
          onNext={nextProject ? () => setOpenProject(nextProject) : undefined}
          projectIndex={openIndex >= 0 ? openIndex : undefined}
          projectCount={visibleProjects.length}
        />
      ) : null}
    </>
  );
}

type ProjectCardProps = {
  project: Project;
  isSelected?: boolean;
  onSelect: (project: Project) => void;
};

function ProjectCard({ project, isSelected = false, onSelect }: ProjectCardProps) {
  const hasCover = Boolean(project.cover);
  const fit = project.coverFit ?? 'cover';
  const isPhone = project.category === 'mobile' && project.coverFit === 'contain';

  return (
    <div className="scroll-scale" style={{ transformOrigin: 'center bottom' }}>
      <RippleTap className="rounded-[var(--radius-card)]">
        <GyroTilt>
          <Card
            as="article"
            className={cn(
              'project-card group relative p-0 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-2 will-change-transform',
              isSelected &&
                'ring-2 ring-accent/60 border-accent/50 shadow-[0_0_0_1px_var(--accent-soft),0_0_20px_-4px_var(--accent)]',
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(project)}
              aria-label={`Open details for ${project.title}`}
              className="block w-full cursor-pointer text-left"
            >
              {/* Cover — uniform 16/10 across all categories */}
              <div
                className={cn(
                  'relative aspect-[16/10] overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br',
                  project.category === 'mobile' && 'from-accent-soft to-bg',
                  project.category === 'web' && 'from-accent-secondary-soft to-bg',
                  project.category === 'game' &&
                    'from-accent-soft via-accent-secondary-soft to-bg',
                )}
              >
                {hasCover ? (
                  isPhone ? (
                    <PhoneCoverPreview project={project} />
                  ) : (
                    <div
                      className={cn(
                        'absolute inset-0',
                        project.featured && fit === 'cover' && 'ken-burns motion-decorative',
                      )}
                    >
                      <Image
                        src={withBasePath(project.cover!)}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(min-width: 768px) 50vw, 50vw"
                        className={cn(
                          fit === 'cover' && 'object-cover object-top',
                          fit === 'contain' && 'object-contain p-3 md:p-5',
                        )}
                        priority={project.featured}
                      />
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-quiet">
                      Screenshot pending
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3
                      className="cascade-step cascade-1 font-display text-sm font-extrabold tracking-tight text-ink md:text-base"
                      style={{ transitionDelay: '0ms' }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="cascade-step cascade-2 mt-0.5 text-xs font-semibold text-ink-soft md:text-sm"
                      style={{ transitionDelay: '90ms' }}
                    >
                      {project.tagline}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-3.5 shrink-0 text-ink-quiet transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {project.stack.slice(0, 3).map((tag, i) => (
                    <Tag
                      key={tag}
                      className="cascade-step cascade-3 text-[10px]"
                      style={{ transitionDelay: `${180 + i * 50}ms` }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </button>
          </Card>
        </GyroTilt>
      </RippleTap>
    </div>
  );
}

function PhoneCoverPreview({ project }: { project: Project }) {
  const shots = [
    project.cover ? { src: project.cover, caption: `${project.title} screenshot` } : null,
    ...(project.gallery ?? []).filter((image) => image.device === 'phone'),
  ]
    .filter(Boolean)
    .slice(0, 2) as { src: string; caption?: string }[];

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 px-5 py-3 md:gap-5 md:px-8 md:py-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,var(--accent-soft),transparent_58%)]" />
      {shots.map((shot, index) => (
        <PhoneFrame
          key={`${shot.src}-${index}`}
          className={cn(
            'relative h-full min-h-0 max-h-[260px]',
            index > 0 && 'hidden translate-y-4 sm:grid',
          )}
        >
          <Image
            src={withBasePath(shot.src)}
            alt={shot.caption ?? `${project.title} screenshot ${index + 1}`}
            fill
            sizes="(min-width: 768px) 160px, 40vw"
            className="object-cover"
            priority={project.featured && index === 0}
          />
        </PhoneFrame>
      ))}
    </div>
  );
}

function WorkGapFiller() {
  return (
    <Link
      href={copy.workGapFiller.cta.href}
      className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-dashed border-line-accent bg-bg/40 p-6 text-center transition-transform duration-300 hover:-translate-y-1.5 md:p-8"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="loading-blink text-[10px] uppercase tracking-[0.18em] text-accent"
          aria-hidden
        >
          {copy.workGapFiller.eyebrow}
        </span>
        <p className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {copy.workGapFiller.headline}
        </p>
        <p className="max-w-xs text-sm text-ink-soft">{copy.workGapFiller.body}</p>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-transform duration-200 group-hover:translate-x-0.5">
        {copy.workGapFiller.cta.label}
        <ArrowUpRight className="size-3.5" />
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-1/2 h-px origin-left scale-x-0 bg-accent/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}
