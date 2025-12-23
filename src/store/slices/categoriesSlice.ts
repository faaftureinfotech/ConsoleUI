import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Category {
  id: number
  name: string
}

export interface CategoryFormData {
  name: string
}

interface CategoriesState {
  list: Category[]
  loading: boolean
  error: string | null
  selectedCategory: Category | null
}

const initialState: CategoriesState = {
  list: [],
  loading: false,
  error: null,
  selectedCategory: null
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategories(state) {
      state.loading = true
      state.error = null
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchCategoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createCategory(state, action: PayloadAction<CategoryFormData>) {
      state.loading = true
      state.error = null
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateCategory(state, action: PayloadAction<{ id: number; data: CategoryFormData }>) {
      state.loading = true
      state.error = null
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteCategorySuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((c) => c.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteCategoryFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectCategory(state, action: PayloadAction<Category | null>) {
      state.selectedCategory = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
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
  selectCategory,
  clearError
} = categoriesSlice.actions

export default categoriesSlice.reducer

