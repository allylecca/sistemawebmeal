import { CheckCircle2, XCircle, Circle } from 'lucide-react'
import styles from './StatusIndicator.module.css'

export type StatusIndicatorType = 'check' | 'x' | 'none'

interface StatusIndicatorProps {
  status: StatusIndicatorType
  onChange?: (status: StatusIndicatorType) => void
  className?: string
}

export function StatusIndicator({ status, onChange, className }: StatusIndicatorProps) {
  const isInteractive = Boolean(onChange)

  return (
    <div className={`${styles.group} ${className || ''}`}>
      <button
        type="button"
        className={`${styles.icon} ${isInteractive ? styles.clickable : ''} ${status === 'check' ? styles.check : ''}`}
        onClick={onChange ? () => onChange('check') : undefined}
      >
        <CheckCircle2 size={16} />
      </button>
      <button
        type="button"
        className={`${styles.icon} ${isInteractive ? styles.clickable : ''} ${status === 'x' ? styles.x : ''}`}
        onClick={onChange ? () => onChange('x') : undefined}
      >
        <XCircle size={16} />
      </button>
      <button
        type="button"
        className={`${styles.icon} ${isInteractive ? styles.clickable : ''} ${status === 'none' ? styles.none : ''}`}
        onClick={onChange ? () => onChange('none') : undefined}
      >
        <Circle size={16} />
      </button>
    </div>
  )
}
