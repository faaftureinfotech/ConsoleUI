import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EmployeeType = 'Employee' | 'Contractor'
export type EmployeeStatus = 'Active' | 'Inactive'
export type SalaryType = 'Daily' | 'Weekly' | 'Monthly' | 'Contract'

export interface Employee {
  id: number
  type: EmployeeType
  fullName: string
  mobileNumber: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  designation?: string
  department?: string
  projectId?: number
  joiningDate?: string
  status: EmployeeStatus
  salaryType?: SalaryType
  ratePerDay?: number
  monthlySalary?: number
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  upiId?: string
  aadharNumber?: string
  panNumber?: string
  contractStartDate?: string
  contractEndDate?: string
}

export interface EmployeeFormData {
  type: EmployeeType
  fullName: string
  mobileNumber: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  designation?: string
  department?: string
  projectId?: number
  joiningDate?: string
  status: EmployeeStatus
  salaryType?: SalaryType
  ratePerDay?: number
  monthlySalary?: number
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  upiId?: string
  aadharNumber?: string
  panNumber?: string
  contractStartDate?: string
  contractEndDate?: string
}

interface EmployeesState {
  list: Employee[]
  loading: boolean
  error: string | null
  selectedEmployee: Employee | null
}

const initialState: EmployeesState = {
  list: [],
  loading: false,
  error: null,
  selectedEmployee: null
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // Fetch employees
    fetchEmployees(state) {
      state.loading = true
      state.error = null
    },
    fetchEmployeesSuccess(state, action: PayloadAction<Employee[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },

    // Create employee
    createEmployee(state, action: PayloadAction<EmployeeFormData>) {
      state.loading = true
      state.error = null
    },
    createEmployeeSuccess(state, action: PayloadAction<Employee>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Update employee
    updateEmployee(state, action: PayloadAction<{ id: number; data: EmployeeFormData }>) {
      state.loading = true
      state.error = null
    },
    updateEmployeeSuccess(state, action: PayloadAction<Employee>) {
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
    updateEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Delete employee
    deleteEmployee(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteEmployeeSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((e) => e.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteEmployeeFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Select employee for editing
    selectEmployee(state, action: PayloadAction<Employee | null>) {
      state.selectedEmployee = action.payload
    },

    // Clear error
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchEmployees,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  createEmployee,
  createEmployeeSuccess,
  createEmployeeFailure,
  updateEmployee,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployee,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  selectEmployee,
  clearError
} = employeesSlice.actions

export default employeesSlice.reducer
