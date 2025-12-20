import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployee,
  Employee
} from '../../store/slices/employeesSlice'
import useNotification from '../../components/NotificationContainer'
import './EmployeeList.css'

export default function EmployeeList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.employees)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Employee' | 'Contractor'>('All')

  useEffect(() => {
    dispatch(fetchEmployees())
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
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNumber?.includes(searchTerm) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'All' || employee.type === filterType

    return matchesSearch && matchesType
  })

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
                  <th>Type</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <span className={`type-badge type-${employee.type.toLowerCase()}`}>
                        {employee.type}
                      </span>
                    </td>
                    <td>{employee.fullName}</td>
                    <td>{employee.mobileNumber}</td>
                    <td>{employee.email || '-'}</td>
                    <td>{employee.designation || '-'}</td>
                    <td>{employee.department || '-'}</td>
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

