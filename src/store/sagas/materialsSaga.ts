import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchMaterials,
  fetchMaterialsSuccess,
  fetchMaterialsFailure,
  createMaterial,
  createMaterialSuccess,
  createMaterialFailure,
  updateMaterial,
  updateMaterialSuccess,
  updateMaterialFailure,
  deleteMaterial,
  deleteMaterialSuccess,
  deleteMaterialFailure,
  Material,
  MaterialFormData
} from '../slices/materialsSlice'

function* handleFetchMaterials() {
  try {
    const res: { data: Material[] } = yield call(apiClient.get, '/materials')
    const materials = Array.isArray(res.data) ? res.data : []
    yield put(fetchMaterialsSuccess(materials))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch materials'
    yield put(fetchMaterialsFailure(errorMessage))
  }
}

function* handleCreateMaterial(action: ReturnType<typeof createMaterial>) {
  try {
    const res: { data: Material } = yield call(apiClient.post, '/materials', action.payload)
    yield put(createMaterialSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create material'
    yield put(createMaterialFailure(errorMessage))
  }
}

function* handleUpdateMaterial(action: ReturnType<typeof updateMaterial>) {
  try {
    const res: { data: Material } = yield call(
      apiClient.put,
      `/materials/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateMaterialSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update material'
    yield put(updateMaterialFailure(errorMessage))
  }
}

function* handleDeleteMaterial(action: ReturnType<typeof deleteMaterial>) {
  try {
    yield call(apiClient.delete, `/materials/${action.payload}`)
    yield put(deleteMaterialSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete material'
    yield put(deleteMaterialFailure(errorMessage))
  }
}

export default function* materialsSaga() {
  yield takeLatest(fetchMaterials.type, handleFetchMaterials)
  yield takeLatest(createMaterial.type, handleCreateMaterial)
  yield takeLatest(updateMaterial.type, handleUpdateMaterial)
  yield takeLatest(deleteMaterial.type, handleDeleteMaterial)
}

