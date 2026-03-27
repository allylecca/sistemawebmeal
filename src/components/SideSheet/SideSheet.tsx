import { useEffect, useRef } from 'react'
import { X, Pencil } from 'lucide-react'
import styles from './SideSheet.module.css'

interface SideSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  onEdit?: () => void
}

export function SideSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onEdit
}: SideSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet} ref={sheetRef}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title} title={title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.headerActions}>
            {onEdit && (
              <button className={styles.editButton} onClick={onEdit} title="Editar">
                <Pencil size={20} />
              </button>
            )}
            <button className={styles.closeButton} onClick={onClose} title="Cerrar">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}
