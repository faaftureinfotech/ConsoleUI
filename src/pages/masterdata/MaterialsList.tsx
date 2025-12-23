import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchMaterials,
  deleteMaterial,
  selectMaterial,
  Material
} from '../../store/slices/materialsSlice'
import { fetchUnits } from '../../store/slices/unitsSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './MasterDataList.css'

export default function MaterialsList() {
  const dispatch = useAppDispatch()
  const materialsState = useAppSelector((s) => s.materials)
  const { list: units } = useAppSelector((s) => s.units)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const list = Array.isArray(materialsState?.list) ? materialsState.list : []
  const loading = materialsState?.loading ?? false
  const error = materialsState?.error ?? null

  useEffect(() => {
    dispatch(fetchMaterials())
    dispatch(fetchUnits())
  }, [dispatch])

  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'Material deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setDeletingId(id)
      dispatch(deleteMaterial(id))
    }
  }

  const handleEdit = (material: Material) => {
    dispatch(selectMaterial(material))
  }

  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    return unit ? unit.name : '-'
  }

  const filteredMaterials = list.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Material>(filteredMaterials)

  return (
    <>
      <NotificationContainer />
      <div className="master-data-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading materials...</div>}

        {!loading && filteredMaterials.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No materials found matching your search.' : 'No materials found.'}
          </div>
        )}

        {!loading && filteredMaterials.length > 0 && (
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
                  <th 
                    className={getSortClassName(getSortDirection, 'defaultUnitId')}
                    onClick={() => handleSort('defaultUnitId')}
                  >
                    Default Unit
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'defaultRate')}
                    onClick={() => handleSort('defaultRate')}
                  >
                    Default Rate
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((material) => (
                  <tr key={material.id}>
                    <td>{material.id}</td>
                    <td>{material.name}</td>
                    <td>{getUnitName(material.defaultUnitId)}</td>
                    <td>₹{material.defaultRate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(material)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(material.id)}
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

