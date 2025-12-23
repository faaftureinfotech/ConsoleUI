import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchCustomers,
  deleteCustomer,
  selectCustomer,
  Customer
} from '../../store/slices/customerSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './CustomerList.css'

export default function CustomerList() {
  const dispatch = useAppDispatch()
  const customerState = useAppSelector((s) => s.customer)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Ensure list is always an array
  const list = Array.isArray(customerState?.list) ? customerState.list : []
  const loading = customerState?.loading ?? false
  const error = customerState?.error ?? null

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  // Handle delete success/error
  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'Customer deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

  const handleDelete = (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setDeletingId(customerId)
      dispatch(deleteCustomer(customerId))
    }
  }

  const handleEdit = (customer: Customer) => {
    dispatch(selectCustomer(customer))
  }

  const filteredCustomers = (Array.isArray(list) ? list : []).filter((customer) =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Customer>(filteredCustomers)

  return (
    <>
      <NotificationContainer />
      <div className="customer-list-container">
        <div className="customer-list-header">
          <h2>Customers</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading customers...</div>}

        {!loading && filteredCustomers.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
          </div>
        )}

        {!loading && filteredCustomers.length > 0 && (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'firstName')}
                    onClick={() => handleSort('firstName')}
                  >
                    First Name
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'lastName')}
                    onClick={() => handleSort('lastName')}
                  >
                    Last Name
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'contactPerson')}
                    onClick={() => handleSort('contactPerson')}
                  >
                    Contact Person
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'phone')}
                    onClick={() => handleSort('phone')}
                  >
                    Phone
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'email')}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'gstNumber')}
                    onClick={() => handleSort('gstNumber')}
                  >
                    GST Number
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((customer) => (
                  <tr key={customer.customerId}>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.contactPerson || '-'}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.email || '-'}</td>
                    <td>{customer.gstNumber || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(customer)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(customer.customerId)}
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
