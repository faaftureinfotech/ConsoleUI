import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectEmployee, clearError } from '../store/slices/employeesSlice'
import EmployeeList from './employee/EmployeeList'
import EmployeeForm from './employee/EmployeeForm'
import ErrorDisplay from '../components/ErrorDisplay'
import './EmployeesPage.css'

export default function   () {
  const dispatch = useAppDispatch()
  const { selectedEmployee, error } = useAppSelector((s) => s.employees)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedEmployee) {
      setShowForm(true)
    }
  }, [selectedEmployee])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectEmployee(null))
  }

  const handleAddNew = () => {
    dispatch(selectEmployee(null))
    setShowForm(true)
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1>Employee / Contractor Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Employee/Contractor
          </button>
        )}
      </div>

      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {showForm && (
        <div className="form-section">
          <EmployeeForm employee={selectedEmployee} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <EmployeeList />
        </div>
      )}
    </div>
  )
}
