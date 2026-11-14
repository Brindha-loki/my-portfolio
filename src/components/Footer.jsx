import { Link } from 'react-router-dom'
import { setting } from '../lib/useSiteData'

export default function Footer({ settings, profile, social }) {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 bg-charcoal text-cream/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold text-cream">
            {setting(settings, 'site_name', profile?.full_name || '')}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            {profile?.tagline || ''}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-burnt">Connect</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(social || []).map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-burnt transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
            {profile?.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-burnt transition-colors">
                  {profile.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-burnt">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[['/about', 'About'], ['/skills', 'Skills'], ['/projects', 'Projects'], ['/experience', 'Experience'], ['/education', 'Education'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-burnt transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {year} {profile?.full_name || setting(settings, 'site_name', '')}. All rights reserved.</p>
          <p>{setting(settings, 'footer_text', '')}</p>
        </div>
      </div>
    </footer>
  )
}
