import { useState } from 'react'
import '../styles/pickup-confirmation.css'

export function PickupConfirmation({ orderId, orderDetails, onConfirm, onCancel }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState(null)
  const [checkboxes, setCheckboxes] = useState({
    medicinesVerified: false,
    quantityVerified: false,
    conditionVerified: false,
  })

  const allCheckboxesChecked = Object.values(checkboxes).every((val) => val)

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setError(null)
  }

  const handlePickupConfirm = async () => {
    if (!allCheckboxesChecked) {
      setError('Please verify all items before confirming pickup')
      return
    }

    try {
      setIsConfirming(true)
      // TODO: Call API to update order status
      // await deliveryService.updateOrderPickedUp(orderId)
      
      // Simulate API call
      setTimeout(() => {
        onConfirm({
          orderId,
          pickedUpAt: new Date(),
          verifiedItems: checkboxes,
        })
        setIsConfirming(false)
      }, 500)
    } catch (err) {
      setError('Failed to confirm pickup. Please try again.')
      setIsConfirming(false)
    }
  }

  return (
    <div className="pickup-modal">
      <div className="pickup-content">
        <div className="pickup-header">
          <h2 className="pickup-title">Confirm Pickup</h2>
          <p className="pickup-subtitle">{orderId}</p>
        </div>

        <div className="pickup-body">
          {/* Order Details Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3 className="card-subtitle">Patient Details</h3>
              <div className="summary-row">
                <span className="label">Patient:</span>
                <span className="value">{orderDetails?.patientName || 'N/A'}</span>
              </div>
              <div className="summary-row">
                <span className="label">Phone:</span>
                <span className="value">{orderDetails?.patientPhone || 'N/A'}</span>
              </div>
            </div>

            <div className="summary-card">
              <h3 className="card-subtitle">Medicines Count</h3>
              <div className="medicine-count">
                {orderDetails?.medicines?.length || 0}
              </div>
              <p className="medicine-list-info">
                {orderDetails?.medicines?.map((m) => m.name).join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="verification-section">
            <h3 className="section-title">Verification Checklist</h3>
            <p className="section-description">
              Please verify all items before confirming pickup
            </p>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkboxes.medicinesVerified}
                  onChange={() => handleCheckboxChange('medicinesVerified')}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  <strong>Medicines Verified</strong>
                  <p className="checkbox-description">
                    All medicines match the prescription
                  </p>
                </span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkboxes.quantityVerified}
                  onChange={() => handleCheckboxChange('quantityVerified')}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  <strong>Quantity Verified</strong>
                  <p className="checkbox-description">
                    All quantities are correct
                  </p>
                </span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checkboxes.conditionVerified}
                  onChange={() => handleCheckboxChange('conditionVerified')}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  <strong>Condition Verified</strong>
                  <p className="checkbox-description">
                    All medicines are in good condition
                  </p>
                </span>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Pickup Details */}
          <div className="pickup-details">
            <h3 className="section-title">Pickup Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label className="detail-label">Pickup Time</label>
                <p className="detail-value">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Pickup Date</label>
                <p className="detail-value">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Delivery Partner</label>
                <p className="detail-value">Delivery Partner #001</p>
              </div>
              <div className="detail-item">
                <label className="detail-label">Vehicle</label>
                <p className="detail-value">TN 01 AB 1234</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pickup-footer">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            className={`btn btn-confirm ${allCheckboxesChecked ? 'enabled' : 'disabled'}`}
            onClick={handlePickupConfirm}
            disabled={!allCheckboxesChecked || isConfirming}
          >
            {isConfirming ? 'Confirming...' : 'Confirm Pickup'}
          </button>
        </div>
      </div>
    </div>
  )
}
