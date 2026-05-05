import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { StatCard } from '../../components/common/StatCard'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { adminService } from '../../services/adminService'
import { formatCurrency } from '../../utils'

function formatStatusLabel(status) {
  return status.replaceAll('_', ' ')
}

export function PharmacistDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [orders, setOrders] = useState([])
  const [deliveryAgents, setDeliveryAgents] = useState([])
  const [assignmentDrafts, setAssignmentDrafts] = useState({})
  const [pageState, setPageState] = useState({
    error: '',
    loading: true,
    success: '',
    busyOrderId: null,
  })

  async function loadDashboard() {
    try {
      const [dashboardData, ordersData, deliveryAgentsData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getOrders(),
        adminService.getDeliveryAgents(),
      ])

      setDashboard(dashboardData)
      setOrders(ordersData)
      setDeliveryAgents(deliveryAgentsData)
      setAssignmentDrafts(
        Object.fromEntries(
          ordersData.map((order) => [
            order.id,
            order.deliveryAgentId ?? deliveryAgentsData[0]?.id ?? '',
          ]),
        ),
      )
      setPageState((current) => ({
        ...current,
        error: '',
        loading: false,
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Unable to load pharmacist dashboard.',
        loading: false,
      }))
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) => !['DELIVERED', 'CANCELLED'].includes(order.status),
      ),
    [orders],
  )

  async function handleAssignDelivery(orderId) {
    const deliveryAgentId = Number(assignmentDrafts[orderId])

    if (!deliveryAgentId) {
      setPageState((current) => ({
        ...current,
        error: 'Select a delivery agent before assigning the order.',
        success: '',
      }))
      return
    }

    try {
      setPageState((current) => ({
        ...current,
        error: '',
        success: '',
        busyOrderId: orderId,
      }))

      await adminService.assignDeliveryAgent(orderId, { deliveryAgentId })
      await loadDashboard()

      setPageState((current) => ({
        ...current,
        success: 'Delivery agent assigned successfully.',
        busyOrderId: null,
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Unable to assign delivery agent.',
        success: '',
        busyOrderId: null,
      }))
    }
  }

  const stats = dashboard
    ? [
        {
          label: 'Pending Verifications',
          value: String(dashboard.pendingPrescriptions),
          trend: 'Prescription queue waiting for review',
        },
        {
          label: 'Active Orders',
          value: String(dashboard.activeOrders),
          trend: 'Orders moving through processing and dispatch',
        },
        {
          label: 'Low Stock Alerts',
          value: String(dashboard.lowStockMedicines),
          trend: 'Medicines nearing restock threshold',
        },
      ]
    : []

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Pharmacist Dashboard"
        title="Review incoming work, clear prescription queues, and dispatch faster"
        description="This live dashboard pulls current orders, prescription queues, and delivery staff so pharmacists can keep the flow moving."
        primaryAction="Live Operations"
        secondaryAction="Pharmacist View"
      />

      {pageState.loading ? <PageState message="Loading pharmacist workflow..." /> : null}
      {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}
      {pageState.success ? <PageState message={pageState.success} tone="success" /> : null}

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="content-grid-2">
        <SectionBlock
          description="Incoming orders are grouped here so the store team can assign deliveries without hunting through separate views."
          title="Incoming orders"
        >
          <div className="list-stack">
            {activeOrders.slice(0, 6).map((order) => (
              <Card
                description={`${order.fulfillmentType} · ${formatCurrency(order.totalAmount)}`}
                eyebrow={formatStatusLabel(order.status)}
                key={order.id}
                title={`${order.orderNumber} · ${order.patientName}`}
              >
                <div className="summary-list">
                  <p>Items: {order.itemCount}</p>
                  <p>Address: {order.deliveryAddress || 'Store pickup'}</p>
                  <p>Assigned: {order.deliveryAgentName || 'Not assigned yet'}</p>
                </div>

                <div className="form-grid-2 pharmacist-actions">
                  <label className="field">
                    <span>Delivery Agent</span>
                    <select
                      onChange={(event) =>
                        setAssignmentDrafts((current) => ({
                          ...current,
                          [order.id]: event.target.value,
                        }))
                      }
                      value={assignmentDrafts[order.id] ?? ''}
                    >
                      <option value="">Select agent</option>
                      {deliveryAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="pharmacist-actions__button">
                    <Button
                      disabled={pageState.busyOrderId === order.id}
                      onClick={() => handleAssignDelivery(order.id)}
                    >
                      {pageState.busyOrderId === order.id ? 'Assigning...' : 'Assign Delivery'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {!activeOrders.length && !pageState.loading ? (
              <PageState message="No active orders are waiting right now." />
            ) : null}
          </div>
        </SectionBlock>

        <SectionBlock
          description="Recent prescriptions help pharmacists see what is landing in the verification queue today."
          title="Recent prescriptions"
        >
          <div className="list-stack">
            {dashboard?.recentPrescriptions?.map((prescription) => (
              <Card
                description={`${prescription.doctorName} · ${prescription.issuedDate}`}
                eyebrow={formatStatusLabel(prescription.status)}
                key={prescription.id}
                title={prescription.patientName}
              >
                <div className="summary-list">
                  <p>Prescription #: {prescription.prescriptionNumber}</p>
                  <p>Doctor License: {prescription.doctorLicenseNumber}</p>
                  <p>
                    Reviewed By:{' '}
                    {prescription.verifiedByName || 'Pending pharmacist action'}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  )
}
