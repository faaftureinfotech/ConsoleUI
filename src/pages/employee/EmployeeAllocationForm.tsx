import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createEmployeeAllocation,
  updateEmployeeAllocation,
  selectEmployeeAllocation,
  EmployeeAllocationFormData,
  EmployeeAllocation,
  AllocationType
} from '../../store/slices/employeeAllocationSlice'
import { fetchEmployees } from '../../store/slices/employeesSlice'
import { fetchProjects } from '../../store/slices/projectSlice'
import useNotification from '../../components/NotificationContainer'
import './EmployeeAllocationForm.css'

interface EmployeeAllocationFormProps {
  allocation?: EmployeeAllocation | null
  onSuccess?: () => void
}

export default function EmployeeAllocationForm({ allocation, onSuccess }: EmployeeAllocationFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.employeeAllocation)
  const { list: employees } = useAppSelector((s) => s.employees)
  const { list: projects } = useAppSelector((s) => s.project)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<EmployeeAllocationFormData>({
    employeeId: 0,
    projectId: undefined,
    allocationDate: new Date().toISOString().split('T')[0],
    allocationType: 'Full Day',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeAllocationFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchEmployees())
    dispatch(fetchProjects())
  }, [dispatch])

  useEffect(() => {
    if (allocation) {
      setFormData({
        employeeId: allocation.employeeId || 0,
        projectId: allocation.projectId,
        allocationDate: allocation.allocationDate || new Date().toISOString().split('T')[0],
        allocationType: allocation.allocationType || 'Full Day',
        notes: allocation.notes || ''
      })
    } else {
      setFormData({
        employeeId: 0,
        projectId: undefined,
        allocationDate: new Date().toISOString().split('T')[0],
        allocationType: 'Full Day',
        notes: ''
      })
    }
    setErrors({})
  }, [allocation])

  useEffect(() => {
    if (!loading && lastAction) {
      if (error) {
        showNotification('error', error)
        setLastAction(null)
      }
    }
  }, [loading, error, lastAction, showNotification])

  useEffect(() => {
    if (!loading && lastAction && !error) {
      if (lastAction === 'create') {
        showNotification('success', 'Employee allocation created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Employee allocation updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeAllocationFormData, string>> = {}

    if (!formData.employeeId || formData.employeeId === 0) {
      newErrors.employeeId = 'Employee/Contractor is required'
    }
    if (!formData.allocationDate) {
      newErrors.allocationDate = 'Allocation date is required'
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

    if (allocation) {
      setLastAction('update')
      dispatch(updateEmployeeAllocation({ id: allocation.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createEmployeeAllocation(formData))
    }
  }

  const handleChange = (field: keyof EmployeeAllocationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const allocationTypes: AllocationType[] = ['Full Day', 'Half Day']

  return (
    <>
      <NotificationContainer />
      <form className="employee-allocation-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Employee/Contractor Allocation</h3>
          
          <div className="form-group">
            <label htmlFor="employeeId">
              Employee/Contractor <span className="required">*</span>
            </label>
            <select
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', Number(e.target.value))}
              className={errors.employeeId ? 'error' : ''}
            >
              <option value={0}>Select Employee/Contractor</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.type})
                </option>
              ))}
            </select>
            {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="allocationDate">
                Allocation Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="allocationDate"
                value={formData.allocationDate}
                onChange={(e) => handleChange('allocationDate', e.target.value)}
                className={errors.allocationDate ? 'error' : ''}
              />
              {errors.allocationDate && <span className="error-message">{errors.allocationDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="allocationType">Allocation Type</label>
              <select
                id="allocationType"
                value={formData.allocationType}
                onChange={(e) => handleChange('allocationType', e.target.value as AllocationType)}
              >
                {allocationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="projectId">Project (Optional)</label>
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
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Enter any additional notes about this allocation"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : allocation ? 'Update Allocation' : 'Create Allocation'}
          </button>
          {allocation && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectEmployeeAllocation(null))
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

