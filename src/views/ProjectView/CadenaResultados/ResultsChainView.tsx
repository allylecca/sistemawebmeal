import { useMemo, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import {
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCcw,
  Download,
  ArrowUpDown,
  ListFilter,
  Info,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  PencilRuler,
  ChevronsDown,
  ChevronsUp
} from 'lucide-react'
import {
  actividadData,
  implementadoresData,
  locationsData,
  planesAnualesData
} from '../../../data/mockData'
import type { Actividad } from '../../../data/types'
import styles from './ResultsChainView.module.css'

/* ─── Types ───────────────────────────────────── */
interface ImplRow {
  id: number
  implementador: string
  ubicacion: string
  y2025: number
  y2026: number
  y2027: number
}

interface ActivityState {
  activityId: number
  expanded: boolean
  implementors: ImplRow[]
}

type StatusType = 'completed' | 'incomplete' | 'nodata'

/* ─── Budget Mock Data ────────────────────────── */
interface Partida {
  codigo: string
  nombre: string
  monto: number
}

interface BudgetByYear {
  partidas: Partida[]
  total: number
}

/** Mock budget per activity-id × year. Key: `${actId}_${year}` */
const budgetMock: Record<string, BudgetByYear> = {
  '1_2025': {
    partidas: [
      { codigo: '2.3.1', nombre: 'Bienes y servicios', monto: 3200 },
      { codigo: '2.3.2', nombre: 'Contratación de servicios', monto: 1800 },
    ],
    total: 5000,
  },
  '1_2026': {
    partidas: [
      { codigo: '2.3.1', nombre: 'Bienes y servicios', monto: 3000 },
      { codigo: '2.3.2', nombre: 'Contratación de servicios', monto: 2000 },
    ],
    total: 5000,
  },
  '1_2027': {
    partidas: [
      { codigo: '2.3.1', nombre: 'Bienes y servicios', monto: 2500 },
      { codigo: '2.3.2', nombre: 'Contratación de servicios', monto: 2500 },
    ],
    total: 5000,
  },
  '2_2025': {
    partidas: [
      { codigo: '2.3.1', nombre: 'Bienes y servicios', monto: 500 },
    ],
    total: 500,
  },
  // actId 2 en 2026 y 2027: sin presupuesto asignado
}

const getBudget = (actId: number, year: number): BudgetByYear | null =>
  budgetMock[`${actId}_${year}`] ?? null

/* ─── Indicator Mock Data (Selección de indicadores y metas) ─ */
type IndicatorType = 'lineaEstrategica' | 'resultado' | 'producto' | 'beneficiario'

interface IndicatorMeta {
  id: number
  tipo: IndicatorType
  codigo: string
  nombre: string
  y2025: number
  y2026: number
  y2027: number
}

const indicatorsMock: IndicatorMeta[] = [
  { id: 1, tipo: 'lineaEstrategica', codigo: 'PROT-LE-01', nombre: 'Número personas que se benefician de sistemas comunitarios de protección de la infancia articulados', y2025: 0, y2026: 0, y2027: 0 },
  { id: 2, tipo: 'resultado', codigo: 'PROT-RI-01', nombre: 'Número de NNA que expresan un mayor conocimiento de sus derechos.', y2025: 0, y2026: 0, y2027: 0 },
  { id: 3, tipo: 'producto', codigo: 'PROT-PR-01', nombre: 'Número de Programas de formación en DDHH de NNA y ciudadanía implementados.', y2025: 0, y2026: 0, y2027: 0 },
  { id: 4, tipo: 'producto', codigo: 'PROT-PR-02', nombre: 'Número De NNA que participan en Programas de recreación, cultura y deporte para la promoción y ejercicio de derechos de NNA', y2025: 0, y2026: 0, y2027: 0 },
  { id: 5, tipo: 'beneficiario', codigo: 'BEN-T', nombre: 'Personas beneficiarias', y2025: 0, y2026: 0, y2027: 0 },
  { id: 6, tipo: 'beneficiario', codigo: 'BEN-H', nombre: 'Hombres beneficiarios', y2025: 0, y2026: 0, y2027: 0 },
  { id: 7, tipo: 'beneficiario', codigo: 'BEN-M', nombre: 'Mujeres beneficiarias', y2025: 0, y2026: 0, y2027: 0 },
]

const tipoLabels: Record<IndicatorType, string> = {
  lineaEstrategica: 'Indicador de Línea Estratégica',
  resultado: 'Indicador de Resultado',
  producto: 'Indicador de Producto',
  beneficiario: 'Beneficiario',
}

/* ─── IndicatorDetailModal ─────────────────────── */
function IndicatorDetailModal({ year, onClose }: { year: number; onClose: () => void }) {
  const yearKey = `y${year}` as 'y2025' | 'y2026' | 'y2027'
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose() }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Indicadores y Metas — {year}</h3>
            <p className={styles.modalSubtitle}>Proyectos habilitados · Selección de indicadores</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalTableWrapper}>
          <table className={styles.modalTable}>
            <thead>
              <tr>
                <th className={styles.modalColTipo}>TIPO ⇵</th>
                <th className={styles.modalColIndicador}>INDICADOR ⇵</th>
                <th className={styles.modalColMeta}>{year} ⇵</th>
              </tr>
            </thead>
            <tbody>
              {indicatorsMock.map(ind => (
                <tr key={ind.id} className={styles.modalIndicatorRow}>
                  <td><span className={`${styles.tipoBadge} ${styles[`tipo_${ind.tipo}`]}`}>{tipoLabels[ind.tipo]}</span></td>
                  <td className={styles.modalIndicadorCell}>
                    <span className={styles.indicadorCodigo}>{ind.codigo}</span>
                    <span className={styles.indicadorNombre}> — {ind.nombre}</span>
                  </td>
                  <td>
                    <div className={styles.metaInputWrapper}>
                      <input type="text" className={styles.metaInput} defaultValue={`${ind[yearKey].toLocaleString('es')} 000`} readOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared tooltip hook ─────────────────────── */
function useTooltipPos(tooltipW = 300, tooltipH = 220) {
  const [visible, setVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const GAP = 8; const M = 12
  const handleMouseEnter = () => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const vw = window.innerWidth; const vh = window.innerHeight
    let top = rect.bottom + GAP
    if (top + tooltipH > vh - M) top = rect.top - tooltipH - GAP
    top = Math.max(M, top)
    let left = rect.left - 60
    if (left + tooltipW > vw - M) left = vw - tooltipW - M
    left = Math.max(M, left)
    setTooltipStyle({ top, left })
    setVisible(true)
  }
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (tooltipRef.current?.contains(e.relatedTarget as Node)) return
    setVisible(false)
  }
  const tooltipMouseLeave = () => setVisible(false)
  useEffect(() => {
    const hide = () => setVisible(false)
    window.addEventListener('scroll', hide, true)
    return () => window.removeEventListener('scroll', hide, true)
  }, [])
  return { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave }
}

/* ─── BudgetIcon with Tooltip ─────────────────── */
type IconStatus = 'filled' | 'pending' | 'nobudget'

interface BudgetIconProps {
  actId: number
  year: number
  value: number
  isEmptyRow?: boolean
}

function BudgetIcon({ actId, year, value, isEmptyRow }: BudgetIconProps) {
  const budget = isEmptyRow ? null : getBudget(actId, year)
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos(350, 240)

  let status: IconStatus
  if (!budget) {
    status = 'nobudget'
  } else if (value > 0) {
    status = 'filled'
  } else {
    status = 'pending'
  }

  const iconEl =
    status === 'filled' ? (
      <CheckCircle2 size={16} />
    ) : (
      <AlertCircle size={16} />
    )

  const btnCls = [
    styles.budgetIconBtn,
    status === 'filled'
      ? styles.budgetGreen
      : status === 'pending'
        ? styles.budgetYellow
        : styles.budgetGray,
  ].join(' ')

  return (
    <>
      <button
        ref={btnRef}
        className={btnCls}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        {iconEl}
      </button>

      {visible && createPortal(
        <div
          ref={tooltipRef}
          className={styles.budgetTooltip}
          style={tooltipStyle}
          onMouseLeave={tooltipMouseLeave}
        >
          <div className={styles.tooltipHeader}>
            Presupuesto {year}
          </div>
          {!budget ? (
            <div className={styles.tooltipNoBudget}>Sin presupuesto asignado</div>
          ) : (
            <>
              <table className={styles.tooltipTable}>
                <thead>
                  <tr>
                    <th>Partida</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.partidas.map((p) => (
                    <tr key={p.codigo}>
                      <td>{p.codigo}</td>
                      <td>{p.nombre}</td>
                      <td>{p.monto.toLocaleString('es')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.tooltipTotal}>
                <span>Total presupuestado</span>
                <span>{budget.total.toLocaleString('es')}</span>
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}


/* ─── YearInfoTooltip (fila de actividad, columnas de año) ─ */
function YearInfoTooltip({ year, implRows, tipoValor }: { year: number; implRows: ImplRow[], tipoValor?: string }) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()
  const key = `y${year}` as 'y2025' | 'y2026' | 'y2027'
  const active = implRows.filter(i => i.implementador)
  
  let total = 0;
  if (tipoValor === 'Porcentaje') {
    const valid = active.filter(i => i[key] > 0)
    total = valid.length > 0 ? Math.round(valid.reduce((sum, i) => sum + i[key], 0) / valid.length) : 0
  } else {
    total = active.reduce((sum, i) => sum + i[key], 0)
  }
  
  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')
  
  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle"><Info size={13} /></button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Detalle {year}</div>
          {active.length === 0 ? (
            <div className={styles.tooltipNoBudget}>Sin implementadores asignados</div>
          ) : (
            <>
              <table className={styles.tooltipTable}>
                <thead><tr><th>Implementador</th><th>Ubicación</th><th>Valor</th></tr></thead>
                <tbody>
                  {active.map(impl => (
                    <tr key={impl.id}><td>{impl.implementador}</td><td>{impl.ubicacion || '—'}</td><td>{formatVal(impl[key])}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.tooltipTotal}><span>Total {year}</span><span>{formatVal(total)}</span></div>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

/* ─── ImplTotalInfoIcon (columna TOTAL de sub-fila) ── */
function ImplTotalInfoIcon({ impl, tipoValor }: { impl: ImplRow, tipoValor?: string }) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()
  const years = [2025, 2026, 2027] as const
  
  let total = 0;
  if (tipoValor === 'Porcentaje') {
    const valid = years.map(yr => impl[`y${yr}` as 'y2025' | 'y2026' | 'y2027']).filter(v => v > 0)
    total = valid.length > 0 ? Math.round(valid.reduce((sum, v) => sum + v, 0) / valid.length) : 0
  } else {
    total = impl.y2025 + impl.y2026 + impl.y2027
  }
  
  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle"><Info size={13} /></button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Resumen implementador</div>
          <div className={styles.tooltipImplInfo}>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Implementador</span><span className={styles.tooltipImplValue}>{impl.implementador || '—'}</span></div>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Ubicación</span><span className={styles.tooltipImplValue}>{impl.ubicacion || '—'}</span></div>
          </div>
          <table className={styles.tooltipTable}>
            <thead><tr><th>Año</th><th style={{ textAlign: 'right' }}>Valor registrado</th></tr></thead>
            <tbody>
              {years.map(yr => {
                const k = `y${yr}` as 'y2025' | 'y2026' | 'y2027'
                return <tr key={yr}><td>{yr}</td><td>{formatVal(impl[k])}</td></tr>
              })}
            </tbody>
          </table>
          <div className={styles.tooltipTotal}><span>Total</span><span>{formatVal(total)}</span></div>
        </div>,
        document.body
      )}
    </>
  )
}

/* ─── Helpers ─────────────────────────────────── */
/**
 * Status is driven by budget assignments, checked per implementor row:
 *  - 'nodata'     → no year has budget assigned
 *  - 'incomplete' → any active implementor has a budget-year still at 0
 *  - 'completed'  → every active implementor has all budget-years > 0
 */
const getStatus = (actId: number, implRows: ImplRow[]): StatusType => {
  const years = [2025, 2026, 2027] as const
  const budgetedYears = years.filter(y => getBudget(actId, y) !== null)
  if (budgetedYears.length === 0) return 'nodata'
  const active = implRows.filter(i => i.implementador !== '')
  if (active.length === 0) return 'incomplete'
  const allFilled = active.every(impl =>
    budgetedYears.every(yr => {
      const key = `y${yr}` as 'y2025' | 'y2026' | 'y2027'
      return impl[key] > 0
    })
  )
  return allFilled ? 'completed' : 'incomplete'
}

const statusLabels: Record<StatusType, string> = {
  completed: 'Completado',
  incomplete: 'Incompleto',
  nodata: 'Sin data'
}

const locationOptions = locationsData.flatMap(r => {
  const base = [r.label]
  if (r.children) {
    r.children.forEach(p => {
      base.push(`${r.label}, ${p.label}`)
      if (p.children) {
        p.children.forEach(d => {
          base.push(`${r.label}, ${p.label}, ${d.label}`)
        })
      }
    })
  }
  return base
})

const implOptions = implementadoresData.map(i => i.nombre)

/* ─── Component ───────────────────────────────── */
export function ResultsChainView() {
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')
  const [modalYear, setModalYear] = useState<number | null>(null)

  const programOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.programa))].sort(),
    []
  )
  const projectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.proyecto))].sort(),
    []
  )
  const subprojectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`))].sort(),
    []
  )

  const activities = useMemo(() => {
    return actividadData.filter(a => a.unidad && a.tipoValor)
  }, [])

  const [actStates, setActStates] = useState<ActivityState[]>(() => {
    return activities.map((a, idx) => {
      const hasData = idx < 2
      return {
        activityId: a.id,
        expanded: idx < 2,
        implementors: hasData ? [
          {
            id: 1,
            implementador: implOptions[idx % implOptions.length],
            ubicacion: 'Perú, La Libertad, Trujillo',
            y2025: idx === 0 ? 5000 : 300,
            y2026: idx === 0 ? 5000 : 0,
            y2027: idx === 0 ? 5000 : 0,
          },
          {
            id: 2,
            implementador: implOptions[1] ?? 'ADRA Perú',
            ubicacion: 'Perú, La Libertad, Virú',
            y2025: 0,
            y2026: 0,
            y2027: 0,
          }
        ] : []
      }
    })
  })

  const toggleExpand = (actId: number) => {
    setActStates(prev => prev.map(s =>
      s.activityId === actId ? { ...s, expanded: !s.expanded } : s
    ))
  }

  const expandAll = () => setActStates(prev => prev.map(s => ({ ...s, expanded: true })))
  const collapseAll = () => setActStates(prev => prev.map(s => ({ ...s, expanded: false })))
  const isAllExpanded = actStates.every(s => s.expanded)

  const deleteImplementor = (actId: number, implId: number) => {
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este implementador?')
    if (!confirmed) return
    setActStates(prev => prev.map(s => {
      if (s.activityId !== actId) return s
      return { ...s, implementors: s.implementors.filter(imp => imp.id !== implId) }
    }))
  }

  const addImplementor = (actId: number) => {
    setActStates(prev => prev.map(s => {
      if (s.activityId !== actId) return s
      return {
        ...s,
        implementors: [
          ...s.implementors,
          { id: Date.now(), implementador: '', ubicacion: '', y2025: 0, y2026: 0, y2027: 0 }
        ]
      }
    }))
  }

  const updateImplField = (actId: number, implId: number, field: keyof ImplRow, value: any) => {
    setActStates(prev => prev.map(s => {
      if (s.activityId !== actId) return s
      return {
        ...s,
        implementors: s.implementors.map(imp =>
          imp.id === implId ? { ...imp, [field]: value } : imp
        )
      }
    }))
  }

  const getTotals = (activity: Actividad) => {
    const state = actStates.find(s => s.activityId === activity.id)
    if (!state || state.implementors.length === 0) return { y2025: 0, y2026: 0, y2027: 0, total: 0 }
    
    if (activity.tipoValor === 'Porcentaje') {
      const active25 = state.implementors.filter(i => i.y2025 > 0)
      const y2025 = active25.length > 0 ? active25.reduce((s, i) => s + i.y2025, 0) / active25.length : 0
      
      const active26 = state.implementors.filter(i => i.y2026 > 0)
      const y2026 = active26.length > 0 ? active26.reduce((s, i) => s + i.y2026, 0) / active26.length : 0
      
      const active27 = state.implementors.filter(i => i.y2027 > 0)
      const y2027 = active27.length > 0 ? active27.reduce((s, i) => s + i.y2027, 0) / active27.length : 0
      
      const years = [y2025, y2026, y2027].filter(v => v > 0)
      const total = years.length > 0 ? years.reduce((s, y) => s + y, 0) / years.length : 0
      
      return { y2025: Math.round(y2025), y2026: Math.round(y2026), y2027: Math.round(y2027), total: Math.round(total) }
    } else {
      const y2025 = state.implementors.reduce((sum, i) => sum + i.y2025, 0)
      const y2026 = state.implementors.reduce((sum, i) => sum + i.y2026, 0)
      const y2027 = state.implementors.reduce((sum, i) => sum + i.y2027, 0)
      return { y2025, y2026, y2027, total: y2025 + y2026 + y2027 }
    }
  }

  const grandTotals = useMemo(() => {
    return actStates.reduce(
      (acc, s) => {
        const act = activities.find(a => a.id === s.activityId)
        if (!act) return acc
        const t = getTotals(act)
        return {
          y2025: acc.y2025 + t.y2025,
          y2026: acc.y2026 + t.y2026,
          y2027: acc.y2027 + t.y2027,
          total: acc.total + t.total
        }
      },
      { y2025: 0, y2026: 0, y2027: 0, total: 0 }
    )
  }, [actStates, activities])

  const renderStatusIcon = (status: StatusType) => {
    const cls = status === 'completed' ? styles.iconBadgeCompleted
      : status === 'incomplete' ? styles.iconBadgeIncomplete
        : styles.iconBadgeNodata
    
    const Icon = status === 'completed' ? CheckCircle2 : AlertCircle
    
    return (
      <div className={`${styles.iconBadge} ${cls}`} title={`Estado: ${statusLabels[status]}`}>
        <Icon size={16} fill="currentColor" color="#fff" />
      </div>
    )
  }

  const renderUnitIcon = (activity: Actividad) => {
    return (
      <div className={`${styles.iconBadge} ${styles.iconBadgeUnit}`} title={`Unidad: ${activity.unidad || 'Personas'} - ${activity.tipoValor || 'Numérico'}`}>
        <PencilRuler size={14} strokeWidth={2.5} />
      </div>
    )
  }

  const renderYearCell = (value: number, showInfo = true, tipoValor?: string) => (
    <div className={styles.yearCell}>
      <span className={styles.sigmaValue}>
        {tipoValor === 'Porcentaje' ? `${value}%` : value.toLocaleString('es')}
      </span>
      {showInfo && (
        <button className={styles.infoBtn} title="Ver detalle">
          <Info size={13} />
        </button>
      )}
    </div>
  )

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Cadena de Resultados"
          subtitle="Gestiona la cadena de resultados técnicos"
        />
      </header>

      {/* ─── Filter Bar ──────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid #ece6df',
        flexWrap: 'wrap'
      }}>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Programa"
            options={programOptions}
            value={programFilter}
            onChange={setProgramFilter}
          />
        </div>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Proyecto"
            options={projectOptions}
            value={projectFilter}
            onChange={setProjectFilter}
          />
        </div>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Subproyecto"
            options={subprojectOptions}
            value={subprojectFilter}
            onChange={setSubprojectFilter}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '2px' }}>
          <button style={{
            width: '36px', height: '36px',
            backgroundColor: '#FFC658', border: 'none', borderRadius: '6px',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Search size={16} />
          </button>
          <button style={{
            width: '36px', height: '36px',
            backgroundColor: '#fff', border: '1px solid #e0dcd6', borderRadius: '6px',
            color: '#7a6e6a', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} onClick={() => { setProgramFilter(''); setProjectFilter(''); setSubprojectFilter('') }}>
            <RefreshCcw size={16} />
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px',
            backgroundColor: '#fff', border: '1px solid #e0dcd6', borderRadius: '20px',
            color: '#382e2c', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600
          }}>
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* ─── Tree Table ──────────────────────────── */}
      <div className={styles.tableWrapper}>
        <table className={styles.chainTable}>
          <thead>
            <tr>
              <th className={styles.colActividad}>
                <div className={styles.thContent}>
                  ACTIVIDAD
                  <ArrowUpDown size={14} className={styles.thIcon} />
                  <ListFilter size={14} className={styles.thIcon} />
                  
                  <button 
                    onClick={isAllExpanded ? collapseAll : expandAll} 
                    style={{ 
                      marginLeft: 'auto', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: '#7a6e6a', 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      letterSpacing: '0.02em',
                      textDecoration: 'underline'
                    }}
                  >
                    {isAllExpanded ? 'Contraer todo' : 'Expandir todo'}
                  </button>
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'right' }}>
                <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2025
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'right' }}>
                <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2026
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'right' }}>
                <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2027
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colTotal} style={{ textAlign: 'right' }}>
                <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                  TOTAL
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => {
              const state = actStates.find(s => s.activityId === act.id)
              const totals = getTotals(act)
              const status = getStatus(act.id, state?.implementors ?? [])
              const isExpanded = state?.expanded || false

              return (
                <ActivityRowGroup
                  key={act.id}
                  activity={act}
                  isExpanded={isExpanded}
                  implRows={state?.implementors || []}
                  totals={totals}
                  status={status}
                  onToggle={() => toggleExpand(act.id)}
                  onAddImpl={() => addImplementor(act.id)}
                  onUpdateImpl={(implId, field, value) => updateImplField(act.id, implId, field, value)}
                  onDeleteImpl={(implId) => deleteImplementor(act.id, implId)}
                  renderStatusIcon={renderStatusIcon}
                  renderUnitIcon={renderUnitIcon}
                  renderYearCell={renderYearCell}
                />
              )
            })}

            {/* ─── TOTALS ────────────────────────── */}
            <tr className={styles.totalsRow}>
              <td style={{ textAlign: 'right', fontSize: '13px', letterSpacing: '0.05em' }}>
                TOTALES
              </td>
              {([2025, 2026, 2027] as const).map(yr => {
                const key = `y${yr}` as 'y2025' | 'y2026' | 'y2027'
                return (
                  <td key={yr} style={{ textAlign: 'right' }}>
                    <div className={styles.yearCell}>
                      <span className={styles.sigmaValue}>{grandTotals[key].toLocaleString('es')}</span>
                      <button className={styles.infoBtn} title="Ver detalle" onClick={(e) => { e.stopPropagation(); setModalYear(yr) }}>
                        <Info size={13} />
                      </button>
                    </div>
                  </td>
                )
              })}
              <td className={styles.totalHighlight} style={{ textAlign: 'right' }}>
                {renderYearCell(grandTotals.total, false)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── Footer ──────────────────────────────── */}
      <div className={styles.footer}>
        <button className={styles.cancelBtn}>Cancelar</button>
        <button className={styles.saveBtn}>Guardar</button>
      </div>

      {modalYear !== null && (
        <IndicatorDetailModal year={modalYear} onClose={() => setModalYear(null)} />
      )}
    </div>
  )
}

/* ─── Formatted Input Component ─────────────────── */
function FormattedInput({ value, tipoValor, onChange, className }: { value: number, tipoValor: string, onChange: (v: number) => void, className?: string }) {
  const [localVal, setLocalVal] = useState(() => {
    if (!value) return ''
    if (tipoValor === 'Porcentaje') return value + '%'
    if (tipoValor === 'Decimal' || tipoValor === 'Monto') return value.toString()
    return value.toLocaleString('en-US')
  })

  useEffect(() => {
    if (!value && localVal === '') return
    const currentNum = parseFloat(localVal.replace(/,/g, '').replace('%', '')) || 0
    if (currentNum !== value) {
      if (!value) setLocalVal('')
      else if (tipoValor === 'Porcentaje') setLocalVal(value + '%')
      else if (tipoValor === 'Decimal' || tipoValor === 'Monto') setLocalVal(value.toString())
      else setLocalVal(value.toLocaleString('en-US'))
    }
  }, [value, tipoValor])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (tipoValor === 'Porcentaje') {
      raw = raw.replace(/[^0-9.]/g, '')
      let num = parseFloat(raw)
      if (num > 100) {
        num = 100;
        raw = '100';
      }
      setLocalVal(raw ? raw + '%' : '')
      onChange(isNaN(num) ? 0 : num)
    } else if (tipoValor === 'Decimal' || tipoValor === 'Monto') {
      raw = raw.replace(/[^0-9.]/g, '')
      setLocalVal(raw)
      onChange(parseFloat(raw) || 0)
    } else {
      raw = raw.replace(/[^0-9]/g, '')
      let num = parseInt(raw, 10)
      if (isNaN(num)) {
        setLocalVal('')
        onChange(0)
      } else {
        setLocalVal(num.toLocaleString('en-US'))
        onChange(num)
      }
    }
  }

  const handleBlur = () => {
    if (!value) setLocalVal('')
    else if (tipoValor === 'Porcentaje') setLocalVal(value + '%')
    else if (tipoValor === 'Decimal' || tipoValor === 'Monto') setLocalVal(value.toString())
    else setLocalVal(value.toLocaleString('en-US'))
  }

  return (
    <input
      type="text"
      className={className}
      value={localVal}
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
    />
  )
}

/* ─── Activity Row Group Sub-component ─────────── */
interface ActivityRowGroupProps {
  activity: Actividad
  isExpanded: boolean
  implRows: ImplRow[]
  totals: { y2025: number; y2026: number; y2027: number; total: number }
  status: StatusType
  onToggle: () => void
  onAddImpl: () => void
  onUpdateImpl: (implId: number, field: keyof ImplRow, value: any) => void
  onDeleteImpl: (implId: number) => void
  renderStatusIcon: (status: StatusType) => React.ReactNode
  renderUnitIcon: (activity: Actividad) => React.ReactNode
  renderYearCell: (value: number, showInfo?: boolean, tipoValor?: string) => React.ReactNode
}

function ActivityRowGroup({
  activity, isExpanded, implRows, totals, status,
  onToggle, onAddImpl, onUpdateImpl, onDeleteImpl,
  renderStatusIcon, renderUnitIcon, renderYearCell,
}: ActivityRowGroupProps) {
  return (
    <>
      {/* Activity Header Row */}
      <tr className={styles.activityRow} onClick={onToggle}>
        <td>
          <div className={styles.activityCell}>
            <button className={styles.chevronBtn} onClick={(e) => { e.stopPropagation(); onToggle() }}>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <span className={styles.activityCode}>{activity.codigoActividad}</span>
            <span style={{ color: '#7a6e6a' }}>-</span>
            <span className={styles.activityName}>{activity.nombre}</span>
            <div className={styles.iconBadgeGroup}>
              {renderUnitIcon(activity)}
              {renderStatusIcon(status)}
            </div>
          </div>
        </td>
        <td style={{ textAlign: 'right' }}>
          <div className={styles.yearCell}>
            <span className={styles.sigmaValue}>
              {activity.tipoValor === 'Porcentaje' ? `${totals.y2025}%` : totals.y2025.toLocaleString('es')}
            </span>
            <YearInfoTooltip year={2025} implRows={implRows} tipoValor={activity.tipoValor} />
          </div>
        </td>
        <td style={{ textAlign: 'right' }}>
          <div className={styles.yearCell}>
            <span className={styles.sigmaValue}>
              {activity.tipoValor === 'Porcentaje' ? `${totals.y2026}%` : totals.y2026.toLocaleString('es')}
            </span>
            <YearInfoTooltip year={2026} implRows={implRows} tipoValor={activity.tipoValor} />
          </div>
        </td>
        <td style={{ textAlign: 'right' }}>
          <div className={styles.yearCell}>
            <span className={styles.sigmaValue}>
              {activity.tipoValor === 'Porcentaje' ? `${totals.y2027}%` : totals.y2027.toLocaleString('es')}
            </span>
            <YearInfoTooltip year={2027} implRows={implRows} tipoValor={activity.tipoValor} />
          </div>
        </td>
        <td className={styles.totalHighlight} style={{ textAlign: 'right' }}>
          {renderYearCell(totals.total, false, activity.tipoValor)}
        </td>
      </tr>

      {/* Expanded Sub-Rows (implementer + location) */}
      {isExpanded && implRows.map((impl) => {
        let implTotal = 0;
        if (activity.tipoValor === 'Porcentaje') {
          const vals = [impl.y2025, impl.y2026, impl.y2027].filter(v => v > 0)
          implTotal = vals.length > 0 ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : 0
        } else {
          implTotal = impl.y2025 + impl.y2026 + impl.y2027
        }
        return (
          <tr key={impl.id} className={styles.implRow}>
            <td>
              <div className={styles.implCell}>
                <button
                  className={styles.deleteImplBtn}
                  title="Eliminar implementador"
                  onClick={(e) => { e.stopPropagation(); onDeleteImpl(impl.id) }}
                >
                  <MinusCircle size={15} />
                </button>
                <select
                  className={styles.implSelect}
                  style={{ flex: 1 }}
                  value={impl.implementador}
                  onChange={(e) => onUpdateImpl(impl.id, 'implementador', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Seleccionar implementador</option>
                  {implOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select
                  className={styles.implSelect}
                  style={{ flex: 1 }}
                  value={impl.ubicacion}
                  onChange={(e) => onUpdateImpl(impl.id, 'ubicacion', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Seleccionar ubicación</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </td>

            {/* ─── Year cells with BudgetIcon ─── */}
            {([2025, 2026, 2027] as const).map((yr) => {
              const fieldKey = `y${yr}` as 'y2025' | 'y2026' | 'y2027'
              return (
                <td key={yr} style={{ textAlign: 'right' }}>
                  <div className={styles.editableValue}>
                    <FormattedInput
                      className={styles.valueInput}
                      value={impl[fieldKey]}
                      tipoValor={activity.tipoValor || 'Numérico'}
                      onChange={(v) => onUpdateImpl(impl.id, fieldKey, v)}
                    />
                    <BudgetIcon 
                      actId={activity.id} 
                      year={yr} 
                      value={impl[fieldKey]} 
                      isEmptyRow={!impl.implementador && !impl.ubicacion}
                    />
                  </div>
                </td>
              )
            })}

            <td className={styles.totalHighlight} style={{ textAlign: 'right' }}>
              <div className={styles.editableValue}>
                <span className={styles.sigmaValue}>
                  {activity.tipoValor === 'Porcentaje' ? `${implTotal}%` : implTotal.toLocaleString('es')}
                </span>
                <ImplTotalInfoIcon impl={impl} tipoValor={activity.tipoValor} />
              </div>
            </td>
          </tr>
        )
      })}

      {/* Add implementor link */}
      {isExpanded && (
        <tr className={styles.addImplRow}>
          <td colSpan={5}>
            <button className={styles.addImplBtn} onClick={(e) => { e.stopPropagation(); onAddImpl() }}>
              <PlusCircle size={14} />
              Añadir implementador con ubicación
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
