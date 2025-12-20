import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectCustomer, clearError } from '../store/slices/customerSlice'
import CustomerList from './customer/CustomerList'
import CustomerForm from './customer/CustomerForm'
import ErrorDisplay from '../components/ErrorDisplay'
import './CustomersPage.css'

export default function CustomersPage() {
  const dispatch = useAppDispatch()
  const { selectedCustomer, error } = useAppSelector((s) => s.customer)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedCustomer) {
      setShowForm(true)
    }
  }, [selectedCustomer])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectCustomer(null))
  }

  const handleAddNew = () => {
    dispatch(selectCustomer(null))
    setShowForm(true)
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Customer
          </button>
        )}
      </div>

      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {showForm && (
        <div className="form-section">
          <CustomerForm customer={selectedCustomer} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <CustomerList />
        </div>
      )}
    </div>
  )
}
