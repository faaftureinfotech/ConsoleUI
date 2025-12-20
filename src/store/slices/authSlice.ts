import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
  captchaToken?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Development mode: Set to true to bypass authentication
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV

const initialState: AuthState = {
  user: DEV_MODE ? { id: 1, email: 'dev@example.com', name: 'Developer' } : null,
  token: localStorage.getItem('authToken') || (DEV_MODE ? 'dev-token' : null),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('authToken') || DEV_MODE
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    login(state, action: PayloadAction<LoginCredentials>) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      localStorage.setItem('authToken', action.payload.token)
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },

    // Register
    register(state, action: PayloadAction<RegisterData>) {
      state.loading = true
      state.error = null
    },
    registerSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      localStorage.setItem('authToken', action.payload.token)
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Forgot Password
    forgotPassword(state, action: PayloadAction<ForgotPasswordData>) {
      state.loading = true
      state.error = null
    },
    forgotPasswordSuccess(state) {
      state.loading = false
      state.error = null
    },
    forgotPasswordFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Reset Password
    resetPassword(state, action: PayloadAction<ResetPasswordData>) {
      state.loading = true
      state.error = null
    },
    resetPasswordSuccess(state) {
      state.loading = false
      state.error = null
    },
    resetPasswordFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },

    // Logout
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('authToken')
    },

    // Clear error
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  login,
  loginSuccess,
  loginFailure,
  register,
  registerSuccess,
  registerFailure,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
  logout,
  clearError
} = authSlice.actions

export default authSlice.reducer

