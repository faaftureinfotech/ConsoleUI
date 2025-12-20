import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  Supplier,
  SupplierFormData
} from '../slices/supplierSlice'

function* handleFetchSuppliers() {
  try {
    const res: { data: Supplier[] } = yield call(apiClient.get, '/suppliers')
    const suppliers = Array.isArray(res.data) ? res.data : []
    yield put(fetchSuppliersSuccess(suppliers))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch suppliers'
    yield put(fetchSuppliersFailure(errorMessage))
  }
}

function* handleCreateSupplier(action: ReturnType<typeof createSupplier>) {
  try {
    const res: { data: Supplier } = yield call(apiClient.post, '/suppliers', action.payload)
    yield put(createSupplierSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create supplier'
    yield put(createSupplierFailure(errorMessage))
  }
}

function* handleUpdateSupplier(action: ReturnType<typeof updateSupplier>) {
  try {
    const res: { data: Supplier } = yield call(
      apiClient.put,
      `/suppliers/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateSupplierSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update supplier'
    yield put(updateSupplierFailure(errorMessage))
  }
}

function* handleDeleteSupplier(action: ReturnType<typeof deleteSupplier>) {
  try {
    yield call(apiClient.delete, `/suppliers/${action.payload}`)
    yield put(deleteSupplierSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete supplier'
    yield put(deleteSupplierFailure(errorMessage))
  }
}

export default function* supplierSaga() {
  yield takeLatest(fetchSuppliers.type, handleFetchSuppliers)
  yield takeLatest(createSupplier.type, handleCreateSupplier)
  yield takeLatest(updateSupplier.type, handleUpdateSupplier)
  yield takeLatest(deleteSupplier.type, handleDeleteSupplier)
}

