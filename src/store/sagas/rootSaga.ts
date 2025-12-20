import { all, fork } from 'redux-saga/effects'
import employeesSaga from './employeesSaga'
import customerSaga from './customerSaga'
import authSaga from './authSaga'
import projectSaga from './projectSaga'
import supplierSaga from './supplierSaga'
import expenseSaga from './expenseSaga'
import paymentSaga from './paymentSaga'
import { quotationSaga } from './quotationSaga'

export default function* rootSaga() {
  yield all([
    fork(employeesSaga),
    fork(customerSaga),
    fork(authSaga),
    fork(projectSaga),
    fork(supplierSaga),
    fork(expenseSaga),
    fork(paymentSaga),
    fork(quotationSaga)
  ])
}
