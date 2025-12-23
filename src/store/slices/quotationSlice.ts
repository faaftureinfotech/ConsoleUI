import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ItemNode {
  id: number
  name: string
  unit: string
  defaultRate: number
}

export type Phase = 
  | 'Ground Floor'
  | 'First Floor'
  | 'Second Floor'
  | 'Third Floor'
  | 'Fourth Floor'
  | 'Fifth Floor'
  | 'Basement'
  | 'Roof'
  | 'Common Areas'
  | 'External Works'

export interface BoqItem {
  tempId: string
  itemId: number
  description: string
  unit: string
  quantity: number
  rate: number
  amount: number
  phase?: Phase
}

export interface Quotation {
  id: number
  quotationNumber: string
  customerId: number
  customerName?: string
  projectId?: number
  projectName?: string
  quotationDate: string
  validUntil: string
  subTotal: number
  taxPercentage: number
  taxAmount: number
  totalAmount: number
  notes?: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'
  items: BoqItem[]
}

export interface QuotationFormData {
  quotationNumber?: string
  customerId: number
  projectId?: number
  quotationDate: string
  validUntil: string
  taxPercentage: number
  notes?: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'
}

interface QuotationState {
  items: BoqItem[]
  list: Quotation[]
  selectedQuotation: Quotation | null
  loading: boolean
  error: string | null
  categoriesLoading: boolean
}

const initialState: QuotationState = {
  items: [],
  list: [],
  selectedQuotation: null,
  loading: false,
  error: null,
  categoriesLoading: false
}

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    addBoqItem(state, action: PayloadAction<{ item: ItemNode; phase?: Phase }>) {
      const { item: src, phase } = action.payload
      state.items.push({
        tempId: crypto.randomUUID(),
        itemId: src.id,
        description: src.name,
        unit: src.unit,
        quantity: 1,
        rate: src.defaultRate,
        amount: src.defaultRate,
        phase: phase || 'Ground Floor'
      })
    },
    addBoqItemFromMaster(state, action: PayloadAction<{ master: { id: number; name: string; defaultUnitId: number; defaultRate: number; description?: string }; unitName: string; phase?: Phase }>) {
      const { master, unitName, phase } = action.payload
      state.items.push({
        tempId: crypto.randomUUID(),
        itemId: master.id,
        description: master.name,
        unit: unitName,
        quantity: 1,
        rate: master.defaultRate,
        amount: master.defaultRate,
        phase: phase || 'Ground Floor'
      })
    },
    updateBoqItem(
      state,
      action: PayloadAction<{ tempId: string; quantity?: number; rate?: number; phase?: Phase }>
    ) {
      const row = state.items.find((x) => x.tempId === action.payload.tempId)
      if (!row) return
      if (action.payload.quantity !== undefined) row.quantity = action.payload.quantity
      if (action.payload.rate !== undefined) row.rate = action.payload.rate
      if (action.payload.phase !== undefined) row.phase = action.payload.phase
      row.amount = row.quantity * row.rate
    },
    removeBoqItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.tempId !== action.payload)
    },
    clearBoqItems(state) {
      state.items = []
    },
    fetchQuotations(state) {
      state.loading = true
      state.error = null
      state.list = Array.isArray(state.list) ? state.list : []
    },
    fetchQuotationsSuccess(state, action: PayloadAction<Quotation[]>) {
      state.list = action.payload
      state.loading = false
      state.error = null
    },
    fetchQuotationsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      state.list = []
    },
    createQuotation(state, action: PayloadAction<{ formData: QuotationFormData; items: BoqItem[] }>) {
      state.loading = true
      state.error = null
    },
    createQuotationSuccess(state, action: PayloadAction<Quotation>) {
      state.list = Array.isArray(state.list) ? [...state.list, action.payload] : [action.payload]
      state.loading = false
      state.error = null
      state.items = []
    },
    createQuotationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateQuotation(state, action: PayloadAction<{ id: number; formData: QuotationFormData; items: BoqItem[] }>) {
      state.loading = true
      state.error = null
    },
    updateQuotationSuccess(state, action: PayloadAction<Quotation>) {
      state.list = Array.isArray(state.list) ? state.list : []
      const index = state.list.findIndex((q) => q.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.items = []
    },
    updateQuotationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteQuotation(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteQuotationSuccess(state, action: PayloadAction<number>) {
      state.list = Array.isArray(state.list) ? state.list.filter((q) => q.id !== action.payload) : []
      state.loading = false
      state.error = null
    },
    deleteQuotationFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectQuotation(state, action: PayloadAction<Quotation | null>) {
      state.selectedQuotation = action.payload
      if (action.payload) {
        state.items = action.payload.items || []
      } else {
        state.items = []
      }
    },
    updateQuotationStatus(state, action: PayloadAction<{ id: number; status: Quotation['status'] }>) {
      state.loading = true
      state.error = null
    },
    updateQuotationStatusSuccess(state, action: PayloadAction<Quotation>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((q) => q.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      if (state.selectedQuotation?.id === action.payload.id) {
        state.selectedQuotation = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateQuotationStatusFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    }
  }
})

export const {
  addBoqItem,
  addBoqItemFromMaster,
  updateBoqItem,
  removeBoqItem,
  clearBoqItems,
  fetchQuotations,
  fetchQuotationsSuccess,
  fetchQuotationsFailure,
  createQuotation,
  createQuotationSuccess,
  createQuotationFailure,
  updateQuotation,
  updateQuotationSuccess,
  updateQuotationFailure,
  deleteQuotation,
  deleteQuotationSuccess,
  deleteQuotationFailure,
  selectQuotation,
  updateQuotationStatus,
  updateQuotationStatusSuccess,
  updateQuotationStatusFailure
} = quotationSlice.actions
export default quotationSlice.reducer
