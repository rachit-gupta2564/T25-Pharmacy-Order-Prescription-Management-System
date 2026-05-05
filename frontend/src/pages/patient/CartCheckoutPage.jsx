import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { useCart } from '../../hooks/useCart'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { patientService } from '../../services/patientService'
import { formatCurrency } from '../../utils'

export function CartCheckoutPage() {
  const { clearCart, items, removeItem, subtotal, updateQuantity } = useCart()
  const navigate = useNavigate()
  const [prescriptions, setPrescriptions] = useState([])
  const [checkoutForm, setCheckoutForm] = useState({
    fulfillmentType: 'DELIVERY',
    deliveryAddress: '',
    prescriptionId: '',
  })
  const [pageState, setPageState] = useState({
    error: '',
    loading: true,
    submitting: false,
  })

  const hasPrescriptionItems = items.some((item) => item.prescriptionRequired)

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const data = await patientService.getPrescriptions()
        setPrescriptions(data)
        setPageState((current) => ({ ...current, loading: false, error: '' }))
      } catch (error) {
        setPageState((current) => ({
          ...current,
          loading: false,
          error: error.response?.data?.message ?? 'Unable to load prescription options.',
        }))
      }
    }

    loadPrescriptions()
  }, [])

  async function handleCheckout(event) {
    event.preventDefault()
    if (!items.length) {
      setPageState((current) => ({
        ...current,
        error: 'Your cart is empty.',
      }))
      return
    }

    setPageState((current) => ({ ...current, error: '', submitting: true }))

    try {
      await patientService.checkout({
        deliveryAddress: checkoutForm.deliveryAddress,
        fulfillmentType: checkoutForm.fulfillmentType,
        items: items.map((item) => ({
          medicineId: item.id,
          quantity: item.quantity,
        })),
        prescriptionId: checkoutForm.prescriptionId
          ? Number(checkoutForm.prescriptionId)
          : null,
      })

      clearCart()
      navigate('/patient/orders')
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Checkout failed. Please review your order.',
        submitting: false,
      }))
    }
  }

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Cart & Checkout"
        title="Review medicines, confirm fulfillment, and place your order"
        description="Your cart stays local until checkout, then the order is sent to the backend patient checkout API."
        primaryAction={`Subtotal: ${formatCurrency(subtotal)}`}
        secondaryAction="Proceed Carefully"
      />

      <div className="content-grid-2">
        <SectionBlock
          description="Adjust quantities or remove items before placing the order."
          title="Current cart"
        >
          <div className="list-stack">
            {items.map((item) => (
              <Card key={item.id}>
                <div className="cart-line">
                  <div>
                    <h4>{item.brandName}</h4>
                    <p>{item.genericName}</p>
                    <p>{item.prescriptionRequired ? 'Prescription required' : 'Open purchase'}</p>
                  </div>
                  <div className="cart-controls">
                    <input
                      min="1"
                      onChange={(event) =>
                        updateQuantity(item.id, Number(event.target.value))
                      }
                      type="number"
                      value={item.quantity}
                    />
                    <strong>{formatCurrency(Number(item.price) * item.quantity)}</strong>
                    <Button onClick={() => removeItem(item.id)} variant="secondary">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {!items.length ? <PageState message="Your cart is empty." /> : null}
          </div>
        </SectionBlock>

        <SectionBlock
          description="Choose delivery or pickup and include a prescription when required."
          title="Checkout details"
        >
          <form className="auth-form" onSubmit={handleCheckout}>
            <label className="field">
              <span>Fulfillment Type</span>
              <select
                onChange={(event) =>
                  setCheckoutForm((current) => ({
                    ...current,
                    fulfillmentType: event.target.value,
                  }))
                }
                value={checkoutForm.fulfillmentType}
              >
                <option value="DELIVERY">Delivery</option>
                <option value="PICKUP">Pickup</option>
              </select>
            </label>

            <label className="field">
              <span>Delivery Address</span>
              <textarea
                onChange={(event) =>
                  setCheckoutForm((current) => ({
                    ...current,
                    deliveryAddress: event.target.value,
                  }))
                }
                placeholder="Enter full delivery address"
                rows="4"
                value={checkoutForm.deliveryAddress}
              />
            </label>

            {hasPrescriptionItems ? (
              <label className="field">
                <span>Approved Prescription</span>
                <select
                  onChange={(event) =>
                    setCheckoutForm((current) => ({
                      ...current,
                      prescriptionId: event.target.value,
                    }))
                  }
                  value={checkoutForm.prescriptionId}
                >
                  <option value="">Select a prescription</option>
                  {prescriptions
                    .filter((prescription) => prescription.status === 'APPROVED')
                    .map((prescription) => (
                      <option key={prescription.id} value={prescription.id}>
                        {prescription.prescriptionNumber} - {prescription.doctorName}
                      </option>
                    ))}
                </select>
              </label>
            ) : null}

            {pageState.loading ? <PageState message="Loading prescription options..." /> : null}
            {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}

            <Card title="Order summary">
              <div className="summary-list">
                <p>Total items: {items.length}</p>
                <p>Prescription items: {hasPrescriptionItems ? 'Yes' : 'No'}</p>
                <p>Estimated total: {formatCurrency(subtotal)}</p>
              </div>
            </Card>

            <Button type="submit">
              {pageState.submitting ? 'Placing order...' : 'Checkout Now'}
            </Button>
          </form>
        </SectionBlock>
      </div>
    </div>
  )
}
