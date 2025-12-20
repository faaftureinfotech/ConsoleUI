import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SupplierType = 'Material' | 'Equipment' | 'Service'
export type SupplierStatus = 'Active' | 'Inactive'

export interface Supplier {
  id: number
  supplierName: string
  contactPerson?: string
  mobileNumber: string
  email?: string
  address?: string
  city?: string
  state?: string
  gstNumber?: string
  panNumber?: string
  supplierType: SupplierType
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  upiId?: string
  openingBalance: number
  status: SupplierStatus
  notes?: string
}

export interface SupplierFormData {
  supplierName: string
  contactPerson?: string
  mobileNumber: string
  email?: string
  address?: string
  city?: string
  state?: string
  gstNumber?: string
  panNumber?: string
  supplierType: SupplierType
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  upiId?: string
  openingBalance: number
  status: SupplierStatus
  notes?: string
}

interface SupplierState {
  list: Supplier[]
  loading: boolean
  error: string | null
  selectedSupplier: Supplier | null
}

const initialState: SupplierState = {
  list: [],
  loading: false,
  error: null,
  selectedSupplier: null
}

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    fetchSuppliers(state) {
      state.loading = true
      state.error = null
    },
    fetchSuppliersSuccess(state, action: PayloadAction<Supplier[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchSuppliersFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createSupplier(state, action: PayloadAction<SupplierFormData>) {
      state.loading = true
      state.error = null
    },
    createSupplierSuccess(state, action: PayloadAction<Supplier>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createSupplierFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateSupplier(state, action: PayloadAction<{ id: number; data: SupplierFormData }>) {
      state.loading = true
      state.error = null
    },
    updateSupplierSuccess(state, action: PayloadAction<Supplier>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((s) => s.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateSupplierFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteSupplier(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteSupplierSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((s) => s.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteSupplierFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectSupplier(state, action: PayloadAction<Supplier | null>) {
      state.selectedSupplier = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchSuppliers,
  fetchSuppliersSuccess,
  fetchSuppliersFailure,
  createSupplier,
  createSupplierSuccess,
  createSupplierFailure,
  updateSupplier,
  updateSupplierSuccess,
  updateSupplierFailure,
  deleteSupplier,
  deleteSupplierSuccess,
  deleteSupplierFailure,
  selectSupplier,
  clearError
} = supplierSlice.actions

export default supplierSlice.reducer

