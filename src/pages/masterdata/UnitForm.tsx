import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createUnit,
  updateUnit,
  selectUnit,
  UnitFormData,
  Unit
} from '../../store/slices/unitsSlice'
import useNotification from '../../components/NotificationContainer'
import './MasterDataForm.css'

interface UnitFormProps {
  unit?: Unit | null
  onSuccess?: () => void
}

export default function UnitForm({ unit, onSuccess }: UnitFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.units)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<UnitFormData>({
    name: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof UnitFormData, string>>>({})
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name || ''
      })
    } else {
      setFormData({
        name: ''
      })
    }
    setErrors({})
  }, [unit])

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
        showNotification('success', 'Unit created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Unit updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UnitFormData, string>> = {}

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

    if (unit) {
      setLastAction('update')
      dispatch(updateUnit({ id: unit.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createUnit(formData))
    }
  }

  const handleChange = (field: keyof UnitFormData, value: string) => {
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
            placeholder="Enter unit name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : unit ? 'Update Unit' : 'Create Unit'}
          </button>
          {unit && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectUnit(null))
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

