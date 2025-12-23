import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Material {
  id: number
  name: string
  defaultUnitId: number
  defaultRate: number
}

export interface MaterialFormData {
  name: string
  defaultUnitId: number
  defaultRate: number
}

interface MaterialsState {
  list: Material[]
  loading: boolean
  error: string | null
  selectedMaterial: Material | null
}

const initialState: MaterialsState = {
  list: [],
  loading: false,
  error: null,
  selectedMaterial: null
}

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    fetchMaterials(state) {
      state.loading = true
      state.error = null
    },
    fetchMaterialsSuccess(state, action: PayloadAction<Material[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchMaterialsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createMaterial(state, action: PayloadAction<MaterialFormData>) {
      state.loading = true
      state.error = null
    },
    createMaterialSuccess(state, action: PayloadAction<Material>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createMaterialFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateMaterial(state, action: PayloadAction<{ id: number; data: MaterialFormData }>) {
      state.loading = true
      state.error = null
    },
    updateMaterialSuccess(state, action: PayloadAction<Material>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((m) => m.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateMaterialFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteMaterial(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteMaterialSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((m) => m.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteMaterialFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectMaterial(state, action: PayloadAction<Material | null>) {
      state.selectedMaterial = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
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
  selectMaterial,
  clearError
} = materialsSlice.actions

export default materialsSlice.reducer

