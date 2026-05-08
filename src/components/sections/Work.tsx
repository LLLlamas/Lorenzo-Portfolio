'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stagger } from '@/components/motion/Stagger';
import { ProjectModal } from '@/components/sections/ProjectModal';
import { copy } from '@/content/copy';
import { projects, type Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

const COLS = 3;

const SPAN_CLASS: Record<1 | 2, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
};

export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const gapCount = rest.length > 0 ? (COLS - (rest.length % COLS)) % COLS : 0;
  const showGapFiller = gapCount === 1 || gapCount === 2;

  const restChildClassName: (string | undefined)[] = showGapFiller
    ? [...rest.map(() => undefined), SPAN_CLASS[gapCount as 1 | 2]]
    : [];

  return (
    <>
      <section id="work" className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={copy.work.eyebrow}
            headline={copy.work.headline}
            subhead={copy.work.subhead}
          />

          <Stagger className="grid gap-6 md:grid-cols-3" step={0.08}>
            {featured.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured
                onSelect={setOpenProject}
              />
            ))}
          </Stagger>

          {rest.length > 0 ? (
            <Stagger
              className="mt-6 grid gap-6 md:grid-cols-3"
              step={0.06}
              delay={0.1}
              childClassName={restChildClassName}
            >
              {rest.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onSelect={setOpenProject}
                />
              ))}
              {showGapFiller ? <WorkGapFiller key="gap" wide={gapCount === 2} /> : null}
            </Stagger>
          ) : null}
        </div>
      </section>

      <ProjectModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </>
  );
}

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  onSelect: (project: Project) => void;
};

function ProjectCard({ project, featured = false, onSelect }: ProjectCardProps) {
  const hasCover = Boolean(project.cover);
  const fit = project.coverFit ?? 'cover';
  const isPhone = project.category === 'mobile' && fit === 'contain';

  return (
    <Card
      as="article"
      className={cn(
        'group relative p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(project)}
        aria-label={`Open details for ${project.title}`}
        className="block w-full cursor-pointer text-left"
      >
        {/* Cover */}
        <div
          className={cn(
            'relative aspect-[16/10] overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br',
            project.category === 'mobile' && 'from-accent-soft to-bg',
            project.category === 'web' && 'from-accent-secondary-soft to-bg',
            project.category === 'game' && 'from-accent-soft via-accent-secondary-soft to-bg',
          )}
        >
          {hasCover ? (
            isPhone ? (
              <div className="absolute inset-0">
                <PhoneFrame className="py-3 md:py-4">
                  <Image
                    src={withBasePath(project.cover!)}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 768px) 200px, 40vw"
                    className="object-cover"
                    priority={featured}
                  />
                </PhoneFrame>
              </div>
            ) : (
              <div
                className={cn(
                  'absolute inset-0',
                  featured && fit === 'cover' && 'ken-burns motion-decorative',
                )}
              >
                <Image
                  src={withBasePath(project.cover!)}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={cn(
                    fit === 'cover' && 'object-cover object-top',
                    fit === 'contain' && 'object-contain p-4',
                  )}
                  priority={featured}
                />
              </div>
            )
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                Screenshot pending
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className={cn('p-5', featured && 'md:p-6')}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{project.tagline}</p>
            </div>
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-ink-quiet transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, featured ? 5 : 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </button>
    </Card>
  );
}

/**
 * Gap-filler card — turns awkward trailing space in the rest grid into a
 * "Could be yours" CTA. Auto-spans 1 or 2 columns via the Stagger's
 * childClassName prop based on Work.gapCount.
 */
function WorkGapFiller({ wide }: { wide: boolean }) {
  return (
    <Link
      href={copy.workGapFiller.cta.href}
      className={cn(
        'group flex h-full rounded-[var(--radius-card)] border border-dashed border-line bg-bg/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent-soft/40 md:p-6',
        wide ? 'flex-col md:flex-row md:items-center md:gap-8' : 'flex-col',
      )}
    >
      <div className={cn('flex flex-col', wide && 'md:flex-1')}>
        <div className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
          {copy.workGapFiller.eyebrow}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
          {copy.workGapFiller.headline}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{copy.workGapFiller.body}</p>
      </div>

      <span
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent',
          wide && 'md:mt-0 md:shrink-0',
        )}
      >
        {copy.workGapFiller.cta.label}
        <ArrowUpRight className="size-3.5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
