'use client';

import Image from 'next/image';
import { useRef, useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Modal } from '@/components/motion/Modal';
import { RippleTap } from '@/components/motion/RippleTap';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { copy } from '@/content/copy';
import type { GalleryImage, Highlight, Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  project: Project | null;
  onClose: () => void;
  prevProject?: Project | null;
  nextProject?: Project | null;
  onPrev?: () => void;
  onNext?: () => void;
  /** Zero-based index of the open project within the visible set. */
  projectIndex?: number;
  /** Total number of projects in the visible set. */
  projectCount?: number;
};

const modalCopy = copy.projectModal;

export function ProjectModal({
  project,
  onClose,
  prevProject,
  nextProject,
  onPrev,
  onNext,
  projectIndex,
  projectCount,
}: Props) {
  const [expandedImage, setExpandedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!project) setExpandedImage(null);
  }, [project]);

  // Scroll the modal panel back to the top whenever the displayed project changes
  useEffect(() => {
    if (!project?.slug) return;
    const panel = document.querySelector<HTMLElement>('[data-lenis-prevent]');
    if (panel) panel.scrollTop = 0;
  }, [project?.slug]);

  return (
    <>
      <Modal open={Boolean(project)} onClose={onClose} label={project?.title}>
        {project ? (
          /* 0-height sticky wrapper sits at the top of the panel scroll viewport
             and pins the X to the top-right as the user scrolls.
             The absolute div wraps RippleTap so that RippleTap's own "relative
             overflow-hidden" on touch devices doesn't override the absolute
             positioning and push the button off-screen on mobile. */
          <div className="sticky top-0 z-20 h-0">
            <div className="absolute right-3 top-3 md:right-4 md:top-4">
              <RippleTap className="rounded-full">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-10 md:size-9 place-items-center rounded-full border border-white/15 bg-black/50 text-ink-soft shadow-sm backdrop-blur-md transition-colors hover:bg-black/70 hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </RippleTap>
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {project ? (
            <motion.article
              key={project.slug}
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <ProjectCover project={project} />

              <div className="relative px-5 pb-7 pt-6 md:px-8 md:pb-9 md:pt-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                <header className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="min-w-0">
                    <p className="aura-pop text-xs font-bold uppercase tracking-[0.18em] text-ink-quiet">
                      <span className="label-select">{project.year}</span>
                    </p>
                    <h2 className="mt-2 text-pretty font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                      {project.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft md:text-lg">
                      {project.tagline}
                    </p>
                  </div>

                  {project.link ? (
                    <RippleTap className="rounded-full">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-on transition-opacity hover:opacity-90"
                      >
                        {modalCopy.visitLive}
                        <ArrowUpRight className="ml-1.5 size-4" />
                      </a>
                    </RippleTap>
                  ) : null}
                </header>

                {project.description ? (
                  <section className="mt-7 border-y border-line py-6 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
                    <DetailLabel>{modalCopy.overview}</DetailLabel>
                    <p className="mt-3 text-pretty text-base leading-8 text-ink md:mt-0 md:text-lg">
                      {project.description}
                    </p>
                  </section>
                ) : null}

                <ProjectFacts project={project} />

                {project.highlights && project.highlights.length > 0 ? (
                  <section className="mt-7">
                    <SectionRule label={modalCopy.highlights} />
                    <ol className="mt-4 grid gap-3 md:grid-cols-3">
                      {project.highlights.map((highlight: Highlight, index) => (
                        <li
                          key={highlight.text}
                          className="readable-glass-soft flex flex-col rounded-xl border p-4 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.45)]"
                        >
                          <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {highlight.metric ? (
                            <p className="mt-2 font-display text-2xl font-bold leading-none tracking-tight text-ink">
                              {highlight.metric}
                            </p>
                          ) : null}
                          <p
                            className={cn(
                              'text-sm leading-relaxed text-ink-soft',
                              highlight.metric ? 'mt-1' : 'mt-3',
                            )}
                          >
                            {highlight.text}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}

                {project.gallery && project.gallery.length > 0 ? (
                  <section className="mt-8">
                    <SectionRule label={modalCopy.more} />
                    <div className="-mx-5 md:-mx-8 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:px-8 pb-3 scrollbar-none">
                      {project.gallery.map((image, index) => (
                        <div
                          key={`${image.src}-${index}`}
                          className={cn(
                            'snap-start flex-none',
                            image.device === 'phone'
                              ? 'w-[48vw] md:w-48'
                              : 'w-[75vw] md:w-80',
                          )}
                        >
                          <GalleryItem
                            image={image}
                            title={project.title}
                            index={index}
                            onExpand={setExpandedImage}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              {(onPrev || onNext) && (
                <div className="flex items-center justify-between border-t border-line px-5 py-4 md:px-8">
                  <button
                    type="button"
                    onClick={onPrev}
                    disabled={!onPrev}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,opacity] duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-bg-elevated"
                  >
                    <ChevronLeft className="size-4" />
                    {prevProject?.title ?? 'Previous'}
                  </button>
                  {projectIndex != null && projectCount != null ? (
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-quiet tabular-nums">
                      {String(projectIndex + 1).padStart(2, '0')} /{' '}
                      {String(projectCount).padStart(2, '0')}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!onNext}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,opacity] duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-bg-elevated"
                  >
                    {nextProject?.title ?? 'Next'}
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </motion.article>
          ) : null}
        </AnimatePresence>
      </Modal>

      <GalleryLightbox
        image={expandedImage}
        title={project?.title ?? ''}
        onClose={() => setExpandedImage(null)}
      />
    </>
  );
}

function ProjectCover({ project }: { project: Project }) {
  const isPhone = isPhoneProject(project);
  const hasCover = Boolean(project.cover);

  return (
    <div
      className={cn(
        'project-media-well relative overflow-hidden backdrop-blur-sm',
        isPhone ? 'aspect-[4/3] md:aspect-[16/8]' : 'aspect-[16/9]',
      )}
    >
      {hasCover ? (
        isPhone ? (
          <PhoneHero project={project} />
        ) : (
          <Image
            src={withBasePath(project.cover!)}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 896px, 100vw"
            className={cn(
              project.coverFit === 'contain' && 'object-contain p-3 md:p-5',
              project.coverFit !== 'contain' && 'object-cover object-top',
            )}
            priority
          />
        )
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-quiet">
            Screenshot pending
          </span>
        </div>
      )}
    </div>
  );
}

function PhoneHero({ project }: { project: Project }) {
  const shots = getPhoneShots(project);

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 px-7 py-5 md:gap-8 md:px-10 md:py-7">
      {shots.map((shot, index) => (
        <PhoneFrame
          key={`${shot.src}-${index}`}
          className={cn(
            'relative h-full min-h-0 max-h-[430px]',
            index > 0 && 'hidden translate-y-6 sm:grid',
          )}
        >
          <Image
            src={withBasePath(shot.src)}
            alt={shot.caption ?? `${project.title} screenshot ${index + 1}`}
            fill
            sizes="(min-width: 768px) 210px, 46vw"
            className="object-cover"
            priority={index === 0}
          />
        </PhoneFrame>
      ))}
    </div>
  );
}

function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl
      className={cn(
        'mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line',
        project.role
          ? 'md:grid-cols-[1.35fr_0.85fr_0.45fr]'
          : 'md:grid-cols-[1.4fr_0.6fr]',
      )}
    >
      <FactBlock label={modalCopy.stack}>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((stackItem) => (
            <Tag key={stackItem}>{stackItem}</Tag>
          ))}
        </div>
      </FactBlock>

      {project.role ? (
        <FactBlock label={modalCopy.role}>
          <p className="text-sm leading-relaxed text-ink">{project.role}</p>
        </FactBlock>
      ) : null}

      <FactBlock label={modalCopy.year}>
        <p className="text-sm text-ink">{project.year}</p>
      </FactBlock>
    </dl>
  );
}

function FactBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="readable-glass-soft p-4">
      <dt>
        <DetailLabel>{label}</DetailLabel>
      </dt>
      <dd className="mt-3">{children}</dd>
    </div>
  );
}

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <DetailLabel>{label}</DetailLabel>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

function DetailLabel({ children }: { children: ReactNode }) {
  return (
    <span className="aura-pop self-start text-xs font-bold uppercase tracking-[0.18em] text-ink-quiet">
      <span className="label-select">{children}</span>
    </span>
  );
}

function GalleryItem({
  image,
  title,
  index,
  onExpand,
}: {
  image: GalleryImage;
  title: string;
  index: number;
  onExpand: (image: GalleryImage) => void;
}) {
  const isPhone = image.device === 'phone';
  const alt = image.caption ?? `${title} view ${index + 2}`;
  const prefersReduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || isPhone || !cardRef.current || !imgWrapRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    imgWrapRef.current.style.transition = 'none';
    imgWrapRef.current.style.transform = `translate3d(${dx * 12}px, ${dy * 10}px, 0) scale(1.06)`;
  };

  const handleMouseLeave = () => {
    if (!imgWrapRef.current) return;
    imgWrapRef.current.style.transition = 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    imgWrapRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
  };

  return (
    <figure className="space-y-2">
      {/* RippleTap wraps the perspective container so the tap ripple is clipped to
          the card shape. The perspective div is separate from the motion.div so that
          rotateY on the card reads the parent's perspective correctly. */}
      <RippleTap className="block rounded-xl">
        <div style={{ perspective: prefersReduced ? undefined : '900px' }}>
          <motion.div
            ref={cardRef}
            className={cn(
              'project-media-well relative overflow-hidden rounded-xl border border-white/10 shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)] cursor-pointer',
              isPhone ? 'aspect-[9/16] p-2' : 'aspect-[16/10]',
            )}
            whileTap={prefersReduced ? undefined : { scale: 1.05, rotateY: 6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onExpand(image)}
          >
            {isPhone ? (
              <PhoneFrame>
                <Image
                  src={withBasePath(image.src)}
                  alt={alt}
                  fill
                  sizes="(min-width: 768px) 220px, 45vw"
                  className="object-cover"
                />
              </PhoneFrame>
            ) : (
              <div
                ref={imgWrapRef}
                className="absolute inset-0"
                style={{ willChange: 'transform' }}
              >
                <Image
                  src={withBasePath(image.src)}
                  alt={alt}
                  fill
                  sizes="(min-width: 768px) 280px, 50vw"
                  className="object-cover object-top"
                />
              </div>
            )}
          </motion.div>
        </div>
      </RippleTap>
      {image.caption ? (
        <figcaption className="aura-pop text-center text-xs font-bold uppercase tracking-[0.12em] text-ink-quiet">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function GalleryLightbox({
  image,
  title,
  onClose,
}: {
  image: GalleryImage | null;
  title: string;
  onClose: () => void;
}) {
  const prefersReduced = usePrefersReducedMotion();

  // ESC closes the lightbox without also closing the underlying modal
  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, { capture: true });
    return () => document.removeEventListener('keydown', onKey, { capture: true });
  }, [image, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-[500] flex cursor-pointer items-center justify-center bg-black/72 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.1 : 0.2 }}
          onClick={onClose}
        >
          {/* Perspective parent gives the image panel its 3D depth */}
          <div style={{ perspective: '1200px' }}>
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-line/40 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.95)] cursor-default"
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { scale: 0.74, rotateX: 18, opacity: 0, filter: 'blur(20px)' }
              }
              animate={
                prefersReduced
                  ? { opacity: 1 }
                  : { scale: 1, rotateX: 0, opacity: 1, filter: 'blur(0px)' }
              }
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { scale: 0.62, rotateX: -14, opacity: 0, filter: 'blur(16px)' }
              }
              transition={
                prefersReduced
                  ? { duration: 0.1 }
                  : {
                      type: 'spring',
                      stiffness: 360,
                      damping: 28,
                      filter: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={withBasePath(image.src)}
                alt={image.caption ?? title}
                width={1400}
                height={900}
                className="block max-w-[88vw] max-h-[78vh] w-auto h-auto object-contain"
              />
            </motion.div>
          </div>

          {/* Close button — sits outside the blurred panel so it's always sharp */}
          <div className="absolute right-4 top-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close image"
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function isPhoneProject(project: Project) {
  return project.category === 'mobile' && project.coverFit === 'contain';
}

function getPhoneShots(project: Project) {
  return [
    project.cover ? { src: project.cover, caption: `${project.title} screenshot` } : null,
    ...(project.gallery ?? []).filter((image) => image.device === 'phone'),
  ].filter(Boolean).slice(0, 2) as { src: string; caption?: string }[];
}
