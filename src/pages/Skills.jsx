import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { SkillCard } from '../components/cards'

export default function Skills() {
  const data = useOutletContext()
  const skills = data?.skills || []
  const categories = useMemo(() => [...new Set(skills.map((s) => s.category))], [skills])
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active)

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Capabilities" title="Skills & Technologies" description="A snapshot of the tools and technologies I work with." />

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
        <p className="text-ink/60">No skills added yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => <SkillCard key={s.id} skill={s} />)}
        </div>
      )}
    </div>
  )
}
