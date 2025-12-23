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
import { fetchRoles } from '../../store/slices/rolesSlice'
import { fetchUsers } from '../../store/slices/userSlice'
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
  const { list: roles } = useAppSelector((s) => s.roles)
  const { list: users } = useAppSelector((s) => s.user)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<EmployeeFormData>({
    type: 'Employee', // Optional in DTO, but defaulting to 'Employee' for UX
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    designation: '',
    department: '',
    roleId: undefined,
    userId: undefined,
    projectId: undefined,
    assignedProject: '',
    joiningDate: '',
    status: 'Active',
    salaryType: 'Monthly',
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
    dispatch(fetchRoles())
    dispatch(fetchUsers())
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

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      // Format as YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch {
      return ''
    }
  }

  useEffect(() => {
    if (employee) {
      setFormData({
        type: employee.type || 'Employee',
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        mobileNumber: employee.mobileNumber || '',
        email: employee.email || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        pincode: employee.pincode || '',
        designation: employee.designation || '',
        department: employee.department || '',
        roleId: employee.roleId ?? undefined,
        userId: employee.userId ?? undefined,
        projectId: employee.projectId ?? undefined,
        assignedProject: employee.assignedProject || '',
        joiningDate: formatDateForInput(employee.joiningDate),
        status: employee.status || 'Active',
        salaryType: employee.salaryType || 'Monthly',
        ratePerDay: employee.ratePerDay ?? undefined,
        monthlySalary: employee.monthlySalary ?? undefined,
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        upiId: employee.upiId || '',
        aadharNumber: employee.aadharNumber || '',
        panNumber: employee.panNumber || '',
        contractStartDate: formatDateForInput(employee.contractStartDate),
        contractEndDate: formatDateForInput(employee.contractEndDate)
      })
    } else {
      // Reset form when no employee is selected
      setFormData({
        type: 'Employee',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        designation: '',
        department: '',
        roleId: undefined,
        userId: undefined,
        projectId: undefined,
        assignedProject: '',
        joiningDate: '',
        status: 'Active',
        salaryType: 'Monthly',
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
    }
  }, [employee])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {}

    // MobileNumber is required (Phone validation)
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }

    // Designation is required
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required'
    }

    // JoiningDate is required
    if (!formData.joiningDate.trim()) {
      newErrors.joiningDate = 'Joining date is required'
    }

    // Status is required
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    // SalaryType is required
    if (!formData.salaryType) {
      newErrors.salaryType = 'Salary type is required'
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Pincode validation
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    // Aadhar validation
    if (formData.aadharNumber && !/^[0-9]{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits'
    }

    // PAN validation
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'PAN must be in format: ABCDE1234F'
    }

    // Date validations
    if (formData.joiningDate && formData.contractStartDate) {
      const joiningDate = new Date(formData.joiningDate)
      const contractStartDate = new Date(formData.contractStartDate)
      if (contractStartDate < joiningDate) {
        newErrors.contractStartDate = 'Contract start date must be greater than or equal to joining date'
      }
    }

    if (formData.contractStartDate && formData.contractEndDate) {
      const contractStartDate = new Date(formData.contractStartDate)
      const contractEndDate = new Date(formData.contractEndDate)
      if (contractEndDate <= contractStartDate) {
        newErrors.contractEndDate = 'Contract end date must be greater than contract start date'
      }
    }

    // Validate contract end date if contract start date exists
    if (formData.contractStartDate && !formData.contractEndDate) {
      // Contract end date is optional, but if start date is provided, it's better to have end date
      // This is just a warning, not blocking
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
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      
      // If joining date changes, validate contract start date
      if (field === 'joiningDate' && updated.contractStartDate) {
        const joiningDate = new Date(value)
        const contractStartDate = new Date(updated.contractStartDate)
        if (contractStartDate < joiningDate) {
          setErrors((prev) => ({ ...prev, contractStartDate: 'Contract start date must be greater than or equal to joining date' }))
        } else {
          setErrors((prev) => ({ ...prev, contractStartDate: undefined }))
        }
      }
      
      // If contract start date changes, validate contract end date
      if (field === 'contractStartDate' && updated.contractEndDate) {
        const contractStartDate = new Date(value)
        const contractEndDate = new Date(updated.contractEndDate)
        if (contractEndDate <= contractStartDate) {
          setErrors((prev) => ({ ...prev, contractEndDate: 'Contract end date must be greater than contract start date' }))
        } else {
          setErrors((prev) => ({ ...prev, contractEndDate: undefined }))
        }
      }
      
      return updated
    })
    
    // Clear error for the changed field
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
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value ? (e.target.value as EmployeeType) : undefined)}
            >
              <option value="">Select Type (Optional)</option>
              {employeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
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
              <label htmlFor="designation">Designation <span className="required">*</span></label>
              <input
                type="text"
                id="designation"
                value={formData.designation || ''}
                onChange={(e) => handleChange('designation', e.target.value)}
                placeholder="e.g., Engineer, Mason, Supervisor"
                className={errors.designation ? 'error' : ''}
              />
              {errors.designation && <span className="error-message">{errors.designation}</span>}
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
              <label htmlFor="roleId">Role</label>
              <select
                id="roleId"
                value={formData.roleId ?? ''}
                onChange={(e) => handleChange('roleId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="userId">Link User Account (Optional)</label>
              <select
                id="userId"
                value={formData.userId || ''}
                onChange={(e) => handleChange('userId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">No User Account</option>
                {Array.isArray(users) && users.filter(u => u.isActive).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} {u.firstName || u.lastName ? `(${u.firstName || ''} ${u.lastName || ''})`.trim() : ''} - {u.email}
                  </option>
                ))}
              </select>
              <small className="form-hint">Link this employee to an existing user account for system access</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectId">Assigned Project</label>
              <select
                id="projectId"
                value={formData.projectId || ''}
                onChange={(e) => {
                  const projectId = e.target.value ? Number(e.target.value) : undefined
                  const selectedProject = projects.find(p => p.id === projectId)
                  handleChange('projectId', projectId)
                  handleChange('assignedProject', selectedProject?.projectName || '')
                }}
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
              <label htmlFor="joiningDate">Joining Date <span className="required">*</span></label>
              <input
                type="date"
                id="joiningDate"
                value={formData.joiningDate || ''}
                onChange={(e) => handleChange('joiningDate', e.target.value)}
                className={errors.joiningDate ? 'error' : ''}
              />
              {errors.joiningDate && <span className="error-message">{errors.joiningDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status <span className="required">*</span></label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
              className={errors.status ? 'error' : ''}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Details</h3>
          <div className="form-group">
            <label htmlFor="salaryType">Salary Type <span className="required">*</span></label>
            <select
              id="salaryType"
              value={formData.salaryType || ''}
              onChange={(e) => handleChange('salaryType', e.target.value ? (e.target.value as SalaryType) : undefined)}
              className={errors.salaryType ? 'error' : ''}
            >
              <option value="">Select Salary Type</option>
              {salaryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.salaryType && <span className="error-message">{errors.salaryType}</span>}
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

        <div className="form-section">
          <h3>Contract Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contractStartDate">Contract Start Date</label>
              <input
                type="date"
                id="contractStartDate"
                value={formData.contractStartDate || ''}
                onChange={(e) => handleChange('contractStartDate', e.target.value)}
                min={formData.joiningDate || undefined}
                className={errors.contractStartDate ? 'error' : ''}
              />
              {errors.contractStartDate && <span className="error-message">{errors.contractStartDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contractEndDate">Contract End Date</label>
              <input
                type="date"
                id="contractEndDate"
                value={formData.contractEndDate || ''}
                onChange={(e) => handleChange('contractEndDate', e.target.value)}
                min={formData.contractStartDate || formData.joiningDate || undefined}
                className={errors.contractEndDate ? 'error' : ''}
              />
              {errors.contractEndDate && <span className="error-message">{errors.contractEndDate}</span>}
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

