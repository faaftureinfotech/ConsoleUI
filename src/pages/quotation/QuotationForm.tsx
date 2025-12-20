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
  Quotation
} from '../../store/slices/quotationSlice'
import { fetchCustomers } from '../../store/slices/customerSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import ConstructionItemSelector from '../ConstructionItemSelector'
import useNotification from '../../components/NotificationContainer'
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
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<QuotationFormData>({
    customerId: 0,
    projectId: undefined,
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxPercentage: 18,
    notes: '',
    status: 'Draft'
  })

  const [errors, setErrors] = useState<Partial<Record<keyof QuotationFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchProjects())
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
          <h3>Quotation Header</h3>
          <div className="form-row">
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
                    {c.name}
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
          <h3>BOQ Items</h3>
          <ConstructionItemSelector
            onItemSelect={(item) => {
              dispatch(addBoqItem(item))
            }}
          />

          {items.length > 0 && (
            <div className="boq-table-wrapper">
              <table className="boq-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => (
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
          )}

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
    </>
  )
}

