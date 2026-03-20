import { AlertDialog, type AlertDialogProps } from './AlertDialog'
import styles from './AlertDialog.module.css'

interface AlertModalProps extends AlertDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AlertModal({ isOpen, onClose, ...props }: AlertModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog {...props} />
      </div>
    </div>
  )
}
