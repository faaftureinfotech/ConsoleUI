import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Role {
  id: number
  name: string
  description?: string
  status?: string
}

export interface RoleFormData {
  name: string
  description?: string
  status?: string
}

interface RolesState {
  list: Role[]
  loading: boolean
  error: string | null
  selectedRole: Role | null
}

const initialState: RolesState = {
  list: [],
  loading: false,
  error: null,
  selectedRole: null
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    fetchRoles(state) {
      state.loading = true
      state.error = null
    },
    fetchRolesSuccess(state, action: PayloadAction<Role[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchRolesFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createRole(state, action: PayloadAction<RoleFormData>) {
      state.loading = true
      state.error = null
    },
    createRoleSuccess(state, action: PayloadAction<Role>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createRoleFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateRole(state, action: PayloadAction<{ id: number; data: RoleFormData }>) {
      state.loading = true
      state.error = null
    },
    updateRoleSuccess(state, action: PayloadAction<Role>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateRoleFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteRole(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteRoleSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((r) => r.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteRoleFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectRole(state, action: PayloadAction<Role | null>) {
      state.selectedRole = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchRoles,
  fetchRolesSuccess,
  fetchRolesFailure,
  createRole,
  createRoleSuccess,
  createRoleFailure,
  updateRole,
  updateRoleSuccess,
  updateRoleFailure,
  deleteRole,
  deleteRoleSuccess,
  deleteRoleFailure,
  selectRole,
  clearError
} = rolesSlice.actions

export default rolesSlice.reducer

