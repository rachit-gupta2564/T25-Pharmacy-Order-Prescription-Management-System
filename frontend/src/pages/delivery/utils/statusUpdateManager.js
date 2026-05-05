/**
 * Status Update Service - Handles order status updates via API
 */
import deliveryService from '../services/deliveryService'

export const orderStatusManager = {
  /**
   * Update order status to picked up
   */
  updateToPickedUp: async (orderId) => {
    try {
      const response = await deliveryService.updateOrderPickedUp(orderId)
      return {
        success: true,
        data: response,
        message: 'Order marked as picked up',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update order status',
      }
    }
  },

  /**
   * Update order status to delivered
   */
  updateToDelivered: async (orderId, otp) => {
    try {
      const response = await deliveryService.updateOrderDelivered(orderId, otp)
      return {
        success: true,
        data: response,
        message: 'Order marked as delivered',
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to mark order as delivered',
      }
    }
  },

  /**
   * Get real-time order status
   */
  getOrderStatus: async (orderId) => {
    try {
      const response = await deliveryService.getOrderTracking(orderId)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch order status',
      }
    }
  },

  /**
   * Batch update statuses for multiple orders
   */
  updateMultipleOrders: async (updates) => {
    const results = []
    
    for (const update of updates) {
      try {
        let response
        if (update.action === 'pickup') {
          response = await deliveryService.updateOrderPickedUp(update.orderId)
        } else if (update.action === 'deliver') {
          response = await deliveryService.updateOrderDelivered(update.orderId, update.otp)
        }
        
        results.push({
          orderId: update.orderId,
          success: true,
          data: response,
        })
      } catch (error) {
        results.push({
          orderId: update.orderId,
          success: false,
          error: error.message,
        })
      }
    }
    
    return results
  },
}
