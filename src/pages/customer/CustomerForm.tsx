import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createCustomer,
  updateCustomer,
  selectCustomer,
  CustomerFormData,
  Customer
} from '../../store/slices/customerSlice'
import useNotification from '../../components/NotificationContainer'
import './CustomerForm.css'

interface CustomerFormProps {
  customer?: Customer | null
  onSuccess?: () => void
}

export default function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.customer)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstNumber: '',
    address: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({})
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        contactPerson: customer.contactPerson || '',
        phone: customer.phone || '',
        email: customer.email || '',
        gstNumber: customer.gstNumber || '',
        address: customer.address || '',
        notes: customer.notes || ''
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        contactPerson: '',
        phone: '',
        email: '',
        gstNumber: '',
        address: '',
        notes: ''
      })
    }
    setErrors({})
  }, [customer])

  // Handle success/error from store
  useEffect(() => {
    if (!loading && lastAction) {
      if (error) {
        showNotification('error', error)
        setLastAction(null)
      }
    }
  }, [loading, error, lastAction, showNotification])

  // Handle success (when loading changes from true to false and no error)
  useEffect(() => {
    if (!loading && lastAction && !error) {
      if (lastAction === 'create') {
        showNotification('success', 'Customer created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Customer updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validateEmail = (email: string): boolean => {
    if (!email) return true // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const validateGstNumber = (gst: string): boolean => {
    if (!gst) return true // Optional field
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstRegex.test(gst.toUpperCase())
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {}

    // First name is required
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Last name is required
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (minimum 10 digits)'
    }

    // GST Number validation
    if (formData.gstNumber && !validateGstNumber(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST number (15 characters, format: 22AAAAA0000A1Z5)'
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

    if (customer) {
      setLastAction('update')
      dispatch(updateCustomer({ id: customer.customerId, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createCustomer(formData))
    }
  }

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <NotificationContainer />
      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={errors.firstName ? 'error' : ''}
              placeholder="Enter first name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={errors.lastName ? 'error' : ''}
              placeholder="Enter last name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            type="text"
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            placeholder="Enter contact person name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="gstNumber">GST Number</label>
          <input
            type="text"
            id="gstNumber"
            value={formData.gstNumber}
            onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
            className={errors.gstNumber ? 'error' : ''}
            placeholder="Enter GST number"
            maxLength={15}
          />
          {errors.gstNumber && <span className="error-message">{errors.gstNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            placeholder="Enter address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Enter any additional notes"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
          </button>
          {customer && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectCustomer(null))
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

