import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createQuotation,
  updateQuotation,
  selectQuotation,
  addBoqItem,
  removeBoqItem,
  updateBoqItem,
  clearBoqItems,
  QuotationFormData,
  Quotation,
  Phase
} from '../../store/slices/quotationSlice'
import { fetchCustomers } from '../../store/slices/customerSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import { fetchUnits } from '../../store/slices/unitsSlice'
import ConstructionItemSelector from '../ConstructionItemSelector'
import BoqMasterSelector from './BoqMasterSelector'
import useNotification from '../../components/NotificationContainer'
import BoqMasterModal from './BoqMasterModal'
import { addBoqItemFromMaster } from '../../store/slices/quotationSlice'
import './QuotationForm.css'

interface QuotationFormProps {
  quotation?: Quotation | null
  onSuccess?: () => void
}

export default function QuotationForm({ quotation, onSuccess }: QuotationFormProps) {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.quotation)
  const { list: customers } = useAppSelector((s) => s.customer)
  const { list: projects } = useAppSelector((s) => s.project)
  const { list: units } = useAppSelector((s) => s.units)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)
  const [showBoqMasterModal, setShowBoqMasterModal] = useState(false)

  const [formData, setFormData] = useState<QuotationFormData>({
    quotationNumber: '',
    customerId: 0,
    projectId: undefined,
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxPercentage: 18,
    notes: '',
    status: 'Draft'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof QuotationFormData, string>>>({})
  const [selectedPhase, setSelectedPhase] = useState<Phase>('Ground Floor')

  const phases: Phase[] = [
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Fifth Floor',
    'Basement',
    'Roof',
    'Common Areas',
    'External Works'
  ]

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchProjects())
    dispatch(fetchUnits())
  }, [dispatch])

  useEffect(() => {
    if (!loading && lastAction) {
      if (error) {
        showNotification('error', error)
      } else if (lastAction === 'create') {
        showNotification('success', 'Quotation created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Quotation updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, error, lastAction, onSuccess, showNotification])

  useEffect(() => {
    if (quotation) {
      setFormData({
        quotationNumber: quotation.quotationNumber || '',
        customerId: quotation.customerId || 0,
        projectId: quotation.projectId,
        quotationDate: quotation.quotationDate || new Date().toISOString().split('T')[0],
        validUntil: quotation.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        taxPercentage: quotation.taxPercentage || 18,
        notes: quotation.notes || '',
        status: quotation.status || 'Draft'
      })
    } else {
      dispatch(clearBoqItems())
    }
  }, [quotation, dispatch])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuotationFormData, string>> = {}

    if (!formData.customerId || formData.customerId === 0) {
      newErrors.customerId = 'Customer is required'
    }
    if (!formData.quotationDate) {
      newErrors.quotationDate = 'Quotation date is required'
    }
    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required'
    }
    if (formData.validUntil < formData.quotationDate) {
      newErrors.validUntil = 'Valid until date must be after quotation date'
    }
    if (items.length === 0) {
      showNotification('error', 'Please add at least one BOQ item')
      return false
    }
    if (formData.taxPercentage < 0 || formData.taxPercentage > 100) {
      newErrors.taxPercentage = 'Tax percentage must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (quotation) {
      setLastAction('update')
      dispatch(updateQuotation({ id: quotation.id, formData, items }))
    } else {
      setLastAction('create')
      dispatch(createQuotation({ formData, items }))
    }
  }

  const handleChange = (field: keyof QuotationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const subTotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = (subTotal * formData.taxPercentage) / 100
  const totalAmount = subTotal + taxAmount

  const statuses: Array<'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'> = [
    'Draft',
    'Sent',
    'Accepted',
    'Rejected',
    'Expired'
  ]

  return (
    <>
      <NotificationContainer />
      <form className="quotation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="quotation-header-top">
            <h3>Quotation Header</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quotationNumber">
                Quotation Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="quotationNumber"
                value={formData.quotationNumber || ''}
                onChange={(e) => handleChange('quotationNumber', e.target.value)}
                className={errors.quotationNumber ? 'error' : ''}
                placeholder="Enter quotation number"
              />
              {errors.quotationNumber && <span className="error-message">{errors.quotationNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="customerId">Customer <span className="required">*</span></label>
              <select
                id="customerId"
                value={formData.customerId}
                onChange={(e) => handleChange('customerId', Number(e.target.value))}
                className={errors.customerId ? 'error' : ''}
              >
                <option value={0}>Select Customer</option>
                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="error-message">{errors.customerId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Project</label>
              <select
                id="projectId"
                value={formData.projectId || ''}
                onChange={(e) => handleChange('projectId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select Project (Optional)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quotationDate">Quotation Date <span className="required">*</span></label>
              <input
                type="date"
                id="quotationDate"
                value={formData.quotationDate}
                onChange={(e) => handleChange('quotationDate', e.target.value)}
                className={errors.quotationDate ? 'error' : ''}
              />
              {errors.quotationDate && <span className="error-message">{errors.quotationDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="validUntil">Valid Until <span className="required">*</span></label>
              <input
                type="date"
                id="validUntil"
                value={formData.validUntil}
                onChange={(e) => handleChange('validUntil', e.target.value)}
                className={errors.validUntil ? 'error' : ''}
                min={formData.quotationDate}
              />
              {errors.validUntil && <span className="error-message">{errors.validUntil}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as QuotationFormData['status'])}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxPercentage">Tax Percentage (%)</label>
              <input
                type="number"
                id="taxPercentage"
                value={formData.taxPercentage}
                onChange={(e) => handleChange('taxPercentage', Number(e.target.value))}
                className={errors.taxPercentage ? 'error' : ''}
                min="0"
                max="100"
                step="0.01"
              />
              {errors.taxPercentage && <span className="error-message">{errors.taxPercentage}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>BOQ Items</h3>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setShowBoqMasterModal(true)
              }}
              title="Manage BOQ Masters"
            >
              Manage BOQ Masters
            </button>
          </div>
          <div className="boq-selector-tabs">
            <div className="selector-tabs">
              <button
                type="button"
                className={`selector-tab ${true ? 'active' : ''}`}
                onClick={() => {}}
              >
                BOQ Masters
              </button>
            </div>
            <div className="boq-phase-selector">
              <label htmlFor="phase-select">Assign to Phase:</label>
              <select
                id="phase-select"
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value as Phase)}
                className="phase-select"
              >
                {phases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
            </div>
            <BoqMasterSelector
              onBoqMasterSelect={(master) => {
                const unit = units.find((u: { id: number; name: string }) => u.id === master.defaultUnitId)
                const unitName = unit ? unit.name : 'Nos'
                dispatch(
                  addBoqItemFromMaster({
                    master: {
                      id: master.id,
                      name: master.name,
                      defaultUnitId: master.defaultUnitId,
                      defaultRate: master.defaultRate,
                      description: master.description
                    },
                    unitName,
                    phase: selectedPhase
                  })
                )
              }}
            />
          </div>

          {items.length > 0 && (() => {
            // Group items by phase
            const itemsByPhase = items.reduce((acc, item) => {
              const phase = item.phase || 'Ground Floor'
              if (!acc[phase]) {
                acc[phase] = []
              }
              acc[phase].push(item)
              return acc
            }, {} as Record<Phase, typeof items>)

            // Calculate totals per phase
            const phaseTotals = Object.entries(itemsByPhase).reduce((acc, [phase, phaseItems]) => {
              acc[phase] = phaseItems.reduce((sum, item) => sum + item.amount, 0)
              return acc
            }, {} as Record<string, number>)

            // Order phases
            const orderedPhases = phases.filter(phase => itemsByPhase[phase]?.length > 0)

            return (
              <div className="boq-table-wrapper">
                {orderedPhases.map((phase) => {
                  const phaseItems = itemsByPhase[phase]
                  const phaseTotal = phaseTotals[phase] || 0
                  return (
                    <div key={phase} className="boq-phase-section">
                      <div className="boq-phase-header">
                        <h4>{phase}</h4>
                        <span className="phase-total">Phase Total: ₹{phaseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <table className="boq-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Phase</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {phaseItems.map((row, index) => (
                            <tr key={row.tempId}>
                              <td>{index + 1}</td>
                              <td>{row.description}</td>
                              <td>{row.unit}</td>
                              <td>
                                <input
                                  type="number"
                                  value={row.quantity}
                                  onChange={(e) =>
                                    dispatch(
                                      updateBoqItem({
                                        tempId: row.tempId,
                                        quantity: Number(e.target.value)
                                      })
                                    )
                                  }
                                  min="0.01"
                                  step="0.01"
                                  className="boq-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={row.rate}
                                  onChange={(e) =>
                                    dispatch(
                                      updateBoqItem({
                                        tempId: row.tempId,
                                        rate: Number(e.target.value)
                                      })
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                  className="boq-input"
                                />
                              </td>
                              <td className="amount-cell">₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td>
                                <select
                                  value={row.phase || 'Ground Floor'}
                                  onChange={(e) =>
                                    dispatch(
                                      updateBoqItem({
                                        tempId: row.tempId,
                                        phase: e.target.value as Phase
                                      })
                                    )
                                  }
                                  className="boq-phase-select"
                                >
                                  {phases.map((p) => (
                                    <option key={p} value={p}>
                                      {p}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-delete"
                                  onClick={() => dispatch(removeBoqItem(row.tempId))}
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            )
          })()}

          <div className="quotation-summary">
            <div className="summary-row">
              <span className="summary-label">Sub Total:</span>
              <span className="summary-value">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tax ({formData.taxPercentage}%):</span>
              <span className="summary-value">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row total-row">
              <span className="summary-label">Total Amount:</span>
              <span className="summary-value">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : quotation ? 'Update Quotation' : 'Create Quotation'}
          </button>
          {quotation && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectQuotation(null))
                if (onSuccess) onSuccess()
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* BOQ Master Management Modal */}
      <BoqMasterModal
        isOpen={showBoqMasterModal}
        onClose={() => setShowBoqMasterModal(false)}
      />
    </>
  )
}

