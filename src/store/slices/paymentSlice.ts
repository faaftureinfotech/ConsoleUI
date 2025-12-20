import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PaymentType = 'Incoming' | 'Outgoing'
export type PaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque'
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed'
export type PartyType = 'Customer' | 'Employee' | 'Contractor' | 'Supplier'

export interface Payment {
  id: number
  paymentDate: string
  projectId: number
  projectName?: string
  paymentType: PaymentType
  amount: number
  paymentMode: PaymentMode
  referenceNumber?: string
  remarks?: string
  status: PaymentStatus
  partyType: PartyType
  partyId: number
  partyName?: string
  taxDeducted?: number
  tdsAmount?: number
  netPaidAmount: number
}

export interface PaymentFormData {
  paymentDate: string
  projectId: number
  paymentType: PaymentType
  amount: number
  paymentMode: PaymentMode
  referenceNumber?: string
  remarks?: string
  status: PaymentStatus
  partyType: PartyType
  partyId: number
  taxDeducted?: number
  tdsAmount?: number
  netPaidAmount: number
}

interface PaymentState {
  list: Payment[]
  loading: boolean
  error: string | null
  selectedPayment: Payment | null
}

const initialState: PaymentState = {
  list: [],
  loading: false,
  error: null,
  selectedPayment: null
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    fetchPayments(state) {
      state.loading = true
      state.error = null
    },
    fetchPaymentsSuccess(state, action: PayloadAction<Payment[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchPaymentsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createPayment(state, action: PayloadAction<PaymentFormData>) {
      state.loading = true
      state.error = null
    },
    createPaymentSuccess(state, action: PayloadAction<Payment>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createPaymentFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updatePayment(state, action: PayloadAction<{ id: number; data: PaymentFormData }>) {
      state.loading = true
      state.error = null
    },
    updatePaymentSuccess(state, action: PayloadAction<Payment>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updatePaymentFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deletePayment(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deletePaymentSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((p) => p.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deletePaymentFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectPayment(state, action: PayloadAction<Payment | null>) {
      state.selectedPayment = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchPayments,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  createPayment,
  createPaymentSuccess,
  createPaymentFailure,
  updatePayment,
  updatePaymentSuccess,
  updatePaymentFailure,
  deletePayment,
  deletePaymentSuccess,
  deletePaymentFailure,
  selectPayment,
  clearError
} = paymentSlice.actions

export default paymentSlice.reducer

