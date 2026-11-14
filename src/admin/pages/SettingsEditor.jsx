import { useEffect, useState } from 'react'
import { insforge } from '../../lib/insforge'

const NAV_LABELS = [
  ['nav_home', 'Home'],
  ['nav_about', 'About'],
  ['nav_skills', 'Skills'],
  ['nav_projects', 'Projects'],
  ['nav_experience', 'Experience'],
  ['nav_education', 'Education'],
  ['nav_contact', 'Contact'],
]

const SECTIONS = [
  ['section_home', 'Home page sections'],
  ['section_about', 'About section'],
  ['section_skills', 'Skills section'],
  ['section_projects', 'Projects section'],
  ['section_experience', 'Experience section'],
  ['section_education', 'Education section'],
  ['section_contact', 'Contact section'],
]

export default function SettingsEditor() {
  const [settings, setSettings] = useState({})
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    insforge.database.from('settings').select('*').then(({ data }) => {
      const map = {}
      for (const r of data || []) map[r.key] = r.value
      setSettings(map)
    })
  }, [])

  function set(key, value) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  async function save() {
    setBusy(true)
    setMsg('')
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value: String(value ?? '') }))
    // upsert each
    let failed = null
    for (const row of rows) {
      const { error } = await insforge.database.from('settings').upsert([row], { onConflict: 'key' })
      if (error) { failed = error.message; break }
    }
    setBusy(false)
    setMsg(failed || 'Settings saved.')
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Website Settings</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Navigation labels, section visibility, footer, and SEO.</p>

      <div className="card max-w-3xl space-y-8 p-8">
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal/60">Site identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Site name</label>
              <input className="admin-input" value={settings.site_name || ''} onChange={(e) => set('site_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Footer text</label>
              <input className="admin-input" value={settings.footer_text || ''} onChange={(e) => set('footer_text', e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal/60">Navigation labels</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {NAV_LABELS.map(([key, label]) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input className="admin-input" value={settings[key] || ''} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal/60">Section visibility</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SECTIONS.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                <input type="checkbox" checked={settings[key] !== 'false'}
                  onChange={(e) => set(key, e.target.checked ? 'true' : 'false')}
                  className="h-4 w-4 accent-cherry" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {msg && <p className={`rounded-lg px-4 py-3 text-sm ${msg.includes('saved') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg}</p>}

        <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
