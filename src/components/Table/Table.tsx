import { Pencil, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Checkbox } from '../Checkbox/Checkbox'
import styles from './Table.module.css'
import type { ReactNode } from 'react'

export type Column<T> = {
  key: keyof T | 'actions' | 'checkbox'
  header: ReactNode
  render?: (value: any, item: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onSelect?: (items: T[]) => void
  className?: string
  reorderableColumns?: boolean
  fixedColumnKeys?: Array<string>
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onSelect,
  className,
  reorderableColumns,
  fixedColumnKeys
}: TableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
  const [headerChecked, setHeaderChecked] = useState(false)
  const [dragKey, setDragKey] = useState<string | null>(null)
  const [movableKeys, setMovableKeys] = useState<string[]>([])

  const fixedKeysSet = new Set((fixedColumnKeys || []).map(String))
  fixedKeysSet.add('checkbox')
  fixedKeysSet.add('actions')

  useEffect(() => {
    if (!reorderableColumns) return
    const movable = columns
      .filter(c => !fixedKeysSet.has(String(c.key)))
      .map(c => String(c.key))

    setMovableKeys(prev => {
      if (prev.length === 0) return movable
      const next = prev.filter(k => movable.includes(k))
      for (const k of movable) {
        if (!next.includes(k)) next.push(k)
      }
      return next
    })
  }, [columns, reorderableColumns, fixedColumnKeys])

  const orderedColumns = (() => {
    if (!reorderableColumns) return columns

    const byKey = new Map<string, Column<T>>()
    for (const c of columns) byKey.set(String(c.key), c)

    const fixed: Column<T>[] = []
    const movable: Column<T>[] = []

    for (const k of movableKeys) {
      const c = byKey.get(k)
      if (c) movable.push(c)
    }

    for (const c of columns) {
      if (fixedKeysSet.has(String(c.key))) fixed.push(c)
    }

    return [...movable, ...fixed]
  })()

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelect) {
      const selectedItems = data.filter(item => selectedIds.has(item.id))
      onSelect(selectedItems)
    }
  }, [selectedIds, data, onSelect])

  const handleSelectAll = () => {
    if (headerChecked) {
      setSelectedIds(new Set())
      setHeaderChecked(false)
    } else {
      setSelectedIds(new Set(data.map(item => item.id)))
      setHeaderChecked(true)
    }
  }

  const handleSelectItem = (id: string | number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    
    // User requirement: When selecting one by one, header remains empty
    setHeaderChecked(false)
  }

  return (
    <table className={`${styles.root} ${className || ''}`}>
      <thead>
        <tr>
          {orderedColumns.map((col, i) => {
            const isFixed = fixedKeysSet.has(String(col.key))
            const isMovable = reorderableColumns && !isFixed
            const isSelect = col.key === 'checkbox'
            const isActions = col.key === 'actions'

            return (
            <th
              key={i}
              className={`${styles.th} ${isSelect ? styles.stickyLeftTh : ''} ${isActions ? styles.stickyRightTh : ''}`}
              draggable={Boolean(isMovable)}
              onDragStart={() => {
                if (!isMovable) return
                setDragKey(String(col.key))
              }}
              onDragOver={(e) => {
                if (!isMovable) return
                e.preventDefault()
              }}
              onDrop={() => {
                if (!isMovable) return
                if (!dragKey) return
                const dropKey = String(col.key)
                if (dropKey === dragKey) return
                setMovableKeys(prev => {
                  if (!prev.includes(dragKey) || !prev.includes(dropKey)) return prev
                  const next = prev.filter(k => k !== dragKey)
                  const dropIndex = next.indexOf(dropKey)
                  next.splice(dropIndex, 0, dragKey)
                  return next
                })
                setDragKey(null)
              }}
              style={{
                width: col.width,
                textAlign: col.align || (col.key === 'actions' ? 'right' : 'left'),
                paddingRight: col.key === 'actions' ? '32px' : '16px'
              }}
            >
              {col.key === 'checkbox' ? (
                <div style={{ paddingLeft: '8px' }}>
                  <Checkbox 
                    checked={headerChecked}
                    onChange={handleSelectAll}
                  />
                </div>
              ) : col.header}
            </th>
          )})}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className={selectedIds.has(item.id) ? styles.rowSelected : ''}>
            {orderedColumns.map((col, j) => (
              <td
                key={j}
                className={`${styles.td} ${col.key === 'checkbox' ? styles.stickyLeftTd : ''} ${col.key === 'actions' ? styles.stickyRightTd : ''}`}
                style={{ textAlign: col.align || (col.key === 'actions' ? 'right' : 'left') }}
              >
                {col.key === 'checkbox' && (
                  <div style={{ paddingLeft: '8px' }}>
                    <Checkbox 
                      checked={selectedIds.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>
                )}
                {col.key === 'actions' && (
                  <div className={styles.actions}>
                    {onEdit && (
                      <button className={styles.actionButton} onClick={() => onEdit(item)}>
                        <Pencil size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button className={`${styles.actionButton} ${styles.deleteAction}`} onClick={() => onDelete(item)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                )}
                {col.key !== 'checkbox' && col.key !== 'actions' && (
                  col.render ? col.render(item[col.key as keyof T], item) : (item[col.key as keyof T] as any)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
