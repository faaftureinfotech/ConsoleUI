import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectExpense } from '../store/slices/expenseSlice'
import ExpenseList from './expense/ExpenseList'
import ExpenseForm from './expense/ExpenseForm'
import './ExpensesPage.css'

export default function ExpensesPage() {
  const dispatch = useAppDispatch()
  const { selectedExpense } = useAppSelector((s) => s.expense)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedExpense) {
      setShowForm(true)
    }
  }, [selectedExpense])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectExpense(null))
  }

  const handleAddNew = () => {
    dispatch(selectExpense(null))
    setShowForm(true)
  }

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Expense Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Expense
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-section">
          <ExpenseForm expense={selectedExpense} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <ExpenseList />
        </div>
      )}
    </div>
  )
}

