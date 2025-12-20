import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { register } from '../../store/slices/authSlice'
import useNotification from '../../components/NotificationContainer'
import Logo from '../../components/Logo'
import './Auth.css'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth)
  const { showNotification, NotificationContainer } = useNotification()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      showNotification('error', 'Please fix the validation errors')
      return
    }

    dispatch(register(formData))
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <NotificationContainer />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Logo size="large" />
          </div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Sign up to get started with your account.</p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

