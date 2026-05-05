import apiClient from '../../../services/apiClient';

/**
 * Delivery Service - Handles all delivery-related API calls
 */

const deliveryService = {
  // Get assigned orders for delivery partner
  getAssignedOrders: async () => {
    try {
      const response = await apiClient.get('/api/delivery/assigned-orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/delivery/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status to picked-up
  updateOrderPickedUp: async (orderId) => {
    try {
      const response = await apiClient.put(`/api/delivery/orders/${orderId}/picked-up`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status to delivered
  updateOrderDelivered: async (orderId, otp) => {
    try {
      const response = await apiClient.put(`/api/delivery/orders/${orderId}/delivered`, { otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order tracking details
  getOrderTracking: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/delivery/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default deliveryService;
