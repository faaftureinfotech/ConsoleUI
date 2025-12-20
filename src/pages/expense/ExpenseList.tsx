import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchExpenses,
  deleteExpense,
  selectExpense,
  Expense
} from '../../store/slices/expenseSlice'
import useNotification from '../../components/NotificationContainer'
import './ExpenseList.css'

export default function ExpenseList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.expense)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProject, setFilterProject] = useState<number | 'all'>('all')

  useEffect(() => {
    dispatch(fetchExpenses())
  }, [dispatch])

  const handleDelete = (expenseId: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(expenseId))
      showNotification('success', 'Expense deleted successfully')
    }
  }

  const handleEdit = (expense: Expense) => {
    dispatch(selectExpense(expense))
  }

  const filteredExpenses = (Array.isArray(list) ? list : []).filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.expenseCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.billNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProject = filterProject === 'all' || expense.projectId === filterProject

    return matchesSearch && matchesProject
  })

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.totalAmount, 0)

  return (
    <>
      <NotificationContainer />
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h2>Expenses</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {loading && <div className="loading">Loading expenses...</div>}

        {!loading && filteredExpenses.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No expenses found matching your search.' : 'No expenses found.'}
          </div>
        )}

        {!loading && filteredExpenses.length > 0 && (
          <>
            <div className="expense-summary">
              <div className="summary-item">
                <span className="summary-label">Total Expenses:</span>
                <span className="summary-value">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="expense-table-wrapper">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Party</th>
                    <th>Amount</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                      <td>{expense.projectName || '-'}</td>
                      <td>
                        <span className={`type-badge type-${expense.expenseType.toLowerCase()}`}>
                          {expense.expenseType}
                        </span>
                      </td>
                      <td>{expense.expenseCategory}</td>
                      <td className="description-cell">{expense.description}</td>
                      <td>
                        {expense.partyName ? (
                          <span className="party-info">
                            {expense.partyType}: {expense.partyName}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="amount-cell">
                        ₹{expense.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-edit"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-delete"
                            onClick={() => handleDelete(expense.id)}
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

