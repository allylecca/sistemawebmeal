import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { Check, X } from 'lucide-react'
import styles from './InputText.module.css'

export type InputTextStatus = 'default' | 'success' | 'error'

export type InputTextProps = {
  label: string
  status?: InputTextStatus
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>

export function InputText({
  label,
  status = 'default',
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...inputProps
}: InputTextProps) {
  const id = useId()

  const showSuccessIcon = status === 'success' && !rightIcon
  const showErrorIcon = status === 'error' && !rightIcon

  return (
    <div
      className={styles.root}
      data-status={status}
      data-disabled={disabled ? 'true' : 'false'}
      data-full-width={fullWidth ? 'true' : 'false'}
    >
      <label className={styles.label} htmlFor={id}>
        <span className={styles.labelText}>{label}</span>
      </label>
      <div className={styles.field}>
        {leftIcon ? <span className={styles.iconLeft}>{leftIcon}</span> : null}
        <input
          id={id}
          disabled={disabled}
          className={styles.input}
          {...inputProps}
        />
        <span className={styles.iconRight}>
          {rightIcon}
          {showSuccessIcon ? <Check size={14} /> : null}
          {showErrorIcon ? <X size={14} /> : null}
        </span>
      </div>
      {helperText ? (
        <p className={styles.helper} data-status={status}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

