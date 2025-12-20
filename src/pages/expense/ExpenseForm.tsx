import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createExpense,
  updateExpense,
  selectExpense,
  ExpenseFormData,
  Expense,
  ExpenseType,
  PaymentMode
} from '../../store/slices/expenseSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import { fetchEmployees } from '../../store/slices/employeesSlice'
import { fetchSuppliers } from '../../store/slices/supplierSlice'
import useNotification from '../../components/NotificationContainer'
import './ExpenseForm.css'

interface ExpenseFormProps {
  expense?: Expense | null
  onSuccess?: () => void
}

export default function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((s) => s.expense)
  const { list: projects } = useAppSelector((s) => s.project)
  const { list: employees } = useAppSelector((s) => s.employees)
  const { list: suppliers } = useAppSelector((s) => s.supplier)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<ExpenseFormData>({
    expenseDate: new Date().toISOString().split('T')[0],
    projectId: 0,
    expenseType: 'Material',
    expenseCategory: '',
    description: '',
    amount: 0,
    paymentMode: 'Cash',
    billNumber: '',
    taxAmount: 0,
    totalAmount: 0,
    partyType: undefined,
    partyId: undefined
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchProjects())
    dispatch(fetchEmployees())
    dispatch(fetchSuppliers())
  }, [dispatch])

  useEffect(() => {
    if (expense) {
      setFormData({
        expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
        projectId: expense.projectId || 0,
        expenseType: expense.expenseType || 'Material',
        expenseCategory: expense.expenseCategory || '',
        description: expense.description || '',
        amount: expense.amount || 0,
        paymentMode: expense.paymentMode || 'Cash',
        billNumber: expense.billNumber || '',
        taxAmount: expense.taxAmount || 0,
        totalAmount: expense.totalAmount || 0,
        partyType: expense.partyType,
        partyId: expense.partyId
      })
    }
  }, [expense])

  useEffect(() => {
    // Auto-calculate total amount
    const total = formData.amount + formData.taxAmount
    setFormData((prev) => ({ ...prev, totalAmount: total }))
  }, [formData.amount, formData.taxAmount])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {}

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Expense date is required'
    }
    if (!formData.projectId || formData.projectId === 0) {
      newErrors.projectId = 'Project is required'
    }
    if (!formData.expenseCategory.trim()) {
      newErrors.expenseCategory = 'Expense category is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (formData.taxAmount < 0) {
      newErrors.taxAmount = 'Tax amount cannot be negative'
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

    if (expense) {
      dispatch(updateExpense({ id: expense.id, data: formData }))
    } else {
      dispatch(createExpense(formData))
    }
  }

  const handleChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const expenseTypes: ExpenseType[] = ['Labour', 'Material', 'Transport', 'Equipment', 'Other']
  const paymentModes: PaymentMode[] = ['Cash', 'Bank', 'UPI', 'Cheque']
  const partyTypes: Array<'Employee' | 'Contractor' | 'Supplier'> = ['Employee', 'Contractor', 'Supplier']

  const getPartyOptions = () => {
    if (formData.partyType === 'Employee') {
      return employees.filter((e) => e.type === 'Employee')
    } else if (formData.partyType === 'Contractor') {
      return employees.filter((e) => e.type === 'Contractor')
    } else if (formData.partyType === 'Supplier') {
      return suppliers
    }
    return []
  }

  return (
    <>
      <NotificationContainer />
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Core Fields</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expenseDate">Expense Date <span className="required">*</span></label>
              <input
                type="date"
                id="expenseDate"
                value={formData.expenseDate}
                onChange={(e) => handleChange('expenseDate', e.target.value)}
                className={errors.expenseDate ? 'error' : ''}
              />
              {errors.expenseDate && <span className="error-message">{errors.expenseDate}</span>}
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
              <label htmlFor="expenseType">Expense Type</label>
              <select
                id="expenseType"
                value={formData.expenseType}
                onChange={(e) => handleChange('expenseType', e.target.value as ExpenseType)}
              >
                {expenseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="expenseCategory">Expense Category <span className="required">*</span></label>
              <input
                type="text"
                id="expenseCategory"
                value={formData.expenseCategory}
                onChange={(e) => handleChange('expenseCategory', e.target.value)}
                className={errors.expenseCategory ? 'error' : ''}
                placeholder="e.g., Cement, Steel, Labor charges"
              />
              {errors.expenseCategory && <span className="error-message">{errors.expenseCategory}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={errors.description ? 'error' : ''}
              rows={3}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
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
              <label htmlFor="taxAmount">Tax Amount</label>
              <input
                type="number"
                id="taxAmount"
                value={formData.taxAmount}
                onChange={(e) => handleChange('taxAmount', Number(e.target.value))}
                className={errors.taxAmount ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.taxAmount && <span className="error-message">{errors.taxAmount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="totalAmount">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                value={formData.totalAmount}
                readOnly
                className="readonly"
              />
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="billNumber">Bill Number</label>
              <input
                type="text"
                id="billNumber"
                value={formData.billNumber || ''}
                onChange={(e) => handleChange('billNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Party Reference</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="partyType">Party Type</label>
              <select
                id="partyType"
                value={formData.partyType || ''}
                onChange={(e) => {
                  handleChange('partyType', e.target.value || undefined)
                  handleChange('partyId', undefined) // Reset party when type changes
                }}
              >
                <option value="">Select Party Type</option>
                {partyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="partyId">Party</label>
              <select
                id="partyId"
                value={formData.partyId || ''}
                onChange={(e) => handleChange('partyId', e.target.value ? Number(e.target.value) : undefined)}
                disabled={!formData.partyType}
              >
                <option value="">Select {formData.partyType || 'Party'}</option>
                {getPartyOptions().map((party) => (
                  <option key={party.id} value={party.id}>
                    {formData.partyType === 'Supplier'
                      ? (party as any).supplierName
                      : (party as any).fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : expense ? 'Update Expense' : 'Create Expense'}
          </button>
          {expense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectExpense(null))
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

