import { useEffect, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { patientService } from '../../services/patientService'

const initialForm = {
  prescriptionNumber: '',
  doctorName: '',
  doctorLicenseNumber: '',
  issuedDate: '',
  expiryDate: '',
  notes: '',
}

export function PrescriptionUploadPage() {
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [pageState, setPageState] = useState({
    error: '',
    loading: true,
    success: '',
    submitting: false,
  })

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const data = await patientService.getPrescriptions()
        setPrescriptions(data)
        setPageState((current) => ({ ...current, error: '', loading: false }))
      } catch (error) {
        setPageState((current) => ({
          ...current,
          error: error.response?.data?.message ?? 'Unable to load prescriptions.',
          loading: false,
        }))
      }
    }

    loadPrescriptions()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setPageState((current) => ({
      ...current,
      error: '',
      success: '',
      submitting: true,
    }))

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))
    if (file) {
      payload.append('file', file)
    }

    try {
      const createdPrescription = await patientService.uploadPrescription(payload)
      setPrescriptions((current) => [createdPrescription, ...current])
      setForm(initialForm)
      setFile(null)
      setPageState((current) => ({
        ...current,
        submitting: false,
        success: 'Prescription uploaded successfully and sent for verification.',
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        submitting: false,
        error: error.response?.data?.message ?? 'Unable to upload prescription.',
      }))
    }
  }

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Prescription Upload"
        title="Capture prescriptions with clarity before verification begins"
        description="Upload a real prescription file, send it to the backend, and keep track of recent submissions."
        primaryAction="Upload File"
        secondaryAction="Review Uploads"
      />

      <div className="content-grid-2">
        <SectionBlock
          description="Provide doctor details, issue dates, and the prescription file."
          title="Upload prescription"
        >
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Prescription Number</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    prescriptionNumber: event.target.value,
                  }))
                }
                placeholder="RX-2026-001"
                type="text"
                value={form.prescriptionNumber}
              />
            </label>
            <label className="field">
              <span>Doctor Name</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({ ...current, doctorName: event.target.value }))
                }
                placeholder="Dr. Name"
                type="text"
                value={form.doctorName}
              />
            </label>
            <label className="field">
              <span>Doctor License Number</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    doctorLicenseNumber: event.target.value,
                  }))
                }
                placeholder="License number"
                type="text"
                value={form.doctorLicenseNumber}
              />
            </label>
            <div className="form-grid-2">
              <label className="field">
                <span>Issued Date</span>
                <input
                  onChange={(event) =>
                    setForm((current) => ({ ...current, issuedDate: event.target.value }))
                  }
                  type="date"
                  value={form.issuedDate}
                />
              </label>
              <label className="field">
                <span>Expiry Date</span>
                <input
                  onChange={(event) =>
                    setForm((current) => ({ ...current, expiryDate: event.target.value }))
                  }
                  type="date"
                  value={form.expiryDate}
                />
              </label>
            </div>
            <label className="field">
              <span>Notes</span>
              <textarea
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                placeholder="Optional notes for the pharmacist"
                rows="4"
                value={form.notes}
              />
            </label>
            <label className="field">
              <span>Prescription File</span>
              <input
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </label>
            {file ? <PageState message={`Selected file: ${file.name}`} /> : null}
            {pageState.success ? <PageState message={pageState.success} tone="success" /> : null}
            {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}
            <Button type="submit">
              {pageState.submitting ? 'Uploading...' : 'Upload Prescription'}
            </Button>
          </form>
        </SectionBlock>

        <SectionBlock
          description="Recent submissions connected to the backend account."
          title="Recent uploads"
        >
          {pageState.loading ? <PageState message="Loading recent uploads..." /> : null}
          <div className="list-stack">
            {prescriptions.slice(0, 4).map((prescription) => (
              <Card
                description={`${prescription.doctorName} · ${prescription.fileUrl}`}
                eyebrow={prescription.status}
                key={prescription.id}
                title={prescription.prescriptionNumber}
              />
            ))}
            {!prescriptions.length && !pageState.loading ? (
              <PageState message="No prescriptions uploaded yet." />
            ) : null}
          </div>
        </SectionBlock>
      </div>
    </div>
  )
}
