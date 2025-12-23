import { all, fork } from 'redux-saga/effects'
import employeesSaga from './employeesSaga'
import customerSaga from './customerSaga'
import authSaga from './authSaga'
import projectSaga from './projectSaga'
import supplierSaga from './supplierSaga'
import expenseSaga from './expenseSaga'
import paymentSaga from './paymentSaga'
import { quotationSaga } from './quotationSaga'
import unitsSaga from './unitsSaga'
import categoriesSaga from './categoriesSaga'
import materialsSaga from './materialsSaga'
import boqMasterSaga from './boqMasterSaga'
import rolesSaga from './rolesSaga'
import employeeAllocationSaga from './employeeAllocationSaga'
import userSaga from './userSaga'

export default function* rootSaga() {
  yield all([
    fork(employeesSaga),
    fork(customerSaga),
    fork(authSaga),
    fork(projectSaga),
    fork(supplierSaga),
    fork(expenseSaga),
    fork(paymentSaga),
    fork(quotationSaga),
    fork(unitsSaga),
    fork(categoriesSaga),
    fork(materialsSaga),
    fork(boqMasterSaga),
    fork(rolesSaga),
    fork(employeeAllocationSaga),
    fork(userSaga)
  ])
}
