import React, { useMemo, useState, useRef, useEffect, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import {
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCcw,
  Download,
  Info,
  PlusCircle,
  MinusCircle,
  PencilRuler
} from 'lucide-react'
import {
  actividadData,
  implementadoresData,
  locationsData,
  planesAnualesData,
  subactividadData
} from '../../../data/mockData'
import type { Actividad } from '../../../data/types'
import styles from './ResultsChainView.module.css' // Reusing styles from ResultsChainView

const DEFAULT_IMPS = ['AEA Peru', 'AEA Bolivia', 'Power Mas']
const DEFAULT_LOCS = ['Perú, La Libertad, Trujillo', 'Perú, La Libertad, Chepén']

/* ─── Types ───────────────────────────────────── */
interface ImplRow {
  id: number
  tecnico: string
  implementador: string
  ubicacion: string
  metaAnual: number
  isAuto?: boolean
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

interface ItemState {
  itemId: string
  expanded: boolean
  implementors: ImplRow[]
}



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

/* ─── Indicator Mock Data ─── */
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
  { id: 1, tipo: 'lineaEstrategica', codigo: 'PROT-LE-01', nombre: 'Sistemas comunitarios protección', y2025: 1845, y2026: 2000, y2027: 2500, unidad: 'Sistemas', tipoValor: 'Numérico' },
  { id: 2, tipo: 'resultado', codigo: 'PROT-RI-01', nombre: 'Conocimiento derechos NNA', y2025: 2410, y2026: 2600, y2027: 3000, unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 3, tipo: 'producto', codigo: 'PROT-PR-01', nombre: 'Programas formación DDHH', y2025: 920, y2026: 1000, y2027: 1200, unidad: 'Programas', tipoValor: 'Numérico' },
  { id: 4, tipo: 'producto', codigo: 'PROT-PR-02', nombre: 'Participación recreación deporte', y2025: 2780, y2026: 3000, y2027: 3500, unidad: 'Actividades', tipoValor: 'Numérico' },
  { id: 5, tipo: 'beneficiario', codigo: 'BEN-T', nombre: 'Beneficiarios Totales', y2025: 1350, y2026: 1500, y2027: 1800, unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 6, tipo: 'beneficiario', codigo: 'BEN-H', nombre: 'Beneficiarios Hombres', y2025: 2115, y2026: 2300, y2027: 2800, unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 7, tipo: 'beneficiario', codigo: 'BEN-M', nombre: 'Beneficiarios Mujeres', y2025: 675, y2026: 700, y2027: 900, unidad: 'Personas', tipoValor: 'Numérico' },
] as (IndicatorMeta & { unidad: string, tipoValor: string })[]

const subprojectIndicatorsMock = [
  { id: 1, codigo: 'IND-SUB-01', nombre: 'Metas subproyecto', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
  { id: 2, codigo: 'IND-OG-01', nombre: 'Gobernanza local', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 3, codigo: 'IND-OE-01', nombre: 'Capacitación funcionarios', unidad: 'Funcionarios', tipoValor: 'Numérico' },
  { id: 4, codigo: 'IND-OE-02', nombre: 'Transparencia institucional', unidad: 'Mecanismos', tipoValor: 'Numérico' },
  { id: 5, codigo: 'IND-R-01', nombre: 'Gestión pública', unidad: 'Certificados', tipoValor: 'Numérico' },
  { id: 6, codigo: 'IND-R-02', nombre: 'Manuales operativos', unidad: 'Manuales', tipoValor: 'Numérico' },
  { id: 7, codigo: 'IND-R-03', nombre: 'Datos abiertos', unidad: 'Portales', tipoValor: 'Numérico' },
]

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



/* ─── ActivityTotalInfoIcon (columna TOTAL de fila de actividad) ── */
function ActivityTotalInfoIcon({
  programmedTotal,
  annualGoal,
  tipoValor
}: {
  programmedTotal: number,
  annualGoal: number,
  tipoValor?: string
}) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()

  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')
  const diff = annualGoal - programmedTotal

  let iconColor = '#b5a99d';
  if (programmedTotal > 0 || annualGoal > 0) {
    if (annualGoal > 0 && programmedTotal >= annualGoal) {
      iconColor = '#4caf50';
    } else if (programmedTotal > 0) {
      iconColor = '#f5a623';
    }
  }

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle">
        <Info size={14} color={iconColor} />
      </button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Estado de la meta anual</div>
          <table className={styles.tooltipTable}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Total esperado</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVal(annualGoal)}</td>
              </tr>
              <tr style={{ height: '8px' }}></tr>
              <tr>
                <td>Meta programada (Meses)</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVal(programmedTotal)}</td>
              </tr>
              <tr>
                <td style={{ color: '#e53935', fontSize: '12px', paddingLeft: '10px' }}>Diferencia meses</td>
                <td style={{ textAlign: 'right', color: '#e53935', fontSize: '12px' }}>{formatVal(diff)}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.tooltipTotal} style={{ marginTop: '12px', borderTop: '2px solid #f0f0f0', paddingTop: '8px' }}>
            <span>Estado de programación</span>
            <span style={{ color: diff > 0 ? '#e65100' : diff < 0 ? '#e53935' : '#2e7d32' }}>
              {diff > 0 ? `Faltan ${formatVal(diff)}` : diff < 0 ? `Excede en ${formatVal(Math.abs(diff))}` : 'Programación completa'}
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}



/* ─── ImplTotalInfoIcon (columna TOTAL de sub-fila) ── */
function ImplTotalInfoIcon({ impl, allRows, tipoValor }: { impl: ImplRow, allRows: ImplRow[], tipoValor?: string }) {
  const { visible, tooltipStyle, btnRef, tooltipRef, handleMouseEnter, handleMouseLeave, tooltipMouseLeave } = useTooltipPos()

  // Group by implementer and location
  const group = allRows.filter(r => r.implementador === impl.implementador && r.ubicacion === impl.ubicacion);

  const getRowTotal = (row: ImplRow) => {
    if (tipoValor === 'Porcentaje') {
      const vals = monthKeys.map(mk => row[mk.key]).filter(v => v > 0)
      return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
    }
    return monthKeys.reduce((sum, mk) => sum + row[mk.key], 0)
  }

  const groupTotal = group.reduce((sum, r) => sum + getRowTotal(r), 0);
  const groupMeta = group.reduce((sum, r) => sum + r.metaAnual, 0);
  const diff = groupMeta - groupTotal
  const formatVal = (v: number) => tipoValor === 'Porcentaje' ? `${v}%` : v.toLocaleString('es')

  let iconColor = '#b5a99d'; // gris por defecto
  if (groupTotal > 0 || groupMeta > 0) {
    if (groupMeta > 0 && groupTotal >= groupMeta) {
      iconColor = '#4caf50'; // verde (alcanzó o excedió)
    } else if (groupTotal > 0) {
      iconColor = '#f5a623'; // amarillo (falta)
    }
  }

  return (
    <>
      <button ref={btnRef} className={styles.infoBtn} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={e => e.stopPropagation()} title="Ver detalle">
        <Info size={14} color={iconColor} />
      </button>
      {visible && createPortal(
        <div ref={tooltipRef} className={styles.budgetTooltip} style={tooltipStyle} onMouseLeave={tooltipMouseLeave}>
          <div className={styles.tooltipHeader}>Estado de la meta por Implementador y Ubicación</div>
          <div className={styles.tooltipImplInfo}>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Implementador: </span><span className={styles.tooltipImplValue}>{impl.implementador || '—'}</span></div>
            <div className={styles.tooltipImplRow}><span className={styles.tooltipImplLabel}>Ubicación: </span><span className={styles.tooltipImplValue}>{impl.ubicacion || '—'}</span></div>
          </div>
          <table className={styles.tooltipTable}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Meta esperada (Grupo)</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVal(groupMeta)}</td>
              </tr>
              <tr>
                <td>Total registrado (Grupo)</td>
                <td style={{ textAlign: 'right' }}>{formatVal(groupTotal)}</td>
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


const locationOptions = [...DEFAULT_LOCS].sort()
const implOptions = [...DEFAULT_IMPS].sort()
const tecnicoOptions = ['Juan Pérez', 'María Gómez', 'Carlos Silva']

/* ─── Component ───────────────────────────────── */
export function MonthlyGoalsView() {
  const [programFilter, setProgramFilter] = useState('Programa Perú')
  const [projectFilter, setProjectFilter] = useState('EDUCACIÓN DE CALIDAD')
  const [subprojectFilter, setSubprojectFilter] = useState('249062 - Capacitación técnica para jóvenes creativos')
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

  const [itemStates, setItemStates] = useState<ItemState[]>(() => {
    const states: ItemState[] = []

    const generateRows = (totalGoal: number) => {
      const rows: ImplRow[] = []
      let idCounter = Date.now() + Math.random()
      const goalPerGroup = Math.round(totalGoal / (DEFAULT_IMPS.length * DEFAULT_LOCS.length))

      DEFAULT_IMPS.forEach(imp => {
        DEFAULT_LOCS.forEach(loc => {
          rows.push({
            id: idCounter++,
            tecnico: '', // No auto-filled technician names
            implementador: imp,
            ubicacion: loc,
            metaAnual: goalPerGroup,
            isAuto: true,
            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0,
            jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0
          })
        })
      })
      return rows
    }

    // 1. Activities
    activities.forEach((a) => {
      states.push({
        itemId: `act-${a.id}`,
        expanded: true,
        implementors: generateRows(600) // Default goal 600
      })
    })

    // 2. Institutional Indicators
    indicatorsMock.forEach(item => {
      const goal = (item as any)[`y2025`] || 600
      states.push({
        itemId: `inst-${item.id}`,
        expanded: true,
        implementors: generateRows(goal)
      })
    })

    // 3. Subproject Indicators
    subprojectIndicatorsMock.forEach(item => {
      states.push({
        itemId: `indsub-${item.id}`,
        expanded: true,
        implementors: generateRows(600)
      })
    })

    // 4. Subactivities
    subactividadData.slice(0, 5).forEach(item => {
      states.push({
        itemId: `sub-${item.id}`,
        expanded: true,
        implementors: generateRows(600)
      })
    })

    return states
  })

  function toggleExpand(itemId: string) {
    setItemStates(prev => prev.map(s =>
      s.itemId === itemId ? { ...s, expanded: !s.expanded } : s
    ))
  }

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ inst: true });
  const toggleCategory = (cat: string) => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));

  const [quantities, setQuantities] = useState<Record<string, string>>(() => ({}));




  const handleQuantityChange = (id: string, mk: MonthKey, val: string) => {
    const numVal = parseFloat(val) || 0;

    // Total Annual Meta (limit for header targets)
    const meta = (() => {
      if (id.startsWith('inst-')) {
        const instId = parseInt(id.replace('inst-', ''))
        const item = indicatorsMock.find(i => i.id === instId)
        return item ? (item as any)[`y${yearFilter}`] : 600
      }
      const state = itemStates.find(s => s.itemId === id)
      return state?.implementors.reduce((sum, i) => sum + (i.isAuto ? i.metaAnual : 0), 0) || 600
    })();

    const currentSumOfOthers = monthKeys.reduce((sum, m) => {
      if (m.key === mk) return sum;
      return sum + (parseFloat(quantities[`${id}-${m.key}`]) || 0);
    }, 0);

    if (currentSumOfOthers + numVal > meta) {
      return; // Reject change if it exceeds annual goal
    }

    setQuantities(prev => ({ ...prev, [`${id}-${mk}`]: numVal.toString() }));
  };



  const renderItemRow = (id: string, label: string, unidad?: string, tipoValor?: string) => {
    const state = itemStates.find(s => s.itemId === id)
    const isExpanded = state?.expanded || false
    const implRows = state?.implementors || []
    const totals = getTotals(id, tipoValor)

    const programmedTotal = monthKeys.reduce((sum, mk) => sum + (parseFloat(quantities[`${id}-${mk.key}`]) || 0), 0);
    const annualGoal = (() => {
      if (id.startsWith('inst-')) {
        const instId = parseInt(id.replace('inst-', ''))
        const item = indicatorsMock.find(i => i.id === instId)
        return item ? (item as any)[`y${yearFilter}`] : 0
      }
      return implRows.reduce((sum, i) => sum + (i.isAuto ? i.metaAnual : 0), 0) || 600
    })();

    return (
      <Fragment key={id}>
        <tr className={styles.activityRow} onClick={() => toggleExpand(id)} style={{ cursor: 'pointer' }}>
          <td>
            <div className={styles.activityCell}>
              <button className={styles.chevronBtn}>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className={styles.activityName}>{label}</span>
              {unidad && (
                <div className={styles.iconBadgeGroup}>
                  <div className={`${styles.iconBadge} ${styles.iconBadgeUnit}`} title={`Unidad: ${unidad} - ${tipoValor || 'Numérico'}`}>
                    <PencilRuler size={14} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          </td>
          <td style={{ textAlign: 'right', backgroundColor: '#eeeeee', borderLeft: '1px solid #f0f0f0', fontWeight: 800, paddingRight: '12px' }}>
            <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
              <span>{tipoValor === 'Porcentaje' ? `${programmedTotal}%` : programmedTotal.toLocaleString('es')}</span>
              <ActivityTotalInfoIcon
                programmedTotal={programmedTotal}
                annualGoal={annualGoal}
                tipoValor={tipoValor}
              />
            </div>
          </td>
          {monthKeys.map(mk => {
            const mQtyStr = quantities[`${id}-${mk.key}`] || '';

            return (
              <td key={mk.key} style={{ textAlign: 'right', backgroundColor: '#f9f9f9', borderLeft: '1px solid #f0f0f0' }} onClick={(e) => e.stopPropagation()}>
                <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                  <input
                    type="number"
                    className={styles.valueInput}
                    value={quantities[`${id}-${mk.key}`] || ''}
                    onChange={(e) => handleQuantityChange(id, mk.key, e.target.value)}
                    placeholder="0"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      width: '60px'
                    }}
                  />
                </div>
              </td>
            );
          })}
        </tr>

        {/* Expanded Sub-Rows */}
        {isExpanded && implRows.map((impl) => (
          <tr key={impl.id} className={styles.implRow}>
            <td>
              <div className={styles.implCell}>
                <button
                  className={styles.deleteImplBtn}
                  onClick={(e) => { e.stopPropagation(); deleteImplementor(id, impl.id) }}
                >
                  <MinusCircle size={15} />
                </button>
                <select
                  className={styles.implSelect}
                  value={impl.tecnico}
                  onChange={(e) => updateImplField(id, impl.id, 'tecnico', e.target.value)}
                >
                  <option value="">Seleccionar técnico</option>
                  {tecnicoOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select
                  className={styles.implSelect}
                  value={impl.implementador}
                  onChange={(e) => updateImplField(id, impl.id, 'implementador', e.target.value)}
                  disabled={impl.isAuto}
                >
                  <option value="">Seleccionar implementador</option>
                  {implOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select
                  className={styles.implSelect}
                  value={impl.ubicacion}
                  onChange={(e) => updateImplField(id, impl.id, 'ubicacion', e.target.value)}
                  disabled={impl.isAuto}
                >
                  <option value="">Seleccionar ubicación</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </td>
            <td style={{ textAlign: 'right', backgroundColor: '#f9f9f9', borderLeft: '1px solid #f0f0f0', paddingRight: '12px' }}>
              <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>
                  {(() => {
                    let implTotal = 0;
                    if (tipoValor === 'Porcentaje') {
                      const vals = monthKeys.map(mk => impl[mk.key]).filter(v => v > 0)
                      implTotal = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
                    } else {
                      implTotal = monthKeys.reduce((sum, mk) => sum + impl[mk.key], 0)
                    }
                    return tipoValor === 'Porcentaje' ? `${implTotal}%` : implTotal.toLocaleString('es');
                  })()}
                </span>
                <ImplTotalInfoIcon impl={impl} allRows={implRows} tipoValor={tipoValor} />
              </div>
            </td>
            {monthKeys.map(mk => {
              const monthlyTarget = parseFloat(quantities[`${id}-${mk.key}`]) || 0
              const usedInMonthByOthers = implRows.reduce((sum, r) => r.id === impl.id ? sum : sum + (r[mk.key] || 0), 0)
              const remainingInMonth = Math.max(0, monthlyTarget - usedInMonthByOthers)
              const usedInRowByOtherMonths = monthKeys.reduce((sum, m) => m.key === mk.key ? sum : sum + (impl[m.key] || 0), 0)
              // Only apply row limit if metaAnual has been set (> 0)
              const remainingInRow = impl.metaAnual > 0
                ? Math.max(0, impl.metaAnual - usedInRowByOtherMonths)
                : Infinity
              const cellMax = Math.min(remainingInMonth, remainingInRow)
              return (
                <td key={mk.key} style={{ textAlign: 'right' }}>
                  <div className={styles.editableValue}>
                    <FormattedInput
                      className={styles.valueInput}
                      value={impl[mk.key]}
                      tipoValor={tipoValor || 'Numérico'}
                      max={cellMax}
                      onChange={(v) => updateImplField(id, impl.id, mk.key, v)}
                    />
                  </div>
                </td>
              )
            })}
          </tr>
        ))}

        {isExpanded && (
          <tr className={styles.addImplRow}>
            <td colSpan={14}>
              <button className={styles.addImplBtn} onClick={(e) => { e.stopPropagation(); addImplementor(id) }}>
                <PlusCircle size={14} />
                Añadir técnico, implementador y ubicación
              </button>
            </td>
          </tr>
        )}
      </Fragment>
    );
  };

  function addImplementor(itemId: string) {
    setItemStates(prev => prev.map(s => {
      if (s.itemId !== itemId) return s
      return {
        ...s,
        implementors: [
          ...s.implementors,
          {
            id: Date.now() + Math.random(),
            tecnico: '',
            implementador: '',
            ubicacion: '',
            metaAnual: 0,
            isAuto: false, // Explicitly false for new rows
            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0,
            jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0
          }
        ]
      }
    }))
  }

  function updateImplField(itemId: string, implId: number, field: keyof ImplRow, value: any) {
    setItemStates(prev => prev.map(s => {
      if (s.itemId !== itemId) return s

      // Calculate total item meta (Annual Goal)
      const itemMeta = (() => {
        if (itemId.startsWith('inst-')) {
          const instId = parseInt(itemId.replace('inst-', ''))
          const item = indicatorsMock.find(i => i.id === instId)
          return item ? (item as any)[`y${yearFilter}`] : 600
        }
        // For activities, sum of metaAnual of auto rows (which is totalGoal)
        return s.implementors.reduce((sum, i) => sum + (i.isAuto ? i.metaAnual : 0), 0) || 600
      })();

      const updatedImplementors = s.implementors.map(imp => {
        if (imp.id !== implId) return imp;

        if (monthKeys.some(mk => mk.key === field)) {
          const mk = field as MonthKey;
          const numVal = parseFloat(value) || 0;

          // Column Limit: The value in the header for this month (the target)
          const monthlyTarget = parseFloat(quantities[`${itemId}-${mk}`]) || 0;

          // Current sum of all technicians in THIS specific month
          const registeredInMonthOthers = s.implementors.reduce((sum, r) => {
            if (r.id === implId) return sum;
            return sum + (r[mk] || 0);
          }, 0);

          // Column Limit Check
          if (registeredInMonthOthers + numVal > monthlyTarget) {
            return imp; // Reject change if it exceeds monthly target
          }

          // Row Limit Check
          const annualGroupMeta = imp.metaAnual;
          const currentSumOfOtherMonthsForThisTech = monthKeys.reduce((sum, m) => {
            if (m.key === mk) return sum;
            return sum + (imp[m.key] || 0);
          }, 0);

          // Row Limit Check — only if metaAnual has been set (> 0)
          if (annualGroupMeta > 0 && currentSumOfOtherMonthsForThisTech + numVal > annualGroupMeta) {
            return imp; // Reject change if it exceeds annual group meta
          }
          return { ...imp, [field]: numVal };
        }

        return { ...imp, [field]: value };
      });

      return { ...s, implementors: updatedImplementors };
    }))
  }

  function deleteImplementor(itemId: string, implId: number) {
    setItemStates(prev => prev.map(s => {
      if (s.itemId !== itemId) return s
      return {
        ...s,
        implementors: s.implementors.filter(imp => imp.id !== implId)
      }
    }))
  }

  const getTotals = (itemId: string, tipoValor?: string) => {
    const state = itemStates.find(s => s.itemId === itemId)
    const init = { ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0, total: 0 }
    if (!state || state.implementors.length === 0) {
      const totals = { ...init }
      monthKeys.forEach(mk => {
        totals[mk.key] = parseFloat(quantities[`${itemId}-${mk.key}`]) || 0
      })
      if (tipoValor === 'Porcentaje') {
        const vals = monthKeys.map(mk => totals[mk.key]).filter(v => v > 0)
        totals.total = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
      } else {
        totals.total = monthKeys.reduce((sum, mk) => sum + totals[mk.key], 0)
      }
      return totals
    }

    if (tipoValor === 'Porcentaje') {
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
      const result = { ...init }
      state.implementors.forEach(impl => {
        monthKeys.forEach(mk => {
          result[mk.key] += (impl[mk.key] || 0)
        })
      })
      result.total = monthKeys.reduce((sum, mk) => sum + result[mk.key], 0)
      return result
    }
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
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Año"
            options={yearOptions}
            value={yearFilter}
            onChange={setYearFilter}
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
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'center', minWidth: '100px', backgroundColor: '#f9f9f9' }}>
                <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                  TOTAL GENERAL
                </div>
              </th>
              {monthKeys.map(mk => (
                <th key={mk.key} className={styles.colYear} style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div className={styles.thContent} style={{ justifyContent: 'flex-end' }}>
                    {mk.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 1. Indicadores Institucionales */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('inst')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['inst'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Indicadores Institucionales</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f0f0f0', borderLeft: '1px solid #f0f0f0' }}></td>
              {monthKeys.map(mk => <td key={`inst-${mk.key}`} style={{ borderLeft: '1px solid #f0f0f0' }}></td>)}
            </tr>
            {expandedCategories['inst'] && indicatorsMock.map(item =>
              renderItemRow(`inst-${item.id}`, `${item.codigo} - ${item.nombre}`, (item as any).unidad, (item as any).tipoValor)
            )}

            {/* 2. Indicadores de subproyecto */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('indsub')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['indsub'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Indicadores de Subproyecto</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f0f0f0', borderLeft: '1px solid #f0f0f0' }}></td>
              {monthKeys.map(mk => <td key={`indsub-${mk.key}`} style={{ borderLeft: '1px solid #f0f0f0' }}></td>)}
            </tr>
            {expandedCategories['indsub'] && subprojectIndicatorsMock.map(item =>
              renderItemRow(`indsub-${item.id}`, `${item.codigo} - ${item.nombre}`, item.unidad, item.tipoValor)
            )}

            {/* 3. Actividades */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('act')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['act'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Actividades</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f0f0f0', borderLeft: '1px solid #f0f0f0' }}></td>
              {monthKeys.map(mk => <td key={`act-${mk.key}`} style={{ borderLeft: '1px solid #f0f0f0' }}></td>)}
            </tr>
            {expandedCategories['act'] && activities.map((act) => {
              const itemId = `act-${act.id}`
              const state = itemStates.find(s => s.itemId === itemId)
              const totals = getTotals(itemId, act.tipoValor)
              const isExpanded = state?.expanded || false

              return (
                <ActivityRowGroup
                  key={act.id}
                  activity={act}
                  isExpanded={isExpanded}
                  implRows={state?.implementors || []}
                  totals={totals}
                  onToggle={() => toggleExpand(itemId)}
                  onAddImpl={() => addImplementor(itemId)}
                  onUpdateImpl={(implId, field, value) => updateImplField(itemId, implId, field, value)}
                  onDeleteImpl={(implId) => deleteImplementor(itemId, implId)}
                  renderUnitIcon={renderUnitIcon}
                  onQuantityChange={handleQuantityChange}
                  quantities={quantities}
                />
              )
            })}

            {/* 4. Subactividades */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('sub')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['sub'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Subactividades</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f0f0f0', borderLeft: '1px solid #f0f0f0' }}></td>
              {monthKeys.map(mk => <td key={`sub-${mk.key}`} style={{ borderLeft: '1px solid #f0f0f0' }}></td>)}
            </tr>
            {expandedCategories['sub'] && subactividadData.slice(0, 5).map(item =>
              renderItemRow(`sub-${item.id}`, `${item.codigoSubactividad} - ${item.nombre}`, item.unidad, item.tipoValor)
            )}


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
function FormattedInput({ value, tipoValor, onChange, max, style, className }: {
  value: number
  tipoValor: string
  onChange: (v: number) => void
  max?: number
  style?: React.CSSProperties
  className?: string
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [draftValue, setDraftValue] = useState('')

  const formatDisplay = (v: number) => {
    if (v === 0) return ''
    return v.toLocaleString('es')
  }

  const handleFocus = () => {
    setIsFocused(true)
    setDraftValue(value === 0 ? '' : value.toString())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    let num = parseFloat(raw) || 0
    if (max !== undefined && num > max) {
      num = max
      setDraftValue(max === 0 ? '' : max.toString())
    } else {
      setDraftValue(raw)
    }
    onChange(num)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setDraftValue('')
  }

  return (
    <input
      type="text"
      className={className || styles.valueInput}
      style={style}
      value={isFocused ? draftValue : formatDisplay(value)}
      onFocus={handleFocus}
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
  onToggle: () => void
  onAddImpl: () => void
  onUpdateImpl: (implId: number, field: keyof ImplRow, value: any) => void
  onDeleteImpl: (implId: number) => void
  renderUnitIcon: (activity: Actividad) => React.ReactNode
  onQuantityChange: (id: string, mk: MonthKey, val: string) => void
  quantities: Record<string, string>
}

function ActivityRowGroup({
  activity, isExpanded, implRows, totals,
  onToggle, onAddImpl, onUpdateImpl, onDeleteImpl,
  renderUnitIcon,
  onQuantityChange, quantities
}: ActivityRowGroupProps) {
  const programmedTotal = monthKeys.reduce((sum, mk) => sum + (parseFloat(quantities[`act-${activity.id}-${mk.key}`]) || 0), 0);
  const annualGoal = implRows.reduce((sum, i) => sum + (i.isAuto ? i.metaAnual : 0), 0) || 600;

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
            </div>
          </div>
        </td>
        <td style={{ textAlign: 'right', backgroundColor: '#eeeeee', borderLeft: '1px solid #f0f0f0', fontWeight: 800, paddingRight: '12px' }}>
          <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
            <span>{activity.tipoValor === 'Porcentaje' ? `${programmedTotal}%` : programmedTotal.toLocaleString('es')}</span>
            <ActivityTotalInfoIcon
              programmedTotal={programmedTotal}
              annualGoal={annualGoal}
              tipoValor={activity.tipoValor}
            />
          </div>
        </td>
        {monthKeys.map(mk => {
          const mQtyStr = quantities[`act-${activity.id}-${mk.key}`] || '';

          return (
            <td key={mk.key} style={{ textAlign: 'right', backgroundColor: '#f9f9f9', borderLeft: '1px solid #f0f0f0' }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                <input
                  type="number"
                  className={styles.valueInput}
                  value={quantities[`act-${activity.id}-${mk.key}`] || ''}
                  onChange={(e) => onQuantityChange(`act-${activity.id}`, mk.key, e.target.value)}
                  placeholder="0"
                  style={{
                    textAlign: 'right',
                    fontWeight: 600,
                    width: '60px'
                  }}
                />
              </div>
            </td>
          );
        })}
      </tr>

      {/* Expanded Sub-Rows (implementer + location) */}
      {isExpanded && implRows.map((impl) => {
        let implTotal = 0;
        if (activity.tipoValor === 'Porcentaje') {
          const vals = monthKeys.map(mk => impl[mk.key]).filter(v => v > 0)
          implTotal = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
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
                  disabled={impl.isAuto}
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
                  disabled={impl.isAuto}
                >
                  <option value="">Seleccionar ubicación</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </td>
            <td style={{ textAlign: 'right', backgroundColor: '#f9f9f9', borderLeft: '1px solid #f0f0f0', paddingRight: '12px' }}>
              <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>
                  {activity.tipoValor === 'Porcentaje' ? `${implTotal}%` : implTotal.toLocaleString('es')}
                </span>
                <ImplTotalInfoIcon impl={impl} allRows={implRows} tipoValor={activity.tipoValor} />
              </div>
            </td>

            {/* ─── Month cells ─── */}
            {monthKeys.map((mk) => {
              const monthlyTarget = parseFloat(quantities[`act-${activity.id}-${mk.key}`]) || 0
              const usedInMonthByOthers = implRows.reduce((sum, r) => r.id === impl.id ? sum : sum + (r[mk.key] || 0), 0)
              const remainingInMonth = Math.max(0, monthlyTarget - usedInMonthByOthers)
              const usedInRowByOtherMonths = monthKeys.reduce((sum, m) => m.key === mk.key ? sum : sum + (impl[m.key] || 0), 0)
              // Only apply row limit if metaAnual has been set (> 0)
              const remainingInRow = impl.metaAnual > 0
                ? Math.max(0, impl.metaAnual - usedInRowByOtherMonths)
                : Infinity
              const cellMax = Math.min(remainingInMonth, remainingInRow)
              return (
                <td key={mk.key} style={{ textAlign: 'right' }}>
                  <div className={styles.editableValue}>
                    <FormattedInput
                      className={styles.valueInput}
                      value={impl[mk.key]}
                      tipoValor={activity.tipoValor || 'Numérico'}
                      max={cellMax}
                      onChange={(v) => onUpdateImpl(impl.id, mk.key, v)}
                    />
                  </div>
                </td>
              )
            })}
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
