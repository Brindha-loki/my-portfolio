import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { insforge } from '../../lib/insforge'
import { useAdmin } from '../AdminContext'

const CARDS = [
  { to: '/admin/profile', title: 'Profile & Resume', desc: 'Name, bio, photo, resume PDF, SEO' },
  { to: '/admin/skills', title: 'Skills', desc: 'Languages, tools, proficiency' },
  { to: '/admin/projects', title: 'Projects', desc: 'Showcase, screenshots, links' },
  { to: '/admin/education', title: 'Education', desc: 'Degrees and coursework' },
  { to: '/admin/experience', title: 'Experience', desc: 'Internships, certs, achievements' },
  { to: '/admin/social', title: 'Social Links', desc: 'LinkedIn, GitHub, etc.' },
  { to: '/admin/settings', title: 'Website Settings', desc: 'Nav labels, sections, footer' },
  { to: '/admin/media', title: 'Media Library', desc: 'Uploaded images and files' },
  { to: '/admin/messages', title: 'Messages', desc: 'Contact form submissions' },
]

export default function Dashboard() {
  const { user } = useAdmin()
  const [counts, setCounts] = useState({})

  useEffect(() => {
    const tables = ['projects', 'skills', 'education', 'experience', 'contact_submissions']
    Promise.all(
      tables.map((t) =>
        insforge.database.from(t).select('*', { count: 'exact', head: true })
          .then(({ count }) => [t, count || 0])
      )
    ).then((entries) => setCounts(Object.fromEntries(entries)))
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-1 mb-8 text-sm text-ink/60">
        Welcome back{user?.email ? `, ${user.email}` : ''}. Manage your portfolio content below.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="card group p-6 transition-shadow hover:shadow-md">
            <h2 className="font-serif text-lg font-semibold text-charcoal group-hover:text-cherry">{c.title}</h2>
            <p className="mt-1 text-sm text-ink/60">{c.desc}</p>
            {counts[c.to.split('/').pop()] !== undefined && (
              <p className="mt-3 text-xs font-semibold text-burnt-dark">
                {counts[c.to.split('/').pop()]} entries
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="card mt-8 border-l-4 border-l-burnt p-6">
        <h2 className="font-semibold text-charcoal">Quick tip</h2>
        <p className="mt-1 text-sm text-ink/70">
          Mark projects as <strong>Featured</strong> in Projects to display them on the home page.
          Toggle section visibility in Website Settings to hide parts of the site without deleting content.
        </p>
      </div>
    </div>
  )
}
