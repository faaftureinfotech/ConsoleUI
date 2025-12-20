import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createSupplier,
  updateSupplier,
  selectSupplier,
  SupplierFormData,
  Supplier,
  SupplierType,
  SupplierStatus
} from '../../store/slices/supplierSlice'
import useNotification from '../../components/NotificationContainer'
import './SupplierForm.css'

interface SupplierFormProps {
  supplier?: Supplier | null
  onSuccess?: () => void
}

export default function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.supplier)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)
  const hasHandledSuccess = useRef(false)
  const isMounted = useRef(true)

  const [formData, setFormData] = useState<SupplierFormData>({
    supplierName: '',
    contactPerson: '',
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    gstNumber: '',
    panNumber: '',
    supplierType: 'Material',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    openingBalance: 0,
    status: 'Active',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof SupplierFormData, string>>>({})

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier.supplierName || '',
        contactPerson: supplier.contactPerson || '',
        mobileNumber: supplier.mobileNumber || '',
        email: supplier.email || '',
        address: supplier.address || '',
        city: supplier.city || '',
        state: supplier.state || '',
        gstNumber: supplier.gstNumber || '',
        panNumber: supplier.panNumber || '',
        supplierType: supplier.supplierType || 'Material',
        bankName: supplier.bankName || '',
        accountNumber: supplier.accountNumber || '',
        ifscCode: supplier.ifscCode || '',
        upiId: supplier.upiId || '',
        openingBalance: supplier.openingBalance || 0,
        status: supplier.status || 'Active',
        notes: supplier.notes || ''
      })
    } else {
      // Reset form when creating new supplier
      setFormData({
        supplierName: '',
        contactPerson: '',
        mobileNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        gstNumber: '',
        panNumber: '',
        supplierType: 'Material',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        openingBalance: 0,
        status: 'Active',
        notes: ''
      })
      setErrors({})
      setLastAction(null)
    }
  }, [supplier])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!loading && lastAction && !hasHandledSuccess.current && isMounted.current) {
      if (error) {
        showNotification('error', error)
        setLastAction(null)
        hasHandledSuccess.current = false
      } else if (lastAction === 'create' || lastAction === 'update') {
        hasHandledSuccess.current = true
        const message = lastAction === 'create' 
          ? 'Supplier created successfully' 
          : 'Supplier updated successfully'
        showNotification('success', message)
        
        // Reset lastAction first to prevent re-triggering
        setLastAction(null)
        
        // Call onSuccess after a short delay to ensure state updates are complete
        if (onSuccess && isMounted.current) {
          setTimeout(() => {
            if (isMounted.current && onSuccess) {
              onSuccess()
            }
          }, 300)
        }
      }
    }
  }, [loading, error, lastAction, onSuccess, showNotification])

  // Reset the success handler flag when lastAction changes
  useEffect(() => {
    if (!lastAction) {
      hasHandledSuccess.current = false
    }
  }, [lastAction])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SupplierFormData, string>> = {}

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required'
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
      newErrors.gstNumber = 'Please enter a valid GST number'
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'PAN must be in format: ABCDE1234F'
    }
    if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Please enter a valid IFSC code'
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

    if (supplier) {
      setLastAction('update')
      dispatch(updateSupplier({ id: supplier.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createSupplier(formData))
    }
  }

  const handleChange = (field: keyof SupplierFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const supplierTypes: SupplierType[] = ['Material', 'Equipment', 'Service']
  const statuses: SupplierStatus[] = ['Active', 'Inactive']

  return (
    <>
      <NotificationContainer />
      <form className="supplier-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Supplier Info</h3>
          <div className="form-group">
            <label htmlFor="supplierName">Supplier Name <span className="required">*</span></label>
            <input
              type="text"
              id="supplierName"
              value={formData.supplierName}
              onChange={(e) => handleChange('supplierName', e.target.value)}
              className={errors.supplierName ? 'error' : ''}
            />
            {errors.supplierName && <span className="error-message">{errors.supplierName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <input
                type="text"
                id="contactPerson"
                value={formData.contactPerson || ''}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number <span className="required">*</span></label>
              <input
                type="tel"
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                className={errors.mobileNumber ? 'error' : ''}
                maxLength={10}
              />
              {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gstNumber">GST Number</label>
              <input
                type="text"
                id="gstNumber"
                value={formData.gstNumber || ''}
                onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                className={errors.gstNumber ? 'error' : ''}
                maxLength={15}
              />
              {errors.gstNumber && <span className="error-message">{errors.gstNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="panNumber">PAN Number</label>
              <input
                type="text"
                id="panNumber"
                value={formData.panNumber || ''}
                onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                className={errors.panNumber ? 'error' : ''}
                maxLength={10}
              />
              {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="supplierType">Supplier Type</label>
              <select
                id="supplierType"
                value={formData.supplierType}
                onChange={(e) => handleChange('supplierType', e.target.value as SupplierType)}
              >
                {supplierTypes.map((type) => (
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
                onChange={(e) => handleChange('status', e.target.value as SupplierStatus)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Bank Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                id="bankName"
                value={formData.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                value={formData.accountNumber || ''}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ifscCode">IFSC Code</label>
              <input
                type="text"
                id="ifscCode"
                value={formData.ifscCode || ''}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                className={errors.ifscCode ? 'error' : ''}
                maxLength={11}
              />
              {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="upiId">UPI ID</label>
              <input
                type="text"
                id="upiId"
                value={formData.upiId || ''}
                onChange={(e) => handleChange('upiId', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Control</h3>
          <div className="form-group">
            <label htmlFor="openingBalance">Opening Balance</label>
            <input
              type="number"
              id="openingBalance"
              value={formData.openingBalance}
              onChange={(e) => handleChange('openingBalance', Number(e.target.value))}
              min="0"
              step="0.01"
            />
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : supplier ? 'Update Supplier' : 'Create Supplier'}
          </button>
          {supplier && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectSupplier(null))
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


