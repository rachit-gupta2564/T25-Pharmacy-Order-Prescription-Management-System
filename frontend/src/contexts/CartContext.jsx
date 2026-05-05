import { createContext, useEffect, useState } from 'react'
import { getStoredCart, setStoredCart } from '../utils/cartStorage'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getStoredCart())

  useEffect(() => {
    setStoredCart(items)
  }, [items])

  function addItem(medicine) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === medicine.id)
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentItems,
        {
          id: medicine.id,
          brandName: medicine.brandName,
          genericName: medicine.genericName,
          price: medicine.price,
          prescriptionRequired: medicine.prescriptionRequired,
          quantity: 1,
        },
      ]
    })
  }

  function updateQuantity(medicineId, quantity) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === medicineId ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(medicineId) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== medicineId))
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        addItem,
        clearCart,
        itemCount,
        items,
        removeItem,
        subtotal,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
