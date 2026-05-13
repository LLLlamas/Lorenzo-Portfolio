'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stagger } from '@/components/motion/Stagger';
import { GyroTilt } from '@/components/motion/GyroTilt';
import { RippleTap } from '@/components/motion/RippleTap';
import { copy } from '@/content/copy';
import { projects, type Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

const ProjectModal = dynamic(
  () =>
    import('@/components/sections/ProjectModal').then(
      (module) => module.ProjectModal,
    ),
  { ssr: false },
);

export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [hasLoadedModal, setHasLoadedModal] = useState(false);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  const showGapFiller = rest.length % 2 === 1;

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

          <Stagger
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
            step={0.08}
          >
            {featured.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured
                isSelected={openProject?.slug === project.slug}
                onSelect={handleSelectProject}
              />
            ))}
          </Stagger>

          {rest.length > 0 ? (
            <Stagger
              className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-8"
              step={0.06}
              delay={0.1}
            >
              {rest.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  isSelected={openProject?.slug === project.slug}
                  onSelect={handleSelectProject}
                />
              ))}
              {showGapFiller ? <WorkGapFiller key="gap" /> : null}
            </Stagger>
          ) : null}
        </div>
      </section>

      {hasLoadedModal ? (
        <ProjectModal
          project={openProject}
          onClose={() => setOpenProject(null)}
        />
      ) : null}
    </>
  );
}

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  isSelected?: boolean;
  onSelect: (project: Project) => void;
};

function ProjectCard({ project, featured = false, isSelected = false, onSelect }: ProjectCardProps) {
  const hasCover = Boolean(project.cover);
  const fit = project.coverFit ?? 'cover';
  const isPhone = isPhoneProject(project);
  let coverAspect = 'aspect-[16/10]';

  if (isPhone) {
    coverAspect = featured ? 'aspect-[5/4]' : 'aspect-[4/3]';
  }

  return (
    <div
      className={featured ? 'scroll-scale scroll-scale--featured' : 'scroll-scale'}
      style={{ transformOrigin: 'center bottom' }}
    >
    <RippleTap className="rounded-[var(--radius-card)]">
      <GyroTilt>
        <Card
          as="article"
          className={cn(
            'project-card group relative p-0 transition-all duration-300 hover:-translate-y-1.5',
            isSelected && 'ring-2 ring-accent/60 border-accent/50 shadow-[0_0_0_1px_var(--accent-soft),0_0_20px_-4px_var(--accent)]',
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
            'relative overflow-hidden rounded-t-[var(--radius-card)] bg-gradient-to-br',
            coverAspect,
            project.category === 'mobile' && 'from-accent-soft to-bg',
            project.category === 'web' && 'from-accent-secondary-soft to-bg',
            project.category === 'game' && 'from-accent-soft via-accent-secondary-soft to-bg',
          )}
        >
          {hasCover ? (
            isPhone ? (
              <PhoneCoverPreview project={project} featured={featured} />
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
                    fit === 'contain' && 'object-contain p-3 md:p-5',
                  )}
                  priority={featured}
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
        <div className={cn('p-6', featured && 'md:p-7')}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={cn(
                  'cascade-step cascade-1 font-display text-lg font-extrabold tracking-tight text-ink',
                  featured && 'md:text-xl',
                )}
                style={{ transitionDelay: '0ms' }}
              >
                {project.title}
              </h3>
              <p
                className="cascade-step cascade-2 mt-1 text-sm font-semibold text-ink-soft"
                style={{ transitionDelay: '90ms' }}
              >
                {project.tagline}
              </p>
            </div>
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-ink-quiet transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, featured ? 5 : 3).map((tag, i) => (
              <Tag
                key={tag}
                className="cascade-step cascade-3"
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

function isPhoneProject(project: Project) {
  return project.category === 'mobile' && project.coverFit === 'contain';
}

function PhoneCoverPreview({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  const shots = [
    project.cover ? { src: project.cover, caption: `${project.title} screenshot` } : null,
    ...(project.gallery ?? []).filter((image) => image.device === 'phone'),
  ].filter(Boolean).slice(0, 2) as { src: string; caption?: string }[];

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 px-5 py-4 md:gap-6 md:px-8 md:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,var(--accent-soft),transparent_58%)]" />
      {shots.map((shot, index) => (
        <PhoneFrame
          key={`${shot.src}-${index}`}
          className={cn(
            'relative h-full min-h-0',
            featured ? 'max-h-[390px]' : 'max-h-[280px]',
            index > 0 && 'hidden translate-y-5 sm:grid',
          )}
        >
          <Image
            src={withBasePath(shot.src)}
            alt={shot.caption ?? `${project.title} screenshot ${index + 1}`}
            fill
            sizes="(min-width: 768px) 180px, 44vw"
            className="object-cover"
            priority={featured && index === 0}
          />
        </PhoneFrame>
      ))}
    </div>
  );
}

/**
 * "LOADING" placeholder — turns awkward trailing space into a PS1-style
 * coming-soon slot. Dashed accent border, blinking accent text, hover
 * resolves into a CTA.
 */
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

      {/* Decorative scan line that draws across on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-1/2 h-px origin-left scale-x-0 bg-accent/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
    </Link>
  );
}
