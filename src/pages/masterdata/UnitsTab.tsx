import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectUnit, clearError } from '../../store/slices/unitsSlice'
import UnitsList from './UnitsList'
import UnitForm from './UnitForm'
import ErrorDisplay from '../../components/ErrorDisplay'

export default function UnitsTab() {
  const dispatch = useAppDispatch()
  const { selectedUnit, error } = useAppSelector((s) => s.units)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedUnit) {
      setShowForm(true)
    }
  }, [selectedUnit])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectUnit(null))
  }

  const handleAddNew = () => {
    dispatch(selectUnit(null))
    setShowForm(true)
  }

  return (
    <div className="units-tab">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {!showForm && (
        <div className="tab-header">
          <h2>Units</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Unit
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <UnitForm unit={selectedUnit} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <UnitsList />
        </div>
      )}
    </div>
  )
}

