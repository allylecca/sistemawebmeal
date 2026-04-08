import React, { useState } from 'react'
import { 
  ChevronRight, 
  ChevronDown, 
  Maximize2 
} from 'lucide-react'
import styles from './PACAdvanceView.module.css'
import tableStyles from '../ProgrammaticAdvanceView/ProgrammaticAdvanceView.module.css'

interface PACValue {
  meta: string
  exec: string
  avance: string
}

interface TableRow {
  id: string
  level: string
  badgeVariant: 'og' | 'oe' | 'r' | 'act' | 'subact' | 'ind'
  description: string
  unidad?: string
  previo?: PACValue
  actual?: PACValue
  total?: PACValue
  children?: TableRow[]
}

const pacData: TableRow[] = [
  {
    id: 'og-pac1',
    level: 'OG',
    badgeVariant: 'og',
    description: 'Mejorar las condiciones de vida de personas en situación de vulnerabilidad',
    children: [
      {
        id: 'oe-pac1',
        level: 'OE',
        badgeVariant: 'oe',
        description: 'Garantizar el acceso a educación de calidad para niños, niñas y adolescentes',
        children: [
          {
            id: 'r-pac1',
            level: 'R',
            badgeVariant: 'r',
            description: 'Niños/as y adolescentes mejoran su rendimiento escolar',
            children: [
              {
                id: 'act-pac1',
                level: 'ACT',
                badgeVariant: 'act',
                description: 'Programas de refuerzo escolar y acompañamiento pedagógico',
                unidad: 'Programas',
                previo: { meta: '0', exec: '0', avance: '—' },
                actual: { meta: '40', exec: '32', avance: '80.0%' },
                total: { meta: '40', exec: '32', avance: '80.0%' },
                children: [
                  {
                    id: 'subact-pac1',
                    level: 'SUBACT',
                    badgeVariant: 'subact',
                    description: 'Sesiones de tutoría personalizada',
                    unidad: 'Sesiones',
                    previo: { meta: '0', exec: '0', avance: '—' },
                    actual: { meta: '200', exec: '165', avance: '82.5%' },
                    total: { meta: '200', exec: '165', avance: '82.5%' },
                    children: [
                      {
                        id: 'ind-pac1',
                        level: 'IND',
                        badgeVariant: 'ind',
                        description: 'Niños/as con acceso a educación de refuerzo',
                        unidad: 'Personas',
                        previo: { meta: '0', exec: '0', avance: '—' },
                        actual: { meta: '800', exec: '620', avance: '77.5%' },
                        total: { meta: '800', exec: '620', avance: '77.5%' },
                      }
                    ]
                  },
                  {
                    id: 'subact-pac2',
                    level: 'SUBACT',
                    badgeVariant: 'subact',
                    description: 'Talleres de formación docente',
                    unidad: 'Talleres',
                    previo: { meta: '0', exec: '0', avance: '—' },
                    actual: { meta: '30', exec: '24', avance: '80.0%' },
                    total: { meta: '30', exec: '24', avance: '80.0%' },
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export const PACAdvanceView: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>(['og-pac1', 'oe-pac1', 'r-pac1', 'act-pac1'])

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const renderValueCells = (val?: PACValue) => {
    return (
      <>
        <td className={`${styles.td} ${styles.tdCenter}`}>{val?.meta || '—'}</td>
        <td className={`${styles.td} ${styles.tdCenter}`}>{val?.exec || '—'}</td>
        <td className={`${styles.td} ${styles.tdCenter}`}>
           {val?.avance && val.avance !== '—' ? (
             <span className={`${tableStyles.advanceBadge} ${tableStyles.advance80}`}>{val.avance}</span>
           ) : '—'}
        </td>
      </>
    )
  }

  const renderRows = (rows: TableRow[], depth = 0): React.ReactNode => {
    return rows.map(row => {
      const isExpanded = expandedRows.includes(row.id)
      const hasChildren = row.children && row.children.length > 0
      
      const badgeClass = tableStyles[`badge${row.badgeVariant.toUpperCase()}`]

      return (
        <React.Fragment key={row.id}>
          <tr className={styles.tr}>
            <td className={styles.td} style={{ paddingLeft: `${depth * 24 + 16}px` }}>
              <div className={styles.levelCell}>
                {hasChildren && (
                  <button className={tableStyles.expandButton} onClick={() => toggleRow(row.id)}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
                {!hasChildren && <span style={{ width: 22 }} />}
                <span className={`${tableStyles.badge} ${badgeClass}`}>{row.level}</span>
                <span style={{ marginLeft: 8 }}>{row.description}</span>
              </div>
            </td>
            <td className={styles.td}>{row.unidad || '—'}</td>
            {renderValueCells(row.previo)}
            {renderValueCells(row.actual)}
            {renderValueCells(row.total)}
          </tr>
          {isExpanded && hasChildren && renderRows(row.children!, depth + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Avance PAC — Seguimiento de Metas y Ejecución</h2>
          <button className={styles.maximizeButton}><Maximize2 size={16} /></button>
        </div>

        <div className={styles.legendBar}>
           <div className={styles.legendItem} style={{ background: '#fff7ed', borderColor: '#f07f59' }}>
              <div className={styles.legendDot} style={{ background: '#f07f59' }}></div>
              Objetivo General
           </div>
           <div className={styles.legendItem} style={{ background: '#fefce8', borderColor: '#fec354' }}>
              <div className={styles.legendDot} style={{ background: '#fec354' }}></div>
              Objetivo Específico
           </div>
           <div className={styles.legendItem} style={{ background: '#f0fdfa', borderColor: '#0d9488' }}>
              <div className={styles.legendDot} style={{ background: '#0d9488' }}></div>
              Resultado
           </div>
           <div className={styles.legendItem} style={{ background: '#ecfdf5', borderColor: '#0f766e' }}>
              <div className={styles.legendDot} style={{ background: '#0f766e' }}></div>
              Actividades
           </div>
           <div className={styles.legendItem} style={{ background: '#fff7ed', borderColor: '#f97316' }}>
              <div className={styles.legendDot} style={{ background: '#f97316' }}></div>
              Subactividad
           </div>
           <div className={styles.legendItem} style={{ background: '#f1f5f9', borderColor: '#94a3b8' }}>
              <div className={styles.legendDot} style={{ background: '#94a3b8' }}></div>
              Indicador
           </div>
           <div style={{ flex: 1 }} />
           <button className={styles.collapseButton}>Colapsar todo</button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th rowSpan={2} className={`${styles.th} ${styles.thMain}`} style={{ width: '40%' }}>NIVEL / DESCRIPCIÓN</th>
                <th rowSpan={2} className={styles.th}>UNIDAD</th>
                <th colSpan={3} className={`${styles.th} ${styles.thPeriod}`}>AVANCE PREVIO HASTA<br/>01/01/2023</th>
                <th colSpan={3} className={`${styles.th} ${styles.thPeriod}`}>ACTUAL PAC (01/01/2023<br/>AL 01/01/2026)</th>
                <th colSpan={3} className={`${styles.th} ${styles.thPeriod}`}>TOTAL PROYECTO</th>
              </tr>
              <tr>
                {/* Previo */}
                <th className={`${styles.th} ${styles.thSub}`}>META</th>
                <th className={`${styles.th} ${styles.thSub}`}>EJEC.</th>
                <th className={`${styles.th} ${styles.thSub}`}>% AVANCE</th>
                {/* Actual */}
                <th className={`${styles.th} ${styles.thSub}`}>META</th>
                <th className={`${styles.th} ${styles.thSub}`}>EJEC.</th>
                <th className={`${styles.th} ${styles.thSub}`}>% AVANCE</th>
                {/* Total */}
                <th className={`${styles.th} ${styles.thSub}`}>META</th>
                <th className={`${styles.th} ${styles.thSub}`}>EJEC.</th>
                <th className={`${styles.th} ${styles.thSub}`}>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {renderRows(pacData)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
