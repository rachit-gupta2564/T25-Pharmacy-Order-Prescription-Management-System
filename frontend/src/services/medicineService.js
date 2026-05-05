import { apiClient } from './apiClient'

export const medicineService = {
  async getMedicines() {
    const { data } = await apiClient.get('/medicines')
    return data
  },
}
