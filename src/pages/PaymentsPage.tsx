import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectPayment } from '../store/slices/paymentSlice'
import PaymentList from './payment/PaymentList'
import PaymentForm from './payment/PaymentForm'
import './PaymentsPage.css'

export default function PaymentsPage() {
  const dispatch = useAppDispatch()
  const { selectedPayment } = useAppSelector((s) => s.payment)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedPayment) {
      setShowForm(true)
    }
  }, [selectedPayment])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectPayment(null))
  }

  const handleAddNew = () => {
    dispatch(selectPayment(null))
    setShowForm(true)
  }

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payment Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Payment
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-section">
          <PaymentForm payment={selectedPayment} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <PaymentList />
        </div>
      )}
    </div>
  )
}

