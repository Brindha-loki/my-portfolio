import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-serif text-7xl font-semibold text-cherry">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  )
}
