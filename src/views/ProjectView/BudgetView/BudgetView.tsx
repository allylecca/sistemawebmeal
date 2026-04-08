import React, { useState } from 'react'
import { 
  Maximize2,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import styles from './BudgetView.module.css'
import tableStyles from '../ProgrammaticAdvanceView/ProgrammaticAdvanceView.module.css'
import { RadialProgress } from '../GeneralSummaryView/SummaryCharts'

interface TableRow {
  id: string
  level: string
  badgeVariant: 'og' | 'oe' | 'r' | 'act' | 'subact' | 'ind'
  description: string
  budget?: string
  expense?: string
  balance?: string
  advance?: string
  children?: TableRow[]
}

const activityData: TableRow[] = [
  {
    id: 'act-p1',
    level: 'ACT',
    badgeVariant: 'act',
    description: 'Capacitación en producción agrícola sostenible',
    budget: 'USD 420,000.00',
    expense: 'USD 336,000.00',
    balance: 'USD 84,000.00',
    advance: '80.0%',
    children: [
      {
        id: 'subact-p1',
        level: 'SUBACT',
        badgeVariant: 'subact',
        description: 'Talleres de técnicas de cultivo orgánico',
        budget: 'USD 220,000.00',
        expense: 'USD 176,000.00',
        balance: 'USD 44,000.00',
        advance: '80.0%',
      },
      {
        id: 'subact-p2',
        level: 'SUBACT',
        badgeVariant: 'subact',
        description: 'Capacitación en manejo post-cosecha',
        budget: 'USD 200,000.00',
        expense: 'USD 160,000.00',
        balance: 'USD 40,000.00',
        advance: '80.0%',
      }
    ]
  },
  {
    id: 'act-p2',
    level: 'ACT',
    badgeVariant: 'act',
    description: 'Fortalecimiento de cadenas de valor locales',
    budget: 'USD 380,000.00',
    expense: 'USD 285,000.00',
    balance: 'USD 95,000.00',
    advance: '75.0%',
    children: [
      {
        id: 'subact-p3',
        level: 'SUBACT',
        badgeVariant: 'subact',
        description: 'Ferias de articulación comercial',
        budget: 'USD 200,000.00',
        expense: 'USD 150,000.00',
        balance: 'USD 50,000.00',
        advance: '75.0%',
      },
      {
        id: 'subact-p4',
        level: 'SUBACT',
        badgeVariant: 'subact',
        description: 'Asistencia técnica a emprendimientos',
        budget: 'USD 180,000.00',
        expense: 'USD 135,000.00',
        balance: 'USD 45,000.00',
        advance: '75.0%',
      }
    ]
  },
  {
    id: 'act-p3',
    level: 'ACT',
    badgeVariant: 'act',
    description: 'Implementación de sistemas de riego tecnificado',
    budget: 'USD 520,000.00',
    expense: 'USD 312,000.00',
    balance: 'USD 208,000.00',
    advance: '60.0%',
    children: [
       {
         id: 'subact-p5',
         level: 'SUBACT',
         badgeVariant: 'subact',
         description: 'Instalación de riego por goteo',
         budget: 'USD 320,000.00',
         expense: 'USD 192,000.00',
         balance: 'USD 128,000.00',
         advance: '60.0%',
       }
    ]
  }
]

const MonthlyTrendChart: React.FC = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const budgetPoints = "0,280 40,260 80,240 120,210 160,180 200,160 240,140 280,120 320,100 360,80 400,60 440,40"
  const expensePoints = "0,290 40,275 80,260 120,240 160,220 200,200 240,180 280,165 320,150 360,135 400,120 440,110"

  return (
    <div className={styles.chartContainer}>
      <svg viewBox="0 0 450 300" style={{ width: '100%', height: '100%' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="0" y1={300 - i*60} x2="450" y2={300 - i*60} stroke="#e5e7eb" strokeDasharray="4 4" />
        ))}
        {/* Y Axis Labels */}
        <text x="0" y="295" fontSize="10" fill="#94a3b8">0.0M</text>
        <text x="0" y="235" fontSize="10" fill="#94a3b8">0.7M</text>
        <text x="0" y="175" fontSize="10" fill="#94a3b8">1.3M</text>
        <text x="0" y="115" fontSize="10" fill="#94a3b8">1.9M</text>
        <text x="0" y="55" fontSize="10" fill="#94a3b8">2.5M</text>

        {/* X Axis Labels */}
        {months.map((m, i) => (
          <text key={i} x={i * 40} y="295" fontSize="10" fill="#94a3b8" textAnchor="middle">{m}</text>
        ))}

        {/* Areas */}
        <polyline points={`${budgetPoints} 440,300 0,300`} fill="#f07f59" opacity="0.1" />
        <polyline points={`${expensePoints} 440,300 0,300`} fill="#f07f59" opacity="0.2" />

        {/* Lines */}
        <polyline points={budgetPoints} fill="none" stroke="#f07f59" strokeWidth="2" strokeOpacity="0.5" />
        <polyline points={expensePoints} fill="none" stroke="#f07f59" strokeWidth="3" />
      </svg>
      <div className={styles.chartLegend}>
         <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: '#f07f59', opacity: 0.5 }}></div>
            Presupuesto
         </div>
         <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: '#f07f59' }}></div>
            Gasto
         </div>
      </div>
    </div>
  )
}

export const BudgetView: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>(['act-p1', 'act-p2'])

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
            <td className={tableStyles.td}>{row.budget || '—'}</td>
            <td className={tableStyles.td}>{row.expense || '—'}</td>
            <td className={tableStyles.td}>{row.balance || '—'}</td>
            <td className={tableStyles.td}>
               {row.advance ? <span className={`${tableStyles.advanceBadge} ${tableStyles.advance80}`}>{row.advance}</span> : '—'}
            </td>
          </tr>
          {isExpanded && hasChildren && renderRows(row.children!, depth + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <div className={styles.container}>
      {/* Top Row Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        {[
          { title: 'Progreso del Proyecto', value: 75 },
          { title: 'Progreso Acumulado', value: 82 }
        ].map((p, i) => (
          <div key={i} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>{p.title}</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
               <RadialProgress value={p.value} size={150} strokeWidth={18} />
            </div>
            <div style={{ padding: '0 10px' }}>
               {[
                 { label: 'Presupuesto total', val: 'USD 2,500,000.00' },
                 { label: 'Gasto', val: 'USD 1,875,000.00' },
                 { label: 'Saldo', val: 'USD 625,000.00', isSaldo: true }
               ].map((item, j) => (
                 <div key={j} style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>
                       <span>{item.label}</span>
                       <span>{item.val}</span>
                    </div>
                    {item.label !== 'Presupuesto total' && (
                       <div style={{ height: 12, background: '#fdf2ed', border: '1px solid #1a1a1a', marginTop: 4 }}>
                          <div style={{ width: item.isSaldo ? '25%' : '75%', height: '100%', background: '#f07f59' }} />
                       </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        ))}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Distribución de Gastos</h3>
          </div>
          <div style={{ flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
             <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
               <path d="M50,30 L150,30 L150,120 L50,120 Z" fill="#94a3b8" />
               <path d="M80,60 L100,60 L100,100 L80,100 Z" fill="#f07f59" opacity="0.8" />
             </svg>
             <div style={{ position: 'absolute', top: 10, left: 10, background: '#fff', border: '1px solid #e5e7eb', padding: '4px 8px', fontSize: 10, fontWeight: 700 }}>Zona de intervención</div>
          </div>
        </div>
      </div>

      {/* Mid Tables Grid */}
      <div className={styles.midRowGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Ejecución presupuestaria por implementador</h3>
            <button className={styles.maximizeButton}><Maximize2 size={16} /></button>
          </div>
          <table className={styles.simpleTable}>
            <thead>
              <tr>
                <th>IMPLEMENTADOR</th>
                <th>PRESUPUESTO</th>
                <th>GASTO</th>
                <th>SALDO</th>
                <th>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Ayuda en Acción Ecuador', budget: '820,000.00', expense: '650,000.00', balance: '170,000.00', adv: '79.3%' },
                { name: 'Ayuda en Acción Perú', budget: '730,000.00', expense: '548,000.00', balance: '182,000.00', adv: '75.1%' },
                { name: 'Ayuda en Acción España', budget: '520,000.00', expense: '390,000.00', balance: '130,000.00', adv: '75.0%' },
                { name: 'Ayuda en Acción Bolivia', budget: '430,000.00', expense: '287,000.00', balance: '143,000.00', adv: '66.7%' },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.budget}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.expense}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.balance}</td>
                  <td style={{ textAlign: 'center' }}>
                     <span className={styles.advanceBadge} style={{ background: '#fdf2ed', color: '#f07f59' }}>{row.adv}</span>
                  </td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                 <td>Total General</td>
                 <td style={{ textAlign: 'right' }}>USD 2,500,000.00</td>
                 <td style={{ textAlign: 'right' }}>USD 1,875,000.00</td>
                 <td style={{ textAlign: 'right' }}>USD 625,000.00</td>
                 <td style={{ textAlign: 'center' }}>75.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Ejecución presupuestaria por financiador</h3>
          </div>
          <table className={styles.simpleTable}>
            <thead>
              <tr>
                <th>FINANCIADOR</th>
                <th>PRESUPUESTO</th>
                <th>GASTO</th>
                <th>SALDO</th>
                <th>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'AECID', budget: '950,000.00', expense: '712,500.00', balance: '237,500.00', adv: '75.0%' },
                { name: 'Unión Europea', budget: '680,000.00', expense: '544,000.00', balance: '136,000.00', adv: '80.0%' },
                { name: 'USAID', budget: '520,000.00', expense: '364,000.00', balance: '156,000.00', adv: '70.0%' },
                { name: 'Fondos Propios', budget: '350,000.00', expense: '254,500.00', balance: '95,500.00', adv: '72.7%' },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.budget}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.expense}</td>
                  <td style={{ textAlign: 'right' }}>USD {row.balance}</td>
                  <td style={{ textAlign: 'center' }}>
                     <span className={styles.advanceBadge} style={{ background: '#ecfdf5', color: '#10b981' }}>{row.adv}</span>
                  </td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                 <td>Total General</td>
                 <td style={{ textAlign: 'right' }}>USD 2,500,000.00</td>
                 <td style={{ textAlign: 'right' }}>USD 1,875,000.00</td>
                 <td style={{ textAlign: 'right' }}>USD 625,000.00</td>
                 <td style={{ textAlign: 'center' }}>75.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Chart */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Tendencia acumulada mensual del presupuesto y gasto por año</h3>
        </div>
        <MonthlyTrendChart />
      </div>

      {/* Activity Table */}
      <div className={tableStyles.section}>
        <div className={tableStyles.sectionHeader}>
          <h2 className={tableStyles.sectionTitle}>Ejecución presupuestaria por actividad</h2>
          <button className={tableStyles.maximizeButton}><Maximize2 size={16} /></button>
        </div>

        <div className={tableStyles.legendBar}>
           <div className={tableStyles.legendItem} style={{ background: '#f0fdfa', borderColor: '#0d9488' }}>
              <div className={tableStyles.legendDot} style={{ background: '#0d9488' }}></div>
              Actividades
           </div>
           <div className={tableStyles.legendItem} style={{ background: '#fff7ed', borderColor: '#f97316' }}>
              <div className={tableStyles.legendDot} style={{ background: '#f97316' }}></div>
              Subactividad
           </div>
           <div style={{ flex: 1 }} />
           <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 700, color: '#1a1a1a', cursor: 'pointer' }}>Colapsar todo</button>
        </div>

        <div className={tableStyles.tableWrapper}>
          <table className={tableStyles.table}>
            <thead className={tableStyles.thead}>
              <tr>
                <th className={tableStyles.th} style={{ width: '50%' }}>ACTIVIDADES</th>
                <th className={tableStyles.th}>PRESUPUESTO</th>
                <th className={tableStyles.th}>GASTO</th>
                <th className={tableStyles.th}>SALDO</th>
                <th className={tableStyles.th}>% AVANCE</th>
              </tr>
            </thead>
            <tbody>
              {renderRows(activityData)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
