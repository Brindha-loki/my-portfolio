export default function SectionHeading({ eyebrow, title, description, dark = false }) {
  return (
    <div className="mb-12 max-w-2xl">
      {eyebrow && <p className={`eyebrow mb-3 ${dark ? '!text-burnt' : ''}`}>{eyebrow}</p>}
      <h2 className={`font-serif text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? 'text-cream' : 'text-charcoal'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 leading-relaxed ${dark ? 'text-cream/70' : 'text-ink/70'}`}>{description}</p>
      )}
    </div>
  )
}
