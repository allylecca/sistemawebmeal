import { useState } from 'react'
import {
  ChevronDown,
  Calendar,
  SlidersHorizontal,
  RefreshCcw,
  Download
} from 'lucide-react'
import styles from './ProjectView.module.css'

type Tab = 'resumen' | 'avance' | 'beneficiarios' | 'presupuesto' | 'pac'

export function DashboardView() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.filterBar}>
        <div className={styles.filterSelect}>
          Programa <ChevronDown size={14} />
        </div>
        <div className={styles.filterSelect}>
          Proyecto <ChevronDown size={14} />
        </div>
        <div className={styles.filterSelect}>
          Subproyecto <ChevronDown size={14} />
        </div>
        <div className={styles.filterDate}>
          Fecha Inicio <Calendar size={14} />
        </div>
        <div className={styles.filterDate}>
          Fecha Fin <Calendar size={14} />
        </div>
        <button className={styles.primaryButton}>Filtrar</button>
        <div className={styles.filterActions}>
          <button className={styles.iconButton}>
            <SlidersHorizontal size={18} />
          </button>
          <button className={styles.iconButton}>
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className={styles.mainScrollableContent}>
        <div className={styles.contentHeader}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Resumen General</h1>
            <p className={styles.subtitle}>Última actualización</p>
          </div>
          <button className={styles.exportButton}>
            <Download size={18} />
            Exportar
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'resumen' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resumen')}
          >
            Resumen General
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'avance' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('avance')}
          >
            Avance programático
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'beneficiarios' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('beneficiarios')}
          >
            Beneficiarios y Atendidos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'presupuesto' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('presupuesto')}
          >
            Presupuesto
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pac' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pac')}
          >
            Avance PAC
          </button>
        </div>

        <div className={styles.emptyContent} />
      </div>
    </div>
  )
}
