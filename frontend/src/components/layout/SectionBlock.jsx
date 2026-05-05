export function SectionBlock({ title, description, children, className = '' }) {
  return (
    <section className={`section-block ${className}`.trim()}>
      <div className="section-block__header">
        <h3 className="section-block__title">{title}</h3>
        <p className="section-block__description">{description}</p>
      </div>
      {children}
    </section>
  )
}
