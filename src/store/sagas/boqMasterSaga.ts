import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchBoqMasters,
  fetchBoqMastersSuccess,
  fetchBoqMastersFailure,
  createBoqMaster,
  createBoqMasterSuccess,
  createBoqMasterFailure,
  updateBoqMaster,
  updateBoqMasterSuccess,
  updateBoqMasterFailure,
  deleteBoqMaster,
  deleteBoqMasterSuccess,
  deleteBoqMasterFailure,
  BoqMaster,
  BoqMasterFormData
} from '../slices/boqMasterSlice'

function* handleFetchBoqMasters() {
  try {
    const res: { data: BoqMaster[] } = yield call(apiClient.get, '/BOQMaster')
    const boqMasters = Array.isArray(res.data) ? res.data : []
    yield put(fetchBoqMastersSuccess(boqMasters))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch BOQ masters'
    yield put(fetchBoqMastersFailure(errorMessage))
  }
}

function* handleCreateBoqMaster(action: ReturnType<typeof createBoqMaster>) {
  try {
    // API returns just the ID, so we need to construct the object or refetch
    const res: { data: number } = yield call(apiClient.post, '/BOQMaster', action.payload)
    const newBoqMaster: BoqMaster = {
      id: res.data,
      name: action.payload.name,
      categoryId: action.payload.categoryId,
      defaultUnitId: action.payload.defaultUnitId,
      defaultRate: action.payload.defaultRate,
      description: action.payload.description
    }
    yield put(createBoqMasterSuccess(newBoqMaster))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create BOQ master'
    yield put(createBoqMasterFailure(errorMessage))
  }
}

function* handleUpdateBoqMaster(action: ReturnType<typeof updateBoqMaster>) {
  try {
    // API returns Ok() with no body, so we construct the updated object
    yield call(
      apiClient.put,
      `/api/BOQMaster/${action.payload.id}`,
      action.payload.data
    )
    const updatedBoqMaster: BoqMaster = {
      id: action.payload.id,
      name: action.payload.data.name,
      categoryId: action.payload.data.categoryId,
      defaultUnitId: action.payload.data.defaultUnitId,
      defaultRate: action.payload.data.defaultRate,
      description: action.payload.data.description
    }
    yield put(updateBoqMasterSuccess(updatedBoqMaster))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update BOQ master'
    yield put(updateBoqMasterFailure(errorMessage))
  }
}

function* handleDeleteBoqMaster(action: ReturnType<typeof deleteBoqMaster>) {
  try {
    yield call(apiClient.delete, `/api/BOQMaster/${action.payload}`)
    yield put(deleteBoqMasterSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete BOQ master'
    yield put(deleteBoqMasterFailure(errorMessage))
  }
}

export default function* boqMasterSaga() {
  yield takeLatest(fetchBoqMasters.type, handleFetchBoqMasters)
  yield takeLatest(createBoqMaster.type, handleCreateBoqMaster)
  yield takeLatest(updateBoqMaster.type, handleUpdateBoqMaster)
  yield takeLatest(deleteBoqMaster.type, handleDeleteBoqMaster)
}

