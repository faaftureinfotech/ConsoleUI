import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createCategory,
  updateCategory,
  selectCategory,
  CategoryFormData,
  Category
} from '../../store/slices/categoriesSlice'
import useNotification from '../../components/NotificationContainer'
import './MasterDataForm.css'

interface CategoryFormProps {
  category?: Category | null
  onSuccess?: () => void
}

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.categories)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState<CategoryFormData>({
    name: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || ''
      })
    } else {
      setFormData({
        name: ''
      })
    }
    setErrors({})
  }, [category])

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
        showNotification('success', 'Category created successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      } else if (lastAction === 'update') {
        showNotification('success', 'Category updated successfully')
        if (onSuccess) {
          setTimeout(() => onSuccess(), 500)
        }
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, onSuccess, showNotification])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {}

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

    if (category) {
      setLastAction('update')
      dispatch(updateCategory({ id: category.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createCategory(formData))
    }
  }

  const handleChange = (field: keyof CategoryFormData, value: string) => {
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
            placeholder="Enter category name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
          </button>
          {category && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                dispatch(selectCategory(null))
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

