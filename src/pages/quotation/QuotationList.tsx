import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchQuotations,
  deleteQuotation,
  selectQuotation,
  updateQuotationStatus,
  Quotation
} from '../../store/slices/quotationSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
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

  const handleSend = (quotation: Quotation) => {
    if (window.confirm('Are you sure you want to send this quotation?')) {
      dispatch(updateQuotationStatus({ id: quotation.id, status: 'Sent' }))
      showNotification('success', 'Quotation sent successfully')
    }
  }

  const handlePrint = (quotation: Quotation) => {
    // Store quotation in sessionStorage for print page
    sessionStorage.setItem('printQuotation', JSON.stringify(quotation))
    const printWindow = window.open('/quotation/print', '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500)
      }
    }
  }

  const filteredQuotations = (Array.isArray(list) ? list : []).filter((quotation) => {
    const matchesSearch =
      quotation.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.projectName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'All' || quotation.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const { sortedData, handleSort, getSortDirection } = useTableSort<Quotation>(filteredQuotations)

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
                  <th 
                    className={getSortClassName(getSortDirection, 'quotationNumber')}
                    onClick={() => handleSort('quotationNumber')}
                  >
                    Quotation #
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'customerName')}
                    onClick={() => handleSort('customerName')}
                  >
                    Customer
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'projectName')}
                    onClick={() => handleSort('projectName')}
                  >
                    Project
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'quotationDate')}
                    onClick={() => handleSort('quotationDate')}
                  >
                    Date
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'validUntil')}
                    onClick={() => handleSort('validUntil')}
                  >
                    Valid Until
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'subTotal')}
                    onClick={() => handleSort('subTotal')}
                  >
                    Sub Total
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'taxAmount')}
                    onClick={() => handleSort('taxAmount')}
                  >
                    Tax
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'totalAmount')}
                    onClick={() => handleSort('totalAmount')}
                  >
                    Total
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'status')}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((quotation) => (
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
                        {quotation.status === 'Draft' && (
                          <button
                            className="btn btn-sm btn-send"
                            onClick={() => handleSend(quotation)}
                            title="Send Quotation"
                          >
                            Send
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-print"
                          onClick={() => handlePrint(quotation)}
                          title="Print Quotation"
                        >
                          Print
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

