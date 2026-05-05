import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageState } from '../../components/common/PageState'
import { PageHero } from '../../components/layout/PageHero'
import { SectionBlock } from '../../components/layout/SectionBlock'
import { adminService } from '../../services/adminService'
import { medicineService } from '../../services/medicineService'
import { formatCurrency } from '../../utils'

function createDraftMap(data) {
  return Object.fromEntries(
    data.map((medicine) => [
      medicine.id,
      {
        brandName: medicine.brandName,
        genericName: medicine.genericName,
        description: medicine.description ?? '',
        dosageForm: medicine.dosageForm ?? '',
        price: medicine.price,
        stockQuantity: medicine.stockQuantity,
        prescriptionRequired: medicine.prescriptionRequired,
        active: medicine.active,
      },
    ]),
  )
}

export function InventoryPage() {
  const [medicines, setMedicines] = useState([])
  const [drafts, setDrafts] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [pageState, setPageState] = useState({
    error: '',
    loading: true,
    success: '',
    busyMedicineId: null,
  })

  async function loadMedicines() {
    try {
      const data = await medicineService.getMedicines()
      setMedicines(data)
      setDrafts(createDraftMap(data))
      setPageState((current) => ({
        ...current,
        error: '',
        loading: false,
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Unable to load inventory.',
        loading: false,
      }))
    }
  }

  useEffect(() => {
    loadMedicines()
  }, [])

  const filteredMedicines = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return medicines
    }

    return medicines.filter(
      (medicine) =>
        medicine.brandName.toLowerCase().includes(query) ||
        medicine.genericName.toLowerCase().includes(query),
    )
  }, [medicines, searchTerm])

  async function handleSave(medicineId) {
    const draft = drafts[medicineId]

    try {
      setPageState((current) => ({
        ...current,
        error: '',
        success: '',
        busyMedicineId: medicineId,
      }))

      await adminService.updateMedicine(medicineId, {
        ...draft,
        price: Number(draft.price),
        stockQuantity: Number(draft.stockQuantity),
      })

      await loadMedicines()

      setPageState((current) => ({
        ...current,
        success: 'Inventory updated successfully.',
        busyMedicineId: null,
      }))
    } catch (error) {
      setPageState((current) => ({
        ...current,
        error: error.response?.data?.message ?? 'Unable to update medicine.',
        success: '',
        busyMedicineId: null,
      }))
    }
  }

  function updateDraft(medicineId, field, value) {
    setDrafts((current) => ({
      ...current,
      [medicineId]: {
        ...current[medicineId],
        [field]: value,
      },
    }))
  }

  return (
    <div className="dashboard-page">
      <PageHero
        badge="Inventory Management"
        title="Monitor stock, pricing, and medicine availability in one place"
        description="The inventory view is connected to the backend and tuned for quick pharmacist edits with low confusion."
        primaryAction="Manage Inventory"
        secondaryAction="Restock View"
      />

      <SectionBlock
        description="Update stock and availability directly from this list to keep order fulfillment accurate."
        title="Inventory overview"
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
            <span>{medicines.length} medicines</span>
            <span>{medicines.filter((item) => item.stockQuantity <= 20).length} low stock</span>
            <span>{medicines.filter((item) => item.active).length} active</span>
          </div>
        </div>

        {pageState.loading ? <PageState message="Loading inventory..." /> : null}
        {pageState.error ? <PageState message={pageState.error} tone="error" /> : null}
        {pageState.success ? <PageState message={pageState.success} tone="success" /> : null}

        <div className="list-stack">
          {filteredMedicines.map((medicine) => {
            const draft = drafts[medicine.id]

            return (
              <Card
                description={`${draft?.genericName || medicine.genericName} · ${formatCurrency(
                  draft?.price || medicine.price,
                )}`}
                eyebrow={medicine.stockQuantity <= 20 ? 'Low Stock' : 'In Stock'}
                key={medicine.id}
                title={medicine.brandName}
              >
                <div className="form-grid-2">
                  <label className="field">
                    <span>Stock Quantity</span>
                    <input
                      min="0"
                      onChange={(event) =>
                        updateDraft(medicine.id, 'stockQuantity', event.target.value)
                      }
                      type="number"
                      value={draft?.stockQuantity ?? ''}
                    />
                  </label>
                  <label className="field">
                    <span>Price</span>
                    <input
                      min="0"
                      onChange={(event) => updateDraft(medicine.id, 'price', event.target.value)}
                      step="0.01"
                      type="number"
                      value={draft?.price ?? ''}
                    />
                  </label>
                </div>

                <div className="form-grid-2">
                  <label className="field">
                    <span>Prescription Required</span>
                    <select
                      onChange={(event) =>
                        updateDraft(
                          medicine.id,
                          'prescriptionRequired',
                          event.target.value === 'true',
                        )
                      }
                      value={String(draft?.prescriptionRequired)}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Availability</span>
                    <select
                      onChange={(event) =>
                        updateDraft(medicine.id, 'active', event.target.value === 'true')
                      }
                      value={String(draft?.active)}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </label>
                </div>

                <div className="pharmacist-decision-row">
                  <p className="inventory-note">
                    Dosage: {medicine.dosageForm || 'Not specified'}
                  </p>
                  <Button
                    disabled={pageState.busyMedicineId === medicine.id}
                    onClick={() => handleSave(medicine.id)}
                  >
                    {pageState.busyMedicineId === medicine.id ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            )
          })}

          {!filteredMedicines.length && !pageState.loading ? (
            <PageState message="No medicines match your search." />
          ) : null}
        </div>
      </SectionBlock>
    </div>
  )
}
