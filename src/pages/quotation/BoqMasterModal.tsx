import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchBoqMasters,
  createBoqMaster,
  updateBoqMaster,
  deleteBoqMaster,
  selectBoqMaster,
  clearError,
  BoqMaster,
  BoqMasterFormData
} from '../../store/slices/boqMasterSlice'
import { fetchUnits } from '../../store/slices/unitsSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import useNotification from '../../components/NotificationContainer'
import './BoqMasterModal.css'

interface BoqMasterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BoqMasterModal({ isOpen, onClose }: BoqMasterModalProps) {
  const dispatch = useAppDispatch()
  const { list: boqMasters, loading, error } = useAppSelector((s) => s.boqMaster)
  const { list: units } = useAppSelector((s) => s.units)
  const { list: categories } = useAppSelector((s) => s.categories)
  const { selectedBoqMaster } = useAppSelector((s) => s.boqMaster)
  const { showNotification, NotificationContainer } = useNotification()

  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [lastAction, setLastAction] = useState<'create' | 'update' | null>(null)

  const [formData, setFormData] = useState<BoqMasterFormData>({
    name: '',
    categoryId: 0,
    defaultUnitId: 0,
    defaultRate: 0,
    description: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BoqMasterFormData, string>>>({})

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchBoqMasters())
      dispatch(fetchUnits())
      dispatch(fetchCategories())
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (selectedBoqMaster) {
      setShowForm(true)
      setFormData({
        name: selectedBoqMaster.name || '',
        categoryId: selectedBoqMaster.categoryId || 0,
        defaultUnitId: selectedBoqMaster.defaultUnitId || 0,
        defaultRate: selectedBoqMaster.defaultRate || 0,
        description: selectedBoqMaster.description || ''
      })
    }
  }, [selectedBoqMaster])

  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'BOQ Master deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

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
        showNotification('success', 'BOQ Master created successfully')
        setShowForm(false)
        setFormData({
          name: '',
          categoryId: 0,
          defaultUnitId: 0,
          defaultRate: 0,
          description: ''
        })
        dispatch(selectBoqMaster(null))
      } else if (lastAction === 'update') {
        showNotification('success', 'BOQ Master updated successfully')
        setShowForm(false)
        setFormData({
          name: '',
          categoryId: 0,
          defaultUnitId: 0,
          defaultRate: 0,
          description: ''
        })
        dispatch(selectBoqMaster(null))
      }
      setLastAction(null)
    }
  }, [loading, lastAction, error, showNotification, dispatch])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this BOQ Master?')) {
      setDeletingId(id)
      dispatch(deleteBoqMaster(id))
    }
  }

  const handleEdit = (boqMaster: BoqMaster) => {
    dispatch(selectBoqMaster(boqMaster))
  }

  const handleAddNew = () => {
    dispatch(selectBoqMaster(null))
    setFormData({
      name: '',
      categoryId: 0,
      defaultUnitId: 0,
      defaultRate: 0,
      description: ''
    })
    setErrors({})
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    dispatch(selectBoqMaster(null))
    setFormData({
      name: '',
      categoryId: 0,
      defaultUnitId: 0,
      defaultRate: 0,
      description: ''
    })
    setErrors({})
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BoqMasterFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category is required'
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

    if (selectedBoqMaster) {
      setLastAction('update')
      dispatch(updateBoqMaster({ id: selectedBoqMaster.id, data: formData }))
    } else {
      setLastAction('create')
      dispatch(createBoqMaster(formData))
    }
  }

  const handleChange = (field: keyof BoqMasterFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    return unit ? unit.name : '-'
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : '-'
  }

  const filteredBoqMasters = boqMasters.filter((boqMaster) =>
    boqMaster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(boqMaster.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <>
      <NotificationContainer />
      <div className="boq-master-modal-overlay" onClick={onClose}>
        <div className="boq-master-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="boq-master-modal-header">
            <h2>BOQ Master Management</h2>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="boq-master-modal-body">
            {!showForm ? (
              <>
                <div className="boq-master-list-header">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search BOQ masters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddNew}>
                    + Add New BOQ Master
                  </button>
                </div>

                {loading && <div className="loading">Loading BOQ masters...</div>}

                {!loading && filteredBoqMasters.length === 0 && (
                  <div className="empty-state">
                    {searchTerm ? 'No BOQ masters found matching your search.' : 'No BOQ masters found.'}
                  </div>
                )}

                {!loading && filteredBoqMasters.length > 0 && (
                  <div className="table-wrapper">
                    <table className="boq-master-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Unit</th>
                          <th>Default Rate</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBoqMasters.map((boqMaster) => (
                          <tr key={boqMaster.id}>
                            <td>{boqMaster.id}</td>
                            <td>{boqMaster.name}</td>
                            <td>{getCategoryName(boqMaster.categoryId)}</td>
                            <td>{getUnitName(boqMaster.defaultUnitId)}</td>
                            <td>₹{boqMaster.defaultRate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>{boqMaster.description || '-'}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-edit"
                                  onClick={() => handleEdit(boqMaster)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-delete"
                                  onClick={() => handleDelete(boqMaster.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <form className="boq-master-form" onSubmit={handleSubmit}>
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
                    placeholder="Enter BOQ master name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="categoryId">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                      className={errors.categoryId ? 'error' : ''}
                    >
                      <option value={0}>Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
                  </div>

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

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : selectedBoqMaster ? 'Update BOQ Master' : 'Create BOQ Master'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

