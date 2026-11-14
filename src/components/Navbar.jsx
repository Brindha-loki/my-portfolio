import { NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setting } from '../lib/useSiteData'

const LINKS = [
  { to: '/', labelKey: 'nav_home', end: true },
  { to: '/about', labelKey: 'nav_about' },
  { to: '/skills', labelKey: 'nav_skills' },
  { to: '/projects', labelKey: 'nav_projects' },
  { to: '/experience', labelKey: 'nav_experience' },
  { to: '/education', labelKey: 'nav_education' },
  { to: '/contact', labelKey: 'nav_contact' },
]

export default function Navbar({ settings, profile }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? 'border-charcoal/10 bg-cream/90 backdrop-blur' : 'border-transparent bg-cream'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight text-charcoal">
          {setting(settings, 'site_name', profile?.full_name || 'Portfolio')}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-cherry' : 'text-charcoal/70 hover:text-cherry'
                }`
              }
            >
              {setting(settings, l.labelKey, l.labelKey.replace('nav_', ''))}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 text-charcoal md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-charcoal/10 bg-cream px-5 py-4 md:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-cherry/10 text-cherry' : 'text-charcoal/80'
                }`
              }
            >
              {setting(settings, l.labelKey, l.labelKey.replace('nav_', ''))}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
