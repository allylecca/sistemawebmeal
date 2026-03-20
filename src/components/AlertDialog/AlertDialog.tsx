import styles from './AlertDialog.module.css'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '../Button/Button'

type AlertDialogVariant = 'success' | 'danger' | 'warning'

type AlertDialogAction = {
  label: string
  onClick?: () => void
}

export type AlertDialogProps = {
  variant: AlertDialogVariant
  title: string
  description?: string
  primaryAction: AlertDialogAction
  secondaryAction?: AlertDialogAction
  className?: string
}

function cn(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ')
}

function Icon({ variant }: { variant: AlertDialogVariant }) {
  if (variant === 'success') {
    return (
      <CheckCircle2
        size={28}
        strokeWidth={2}
        color="var(--ds-success)"
        aria-hidden="true"
        focusable="false"
      />
    )
  }

  if (variant === 'danger') {
    return (
      <AlertTriangle
        size={28}
        strokeWidth={2}
        color="var(--ds-danger)"
        aria-hidden="true"
        focusable="false"
      />
    )
  }

  return (
    <AlertTriangle
      size={28}
      strokeWidth={2}
      color="var(--ds-warning)"
      aria-hidden="true"
      focusable="false"
    />
  )
}

export function AlertDialog({
  variant,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: AlertDialogProps) {
  return (
    <section className={cn(styles.card, className)} aria-label="Alert dialog">
      <div className={cn(styles.iconWrap, styles[`iconWrap_${variant}`])}>
        <Icon variant={variant} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      <div className={cn(styles.actions, styles[`actions_${variant}`])}>
        {variant === 'success' ? (
          <Button
            variant="primary"
            onClick={primaryAction.onClick}
            fullWidth
          >
            {primaryAction.label}
          </Button>
        ) : null}

        {variant === 'danger' ? (
          <>
            <Button
              variant="secondary"
              className={styles.dangerCancelButton}
              onClick={secondaryAction?.onClick}
              fullWidth
            >
              {secondaryAction?.label ?? 'Cancelar'}
            </Button>
            <Button
              variant="danger"
              onClick={primaryAction.onClick}
              fullWidth
            >
              {primaryAction.label}
            </Button>
          </>
        ) : null}

        {variant === 'warning' ? (
          <>
            <Button
              variant="secondary"
              onClick={secondaryAction?.onClick}
              fullWidth
            >
              {secondaryAction?.label ?? 'No, cancelar'}
            </Button>
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              fullWidth
            >
              {primaryAction.label}
            </Button>
          </>
        ) : null}
      </div>
    </section>
  )
}

