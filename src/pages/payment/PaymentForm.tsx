import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createPayment,
  updatePayment,
  selectPayment,
  PaymentFormData,
  Payment,
  PaymentType,
  PaymentMode,
  PaymentStatus,
  PartyType
} from '../../store/slices/paymentSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import { fetchCustomers } from '../../store/slices/customerSlice'
import { fetchEmployees } from '../../store/slices/employeesSlice'
import { fetchSuppliers } from '../../store/slices/supplierSlice'
import useNotification from '../../components/NotificationContainer'
import './PaymentForm.css'

interface PaymentFormProps {
  payment?: Payment | null
  onSuccess?: () => void
}

export default function PaymentForm({ payment, onSuccess }: PaymentFormProps) {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((s) => s.payment)
  const { list: projects } = useAppSelector((s) => s.project)
  const { list: customers } = useAppSelector((s) => s.customer)
  const { list: employees } = useAppSelector((s) => s.employees)
  const { list: suppliers } = useAppSelector((s) => s.supplier)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<PaymentFormData>({
    paymentDate: new Date().toISOString().split('T')[0],
    projectId: 0,
    paymentType: 'Outgoing',
    amount: 0,
    paymentMode: 'Cash',
    referenceNumber: '',
    remarks: '',
    status: 'Pending',
    partyType: 'Customer',
    partyId: 0,
    taxDeducted: 0,
    tdsAmount: 0,
    netPaidAmount: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchCustomers())
    dispatch(fetchEmployees())
    dispatch(fetchSuppliers())
  }, [dispatch])

  useEffect(() => {
    if (payment) {
      setFormData({
        paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
        projectId: payment.projectId || 0,
        paymentType: payment.paymentType || 'Outgoing',
        amount: payment.amount || 0,
        paymentMode: payment.paymentMode || 'Cash',
        referenceNumber: payment.referenceNumber || '',
        remarks: payment.remarks || '',
        status: payment.status || 'Pending',
        partyType: payment.partyType || 'Customer',
        partyId: payment.partyId || 0,
        taxDeducted: payment.taxDeducted || 0,
        tdsAmount: payment.tdsAmount || 0,
        netPaidAmount: payment.netPaidAmount || 0
      })
    }
  }, [payment])

  useEffect(() => {
    // Auto-calculate net paid amount
    const netPaid = formData.amount - (formData.taxDeducted || 0) - (formData.tdsAmount || 0)
    setFormData((prev) => ({ ...prev, netPaidAmount: Math.max(0, netPaid) }))
  }, [formData.amount, formData.taxDeducted, formData.tdsAmount])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {}

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required'
    }
    if (!formData.projectId || formData.projectId === 0) {
      newErrors.projectId = 'Project is required'
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (!formData.partyId || formData.partyId === 0) {
      newErrors.partyId = 'Party is required'
    }
    if (formData.taxDeducted && formData.taxDeducted < 0) {
      newErrors.taxDeducted = 'Tax deducted cannot be negative'
    }
    if (formData.tdsAmount && formData.tdsAmount < 0) {
      newErrors.tdsAmount = 'TDS amount cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      showNotification('error', 'Please fix the validation errors')
      return
    }

    if (payment) {
      dispatch(updatePayment({ id: payment.id, data: formData }))
    } else {
      dispatch(createPayment(formData))
    }
  }

  const handleChange = (field: keyof PaymentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const paymentTypes: PaymentType[] = ['Incoming', 'Outgoing']
  const paymentModes: PaymentMode[] = ['Cash', 'Bank', 'UPI', 'Cheque']
  const paymentStatuses: PaymentStatus[] = ['Pending', 'Completed', 'Failed']
  const partyTypes: PartyType[] = ['Customer', 'Employee', 'Contractor', 'Supplier']

  const getPartyOptions = () => {
    switch (formData.partyType) {
      case 'Customer':
        return customers.map((c) => ({ id: c.customerId, name: c.name }))
      case 'Employee':
        return employees.filter((e) => e.type === 'Employee').map((e) => ({ id: e.id, name: `${e.firstName} ${e.lastName}`.trim() }))
      case 'Contractor':
        return employees.filter((e) => e.type === 'Contractor').map((e) => ({ id: e.id, name: `${e.firstName} ${e.lastName}`.trim() }))
      case 'Supplier':
        return suppliers.map((s) => ({ id: s.id, name: s.supplierName }))
      default:
        return []
    }
  }

  return (
    <>
      <NotificationContainer />
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Core Payment Info</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date <span className="required">*</span></label>
              <input
                type="date"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                className={errors.paymentDate ? 'error' : ''}
              />
              {errors.paymentDate && <span className="error-message">{errors.paymentDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="projectId">Project <span className="required">*</span></label>
              <select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', Number(e.target.value))}
                className={errors.projectId ? 'error' : ''}
              >
                <option value={0}>Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
              {errors.projectId && <span className="error-message">{errors.projectId}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentType">Payment Type</label>
              <select
                id="paymentType"
                value={formData.paymentType}
                onChange={(e) => handleChange('paymentType', e.target.value as PaymentType)}
              >
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as PaymentStatus)}
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount <span className="required">*</span></label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className={errors.amount ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="paymentMode">Payment Mode</label>
              <select
                id="paymentMode"
                value={formData.paymentMode}
                onChange={(e) => handleChange('paymentMode', e.target.value as PaymentMode)}
              >
                {paymentModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="referenceNumber">Reference Number</label>
              <input
                type="text"
                id="referenceNumber"
                value={formData.referenceNumber || ''}
                onChange={(e) => handleChange('referenceNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              value={formData.remarks || ''}
              onChange={(e) => handleChange('remarks', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Party Type Reference</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="partyType">Party Type <span className="required">*</span></label>
              <select
                id="partyType"
                value={formData.partyType}
                onChange={(e) => {
                  handleChange('partyType', e.target.value as PartyType)
                  handleChange('partyId', 0) // Reset party when type changes
                }}
              >
                {partyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="partyId">Party <span className="required">*</span></label>
              <select
                id="partyId"
                value={formData.partyId}
                onChange={(e) => handleChange('partyId', Number(e.target.value))}
                className={errors.partyId ? 'error' : ''}
              >
                <option value={0}>Select {formData.partyType}</option>
                {getPartyOptions().map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.name}
                  </option>
                ))}
              </select>
              {errors.partyId && <span className="error-message">{errors.partyId}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Financial Control</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxDeducted">Tax Deducted</label>
              <input
                type="number"
                id="taxDeducted"
                value={formData.taxDeducted || ''}
                onChange={(e) => handleChange('taxDeducted', e.target.value ? Number(e.target.value) : 0)}
                className={errors.taxDeducted ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.taxDeducted && <span className="error-message">{errors.taxDeducted}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tdsAmount">TDS Amount</label>
              <input
                type="number"
                id="tdsAmount"
                value={formData.tdsAmount || ''}
                onChange={(e) => handleChange('tdsAmount', e.target.value ? Number(e.target.value) : 0)}
                className={errors.tdsAmount ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.tdsAmount && <span className="error-message">{errors.tdsAmount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="netPaidAmount">Net Paid Amount</label>
              <input
                type="number"
                id="netPaidAmount"
                value={formData.netPaidAmount}
                readOnly
                className="readonly"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : payment ? 'Update Payment' : 'Create Payment'}
          </button>
          {payment && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectPayment(null))
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

