export const AUTH_STORAGE_KEY = 'pharmacy-auth-session'

export function getStoredAuthSession() {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return { token: '', user: null }
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      token: parsed.token ?? '',
      user: parsed.user ?? null,
    }
  } catch {
    return { token: '', user: null }
  }
}

export function setStoredAuthSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
