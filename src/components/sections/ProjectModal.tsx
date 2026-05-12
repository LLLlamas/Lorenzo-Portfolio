'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { Modal } from '@/components/motion/Modal';
import { RippleTap } from '@/components/motion/RippleTap';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { copy } from '@/content/copy';
import type { GalleryImage, Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

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
              which would clip sticky behavior relative to the panel. */}
          <div className="sticky top-0 z-20 h-0">
            <RippleTap className="pointer-events-auto absolute right-3 top-3 rounded-full md:right-4 md:top-4">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full bg-bg/85 text-ink-soft shadow-sm backdrop-blur-md transition-colors hover:bg-bg hover:text-ink"
              >
                <X className="size-4" />
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
    <span className="aura-pop label-select text-xs font-bold uppercase tracking-[0.18em] text-ink-quiet">
      {children}
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

  return (
    <figure className="space-y-2">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-[0_18px_44px_-32px_rgba(0,0,0,0.5)]',
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
          <Image
            src={withBasePath(image.src)}
            alt={alt}
            fill
            sizes="(min-width: 768px) 280px, 50vw"
            className="object-cover object-top"
          />
        )}
      </div>
      {image.caption ? (
        <figcaption className="aura-pop text-center text-xs font-bold uppercase tracking-[0.12em] text-ink-quiet">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
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
