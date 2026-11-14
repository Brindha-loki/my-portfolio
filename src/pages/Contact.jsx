import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { insforge } from '../lib/insforge'

export default function Contact() {
  const data = useOutletContext()
  const { profile, social_links = [] } = data || {}
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await insforge.database.from('contact_submissions').insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }])
    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    }
  }

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="Get in Touch" title="Contact" description="Have a question or opportunity? Send me a message." />

      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {profile?.email && (
            <div className="card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50">Email</p>
              <a href={`mailto:${profile.email}`} className="mt-1 block font-medium text-cherry hover:underline">{profile.email}</a>
            </div>
          )}
          {social_links.map((s) => (
            <div key={s.id} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/50">{s.label}</p>
              <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 block font-medium text-cherry hover:underline">
                {s.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          ))}
          {profile?.resume_url && (
            <a href={profile.resume_url} download className="btn-outline w-full">Download Resume</a>
          )}
        </div>

        <form onSubmit={onSubmit} className="card space-y-5 p-8">
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input id="name" required maxLength={200} className="input" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" required maxLength={320} className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="label">Message</label>
            <textarea id="message" required maxLength={5000} rows={6} className="input resize-none" value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or opportunity…" />
          </div>

          {status === 'success' && (
            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Thanks! Your message has been sent.
            </p>
          )}
          {status === 'error' && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Something went wrong. Please try again or email me directly.
            </p>
          )}

          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
