import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Unit {
  id: number
  name: string
}

export interface UnitFormData {
  name: string
}

interface UnitsState {
  list: Unit[]
  loading: boolean
  error: string | null
  selectedUnit: Unit | null
}

const initialState: UnitsState = {
  list: [],
  loading: false,
  error: null,
  selectedUnit: null
}

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    fetchUnits(state) {
      state.loading = true
      state.error = null
    },
    fetchUnitsSuccess(state, action: PayloadAction<Unit[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchUnitsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createUnit(state, action: PayloadAction<UnitFormData>) {
      state.loading = true
      state.error = null
    },
    createUnitSuccess(state, action: PayloadAction<Unit>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createUnitFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateUnit(state, action: PayloadAction<{ id: number; data: UnitFormData }>) {
      state.loading = true
      state.error = null
    },
    updateUnitSuccess(state, action: PayloadAction<Unit>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateUnitFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteUnit(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteUnitSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((u) => u.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteUnitFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectUnit(state, action: PayloadAction<Unit | null>) {
      state.selectedUnit = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchUnits,
  fetchUnitsSuccess,
  fetchUnitsFailure,
  createUnit,
  createUnitSuccess,
  createUnitFailure,
  updateUnit,
  updateUnitSuccess,
  updateUnitFailure,
  deleteUnit,
  deleteUnitSuccess,
  deleteUnitFailure,
  selectUnit,
  clearError
} = unitsSlice.actions

export default unitsSlice.reducer

