'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GyroTilt } from '@/components/motion/GyroTilt';
import { RippleTap } from '@/components/motion/RippleTap';
import { MosaicReveal } from '@/components/motion/MosaicReveal';
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

          {/* Filter tabs — bracketed mono, active fills accent */}
          <div className="mb-12 flex flex-wrap gap-x-7 gap-y-3">
            {filterOrder.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={isActive}
                  className={cn(
                    'link-bracket cursor-pointer text-xs',
                    isActive && 'link-bracket--accent',
                  )}
                >
                  {filterLabels[category]}
                </button>
              );
            })}
          </div>

          {/* Category rows */}
          <div className="space-y-16">
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
                      <div className="mb-6 flex items-baseline gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-quiet">
                          {label}/
                        </span>
                        <div className="h-px flex-1 self-center bg-line" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-5 md:gap-6">
                      {catProjects.map((project, i) => (
                        <motion.div
                          key={project.slug}
                          initial={
                            prefersReduced
                              ? false
                              : { opacity: 0, y: 18 }
                          }
                          whileInView={
                            prefersReduced
                              ? undefined
                              : { opacity: 1, y: 0 }
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
                            index={visibleProjects.findIndex((p) => p.slug === project.slug)}
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
            <div className="py-20 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-quiet">
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
  /** Position within the currently visible list — rendered as the 01/ index. */
  index: number;
  isSelected?: boolean;
  onSelect: (project: Project) => void;
};

function ProjectCard({ project, index, isSelected = false, onSelect }: ProjectCardProps) {
  const hasCover = Boolean(project.cover);
  const fit = project.coverFit ?? 'cover';
  const isPhone = project.category === 'mobile' && project.coverFit === 'contain';
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <div className="scroll-scale" style={{ transformOrigin: 'center bottom' }}>
      <RippleTap className="rounded-lg">
        <GyroTilt>
          <article
            className={cn(
              'project-card group relative overflow-hidden rounded-lg border border-line bg-bg-elevated',
              'transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] will-change-transform',
              'hover:-translate-y-1.5 hover:border-ink-quiet/50',
              isSelected && 'border-accent/60 shadow-[0_0_24px_-8px_var(--accent)]',
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(project)}
              aria-label={`Open details for ${project.title}`}
              className="block w-full cursor-pointer text-left"
            >
              {/* Cover — mosaic tiles dissolve to reveal the shot */}
              <MosaicReveal className="project-media-well relative aspect-[16/10]">
                {hasCover ? (
                  isPhone ? (
                    <PhoneCoverPreview project={project} />
                  ) : (
                    <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
                      [ Screenshot pending ]
                    </span>
                  </div>
                )}
              </MosaicReveal>

              {/* Body — index, title, tagline, mono stack line */}
              <div className="border-t border-line p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-baseline gap-3">
                    <span className="font-mono text-[11px] text-accent">
                      {indexLabel}/
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-extrabold uppercase tracking-tight text-ink transition-colors md:text-base">
                        {project.title}
                      </h3>
                      <p className="mt-1 hidden text-xs text-ink-soft sm:block md:text-sm">
                        {project.tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-ink-quiet transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>

                <p className="mt-3 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink-quiet">
                  {project.stack.slice(0, 4).join(' / ')}
                  <span className="text-line"> — {project.year}</span>
                </p>
              </div>
            </button>
          </article>
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
      className="group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-bg-elevated/60 p-6 text-center transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent/50 md:p-8"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="loading-blink font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
          aria-hidden
        >
          [ {copy.workGapFiller.eyebrow} ]
        </span>
        <p className="font-display text-xl font-extrabold uppercase tracking-tight text-ink md:text-2xl">
          {copy.workGapFiller.headline}
        </p>
        <p className="max-w-xs text-sm text-ink-soft">{copy.workGapFiller.body}</p>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-accent transition-transform duration-200 group-hover:translate-x-0.5">
        {copy.workGapFiller.cta.label}
        <ArrowUpRight className="size-3.5" />
      </span>
    </Link>
  );
}
