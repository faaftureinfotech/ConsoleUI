import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createRole,
  updateRole,
  selectRole,
  RoleFormData,
  Role
} from '../../store/slices/rolesSlice'
import useNotification from '../../components/NotificationContainer'
import './MasterDataForm.css'

interface RoleFormProps {
  role?: Role | null
  onSuccess?: () => void
}

export default function RoleForm({ role, onSuccess }: RoleFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.roles)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    status: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RoleFormData, string>>>({})
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        status: role.status || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: ''
      })
    }
    setErrors({})
  }, [role])

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
        showNotification('success', 'Role created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Role updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
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

    if (role) {
      setLastAction('update')
      dispatch(updateRole({ id: role.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createRole(formData))
    }
  }

  const handleChange = (field: keyof RoleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <NotificationContainer />
      <form className="master-data-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'error' : ''}
            placeholder="Enter role name (e.g., PM, Supervisor, Employee, Admin)"
            maxLength={100}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className={errors.description ? 'error' : ''}
            placeholder="Enter role description"
            rows={3}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            value={formData.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className={errors.status ? 'error' : ''}
            placeholder="Enter status (e.g., Active, Inactive)"
            maxLength={20}
          />
          {errors.status && <span className="error-message">{errors.status}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
          </button>
          {role && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectRole(null))
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

