import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Customer {
  customerId: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  gstNumber?: string
  address?: string
  notes?: string
}

export interface CustomerFormData {
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  gstNumber?: string
  address?: string
  notes?: string
}

interface CustomerState {
  list: Customer[]
  loading: boolean
  error: string | null
  selectedCustomer: Customer | null
}

const initialState: CustomerState = {
  list: [],
  loading: false,
  error: null,
  selectedCustomer: null
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Fetch customers
    fetchCustomers(state) {
      state.loading = true
      state.error = null
    },
    fetchCustomersSuccess(state, action: PayloadAction<Customer[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchCustomersFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      // Ensure list remains an array even on failure
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },

    // Create customer
    createCustomer(state, action: PayloadAction<CustomerFormData>) {
      state.loading = true
      state.error = null
    },
    createCustomerSuccess(state, action: PayloadAction<Customer>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Update customer
    updateCustomer(state, action: PayloadAction<{ id: number; data: CustomerFormData }>) {
      state.loading = true
      state.error = null
    },
    updateCustomerSuccess(state, action: PayloadAction<Customer>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((c) => c.customerId === action.payload.customerId)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Delete customer
    deleteCustomer(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteCustomerSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((c) => c.customerId !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteCustomerFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Select customer for editing
    selectCustomer(state, action: PayloadAction<Customer | null>) {
      state.selectedCustomer = action.payload
    },

    // Clear error
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchCustomers,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  createCustomer,
  createCustomerSuccess,
  createCustomerFailure,
  updateCustomer,
  updateCustomerSuccess,
  updateCustomerFailure,
  deleteCustomer,
  deleteCustomerSuccess,
  deleteCustomerFailure,
  selectCustomer,
  clearError
} = customerSlice.actions

export default customerSlice.reducer

