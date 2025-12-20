import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchSuppliers,
  deleteSupplier,
  selectSupplier,
  Supplier
} from '../../store/slices/supplierSlice'
import useNotification from '../../components/NotificationContainer'
import './SupplierList.css'

export default function SupplierList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.supplier)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchSuppliers())
  }, [dispatch])

  const handleDelete = (supplierId: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      dispatch(deleteSupplier(supplierId))
      showNotification('success', 'Supplier deleted successfully')
    }
  }

  const handleEdit = (supplier: Supplier) => {
    dispatch(selectSupplier(supplier))
  }

  const filteredSuppliers = (Array.isArray(list) ? list : []).filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.mobileNumber?.includes(searchTerm) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <NotificationContainer />
      <div className="supplier-list-container">
        <div className="supplier-list-header">
          <h2>Suppliers</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading suppliers...</div>}

        {!loading && filteredSuppliers.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No suppliers found matching your search.' : 'No suppliers found.'}
          </div>
        )}

        {!loading && filteredSuppliers.length > 0 && (
          <div className="supplier-table-wrapper">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Contact Person</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>GST Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.supplierName}</td>
                    <td>{supplier.contactPerson || '-'}</td>
                    <td>{supplier.mobileNumber}</td>
                    <td>{supplier.email || '-'}</td>
                    <td>
                      <span className={`type-badge type-${supplier.supplierType.toLowerCase()}`}>
                        {supplier.supplierType}
                      </span>
                    </td>
                    <td>{supplier.gstNumber || '-'}</td>
                    <td>
                      <span className={`status-badge status-${supplier.status.toLowerCase()}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(supplier)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(supplier.id)}
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
      </div>
    </>
  )
}

