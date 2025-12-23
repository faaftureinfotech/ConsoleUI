import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployee,
  Employee
} from '../../store/slices/employeesSlice'
import { fetchRoles } from '../../store/slices/rolesSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './EmployeeList.css'

export default function EmployeeList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.employees)
  const { list: roles } = useAppSelector((s) => s.roles)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Employee' | 'Contractor'>('All')

  useEffect(() => {
    dispatch(fetchEmployees())
    dispatch(fetchRoles())
  }, [dispatch])

  const handleDelete = (employeeId: number) => {
    if (window.confirm('Are you sure you want to delete this employee/contractor?')) {
      dispatch(deleteEmployee(employeeId))
      showNotification('success', 'Employee/Contractor deleted successfully')
    }
  }

  const handleEdit = (employee: Employee) => {
    dispatch(selectEmployee(employee))
  }

  const filteredEmployees = (Array.isArray(list) ? list : []).filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNumber?.includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'All' || employee.type === filterType

    return matchesSearch && matchesType
  })

  const { sortedData, handleSort, getSortDirection } = useTableSort<Employee>(filteredEmployees)

  return (
    <>
      <NotificationContainer />
      <div className="employee-list-container">
        <div className="employee-list-header">
          <h2>Employees / Contractors</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            >
              <option value="All">All Types</option>
              <option value="Employee">Employees</option>
              <option value="Contractor">Contractors</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading employees...</div>}

        {!loading && filteredEmployees.length === 0 && (
          <div className="empty-state">
            {searchTerm || filterType !== 'All'
              ? 'No employees found matching your search.'
              : 'No employees found.'}
          </div>
        )}

        {!loading && filteredEmployees.length > 0 && (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'type')}
                    onClick={() => handleSort('type')}
                  >
                    Type
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
                    className={getSortClassName(getSortDirection, 'mobileNumber')}
                    onClick={() => handleSort('mobileNumber')}
                  >
                    Mobile
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'email')}
                    onClick={() => handleSort('email')}
                  >
                    Email
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'designation')}
                    onClick={() => handleSort('designation')}
                  >
                    Designation
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'department')}
                    onClick={() => handleSort('department')}
                  >
                    Department
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'roleName')}
                    onClick={() => handleSort('roleName')}
                  >
                    Role
                  </th>
                  <th>User Account</th>
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
                {sortedData.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <span className={`type-badge type-${employee.type.toLowerCase()}`}>
                        {employee.type}
                      </span>
                    </td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.mobileNumber}</td>
                    <td>{employee.email || '-'}</td>
                    <td>{employee.designation || '-'}</td>
                    <td>{employee.department || '-'}</td>
                    <td>{employee.roleName || '-'}</td>
                    <td>
                      {employee.userName ? (
                        <span className="user-link-badge" title={`Linked to user: ${employee.userName}`}>
                          {employee.userName}
                        </span>
                      ) : (
                        <span className="no-user-badge">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(employee.id)}
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

