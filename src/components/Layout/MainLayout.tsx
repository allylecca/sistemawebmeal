import styles from './MainLayout.module.css'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export function MainLayout({ sidebar, children }: MainLayoutProps) {
  return (
    <div className={styles.root}>
      {sidebar}
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
