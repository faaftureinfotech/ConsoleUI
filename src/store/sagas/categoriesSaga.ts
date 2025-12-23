import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
  fetchCategories,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategory,
  createCategorySuccess,
  createCategoryFailure,
  updateCategory,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategory,
  deleteCategorySuccess,
  deleteCategoryFailure,
  Category,
  CategoryFormData
} from '../slices/categoriesSlice'

function* handleFetchCategories() {
  try {
    const res: { data: Category[] } = yield call(apiClient.get, '/categories')
    const categories = Array.isArray(res.data) ? res.data : []
    yield put(fetchCategoriesSuccess(categories))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch categories'
    yield put(fetchCategoriesFailure(errorMessage))
  }
}

function* handleCreateCategory(action: ReturnType<typeof createCategory>) {
  try {
    const res: { data: Category } = yield call(apiClient.post, '/categories', action.payload)
    yield put(createCategorySuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create category'
    yield put(createCategoryFailure(errorMessage))
  }
}

function* handleUpdateCategory(action: ReturnType<typeof updateCategory>) {
  try {
    const res: { data: Category } = yield call(
      apiClient.put,
      `/categories/${action.payload.id}`,
      action.payload.data
    )
    yield put(updateCategorySuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update category'
    yield put(updateCategoryFailure(errorMessage))
  }
}

function* handleDeleteCategory(action: ReturnType<typeof deleteCategory>) {
  try {
    yield call(apiClient.delete, `/categories/${action.payload}`)
    yield put(deleteCategorySuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete category'
    yield put(deleteCategoryFailure(errorMessage))
  }
}

export default function* categoriesSaga() {
  yield takeLatest(fetchCategories.type, handleFetchCategories)
  yield takeLatest(createCategory.type, handleCreateCategory)
  yield takeLatest(updateCategory.type, handleUpdateCategory)
  yield takeLatest(deleteCategory.type, handleDeleteCategory)
}

