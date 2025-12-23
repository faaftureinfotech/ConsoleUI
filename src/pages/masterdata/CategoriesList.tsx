import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchCategories,
  deleteCategory,
  selectCategory,
  Category
} from '../../store/slices/categoriesSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './MasterDataList.css'

export default function CategoriesList() {
  const dispatch = useAppDispatch()
  const categoriesState = useAppSelector((s) => s.categories)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const list = Array.isArray(categoriesState?.list) ? categoriesState.list : []
  const loading = categoriesState?.loading ?? false
  const error = categoriesState?.error ?? null

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (!loading && deletingId !== null) {
      if (error) {
        showNotification('error', error)
      } else {
        showNotification('success', 'Category deleted successfully')
      }
      setDeletingId(null)
    }
  }, [loading, error, deletingId, showNotification])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setDeletingId(id)
      dispatch(deleteCategory(id))
    }
  }

  const handleEdit = (category: Category) => {
    dispatch(selectCategory(category))
  }

  const filteredCategories = list.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Category>(filteredCategories)

  return (
    <>
      <NotificationContainer />
      <div className="master-data-list-container">
        <div className="list-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading categories...</div>}

        {!loading && filteredCategories.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
          </div>
        )}

        {!loading && filteredCategories.length > 0 && (
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
                {sortedData.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(category.id)}
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

