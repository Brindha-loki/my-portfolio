import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const KINDS = [
  ['all', 'All'],
  ['internship', 'Internships'],
  ['work', 'Work Experience'],
  ['workshop', 'Workshops'],
  ['certification', 'Certifications'],
  ['achievement', 'Achievements'],
]

const KIND_LABEL = {
  internship: 'Internship',
  work: 'Work',
  workshop: 'Workshop',
  certification: 'Certification',
  achievement: 'Achievement',
}

export default function Experience() {
  const data = useOutletContext()
  const items = data?.experience || []
  const [active, setActive] = useState('all')

  const presentKinds = useMemo(() => new Set(items.map((i) => i.kind)), [items])
  const filtered = active === 'all' ? items : items.filter((i) => i.kind === active)

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Journey" title="Experience & Certifications" description="Internships, workshops, certifications, and milestones along the way." />

      <div className="mb-10 flex flex-wrap gap-2">
        {KINDS.filter(([k]) => k === 'all' || presentKinds.has(k)).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === k ? 'bg-cherry text-cream' : 'bg-charcoal/5 text-ink/70 hover:bg-charcoal/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink/60">Nothing here yet.</p>
      ) : (
        <ol className="relative space-y-8 border-l-2 border-burnt/40 pl-8">
          {filtered.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-cream bg-cherry" />
              <div className="card p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-burnt/15 px-2.5 py-0.5 text-[11px] font-semibold text-burnt-dark">
                    {KIND_LABEL[item.kind] || item.kind}
                  </span>
                  {(item.start_date || item.end_date) && (
                    <span className="text-xs font-medium text-charcoal/50">
                      {item.start_date} {item.end_date ? `— ${item.end_date}` : ''}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-serif text-xl font-semibold text-charcoal">{item.title}</h3>
                {item.organization && <p className="text-sm font-medium text-cherry">{item.organization}</p>}
                {item.description && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/75">{item.description}</p>}
                {item.link_url && (
                  <a href={item.link_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-cherry hover:underline">
                    View certificate / link →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
