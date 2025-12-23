import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchUsers,
  deleteUser,
  selectUser,
  User
} from '../../store/slices/userSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './UserList.css'

export default function UserList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.user)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
      showNotification('success', 'User deleted successfully')
    }
  }

  const handleEdit = (user: User) => {
    dispatch(selectUser(user))
  }

  const filteredUsers = (Array.isArray(list) ? list : []).filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roleName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = 
      filterStatus === 'All' || 
      (filterStatus === 'Active' && user.isActive) ||
      (filterStatus === 'Inactive' && !user.isActive)

    return matchesSearch && matchesStatus
  })

  const { sortedData, handleSort, getSortDirection } = useTableSort<User>(filteredUsers)

  return (
    <>
      <NotificationContainer />
      <div className="user-list-container">
        <div className="user-list-header">
          <h2>Users</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading users...</div>}

        {!loading && filteredUsers.length === 0 && (
          <div className="empty-state">
            {searchTerm || filterStatus !== 'All'
              ? 'No users found matching your search.'
              : 'No users found.'}
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'username')}
                    onClick={() => handleSort('username')}
                  >
                    Username
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'email')}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'firstName')}
                    onClick={() => handleSort('firstName')}
                  >
                    First Name
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'lastName')}
                    onClick={() => handleSort('lastName')}
                  >
                    Last Name
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'roleName')}
                    onClick={() => handleSort('roleName')}
                  >
                    Role
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'isActive')}
                    onClick={() => handleSort('isActive')}
                  >
                    Status
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'createdAt')}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstName || '-'}</td>
                    <td>{user.lastName || '-'}</td>
                    <td>{user.roleName || '-'}</td>
                    <td>
                      <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(user.id)}
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

