import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { ProjectCard } from '../components/cards'
import { fileUrl } from '../lib/insforge'

function ProjectDetail({ project, onClose }) {
  const img = fileUrl(project.image_url)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="card max-h-[85vh] w-full max-w-2xl overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-cherry/10 px-2.5 py-0.5 text-[11px] font-semibold text-cherry">{project.category}</span>
            <h3 className="mt-2 font-serif text-2xl font-semibold text-charcoal">{project.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-charcoal/60 hover:bg-charcoal/5" aria-label="Close">✕</button>
        </div>
        {img && <img src={img} alt={project.title} className="mb-5 aspect-video w-full rounded-xl object-cover" />}
        {project.problem && (
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burnt-dark">Problem</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink/80">{project.problem}</p>
          </div>
        )}
        {project.description && (
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-burnt-dark">About</h4>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/80">{project.description}</p>
          </div>
        )}
        {project.technologies?.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span key={t} className="rounded-md bg-charcoal/5 px-2 py-1 text-[11px] font-medium text-ink/70">{t}</span>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cherry hover:underline">GitHub →</a>}
          {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-burnt-dark hover:underline">Live Demo →</a>}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const data = useOutletContext()
  const projects = data?.projects || []
  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects])
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Portfolio" title="Projects" description="Things I've designed and built — from class projects to personal experiments." />

      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {['All', ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === c ? 'bg-cherry text-cream' : 'bg-charcoal/5 text-ink/70 hover:bg-charcoal/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-ink/60">No projects added yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setSelected(p)} className="text-left">
              <ProjectCard project={p} />
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
