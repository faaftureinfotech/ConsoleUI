import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectEmployeeAllocation, clearError } from '../../store/slices/employeeAllocationSlice'
import EmployeeAllocationList from './EmployeeAllocationList'
import EmployeeAllocationForm from './EmployeeAllocationForm'
import ErrorDisplay from '../../components/ErrorDisplay'
import './EmployeeAllocationPage.css'

export default function EmployeeAllocationPage() {
  const dispatch = useAppDispatch()
  const { selectedAllocation, error } = useAppSelector((s) => s.employeeAllocation)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedAllocation) {
      setShowForm(true)
    }
  }, [selectedAllocation])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectEmployeeAllocation(null))
  }

  const handleAddNew = () => {
    dispatch(selectEmployeeAllocation(null))
    setShowForm(true)
  }

  return (
    <div className="employee-allocation-page">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      <div className="page-header">
        <h1>Employee/Contractor Allocation</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Allocation
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-section">
          <EmployeeAllocationForm allocation={selectedAllocation} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <EmployeeAllocationList />
        </div>
      )}
    </div>
  )
}

