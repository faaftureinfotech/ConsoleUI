import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectQuotation } from '../store/slices/quotationSlice'
import QuotationList from './quotation/QuotationList'
import QuotationForm from './quotation/QuotationForm'
import './QuotationPage.css'

export default function QuotationPage() {
  const dispatch = useAppDispatch()
  const { selectedQuotation } = useAppSelector((s) => s.quotation)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedQuotation) {
      setShowForm(true)
    }
  }, [selectedQuotation])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectQuotation(null))
  }

  const handleAddNew = () => {
    dispatch(selectQuotation(null))
    setShowForm(true)
  }

  return (
    <div className="quotation-page">
      <div className="page-header">
        <h1>Quotation Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Create New Quotation
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-section">
          <QuotationForm quotation={selectedQuotation} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <QuotationList />
        </div>
      )}
    </div>
  )
}
