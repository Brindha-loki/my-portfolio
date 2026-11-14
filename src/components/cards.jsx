import { Link } from 'react-router-dom'
import { fileUrl } from '../lib/insforge'

function Proficiency({ level }) {
  if (!level) return null
  return (
    <div className="mt-3 flex gap-1" aria-label={`Proficiency ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-full ${i <= level ? 'bg-cherry' : 'bg-charcoal/15'}`}
        />
      ))}
    </div>
  )
}

export function SkillCard({ skill }) {
  return (
    <div className="card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-charcoal">{skill.name}</h3>
        <span className="shrink-0 rounded-full bg-burnt/15 px-2.5 py-0.5 text-[11px] font-semibold text-burnt-dark">
          {skill.category}
        </span>
      </div>
      {skill.description && <p className="mt-2 text-sm leading-relaxed text-ink/70">{skill.description}</p>}
      <Proficiency level={skill.level} />
    </div>
  )
}

export function ProjectCard({ project, compact = false }) {
  const img = fileUrl(project.image_url)
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      {img && !compact && (
        <div className="aspect-[16/9] overflow-hidden bg-charcoal/5">
          <img
            src={img}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-cherry/10 px-2.5 py-0.5 text-[11px] font-semibold text-cherry">
            {project.category}
          </span>
          {project.featured && (
            <span className="rounded-full bg-burnt/20 px-2.5 py-0.5 text-[11px] font-semibold text-burnt-dark">
              Featured
            </span>
          )}
        </div>
        <h3 className="font-serif text-xl font-semibold text-charcoal">{project.title}</h3>
        {project.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{project.description}</p>
        )}
        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span key={t} className="rounded-md bg-charcoal/5 px-2 py-1 text-[11px] font-medium text-ink/70">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex gap-3 pt-5">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-cherry hover:text-cherry-dark"
            >
              GitHub →
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-burnt-dark hover:text-cherry"
            >
              Live Demo →
            </a>
          )}
          {!project.github_url && !project.demo_url && (
            <Link to={`/projects`} className="text-sm font-semibold text-charcoal/50 hover:text-cherry">
              View details →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
