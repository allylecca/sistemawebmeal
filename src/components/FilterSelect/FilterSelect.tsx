import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import styles from './FilterSelect.module.css'

interface FilterSelectProps {
  label: string
  placeholder?: string
  width?: string | number
  className?: string
  options?: string[]
  onChange?: (value: any) => void
  value?: any
  isMulti?: boolean
}

export function FilterSelect({ label, placeholder, width, className, options = [], onChange, value, isMulti = false }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalSelected, setInternalSelected] = useState<any>(isMulti ? [] : '')
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const selected = value !== undefined ? value : internalSelected

  const displayValue = () => {
    if (isMulti) {
      const arr = (selected as string[]) || []
      if (arr.length === 0) return placeholder || label
      if (arr.length === 1) return arr[0]
      return `${arr.length} seleccionados`
    }
    return (selected as string) || placeholder || label
  }

  const handleSelect = (option: string) => {
    setSearchTerm('')
    if (isMulti) {
      const current = (selected as string[]) || []
      const isSelected = current.includes(option)
      let newSelected: string[]
      if (isSelected) {
        newSelected = current.filter(item => item !== option)
      } else {
        newSelected = [...current, option]
      }
      
      if (onChange) {
        onChange(newSelected)
      } else {
        setInternalSelected(newSelected)
      }
    } else {
      const newVal = option === selected ? '' : option
      if (onChange) {
        onChange(newVal)
      } else {
        setInternalSelected(newVal)
      }
      setIsOpen(false)
    }
  }

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasSelection = isMulti ? ((selected as string[])?.length > 0) : Boolean(selected)

  return (
    <div className={`${styles.root} ${className || ''}`} style={{ width }} ref={containerRef}>
      {(hasSelection || isOpen) && (
        <div className={`${styles.label} ${isOpen ? styles.labelActive : ''}`}>
          {label}
        </div>
      )}
      <div 
        className={`${styles.container} ${isOpen ? styles.containerActive : ''}`} 
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <input
            type="text"
            className={`${styles.value} ${hasSelection && !searchTerm ? styles.valueSelected : ''}`}
            style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={displayValue() as string}
            autoFocus
          />
        ) : (
          <span className={`${styles.value} ${hasSelection ? styles.valueSelected : ''}`}>
            {displayValue()}
          </span>
        )}
        <ChevronDown 
          size={18} 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
          onClick={(e) => { 
            e.stopPropagation()
            if (isOpen) setSearchTerm('')
            setIsOpen(!isOpen) 
          }} 
        />
      </div>

      {isOpen && options.length > 0 && (
        <div className={styles.dropdown} style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {filteredOptions.length === 0 ? (
            <div className={styles.option} style={{ color: '#999', cursor: 'default' }}>Sin resultados</div>
          ) : (
            filteredOptions.map((option) => {
            const isSelected = isMulti 
              ? ((selected as string[]) || []).includes(option)
              : selected === option;

            return (
              <div 
                key={option} 
                className={styles.option}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(option)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isMulti && (
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                  )}
                  <span>{option}</span>
                </div>
                {!isMulti && isSelected && <Check size={16} className={styles.checkIcon} />}
              </div>
            )
          }))}
        </div>
      )}
    </div>
  )
}
