import { useState, useEffect } from 'react'
import { Card } from '../../../components/common/Card'
import deliveryService from '../services/deliveryService'
import { orderStatusColors } from '../utils/deliveryUtils'
import '../styles/assigned-orders.css'

export function AssignedOrders() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAssignedOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, selectedStatus, searchQuery])

  const loadAssignedOrders = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const data = await deliveryService.getAssignedOrders()
      // setOrders(data)
      
      // Mock data for now
      const mockOrders = [
        {
          id: 'ORD-1001',
          patientName: 'Ananya Sharma',
          address: '123 MG Road, Bangalore',
          phoneNumber: '+91 99999 00001',
          medicines: ['Aspirin 100mg', 'Vitamin D'],
          status: 'pending',
          priority: 'high',
          estimatedDelivery: '2:30 PM',
          orderDate: '2024-01-15',
        },
        {
          id: 'ORD-1002',
          patientName: 'Rahul Sharma',
          address: '456 Indiranagar, Bangalore',
          phoneNumber: '+91 99999 00002',
          medicines: ['Cough Syrup', 'Paracetamol 500mg'],
          status: 'picked_up',
          priority: 'normal',
          estimatedDelivery: '3:15 PM',
          orderDate: '2024-01-15',
        },
        {
          id: 'ORD-1003',
          patientName: 'Nisha Patel',
          address: '789 Koramangala, Bangalore',
          phoneNumber: '+91 99999 00003',
          medicines: ['Antibiotic Cream', 'Bandages'],
          status: 'pending',
          priority: 'normal',
          estimatedDelivery: '4:00 PM',
          orderDate: '2024-01-15',
        },
        {
          id: 'ORD-1004',
          patientName: 'Arjun Kumar',
          address: '321 Whitefield, Bangalore',
          phoneNumber: '+91 99999 00004',
          medicines: ['Insulin Injection', 'Blood Sugar Monitor'],
          status: 'in_transit',
          priority: 'high',
          estimatedDelivery: '1:45 PM',
          orderDate: '2024-01-15',
        },
      ]
      setOrders(mockOrders)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.patientName.toLowerCase().includes(query) ||
          order.address.toLowerCase().includes(query) ||
          order.phoneNumber.includes(query)
      )
    }

    setFilteredOrders(filtered)
  }

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: 'Pending',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      failed: 'Failed',
    }
    return labelMap[status] || 'Unknown'
  }

  const getStatusColor = (status) => {
    return orderStatusColors[status] || '#6b7280'
  }

  const getPriorityClass = (priority) => {
    const classMap = {
      high: 'priority-high',
      normal: 'priority-normal',
      low: 'priority-low',
    }
    return classMap[priority] || 'priority-normal'
  }

  const handlePickOrder = async (orderId) => {
    // TODO: Implement pick up logic
    console.log('Pick up order:', orderId)
  }

  const handleViewDetails = (orderId) => {
    // TODO: Navigate to order details page
    console.log('View details for order:', orderId)
  }

  return (
    <div className="assigned-orders-container">
      <div className="orders-header">
        <h2 className="orders-title">Assigned Orders</h2>
        <p className="orders-subtitle">
          {filteredOrders.length} order(s) available
        </p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by Order ID, Patient, or Address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {loading && <div className="loading-state">Loading orders...</div>}
        {error && <div className="error-state">Error: {error}</div>}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="empty-state">No orders found</div>
        )}

        {!loading &&
          !error &&
          filteredOrders.map((order) => (
            <Card key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-title-section">
                  <h3 className="order-id">{order.id}</h3>
                  <span
                    className="priority-badge"
                    style={{
                      backgroundColor:
                        order.priority === 'high' ? '#fee2e2' : '#f3f4f6',
                      color: order.priority === 'high' ? '#dc2626' : '#6b7280',
                    }}
                  >
                    {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                  </span>
                </div>
                <span
                  className="status-badge-large"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-body">
                <div className="order-info-section">
                  <div className="info-item">
                    <label className="info-label">Patient</label>
                    <p className="info-value">{order.patientName}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Address</label>
                    <p className="info-value">{order.address}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Phone</label>
                    <p className="info-value">{order.phoneNumber}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Est. Delivery</label>
                    <p className="info-value">{order.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="medicines-section">
                  <label className="medicines-label">Medicines:</label>
                  <ul className="medicines-list">
                    {order.medicines.map((medicine, idx) => (
                      <li key={idx} className="medicine-item">
                        {medicine}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="order-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </button>
                {order.status === 'pending' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePickOrder(order.id)}
                  >
                    Pick Up Order
                  </button>
                )}
                {order.status === 'picked_up' && (
                  <button className="btn btn-success">Start Delivery</button>
                )}
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
