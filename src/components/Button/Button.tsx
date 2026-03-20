import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
export type ButtonSize = 'xs' | 's' | 'm'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  circle?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'm',
  leftIcon,
  rightIcon,
  fullWidth = false,
  circle = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth ? 'true' : 'false'}
      data-circle={circle ? 'true' : 'false'}
      {...props}
    >

      {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}
      <span className={styles.content}>{children}</span>
      {rightIcon ? <span className={styles.icon}>{rightIcon}</span> : null}
    </button>
  )
}
