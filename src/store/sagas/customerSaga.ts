import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  Customer,
  CustomerFormData
} from '../slices/customerSlice'

function* handleFetchCustomers() {
  try {
    const res: { data: Customer[] } = yield call(apiClient.get, '/customers')
    // Ensure we always have an array
    const customers = Array.isArray(res.data) ? res.data : []
    yield put(fetchCustomersSuccess(customers))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch customers'
    yield put(fetchCustomersFailure(errorMessage))
  }
}

function* handleCreateCustomer(action: ReturnType<typeof createCustomer>) {
  try {
    const res: { data: Customer } = yield call(apiClient.post, '/customers', action.payload)
    yield put(createCustomerSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create customer'
    yield put(createCustomerFailure(errorMessage))
  }
}

function* handleUpdateCustomer(action: ReturnType<typeof updateCustomer>) {
  try {
    const res: { data: Customer } = yield call(
      apiClient.put,
      `/customers/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateCustomerSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update customer'
    yield put(updateCustomerFailure(errorMessage))
  }
}

function* handleDeleteCustomer(action: ReturnType<typeof deleteCustomer>) {
  try {
    yield call(apiClient.delete, `/customers/${action.payload}`)
    yield put(deleteCustomerSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete customer'
    yield put(deleteCustomerFailure(errorMessage))
  }
}

export default function* customerSaga() {
  yield takeLatest(fetchCustomers.type, handleFetchCustomers)
  yield takeLatest(createCustomer.type, handleCreateCustomer)
  yield takeLatest(updateCustomer.type, handleUpdateCustomer)
  yield takeLatest(deleteCustomer.type, handleDeleteCustomer)
}

