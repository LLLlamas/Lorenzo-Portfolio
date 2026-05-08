import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stagger } from '@/components/motion/Stagger';
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

        <Stagger className="grid gap-6 md:grid-cols-3" step={0.08}>
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} featured />
          ))}
        </Stagger>

        <Stagger className="mt-6 grid gap-6 md:grid-cols-3" step={0.06} delay={0.1}>
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Stagger>
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
        {/* Inner layer that takes the Ken Burns motion on featured cards.
            Once real screenshots land, swap the gradient for an <img> here. */}
        <div
          className={cn(
            'absolute inset-0',
            featured && 'ken-burns motion-decorative',
          )}
        >
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
              Screenshot pending
            </span>
          </div>
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
            className="size-4 shrink-0 text-ink-quiet transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
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
    'group block p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
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
