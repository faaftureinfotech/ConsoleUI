import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchQuotations, updateQuotationStatus, selectQuotation, Quotation } from '../../store/slices/quotationSlice'
import Logo from '../../components/Logo'
import useNotification from '../../components/NotificationContainer'
import './DashboardPage.css'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { list: quotations, loading } = useAppSelector((s) => s.quotation)
  const { showNotification, NotificationContainer } = useNotification()

  useEffect(() => {
    dispatch(fetchQuotations())
  }, [dispatch])

  const handleSendQuotation = (quotation: Quotation) => {
    if (window.confirm('Are you sure you want to send this quotation?')) {
      dispatch(updateQuotationStatus({ id: quotation.id, status: 'Sent' }))
      showNotification('success', 'Quotation sent successfully')
    }
  }

  const handlePrintQuotation = (quotation: Quotation) => {
    // Store quotation in sessionStorage for print page
    sessionStorage.setItem('printQuotation', JSON.stringify(quotation))
    const printWindow = window.open('/quotation/print', '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500)
      }
    }
  }

  const recentQuotations = Array.isArray(quotations)
    ? quotations
        .filter((q) => q.status === 'Draft' || q.status === 'Sent')
        .sort((a, b) => new Date(b.quotationDate).getTime() - new Date(a.quotationDate).getTime())
        .slice(0, 5)
    : []

  const menuItems = [
    {
      title: 'Customers',
      description: 'Manage customer information, contacts, and details',
      icon: '👥',
      path: '/customers',
      color: '#3b82f6'
    },
    {
      title: 'Employees',
      description: 'View and manage employees and contractors',
      icon: '👷',
      path: '/employees',
      color: '#10b981'
    },
    {
      title: 'Employee Allocation',
      description: 'Allocate employees/contractors for full day or half day',
      icon: '📅',
      path: '/employee-allocations',
      color: '#06b6d4'
    },
    {
      title: 'Quotation',
      description: 'Create and manage quotations and BOQ items',
      icon: '📋',
      path: '/quotation',
      color: '#f59e0b'
    },
    {
      title: 'Projects',
      description: 'Manage construction projects and assignments',
      icon: '🏗️',
      path: '/projects',
      color: '#8b5cf6'
    },
    {
      title: 'Expenses',
      description: 'Track all project-wise expenses and costs',
      icon: '💸',
      path: '/expenses',
      color: '#ef4444'
    },
    {
      title: 'Suppliers',
      description: 'Manage suppliers for materials, equipment, and services',
      icon: '🏪',
      path: '/suppliers',
      color: '#f59e0b'
    },
    {
      title: 'Payments',
      description: 'Manage customer, employee, and supplier payments',
      icon: '💰',
      path: '/payments',
      color: '#22c55e'
    }
  ]

  return (
    <>
      <NotificationContainer />
      <div className="dashboard-container">
        <div className="dashboard-header">
          {/* <Logo size="large" /> */}
          <h1>Dashboard</h1>
        </div>

        {recentQuotations.length > 0 && (
          <div className="dashboard-recent-quotations">
            <h2>Recent Quotations</h2>
            <div className="quotations-grid">
              {recentQuotations.map((quotation) => (
                <div key={quotation.id} className="quotation-card">
                  <div className="quotation-card-header">
                    <div>
                      <h3>{quotation.quotationNumber || `#${quotation.id}`}</h3>
                      <p className="quotation-customer">{quotation.customerName || 'N/A'}</p>
                    </div>
                    <span className={`status-badge status-${quotation.status.toLowerCase()}`}>
                      {quotation.status}
                    </span>
                  </div>
                  <div className="quotation-card-details">
                    <div className="quotation-detail">
                      <span className="detail-label">Date:</span>
                      <span>{new Date(quotation.quotationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="quotation-detail">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">
                        ₹{quotation.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="quotation-card-actions">
                    {quotation.status === 'Draft' && (
                      <button
                        className="btn btn-sm btn-send"
                        onClick={() => handleSendQuotation(quotation)}
                      >
                        Send
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-print"
                      onClick={() => handlePrintQuotation(quotation)}
                    >
                      Print
                    </button>
                    <Link
                      to="/quotation"
                      className="btn btn-sm btn-edit"
                      onClick={() => dispatch(selectQuotation(quotation))}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="menu-card"
              style={{ '--card-color': item.color } as React.CSSProperties}
            >
              <div className="menu-card-icon">{item.icon}</div>
              <div className="menu-card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="menu-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
