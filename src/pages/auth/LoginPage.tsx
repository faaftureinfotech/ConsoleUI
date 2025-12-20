import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login } from '../../store/slices/authSlice'
import useNotification from '../../components/NotificationContainer'
import Logo from '../../components/Logo'
import './Auth.css'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)
  const { showNotification, NotificationContainer } = useNotification()
  const captchaRef = useRef<ReCAPTCHA>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<{ email?: string; password?: string; captcha?: string }>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}

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

    const captchaToken = captchaRef.current?.getValue()
    if (!captchaToken) {
      newErrors.captcha = 'Please complete the CAPTCHA verification'
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

    const captchaToken = captchaRef.current?.getValue()
    if (!captchaToken) {
      showNotification('error', 'Please complete the CAPTCHA verification')
      return
    }

    dispatch(login({ ...formData, captchaToken }))
  }

  // Handle successful login
  const { isAuthenticated } = useAppSelector((s) => s.auth)
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
          <h1>Login</h1>
          <p className="auth-subtitle">Welcome back! Please login to your account.</p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
                autoComplete="current-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <ReCAPTCHA
                ref={captchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                onChange={() => {
                  if (errors.captcha) {
                    setErrors((prev) => ({ ...prev, captcha: undefined }))
                  }
                }}
              />
              {errors.captcha && <span className="error-message">{errors.captcha}</span>}
            </div>

            <div className="form-group">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

