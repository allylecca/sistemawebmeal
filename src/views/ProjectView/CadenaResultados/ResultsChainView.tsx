import { useMemo, useState } from 'react'
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
  GripVertical,
  PlusCircle,
  MinusCircle
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

/* ─── Helpers ─────────────────────────────────── */
const getStatus = (total2025: number, total2026: number, total2027: number): StatusType => {
  const sum = total2025 + total2026 + total2027
  if (sum === 0) return 'nodata'
  const allFilled = total2025 > 0 && total2026 > 0 && total2027 > 0
  return allFilled ? 'completed' : 'incomplete'
}

const statusLabels: Record<StatusType, string> = {
  completed: 'Completado',
  incomplete: 'Incompleto',
  nodata: 'Sin data'
}

const buildLocationLabel = (loc: typeof locationsData[0], depth = 0): string[] => {
  const result: string[] = []
  const visit = (node: typeof locationsData[0], path: string) => {
    const currentPath = path ? `${path}, ${node.label}` : node.label
    if (!node.children || node.children.length === 0) {
      result.push(currentPath)
    } else {
      node.children.forEach(c => visit(c, currentPath))
    }
  }
  visit(loc, '')
  return result
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

  // Only show activities that have unit+tipoValor (Marco Lógico or Complementaria types)
  const activities = useMemo(() => {
    return actividadData.filter(a => a.unidad && a.tipoValor)
  }, [])

  // State per activity
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
            implementador: '',
            ubicacion: '',
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

  // Calculate totals
  const getTotals = (actId: number) => {
    const state = actStates.find(s => s.activityId === actId)
    if (!state) return { y2025: 0, y2026: 0, y2027: 0, total: 0 }
    const y2025 = state.implementors.reduce((sum, i) => sum + i.y2025, 0)
    const y2026 = state.implementors.reduce((sum, i) => sum + i.y2026, 0)
    const y2027 = state.implementors.reduce((sum, i) => sum + i.y2027, 0)
    return { y2025, y2026, y2027, total: y2025 + y2026 + y2027 }
  }

  // Grand totals
  const grandTotals = useMemo(() => {
    return actStates.reduce(
      (acc, s) => {
        const t = getTotals(s.activityId)
        return {
          y2025: acc.y2025 + t.y2025,
          y2026: acc.y2026 + t.y2026,
          y2027: acc.y2027 + t.y2027,
          total: acc.total + t.total
        }
      },
      { y2025: 0, y2026: 0, y2027: 0, total: 0 }
    )
  }, [actStates])

  const renderStatusBadge = (status: StatusType) => {
    const cls = status === 'completed' ? styles.statusCompleted
      : status === 'incomplete' ? styles.statusIncomplete
        : styles.statusNodata
    return (
      <span className={`${styles.statusBadge} ${cls}`}>
        <span className={styles.statusDot} />
        {statusLabels[status]}
      </span>
    )
  }

  const renderYearCell = (value: number, showInfo = true) => (
    <div className={styles.yearCell}>
      <span className={styles.sigmaValue}>Σ {value.toLocaleString('es')}</span>
      {showInfo && (
        <button className={styles.infoBtn} title="Ver detalle">
          <Info size={13} />
        </button>
      )}
    </div>
  )

  const getImplStatus = (val: number): 'green' | 'orange' | 'red' => {
    if (val > 0) return 'green'
    return 'orange'
  }

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
            backgroundColor: '#f87c56', border: 'none', borderRadius: '6px',
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
                  <GripVertical size={14} className={styles.thIcon} />
                  ACTIVIDAD
                  <ArrowUpDown size={14} className={styles.thIcon} />
                  <ListFilter size={14} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'center' }}>
                <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2025
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'center' }}>
                <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2026
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colYear} style={{ textAlign: 'center' }}>
                <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                  <ListFilter size={13} className={styles.thIcon} />
                  2027
                  <ArrowUpDown size={13} className={styles.thIcon} />
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
              <th className={styles.colTotal} style={{ textAlign: 'center' }}>
                <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                  TOTAL
                  <ListFilter size={13} className={styles.thIcon} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act, idx) => {
              const state = actStates.find(s => s.activityId === act.id)
              const totals = getTotals(act.id)
              const status = getStatus(totals.y2025, totals.y2026, totals.y2027)
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
                  renderStatusBadge={renderStatusBadge}
                  renderYearCell={renderYearCell}
                  getImplStatus={getImplStatus}
                />
              )
            })}

            {/* ─── TOTALS ────────────────────────── */}
            <tr className={styles.totalsRow}>
              <td style={{ textAlign: 'center', fontSize: '13px', letterSpacing: '0.05em' }}>
                TOTALES
              </td>
              <td style={{ textAlign: 'center' }}>
                {renderYearCell(grandTotals.y2025)}
              </td>
              <td style={{ textAlign: 'center' }}>
                {renderYearCell(grandTotals.y2026)}
              </td>
              <td style={{ textAlign: 'center' }}>
                {renderYearCell(grandTotals.y2027)}
              </td>
              <td className={styles.totalHighlight} style={{ textAlign: 'center' }}>
                {renderYearCell(grandTotals.total)}
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
  renderStatusBadge: (status: StatusType) => React.ReactNode
  renderYearCell: (value: number, showInfo?: boolean) => React.ReactNode
  getImplStatus: (val: number) => 'green' | 'orange' | 'red'
}

function ActivityRowGroup({
  activity, isExpanded, implRows, totals, status,
  onToggle, onAddImpl, onUpdateImpl,
  renderStatusBadge, renderYearCell, getImplStatus
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
            <button className={styles.infoBtn} title="Info">
              <Info size={14} />
            </button>
            <span className={styles.activityCode}>{activity.codigoActividad}</span>
            <span style={{ color: '#7a6e6a' }}>-</span>
            <span className={styles.activityName}>{activity.nombre}</span>
            <span className={styles.badgeUnit}>{activity.unidad || 'Personas'}</span>
            <span style={{ color: '#7a6e6a', margin: '0 2px' }}>–</span>
            <span className={styles.badgeUnit}>{activity.tipoValor || 'Numérico'}</span>
            <span style={{ marginLeft: '8px' }}>{renderStatusBadge(status)}</span>
          </div>
        </td>
        <td style={{ textAlign: 'center' }}>
          {renderYearCell(totals.y2025)}
        </td>
        <td style={{ textAlign: 'center' }}>
          {renderYearCell(totals.y2026)}
        </td>
        <td style={{ textAlign: 'center' }}>
          {renderYearCell(totals.y2027)}
        </td>
        <td className={styles.totalHighlight} style={{ textAlign: 'center' }}>
          {renderYearCell(totals.total)}
        </td>
      </tr>

      {/* Expanded Sub-Rows (implementer + location) */}
      {isExpanded && implRows.map((impl) => {
        const implTotal = impl.y2025 + impl.y2026 + impl.y2027
        return (
          <tr key={impl.id} className={styles.implRow}>
            <td>
              <div className={styles.implCell}>
                <GripVertical size={14} className={styles.implIcon} />
                <select
                  className={styles.implSelect}
                  value={impl.implementador}
                  onChange={(e) => onUpdateImpl(impl.id, 'implementador', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Seleccionar implementador</option>
                  {implOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select
                  className={styles.implSelect}
                  value={impl.ubicacion}
                  onChange={(e) => onUpdateImpl(impl.id, 'ubicacion', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Seleccionar ubicación</option>
                  {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </td>
            <td style={{ textAlign: 'center' }}>
              <div className={styles.editableValue}>
                <span className={`${styles.statusCircle} ${impl.y2025 > 0 ? '' : styles.red}`}
                  style={{ color: impl.y2025 > 0 ? undefined : '#e53935' }}>
                  {impl.y2025 > 0 ? '' : <MinusCircle size={14} />}
                </span>
                <input
                  className={styles.valueInput}
                  type="text"
                  value={impl.y2025}
                  onChange={(e) => onUpdateImpl(impl.id, 'y2025', parseInt(e.target.value) || 0)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={`${styles.statusCircle} ${getImplStatus(impl.y2025) === 'green' ? styles.green : styles.orange}`} />
              </div>
            </td>
            <td style={{ textAlign: 'center' }}>
              <div className={styles.editableValue}>
                <input
                  className={styles.valueInput}
                  type="text"
                  value={impl.y2026}
                  onChange={(e) => onUpdateImpl(impl.id, 'y2026', parseInt(e.target.value) || 0)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={`${styles.statusCircle} ${getImplStatus(impl.y2026) === 'green' ? styles.green : styles.orange}`} />
              </div>
            </td>
            <td style={{ textAlign: 'center' }}>
              <div className={styles.editableValue}>
                <input
                  className={styles.valueInput}
                  type="text"
                  value={impl.y2027}
                  onChange={(e) => onUpdateImpl(impl.id, 'y2027', parseInt(e.target.value) || 0)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={`${styles.statusCircle} ${getImplStatus(impl.y2027) === 'green' ? styles.green : styles.orange}`} />
              </div>
            </td>
            <td className={styles.totalHighlight} style={{ textAlign: 'center' }}>
              <div className={styles.editableValue}>
                <span className={styles.sigmaValue}>Σ {implTotal.toLocaleString('es')}</span>
                <button className={styles.infoBtn}><Info size={13} /></button>
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
