import { useEffect, useState, useCallback } from 'react'
import { insforge, BUCKET, uploadFile, deleteFile } from '../../lib/insforge'

export default function MediaLibrary() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await insforge.storage.from(BUCKET).list()
    if (error) setMsg(error.message)
    else setFiles((data || []).sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0)))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function onUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setMsg('')
    try {
      const folder = file.webkitRelativePath ? file.webkitRelativePath.split('/').slice(0, -1).join('/') + '/' : ''
      const safe = `${folder}${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
      const { error } = await uploadFile(file, safe)
      if (error) throw error
      await load()
    } catch (err) {
      setMsg(err.message || 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  async function onDelete(f) {
    if (!window.confirm(`Delete ${f.name}?`)) return
    try {
      await deleteFile(f.name)
      await load()
    } catch (err) {
      setMsg(err.message || 'Delete failed')
    }
  }

  function publicUrl(f) {
    const { data } = insforge.storage.from(BUCKET).getPublicUrl(f.name)
    return data?.publicUrl || data?.url || ''
  }

  async function copyUrl(f) {
    await navigator.clipboard.writeText(publicUrl(f))
    setMsg('URL copied to clipboard.')
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">Media Library</h1>
          <p className="mt-1 text-sm text-ink/60">All uploaded images and files. Copy URLs to use anywhere.</p>
        </div>
        <label className={`btn-primary cursor-pointer ${busy ? 'opacity-60' : ''}`}>
          {busy ? 'Uploading…' : 'Upload File'}
          <input type="file" className="hidden" onChange={onUpload} disabled={busy} />
        </label>
      </div>

      {msg && <p className="mb-4 rounded-lg bg-cream px-4 py-3 text-sm text-ink/70">{msg}</p>}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : files.length === 0 ? (
        <div className="card p-10 text-center text-ink/50">No files uploaded yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((f) => {
            const isImage = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f.name)
            return (
              <div key={f.name} className="card overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-charcoal/5">
                  {isImage ? (
                    <img src={publicUrl(f)} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-xs font-semibold uppercase text-ink/40">{f.name.split('.').pop()}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-medium text-ink/70" title={f.name}>{f.name}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => copyUrl(f)} className="text-xs font-semibold text-cherry hover:underline">Copy URL</button>
                    <a href={publicUrl(f)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-ink/60 hover:underline">Open</a>
                    <button onClick={() => onDelete(f)} className="ml-auto text-xs font-semibold text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
