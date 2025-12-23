import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  Role,
  RoleFormData
} from '../slices/rolesSlice'

function* handleFetchRoles() {
  try {
    const res: { data: Role[] } = yield call(apiClient.get, '/role')
    const roles = Array.isArray(res.data) ? res.data : []
    yield put(fetchRolesSuccess(roles))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch roles'
    yield put(fetchRolesFailure(errorMessage))
  }
}

function* handleCreateRole(action: ReturnType<typeof createRole>) {
  try {
    const res: { data: Role } = yield call(apiClient.post, '/role', action.payload)
    yield put(createRoleSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create role'
    yield put(createRoleFailure(errorMessage))
  }
}

function* handleUpdateRole(action: ReturnType<typeof updateRole>) {
  try {
    const res: { data: Role } = yield call(
      apiClient.put,
      `/role/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateRoleSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update role'
    yield put(updateRoleFailure(errorMessage))
  }
}

function* handleDeleteRole(action: ReturnType<typeof deleteRole>) {
  try {
    yield call(apiClient.delete, `/role/${action.payload}`)
    yield put(deleteRoleSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete role'
    yield put(deleteRoleFailure(errorMessage))
  }
}

export default function* rolesSaga() {
  yield takeLatest(fetchRoles.type, handleFetchRoles)
  yield takeLatest(createRole.type, handleCreateRole)
  yield takeLatest(updateRole.type, handleUpdateRole)
  yield takeLatest(deleteRole.type, handleDeleteRole)
}

