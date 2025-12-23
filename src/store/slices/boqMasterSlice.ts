import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BoqMaster {
  id: number
  name: string
  categoryId: number
  defaultUnitId: number
  defaultRate: number
  description?: string
}

export interface BoqMasterFormData {
  name: string
  categoryId: number
  defaultUnitId: number
  defaultRate: number
  description?: string
}

interface BoqMasterState {
  list: BoqMaster[]
  loading: boolean
  error: string | null
  selectedBoqMaster: BoqMaster | null
}

const initialState: BoqMasterState = {
  list: [],
  loading: false,
  error: null,
  selectedBoqMaster: null
}

const boqMasterSlice = createSlice({
  name: 'boqMaster',
  initialState,
  reducers: {
    fetchBoqMasters(state) {
      state.loading = true
      state.error = null
    },
    fetchBoqMastersSuccess(state, action: PayloadAction<BoqMaster[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchBoqMastersFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createBoqMaster(state, action: PayloadAction<BoqMasterFormData>) {
      state.loading = true
      state.error = null
    },
    createBoqMasterSuccess(state, action: PayloadAction<BoqMaster>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createBoqMasterFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateBoqMaster(state, action: PayloadAction<{ id: number; data: BoqMasterFormData }>) {
      state.loading = true
      state.error = null
    },
    updateBoqMasterSuccess(state, action: PayloadAction<BoqMaster>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateBoqMasterFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteBoqMaster(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteBoqMasterSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((b) => b.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteBoqMasterFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectBoqMaster(state, action: PayloadAction<BoqMaster | null>) {
      state.selectedBoqMaster = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchBoqMasters,
  fetchBoqMastersSuccess,
  fetchBoqMastersFailure,
  createBoqMaster,
  createBoqMasterSuccess,
  createBoqMasterFailure,
  updateBoqMaster,
  updateBoqMasterSuccess,
  updateBoqMasterFailure,
  deleteBoqMaster,
  deleteBoqMasterSuccess,
  deleteBoqMasterFailure,
  selectBoqMaster,
  clearError
} = boqMasterSlice.actions

export default boqMasterSlice.reducer

