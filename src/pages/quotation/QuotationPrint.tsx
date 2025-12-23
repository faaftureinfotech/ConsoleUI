import { useAppSelector } from '../../store/hooks'
import { Quotation } from '../../store/slices/quotationSlice'
import './QuotationPrint.css'

interface QuotationPrintProps {
  quotation: Quotation
}

export default function QuotationPrint({ quotation }: QuotationPrintProps) {
  // Group items by phase
  const itemsByPhase = quotation.items.reduce((acc, item) => {
    const phase = item.phase || 'Ground Floor'
    if (!acc[phase]) {
      acc[phase] = []
    }
    acc[phase].push(item)
    return acc
  }, {} as Record<string, typeof quotation.items>)

  const phases = [
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Fifth Floor',
    'Basement',
    'Roof',
    'Common Areas',
    'External Works'
  ]

  const orderedPhases = phases.filter(phase => itemsByPhase[phase]?.length > 0)

  return (
    <div className="quotation-print">
      <div className="print-header">
        <div className="company-info">
          <h1>Construction Finance</h1>
          <p>Quotation</p>
        </div>
        <div className="quotation-info">
          <div className="info-row">
            <span className="label">Quotation #:</span>
            <span className="value">{quotation.quotationNumber || `#${quotation.id}`}</span>
          </div>
          <div className="info-row">
            <span className="label">Date:</span>
            <span className="value">{new Date(quotation.quotationDate).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span className="label">Valid Until:</span>
            <span className="value">{new Date(quotation.validUntil).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`status-badge status-${quotation.status.toLowerCase()}`}>
              {quotation.status}
            </span>
          </div>
        </div>
      </div>

      <div className="print-body">
        <div className="customer-section">
          <h3>Customer Information</h3>
          <div className="customer-details">
            <p><strong>Customer:</strong> {quotation.customerName || 'N/A'}</p>
            {quotation.projectName && (
              <p><strong>Project:</strong> {quotation.projectName}</p>
            )}
          </div>
        </div>

        <div className="items-section">
          <h3>BOQ Items</h3>
          {orderedPhases.map((phase) => {
            const phaseItems = itemsByPhase[phase]
            const phaseTotal = phaseItems.reduce((sum, item) => sum + item.amount, 0)
            return (
              <div key={phase} className="phase-section">
                <div className="phase-header">
                  <h4>{phase}</h4>
                  <span className="phase-total">Total: ₹{phaseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phaseItems.map((item, index) => (
                      <tr key={item.tempId || index}>
                        <td>{index + 1}</td>
                        <td>{item.description}</td>
                        <td>{item.unit}</td>
                        <td>{item.quantity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td>₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td>₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>

        <div className="summary-section">
          <table className="summary-table">
            <tbody>
              <tr>
                <td className="summary-label">Sub Total:</td>
                <td className="summary-value">₹{quotation.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="summary-label">Tax ({quotation.taxPercentage}%):</td>
                <td className="summary-value">₹{quotation.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="total-row">
                <td className="summary-label">Total Amount:</td>
                <td className="summary-value">₹{quotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {quotation.notes && (
          <div className="notes-section">
            <h3>Notes</h3>
            <p>{quotation.notes}</p>
          </div>
        )}
      </div>

      <div className="print-footer">
        <p>Thank you for your business!</p>
        <p className="footer-note">This is a computer-generated quotation.</p>
      </div>
    </div>
  )
}

