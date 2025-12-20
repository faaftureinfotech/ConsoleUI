import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchEmployees,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  createEmployee,
  createEmployeeSuccess,
  createEmployeeFailure,
  updateEmployee,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployee,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  Employee,
  EmployeeFormData
} from '../slices/employeesSlice'

function* handleFetchEmployees() {
  try {
    const res: { data: Employee[] } = yield call(apiClient.get, '/employees')
    const employees = Array.isArray(res.data) ? res.data : []
    yield put(fetchEmployeesSuccess(employees))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch employees'
    yield put(fetchEmployeesFailure(errorMessage))
  }
}

function* handleCreateEmployee(action: ReturnType<typeof createEmployee>) {
  try {
    const res: { data: Employee } = yield call(apiClient.post, '/employees', action.payload)
    yield put(createEmployeeSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create employee'
    yield put(createEmployeeFailure(errorMessage))
  }
}

function* handleUpdateEmployee(action: ReturnType<typeof updateEmployee>) {
  try {
    const res: { data: Employee } = yield call(
      apiClient.put,
      `/employees/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateEmployeeSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update employee'
    yield put(updateEmployeeFailure(errorMessage))
  }
}

function* handleDeleteEmployee(action: ReturnType<typeof deleteEmployee>) {
  try {
    yield call(apiClient.delete, `/employees/${action.payload}`)
    yield put(deleteEmployeeSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete employee'
    yield put(deleteEmployeeFailure(errorMessage))
  }
}

export default function* employeesSaga() {
  yield takeLatest(fetchEmployees.type, handleFetchEmployees)
  yield takeLatest(createEmployee.type, handleCreateEmployee)
  yield takeLatest(updateEmployee.type, handleUpdateEmployee)
  yield takeLatest(deleteEmployee.type, handleDeleteEmployee)
}
