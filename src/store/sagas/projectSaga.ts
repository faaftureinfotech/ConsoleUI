import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchProjects,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  createProject,
  createProjectSuccess,
  createProjectFailure,
  updateProject,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProject,
  deleteProjectSuccess,
  deleteProjectFailure,
  Project,
  ProjectFormData
} from '../slices/projectSlice'

function* handleFetchProjects() {
  try {
    const res: { data: Project[] } = yield call(apiClient.get, '/projects')
    const projects = Array.isArray(res.data) ? res.data : []
    yield put(fetchProjectsSuccess(projects))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch projects'
    yield put(fetchProjectsFailure(errorMessage))
  }
}

function* handleCreateProject(action: ReturnType<typeof createProject>) {
  try {
    const res: { data: Project } = yield call(apiClient.post, '/projects', action.payload)
    yield put(createProjectSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create project'
    yield put(createProjectFailure(errorMessage))
  }
}

function* handleUpdateProject(action: ReturnType<typeof updateProject>) {
  try {
    const res: { data: Project } = yield call(
      apiClient.put,
      `/projects/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateProjectSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update project'
    yield put(updateProjectFailure(errorMessage))
  }
}

function* handleDeleteProject(action: ReturnType<typeof deleteProject>) {
  try {
    yield call(apiClient.delete, `/projects/${action.payload}`)
    yield put(deleteProjectSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete project'
    yield put(deleteProjectFailure(errorMessage))
  }
}

export default function* projectSaga() {
  yield takeLatest(fetchProjects.type, handleFetchProjects)
  yield takeLatest(createProject.type, handleCreateProject)
  yield takeLatest(updateProject.type, handleUpdateProject)
  yield takeLatest(deleteProject.type, handleDeleteProject)
}

