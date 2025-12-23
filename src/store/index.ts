import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import employeesReducer from './slices/employeesSlice'
import quotationReducer from './slices/quotationSlice'
import customerReducer from './slices/customerSlice'
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import supplierReducer from './slices/supplierSlice'
import expenseReducer from './slices/expenseSlice'
import paymentReducer from './slices/paymentSlice'
import unitsReducer from './slices/unitsSlice'
import categoriesReducer from './slices/categoriesSlice'
import materialsReducer from './slices/materialsSlice'
import boqMasterReducer from './slices/boqMasterSlice'
import rolesReducer from './slices/rolesSlice'
import employeeAllocationReducer from './slices/employeeAllocationSlice'
import userReducer from './slices/userSlice'
import rootSaga from './sagas/rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    quotation: quotationReducer,
    customer: customerReducer,
    auth: authReducer,
    project: projectReducer,
    supplier: supplierReducer,
    expense: expenseReducer,
    payment: paymentReducer,
    units: unitsReducer,
    categories: categoriesReducer,
    materials: materialsReducer,
    boqMaster: boqMasterReducer,
    roles: rolesReducer,
    employeeAllocation: employeeAllocationReducer,
    user: userReducer
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
