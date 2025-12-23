import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createUser,
  updateUser,
  selectUser,
  UserFormData,
  User
} from '../../store/slices/userSlice'
import { fetchRoles } from '../../store/slices/rolesSlice'
import useNotification from '../../components/NotificationContainer'
import './UserForm.css'

interface UserFormProps {
  user?: User | null
  onSuccess?: () => void
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.user)
  const { list: roles } = useAppSelector((s) => s.roles)
  const { showNotification, NotificationContainer } = useNotification()
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    roleId: undefined,
    isActive: true
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        roleId: user.roleId,
        isActive: user.isActive !== undefined ? user.isActive : true
      })
    } else {
      setFormData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        roleId: undefined,
        isActive: true
      })
    }
    setErrors({})
  }, [user])

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
        showNotification('success', 'User created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'User updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
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

    if (user) {
      setLastAction('update')
      dispatch(updateUser({ id: user.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createUser(formData))
    }
  }

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <>
      <NotificationContainer />
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>User Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">
                Username <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={errors.username ? 'error' : ''}
                placeholder="Enter username"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roleId">Role</label>
              <select
                id="roleId"
                value={formData.roleId || ''}
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
              <label htmlFor="isActive">Status</label>
              <select
                id="isActive"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => handleChange('isActive', e.target.value === 'true')}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </button>
          {user && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectUser(null))
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

