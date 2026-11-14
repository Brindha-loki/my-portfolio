import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insforge } from '../lib/insforge'
import { useAdmin } from './AdminContext'

export default function AdminLogin() {
  const { refresh } = useAdmin()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'setup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await insforge.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await insforge.auth.signUp({ email, password, name: name || undefined })
        if (error) throw error
        setNotice('Account created. If this is the first admin account, access will be granted after setup. Try signing in.')
        setMode('login')
        setBusy(false)
        return
      }
      await refresh()
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
      <div className="card w-full max-w-md p-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-charcoal">
          {mode === 'login' ? 'Sign in' : 'Create admin account'}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {mode === 'login'
            ? 'Restricted area. Authorized administrators only.'
            : 'First-time setup. The account must be granted admin access before it can manage the site.'}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === 'setup' && (
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'login' ? 'setup' : 'login'); setError(''); setNotice('') }}
          className="mt-5 w-full text-center text-sm font-medium text-cherry hover:underline"
        >
          {mode === 'login' ? 'First time? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
