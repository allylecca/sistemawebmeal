import React, { useState } from 'react'
import { 
  ChevronRight, 
  ChevronDown, 
  Maximize2 
} from 'lucide-react'
import styles from './ProgrammaticAdvanceView.module.css'
import { RadialProgress } from '../GeneralSummaryView/SummaryCharts'

interface TableRow {
  id: string
  level: string
  badgeVariant: 'og' | 'oe' | 'r' | 'act' | 'subact' | 'ind'
  description: string
  unidad?: string
  meta?: string
  ejecucion?: string
  avance?: string
  children?: TableRow[]
}

const tableData: TableRow[] = [
  {
    id: 'og-1',
    level: 'OG',
    badgeVariant: 'og',
    description: 'Contribuir al desarrollo sostenible e inclusivo de comunidades vulnerables',
    children: [
      {
        id: 'oe-1',
        level: 'OE',
        badgeVariant: 'oe',
        description: 'Fortalecer las capacidades económicas de mujeres y familias rurales',
        children: [
          {
            id: 'r-1',
            level: 'R',
            badgeVariant: 'r',
            description: 'Mujeres incrementan sus ingresos mediante emprendimientos productivos',
            children: [
              {
                id: 'act-1',
                level: 'ACT',
                badgeVariant: 'act',
                description: 'Capacitación en producción agrícola sostenible',
                unidad: 'Talleres',
                meta: '30',
                ejecucion: '24',
                avance: '80.0%',
                children: [
                   {
                     id: 'subact-1',
                     level: 'SUBACT',
                     badgeVariant: 'subact',
                     description: 'Talleres de técnicas de cultivo orgánico',
                     unidad: 'Talleres',
                     meta: '15',
                     ejecucion: '13',
                     avance: '86.7%',
                     children: [
                        {
                          id: 'ind-1',
                          level: 'IND',
                          badgeVariant: 'ind',
                          description: '% de mujeres que aplican técnicas aprendidas',
                          unidad: 'Porcentaje',
                          meta: '80',
                          ejecucion: '62',
                          avance: '77.5%',
                        },
                        {
                          id: 'ind-2',
                          level: 'IND',
                          badgeVariant: 'ind',
                          description: 'N° de parcelas con prácticas sostenibles',
                          unidad: 'Número',
                          meta: '50',
                          ejecucion: '42',
                          avance: '84.0%',
                        }
                     ]
                   },
                   {
                     id: 'subact-2',
                     level: 'SUBACT',
                     badgeVariant: 'subact',
                     description: 'Capacitación en manejo post-cosecha',
                     unidad: 'Talleres',
                     meta: '15',
                     ejecucion: '11',
                     avance: '73.3%',
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

export const ProgrammaticAdvanceView: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>(['og-1', 'oe-1', 'r-1', 'act-1', 'subact-1'])

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const renderRows = (rows: TableRow[], depth = 0): React.ReactNode => {
    return rows.map(row => {
      const isExpanded = expandedRows.includes(row.id)
      const hasChildren = row.children && row.children.length > 0
      
      const badgeClass = styles[`badge${row.badgeVariant.toUpperCase()}`]
      const advanceClass = row.avance ? 
        row.avance.includes('80') ? styles.advance80 : 
        row.avance.includes('86') ? styles.advance86 : 
        styles.advance77 : ''

      return (
        <React.Fragment key={row.id}>
          <tr className={styles.tr}>
            <td className={styles.td} style={{ paddingLeft: `${depth * 24 + 16}px` }}>
              <div className={styles.levelCell}>
                {hasChildren && (
                  <button className={styles.expandButton} onClick={() => toggleRow(row.id)}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}
                {!hasChildren && <span style={{ width: 22 }} />}
                <span className={`${styles.badge} ${badgeClass}`}>{row.level}</span>
                <span style={{ marginLeft: 8 }}>{row.description}</span>
              </div>
            </td>
            <td className={styles.td}>{row.unidad || '—'}</td>
            <td className={styles.td} style={{ fontWeight: 700 }}>{row.meta || '—'}</td>
            <td className={styles.td} style={{ fontWeight: 700 }}>{row.ejecucion || '—'}</td>
            <td className={styles.td}>
               {row.avance ? <span className={`${styles.advanceBadge} ${advanceClass}`}>{row.avance}</span> : '—'}
            </td>
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
          <h2 className={styles.sectionTitle}>Indicadores Estratégicos</h2>
        </div>
        <div className={styles.indicatorsGrid}>
          {[
            { title: 'Indicador Institucional', value: 78, meta: 12, exec: 9, saldo: 3 },
            { title: 'Indicador Objetivo Específico', value: 65, meta: 20, exec: 13, saldo: 7 },
            { title: 'Indicador de Resultado', value: 72, meta: 18, exec: 13, saldo: 5 },
            { title: 'Actividades', value: 84, meta: 50, exec: 42, saldo: 8 },
          ].map((ind, i) => (
            <div key={i} className={styles.indicatorCard}>
              <div className={styles.indicatorCardTitle}>
                 <div style={{ width: 2, height: 16, background: '#f07f59' }} />
                 {ind.title}
              </div>
              <RadialProgress value={ind.value} size={130} strokeWidth={15} small />
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  <span>Meta</span>
                  <span style={{ fontWeight: 700 }}>{ind.meta}</span>
                </div>
                <div style={{ margin: '8px 0', height: 16, background: '#fdf2ed', border: '1px solid #1a1a1a', position: 'relative' }}>
                   <div style={{ width: `${ind.value}%`, height: '100%', background: '#f07f59', borderRight: '1px solid #1a1a1a' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                   <span>Ejecutado</span>
                   <span style={{ fontWeight: 700 }}>{ind.exec}</span>
                </div>
                <div style={{ margin: '8px 0', height: 16, background: '#fdf2ed', border: '1px solid #1a1a1a', position: 'relative' }}>
                   <div style={{ width: '25%', height: '100%', background: '#f07f59', borderRight: '1px solid #1a1a1a', position: 'absolute', right: 0 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                   <span>Saldo</span>
                   <span style={{ fontWeight: 700 }}>{ind.saldo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Seguimiento Técnico</h2>
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
           <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer' }}>Colapsar todo</button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th} style={{ width: '50%' }}>NIVEL / DESCRIPCIÓN</th>
                <th className={styles.th}>UNIDAD</th>
                <th className={styles.th}>META</th>
                <th className={styles.th}>EJECUCIÓN</th>
                <th className={styles.th}>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {renderRows(tableData)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
