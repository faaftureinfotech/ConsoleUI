import { useEffect } from 'react'
import './Notification.css'

export type NotificationType = 'error' | 'warning' | 'info' | 'success'

export interface NotificationProps {
  type: NotificationType
  message: string
  onClose?: () => void
  duration?: number
}

export default function Notification({ type, message, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`notification notification-${type}`} role="alert">
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
          {type === 'success' && '✓'}
        </span>
        <span className="notification-message">{message}</span>
        {onClose && (
          <button className="notification-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

