import { call, put, takeLatest, select } from 'redux-saga/effects'
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
import { RootState } from '../index'

// Transform EmployeeFormData to match the DTO structure
// Using camelCase for JSON (standard format). If backend requires PascalCase, 
// configure JsonSerializerOptions.PropertyNamingPolicy = null in the API
function transformFormDataToDto(formData: EmployeeFormData, projects: any[]): any {
  const dto: any = {}

  // Optional employee type
  if (formData.type) {
    dto.type = formData.type
  }

  // FirstName and LastName
  if (formData.firstName) {
    dto.firstName = formData.firstName
  }
  if (formData.lastName) {
    dto.lastName = formData.lastName
  }

  // Required MobileNumber
  dto.mobileNumber = formData.mobileNumber

  // Optional Email
  if (formData.email) {
    dto.email = formData.email
  }

  // Optional address fields
  if (formData.address) {
    dto.address = formData.address
  }
  if (formData.city) {
    dto.city = formData.city
  }
  if (formData.state) {
    dto.state = formData.state
  }
  if (formData.pincode) {
    dto.pincode = formData.pincode
  }

  // Required Designation
  dto.designation = formData.designation

  // Optional Department
  if (formData.department) {
    dto.department = formData.department
  }

  // AssignedProject as string (project name)
  if (formData.assignedProject) {
    dto.assignedProject = formData.assignedProject
  } else if (formData.projectId) {
    // Fallback: get project name from projectId if assignedProject is not set
    const project = projects.find(p => p.id === formData.projectId)
    if (project) {
      dto.assignedProject = project.projectName
    }
  }

  // Required JoiningDate
  dto.joiningDate = formData.joiningDate

  // Required Status
  dto.status = formData.status

  // Required SalaryType
  dto.salaryType = formData.salaryType

  // Optional payment fields
  if (formData.ratePerDay !== undefined && formData.ratePerDay !== null) {
    dto.ratePerDay = formData.ratePerDay
  }
  if (formData.monthlySalary !== undefined && formData.monthlySalary !== null) {
    dto.monthlySalary = formData.monthlySalary
  }

  // Optional bank details
  if (formData.bankName) {
    dto.bankName = formData.bankName
  }
  if (formData.accountNumber) {
    dto.accountNumber = formData.accountNumber
  }
  if (formData.ifscCode) {
    dto.ifscCode = formData.ifscCode
  }
  if (formData.upiId) {
    dto.upiId = formData.upiId
  }

  // Optional legal documents
  if (formData.aadharNumber) {
    dto.aadharNumber = formData.aadharNumber
  }
  if (formData.panNumber) {
    dto.panNumber = formData.panNumber
  }

  // Optional contract dates
  if (formData.contractStartDate) {
    dto.contractStartDate = formData.contractStartDate
  }
  if (formData.contractEndDate) {
    dto.contractEndDate = formData.contractEndDate
  }

  // Optional RoleId
  if (formData.roleId) {
    dto.roleId = formData.roleId
  }

  return dto
}

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
    const state: RootState = yield select()
    const projects = state.project.list || []
    const dto = transformFormDataToDto(action.payload, projects)
    const res: { data: Employee } = yield call(apiClient.post, '/employees', dto)
    yield put(createEmployeeSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create employee'
    yield put(createEmployeeFailure(errorMessage))
  }
}

function* handleUpdateEmployee(action: ReturnType<typeof updateEmployee>) {
  try {
    const state: RootState = yield select()
    const projects = state.project.list || []
    const dto = transformFormDataToDto(action.payload.data, projects)
    const res: { data: Employee } = yield call(
      apiClient.put,
      `/employees/${action.payload.id}`,
      dto
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
