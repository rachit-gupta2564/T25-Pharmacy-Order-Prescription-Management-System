import { useState, useRef, useEffect } from 'react'
import '../styles/otp-verification.css'

export function OTPVerification({ orderId, patientPhone, onVerify, onCancel }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(false)
  const otpInputs = useRef([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    otpInputs.current[0]?.focus()
  }, [])

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }

    setOtp(newOtp)
    setError(null)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('')

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    try {
      setLoading(true)
      // TODO: Call API to verify OTP
      // await deliveryService.verifyOTP(orderId, otpValue)
      
      // Simulate API verification
      setTimeout(() => {
        if (otpValue === '123456') {
          // Mock successful OTP
          onVerify({ orderId, otp: otpValue })
          setLoading(false)
        } else {
          setError('Invalid OTP. Please try again.')
          setLoading(false)
        }
      }, 1000)
    } catch (err) {
      setError('Failed to verify OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true)
      // TODO: Call API to resend OTP
      // await deliveryService.resendOTP(orderId)
      
      setTimeLeft(300)
      setOtp(['', '', '', '', '', ''])
      otpInputs.current[0]?.focus()
      
      setTimeout(() => {
        setResendDisabled(false)
      }, 3000)
    } catch (err) {
      setError('Failed to resend OTP')
      setResendDisabled(false)
    }
  }

  return (
    <div className="otp-modal">
      <div className="otp-content">
        <div className="otp-header">
          <h2 className="otp-title">Verify Delivery</h2>
          <p className="otp-subtitle">{orderId}</p>
        </div>

        <div className="otp-body">
          {/* Phone Display */}
          <div className="phone-display">
            <p className="phone-label">Verification code sent to</p>
            <p className="phone-number">{patientPhone}</p>
          </div>

          {/* OTP Input */}
          <div className="otp-section">
            <label className="otp-label">Enter 6-digit OTP</label>
            <div className="otp-input-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  className="otp-input"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="timer-section">
            {timeLeft > 0 ? (
              <p className="timer-text">
                Code expires in <strong>{formatTime(timeLeft)}</strong>
              </p>
            ) : (
              <p className="timer-expired">Code has expired. Please request a new one.</p>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Info Box */}
          <div className="info-box">
            <p className="info-text">
              <strong>💡 Tip:</strong> Ask the patient to provide the OTP they received via SMS or call.
            </p>
          </div>

          {/* Resend Option */}
          <div className="resend-section">
            <p className="resend-text">Didn't receive the code?</p>
            <button
              className={`resend-btn ${resendDisabled ? 'disabled' : ''}`}
              onClick={handleResendOtp}
              disabled={resendDisabled}
            >
              {resendDisabled ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="otp-footer">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn btn-primary ${otp.join('').length === 6 ? 'enabled' : 'disabled'}`}
            onClick={handleVerifyOtp}
            disabled={otp.join('').length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify & Deliver'}
          </button>
        </div>
      </div>
    </div>
  )
}
