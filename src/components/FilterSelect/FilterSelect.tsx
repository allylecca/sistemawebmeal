import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './FilterSelect.module.css'

interface FilterSelectProps {
  label: string
  placeholder?: string
  width?: string | number
  className?: string
  options?: string[]
  onChange?: (value: string) => void
  value?: string
}

export function FilterSelect({ label, placeholder, width, className, options = [], onChange, value }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalSelected, setInternalSelected] = useState('')

  const selected = value !== undefined ? value : internalSelected

  return (
    <div className={`${styles.root} ${className || ''}`} style={{ width }}>
      {(selected || isOpen) && (
        <div className={`${styles.label} ${isOpen ? styles.labelActive : ''}`}>
          {label}
        </div>
      )}
      <div 
        className={`${styles.container} ${isOpen ? styles.containerActive : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${styles.value} ${selected ? styles.valueSelected : ''}`}>
          {selected || placeholder || label}
        </span>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
      </div>

      {isOpen && options.length > 0 && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div 
              key={option} 
              className={styles.option}
              onClick={() => {
                if (onChange) {
                  onChange(option === selected ? '' : option)
                } else {
                  setInternalSelected(option === selected ? '' : option)
                }
                setIsOpen(false)
              }}
            >
              {option}
              {selected === option && <Check size={16} className={styles.checkIcon} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
