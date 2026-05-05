import { Button } from '../common/Button'

export function PageHero({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="page-hero fade-in">
      <div className="page-hero__content">
        <p className="page-hero__badge">{badge}</p>
        <h2 className="page-hero__title">{title}</h2>
        <p className="page-hero__description">{description}</p>
        <div className="page-hero__actions">
          <Button>{primaryAction}</Button>
          <Button variant="secondary">{secondaryAction}</Button>
        </div>
      </div>

      <div className="page-hero__panel">
        <div className="page-hero__highlight">
          <span className="page-hero__metric">11</span>
          <span className="page-hero__metric-label">Planned screens</span>
        </div>
        <div className="page-hero__list">
          <p>Patient uploads and ordering</p>
          <p>Pharmacist verification workflow</p>
          <p>Delivery handoff status tracking</p>
        </div>
      </div>
    </section>
  )
}
