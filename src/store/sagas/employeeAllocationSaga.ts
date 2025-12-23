import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchEmployeeAllocations,
  fetchEmployeeAllocationsSuccess,
  fetchEmployeeAllocationsFailure,
  createEmployeeAllocation,
  createEmployeeAllocationSuccess,
  createEmployeeAllocationFailure,
  updateEmployeeAllocation,
  updateEmployeeAllocationSuccess,
  updateEmployeeAllocationFailure,
  deleteEmployeeAllocation,
  deleteEmployeeAllocationSuccess,
  deleteEmployeeAllocationFailure,
  EmployeeAllocation,
  EmployeeAllocationFormData
} from '../slices/employeeAllocationSlice'

function* handleFetchEmployeeAllocations() {
  try {
    const res: { data: EmployeeAllocation[] } = yield call(apiClient.get, '/employee-allocations')
    const allocations = Array.isArray(res.data) ? res.data : []
    yield put(fetchEmployeeAllocationsSuccess(allocations))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch employee allocations'
    yield put(fetchEmployeeAllocationsFailure(errorMessage))
  }
}

function* handleCreateEmployeeAllocation(action: ReturnType<typeof createEmployeeAllocation>) {
  try {
    const res: { data: EmployeeAllocation } = yield call(apiClient.post, '/employee-allocations', action.payload)
    yield put(createEmployeeAllocationSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create employee allocation'
    yield put(createEmployeeAllocationFailure(errorMessage))
  }
}

function* handleUpdateEmployeeAllocation(action: ReturnType<typeof updateEmployeeAllocation>) {
  try {
    const res: { data: EmployeeAllocation } = yield call(
      apiClient.put,
      `/employee-allocations/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateEmployeeAllocationSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update employee allocation'
    yield put(updateEmployeeAllocationFailure(errorMessage))
  }
}

function* handleDeleteEmployeeAllocation(action: ReturnType<typeof deleteEmployeeAllocation>) {
  try {
    yield call(apiClient.delete, `/employee-allocations/${action.payload}`)
    yield put(deleteEmployeeAllocationSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete employee allocation'
    yield put(deleteEmployeeAllocationFailure(errorMessage))
  }
}

export default function* employeeAllocationSaga() {
  yield takeLatest(fetchEmployeeAllocations.type, handleFetchEmployeeAllocations)
  yield takeLatest(createEmployeeAllocation.type, handleCreateEmployeeAllocation)
  yield takeLatest(updateEmployeeAllocation.type, handleUpdateEmployeeAllocation)
  yield takeLatest(deleteEmployeeAllocation.type, handleDeleteEmployeeAllocation)
}

