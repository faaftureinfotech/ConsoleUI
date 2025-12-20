import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectSupplier, fetchSuppliers } from '../store/slices/supplierSlice'
import SupplierList from './supplier/SupplierList'
import SupplierForm from './supplier/SupplierForm'
import './SuppliersPage.css'

export default function SuppliersPage() {
  const dispatch = useAppDispatch()
  const { selectedSupplier } = useAppSelector((s) => s.supplier)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedSupplier) {
      setShowForm(true)
    }
  }, [selectedSupplier])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectSupplier(null))
    // Refetch suppliers to ensure list is up to date
    dispatch(fetchSuppliers())
  }

  const handleAddNew = () => {
    dispatch(selectSupplier(null))
    setShowForm(true)
  }

  return (
    <div className="suppliers-page">
      <div className="page-header">
        <h1>Supplier Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Supplier
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-section">
          <SupplierForm supplier={selectedSupplier} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <SupplierList />
        </div>
      )}
    </div>
  )
}

