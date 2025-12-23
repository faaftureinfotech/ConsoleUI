import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchEmployeeAllocations,
  deleteEmployeeAllocation,
  selectEmployeeAllocation,
  EmployeeAllocation
} from '../../store/slices/employeeAllocationSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './EmployeeAllocationList.css'

export default function EmployeeAllocationList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.employeeAllocation)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Full Day' | 'Half Day'>('All')

  useEffect(() => {
    dispatch(fetchEmployeeAllocations())
  }, [dispatch])

  const handleDelete = (allocationId: number) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      dispatch(deleteEmployeeAllocation(allocationId))
      showNotification('success', 'Allocation deleted successfully')
    }
  }

  const handleEdit = (allocation: EmployeeAllocation) => {
    dispatch(selectEmployeeAllocation(allocation))
  }

  const filteredAllocations = (Array.isArray(list) ? list : []).filter((allocation) => {
    const matchesSearch =
      allocation.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = !filterDate || allocation.allocationDate === filterDate
    const matchesType = filterType === 'All' || allocation.allocationType === filterType

    return matchesSearch && matchesDate && matchesType
  })

  const { sortedData, handleSort, getSortDirection } = useTableSort<EmployeeAllocation>(filteredAllocations)

  return (
    <>
      <NotificationContainer />
      <div className="employee-allocation-list-container">
        <div className="allocation-list-header">
          <h2>Employee/Contractor Allocations</h2>
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <input
              type="date"
              className="filter-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
            />
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            >
              <option value="All">All Types</option>
              <option value="Full Day">Full Day</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading allocations...</div>}

        {!loading && filteredAllocations.length === 0 && (
          <div className="empty-state">
            {searchTerm || filterDate || filterType !== 'All'
              ? 'No allocations found matching your search.'
              : 'No allocations found.'}
          </div>
        )}

        {!loading && filteredAllocations.length > 0 && (
          <div className="allocation-table-wrapper">
            <table className="allocation-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'allocationDate')}
                    onClick={() => handleSort('allocationDate')}
                  >
                    Date
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'employeeName')}
                    onClick={() => handleSort('employeeName')}
                  >
                    Employee/Contractor
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'employeeType')}
                    onClick={() => handleSort('employeeType')}
                  >
                    Type
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'projectName')}
                    onClick={() => handleSort('projectName')}
                  >
                    Project
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'allocationType')}
                    onClick={() => handleSort('allocationType')}
                  >
                    Allocation
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'notes')}
                    onClick={() => handleSort('notes')}
                  >
                    Notes
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((allocation) => (
                  <tr key={allocation.id}>
                    <td>{new Date(allocation.allocationDate).toLocaleDateString()}</td>
                    <td>{allocation.employeeName || '-'}</td>
                    <td>
                      <span className={`type-badge type-${allocation.employeeType?.toLowerCase()}`}>
                        {allocation.employeeType || '-'}
                      </span>
                    </td>
                    <td>{allocation.projectName || '-'}</td>
                    <td>
                      <span className={`allocation-badge allocation-${allocation.allocationType.toLowerCase().replace(' ', '-')}`}>
                        {allocation.allocationType}
                      </span>
                    </td>
                    <td className="notes-cell">{allocation.notes || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(allocation)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(allocation.id)}
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

