import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  User
} from '../slices/authSlice'

function* handleLogin(action: ReturnType<typeof login>) {
  try {
    const res: { data: { user: User; token: string } } = yield call(
      apiClient.post,
      '/auth/login',
      action.payload
    )
    yield put(loginSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Login failed'
    yield put(loginFailure(errorMessage))
  }
}

function* handleRegister(action: ReturnType<typeof register>) {
  try {
    const { confirmPassword, ...registerData } = action.payload
    const res: { data: { user: User; token: string } } = yield call(
      apiClient.post,
      '/auth/register',
      registerData
    )
    yield put(registerSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Registration failed'
    yield put(registerFailure(errorMessage))
  }
}

function* handleForgotPassword(action: ReturnType<typeof forgotPassword>) {
  try {
    yield call(apiClient.post, '/auth/forgot-password', action.payload)
    yield put(forgotPasswordSuccess())
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to send reset email'
    yield put(forgotPasswordFailure(errorMessage))
  }
}

function* handleResetPassword(action: ReturnType<typeof resetPassword>) {
  try {
    const { confirmPassword, ...resetData } = action.payload
    yield call(apiClient.post, '/auth/reset-password', resetData)
    yield put(resetPasswordSuccess())
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to reset password'
    yield put(resetPasswordFailure(errorMessage))
  }
}

export default function* authSaga() {
  yield takeLatest(login.type, handleLogin)
  yield takeLatest(register.type, handleRegister)
  yield takeLatest(forgotPassword.type, handleForgotPassword)
  yield takeLatest(resetPassword.type, handleResetPassword)
}

