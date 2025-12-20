import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchQuotations,
  deleteQuotation,
  selectQuotation,
  Quotation
} from '../../store/slices/quotationSlice'
import useNotification from '../../components/NotificationContainer'
import './QuotationList.css'

export default function QuotationList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.quotation)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | Quotation['status']>('All')

  useEffect(() => {
    dispatch(fetchQuotations())
  }, [dispatch])

  const handleDelete = (quotationId: number) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      dispatch(deleteQuotation(quotationId))
      showNotification('success', 'Quotation deleted successfully')
    }
  }

  const handleEdit = (quotation: Quotation) => {
    dispatch(selectQuotation(quotation))
  }

  const filteredQuotations = (Array.isArray(list) ? list : []).filter((quotation) => {
    const matchesSearch =
      quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.projectName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || quotation.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <>
      <NotificationContainer />
      <div className="quotation-list-container">
        <div className="quotation-list-header">
          <h2>Quotations</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading quotations...</div>}

        {!loading && filteredQuotations.length === 0 && (
          <div className="empty-state">
            {searchTerm || filterStatus !== 'All'
              ? 'No quotations found matching your search.'
              : 'No quotations found.'}
          </div>
        )}

        {!loading && filteredQuotations.length > 0 && (
          <div className="quotation-table-wrapper">
            <table className="quotation-table">
              <thead>
                <tr>
                  <th>Quotation #</th>
                  <th>Customer</th>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Valid Until</th>
                  <th>Sub Total</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quotation) => (
                  <tr key={quotation.id}>
                    <td className="quotation-number">{quotation.quotationNumber || `#${quotation.id}`}</td>
                    <td>{quotation.customerName || '-'}</td>
                    <td>{quotation.projectName || '-'}</td>
                    <td>{new Date(quotation.quotationDate).toLocaleDateString()}</td>
                    <td>{new Date(quotation.validUntil).toLocaleDateString()}</td>
                    <td>₹{quotation.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>₹{quotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="amount-cell">
                      ₹{quotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`status-badge status-${quotation.status.toLowerCase()}`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(quotation)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(quotation.id)}
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

