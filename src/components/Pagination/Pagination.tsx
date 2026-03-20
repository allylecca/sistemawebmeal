import {
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight
} from 'lucide-react'
import styles from './Pagination.module.css'

interface PaginationProps {
  total: number
  range: string
  rowsPerPage?: number
  className?: string
}

export function Pagination({ total, range, rowsPerPage = 50, className }: PaginationProps) {
  return (
    <footer className={`${styles.footer} ${className || ''}`}>
      <div className={styles.pageInfo}>
        Filas por página
        <div className={styles.rowsSelect}>
          {rowsPerPage} <ChevronDown size={14} />
        </div>
      </div>

      <div className={styles.pagination}>
        <span>Mostrando del {range} | Total: {total} Registros</span>
        <div className={styles.navArrows}>
          <div className={styles.navArrow}><ChevronsLeft size={16} /></div>
          <div className={styles.navArrow}><ChevronLeft size={16} /></div>
          <span className={styles.pageNumber}>1/1</span>
          <div className={styles.navArrow}><ChevronRight size={16} /></div>
          <div className={styles.navArrow}><ChevronsRight size={16} /></div>
        </div>
      </div>
    </footer>
  )
}
