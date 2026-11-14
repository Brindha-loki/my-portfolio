import { useEffect, useState, useCallback } from 'react'
import { insforge } from '../../lib/insforge'
import { useAdmin } from '../AdminContext'

export default function Messages() {
  const { isAdmin } = useAdmin()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await insforge.database
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setRows(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { if (isAdmin) load() }, [isAdmin, load])

  async function toggleRead(row) {
    await insforge.database.from('contact_submissions').update({ read: !row.read }).eq('id', row.id)
    load()
  }

  async function remove(row) {
    if (!window.confirm('Delete this message?')) return
    await insforge.database.from('contact_submissions').delete().eq('id', row.id)
    load()
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Messages</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Contact form submissions. Only visible to admins.</p>

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-ink/50">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className={`card p-5 ${r.read ? 'opacity-70' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-charcoal">{r.name} <span className="font-normal text-ink/50">&lt;{r.email}&gt;</span></p>
                  <p className="text-xs text-ink/50">{new Date(r.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toggleRead(r)} className="text-sm font-semibold text-cherry hover:underline">
                    {r.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button onClick={() => remove(r)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/80">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
