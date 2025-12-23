import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createProject,
  updateProject,
  selectProject,
  ProjectFormData,
  Project,
  ProjectStatus,
  ProjectType
} from '../../store/slices/projectSlice'
import { fetchCustomers } from '../../store/slices/customerSlice'
import { fetchEmployees } from '../../store/slices/employeesSlice'
import useNotification from '../../components/NotificationContainer'
import './ProjectForm.css'

interface ProjectFormProps {
  project?: Project | null
  onSuccess?: () => void
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.project)
  const { list: customers } = useAppSelector((s) => s.customer)
  const { list: employees } = useAppSelector((s) => s.employees)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)
  const hasHandledSuccess = useRef(false)
  const isMounted = useRef(true)

  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    customerId: 0,
    projectType: 'Residential',
    location: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    contractValue: 0,
    advanceReceived: 0,
    remainingAmount: 0,
    paymentTerms: '',
    projectManagerId: undefined,
    contractorId: undefined,
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchCustomers())
    dispatch(fetchEmployees())
  }, [dispatch])

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
          ? 'Project created successfully' 
          : 'Project updated successfully'
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

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || '',
        customerId: project.customerId || 0,
        projectType: project.projectType || 'Residential',
        location: project.location || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        status: project.status || 'Planning',
        contractValue: project.contractValue || 0,
        advanceReceived: project.advanceReceived || 0,
        remainingAmount: project.remainingAmount || 0,
        paymentTerms: project.paymentTerms || '',
        projectManagerId: project.projectManagerId,
        contractorId: project.contractorId,
        notes: project.notes || ''
      })
    }
  }, [project])

  useEffect(() => {
    // Auto-calculate remaining amount
    const remaining = formData.contractValue - formData.advanceReceived
    setFormData((prev) => ({ ...prev, remainingAmount: remaining }))
  }, [formData.contractValue, formData.advanceReceived])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {}

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required'
    }
    if (!formData.customerId || formData.customerId === 0) {
      newErrors.customerId = 'Customer is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (formData.contractValue < 0) {
      newErrors.contractValue = 'Contract value must be positive'
    }
    if (formData.advanceReceived < 0) {
      newErrors.advanceReceived = 'Advance received must be positive'
    }
    if (formData.advanceReceived > formData.contractValue) {
      newErrors.advanceReceived = 'Advance cannot exceed contract value'
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

    if (project) {
      setLastAction('update')
      dispatch(updateProject({ id: project.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createProject(formData))
    }
  }

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const projectTypes: ProjectType[] = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Other']
  const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
  const contractors = employees.filter((e) => e.type === 'Contractor')

  return (
    <>
      <NotificationContainer />
      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Project Master</h3>
          <div className="form-group">
            <label htmlFor="projectName">Project Name <span className="required">*</span></label>
            <input
              type="text"
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              className={errors.projectName ? 'error' : ''}
            />
            {errors.projectName && <span className="error-message">{errors.projectName}</span>}
          </div>

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
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="error-message">{errors.customerId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type</label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => handleChange('projectType', e.target.value as ProjectType)}
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location <span className="required">*</span></label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date <span className="required">*</span></label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as ProjectStatus)}
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
          <h3>Financial</h3>
          <div className="form-group">
            <label htmlFor="contractValue">Contract Value <span className="required">*</span></label>
            <input
              type="number"
              id="contractValue"
              value={formData.contractValue}
              onChange={(e) => handleChange('contractValue', Number(e.target.value))}
              className={errors.contractValue ? 'error' : ''}
              min="0"
              step="0.01"
            />
            {errors.contractValue && <span className="error-message">{errors.contractValue}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="advanceReceived">Advance Received</label>
              <input
                type="number"
                id="advanceReceived"
                value={formData.advanceReceived}
                onChange={(e) => handleChange('advanceReceived', Number(e.target.value))}
                className={errors.advanceReceived ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.advanceReceived && <span className="error-message">{errors.advanceReceived}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="remainingAmount">Remaining Amount</label>
              <input
                type="number"
                id="remainingAmount"
                value={formData.remainingAmount}
                readOnly
                className="readonly"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <textarea
              id="paymentTerms"
              value={formData.paymentTerms || ''}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Control</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="projectManagerId">Project Manager</label>
              <select
                id="projectManagerId"
                value={formData.projectManagerId || ''}
                onChange={(e) => handleChange('projectManagerId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select Project Manager</option>
                {employees.filter((e) => e.type === 'Employee').map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contractorId">Contractor</label>
              <select
                id="contractorId"
                value={formData.contractorId || ''}
                onChange={(e) => handleChange('contractorId', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select Contractor</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </button>
          {project && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectProject(null))
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

