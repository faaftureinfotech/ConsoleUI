import { SortDirection } from '../hooks/useTableSort'

export function getSortClassName(
  getSortDirection: (key: any) => SortDirection,
  columnKey: any
): string {
  const direction = getSortDirection(columnKey)
  const baseClass = 'sortable'
  if (direction === 'asc') {
    return `${baseClass} sort-asc`
  } else if (direction === 'desc') {
    return `${baseClass} sort-desc`
  }
  return baseClass
}

