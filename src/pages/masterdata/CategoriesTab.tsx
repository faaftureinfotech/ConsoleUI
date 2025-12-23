import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectCategory, clearError } from '../../store/slices/categoriesSlice'
import CategoriesList from './CategoriesList'
import CategoryForm from './CategoryForm'
import ErrorDisplay from '../../components/ErrorDisplay'

export default function CategoriesTab() {
  const dispatch = useAppDispatch()
  const { selectedCategory, error } = useAppSelector((s) => s.categories)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedCategory) {
      setShowForm(true)
    }
  }, [selectedCategory])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectCategory(null))
  }

  const handleAddNew = () => {
    dispatch(selectCategory(null))
    setShowForm(true)
  }

  return (
    <div className="categories-tab">
      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {!showForm && (
        <div className="tab-header">
          <h2>Categories</h2>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Category
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-section">
          <CategoryForm category={selectedCategory} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <CategoriesList />
        </div>
      )}
    </div>
  )
}

