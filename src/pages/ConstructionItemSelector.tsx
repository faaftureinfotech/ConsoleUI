import { useEffect, useState } from 'react'
import apiClient from '../utils/apiClient'
import type { ItemNode } from '../store/slices/quotationSlice'

interface SubCategoryNode {
  id: number
  name: string
  items: ItemNode[]
}

interface CategoryNode {
  id: number
  name: string
  subCategories: SubCategoryNode[]
}

interface Props {
  onItemSelect: (item: ItemNode) => void
}

export default function ConstructionItemSelector({ onItemSelect }: Props) {
  const [tree, setTree] = useState<CategoryNode[]>([])
  const [activeCat, setActiveCat] = useState<CategoryNode | null>(null)
  const [activeSub, setActiveSub] = useState<SubCategoryNode | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    apiClient
      .get<CategoryNode[]>('/item-categories/tree')
      .then((res) => {
        // Ensure we always have an array
        const data = res.data
        if (Array.isArray(data)) {
          setTree(data)
        } else if (data && Array.isArray(data.data)) {
          // Handle case where response is wrapped in data property
          setTree(data.data)
        } else {
          console.warn('Unexpected API response format:', data)
          setTree([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch item categories:', err)
        setError(err.response?.data?.message || 'Failed to load categories')
        setTree([]) // Ensure tree is always an array
        setLoading(false)
      })
  }, [])

  const filteredItems =
    activeSub?.items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    ) ?? []

  if (loading) {
    return (
      <div className='selector-wrapper'>
        <div className='selector-loading'>Loading categories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='selector-wrapper'>
        <div className='selector-error'>{error}</div>
      </div>
    )
  }

  return (
    <div className='selector-wrapper'>
      <div className='selector-column'>
        <div className='selector-title'>Category</div>
        {Array.isArray(tree) && tree.length > 0 ? (
          tree.map((cat) => (
            <button
              key={cat.id}
              className={
                'selector-pill ' +
                (activeCat?.id === cat.id ? 'selector-pill-active' : '')
              }
              onClick={() => {
                setActiveCat(cat)
                setActiveSub(null)
              }}
            >
              {cat.name}
            </button>
          ))
        ) : (
          <div className='selector-empty'>No categories available</div>
        )}
      </div>

      <div className='selector-column'>
        <div className='selector-title'>Subcategory</div>
        {activeCat && Array.isArray(activeCat.subCategories) && activeCat.subCategories.length > 0 ? (
          activeCat.subCategories.map((sub) => (
            <button
              key={sub.id}
              className={
                'selector-pill ' +
                (activeSub?.id === sub.id ? 'selector-pill-active-green' : '')
              }
              onClick={() => setActiveSub(sub)}
            >
              {sub.name}
            </button>
          ))
        ) : (
          <div className='selector-empty'>Select a category</div>
        )}
      </div>

      <div className='selector-column selector-items'>
        <div className='selector-title'>Items</div>
        <input
          className='selector-search'
          placeholder='Search item…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className='selector-item-row'
              onClick={() => onItemSelect(item)}
            >
              <div>
                <div className='selector-item-name'>{item.name}</div>
                <div className='selector-item-meta'>
                  Unit: {item.unit} | Rate: {item.defaultRate}
                </div>
              </div>
              <button className='selector-add-btn'>Add</button>
            </div>
          ))
        ) : (
          <div className='selector-empty'>
            {activeSub ? 'No items found' : 'Select a subcategory'}
          </div>
        )}
      </div>
    </div>
  )
}
