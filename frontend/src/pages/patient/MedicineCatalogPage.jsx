import { useEffect, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { useCart } from '../../hooks/useCart'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { medicineService } from '../../services/medicineService'
import { formatCurrency } from '../../utils'

export function MedicineCatalogPage() {
  const { addItem, itemCount } = useCart()
  const [medicines, setMedicines] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pageState, setPageState] = useState({ error: '', loading: true })

  useEffect(() => {
    async function loadMedicines() {
      try {
        const data = await medicineService.getMedicines()
        setMedicines(data.filter((medicine) => medicine.active))
        setPageState({ error: '', loading: false })
      } catch (error) {
        setPageState({
          error: error.response?.data?.message ?? 'Unable to load medicines right now.',
          loading: false,
        })
      }
    }

    loadMedicines()
  }, [])

  const filteredMedicines = medicines.filter((medicine) => {
    const query = searchTerm.toLowerCase()
    return (
      medicine.brandName.toLowerCase().includes(query) ||
      medicine.genericName.toLowerCase().includes(query)
    )
  })

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Medicine Catalog"
        title="Browse medicines, health essentials, and substitute-ready options"
        description="Browse the available catalog, review stock and prescription requirements, and add items to your local cart."
        primaryAction={`Cart Items: ${itemCount}`}
        secondaryAction="Review Catalog"
      />

      <SectionBlock
        description="Search medicines by brand or generic name and build your cart before checkout."
        title="Catalog"
      >
        <div className="toolbar-card">
          <input
            className="toolbar-card__search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by brand or generic name"
            type="text"
            value={searchTerm}
          />
          <div className="toolbar-card__filters">
            <span>OTC</span>
            <span>Rx Required</span>
            <span>Supplements</span>
            <span>In Stock</span>
          </div>
        </div>

        {pageState.loading ? <PageState message="Loading medicines..." /> : null}
        {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}

        <div className="product-grid">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id} title={medicine.brandName}>
              <div className="product-card">
                <p>{medicine.genericName}</p>
                <div className="product-card__meta">
                  <span>{medicine.prescriptionRequired ? 'Prescription required' : 'Open for purchase'}</span>
                  <strong>{formatCurrency(medicine.price)}</strong>
                </div>
                <p>Stock: {medicine.stockQuantity}</p>
                <Button
                  onClick={() => addItem(medicine)}
                  variant={medicine.prescriptionRequired ? 'secondary' : 'primary'}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </SectionBlock>
    </div>
  )
}
