import { Card } from '../../components/common/Card'
import { StatCard } from '../../components/common/StatCard'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'

const stats = [
  { label: 'Assigned Deliveries', value: '08', trend: '3 scheduled this afternoon' },
  { label: 'Picked Up', value: '05', trend: '2 awaiting OTP handoff' },
  { label: 'Completed', value: '14', trend: 'All on-time deliveries' },
]

const assignments = [
  { order: 'ORD-1001', patient: 'Ananya Patient', area: 'MG Road' },
  { order: 'ORD-1002', patient: 'Rahul Sharma', area: 'Indiranagar' },
  { order: 'ORD-1003', patient: 'Nisha Patel', area: 'Koramangala' },
]

export function DeliveryDashboardPage() {
  return (
    <div className="dashboard-page">
      <PageHero
        badge="Delivery Dashboard"
        title="A focused last-mile view for pickup, route progress, and secure handoff"
        description="Prepared for delivery assignment lists, pickup confirmation, and proof-of-delivery states."
        primaryAction="Open Assignment"
        secondaryAction="Mark Picked Up"
      />

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="content-grid-2">
        <SectionBlock
          description="The assignment list can later be filtered by status and route."
          title="Active assignments"
        >
          <div className="list-stack">
            {assignments.map((assignment) => (
              <Card key={assignment.order}>
                <div className="queue-row">
                  <div>
                    <h4>{assignment.order}</h4>
                    <p>{assignment.patient}</p>
                  </div>
                  <span className="queue-badge">{assignment.area}</span>
                </div>
              </Card>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          description="Reserved for OTP, signature, or completion notes."
          title="Secure handoff"
        >
          <Card title="Completion proof">
            <div className="summary-list">
              <p>OTP verification placeholder</p>
              <p>Digital signature capture placeholder</p>
              <p>Delivery confirmation notes placeholder</p>
            </div>
          </Card>
        </SectionBlock>
      </div>
    </div>
  )
}
