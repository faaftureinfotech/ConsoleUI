import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createEmployee,
  updateEmployee,
  selectEmployee,
  EmployeeFormData,
  Employee,
  EmployeeType,
  EmployeeStatus,
  SalaryType
} from '../../store/slices/employeesSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import useNotification from '../../components/NotificationContainer'
import './EmployeeForm.css'

interface EmployeeFormProps {
  employee?: Employee | null
  onSuccess?: () => void
}

export default function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.employees)
  const { list: projects } = useAppSelector((s) => s.project)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<EmployeeFormData>({
    type: 'Employee',
    fullName: '',
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    designation: '',
    department: '',
    projectId: undefined,
    joiningDate: '',
    status: 'Active',
    salaryType: undefined,
    ratePerDay: undefined,
    monthlySalary: undefined,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    aadharNumber: '',
    panNumber: '',
    contractStartDate: '',
    contractEndDate: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  useEffect(() => {
    if (!loading && lastAction) {
      if (error) {
        showNotification('error', error)
      } else if (lastAction === 'create') {
        showNotification('success', 'Employee/Contractor created successfully')
        dispatch(selectEmployee(null))
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
            navigate('/employees')
          }, 500)
        } else {
          setTimeout(() => {
            navigate('/employees')
          }, 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Employee/Contractor updated successfully')
        dispatch(selectEmployee(null))
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
            navigate('/employees')
          }, 500)
        } else {
          setTimeout(() => {
            navigate('/employees')
          }, 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, error, lastAction, onSuccess, showNotification, navigate, dispatch])

  useEffect(() => {
    if (employee) {
      setFormData({
        type: employee.type || 'Employee',
        fullName: employee.fullName || '',
        mobileNumber: employee.mobileNumber || '',
        email: employee.email || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        pincode: employee.pincode || '',
        designation: employee.designation || '',
        department: employee.department || '',
        projectId: employee.projectId,
        joiningDate: employee.joiningDate || '',
        status: employee.status || 'Active',
        salaryType: employee.salaryType,
        ratePerDay: employee.ratePerDay,
        monthlySalary: employee.monthlySalary,
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        upiId: employee.upiId || '',
        aadharNumber: employee.aadharNumber || '',
        panNumber: employee.panNumber || '',
        contractStartDate: employee.contractStartDate || '',
        contractEndDate: employee.contractEndDate || ''
      })
    }
  }, [employee])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }
    if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits'
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'PAN must be in format: ABCDE1234F'
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

    if (employee) {
      setLastAction('update')
      dispatch(updateEmployee({ id: employee.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createEmployee(formData))
    }
  }

  const handleChange = (field: keyof EmployeeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const employeeTypes: EmployeeType[] = ['Employee', 'Contractor']
  const statuses: EmployeeStatus[] = ['Active', 'Inactive']
  const salaryTypes: SalaryType[] = ['Daily', 'Weekly', 'Monthly', 'Contract']

  return (
    <>
      <NotificationContainer />
      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Info</h3>
          <div className="form-group">
            <label htmlFor="type">Type <span className="required">*</span></label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as EmployeeType)}
            >
              {employeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name <span className="required">*</span></label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                value={formData.pincode || ''}
                onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                className={errors.pincode ? 'error' : ''}
                maxLength={6}
              />
              {errors.pincode && <span className="error-message">{errors.pincode}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Work Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                id="designation"
                value={formData.designation || ''}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="e.g., Engineer, Mason, Supervisor"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectId">Assigned Project</label>
              <select
                id="projectId"
                value={formData.projectId || ''}
                onChange={(e) => handleChange('projectId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="joiningDate">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                value={formData.joiningDate || ''}
                onChange={(e) => handleChange('joiningDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Details</h3>
          <div className="form-group">
            <label htmlFor="salaryType">Salary Type</label>
            <select
              id="salaryType"
              value={formData.salaryType || ''}
              onChange={(e) => handleChange('salaryType', e.target.value ? (e.target.value as SalaryType) : undefined)}
            >
              <option value="">Select Salary Type</option>
              {salaryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ratePerDay">Rate Per Day</label>
              <input
                type="number"
                id="ratePerDay"
                value={formData.ratePerDay || ''}
                onChange={(e) => handleChange('ratePerDay', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlySalary">Monthly Salary</label>
              <input
                type="number"
                id="monthlySalary"
                value={formData.monthlySalary || ''}
                onChange={(e) => handleChange('monthlySalary', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

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
                maxLength={11}
              />
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

        {formData.type === 'Contractor' && (
          <div className="form-section">
            <h3>Legal (Contractor)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aadharNumber">Aadhar Number</label>
                <input
                  type="text"
                  id="aadharNumber"
                  value={formData.aadharNumber || ''}
                  onChange={(e) => handleChange('aadharNumber', e.target.value.replace(/\D/g, ''))}
                  className={errors.aadharNumber ? 'error' : ''}
                  maxLength={12}
                />
                {errors.aadharNumber && <span className="error-message">{errors.aadharNumber}</span>}
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
                <label htmlFor="contractStartDate">Contract Start Date</label>
                <input
                  type="date"
                  id="contractStartDate"
                  value={formData.contractStartDate || ''}
                  onChange={(e) => handleChange('contractStartDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contractEndDate">Contract End Date</label>
                <input
                  type="date"
                  id="contractEndDate"
                  value={formData.contractEndDate || ''}
                  onChange={(e) => handleChange('contractEndDate', e.target.value)}
                  min={formData.contractStartDate}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
          </button>
          {employee && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectEmployee(null))
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

