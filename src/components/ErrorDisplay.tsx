import { useEffect } from 'react'
import './ErrorDisplay.css'

interface ErrorDisplayProps {
  error: string | null
  onClear?: () => void
  className?: string
}

export default function ErrorDisplay({ error, onClear, className = '' }: ErrorDisplayProps) {
  useEffect(() => {
    // Auto-clear error after 5 seconds if onClear is provided
    if (error && onClear) {
      const timer = setTimeout(() => {
        onClear()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, onClear])

  if (!error) {
    return null
  }

  return (
    <div className={`error-display ${className}`} role="alert">
      <div className="error-display-content">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{error}</span>
        {onClear && (
          <button
            className="error-close"
            onClick={onClear}
            aria-label="Close error"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

