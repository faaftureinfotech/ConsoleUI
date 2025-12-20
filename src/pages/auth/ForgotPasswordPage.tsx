import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { forgotPassword } from '../../store/slices/authSlice'
import useNotification from '../../components/NotificationContainer'
import Logo from '../../components/Logo'
import './Auth.css'

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)
  const { showNotification, NotificationContainer } = useNotification()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (value: string) => {
    setEmail(value)
    if (emailError) {
      setEmailError('')
    }
  }

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      showNotification('error', 'Please fix the validation errors')
      return
    }

    dispatch(forgotPassword({ email }))
    setSubmitted(true)
    showNotification('info', 'If an account exists with this email, you will receive a password reset link.')
  }

  return (
    <>
      <NotificationContainer />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Logo size="large" />
          </div>
          <h1>Forgot Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {submitted && !error && (
            <div className="auth-success">
              Password reset email sent! Please check your inbox.
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleChange(e.target.value)}
                className={emailError ? 'error' : ''}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={submitted}
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading || submitted}>
              {loading ? 'Sending...' : submitted ? 'Email Sent' : 'Send Reset Link'}
            </button>

            <div className="auth-footer">
              <p>
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

