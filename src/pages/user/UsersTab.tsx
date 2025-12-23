import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectUser, clearError } from '../../store/slices/userSlice'
import UserList from './UserList'
import UserForm from './UserForm'
import ErrorDisplay from '../../components/ErrorDisplay'

export default function UsersTab() {
  const dispatch = useAppDispatch()
  const { selectedUser, error } = useAppSelector((s) => s.user)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedUser) {
      setShowForm(true)
    }
  }, [selectedUser])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectUser(null))
  }

  const handleAddNew = () => {
    dispatch(selectUser(null))
    setShowForm(true)
  }

  return (
    <div className="users-tab">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {!showForm && (
        <div className="tab-header">
          <h2>Users</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New User
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <UserForm user={selectedUser} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <UserList />
        </div>
      )}
    </div>
  )
}

