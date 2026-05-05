import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PUBLIC_ROUTES, ROUTES } from '../../routes/routeConfig'

const features = [
  {
    title: 'Patient-friendly ordering',
    description:
      'Prescription upload, medicine discovery, refills, and order tracking in one place.',
  },
  {
    title: 'Verification-first operations',
    description:
      'Pharmacists review prescriptions, manage stock, and move orders forward with clarity.',
  },
  {
    title: 'Delivery-ready handoff',
    description:
      'Delivery agents receive clean assignment views with status checkpoints and secure completion steps.',
  },
]

const workflow = [
  'Upload prescription or browse OTC medicines',
  'Review cart, checkout, and track status',
  'Pharmacist validates, bills, and dispatches',
  'Delivery agent updates pickup and completion',
]

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-topbar fade-in">
        <div className="landing-topbar__brand">
          <span className="landing-topbar__mark">Rx</span>
          <div>
            <p className="landing-topbar__eyebrow">Digital Pharmacy Platform</p>
            <p className="landing-topbar__title">Pharmacy Order & Prescription Management</p>
          </div>
        </div>
        <nav className="landing-topbar__nav">
          <Link to={PUBLIC_ROUTES.auth}>Login / Register</Link>
          <Link to={ROUTES.patientDashboard}>Patient Dashboard</Link>
        </nav>
      </header>

      <section className="landing-hero fade-in fade-in--delay-1">
        <div className="landing-hero__copy">
          <p className="landing-hero__badge">Safe, modern, workflow-first</p>
          <h1 className="landing-hero__title">
            A clean frontend foundation for digital prescriptions, pharmacy operations, and delivery coordination.
          </h1>
          <p className="landing-hero__description">
            This placeholder UI gives your team a production-style React structure with route-ready pages, reusable components,
            and a dashboard system that is easy to extend feature by feature.
          </p>
          <div className="landing-hero__actions">
            <Link className="button button--primary" to={PUBLIC_ROUTES.auth}>
              Enter The System
            </Link>
            <Link className="button button--secondary" to={ROUTES.pharmacistDashboard}>
              View Admin Workspace
            </Link>
          </div>
        </div>

        <div className="landing-hero__stack">
          <Card
            className="landing-hero__card landing-hero__card--teal"
            eyebrow="Patient"
            title="Upload, browse, reorder"
            description="Designed for fast prescription intake and easy medicine discovery."
          />
          <Card
            className="landing-hero__card"
            eyebrow="Pharmacist"
            title="Verify, fulfill, dispatch"
            description="Structured for verification queues, inventory snapshots, and order processing."
          />
          <Card
            className="landing-hero__card landing-hero__card--amber"
            eyebrow="Delivery"
            title="Assign, track, complete"
            description="Prepared for last-mile delivery status updates and secure handoff checkpoints."
          />
        </div>
      </section>

      <section className="landing-grid fade-in fade-in--delay-2">
        <Card
          className="landing-grid__wide"
          eyebrow="Feature Set"
          title="Pages already mapped for the team"
          description="Each role has a clear UI surface so people can work in parallel with fewer merge conflicts."
        >
          <div className="landing-feature-grid">
            {features.map((feature) => (
              <div className="landing-feature" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          eyebrow="Workflow"
          title="Happy-path scaffold"
          description="The core screens align with the hackathon demo journey."
        >
          <div className="landing-workflow">
            {workflow.map((step, index) => (
              <div className="landing-workflow__item" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
