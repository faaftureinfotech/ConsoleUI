import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ExpenseType = 'Labour' | 'Material' | 'Transport' | 'Equipment' | 'Other'
export type PaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque'

export interface Expense {
  id: number
  expenseDate: string
  projectId: number
  projectName?: string
  expenseType: ExpenseType
  expenseCategory: string
  description: string
  amount: number
  paymentMode: PaymentMode
  billNumber?: string
  taxAmount: number
  totalAmount: number
  // Party reference - can be Employee/Contractor or Supplier
  partyType?: 'Employee' | 'Contractor' | 'Supplier'
  partyId?: number
  partyName?: string
}

export interface ExpenseFormData {
  expenseDate: string
  projectId: number
  expenseType: ExpenseType
  expenseCategory: string
  description: string
  amount: number
  paymentMode: PaymentMode
  billNumber?: string
  taxAmount: number
  totalAmount: number
  partyType?: 'Employee' | 'Contractor' | 'Supplier'
  partyId?: number
}

interface ExpenseState {
  list: Expense[]
  loading: boolean
  error: string | null
  selectedExpense: Expense | null
}

const initialState: ExpenseState = {
  list: [],
  loading: false,
  error: null,
  selectedExpense: null
}

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    fetchExpenses(state) {
      state.loading = true
      state.error = null
    },
    fetchExpensesSuccess(state, action: PayloadAction<Expense[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchExpensesFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createExpense(state, action: PayloadAction<ExpenseFormData>) {
      state.loading = true
      state.error = null
    },
    createExpenseSuccess(state, action: PayloadAction<Expense>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createExpenseFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateExpense(state, action: PayloadAction<{ id: number; data: ExpenseFormData }>) {
      state.loading = true
      state.error = null
    },
    updateExpenseSuccess(state, action: PayloadAction<Expense>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateExpenseFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteExpense(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteExpenseSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((e) => e.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteExpenseFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectExpense(state, action: PayloadAction<Expense | null>) {
      state.selectedExpense = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
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
  selectExpense,
  clearError
} = expenseSlice.actions

export default expenseSlice.reducer

