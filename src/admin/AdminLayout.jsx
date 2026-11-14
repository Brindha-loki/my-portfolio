import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdmin } from './AdminContext'

const NAV = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'Profile & Resume' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/experience', label: 'Experience & Certs' },
  { to: '/admin/social', label: 'Social Links' },
  { to: '/admin/media', label: 'Media Library' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Website Settings' },
]

export default function AdminLayout() {
  const { user, isAdmin, loading, logout } = useAdmin()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cherry border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    navigate('/admin/login', { replace: true })
    return null
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="card max-w-md p-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-charcoal">Access denied</h1>
          <p className="mt-2 text-sm text-ink/60">
            This account ({user.email || 'unknown'}) is not an authorized administrator.
          </p>
          <button onClick={logout} className="btn-primary mt-6">Sign out</button>
        </div>
      </div>
    )
  }

  async function onLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 shrink-0 flex-col border-r border-charcoal/10 bg-white">
        <div className="border-b border-charcoal/10 px-5 py-5">
          <p className="font-serif text-lg font-semibold text-charcoal">Portfolio Admin</p>
          <p className="truncate text-xs text-ink/50">{user.email}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `mb-1 block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-cherry/10 text-cherry' : 'text-ink/70 hover:bg-charcoal/5 hover:text-charcoal'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-charcoal/10 p-3">
          <a href="/" target="_blank" rel="noreferrer" className="mb-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-charcoal/5">
            View site ↗
          </a>
          <button onClick={onLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
