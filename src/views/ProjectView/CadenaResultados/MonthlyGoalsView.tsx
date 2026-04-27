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
import styles from './ResultsChainView.module.css' // Reusing styles from ResultsChainView

/* ─── Types ───────────────────────────────────── */
interface ImplRow {
  id: number
  tecnico: string
  implementador: string
  ubicacion: string
  metaAnual: number
  ene: number
  feb: number
  mar: number
  abr: number
  may: number
  jun: number
  jul: number
  ago: number
  sep: number
  oct: number
  nov: number
  dic: number
}

interface ActivityState {
  activityId: number
  expanded: boolean
  implementors: ImplRow[]
}

type StatusType = 'completed' | 'incomplete' | 'nodata'

const monthKeys = [
  { key: 'ene', label: 'ENE' },
  { key: 'feb', label: 'FEB' },
  { key: 'mar', label: 'MAR' },
  { key: 'abr', label: 'ABR' },
  { key: 'may', label: 'MAY' },
  { key: 'jun', label: 'JUN' },
  { key: 'jul', label: 'JUL' },
  { key: 'ago', label: 'AGO' },
  { key: 'sep', label: 'SEP' },
  { key: 'oct', label: 'OCT' },
  { key: 'nov', label: 'NOV' },
  { key: 'dic', label: 'DIC' },
] as const;

type MonthKey = typeof monthKeys[number]['key'];

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

/* ─── BudgetIconMonth with Tooltip ─────────────────── */
type IconStatus = 'filled' | 'pending' | 'nobudget'

interface Partida {
  codigo: string
  nombre: string
  monto: number
}

interface BudgetByMonth {
  partidas: Partida[]
  total: number
}

const getBudgetMonth = (actId: number, monthKey: string): BudgetByMonth | null => {
  if (actId === 2) return null; // Sin presupuesto
  if (monthKey === 'nov' || monthKey === 'dic') return null;

  return {
    partidas: [
      { codigo: '2.3.1', nombre: 'Bienes y servicios', monto: 200 },
      { codigo: '2.3.2', nombre: 'Contratación de servicios', monto: 150 },
    ],
    total: 350
  }
}

interface BudgetIconMonthProps {
  actId: number
  monthLabel: string
  monthKey: string
  value: number
  isEmptyRow?: boolean
}

function BudgetIconMonth({ actId, monthLabel, monthKey, value, isEmptyRow }: BudgetIconMonthProps) {
  const budget = isEmptyRow ? null : getBudgetMonth(actId, monthKey)
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
            Presupuesto {monthLabel}
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

/* ─── ActivityTotalInfoIcon (columna TOTAL de fila de actividad) ── */
function ActivityTotalInfoIcon({ implRows, tipoValor }: { implRows: ImplRow[], tipoValor?: string }) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()
  
  let total = 0;
  let metaAnualTotal = 0;

  if (tipoValor === 'Porcentaje') {
    const validTotals = monthKeys.map(mk => {
      const active = implRows.filter(i => i[mk.key] > 0)
      return active.length > 0 ? active.reduce((s, i) => s + i[mk.key], 0) / active.length : 0
    }).filter(v => v > 0)
    total = validTotals.length > 0 ? Math.round(validTotals.reduce((a,b) => a+b, 0) / validTotals.length) : 0

    const activeMetas = implRows.filter(i => i.metaAnual > 0)
    metaAnualTotal = activeMetas.length > 0 ? Math.round(activeMetas.reduce((sum, i) => sum + i.metaAnual, 0) / activeMetas.length) : 0
  } else {
    total = monthKeys.reduce((sum, mk) => sum + implRows.reduce((s, i) => s + i[mk.key], 0), 0)
    metaAnualTotal = implRows.reduce((sum, i) => sum + i.metaAnual, 0)
  }

  const diff = metaAnualTotal - total
  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')

  let iconColor = '#b5a99d'; // gris por defecto
  if (total > 0) {
    if (diff <= 0) {
      iconColor = '#4caf50'; // verde (alcanzó o excedió)
    } else {
      iconColor = '#f5a623'; // amarillo (falta)
    }
  }

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle"><Info size={14} color={iconColor} /></button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Estado de la meta anual (Actividad)</div>
          <table className={styles.tooltipTable}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Meta anual total esperada</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVal(metaAnualTotal)}</td>
              </tr>
              <tr>
                <td>{tipoValor === 'Porcentaje' ? 'Promedio registrado' : 'Suma meses registrados'}</td>
                <td style={{ textAlign: 'right' }}>{formatVal(total)}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.tooltipTotal}>
            <span>Diferencia total</span>
            <span style={{ color: diff > 0 ? '#e65100' : diff < 0 ? '#e53935' : '#2e7d32' }}>
              {diff > 0 ? `Faltan ${formatVal(diff)}` : diff < 0 ? `Excede en ${formatVal(Math.abs(diff))}` : 'Meta alcanzada'}
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

/* ─── MonthInfoTooltip (fila de actividad, columnas de mes) ─ */
function MonthInfoTooltip({ monthLabel, implRows, monthKey, tipoValor }: { monthLabel: string; implRows: ImplRow[], monthKey: MonthKey, tipoValor?: string }) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()
  const active = implRows.filter(i => i.implementador)
  
  let total = 0;
  if (tipoValor === 'Porcentaje') {
    const valid = active.filter(i => i[monthKey] > 0)
    total = valid.length > 0 ? Math.round(valid.reduce((sum, i) => sum + i[monthKey], 0) / valid.length) : 0
  } else {
    total = implRows.reduce((sum, i) => sum + i[monthKey], 0)
  }

  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')

  const grouped = active.reduce((acc, row) => {
    const key = `${row.implementador}|${row.ubicacion || ''}`;
    if (!acc[key]) {
      acc[key] = { implementador: row.implementador, ubicacion: row.ubicacion, valor: 0 };
    }
    acc[key].valor += row[monthKey];
    return acc;
  }, {} as Record<string, { implementador: string, ubicacion: string, valor: number }>);
  
  const groupedArr = Object.values(grouped);

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle"><Info size={13} /></button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Detalle {monthLabel}</div>
          {groupedArr.length === 0 ? (
            <div className={styles.tooltipNoBudget}>Sin datos asignados</div>
          ) : (
            <>
              <table className={styles.tooltipTable}>
                <thead><tr><th>Implementador</th><th>Ubicación</th><th>Valor</th></tr></thead>
                <tbody>
                  {groupedArr.map((g, idx) => (
                    <tr key={idx}><td>{g.implementador}</td><td>{g.ubicacion || '—'}</td><td>{formatVal(g.valor)}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.tooltipTotal}><span>Total {monthLabel}</span><span>{formatVal(total)}</span></div>
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
  let total = 0;
  
  if (tipoValor === 'Porcentaje') {
    const vals = monthKeys.map(mk => impl[mk.key]).filter(v => v > 0)
    total = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  } else {
    total = monthKeys.reduce((sum, mk) => sum + impl[mk.key], 0)
  }
  
  const diff = impl.metaAnual - total
  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')

  let iconColor = '#b5a99d'; // gris por defecto
  if (total > 0) {
    if (diff <= 0) {
      iconColor = '#4caf50'; // verde (alcanzó o excedió)
    } else {
      iconColor = '#f5a623'; // amarillo (falta)
    }
  }

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle"><Info size={14} color={iconColor} /></button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Estado de la meta anual</div>
          <div className={styles.tooltipImplInfo}>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Implementador</span><span className={styles.tooltipImplValue}>{impl.implementador || '—'}</span></div>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Ubicación</span><span className={styles.tooltipImplValue}>{impl.ubicacion || '—'}</span></div>
          </div>
          <table className={styles.tooltipTable}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Meta anual esperada</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVal(impl.metaAnual)}</td>
              </tr>
              <tr>
                <td>{tipoValor === 'Porcentaje' ? 'Promedio registrado' : 'Suma meses registrados'}</td>
                <td style={{ textAlign: 'right' }}>{formatVal(total)}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.tooltipTotal}>
            <span>Diferencia</span>
            <span style={{ color: diff > 0 ? '#e65100' : diff < 0 ? '#e53935' : '#2e7d32' }}>
              {diff > 0 ? `Faltan ${formatVal(diff)}` : diff < 0 ? `Excede en ${formatVal(Math.abs(diff))}` : 'Meta alcanzada'}
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

/* ─── Helpers ─────────────────────────────────── */
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
const tecnicoOptions = ['Juan Pérez', 'María Gómez', 'Carlos Silva']

/* ─── Component ───────────────────────────────── */
export function MonthlyGoalsView() {
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('2025')
  
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
  const yearOptions = ['2025', '2026', '2027']

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
            tecnico: tecnicoOptions[0],
            implementador: implOptions[idx % implOptions.length],
            ubicacion: 'Perú, La Libertad, Trujillo',
            metaAnual: idx === 0 ? 5000 : 300,
            ene: idx === 0 ? 500 : 30, feb: idx === 0 ? 500 : 30, mar: idx === 0 ? 500 : 30,
            abr: idx === 0 ? 500 : 30, may: idx === 0 ? 500 : 30, jun: idx === 0 ? 500 : 30,
            jul: idx === 0 ? 500 : 30, ago: idx === 0 ? 500 : 30, sep: idx === 0 ? 500 : 30,
            oct: idx === 0 ? 500 : 30, nov: idx === 0 ? 0 : 0, dic: idx === 0 ? 0 : 0,
          },
          {
            id: 2,
            tecnico: tecnicoOptions[1],
            implementador: implOptions[1] ?? 'ADRA Perú',
            ubicacion: 'Perú, La Libertad, Virú',
            metaAnual: 0,
            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0,
            jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
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
          { 
            id: Date.now(), tecnico: '', implementador: '', ubicacion: '', metaAnual: 0,
            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, 
            jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0 
          }
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
    const init = { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0, total: 0 }
    if (!state || state.implementors.length === 0) return init
    
    if (activity.tipoValor === 'Porcentaje') {
      const active = state.implementors.filter(i => i.implementador !== '')
      const result = { ...init }
      
      monthKeys.forEach(mk => {
        const valid = active.filter(i => i[mk.key] > 0)
        result[mk.key] = valid.length > 0 ? Math.round(valid.reduce((sum, i) => sum + i[mk.key], 0) / valid.length) : 0
      })
      
      const years = monthKeys.map(mk => result[mk.key]).filter(v => v > 0)
      result.total = years.length > 0 ? Math.round(years.reduce((s, y) => s + y, 0) / years.length) : 0
      
      return result
    } else {
      return state.implementors.reduce((acc, i) => {
        const implTotal = monthKeys.reduce((sum, mk) => sum + i[mk.key], 0)
        return {
          ene: acc.ene + i.ene,
          feb: acc.feb + i.feb,
          mar: acc.mar + i.mar,
          abr: acc.abr + i.abr,
          may: acc.may + i.may,
          jun: acc.jun + i.jun,
          jul: acc.jul + i.jul,
          ago: acc.ago + i.ago,
          sep: acc.sep + i.sep,
          oct: acc.oct + i.oct,
          nov: acc.nov + i.nov,
          dic: acc.dic + i.dic,
          total: acc.total + implTotal
        }
      }, init)
    }
  }

  const grandTotals = useMemo(() => {
    return actStates.reduce(
      (acc, s) => {
        const act = activities.find(a => a.id === s.activityId)
        if (!act) return acc
        const t = getTotals(act)
        return {
          ene: acc.ene + t.ene,
          feb: acc.feb + t.feb,
          mar: acc.mar + t.mar,
          abr: acc.abr + t.abr,
          may: acc.may + t.may,
          jun: acc.jun + t.jun,
          jul: acc.jul + t.jul,
          ago: acc.ago + t.ago,
          sep: acc.sep + t.sep,
          oct: acc.oct + t.oct,
          nov: acc.nov + t.nov,
          dic: acc.dic + t.dic,
          total: acc.total + t.total
        }
      },
      { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0, total: 0 }
    )
  }, [actStates])

  const getStatus = (_actId: number, implRows: ImplRow[]): StatusType => {
    const active = implRows.filter(i => i.implementador !== '')
    if (active.length === 0) return 'nodata'
    const hasData = active.some(impl => monthKeys.some(mk => impl[mk.key] > 0))
    return hasData ? 'completed' : 'incomplete'
  }

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

  const renderMonthCell = (value: number, showInfo = true) => (
    <div className={styles.yearCell}>
      <span className={styles.sigmaValue}>{value.toLocaleString('es')}</span>
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
          title="Metas Mensuales"
          subtitle="Distribución de metas mensuales por actividad"
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
            label="Año"
            options={yearOptions}
            value={yearFilter}
            onChange={setYearFilter}
          />
        </div>
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
          }} onClick={() => { setProgramFilter(''); setProjectFilter(''); setSubprojectFilter(''); setYearFilter('2025') }}>
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
              {monthKeys.map(mk => (
                <th key={mk.key} className={styles.colYear} style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                    {mk.label}
                  </div>
                </th>
              ))}
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
                  renderMonthCell={renderMonthCell}
                />
              )
            })}

            {/* ─── TOTALS ────────────────────────── */}
            <tr className={styles.totalsRow}>
              <td style={{ textAlign: 'right', fontSize: '13px', letterSpacing: '0.05em' }}>
                TOTALES
              </td>
              {monthKeys.map(mk => {
                return (
                  <td key={mk.key} style={{ textAlign: 'right' }}>
                    <div className={styles.yearCell}>
                      <span className={styles.sigmaValue}>{grandTotals[mk.key].toLocaleString('es')}</span>
                    </div>
                  </td>
                )
              })}
              <td className={styles.totalHighlight} style={{ textAlign: 'right' }}>
                {renderMonthCell(grandTotals.total, false)}
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
  totals: Record<MonthKey, number> & { total: number }
  status: StatusType
  onToggle: () => void
  onAddImpl: () => void
  onUpdateImpl: (implId: number, field: keyof ImplRow, value: any) => void
  onDeleteImpl: (implId: number) => void
  renderStatusIcon: (status: StatusType) => React.ReactNode
  renderUnitIcon: (activity: Actividad) => React.ReactNode
  renderMonthCell: (value: number, showInfo?: boolean) => React.ReactNode
}

function ActivityRowGroup({
  activity, isExpanded, implRows, totals, status,
  onToggle, onAddImpl, onUpdateImpl, onDeleteImpl,
  renderStatusIcon, renderUnitIcon, renderMonthCell,
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
        {monthKeys.map(mk => (
          <td key={mk.key} style={{ textAlign: 'right' }}>
            <div className={styles.yearCell}>
              <span className={styles.sigmaValue}>
                {activity.tipoValor === 'Porcentaje' ? `${totals[mk.key]}%` : totals[mk.key].toLocaleString('es')}
              </span>
              <MonthInfoTooltip monthLabel={mk.label} implRows={implRows} monthKey={mk.key} tipoValor={activity.tipoValor} />
            </div>
          </td>
        ))}
        <td className={styles.totalHighlight} style={{ textAlign: 'right' }}>
          <div className={styles.yearCell}>
            <span className={styles.sigmaValue}>
              {activity.tipoValor === 'Porcentaje' ? `${totals.total}%` : totals.total.toLocaleString('es')}
            </span>
            <ActivityTotalInfoIcon implRows={implRows} tipoValor={activity.tipoValor} />
          </div>
        </td>
      </tr>

      {/* Expanded Sub-Rows (implementer + location) */}
      {isExpanded && implRows.map((impl) => {
        let implTotal = 0;
        if (activity.tipoValor === 'Porcentaje') {
          const vals = monthKeys.map(mk => impl[mk.key]).filter(v => v > 0)
          implTotal = vals.length > 0 ? Math.round(vals.reduce((a,b) => a+b, 0) / vals.length) : 0
        } else {
          implTotal = monthKeys.reduce((sum, mk) => sum + impl[mk.key], 0)
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
                  value={impl.tecnico}
                  onChange={(e) => onUpdateImpl(impl.id, 'tecnico', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Seleccionar técnico</option>
                  {tecnicoOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
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

            {/* ─── Month cells ─── */}
            {monthKeys.map((mk) => {
              return (
                <td key={mk.key} style={{ textAlign: 'right' }}>
                  <div className={styles.editableValue}>
                    <FormattedInput
                      className={styles.valueInput}
                      value={impl[mk.key]}
                      tipoValor={activity.tipoValor || 'Numérico'}
                      onChange={(v) => onUpdateImpl(impl.id, mk.key, v)}
                    />
                    <BudgetIconMonth 
                      actId={activity.id} 
                      monthLabel={mk.label} 
                      monthKey={mk.key} 
                      value={impl[mk.key]}
                      isEmptyRow={!impl.tecnico && !impl.implementador && !impl.ubicacion}
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
          <td colSpan={14}>
            <button className={styles.addImplBtn} onClick={(e) => { e.stopPropagation(); onAddImpl() }}>
              <PlusCircle size={14} />
              Añadir técnico, implementador y ubicación
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
