import { useState } from 'react'
import '../styles/delivery-confirmation.css'

export function DeliveryConfirmation({ orderId, orderDetails, onConfirm, onCancel }) {
  const [deliveryStatus, setDeliveryStatus] = useState('pending') // pending, capturing, success
  const [signature, setSignature] = useState(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirmDelivery = async () => {
    if (!signature && !notes) {
      setError('Please provide either a signature or delivery notes')
      return
    }

    try {
      setIsConfirming(true)
      // TODO: Call API to update order status to delivered
      // await deliveryService.updateOrderDelivered(orderId, otp)
      
      // Simulate API call
      setTimeout(() => {
        onConfirm({
          orderId,
          deliveredAt: new Date(),
          signature,
          notes,
          deliveryProof: 'photo-proof-001',
        })
        setIsConfirming(false)
      }, 500)
    } catch (err) {
      setError('Failed to confirm delivery. Please try again.')
      setIsConfirming(false)
    }
  }

  return (
    <div className="delivery-modal">
      <div className="delivery-content">
        <div className="delivery-header">
          <h2 className="delivery-title">Confirm Delivery</h2>
          <p className="delivery-subtitle">{orderId}</p>
        </div>

        <div className="delivery-body">
          {/* Patient Info */}
          <div className="delivery-info-card">
            <h3 className="card-title">Delivery To</h3>
            <div className="patient-info">
              <p className="patient-name">{orderDetails?.patientName}</p>
              <p className="patient-address">{orderDetails?.address}</p>
              <p className="patient-phone">{orderDetails?.patientPhone}</p>
            </div>
          </div>

          {/* Delivery Checklist */}
          <div className="delivery-checklist">
            <h3 className="section-title">Pre-Delivery Checklist</h3>
            <div className="checklist-items">
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <span className="check-text">Patient verified phone number</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <span className="check-text">Medicines handed over to patient</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <span className="check-text">Patient acknowledged receipt</span>
              </div>
              <div className="checklist-item">
                <span className="check-icon">✓</span>
                <span className="check-text">Delivery proof captured</span>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <h3 className="section-title">Signature / Delivery Proof</h3>
            <div className="signature-area">
              {signature ? (
                <div className="signature-preview">
                  <p className="signature-label">Signature captured</p>
                  <button
                    className="btn-clear-signature"
                    onClick={() => setSignature(null)}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="signature-placeholder">
                  <p className="placeholder-text">
                    Signature or digital mark will appear here
                  </p>
                  <p className="placeholder-hint">
                    (In a real app, this would be a canvas/drawing area)
                  </p>
                </div>
              )}
            </div>
            <button
              className="btn-capture-signature"
              onClick={() => setSignature('signature-data')}
            >
              📷 Capture Signature
            </button>
          </div>

          {/* Delivery Notes */}
          <div className="notes-section">
            <label className="notes-label">Delivery Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any delivery notes or patient feedback..."
              className="notes-input"
              rows="3"
            />
          </div>

          {/* Delivery Details */}
          <div className="delivery-details">
            <h3 className="section-title">Delivery Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label className="detail-label">Delivery Time</label>
                <p className="detail-value">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Delivery Date</label>
                <p className="detail-value">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Delivery Partner ID</label>
                <p className="detail-value">DP-001</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Status</label>
                <p className="detail-value status-ready">Ready to Deliver</p>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Action Buttons */}
        <div className="delivery-footer">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={isConfirming}
          >
            Cancel Delivery
          </button>
          <button
            className="btn btn-confirm"
            onClick={handleConfirmDelivery}
            disabled={isConfirming}
          >
            {isConfirming ? 'Confirming...' : 'Mark as Delivered'}
          </button>
        </div>
      </div>
    </div>
  )
}
