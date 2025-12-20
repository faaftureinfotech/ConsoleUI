import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  Payment,
  PaymentFormData
} from '../slices/paymentSlice'

function* handleFetchPayments() {
  try {
    const res: { data: Payment[] } = yield call(apiClient.get, '/payments')
    const payments = Array.isArray(res.data) ? res.data : []
    yield put(fetchPaymentsSuccess(payments))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch payments'
    yield put(fetchPaymentsFailure(errorMessage))
  }
}

function* handleCreatePayment(action: ReturnType<typeof createPayment>) {
  try {
    const res: { data: Payment } = yield call(apiClient.post, '/payments', action.payload)
    yield put(createPaymentSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create payment'
    yield put(createPaymentFailure(errorMessage))
  }
}

function* handleUpdatePayment(action: ReturnType<typeof updatePayment>) {
  try {
    const res: { data: Payment } = yield call(
      apiClient.put,
      `/payments/${action.payload.id}`,
      action.payload.data
    )
    yield put(updatePaymentSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update payment'
    yield put(updatePaymentFailure(errorMessage))
  }
}

function* handleDeletePayment(action: ReturnType<typeof deletePayment>) {
  try {
    yield call(apiClient.delete, `/payments/${action.payload}`)
    yield put(deletePaymentSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete payment'
    yield put(deletePaymentFailure(errorMessage))
  }
}

export default function* paymentSaga() {
  yield takeLatest(fetchPayments.type, handleFetchPayments)
  yield takeLatest(createPayment.type, handleCreatePayment)
  yield takeLatest(updatePayment.type, handleUpdatePayment)
  yield takeLatest(deletePayment.type, handleDeletePayment)
}

