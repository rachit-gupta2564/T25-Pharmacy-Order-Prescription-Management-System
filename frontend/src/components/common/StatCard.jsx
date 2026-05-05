import { Card } from './Card'

export function StatCard({ label, value, trend }) {
  return (
    <Card className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__trend">{trend}</p>
    </Card>
  )
}
