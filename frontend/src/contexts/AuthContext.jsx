import { createContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { clearAuthSession, getStoredAuthSession, setStoredAuthSession } from '../utils/authStorage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuthSession())
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    async function hydrateUser() {
      if (!authState.token) {
        setIsAuthReady(true)
        return
      }

      try {
        const user = await authService.getCurrentUser()
        const nextState = { token: authState.token, user }
        setAuthState(nextState)
        setStoredAuthSession(nextState)
      } catch {
        clearAuthSession()
        setAuthState({ token: '', user: null })
      } finally {
        setIsAuthReady(true)
      }
    }

    hydrateUser()
  }, [])

  async function login(payload) {
    const response = await authService.login(payload)
    setAuthState(response)
    setStoredAuthSession(response)
    return response
  }

  async function register(payload) {
    const response = await authService.register(payload)
    setAuthState(response)
    setStoredAuthSession(response)
    return response
  }

  function logout() {
    clearAuthSession()
    setAuthState({ token: '', user: null })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(authState.token && authState.user),
        isAuthReady,
        login,
        logout,
        register,
        token: authState.token,
        user: authState.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
