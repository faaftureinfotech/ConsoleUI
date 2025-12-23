import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchBoqMasters } from '../../store/slices/boqMasterSlice'
import { fetchCategories } from '../../store/slices/categoriesSlice'
import { fetchUnits } from '../../store/slices/unitsSlice'
import type { BoqMaster } from '../../store/slices/boqMasterSlice'
import './BoqMasterSelector.css'

interface Props {
  onBoqMasterSelect: (boqMaster: BoqMaster) => void
}

export default function BoqMasterSelector({ onBoqMasterSelect }: Props) {
  const dispatch = useAppDispatch()
  const { list: boqMasters, loading } = useAppSelector((s) => s.boqMaster)
  const { list: categories } = useAppSelector((s) => s.categories)
  const { list: units } = useAppSelector((s) => s.units)

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchBoqMasters())
    dispatch(fetchCategories())
    dispatch(fetchUnits())
  }, [dispatch])

  const getUnitName = (unitId: number) => {
    const unit = units.find((u) => u.id === unitId)
    return unit ? unit.name : '-'
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : '-'
  }

  const filteredBoqMasters = boqMasters.filter((master) => {
    const matchesCategory = selectedCategoryId === null || master.categoryId === selectedCategoryId
    const matchesSearch =
      master.name.toLowerCase().includes(search.toLowerCase()) ||
      (master.description || '').toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(master.categoryId).toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="boq-master-selector-wrapper">
        <div className="selector-loading">Loading BOQ Masters...</div>
      </div>
    )
  }

  return (
    <div className="boq-master-selector-wrapper">
      <div className="selector-column">
        <div className="selector-title">Category</div>
        <button
          className={`selector-pill ${selectedCategoryId === null ? 'selector-pill-active' : ''}`}
          onClick={() => setSelectedCategoryId(null)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`selector-pill ${selectedCategoryId === category.id ? 'selector-pill-active' : ''}`}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="selector-column selector-items">
        <div className="selector-title">BOQ Masters</div>
        <input
          className="selector-search"
          placeholder="Search BOQ master…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredBoqMasters.length > 0 ? (
          filteredBoqMasters.map((master) => (
            <div
              key={master.id}
              className="selector-item-row"
              onClick={() => onBoqMasterSelect(master)}
            >
              <div>
                <div className="selector-item-name">{master.name}</div>
                <div className="selector-item-meta">
                  Category: {getCategoryName(master.categoryId)} | Unit: {getUnitName(master.defaultUnitId)} | Rate: ₹
                  {master.defaultRate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                {master.description && (
                  <div className="selector-item-description">{master.description}</div>
                )}
              </div>
              <button className="selector-add-btn">Add</button>
            </div>
          ))
        ) : (
          <div className="selector-empty">
            {search || selectedCategoryId ? 'No BOQ masters found' : 'No BOQ masters available'}
          </div>
        )}
      </div>
    </div>
  )
}

