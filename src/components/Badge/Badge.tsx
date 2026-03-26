import styles from './Badge.module.css'

export type BadgeVariant = 
  | 'region' 
  | 'country' 
  | 'province'
  | 'dept' 
  | 'line' 
  | 'result' 
  | 'product'
  | 'og'
  | 'og-group'
  | 'oe'
  | 'oe-group'
  | 'result-group'
  | 'act'
  | 'act-group'
  | 'subact'
  | 'subact-group'
  | 'indicador'
  | 'resultado-indicador'
  | 'objetivo-indicador'

interface BadgeProps {
  children: React.ReactNode
  variant: BadgeVariant
  className?: string
}

export function Badge({ children, variant, className }: BadgeProps) {
  const isGroup = variant.endsWith('-group')
  
  return (
    <span className={`${styles.badge} ${className || ''}`} data-variant={variant}>
      {isGroup && <span className={styles.dot} />}
      {children}
    </span>
  )
}
