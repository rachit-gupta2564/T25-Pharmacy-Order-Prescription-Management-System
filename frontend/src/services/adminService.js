import { apiClient } from './apiClient'

export const adminService = {
  async getDashboard() {
    const { data } = await apiClient.get('/admin/dashboard')
    return data
  },

  async getPrescriptions() {
    const { data } = await apiClient.get('/prescriptions')
    return data
  },

  async approvePrescription(id, payload) {
    const { data } = await apiClient.post(`/admin/prescriptions/${id}/approve`, payload)
    return data
  },

  async rejectPrescription(id, payload) {
    const { data } = await apiClient.post(`/admin/prescriptions/${id}/reject`, payload)
    return data
  },

  async getOrders() {
    const { data } = await apiClient.get('/orders')
    return data
  },

  async getDeliveryAgents() {
    const { data } = await apiClient.get('/admin/delivery-agents')
    return data
  },

  async assignDeliveryAgent(id, payload) {
    const { data } = await apiClient.post(`/admin/orders/${id}/assign-delivery`, payload)
    return data
  },

  async updateMedicine(id, payload) {
    const { data } = await apiClient.put(`/medicines/${id}`, payload)
    return data
  },
}
