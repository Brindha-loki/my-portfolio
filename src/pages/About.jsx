import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { fileUrl } from '../lib/insforge'

export default function About() {
  const data = useOutletContext()
  const { profile, education = [], experience = [] } = data || {}
  const photo = fileUrl(profile?.photo_url)

  const goals = experience.filter((e) => e.kind === 'achievement')

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="About" title="About Me" />

      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          {photo ? (
            <img src={photo} alt={profile?.full_name} className="aspect-[4/5] w-full max-w-sm rounded-3xl object-cover shadow-lg" />
          ) : (
            <div className="flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-3xl bg-cherry/10">
              <span className="font-serif text-7xl font-semibold text-cherry/30">
                {(profile?.full_name || 'Y').split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
          <div className="mt-6 space-y-2 text-sm text-ink/70">
            {profile?.location && <p><span className="font-semibold text-charcoal">Location:</span> {profile.location}</p>}
            {profile?.email && <p><span className="font-semibold text-charcoal">Email:</span> {profile.email}</p>}
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">My story</h3>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/80">{profile?.about || 'No biography added yet.'}</p>
          </div>

          {education.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl font-semibold text-charcoal">Education</h3>
              <ul className="mt-4 space-y-4">
                {education.map((e) => (
                  <li key={e.id} className="border-l-2 border-burnt pl-5">
                    <p className="font-semibold text-charcoal">{e.degree}{e.field ? ` — ${e.field}` : ''}</p>
                    <p className="text-sm text-ink/70">{e.institution}</p>
                    {(e.start_date || e.end_date) && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-charcoal/50">
                        {e.start_date} {e.end_date ? `— ${e.end_date}` : ''}
                      </p>
                    )}
                    {e.coursework?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {e.coursework.map((c) => (
                          <span key={c} className="rounded bg-charcoal/5 px-2 py-0.5 text-[11px] text-ink/70">{c}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {goals.length > 0 && (
            <div>
              <h3 className="font-serif text-2xl font-semibold text-charcoal">Goals &amp; achievements</h3>
              <ul className="mt-4 space-y-3">
                {goals.map((g) => (
                  <li key={g.id} className="flex gap-3 text-ink/80">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-burnt" />
                    <div>
                      <p className="font-medium text-charcoal">{g.title}</p>
                      {g.description && <p className="text-sm">{g.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile?.resume_url && (
            <a href={profile.resume_url} download className="btn-primary">
              Download Resume
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
