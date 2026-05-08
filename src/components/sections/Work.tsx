import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { copy } from '@/content/copy';
import { projects, type Project } from '@/content/projects';
import { cn } from '@/lib/utils';

export function Work() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={copy.work.eyebrow}
          headline={copy.work.headline}
          subhead={copy.work.subhead}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} featured />
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const content = (
    <>
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-card)-2px)] bg-gradient-to-br',
          project.category === 'mobile' && 'from-accent-soft to-bg',
          project.category === 'web' && 'from-accent-secondary-soft to-bg',
          project.category === 'game' && 'from-accent-soft via-accent-secondary-soft to-bg',
        )}
      >
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
            Screenshot pending
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{project.tagline}</p>
        </div>
        {project.link ? (
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-ink-quiet transition-colors group-hover:text-ink"
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, featured ? 5 : 3).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </>
  );

  const cardClass = cn(
    'group block p-5 transition-shadow hover:shadow-sm',
    featured && 'md:p-6',
  );

  if (project.link) {
    return (
      <Card as="article" className={cardClass}>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer noopener"
          className="block"
        >
          {content}
        </a>
      </Card>
    );
  }

  return (
    <Card as="article" className={cardClass}>
      {content}
    </Card>
  );
}
