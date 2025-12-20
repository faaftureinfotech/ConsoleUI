import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchExpenses,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  createExpense,
  createExpenseSuccess,
  createExpenseFailure,
  updateExpense,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpense,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  Expense,
  ExpenseFormData
} from '../slices/expenseSlice'

function* handleFetchExpenses() {
  try {
    const res: { data: Expense[] } = yield call(apiClient.get, '/expenses')
    const expenses = Array.isArray(res.data) ? res.data : []
    yield put(fetchExpensesSuccess(expenses))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch expenses'
    yield put(fetchExpensesFailure(errorMessage))
  }
}

function* handleCreateExpense(action: ReturnType<typeof createExpense>) {
  try {
    const res: { data: Expense } = yield call(apiClient.post, '/expenses', action.payload)
    yield put(createExpenseSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create expense'
    yield put(createExpenseFailure(errorMessage))
  }
}

function* handleUpdateExpense(action: ReturnType<typeof updateExpense>) {
  try {
    const res: { data: Expense } = yield call(
      apiClient.put,
      `/expenses/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateExpenseSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update expense'
    yield put(updateExpenseFailure(errorMessage))
  }
}

function* handleDeleteExpense(action: ReturnType<typeof deleteExpense>) {
  try {
    yield call(apiClient.delete, `/expenses/${action.payload}`)
    yield put(deleteExpenseSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete expense'
    yield put(deleteExpenseFailure(errorMessage))
  }
}

export default function* expenseSaga() {
  yield takeLatest(fetchExpenses.type, handleFetchExpenses)
  yield takeLatest(createExpense.type, handleCreateExpense)
  yield takeLatest(updateExpense.type, handleUpdateExpense)
  yield takeLatest(deleteExpense.type, handleDeleteExpense)
}

