'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RippleTap } from '@/components/motion/RippleTap';
import { MosaicReveal } from '@/components/motion/MosaicReveal';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { copy } from '@/content/copy';
import { categoryLabels, projects, type Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

const ProjectModal = dynamic(
  () =>
    import('@/components/sections/ProjectModal').then(
      (module) => module.ProjectModal,
    ),
  { ssr: false },
);

/**
 * The showcase. Featured projects run as full-width editorial case rows —
 * parallax covers, mosaic reveals, mono telemetry, a proof line pulled from
 * each project's first highlight. Everything else lands in a compact archive
 * grid below, capped by the availability CTA tile.
 */
export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [hasLoadedModal, setHasLoadedModal] = useState(false);

  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);
  const visibleProjects = [...featured, ...archive];

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
            index={2}
            headline={copy.work.headline}
            subhead={copy.work.subhead}
          />

          {/* Featured case rows */}
          <div className="space-y-20 md:space-y-28">
            {featured.map((project, i) => (
              <CaseRow
                key={project.slug}
                project={project}
                index={i}
                flip={i % 2 === 1}
                isSelected={openProject?.slug === project.slug}
                onSelect={handleSelectProject}
              />
            ))}
          </div>

          {/* Archive */}
          <div className="mt-24 md:mt-32">
            <div className="mb-8 flex items-baseline gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-quiet">
                {copy.work.archiveLabel}
              </span>
              <div className="h-px flex-1 self-center bg-line" />
              <span className="font-mono text-[11px] text-ink-quiet">
                {String(archive.length).padStart(2, '0')}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {archive.map((project, i) => (
                <ArchiveCard
                  key={project.slug}
                  project={project}
                  index={featured.length + i}
                  isSelected={openProject?.slug === project.slug}
                  onSelect={handleSelectProject}
                />
              ))}
              <WorkGapFiller />
            </div>
          </div>
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

type CaseRowProps = {
  project: Project;
  index: number;
  flip: boolean;
  isSelected: boolean;
  onSelect: (project: Project) => void;
};

function CaseRow({ project, index, flip, isSelected, onSelect }: CaseRowProps) {
  const prefersReduced = useReducedMotion();
  const rowRef = useRef<HTMLElement | null>(null);

  // Cover parallax — the shot drifts inside its frame as the row crosses the viewport
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], ['-4.5%', '4.5%']);

  const indexLabel = String(index + 1).padStart(2, '0');
  const isPhone = project.category === 'mobile' && project.coverFit === 'contain';
  const fit = project.coverFit ?? 'cover';
  const proofLine = project.highlights?.[0]?.text;

  return (
    <motion.article
      ref={rowRef}
      className="group relative border-t border-line pt-10 md:pt-12"
      initial={prefersReduced ? false : { opacity: 0, y: 32 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        {/* Cover */}
        <button
          type="button"
          onClick={() => onSelect(project)}
          aria-label={`Open case study for ${project.title}`}
          className={cn(
            'block w-full min-w-0 cursor-pointer text-left md:col-span-7',
            flip && 'md:order-2',
          )}
          data-cursor-hover
        >
          <MosaicReveal
            className={cn(
              'hud-corners project-media-well relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-bg-elevated',
              'transition-[border-color,box-shadow] duration-300',
              'group-hover:border-ink-quiet/50',
              isSelected && 'border-accent/60 shadow-[0_0_28px_-10px_var(--accent)]',
            )}
          >
            <span aria-hidden className="hud-tick hud-tick--tl" />
            <span aria-hidden className="hud-tick hud-tick--tr" />
            <span aria-hidden className="hud-tick hud-tick--bl" />
            <span aria-hidden className="hud-tick hud-tick--br" />

            {project.cover ? (
              isPhone ? (
                <PhoneCasePreview project={project} />
              ) : (
                <motion.div
                  className="absolute -inset-y-[8%] inset-x-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  style={prefersReduced ? undefined : { y: coverY }}
                >
                  <Image
                    src={withBasePath(project.cover)}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className={cn(
                      fit === 'cover' && 'object-cover object-top',
                      fit === 'contain' && 'object-contain p-4 md:p-8',
                    )}
                    priority={index === 0}
                  />
                </motion.div>
              )
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
                  [ Screenshot pending ]
                </span>
              </div>
            )}

            {/* Mono cover caption */}
            <span className="pointer-events-none absolute bottom-3 left-4 z-[6] font-mono text-[9px] uppercase tracking-[0.22em] text-ink-quiet opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              FIG. {indexLabel} — {project.title}
            </span>
          </MosaicReveal>
        </button>

        {/* Meta column */}
        <div className={cn('min-w-0 md:col-span-5', flip && 'md:order-1')}>
          <motion.div
            initial={prefersReduced ? false : 'hidden'}
            whileInView={prefersReduced ? undefined : 'visible'}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
            }}
          >
            <CaseLine>
              <span className="font-mono text-sm text-accent">{indexLabel}</span>
              <span className="ml-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
                {categoryLabels[project.category]} — {project.year}
              </span>
            </CaseLine>

            <CaseLine>
              <button
                type="button"
                onClick={() => onSelect(project)}
                className="capability-row mt-4 block cursor-pointer text-left"
                aria-label={`Open details for ${project.title}`}
                data-cursor-hover
              >
                <span
                  className="ghost-title font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink transition-colors duration-300 hover:text-accent md:text-5xl"
                  data-text={project.title}
                >
                  {project.title}
                </span>
              </button>
            </CaseLine>

            <CaseLine>
              <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-ink-soft">
                {project.tagline}
              </p>
            </CaseLine>

            {proofLine ? (
              <CaseLine>
                <p className="mt-5 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-accent">
                  <span aria-hidden className="mr-2">↳</span>
                  {proofLine}
                </p>
              </CaseLine>
            ) : null}

            <CaseLine>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-quiet">
                {project.stack.join(' / ')}
              </p>
            </CaseLine>

            <CaseLine>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <button
                  type="button"
                  onClick={() => onSelect(project)}
                  className="link-bracket link-bracket--accent cursor-pointer text-xs"
                  data-cursor-hover
                >
                  <ScrambleText text={copy.work.openCase} rescrambleOnHover duration={420} />
                </button>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-bracket text-xs"
                    data-cursor-hover
                  >
                    {copy.projectModal.visitLive}
                  </a>
                ) : null}
              </div>
            </CaseLine>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function CaseLine({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function PhoneCasePreview({ project }: { project: Project }) {
  const shots = [
    project.cover ? { src: project.cover, caption: `${project.title} screenshot` } : null,
    ...(project.gallery ?? []).filter((image) => image.device === 'phone'),
  ]
    .filter(Boolean)
    .slice(0, 2) as { src: string; caption?: string }[];

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 px-6 py-4 md:gap-8 md:px-10 md:py-6">
      {shots.map((shot, index) => (
        <PhoneFrame
          key={`${shot.src}-${index}`}
          className={cn(
            'relative h-full min-h-0 max-h-[300px]',
            index > 0 && 'hidden translate-y-5 sm:grid',
          )}
        >
          <Image
            src={withBasePath(shot.src)}
            alt={shot.caption ?? `${project.title} screenshot ${index + 1}`}
            fill
            sizes="(min-width: 768px) 200px, 40vw"
            className="object-cover"
          />
        </PhoneFrame>
      ))}
    </div>
  );
}

type ArchiveCardProps = {
  project: Project;
  index: number;
  isSelected: boolean;
  onSelect: (project: Project) => void;
};

function ArchiveCard({ project, index, isSelected, onSelect }: ArchiveCardProps) {
  const prefersReduced = useReducedMotion();
  const hasCover = Boolean(project.cover);
  const fit = project.coverFit ?? 'cover';

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <RippleTap className="rounded-lg">
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
            <div className="project-media-well relative aspect-video overflow-hidden">
              {hasCover ? (
                <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
                  <Image
                    src={withBasePath(project.cover!)}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={cn(
                      fit === 'cover' && 'object-cover object-top',
                      fit === 'contain' && 'object-contain p-3',
                    )}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
                    [ Screenshot pending ]
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start justify-between gap-3 border-t border-line p-4">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, '0')}/
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-extrabold uppercase tracking-tight text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-ink-quiet">
                    {project.stack.slice(0, 3).join(' / ')} — {project.year}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                aria-hidden
                className="mt-0.5 size-3.5 shrink-0 text-ink-quiet transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
          </button>
        </article>
      </RippleTap>
    </motion.div>
  );
}

function WorkGapFiller() {
  return (
    <Link
      href={copy.workGapFiller.cta.href}
      className="group relative flex h-full min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-bg-elevated/60 p-6 text-center transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent/50"
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="loading-blink font-mono text-[10px] uppercase tracking-[0.2em] text-accent"
          aria-hidden
        >
          [ {copy.workGapFiller.eyebrow} ]
        </span>
        <p className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">
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
