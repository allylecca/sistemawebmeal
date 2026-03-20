import type { InputHTMLAttributes } from 'react'
import { useId, useRef, useEffect } from 'react'
import { Check, Minus, X } from 'lucide-react'
import styles from './Checkbox.module.css'

export type CheckboxStatus = 'default' | 'success' | 'error'

export type CheckboxProps = {
  label?: string
  circle?: boolean
  indeterminate?: boolean
  status?: CheckboxStatus
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'>

export function Checkbox({
  label,
  circle = false,
  indeterminate = false,
  status = 'default',
  disabled,
  checked,
  ...props
}: CheckboxProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div 
      className={styles.root} 
      data-circle={circle ? 'true' : 'false'}
      data-status={status}
      data-disabled={disabled ? 'true' : 'false'}
    >
      <div className={styles.checkboxWrapper}>
        <input
          id={id}
          type="checkbox"
          className={styles.input}
          disabled={disabled}
          checked={checked}
          ref={inputRef}
          {...props}
        />
        <div className={styles.checkbox}>
          {indeterminate ? (
            <Minus size={10} strokeWidth={4} className={styles.icon} />
          ) : checked ? (
            circle && status === 'error' ? (
              <X size={10} strokeWidth={3} className={styles.icon} />
            ) : (
              <Check size={circle ? 10 : 12} strokeWidth={4} className={styles.icon} />
            )
          ) : null}
        </div>
      </div>
      {label ? (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      ) : null}
    </div>
  )
}

