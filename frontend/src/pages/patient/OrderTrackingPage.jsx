import { useEffect, useState } from 'react'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { patientService } from '../../services/patientService'
import { formatCurrency } from '../../utils'

const statusOrder = [
  'PENDING_VERIFICATION',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export function OrderTrackingPage() {
  const [orders, setOrders] = useState([])
  const [pageState, setPageState] = useState({ error: '', loading: true })

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await patientService.getOrders()
        setOrders(data)
        setPageState({ error: '', loading: false })
      } catch (error) {
        setPageState({
          error: error.response?.data?.message ?? 'Unable to load orders right now.',
          loading: false,
        })
      }
    }

    loadOrders()
  }, [])

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Order Tracking"
        title="Follow your prescription order from review to doorstep"
        description="Track backend order status, item counts, totals, and fulfillment progress from one screen."
        primaryAction={`Orders: ${orders.length}`}
        secondaryAction="Refresh Status"
      />

      {pageState.loading ? <PageState message="Loading order history..." /> : null}
      {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}

      <SectionBlock
        description="Recent backend orders connected to the authenticated patient."
        title="Tracked orders"
      >
        <div className="list-stack">
          {orders.map((order) => (
            <Card
              description={`${order.fulfillmentType} · ${formatCurrency(order.totalAmount)}`}
              eyebrow={order.status}
              key={order.id}
              title={order.orderNumber}
            >
              <div className="timeline-mini">
                {statusOrder.map((status) => (
                  <span
                    className={`timeline-mini__step${
                      status === order.status ? ' timeline-mini__step--active' : ''
                    }`}
                    key={status}
                  >
                    {status.replaceAll('_', ' ')}
                  </span>
                ))}
              </div>
              <p className="timeline-step__text">Items: {order.itemCount}</p>
            </Card>
          ))}
          {!orders.length && !pageState.loading ? (
            <PageState message="No orders available yet." />
          ) : null}
        </div>
      </SectionBlock>
    </div>
  )
}
