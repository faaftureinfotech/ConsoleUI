import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createMaterial,
  updateMaterial,
  selectMaterial,
  MaterialFormData,
  Material
} from '../../store/slices/materialsSlice'
import { fetchUnits } from '../../store/slices/unitsSlice'
import useNotification from '../../components/NotificationContainer'
import './MasterDataForm.css'

interface MaterialFormProps {
  material?: Material | null
  onSuccess?: () => void
}

export default function MaterialForm({ material, onSuccess }: MaterialFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.materials)
  const { list: units } = useAppSelector((s) => s.units)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<MaterialFormData>({
    name: '',
    defaultUnitId: 0,
    defaultRate: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof MaterialFormData, string>>>({})
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  useEffect(() => {
    dispatch(fetchUnits())
  }, [dispatch])

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || '',
        defaultUnitId: material.defaultUnitId || 0,
        defaultRate: material.defaultRate || 0
      })
    } else {
      setFormData({
        name: '',
        defaultUnitId: 0,
        defaultRate: 0
      })
    }
    setErrors({})
  }, [material])

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
        showNotification('success', 'Material created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Material updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MaterialFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.defaultUnitId || formData.defaultUnitId === 0) {
      newErrors.defaultUnitId = 'Default unit is required'
    }

    if (formData.defaultRate < 0) {
      newErrors.defaultRate = 'Default rate must be greater than or equal to 0'
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

    if (material) {
      setLastAction('update')
      dispatch(updateMaterial({ id: material.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createMaterial(formData))
    }
  }

  const handleChange = (field: keyof MaterialFormData, value: string | number) => {
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
            placeholder="Enter material name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="defaultUnitId">
              Default Unit <span className="required">*</span>
            </label>
            <select
              id="defaultUnitId"
              value={formData.defaultUnitId}
              onChange={(e) => handleChange('defaultUnitId', Number(e.target.value))}
              className={errors.defaultUnitId ? 'error' : ''}
            >
              <option value={0}>Select Unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            {errors.defaultUnitId && <span className="error-message">{errors.defaultUnitId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="defaultRate">
              Default Rate <span className="required">*</span>
            </label>
            <input
              type="number"
              id="defaultRate"
              value={formData.defaultRate}
              onChange={(e) => handleChange('defaultRate', Number(e.target.value))}
              className={errors.defaultRate ? 'error' : ''}
              placeholder="Enter default rate"
              min="0"
              step="0.01"
            />
            {errors.defaultRate && <span className="error-message">{errors.defaultRate}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : material ? 'Update Material' : 'Create Material'}
          </button>
          {material && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectMaterial(null))
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

