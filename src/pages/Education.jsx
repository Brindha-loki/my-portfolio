import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

export default function Education() {
  const data = useOutletContext()
  const education = data?.education || []

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Academics" title="Education" description="My academic journey and what I've studied along the way." />

      {education.length === 0 ? (
        <p className="text-ink/60">No education entries added yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((e) => (
            <article key={e.id} className="card p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-charcoal">{e.degree}</h3>
                  {e.field && <p className="text-sm font-medium text-cherry">{e.field}</p>}
                </div>
                {(e.start_date || e.end_date) && (
                  <span className="shrink-0 rounded-full bg-charcoal/5 px-3 py-1 text-xs font-semibold text-ink/70">
                    {e.start_date} {e.end_date ? `— ${e.end_date}` : ''}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-ink/70">{e.institution}</p>
              {e.description && <p className="mt-3 text-sm leading-relaxed text-ink/75">{e.description}</p>}
              {e.coursework?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50">Coursework</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {e.coursework.map((c) => (
                      <span key={c} className="rounded-md bg-burnt/15 px-2.5 py-1 text-[11px] font-medium text-burnt-dark">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
