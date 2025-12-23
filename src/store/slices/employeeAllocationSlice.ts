import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AllocationType = 'Full Day' | 'Half Day'

export interface EmployeeAllocation {
  id: number
  employeeId: number
  employeeName?: string
  employeeType?: 'Employee' | 'Contractor'
  projectId?: number
  projectName?: string
  allocationDate: string
  allocationType: AllocationType
  notes?: string
}

export interface EmployeeAllocationFormData {
  employeeId: number
  projectId?: number
  allocationDate: string
  allocationType: AllocationType
  notes?: string
}

interface EmployeeAllocationState {
  list: EmployeeAllocation[]
  loading: boolean
  error: string | null
  selectedAllocation: EmployeeAllocation | null
}

const initialState: EmployeeAllocationState = {
  list: [],
  loading: false,
  error: null,
  selectedAllocation: null
}

const employeeAllocationSlice = createSlice({
  name: 'employeeAllocation',
  initialState,
  reducers: {
    fetchEmployeeAllocations(state) {
      state.loading = true
      state.error = null
    },
    fetchEmployeeAllocationsSuccess(state, action: PayloadAction<EmployeeAllocation[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchEmployeeAllocationsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createEmployeeAllocation(state, action: PayloadAction<EmployeeAllocationFormData>) {
      state.loading = true
      state.error = null
    },
    createEmployeeAllocationSuccess(state, action: PayloadAction<EmployeeAllocation>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createEmployeeAllocationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateEmployeeAllocation(state, action: PayloadAction<{ id: number; data: EmployeeAllocationFormData }>) {
      state.loading = true
      state.error = null
    },
    updateEmployeeAllocationSuccess(state, action: PayloadAction<EmployeeAllocation>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((a) => a.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateEmployeeAllocationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteEmployeeAllocation(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteEmployeeAllocationSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((a) => a.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteEmployeeAllocationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectEmployeeAllocation(state, action: PayloadAction<EmployeeAllocation | null>) {
      state.selectedAllocation = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchEmployeeAllocations,
  fetchEmployeeAllocationsSuccess,
  fetchEmployeeAllocationsFailure,
  createEmployeeAllocation,
  createEmployeeAllocationSuccess,
  createEmployeeAllocationFailure,
  updateEmployeeAllocation,
  updateEmployeeAllocationSuccess,
  updateEmployeeAllocationFailure,
  deleteEmployeeAllocation,
  deleteEmployeeAllocationSuccess,
  deleteEmployeeAllocationFailure,
  selectEmployeeAllocation,
  clearError
} = employeeAllocationSlice.actions

export default employeeAllocationSlice.reducer

