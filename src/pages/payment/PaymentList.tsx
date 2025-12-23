import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchPayments,
  deletePayment,
  selectPayment,
  Payment
} from '../../store/slices/paymentSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './PaymentList.css'

export default function PaymentList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.payment)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Incoming' | 'Outgoing'>('All')
  const [filterParty, setFilterParty] = useState<'All' | string>('All')

  useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  const handleDelete = (paymentId: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      dispatch(deletePayment(paymentId))
      showNotification('success', 'Payment deleted successfully')
    }
  }

  const handleEdit = (payment: Payment) => {
    dispatch(selectPayment(payment))
  }

  const filteredPayments = (Array.isArray(list) ? list : []).filter((payment) => {
    const matchesSearch =
      payment.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.remarks?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'All' || payment.paymentType === filterType
    const matchesParty = filterParty === 'All' || payment.partyType === filterParty

    return matchesSearch && matchesType && matchesParty
  })

  const { sortedData, handleSort, getSortDirection } = useTableSort<Payment>(filteredPayments)

  const incomingTotal = filteredPayments
    .filter((p) => p.paymentType === 'Incoming')
    .reduce((sum, p) => sum + p.netPaidAmount, 0)
  const outgoingTotal = filteredPayments
    .filter((p) => p.paymentType === 'Outgoing')
    .reduce((sum, p) => sum + p.netPaidAmount, 0)
  const netTotal = incomingTotal - outgoingTotal

  return (
    <>
      <NotificationContainer />
      <div className="payment-list-container">
        <div className="payment-list-header">
          <h2>Payments</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            >
              <option value="All">All Types</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
            </select>
            <select
              className="filter-select"
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
            >
              <option value="All">All Parties</option>
              <option value="Customer">Customer</option>
              <option value="Employee">Employee</option>
              <option value="Contractor">Contractor</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading payments...</div>}

        {!loading && filteredPayments.length === 0 && (
          <div className="empty-state">
            {searchTerm || filterType !== 'All' || filterParty !== 'All'
              ? 'No payments found matching your search.'
              : 'No payments found.'}
          </div>
        )}

        {!loading && filteredPayments.length > 0 && (
          <>
            <div className="payment-summary">
              <div className="summary-item">
                <span className="summary-label">Incoming:</span>
                <span className="summary-value incoming">₹{incomingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Outgoing:</span>
                <span className="summary-value outgoing">₹{outgoingTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Net:</span>
                <span className={`summary-value ${netTotal >= 0 ? 'incoming' : 'outgoing'}`}>
                  ₹{netTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="payment-table-wrapper">
              <table className="payment-table">
                <thead>
                  <tr>
                    <th 
                      className={getSortClassName(getSortDirection, 'paymentDate')}
                      onClick={() => handleSort('paymentDate')}
                    >
                      Date
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'paymentType')}
                      onClick={() => handleSort('paymentType')}
                    >
                      Type
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'projectName')}
                      onClick={() => handleSort('projectName')}
                    >
                      Project
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'partyName')}
                      onClick={() => handleSort('partyName')}
                    >
                      Party
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'amount')}
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'netPaidAmount')}
                      onClick={() => handleSort('netPaidAmount')}
                    >
                      Net Paid
                    </th>
                    <th 
                      className={getSortClassName(getSortDirection, 'paymentMode')}
                      onClick={() => handleSort('paymentMode')}
                    >
                      Mode
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
                  {sortedData.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`type-badge type-${payment.paymentType.toLowerCase()}`}>
                          {payment.paymentType}
                        </span>
                      </td>
                      <td>{payment.projectName || '-'}</td>
                      <td>
                        <span className="party-info">
                          {payment.partyType}: {payment.partyName || '-'}
                        </span>
                      </td>
                      <td>₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="amount-cell">
                        ₹{payment.netPaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>{payment.paymentMode}</td>
                      <td>
                        <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(payment)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(payment.id)}
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
          </>
        )}
      </div>
    </>
  )
}

