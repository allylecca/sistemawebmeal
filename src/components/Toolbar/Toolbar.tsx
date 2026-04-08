import { Plus, Download, RefreshCcw, SlidersHorizontal, TableProperties } from 'lucide-react'
import { IconButton } from '../IconButton/IconButton'
import styles from './Toolbar.module.css'
import type { ReactNode } from 'react'

interface ToolbarProps {
  children?: ReactNode
  onNew?: () => void
  onExport?: () => void
  onRefresh?: () => void
  onFilterToggle?: () => void
  onColumnToggle?: () => void
  showExtraActions?: boolean
  newLabel?: string
}

export function Toolbar({
  children,
  onNew,
  onExport,
  onRefresh,
  onFilterToggle,
  onColumnToggle,
  newLabel = 'Nuevo'
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {children}

      <div className={styles.actions}>
        {onFilterToggle && <IconButton icon={<SlidersHorizontal size={18} />} onClick={onFilterToggle} />}
        {onColumnToggle && <IconButton icon={<TableProperties size={18} />} onClick={onColumnToggle} />}
        {onRefresh && <IconButton icon={<RefreshCcw size={18} />} onClick={onRefresh} />}
        
        {onNew && (
          <button className={styles.newButton} onClick={onNew}>
            <Plus size={18} /> {newLabel}
          </button>
        )}
        
        {onExport && (
          <button className={styles.exportButton} onClick={onExport}>
            <Download size={18} /> Exportar
          </button>
        )}
      </div>
    </div>
  )
}
