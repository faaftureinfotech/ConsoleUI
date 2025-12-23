import { NavLink, Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { logout } from './store/slices/authSlice'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeAllocationPage from './pages/employee/EmployeeAllocationPage'
import UserPage from './pages/user/UserPage'
import QuotationPage from './pages/QuotationPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import ProjectsPage from './pages/ProjectsPage'
import SuppliersPage from './pages/SuppliersPage'
import ExpensesPage from './pages/ExpensesPage'
import PaymentsPage from './pages/PaymentsPage'
import MasterDataPage from './pages/MasterDataPage'
import QuotationPrintPage from './pages/quotation/QuotationPrintPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProtectedRoute from './components/ProtectedRoute'
import useNotification from './components/NotificationContainer'
import './App.css'
import './styles.css'
import './styles/table-sort.css'

function AppContent() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  const { NotificationContainer } = useNotification()

  // Redirect to dashboard if authenticated and on login/register pages
  useEffect(() => {
    if (isAuthenticated && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <>
      <NotificationContainer />
      {isAuthenticated && (
        <nav className="main-nav">
          <div className="nav-brand">Construction App</div>
          <div className="nav-links">
            <NavLink to='/' end className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to='/customers' className={({ isActive }) => (isActive ? 'active' : '')}>
              Customers
            </NavLink>
            <NavLink to='/employees' className={({ isActive }) => (isActive ? 'active' : '')}>
              Employees
            </NavLink>
            <NavLink to='/projects' className={({ isActive }) => (isActive ? 'active' : '')}>
              Projects
            </NavLink>
            <NavLink to='/suppliers' className={({ isActive }) => (isActive ? 'active' : '')}>
              Suppliers
            </NavLink>
            <NavLink to='/expenses' className={({ isActive }) => (isActive ? 'active' : '')}>
              Expenses
            </NavLink>
            <NavLink to='/payments' className={({ isActive }) => (isActive ? 'active' : '')}>
              Payments
            </NavLink>
            <NavLink to='/quotation' className={({ isActive }) => (isActive ? 'active' : '')}>
              Quotation
            </NavLink>
            <NavLink to='/master-data' className={({ isActive }) => (isActive ? 'active' : '')}>
              Settings
            </NavLink>
          </div>
          <div className="nav-user">
            <span className="user-name">{user?.name || user?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      )}
      <div className='container'>
        <Routes>
          <Route 
            path='/login' 
            element={isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />} 
          />
          <Route 
            path='/register' 
            element={isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />} 
          />
          <Route 
            path='/forgot-password' 
            element={isAuthenticated ? <Navigate to='/' replace /> : <ForgotPasswordPage />} 
          />
          <Route
            path='/'
            element={
              isAuthenticated ? (
                <DashboardPage />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          <Route
            path='/employees'
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/employee-allocations'
            element={
              <ProtectedRoute>
                <EmployeeAllocationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/users'
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/customers'
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/projects'
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/suppliers'
            element={
              <ProtectedRoute>
                <SuppliersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/expenses'
            element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/payments'
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/quotation'
            element={
              <ProtectedRoute>
                <QuotationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/master-data'
            element={
              <ProtectedRoute>
                <MasterDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/quotation/print'
            element={<QuotationPrintPage />}
          />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return <AppContent />
}
