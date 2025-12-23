import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchRoles,
  deleteRole,
  selectRole,
  Role
} from '../../store/slices/rolesSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './MasterDataList.css'

export default function RolesList() {
  const dispatch = useAppDispatch()
  const rolesState = useAppSelector((s) => s.roles)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const list = Array.isArray(rolesState?.list) ? rolesState.list : []
  const loading = rolesState?.loading ?? false
  const error = rolesState?.error ?? null

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'Role deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setDeletingId(id)
      dispatch(deleteRole(id))
    }
  }

  const handleEdit = (role: Role) => {
    dispatch(selectRole(role))
  }

  const filteredRoles = list.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Role>(filteredRoles)

  return (
    <>
      <NotificationContainer />
      <div className="master-data-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading roles...</div>}

        {!loading && filteredRoles.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No roles found matching your search.' : 'No roles found.'}
          </div>
        )}

        {!loading && filteredRoles.length > 0 && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'id')}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'name')}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </th>
                  <th>Description</th>
                  <th 
                    className={getSortClassName(getSortDirection, 'status')}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>{role.description || '-'}</td>
                    <td>{role.status || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(role)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(role.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

