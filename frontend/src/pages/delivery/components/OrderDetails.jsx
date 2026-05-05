import { useState } from 'react'
import { Card } from '../../../components/common/Card'
import '../styles/order-details.css'

export function OrderDetails({ orderId, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - will be replaced with API call
  const orderData = {
    id: 'ORD-1001',
    status: 'picked_up',
    patientName: 'Ananya Sharma',
    patientPhone: '+91 99999 00001',
    patientEmail: 'ananya@example.com',
    prescriptionId: 'RX-2024-00001',
    orderDate: '2024-01-15 10:30 AM',
    pickedUpTime: '2024-01-15 01:15 PM',
    estimatedDelivery: '2024-01-15 2:30 PM',
    deliveryAddress: '123 MG Road, Apt 401, Bangalore, Karnataka 560001',
    deliveryLandmark: 'Near Coffee Day',
    deliveryNotes: 'Patient prefers morning delivery. Ring bell twice.',
    medicines: [
      {
        id: 1,
        name: 'Aspirin',
        strength: '100mg',
        quantity: '10 tablets',
        price: 45,
        dosage: 'Once daily after food',
      },
      {
        id: 2,
        name: 'Vitamin D3',
        strength: '1000 IU',
        quantity: '30 softgels',
        price: 120,
        dosage: 'Once daily with breakfast',
      },
    ],
    totalAmount: 165,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    timeline: [
      {
        status: 'Order Placed',
        time: '2024-01-15 10:30 AM',
        completed: true,
      },
      {
        status: 'Prescription Verified',
        time: '2024-01-15 11:00 AM',
        completed: true,
      },
      {
        status: 'Order Packed',
        time: '2024-01-15 12:30 PM',
        completed: true,
      },
      {
        status: 'Picked Up',
        time: '2024-01-15 01:15 PM',
        completed: true,
      },
      {
        status: 'In Transit',
        time: 'Expected soon',
        completed: false,
      },
      {
        status: 'Delivered',
        time: 'Pending',
        completed: false,
      },
    ],
  }

  return (
    <div className="order-details-modal">
      <div className="order-details-content">
        <div className="details-header">
          <div className="details-title-section">
            <h2 className="details-title">{orderData.id}</h2>
            <span className="details-status picked-up">
              {orderData.status === 'picked_up' ? 'Picked Up' : 'Pending'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="details-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'medicines' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicines')}
          >
            Medicines
          </button>
          <button
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
        </div>

        {/* Tab Content */}
        <div className="details-body">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              {/* Patient Information */}
              <Card className="info-card">
                <h3 className="card-title">Patient Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label className="info-label">Patient Name</label>
                    <p className="info-value">{orderData.patientName}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Phone</label>
                    <p className="info-value">{orderData.patientPhone}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Email</label>
                    <p className="info-value">{orderData.patientEmail}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Prescription ID</label>
                    <p className="info-value">{orderData.prescriptionId}</p>
                  </div>
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="info-card">
                <h3 className="card-title">Delivery Address</h3>
                <div className="info-section">
                  <p className="address-main">{orderData.deliveryAddress}</p>
                  <p className="address-landmark">
                    📍 Landmark: {orderData.deliveryLandmark}
                  </p>
                  {orderData.deliveryNotes && (
                    <p className="delivery-notes">
                      <strong>Delivery Notes:</strong> {orderData.deliveryNotes}
                    </p>
                  )}
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="info-card">
                <h3 className="card-title">Order Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <label className="summary-label">Order Date</label>
                    <p className="summary-value">{orderData.orderDate}</p>
                  </div>
                  <div className="summary-item">
                    <label className="summary-label">Picked Up</label>
                    <p className="summary-value">{orderData.pickedUpTime}</p>
                  </div>
                  <div className="summary-item">
                    <label className="summary-label">Est. Delivery</label>
                    <p className="summary-value">{orderData.estimatedDelivery}</p>
                  </div>
                  <div className="summary-item">
                    <label className="summary-label">Payment Status</label>
                    <p className="summary-value paid">{orderData.paymentStatus}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Medicines Tab */}
          {activeTab === 'medicines' && (
            <div className="tab-content">
              <Card className="medicines-card">
                <h3 className="card-title">Medicines in Order</h3>
                <div className="medicines-table">
                  <div className="medicines-header">
                    <div className="medicine-col-name">Medicine</div>
                    <div className="medicine-col-details">Details</div>
                    <div className="medicine-col-quantity">Quantity</div>
                    <div className="medicine-col-price">Price</div>
                  </div>
                  {orderData.medicines.map((medicine) => (
                    <div key={medicine.id} className="medicines-row">
                      <div className="medicine-col-name">
                        <p className="medicine-name">{medicine.name}</p>
                        <p className="medicine-strength">{medicine.strength}</p>
                      </div>
                      <div className="medicine-col-details">
                        <p className="medicine-dosage">{medicine.dosage}</p>
                      </div>
                      <div className="medicine-col-quantity">
                        <p className="medicine-qty">{medicine.quantity}</p>
                      </div>
                      <div className="medicine-col-price">
                        <p className="medicine-price">₹{medicine.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="medicines-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">₹{orderData.totalAmount}</span>
                </div>
              </Card>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="tab-content">
              <div className="timeline">
                {orderData.timeline.map((event, index) => (
                  <div
                    key={index}
                    className={`timeline-item ${event.completed ? 'completed' : ''}`}
                  >
                    <div className="timeline-marker">
                      {event.completed ? '✓' : '○'}
                    </div>
                    <div className="timeline-content">
                      <h4 className="timeline-status">{event.status}</h4>
                      <p className="timeline-time">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="details-footer">
          <button className="action-btn secondary">Cancel Delivery</button>
          <button className="action-btn primary">Start Delivery</button>
        </div>
      </div>
    </div>
  )
}
