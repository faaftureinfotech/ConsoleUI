import { useState, useCallback } from 'react'
import Notification, { NotificationType } from './Notification'

export interface NotificationState {
  id: string
  type: NotificationType
  message: string
}

export default function useNotification() {
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message }])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const NotificationContainer = () => (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )

  return { showNotification, NotificationContainer }
}

