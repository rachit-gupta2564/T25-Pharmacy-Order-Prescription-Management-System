import { apiClient } from './apiClient'

export const patientService = {
  async getPrescriptions() {
    const { data } = await apiClient.get('/patient/prescriptions')
    return data
  },

  async uploadPrescription(formData) {
    const { data } = await apiClient.post('/patient/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  async checkout(payload) {
    const { data } = await apiClient.post('/patient/orders/checkout', payload)
    return data
  },

  async getOrders() {
    const { data } = await apiClient.get('/patient/orders')
    return data
  },
}
