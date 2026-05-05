import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../utils/authStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const session = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (session) {
    const parsedSession = JSON.parse(session)
    if (parsedSession?.token) {
      config.headers.Authorization = parsedSession.token
    }
  }

  return config
})
