/**
 * Delivery Utils - Helper functions for delivery module
 */

export const orderStatusColors = {
  pending: '#FFA500',
  picked_up: '#3B82F6',
  in_transit: '#8B5CF6',
  delivered: '#10B981',
  failed: '#EF4444',
};

export const orderStatuses = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

/**
 * Format time to readable format
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate delivery time estimate
 */
export const calculateDeliveryEstimate = (pickupTime) => {
  const pickup = new Date(pickupTime);
  const estimate = new Date(pickup.getTime() + 30 * 60000); // 30 minutes estimate
  return estimate;
};

/**
 * Validate OTP
 */
export const validateOTP = (otp) => {
  return otp && otp.length === 6 && /^\d+$/.test(otp);
};
