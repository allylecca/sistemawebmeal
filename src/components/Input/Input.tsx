import { useState } from 'react'
import styles from './Input.module.css'

interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  className?: string
  disabled?: boolean
  multiline?: boolean
  grow?: boolean
  width?: string | number
}

export function Input({ label, value, onChange, type = 'text', className, disabled, multiline, grow, width }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const isFloating = isFocused || value.length > 0

  return (
    <div className={`${styles.root} ${grow ? styles.grow : ''} ${className || ''}`} style={{ width }} data-disabled={disabled}>
      <label 
        className={`
          ${styles.label} 
          ${isFloating ? styles.labelFloating : ''} 
          ${isFocused ? styles.labelFocused : ''}
        `}
      >
        {label}
      </label>
      <div className={`${styles.inputContainer} ${isFocused ? styles.inputContainerFocused : ''} ${multiline ? styles.inputContainerMultiline : ''}`}>
        {multiline ? (
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
          />
        ) : (
          <input
            type={type}
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  )
}
