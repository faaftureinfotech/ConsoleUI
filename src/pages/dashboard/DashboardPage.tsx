import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import './DashboardPage.css'

export default function DashboardPage() {
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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Logo size="large" />
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the Construction Management System</p>
      </div>

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
  )
}
