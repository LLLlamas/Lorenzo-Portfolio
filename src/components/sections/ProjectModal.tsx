'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { Modal } from '@/components/motion/Modal';
import { RippleTap } from '@/components/motion/RippleTap';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { copy } from '@/content/copy';
import type { GalleryImage, Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  project: Project | null;
  onClose: () => void;
};

const modalCopy = copy.projectModal;

export function ProjectModal({ project, onClose }: Props) {
  return (
    <Modal open={Boolean(project)} onClose={onClose} label={project?.title}>
      {project ? (
        <>
          {/* 0-height sticky wrapper sits at the top of the panel scroll
              viewport and pins the X to the top-right as the user scrolls.
              Lives outside <article> because article has overflow-hidden,
              which would clip sticky behavior relative to the panel.
              `top` honors iOS safe-area inset so the X clears the notch. */}
          <div
            className="sticky z-20 h-0"
            style={{ top: 'max(0px, env(safe-area-inset-top))' }}
          >
            <RippleTap
              className="pointer-events-auto absolute right-4 top-4 rounded-full md:right-5 md:top-5"
              color="var(--line-accent)"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-11 place-items-center rounded-full border border-line bg-bg/90 text-ink-soft shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors hover:bg-bg hover:text-ink md:size-10"
              >
                <X className="size-[18px] md:size-4" />
              </button>
            </RippleTap>
          </div>

          <article className="overflow-hidden">
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
                  {project.highlights.map((highlight, index) => (
                    <li
                      key={highlight}
                      className="rounded-xl border border-line bg-bg/60 p-4 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.45)]"
                    >
                      <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {project.gallery && project.gallery.length > 0 ? (
              <section className="mt-8">
                <SectionRule label={modalCopy.more} />
                <div
                  className={cn(
                    'mt-4 grid gap-4',
                    project.gallery.some((image) => image.device === 'phone')
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'md:grid-cols-3',
                  )}
                >
                  {project.gallery.map((image, index) => (
                    <GalleryItem
                      key={`${image.src}-${index}`}
                      image={image}
                      title={project.title}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          </article>
        </>
      ) : null}
    </Modal>
  );
}

function ProjectCover({ project }: { project: Project }) {
  const isPhone = isPhoneProject(project);
  const hasCover = Boolean(project.cover);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        isPhone ? 'aspect-[4/3] md:aspect-[16/8]' : 'aspect-[16/9]',
        project.category === 'mobile' && 'from-accent-soft to-bg',
        project.category === 'web' && 'from-accent-secondary-soft to-bg',
        project.category === 'game' && 'from-accent-soft via-accent-secondary-soft to-bg',
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,var(--accent-soft),transparent_60%)]" />
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
    <div className="bg-bg-elevated p-4">
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
}: {
  image: GalleryImage;
  title: string;
  index: number;
}) {
  const isPhone = image.device === 'phone';
  const alt = image.caption ?? `${title} view ${index + 2}`;
  const prefersReduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLButtonElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      <RippleTap className={cn('rounded-xl', isPhone && 'rounded-xl')}>
        <motion.button
          ref={cardRef}
          type="button"
          onClick={() => setZoomed(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileTap={prefersReduced ? undefined : { scale: 0.965 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          aria-label={`Expand ${alt}`}
          className={cn(
            'group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)] outline-none transition-shadow hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-accent',
            isPhone ? 'aspect-[9/16] p-2' : 'aspect-[16/10]',
          )}
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
        </motion.button>
      </RippleTap>
      {image.caption ? (
        <figcaption className="aura-pop text-center text-xs font-bold uppercase tracking-[0.12em] text-ink-quiet">
          {image.caption}
        </figcaption>
      ) : null}

      <AnimatePresence>
        {zoomed ? (
          <ImageZoomOverlay
            src={image.src}
            alt={alt}
            isPhone={isPhone}
            onClose={() => setZoomed(false)}
            prefersReduced={prefersReduced}
          />
        ) : null}
      </AnimatePresence>
    </figure>
  );
}

/**
 * Fullscreen image lightbox with a 3D "pop" entrance.
 *
 *  - Renders into <body> via portal so it escapes the project modal's
 *    overflow/scroll context. z-[105] sits above the project modal (z-100)
 *    but below the custom cursor (z-120) and the global ripple surface (z-110).
 *  - Perspective container + transform-style: preserve-3d on the inner image
 *    gives a genuine 3D rotate-in (not a flat scale). The image enters tilted
 *    and rotates flat as it scales, then exits with the opposite tilt.
 *  - Captures ESC in capture phase so the underlying Modal's ESC handler
 *    doesn't also close the project modal.
 */
function ImageZoomOverlay({
  src,
  alt,
  isPhone,
  onClose,
  prefersReduced,
}: {
  src: string;
  alt: string;
  isPhone: boolean;
  onClose: () => void;
  prefersReduced: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler, { capture: true });
    return () => document.removeEventListener('keydown', handler, { capture: true });
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[105] flex items-center justify-center p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReduced ? 0.12 : 0.22 }}
    >
      <button
        type="button"
        aria-label="Close expanded image"
        onClick={onClose}
        className="absolute inset-0 cursor-zoom-out bg-ink/80 backdrop-blur-md"
      />

      <div
        className="relative z-10 flex max-h-full max-w-5xl items-center justify-center"
        style={{ perspective: 1400 }}
      >
        <motion.div
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
          initial={prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.72, rotateX: 14, rotateY: -12, z: -120 }
          }
          animate={prefersReduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, z: 0 }
          }
          exit={prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.78, rotateX: -10, rotateY: 8, z: -160 }
          }
          transition={prefersReduced
            ? { duration: 0.12 }
            : { type: 'spring', stiffness: 240, damping: 22, mass: 0.9 }
          }
          className="relative drop-shadow-[0_50px_80px_rgba(0,0,0,0.55)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath(src)}
            alt={alt}
            draggable={false}
            className={cn(
              'block w-auto select-none rounded-xl border border-line bg-bg-elevated',
              isPhone ? 'max-h-[92vh] max-w-[78vw] md:max-w-md' : 'max-h-[88vh] max-w-full',
            )}
          />
        </motion.div>
      </div>
    </motion.div>,
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
