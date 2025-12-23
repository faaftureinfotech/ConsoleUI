import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchUnits,
  fetchUnitsSuccess,
  fetchUnitsFailure,
  createUnit,
  createUnitSuccess,
  createUnitFailure,
  updateUnit,
  updateUnitSuccess,
  updateUnitFailure,
  deleteUnit,
  deleteUnitSuccess,
  deleteUnitFailure,
  Unit,
  UnitFormData
} from '../slices/unitsSlice'

function* handleFetchUnits() {
  try {
    const res: { data: Unit[] } = yield call(apiClient.get, '/units')
    const units = Array.isArray(res.data) ? res.data : []
    yield put(fetchUnitsSuccess(units))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch units'
    yield put(fetchUnitsFailure(errorMessage))
  }
}

function* handleCreateUnit(action: ReturnType<typeof createUnit>) {
  try {
    const res: { data: Unit } = yield call(apiClient.post, '/units', action.payload)
    yield put(createUnitSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create unit'
    yield put(createUnitFailure(errorMessage))
  }
}

function* handleUpdateUnit(action: ReturnType<typeof updateUnit>) {
  try {
    const res: { data: Unit } = yield call(
      apiClient.put,
      `/units/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateUnitSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update unit'
    yield put(updateUnitFailure(errorMessage))
  }
}

function* handleDeleteUnit(action: ReturnType<typeof deleteUnit>) {
  try {
    yield call(apiClient.delete, `/units/${action.payload}`)
    yield put(deleteUnitSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete unit'
    yield put(deleteUnitFailure(errorMessage))
  }
}

export default function* unitsSaga() {
  yield takeLatest(fetchUnits.type, handleFetchUnits)
  yield takeLatest(createUnit.type, handleCreateUnit)
  yield takeLatest(updateUnit.type, handleUpdateUnit)
  yield takeLatest(deleteUnit.type, handleDeleteUnit)
}

