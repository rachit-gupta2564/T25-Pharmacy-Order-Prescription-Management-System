const CART_STORAGE_KEY = 'pharmacy-patient-cart'

export function getStoredCart() {
  const raw = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function setStoredCart(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}
