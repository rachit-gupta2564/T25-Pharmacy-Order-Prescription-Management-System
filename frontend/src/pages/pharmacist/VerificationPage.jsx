import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { adminService } from '../../services/adminService'

function formatStatusLabel(status) {
  return status.replaceAll('_', ' ')
}

export function VerificationPage() {
  const [prescriptions, setPrescriptions] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [decisionForm, setDecisionForm] = useState({ reason: '', notes: '' })
  const [pageState, setPageState] = useState({
    error: '',
    loading: true,
    success: '',
    busy: false,
  })

  async function loadPrescriptions(nextSelectedId = null) {
    try {
      const data = await adminService.getPrescriptions()
      const preferredId =
        nextSelectedId ??
        data.find((item) => item.status === 'PENDING')?.id ??
        data[0]?.id ??
        null

      setPrescriptions(data)
      setSelectedId(preferredId)
      setPageState((current) => ({
        ...current,
        error: '',
        loading: false,
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Unable to load prescriptions.',
        loading: false,
      }))
    }
  }

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const selectedPrescription = useMemo(
    () => prescriptions.find((item) => item.id === selectedId) ?? null,
    [prescriptions, selectedId],
  )

  useEffect(() => {
    setDecisionForm({
      reason: selectedPrescription?.rejectionReason ?? '',
      notes: selectedPrescription?.notes ?? '',
    })
  }, [selectedPrescription])

  async function handleDecision(action) {
    if (!selectedPrescription) {
      return
    }

    if (action === 'reject' && !decisionForm.reason.trim()) {
      setPageState((current) => ({
        ...current,
        error: 'Rejection reason is required.',
        success: '',
      }))
      return
    }

    try {
      setPageState((current) => ({
        ...current,
        busy: true,
        error: '',
        success: '',
      }))

      if (action === 'approve') {
        await adminService.approvePrescription(selectedPrescription.id, {
          reason: '',
          notes: decisionForm.notes,
        })
      } else {
        await adminService.rejectPrescription(selectedPrescription.id, {
          reason: decisionForm.reason,
          notes: decisionForm.notes,
        })
      }

      await loadPrescriptions(selectedPrescription.id)
      setPageState((current) => ({
        ...current,
        busy: false,
        success:
          action === 'approve'
            ? 'Prescription approved successfully.'
            : 'Prescription rejected with reason.',
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        busy: false,
        error: error.response?.data?.message ?? 'Unable to update prescription status.',
        success: '',
      }))
    }
  }

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Verification Queue"
        title="Review patient prescriptions with a fast decision workspace"
        description="Pharmacists can move through pending uploads quickly with visible patient details, doctor details, notes, and rejection reasons."
        primaryAction="Approve Queue"
        secondaryAction="Review Notes"
      />

      {pageState.loading ? <PageState message="Loading prescriptions..." /> : null}
      {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}
      {pageState.success ? <PageState message={pageState.success} tone="success" /> : null}

      <div className="content-grid-2">
        <SectionBlock
          description="Pending items stay visible on the left so pharmacists can switch records quickly."
          title="Verification queue"
        >
          <div className="list-stack">
            {prescriptions.map((item) => (
              <Card
                className={selectedId === item.id ? 'card--selected' : ''}
                description={`${item.doctorName} · ${item.issuedDate}`}
                eyebrow={formatStatusLabel(item.status)}
                key={item.id}
                title={item.patientName}
              >
                <div className="summary-list">
                  <p>Prescription #: {item.prescriptionNumber}</p>
                  <p>Doctor License: {item.doctorLicenseNumber}</p>
                </div>
                <Button
                  className="button--full"
                  onClick={() => setSelectedId(item.id)}
                  variant={selectedId === item.id ? 'primary' : 'secondary'}
                >
                  Open Review
                </Button>
              </Card>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          description="This review workspace focuses on approval and rejection decisions without extra clutter."
          title="Review workspace"
        >
          {!selectedPrescription ? (
            <PageState message="Select a prescription to review." />
          ) : (
            <Card
              description={`Uploaded on ${selectedPrescription.createdAt}`}
              eyebrow={formatStatusLabel(selectedPrescription.status)}
              title={`${selectedPrescription.patientName} · ${selectedPrescription.prescriptionNumber}`}
            >
              <div className="summary-list">
                <p>Doctor: {selectedPrescription.doctorName}</p>
                <p>Doctor License: {selectedPrescription.doctorLicenseNumber}</p>
                <p>Issued Date: {selectedPrescription.issuedDate}</p>
                <p>Expiry Date: {selectedPrescription.expiryDate}</p>
                <p>
                  File Reference:{' '}
                  {selectedPrescription.fileUrl || 'Uploaded file path unavailable'}
                </p>
              </div>

              <div className="form-grid-2">
                <label className="field">
                  <span>Review Notes</span>
                  <textarea
                    onChange={(event) =>
                      setDecisionForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    placeholder="Add pharmacist notes"
                    rows="4"
                    value={decisionForm.notes}
                  />
                </label>
                <label className="field">
                  <span>Rejection Reason</span>
                  <textarea
                    onChange={(event) =>
                      setDecisionForm((current) => ({
                        ...current,
                        reason: event.target.value,
                      }))
                    }
                    placeholder="Required only when rejecting"
                    rows="4"
                    value={decisionForm.reason}
                  />
                </label>
              </div>

              <div className="pharmacist-decision-row">
                <Button disabled={pageState.busy} onClick={() => handleDecision('approve')}>
                  {pageState.busy ? 'Saving...' : 'Approve Prescription'}
                </Button>
                <Button
                  disabled={pageState.busy}
                  onClick={() => handleDecision('reject')}
                  variant="secondary"
                >
                  {pageState.busy ? 'Saving...' : 'Reject With Reason'}
                </Button>
              </div>
            </Card>
          )}
        </SectionBlock>
      </div>
    </div>
  )
}
