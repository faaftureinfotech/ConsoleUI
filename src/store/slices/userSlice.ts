import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  roleId?: number
  roleName?: string
  isActive: boolean
  createdAt: string
}

export interface UserFormData {
  username: string
  email: string
  firstName?: string
  lastName?: string
  roleId?: number
  isActive: boolean
}

interface UserState {
  list: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
}

const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
  selectedUser: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUsers(state) {
      state.loading = true
      state.error = null
    },
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createUser(state, action: PayloadAction<UserFormData>) {
      state.loading = true
      state.error = null
    },
    createUserSuccess(state, action: PayloadAction<User>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateUser(state, action: PayloadAction<{ id: number; data: UserFormData }>) {
      state.loading = true
      state.error = null
    },
    updateUserSuccess(state, action: PayloadAction<User>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteUserSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((u) => u.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  selectUser,
  clearError
} = userSlice.actions

export default userSlice.reducer

