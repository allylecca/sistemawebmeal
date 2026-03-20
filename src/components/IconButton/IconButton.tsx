import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
}

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <button className={`${styles.button} ${className || ''}`} {...props}>
      {icon}
    </button>
  )
}
