import { useEffect, useState, useCallback } from 'react'
import { insforge, uploadFile, fileUrl } from '../../lib/insforge'

const emptyFor = (fields) =>
  Object.fromEntries(
    fields.map((f) => [
      f.name,
      f.type === 'checkbox' ? true : f.type === 'tags' ? [] : f.type === 'number' ? 0 : '',
    ])
  )

export default function CrudEditor({ table, title, description, fields, columns, orderBy = 'sort_order' }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | {} new | row
  const [form, setForm] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await insforge.database
      .from(table)
      .select('*')
      .order(orderBy, { ascending: true })
    if (error) setError(error.message)
    else setRows(data || [])
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => {
    load()
  }, [load])

  function openNew() {
    setForm(emptyFor(fields))
    setEditing('new')
    setError('')
  }

  function openEdit(row) {
    setForm({ ...row })
    setEditing(row)
  }

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function onImageUpload(fieldName, file) {
    const keyField = fieldName.replace('_url', '_key')
    setUploading(fieldName)
    setError('')
    try {
      const safe = `${table}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
      const { url, key } = await uploadFile(file, safe)
      setForm((f) => ({ ...f, [fieldName]: url, [keyField]: key }))
    } catch (e) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading('')
    }
  }

  async function save() {
    setBusy(true)
    setError('')
    const payload = { ...form }
    for (const f of fields) {
      if (f.type === 'tags') {
        payload[f.name] = Array.isArray(payload[f.name])
          ? payload[f.name]
          : String(payload[f.name] || '').split(',').map((s) => s.trim()).filter(Boolean)
      }
      if (f.type === 'number') payload[f.name] = payload[f.name] === '' ? 0 : Number(payload[f.name])
    }
    // strip display-only keys
    for (const f of fields) {
      if (f.readonly) delete payload[f.name]
    }

    const isNew = editing === 'new'
    const { error } = isNew
      ? await insforge.database.from(table).insert([payload])
      : await insforge.database.from(table).update(payload).eq('id', editing.id)
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setEditing(null)
    load()
  }

  async function remove(row) {
    if (!window.confirm(`Delete "${row.title || row.name || row.degree || row.label || 'this item'}"?`)) return
    const { error } = await insforge.database.from(table).delete().eq('id', row.id)
    if (error) setError(error.message)
    else load()
  }

  function colValue(row, col) {
    if (typeof col === 'object') return col.render(row)
    const v = row[col]
    if (Array.isArray(v)) return v.join(', ')
    if (typeof v === 'boolean') return v ? 'Yes' : 'No'
    return v ?? '—'
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
        </div>
        <button onClick={openNew} className="btn-primary shrink-0">+ Add New</button>
      </div>

      {error && !editing && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-ink/50">
          <p>No entries yet.</p>
          <button onClick={openNew} className="btn-primary mt-4">Add your first entry</button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-charcoal/50">
                {columns.map((c) => (
                  <th key={typeof c === 'object' ? c.key : c} className="px-4 py-3 font-semibold">
                    {typeof c === 'object' ? c.label : c.replace(/_/g, ' ')}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/60">
                  {columns.map((c) => {
                    const key = typeof c === 'object' ? c.key : c
                    return <td key={key} className="px-4 py-3 text-ink/80">{colValue(row, key)}</td>
                  })}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(row)} className="text-sm font-semibold text-cherry hover:underline">Edit</button>
                      <button onClick={() => remove(row)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4" onClick={() => setEditing(null)}>
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-semibold text-charcoal">
              {editing === 'new' ? `New ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.type === 'textarea' || f.type === 'tags' || f.type === 'image' ? 'sm:col-span-2' : ''}>
                  {f.type === 'textarea' ? (
                    <>
                      <label className="label">{f.label || f.name}</label>
                      <textarea rows={4} className="admin-input resize-y" value={form[f.name] || ''}
                        onChange={(e) => setField(f.name, e.target.value)} />
                    </>
                  ) : f.type === 'tags' ? (
                    <>
                      <label className="label">{f.label || f.name} (comma-separated)</label>
                      <input className="admin-input" value={Array.isArray(form[f.name]) ? form[f.name].join(', ') : form[f.name] || ''}
                        onChange={(e) => setField(f.name, e.target.value)} />
                    </>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 pt-6 text-sm font-medium text-ink/80">
                      <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setField(f.name, e.target.checked)}
                        className="h-4 w-4 accent-cherry" />
                      {f.label || f.name}
                    </label>
                  ) : f.type === 'select' ? (
                    <>
                      <label className="label">{f.label || f.name}</label>
                      <select className="admin-input" value={form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)}>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </>
                  ) : f.type === 'image' ? (
                    <>
                      <label className="label">{f.label || f.name}</label>
                      <div className="flex items-center gap-4">
                        {form[f.name] && (
                          <img src={fileUrl(form[f.name])} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        )}
                        <input type="file" accept="image/*" disabled={uploading === f.name}
                          onChange={(e) => e.target.files[0] && onImageUpload(f.name, e.target.files[0])}
                          className="text-sm text-ink/60 file:mr-3 file:rounded-lg file:border-0 file:bg-cherry file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream" />
                        {uploading === f.name && <span className="text-xs text-ink/50">Uploading…</span>}
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="label">{f.label || f.name}</label>
                      <input type={f.type === 'number' ? 'number' : 'text'} className="admin-input"
                        value={form[f.name] ?? ''} min={f.min} max={f.max}
                        onChange={(e) => setField(f.name, f.type === 'number' ? e.target.value : e.target.value)} />
                    </>
                  )}
                </div>
              ))}
            </div>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
              <button onClick={save} disabled={busy || !!uploading} className="btn-primary disabled:opacity-60">
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
