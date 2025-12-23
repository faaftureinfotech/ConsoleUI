import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  User,
  UserFormData
} from '../slices/userSlice'

function* handleFetchUsers() {
  try {
    const res: { data: User[] } = yield call(apiClient.get, '/users')
    const users = Array.isArray(res.data) ? res.data : []
    yield put(fetchUsersSuccess(users))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch users'
    yield put(fetchUsersFailure(errorMessage))
  }
}

function* handleCreateUser(action: ReturnType<typeof createUser>) {
  try {
    const res: { data: User } = yield call(apiClient.post, '/users', action.payload)
    yield put(createUserSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create user'
    yield put(createUserFailure(errorMessage))
  }
}

function* handleUpdateUser(action: ReturnType<typeof updateUser>) {
  try {
    const res: { data: User } = yield call(
      apiClient.put,
      `/users/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateUserSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update user'
    yield put(updateUserFailure(errorMessage))
  }
}

function* handleDeleteUser(action: ReturnType<typeof deleteUser>) {
  try {
    yield call(apiClient.delete, `/users/${action.payload}`)
    yield put(deleteUserSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete user'
    yield put(deleteUserFailure(errorMessage))
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsers.type, handleFetchUsers)
  yield takeLatest(createUser.type, handleCreateUser)
  yield takeLatest(updateUser.type, handleUpdateUser)
  yield takeLatest(deleteUser.type, handleDeleteUser)
}

