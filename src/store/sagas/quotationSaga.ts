import { call, put, takeLatest } from 'redux-saga/effects'
import apiClient from '../../utils/apiClient'
import {
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
  Quotation,
  QuotationFormData,
  BoqItem
} from '../slices/quotationSlice'

function* handleFetchQuotations() {
  try {
    const res: { data: Quotation[] } = yield call(apiClient.get, '/quotations')
    const quotations = Array.isArray(res.data) ? res.data : []
    yield put(fetchQuotationsSuccess(quotations))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch quotations'
    yield put(fetchQuotationsFailure(errorMessage))
  }
}

function* handleCreateQuotation(action: ReturnType<typeof createQuotation>) {
  try {
    const { formData, items } = action.payload as { formData: QuotationFormData; items: BoqItem[] }
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subTotal * formData.taxPercentage) / 100
    const totalAmount = subTotal + taxAmount

    const payload = {
      ...formData,
      items: items.map((item) => ({
        itemId: item.itemId,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      })),
      subTotal,
      taxAmount,
      totalAmount
    }

    const res: { data: Quotation } = yield call(apiClient.post, '/quotations', payload)
    yield put(createQuotationSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to create quotation'
    yield put(createQuotationFailure(errorMessage))
  }
}

function* handleUpdateQuotation(action: ReturnType<typeof updateQuotation>) {
  try {
    const { id, formData, items } = action.payload as {
      id: number
      formData: QuotationFormData
      items: BoqItem[]
    }
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subTotal * formData.taxPercentage) / 100
    const totalAmount = subTotal + taxAmount

    const payload = {
      ...formData,
      items: items.map((item) => ({
        itemId: item.itemId,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount
      })),
      subTotal,
      taxAmount,
      totalAmount
    }

    const res: { data: Quotation } = yield call(apiClient.put, `/quotations/${id}`, payload)
    yield put(updateQuotationSuccess(res.data))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to update quotation'
    yield put(updateQuotationFailure(errorMessage))
  }
}

function* handleDeleteQuotation(action: ReturnType<typeof deleteQuotation>) {
  try {
    yield call(apiClient.delete, `/quotations/${action.payload}`)
    yield put(deleteQuotationSuccess(action.payload))
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to delete quotation'
    yield put(deleteQuotationFailure(errorMessage))
  }
}

export function* quotationSaga() {
  yield takeLatest(fetchQuotations.type, handleFetchQuotations)
  yield takeLatest(createQuotation.type, handleCreateQuotation)
  yield takeLatest(updateQuotation.type, handleUpdateQuotation)
  yield takeLatest(deleteQuotation.type, handleDeleteQuotation)
}

