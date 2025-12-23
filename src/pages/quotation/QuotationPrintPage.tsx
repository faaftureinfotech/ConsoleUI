import { useEffect, useState } from 'react'
import { Quotation } from '../../store/slices/quotationSlice'
import QuotationPrint from './QuotationPrint'
import './QuotationPrint.css'

export default function QuotationPrintPage() {
  const [quotation, setQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    const storedQuotation = sessionStorage.getItem('printQuotation')
    if (storedQuotation) {
      try {
        const parsed = JSON.parse(storedQuotation)
        setQuotation(parsed)
      } catch (error) {
        console.error('Failed to parse quotation:', error)
      }
    }
  }, [])

  if (!quotation) {
    return <div>Loading quotation...</div>
  }

  return <QuotationPrint quotation={quotation} />
}

