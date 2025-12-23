import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectRole, clearError } from '../../store/slices/rolesSlice'
import RolesList from './RolesList'
import RoleForm from './RoleForm'
import ErrorDisplay from '../../components/ErrorDisplay'

export default function RolesTab() {
  const dispatch = useAppDispatch()
  const { selectedRole, error } = useAppSelector((s) => s.roles)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedRole) {
      setShowForm(true)
    }
  }, [selectedRole])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectRole(null))
  }

  const handleAddNew = () => {
    dispatch(selectRole(null))
    setShowForm(true)
  }

  return (
    <div className="roles-tab">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {!showForm && (
        <div className="tab-header">
          <h2>Roles</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Role
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <RoleForm role={selectedRole} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <RolesList />
        </div>
      )}
    </div>
  )
}

