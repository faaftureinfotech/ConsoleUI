import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectMaterial, clearError } from '../../store/slices/materialsSlice'
import MaterialsList from './MaterialsList'
import MaterialForm from './MaterialForm'
import ErrorDisplay from '../../components/ErrorDisplay'

export default function MaterialsTab() {
  const dispatch = useAppDispatch()
  const { selectedMaterial, error } = useAppSelector((s) => s.materials)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedMaterial) {
      setShowForm(true)
    }
  }, [selectedMaterial])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectMaterial(null))
  }

  const handleAddNew = () => {
    dispatch(selectMaterial(null))
    setShowForm(true)
  }

  return (
    <div className="materials-tab">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {!showForm && (
        <div className="tab-header">
          <h2>Materials</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Material
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <MaterialForm material={selectedMaterial} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <MaterialsList />
        </div>
      )}
    </div>
  )
}

