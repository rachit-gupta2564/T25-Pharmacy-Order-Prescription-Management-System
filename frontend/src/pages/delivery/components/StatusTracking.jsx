import { useState, useEffect } from 'react'
import '../styles/status-tracking.css'

export function StatusTracking({ orderId, initialStatus = 'pending' }) {
  const [status, setStatus] = useState(initialStatus)
  const [trackingHistory, setTrackingHistory] = useState([
    {
      status: 'pending',
      time: new Date(Date.now() - 3600000),
      description: 'Order placed',
      icon: '📦',
    },
    {
      status: 'confirmed',
      time: new Date(Date.now() - 3000000),
      description: 'Order confirmed by pharmacy',
      icon: '✓',
    },
    {
      status: 'picked_up',
      time: new Date(Date.now() - 600000),
      description: 'Picked up for delivery',
      icon: '🚚',
    },
  ])

  const statusConfig = {
    pending: {
      label: 'Pending',
      color: '#f59e0b',
      icon: '⏳',
      description: 'Waiting for pickup',
    },
    confirmed: {
      label: 'Confirmed',
      color: '#3b82f6',
      icon: '✓',
      description: 'Pharmacy confirmed',
    },
    picked_up: {
      label: 'Picked Up',
      color: '#8b5cf6',
      icon: '🚚',
      description: 'Out for delivery',
    },
    in_transit: {
      label: 'In Transit',
      color: '#06b6d4',
      icon: '📍',
      description: 'On the way to you',
    },
    delivered: {
      label: 'Delivered',
      color: '#10b981',
      icon: '✓',
      description: 'Successfully delivered',
    },
    failed: {
      label: 'Delivery Failed',
      color: '#ef4444',
      icon: '✕',
      description: 'Delivery could not be completed',
    },
  }

  const getStatusIndex = (statusName) => {
    const order = [
      'pending',
      'confirmed',
      'picked_up',
      'in_transit',
      'delivered',
    ]
    return order.indexOf(statusName)
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)

    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  const currentConfig = statusConfig[status]
  const currentIndex = getStatusIndex(status)

  return (
    <div className="status-tracking-container">
      {/* Current Status Card */}
      <div className="current-status-card">
        <div className="status-content">
          <div
            className="status-icon-large"
            style={{ backgroundColor: currentConfig.color }}
          >
            {currentConfig.icon}
          </div>
          <div className="status-info">
            <h3 className="status-label">{currentConfig.label}</h3>
            <p className="status-description">{currentConfig.description}</p>
            <p className="status-order-id">{orderId}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(currentIndex / 4) * 100}%`,
              backgroundColor: currentConfig.color,
            }}
          />
        </div>
        <div className="progress-labels">
          <span className="progress-start">Pending</span>
          <span className="progress-end">Delivered</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-section">
        <h3 className="timeline-title">Delivery Timeline</h3>
        <div className="timeline">
          {trackingHistory.map((event, index) => (
            <div
              key={index}
              className={`timeline-event ${
                getStatusIndex(event.status) <= currentIndex ? 'completed' : ''
              }`}
            >
              <div className="timeline-marker">
                <div
                  className="timeline-dot"
                  style={{
                    backgroundColor:
                      statusConfig[event.status].color,
                  }}
                >
                  {statusConfig[event.status].icon}
                </div>
              </div>
              <div className="timeline-content">
                <h4 className="timeline-event-title">
                  {statusConfig[event.status].label}
                </h4>
                <p className="timeline-event-description">
                  {event.description}
                </p>
                <p className="timeline-event-time">
                  {event.time.toLocaleString()}
                  <span className="time-ago"> • {formatTime(event.time)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Messages */}
      <div className="status-messages">
        {status === 'pending' && (
          <div className="message-box warning">
            <span className="message-icon">⏳</span>
            <p>Your order is being prepared at the pharmacy.</p>
          </div>
        )}
        {status === 'picked_up' && (
          <div className="message-box info">
            <span className="message-icon">📍</span>
            <p>Your delivery partner is on the way.</p>
          </div>
        )}
        {status === 'in_transit' && (
          <div className="message-box info">
            <span className="message-icon">🚚</span>
            <p>
              Estimated delivery time: <strong>2:30 PM - 3:00 PM</strong>
            </p>
          </div>
        )}
        {status === 'delivered' && (
          <div className="message-box success">
            <span className="message-icon">✓</span>
            <p>Order delivered successfully!</p>
          </div>
        )}
        {status === 'failed' && (
          <div className="message-box error">
            <span className="message-icon">✕</span>
            <p>Delivery could not be completed. Contact support for help.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn secondary">
          <span>📞</span>
          <span>Contact Support</span>
        </button>
        <button className="action-btn secondary">
          <span>❓</span>
          <span>Help</span>
        </button>
      </div>
    </div>
  )
}
