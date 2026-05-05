import { useState, useEffect } from 'react'
import { Card } from '../../components/common/Card'
import { StatCard } from '../../components/common/StatCard'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import deliveryService from './services/deliveryService'
import './styles/dashboard.css'

const mockStats = [

const stats = [
  { label: 'Assigned Deliveries', value: '08', trend: '3 scheduled this afternoon' },
  { label: 'Picked Up', value: '05', trend: '2 awaiting OTP handoff' },
  { label: 'Completed', value: '14', trend: 'All on-time deliveries' },
]

const mockAssignments = [
  { order: 'ORD-1001', patient: 'Ananya Patient', area: 'MG Road', status: 'pending' },
  { order: 'ORD-1002', patient: 'Rahul Sharma', area: 'Indiranagar', status: 'picked_up' },
  { order: 'ORD-1003', patient: 'Nisha Patel', area: 'Koramangala', status: 'pending' },
]

export function DeliveryDashboardPage() {
  const [stats, setStats] = useState(mockStats)
  const [assignments, setAssignments] = useState(mockAssignments)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch assigned orders from API
      const data = await deliveryService.getAssignedOrders()
      
      // Transform API data to match component structure
      if (data && Array.isArray(data)) {
        setAssignments(data)
      } else {
        setAssignments([])
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError(err.message || 'Failed to load delivery assignments')
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      picked_up: 'badge-picked-up',
      in_transit: 'badge-in-transit',
      delivered: 'badge-delivered',
      failed: 'badge-failed',
    }
    return statusMap[status] || 'badge-pending'
  }

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: 'Pending',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      failed: 'Failed',
    }
    return labelMap[status] || 'Unknown'
  }

  return (
    <DashboardLayout>
      <div className="delivery-dashboard">
        <PageHero
          badge="Delivery Dashboard"
          title="Last-mile delivery management"
          description="Track assignments, pickup confirmations, and secure handoffs"
        />

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="content-section">
          <div className="content-grid-2">
            {/* Assignments Section */}
            <SectionBlock
              description="View and manage your assigned deliveries"
              title="Active Assignments"
            >
              {loading && <p className="loading-text">Loading assignments...</p>}
              {error && <p className="error-text">Error: {error}</p>}
              {!loading && !error && (
                <div className="assignment-list">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <Card key={assignment.order} className="assignment-card">
                        <div className="assignment-content">
                          <div className="assignment-info">
                            <h4 className="order-id">{assignment.order}</h4>
                            <p className="patient-name">{assignment.patient}</p>
                            <p className="delivery-area">{assignment.area}</p>
                          </div>
                          <div className="assignment-status">
                            <span className={`status-badge ${getStatusBadgeClass(assignment.status)}`}>
                              {getStatusLabel(assignment.status)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="empty-state">No assignments available</p>
                  )}
                </div>
              )}
            </SectionBlock>

            {/* Quick Actions Section */}
            <SectionBlock
              description="Common delivery actions"
              title="Quick Actions"
            >
              <Card className="actions-card">
                <div className="actions-grid">
                  <button className="action-btn action-btn-primary">
                    <span>📍</span>
                    <span>Start Route</span>
                  </button>
                  <button className="action-btn action-btn-secondary">
                    <span>✓</span>
                    <span>Mark Picked Up</span>
                  </button>
                  <button className="action-btn action-btn-tertiary">
                    <span>🔐</span>
                    <span>Verify OTP</span>
                  </button>
                  <button className="action-btn action-btn-success">
                    <span>✓</span>
                    <span>Deliver Order</span>
                  </button>
                </div>
              </Card>
            </SectionBlock>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
