'use client';

import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { Modal } from '@/components/motion/Modal';
import { Tag } from '@/components/ui/Tag';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import type { Project } from '@/content/projects';
import { cn, withBasePath } from '@/lib/utils';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  return (
    <Modal open={Boolean(project)} onClose={onClose} label={project?.title}>
      {project ? (
        <article>
          {/* Close button — fixed to the panel, above the cover */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-bg/80 text-ink-soft backdrop-blur-md transition-colors hover:bg-bg hover:text-ink md:right-4 md:top-4"
          >
            <X className="size-4" />
          </button>

          {/* Cover */}
          <ProjectCover project={project} />

          {/* Body */}
          <div className="px-6 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8">
            <header className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {project.title}
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-quiet">
                {project.year}
              </span>
            </header>

            <p className="mt-2 text-pretty text-base text-ink-soft md:text-lg">
              {project.tagline}
            </p>

            {project.description ? (
              <p className="mt-6 text-pretty text-base leading-relaxed text-ink">
                {project.description}
              </p>
            ) : null}

            {project.highlights && project.highlights.length > 0 ? (
              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                  Highlights
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft md:text-base">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                  Stack
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
              {project.role ? (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                    Role
                  </p>
                  <p className="mt-2 text-sm text-ink">{project.role}</p>
                </div>
              ) : null}
            </div>

            {project.gallery && project.gallery.length > 0 ? (
              <div className="mt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                  More
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {project.gallery.map((g, i) => (
                    <GalleryItem key={i} image={g} title={project.title} index={i} />
                  ))}
                </div>
              </div>
            ) : null}

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-on transition-opacity hover:opacity-90"
              >
                Visit live
                <ArrowUpRight className="ml-1.5 size-4" />
              </a>
            ) : null}
          </div>
        </article>
      ) : null}
    </Modal>
  );
}

function ProjectCover({ project }: { project: Project }) {
  const isPhone = project.category === 'mobile' && project.coverFit === 'contain';
  const hasCover = Boolean(project.cover);

  return (
    <div
      className={cn(
        'relative aspect-[16/10] overflow-hidden bg-gradient-to-br',
        project.category === 'mobile' && 'from-accent-soft to-bg',
        project.category === 'web' && 'from-accent-secondary-soft to-bg',
        project.category === 'game' && 'from-accent-soft via-accent-secondary-soft to-bg',
      )}
    >
      {hasCover ? (
        isPhone ? (
          <PhoneFrame className="py-4 md:py-6">
            <Image
              src={withBasePath(project.cover!)}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 768px) 320px, 50vw"
              className="object-cover"
              priority
            />
          </PhoneFrame>
        ) : (
          <Image
            src={withBasePath(project.cover!)}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className={cn(
              project.coverFit === 'contain' && 'object-contain p-6',
              project.coverFit !== 'contain' && 'object-cover object-top',
            )}
            priority
          />
        )
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
            Screenshot pending
          </span>
        </div>
      )}
    </div>
  );
}

function GalleryItem({
  image,
  title,
  index,
}: {
  image: { src: string; caption?: string; device?: 'phone' | 'browser' };
  title: string;
  index: number;
}) {
  const isPhone = image.device === 'phone';
  const alt = image.caption ?? `${title} — view ${index + 2}`;

  return (
    <figure className="space-y-2">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-line bg-bg',
          isPhone ? 'aspect-[9/16] p-2' : 'aspect-[16/10]',
        )}
      >
        {isPhone ? (
          <PhoneFrame>
            <Image
              src={withBasePath(image.src)}
              alt={alt}
              fill
              sizes="(min-width: 768px) 240px, 50vw"
              className="object-cover"
            />
          </PhoneFrame>
        ) : (
          <Image
            src={withBasePath(image.src)}
            alt={alt}
            fill
            sizes="(min-width: 768px) 240px, 50vw"
            className="object-cover object-top"
          />
        )}
      </div>
      {image.caption ? (
        <figcaption className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-quiet">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
