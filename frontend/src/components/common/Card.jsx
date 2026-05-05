export function Card({
  children,
  className = '',
  eyebrow,
  title,
  description,
}) {
  return (
    <article className={`card ${className}`.trim()}>
      {(eyebrow || title || description) && (
        <header className="card__header">
          {eyebrow ? <p className="card__eyebrow">{eyebrow}</p> : null}
          {title ? <h3 className="card__title">{title}</h3> : null}
          {description ? <p className="card__description">{description}</p> : null}
        </header>
      )}
      {children}
    </article>
  )
}
