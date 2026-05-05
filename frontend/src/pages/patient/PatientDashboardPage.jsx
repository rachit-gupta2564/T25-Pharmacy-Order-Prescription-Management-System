import { useEffect, useState } from 'react'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { StatCard } from '../../components/common/StatCard'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { patientService } from '../../services/patientService'

const DEFAULT_REMINDERS = [
  { id: 'blood-pressure', title: 'Blood pressure tablets', due: 'Next refill in 3 days', enabled: true },
  { id: 'calcium', title: 'Calcium supplement', due: 'Next refill in 7 days', enabled: false },
  { id: 'allergy', title: 'Allergy support pack', due: 'Next refill in 12 days', enabled: true },
]

export function PatientDashboardPage() {
  const [orders, setOrders] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [pageState, setPageState] = useState({ error: '', loading: true })
  const [reminders, setReminders] = useState(() => {
    const saved = window.localStorage.getItem('pharmacy-refill-reminders')
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS
  })

  useEffect(() => {
    window.localStorage.setItem('pharmacy-refill-reminders', JSON.stringify(reminders))
  }, [reminders])

  useEffect(() => {
    async function loadPatientOverview() {
      try {
        const [orderData, prescriptionData] = await Promise.all([
          patientService.getOrders(),
          patientService.getPrescriptions(),
        ])
        setOrders(orderData)
        setPrescriptions(prescriptionData)
        setPageState({ error: '', loading: false })
      } catch (error) {
        setPageState({
          error: error.response?.data?.message ?? 'Unable to load your dashboard right now.',
          loading: false,
        })
      }
    }

    loadPatientOverview()
  }, [])

  const stats = [
    {
      label: 'Uploaded Prescriptions',
      value: String(prescriptions.length).padStart(2, '0'),
      trend: `${prescriptions.filter((item) => item.status === 'PENDING').length} pending verification`,
    },
    {
      label: 'Tracked Orders',
      value: String(orders.length).padStart(2, '0'),
      trend: `${orders.filter((item) => item.status === 'OUT_FOR_DELIVERY').length} out for delivery`,
    },
    {
      label: 'Refill Reminders',
      value: String(reminders.filter((item) => item.enabled).length).padStart(2, '0'),
      trend: 'Basic local reminder controls enabled',
    },
  ]

  function toggleReminder(reminderId) {
    setReminders((currentReminders) =>
      currentReminders.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder,
      ),
    )
  }

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Patient Dashboard"
        title="Medication management made calm, clear, and trackable"
        description="Your dashboard now reads live backend data for prescriptions and orders, while keeping refill reminders lightweight and easy to manage."
        primaryAction="Review Orders"
        secondaryAction="Manage Refills"
      />

      {pageState.loading ? <PageState message="Loading dashboard..." /> : null}
      {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="content-grid-2">
        <SectionBlock
          description="Recent prescription submissions from your backend account."
          title="Prescription status"
        >
          <div className="list-stack">
            {prescriptions.slice(0, 3).map((prescription) => (
              <Card
                description={`${prescription.doctorName} · ${prescription.prescriptionNumber}`}
                eyebrow={prescription.status}
                key={prescription.id}
                title="Uploaded prescription"
              />
            ))}
            {!prescriptions.length ? (
              <PageState message="No prescriptions uploaded yet." />
            ) : null}
          </div>
        </SectionBlock>

        <SectionBlock
          description="Basic reminder controls stored locally in the browser."
          title="Refill reminders"
        >
          <div className="list-stack">
            {reminders.map((reminder) => (
              <Card key={reminder.id}>
                <div className="reminder-row">
                  <div>
                    <h4>{reminder.title}</h4>
                    <p>{reminder.due}</p>
                  </div>
                  <button
                    className={`toggle-chip${reminder.enabled ? ' toggle-chip--active' : ''}`}
                    onClick={() => toggleReminder(reminder.id)}
                    type="button"
                  >
                    {reminder.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  )
}
