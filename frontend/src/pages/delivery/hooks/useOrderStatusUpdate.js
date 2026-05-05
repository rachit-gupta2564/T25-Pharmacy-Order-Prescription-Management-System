import { useState, useCallback } from 'react'
import { orderStatusManager } from '../utils/statusUpdateManager'

/**
 * Custom hook for managing order status updates
 * Handles loading, error, and success states
 */
export function useOrderStatusUpdate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const updateToPickedUp = useCallback(async (orderId) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await orderStatusManager.updateToPickedUp(orderId)

      if (result.success) {
        setSuccess(true)
        return result
      } else {
        setError(result.message || 'Failed to update status')
        return result
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateToDelivered = useCallback(async (orderId, otp) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await orderStatusManager.updateToDelivered(orderId, otp)

      if (result.success) {
        setSuccess(true)
        return result
      } else {
        setError(result.message || 'Failed to update status')
        return result
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const getOrderStatus = useCallback(async (orderId) => {
    try {
      setLoading(true)
      setError(null)

      const result = await orderStatusManager.getOrderStatus(orderId)

      if (!result.success) {
        setError(result.message || 'Failed to fetch status')
      }

      return result
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMultipleOrders = useCallback(async (updates) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const results = await orderStatusManager.updateMultipleOrders(updates)
      const allSuccessful = results.every((r) => r.success)

      if (allSuccessful) {
        setSuccess(true)
      } else {
        const failedCount = results.filter((r) => !r.success).length
        setError(`${failedCount} order(s) failed to update`)
      }

      return results
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const resetState = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(false)
  }, [])

  return {
    // State
    loading,
    error,
    success,
    
    // Methods
    updateToPickedUp,
    updateToDelivered,
    getOrderStatus,
    updateMultipleOrders,
    resetState,
  }
}
