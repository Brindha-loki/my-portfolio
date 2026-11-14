import { useEffect, useState } from 'react'
import { insforge, uploadFile, fileUrl } from '../../lib/insforge'

const FIELDS = [
  { name: 'full_name', label: 'Full name' },
  { name: 'title', label: 'Professional title' },
  { name: 'tagline', label: 'Short tagline / introduction' },
  { name: 'about', label: 'About / biography', textarea: true },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'location', label: 'Location' },
  { name: 'seo_title', label: 'SEO title' },
  { name: 'seo_description', label: 'SEO description', textarea: true },
]

export default function ProfileEditor() {
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState('')

  useEffect(() => {
    insforge.database.from('profile').select('*').eq('id', 1).maybeSingle()
      .then(({ data }) => setForm(data || {}))
  }, [])

  async function upload(fieldUrl, fieldKey, file, prefix) {
    setUploading(fieldUrl)
    setMsg('')
    try {
      const safe = `${prefix}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
      const { url, key } = await uploadFile(file, safe)
      setForm((f) => ({ ...f, [fieldUrl]: url, [fieldKey]: key }))
    } catch (e) {
      setMsg(e.message || 'Upload failed')
    } finally {
      setUploading('')
    }
  }

  async function save() {
    setBusy(true)
    setMsg('')
    const { error } = await insforge.database.from('profile').update(form).eq('id', 1)
    setBusy(false)
    setMsg(error ? error.message : 'Profile saved.')
  }

  if (!form) return <p className="text-ink/50">Loading…</p>

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Profile & Resume</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Personal information shown across the site. Upload a photo and resume PDF.</p>

      <div className="card max-w-3xl space-y-5 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name} className={f.textarea ? 'sm:col-span-2' : ''}>
              <label className="label">{f.label}</label>
              {f.textarea ? (
                <textarea rows={4} className="admin-input resize-y" value={form[f.name] || ''}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : (
                <input type={f.type || 'text'} className="admin-input" value={form[f.name] || ''}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Profile photo</label>
            <div className="flex items-center gap-4">
              {form.photo_url && <img src={fileUrl(form.photo_url)} alt="" className="h-16 w-16 rounded-xl object-cover" />}
              <input type="file" accept="image/*" disabled={uploading === 'photo_url'}
                onChange={(e) => e.target.files[0] && upload('photo_url', 'photo_key', e.target.files[0], 'profile')}
                className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cherry file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream" />
            </div>
          </div>
          <div>
            <label className="label">Resume (PDF)</label>
            <div className="flex items-center gap-4">
              {form.resume_url && (
                <a href={form.resume_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cherry hover:underline">
                  Current resume ↗
                </a>
              )}
              <input type="file" accept="application/pdf" disabled={uploading === 'resume_url'}
                onChange={(e) => e.target.files[0] && upload('resume_url', 'resume_key', e.target.files[0], 'resume')}
                className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cherry file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream" />
            </div>
            <p className="mt-2 text-xs text-ink/50">Download links update automatically after upload.</p>
          </div>
        </div>

        {uploading && <p className="text-sm text-ink/60">Uploading…</p>}
        {msg && <p className={`rounded-lg px-4 py-3 text-sm ${msg.includes('saved') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{msg}</p>}

        <button onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
