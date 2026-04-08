import React, { useState } from 'react'
import { 
  Users, 
  UserPlus, 
  Repeat, 
  UserCheck,
  ChevronRight, 
  ChevronDown, 
  Maximize2,
  Plus,
  Minus
} from 'lucide-react'
import styles from './BeneficiariesView.module.css'
import tableStyles from '../ProgrammaticAdvanceView/ProgrammaticAdvanceView.module.css'
import { GenderDonut, AgePyramid } from '../GeneralSummaryView/SummaryCharts'

interface ProgressItem {
  label: string
  value: number
  percentage: string
}

const nationalityData: ProgressItem[] = [
  { label: 'Ecuatoriana', value: 3150, percentage: '37.9%' },
  { label: 'Peruana', value: 2080, percentage: '25.0%' },
  { label: 'Boliviana', value: 1420, percentage: '17.1%' },
  { label: 'Colombiana', value: 890, percentage: '10.7%' },
  { label: 'Española', value: 480, percentage: '5.8%' },
  { label: 'Otra', value: 300, percentage: '3.6%' },
]

const ethnicityData: ProgressItem[] = [
  { label: 'Mestizo/a', value: 3420, percentage: '41.1%' },
  { label: 'Indígena', value: 2150, percentage: '25.8%' },
  { label: 'Afrodescendiente', value: 1280, percentage: '15.4%' },
  { label: 'Montubio/a', value: 680, percentage: '8.2%' },
  { label: 'Blanco/a', value: 540, percentage: '6.5%' },
  { label: 'Otro', value: 250, percentage: '3.0%' },
]

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

const monitoringData: TableRow[] = [
  {
    id: 'og-b1',
    level: 'OG',
    badgeVariant: 'og',
    description: 'Mejorar las condiciones de vida de personas en situación de vulnerabilidad',
    children: [
      {
        id: 'oe-b1',
        level: 'OE',
        badgeVariant: 'oe',
        description: 'Garantizar el acceso a educación de calidad para niños, niñas y adolescentes',
        children: [
          {
            id: 'r-b1',
            level: 'R',
            badgeVariant: 'r',
            description: 'Niños/as y adolescentes mejoran su rendimiento escolar',
            children: [
              {
                id: 'act-b1',
                level: 'ACT',
                badgeVariant: 'act',
                description: 'Programas de refuerzo escolar y acompañamiento pedagógico',
                unidad: 'Programas',
                meta: '40',
                ejecucion: '32',
                avance: '80.0%',
                children: [
                  {
                    id: 'subact-b1',
                    level: 'SUBACT',
                    badgeVariant: 'subact',
                    description: 'Sesiones de tutoría personalizada',
                    unidad: 'Sesiones',
                    meta: '200',
                    ejecucion: '165',
                    avance: '82.5%',
                    children: [
                      {
                        id: 'ind-b1',
                        level: 'IND',
                        badgeVariant: 'ind',
                        description: 'Niños/as con acceso a educación de refuerzo',
                        unidad: 'Personas',
                        meta: '800',
                        ejecucion: '620',
                        avance: '77.5%',
                      }
                    ]
                  },
                  {
                    id: 'subact-b2',
                    level: 'SUBACT',
                    badgeVariant: 'subact',
                    description: 'Talleres de formación docente',
                    unidad: 'Talleres',
                    meta: '30',
                    ejecucion: '24',
                    avance: '80.0%',
                    children: [
                      {
                        id: 'ind-b2',
                        level: 'IND',
                        badgeVariant: 'ind',
                        description: 'Docentes capacitados en metodologías activas',
                        unidad: 'Personas',
                        meta: '120',
                        ejecucion: '95',
                        avance: '79.2%',
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
  }
]

export const BeneficiariesView: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>(['og-b1', 'oe-b1', 'r-b1', 'act-b1'])

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const renderRows = (rows: TableRow[], depth = 0): React.ReactNode => {
    return rows.map(row => {
      const isExpanded = expandedRows.includes(row.id)
      const hasChildren = row.children && row.children.length > 0
      
      const badgeClass = tableStyles[`badge${row.badgeVariant.toUpperCase()}`]
      const advanceClass = row.avance ? 
        row.avance.includes('80') ? tableStyles.advance80 : 
        row.avance.includes('86') ? tableStyles.advance86 : 
        tableStyles.advance77 : ''

      return (
        <React.Fragment key={row.id}>
          <tr className={tableStyles.tr}>
            <td className={tableStyles.td} style={{ paddingLeft: `${depth * 24 + 16}px` }}>
              <div className={tableStyles.levelCell}>
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
            <td className={tableStyles.td}>{row.unidad || '—'}</td>
            <td className={tableStyles.td} style={{ fontWeight: 700 }}>{row.meta || '—'}</td>
            <td className={tableStyles.td} style={{ fontWeight: 700 }}>{row.ejecucion || '—'}</td>
            <td className={tableStyles.td}>
               {row.avance ? <span className={`${tableStyles.advanceBadge} ${advanceClass}`}>{row.avance}</span> : '—'}
            </td>
          </tr>
          {isExpanded && hasChildren && renderRows(row.children!, depth + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <div className={styles.container}>
      {/* Top Stats */}
      <div className={styles.topStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef2f2', color: '#f07f59' }}>
            <Users size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Asistencias brindadas</span>
            <span className={styles.statValue}>12,450</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#f07f59' }}>
            <UserPlus size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Personas beneficiadas totales</span>
            <span className={styles.statValue}>8,320</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
            <Repeat size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Personas beneficiadas múltiples</span>
            <span className={styles.statValue}>5,180</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <UserCheck size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Beneficiarios indirectos</span>
            <span className={styles.statValue}>3,260</span>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className={styles.middleGrid}>
        {/* Gender Donut */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personas beneficiarias por sexo</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <GenderDonut />
          </div>
        </div>

        {/* Age Pyramid */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personas beneficiadas por rango etario</h3>
            <button className={styles.maximizeButton}><Maximize2 size={16} /></button>
          </div>
          <div style={{ flex: 1 }}>
            <AgePyramid />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Distribución geográfica</h3>
          </div>
          <div className={styles.mapContainer}>
            <div className={styles.mapControls}>Zona de intervención</div>
            <div className={styles.zoomControls}>
              <button className={styles.zoomButton}><Maximize2 size={12} /></button>
              <button className={styles.zoomButton}><Plus size={12} /></button>
              <button className={styles.zoomButton}><Minus size={12} /></button>
            </div>
            {/* Simple SVG Map Placeholder */}
            <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
               <path d="M50,30 L150,30 L150,120 L50,120 Z" fill="#94a3b8" />
               <path d="M80,60 L100,60 L100,100 L80,100 Z" fill="#f07f59" opacity="0.8" />
            </svg>
            <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 10, fontWeight: 700, color: '#6b7280' }}>
               Haz clic en un país resaltado para ver detalle
            </div>
          </div>
        </div>
      </div>

      {/* Demographic Bars Grid */}
      <div className={styles.rowGrid}>
        {/* Nationality */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personas beneficiarias por nacionalidad</h3>
          </div>
          <div className={styles.progressList}>
            {nationalityData.map((item, i) => (
              <div key={i} className={styles.progressItem}>
                <div className={styles.progressLabel}>
                   <span>{item.label}</span>
                   <span>{item.value.toLocaleString()} <span className={styles.percentage}>{item.percentage}</span></span>
                </div>
                <div className={styles.progressBar}>
                   <div className={styles.progressFill} style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
             <span>Total</span>
             <span>8,320 100.0%</span>
          </div>
        </div>

        {/* Ethnicity */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personas beneficiarias por etnia</h3>
          </div>
          <div className={styles.progressList}>
            {ethnicityData.map((item, i) => (
              <div key={i} className={styles.progressItem}>
                <div className={styles.progressLabel}>
                   <span>{item.label}</span>
                   <span>{item.value.toLocaleString()} <span className={styles.percentage}>{item.percentage}</span></span>
                </div>
                <div className={styles.progressBar}>
                   <div className={styles.progressFill} style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
             <span>Total</span>
             <span>8,320 100.0%</span>
          </div>
        </div>
      </div>

      {/* Monitoring Table */}
      <div className={tableStyles.section}>
        <div className={tableStyles.sectionHeader}>
          <h2 className={tableStyles.sectionTitle}>Monitoreo de actividades de personas beneficiarias</h2>
          <button className={tableStyles.maximizeButton}><Maximize2 size={16} /></button>
        </div>

        <div className={tableStyles.legendBar}>
           <div className={tableStyles.legendItem} style={{ background: '#fff7ed', borderColor: '#f07f59' }}>
              <div className={tableStyles.legendDot} style={{ background: '#f07f59' }}></div>
              Objetivo General
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#fefce8', borderColor: '#fec354' }}>
              <div className={tableStyles.legendDot} style={{ background: '#fec354' }}></div>
              Objetivo Específico
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#f0fdfa', borderColor: '#0d9488' }}>
              <div className={tableStyles.legendDot} style={{ background: '#0d9488' }}></div>
              Resultado
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#ecfdf5', borderColor: '#0f766e' }}>
              <div className={tableStyles.legendDot} style={{ background: '#0f766e' }}></div>
              Actividades
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#fff7ed', borderColor: '#f97316' }}>
              <div className={tableStyles.legendDot} style={{ background: '#f97316' }}></div>
              Subactividad
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#f1f5f9', borderColor: '#94a3b8' }}>
              <div className={tableStyles.legendDot} style={{ background: '#94a3b8' }}></div>
              Indicador
           </div>
           <div style={{ flex: 1 }} />
           <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer' }}>Colapsar todo</button>
        </div>

        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead className={tableStyles.thead}>
              <tr>
                <th className={tableStyles.th} style={{ width: '50%' }}>NIVEL / DESCRIPCIÓN</th>
                <th className={tableStyles.th}>UNIDAD</th>
                <th className={tableStyles.th}>META</th>
                <th className={tableStyles.th}>EJECUCIÓN</th>
                <th className={tableStyles.th}>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {renderRows(monitoringData)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
