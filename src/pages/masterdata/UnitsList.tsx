import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchUnits,
  deleteUnit,
  selectUnit,
  Unit
} from '../../store/slices/unitsSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './MasterDataList.css'

export default function UnitsList() {
  const dispatch = useAppDispatch()
  const unitsState = useAppSelector((s) => s.units)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const list = Array.isArray(unitsState?.list) ? unitsState.list : []
  const loading = unitsState?.loading ?? false
  const error = unitsState?.error ?? null

  useEffect(() => {
    dispatch(fetchUnits())
  }, [dispatch])

  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'Unit deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      setDeletingId(id)
      dispatch(deleteUnit(id))
    }
  }

  const handleEdit = (unit: Unit) => {
    dispatch(selectUnit(unit))
  }

  const filteredUnits = list.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Unit>(filteredUnits)

  return (
    <>
      <NotificationContainer />
      <div className="master-data-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading units...</div>}

        {!loading && filteredUnits.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No units found matching your search.' : 'No units found.'}
          </div>
        )}

        {!loading && filteredUnits.length > 0 && (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((unit) => (
                  <tr key={unit.id}>
                    <td>{unit.id}</td>
                    <td>{unit.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(unit)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(unit.id)}
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

