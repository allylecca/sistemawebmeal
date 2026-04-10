import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Modal } from '../../../components/Modal/Modal'
import { Send, Eye, Pencil, CircleMinus, Trash2, EllipsisVertical, ChevronRight, ChevronDown } from 'lucide-react'
import { Input } from '../../../components/Input/Input'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { Button } from '../../../components/Button/Button'
import { Badge } from '../../../components/Badge/Badge'
import { planesAnualesData, programsData, subprojectCodesData, projectCodesData, strategicLinesData, institutionalIndicatorsData, unidadesData, tiposDeValorData, indicadoresAnualesData } from '../../../data/mockData'
import type { PlanAnual, IndicadoresAnuales } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import styles from './AnnualPlanningView.module.css'

const ActionMenu = ({ item, status, canSend, onEdit, onDelete, onSend }: {
  item: any,
  status: string,
  canSend?: boolean,
  onEdit: (i: any) => void,
  onDelete: (i: any) => void,
  onSend: (i: any) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom,
          right: document.documentElement.clientWidth - rect.right
        })
      }
    }

    updatePosition()

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target)) return
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top + 4}px`,
    right: `${position.right}px`,
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    padding: '8px 0',
    zIndex: 100,
    minWidth: '180px',
    display: 'flex',
    flexDirection: 'column'
  }

  const itemStyle: React.CSSProperties = {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    color: '#382e2c',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left'
  }

  const sepStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: '#eaeaea',
    margin: '4px 0'
  }

  const MenuItem = ({ icon: Icon, label, onClick, danger = false }: any) => {
    const [hover, setHover] = useState(false)
    return (
      <button
        style={{ ...itemStyle, color: danger ? '#d93025' : '#382e2c', backgroundColor: hover ? '#f9f9f9' : 'transparent' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onClick?.() }}
      >
        <Icon size={18} color={danger ? '#d93025' : '#382e2c'} />
        <span style={{ fontFamily: 'Georgia, serif', marginTop: '2px' }}>{label}</span>
      </button>
    )
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0a0a0', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}
      >
        <EllipsisVertical size={20} />
      </button>

      {isOpen && createPortal(
        <div style={menuStyle} ref={menuRef} onClick={e => e.stopPropagation()}>
          {status === 'Borrador' && (
            <>
              {canSend && <MenuItem icon={Send} label="Enviar" onClick={() => onSend(item)} />}
              <div style={sepStyle} />
              <MenuItem icon={Pencil} label="Editar" onClick={() => onEdit(item)} />
              <MenuItem icon={Trash2} label="Eliminar" danger onClick={() => onDelete(item)} />
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

export function AnnualPlanningView() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')

  // --- List Mode States ---
  const [projectFilter, setProjectFilter] = useState('')
  const [items, setItems] = useState<PlanAnual[]>(planesAnualesData)
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set())
  const [itemToDelete, setItemToDelete] = useState<PlanAnual | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [editingItem, setEditingItem] = useState<PlanAnual | null>(null)

  // Form fields for Steps 1 & 2
  const [formData, setFormData] = useState({
    programa: '',
    proyecto: '',
    subproyecto: '',
    gap: '',
    lineaEstrategica: '',
    codigo: '',
    financiador: '',
    gerenteSubproyecto: '',
    responsableMeal: '',
    inicioMes: '',
    inicioAno: '',
    finMes: '',
    finAno: '',
    involucrarSubactividades: false,
    implementadores: [] as string[],
    financiadoresSecundarios: [] as string[],
    ubicaciones: [] as Array<{ id: number, region: string, pais: string, departamento: string, provincia: string, distrito: string }>
  })

  // Table Data for Step 3
  const [indicators, setIndicators] = useState<IndicadoresAnuales[]>([])

  // Indicator Modal for Step 3
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false)
  const [indicatorFormData, setIndicatorFormData] = useState({
    tipo: '',
    indicadorInstitucional: ''
  })
  const [editingStep3Indicator, setEditingStep3Indicator] = useState<IndicadoresAnuales | null>(null)

  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showSendAlert, setShowSendAlert] = useState(false)
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false)
  const [itemToSend, setItemToSend] = useState<PlanAnual | null>(null)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // Metas: año seleccionable
  const [selectedYear, setSelectedYear] = useState<string>('2027')

  const yearOptions = useMemo(() => ['2025', '2026', '2027', '2028', '2029', '2030'], [])

  const indicatorTipos = useMemo(() => Array.from(new Set(institutionalIndicatorsData.map(i => i.tipo))), [])
  const indicatorOptionsByTipo = useMemo(() => {
    const types = Array.from(new Set(institutionalIndicatorsData.map(i => i.tipo)))
    const map: Record<string, string[]> = {}
    types.forEach(t => {
      map[t] = institutionalIndicatorsData
        .filter(i => i.tipo === t)
        .map(i => `${i.codigo} - ${i.nombre}`)
    })
    return map
  }, [])

  const indicatorNameOptions = useMemo(() => {
    if (!indicatorFormData.tipo) return []
    return institutionalIndicatorsData.filter(i => i.tipo === indicatorFormData.tipo).map(i => `${i.codigo} - ${i.nombre}`)
  }, [indicatorFormData.tipo])

  // Removed unidadOptions and tipoValorOptions; unidad y tipoValor vienen de la tabla institucional

  // ------------------------------------------
  // LIST MODE HELPERS
  // ------------------------------------------

  const getInitialIndicators = (lineaNombre: string) => {
    const lineObj = strategicLinesData.find(l => l.nombre === lineaNombre || `${l.codigo} - ${l.nombre}` === lineaNombre)

    // Helper to find best matching indicator from institutional base
    const findBest = (tipo: string, excludeIds: number[] = []) => {
      const candidates = institutionalIndicatorsData.filter(i => i.tipo === tipo && !excludeIds.includes(i.id))
      // Try exact line match first
      let match = candidates.find(i => i.lineaEstrategica === lineObj?.nombre)
      // If no exact match, try partial name match
      if (!match && lineObj) {
        match = candidates.find(i => i.nombre.includes(lineObj.nombre))
      }
      // Fallback to first available candidate of that type
      return match || candidates[0]
    }

    const base: any[] = []

    // 1 LE Indicator
    const le = findBest('Indicador de Línea Estratégica')
    base.push({
      id: Date.now(),
      tipo: 'Indicador de Línea Estratégica',
      indicador: le ? `${le.codigo} - ${le.nombre}` : 'Indicador de Línea Estratégica',
      unidad: le?.unidad || unidadesData[0]?.nombre || 'Personas',
      tipoValor: le?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    // 1 Result Indicator
    const res = findBest('Indicador de Resultado')
    base.push({
      id: Date.now() + 1,
      tipo: 'Indicador de Resultado',
      indicador: res ? `${res.codigo} - ${res.nombre}` : 'Indicador de Resultado',
      unidad: res?.unidad || unidadesData[0]?.nombre || 'Personas',
      tipoValor: res?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    // 2 Product Indicators
    const prod1 = findBest('Indicador de Producto')
    const prod2 = findBest('Indicador de Producto', [prod1?.id].filter(Boolean) as number[])

    base.push({
      id: Date.now() + 2,
      tipo: 'Indicador de Producto',
      indicador: prod1 ? `${prod1.codigo} - ${prod1.nombre}` : 'Indicador de Producto',
      unidad: prod1?.unidad || unidadesData[0]?.nombre || 'Personas',
      tipoValor: prod1?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    base.push({
      id: Date.now() + 3,
      tipo: 'Indicador de Producto',
      indicador: prod2 ? `${prod2.codigo} - ${prod2.nombre}` : 'Indicador de Producto',
      unidad: prod2?.unidad || unidadesData[0]?.nombre || 'Personas',
      tipoValor: prod2?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    base.push({
      id: Date.now() + 4,
      tipo: 'Beneficiario',
      indicador: 'BEN-T-Personas beneficiarias',
      unidad: 'Personas',
      tipoValor: 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    base.push({
      id: Date.now() + 5,
      tipo: 'Beneficiario',
      indicador: 'BEN-H-Hombres beneficiarios',
      unidad: 'Hombres',
      tipoValor: 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    base.push({
      id: Date.now() + 6,
      tipo: 'Beneficiario',
      indicador: 'BEN-M-Mujeres beneficiarias',
      unidad: 'Mujeres',
      tipoValor: 'Numérico',
      y2027: '0 000',
      isDefault: true
    })

    return base
  }

  const filteredData = useMemo(() => {
    if (!projectFilter) return items
    return items.filter(item => item.proyecto.includes(projectFilter) || item.proyecto === projectFilter)
  }, [projectFilter, items])

  // Group filteredData by programa
  const programGroups = useMemo(() => {
    const map = new Map<string, PlanAnual[]>()
    filteredData.forEach(item => {
      const existing = map.get(item.programa) || []
      existing.push(item)
      map.set(item.programa, existing)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredData])

  const toggleProgram = (progName: string) => {
    setExpandedPrograms(prev => {
      const next = new Set(prev)
      if (next.has(progName)) next.delete(progName)
      else next.add(progName)
      return next
    })
  }

  const handleNew = () => {
    setIsReadOnly(false)
    setEditingItem(null)
    setFormData({
      programa: '', proyecto: '', subproyecto: '', gap: '', lineaEstrategica: '', codigo: '', financiador: '',
      gerenteSubproyecto: '', responsableMeal: '', inicioMes: '', inicioAno: '', finMes: '', finAno: '',
      involucrarSubactividades: false, implementadores: [], financiadoresSecundarios: [], ubicaciones: []
    })
    setIndicators([])
    setViewMode('create')
  }

  const handleSendList = (item: PlanAnual) => {
    setItemToSend(item)
    setShowSendAlert(true)
  }

  const confirmSendList = () => {
    if (itemToSend) {
      setItems(items.map(i => i.id === itemToSend.id ? { ...i, estado: 'Pendiente' } : i))
    }
    setShowSendAlert(false)
    setItemToSend(null)
  }

  const parseDate = (dateStr: string) => {
    if (!dateStr) return { mes: '', ano: '' }
    const cleanStr = dateStr.replace(/^\d+/, '')
    const [mes, ano] = cleanStr.trim().split(' ')
    return { mes: mes || '', ano: ano || '' }
  }

  const handleEditList = (item: PlanAnual) => {
    setIsReadOnly(false)
    setEditingItem(item)
    const { mes: startM, ano: startY } = parseDate(item.fechainicio)
    const { mes: endM, ano: endY } = parseDate(item.fechafin)

    setFormData({
      programa: item.programa,
      proyecto: item.proyecto,
      subproyecto: item.subproyecto,
      gap: item.gap,
      lineaEstrategica: item.linea,
      codigo: item.codigosubproyecto,
      financiador: item.financiadorprincipal,
      gerenteSubproyecto: item.gerente,
      responsableMeal: item.responsable,
      inicioMes: startM,
      inicioAno: startY,
      finMes: endM,
      finAno: endY,
      involucrarSubactividades: false,
      implementadores: item.implementadores,
      financiadoresSecundarios: item.financiadoressecundarios,
      ubicaciones: item.ubicaciones.map((u, i) => ({ ...u, id: i, distrito: '' }))
    })
    setIndicators(getInitialIndicators(item.linea))
    setViewMode('create')
  }

  const handleViewList = (item: PlanAnual) => {
    setIsReadOnly(true)
    setEditingItem(item)
    const { mes: startM, ano: startY } = parseDate(item.fechainicio)
    const { mes: endM, ano: endY } = parseDate(item.fechafin)

    setFormData({
      programa: item.programa,
      proyecto: item.proyecto,
      subproyecto: item.subproyecto,
      gap: item.gap,
      lineaEstrategica: item.linea,
      codigo: item.codigosubproyecto,
      financiador: item.financiadorprincipal,
      gerenteSubproyecto: item.gerente,
      responsableMeal: item.responsable,
      inicioMes: startM,
      inicioAno: startY,
      finMes: endM,
      finAno: endY,
      involucrarSubactividades: false,
      implementadores: item.implementadores,
      financiadoresSecundarios: item.financiadoressecundarios,
      ubicaciones: item.ubicaciones.map((u, i) => ({ ...u, id: i, distrito: '' }))
    })
    setIndicators(getInitialIndicators(item.linea))
    setViewMode('create')
  }

  const handleDeleteList = (item: PlanAnual) => {
    setItemToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDeleteList = () => {
    if (itemToDelete) {
      setItems(items.filter(p => p.id !== itemToDelete.id))
    }
    setShowDeleteAlert(false)
    setItemToDelete(null)
  }

  // ------------------------------------------
  // CREATE/EDIT WIZARD HELPERS
  // ------------------------------------------

  const handleProgramaChange = (progName: string) => {
    setFormData(prev => ({
      ...prev,
      programa: progName,
      proyecto: '',
      subproyecto: '',
      gap: '',
      lineaEstrategica: '',
      codigo: '',
      financiador: ''
    }))
  }

  const handleProyectoChange = (projName: string) => {
    const proj = projectCodesData.find(p => `${p.codigo} - ${p.nombre}` === projName || p.nombre === projName)
    if (proj) {
      const lineObj = strategicLinesData.find(l => l.nombre === proj.linea || `${l.codigo} - ${l.nombre}` === proj.linea)
      setFormData(prev => ({
        ...prev,
        proyecto: projName,
        programa: proj.programa || prev.programa,
        gap: proj.gap || '',
        lineaEstrategica: lineObj ? `${lineObj.codigo} - ${lineObj.nombre}` : (proj.linea || ''),
        subproyecto: '',
        codigo: '',
        financiador: ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        proyecto: projName,
        subproyecto: '',
        gap: '',
        lineaEstrategica: '',
        codigo: '',
        financiador: ''
      }))
    }
  }

  const handleSubprojectChange = (subName: string) => {
    const sub = subprojectCodesData.find(s => `${s.codigo} - ${s.nombre}` === subName || s.nombre === subName)
    if (sub) {
      const proj = projectCodesData.find(p => p.nombre === sub.proyecto)
      const fullProjName = proj ? `${proj.codigo} - ${proj.nombre}` : sub.proyecto
      const lineObj = strategicLinesData.find(l => l.nombre === sub.linea || `${l.codigo} - ${l.nombre}` === sub.linea)
      setFormData(prev => ({
        ...prev,
        subproyecto: subName,
        programa: sub.programa || '',
        proyecto: fullProjName,
        gap: sub.gap || '',
        lineaEstrategica: lineObj ? `${lineObj.codigo} - ${lineObj.nombre}` : (sub.linea || ''),
        codigo: sub.codigo,
        financiador: sub.financiador
      }))
      setIndicators(getInitialIndicators(lineObj ? `${lineObj.codigo} - ${lineObj.nombre}` : sub.linea))
    } else {
      setFormData(prev => ({
        ...prev,
        subproyecto: subName,
        programa: '',
        proyecto: '',
        gap: '',
        lineaEstrategica: '',
        codigo: '',
        financiador: ''
      }))
    }
  }

  const isFormComplete = (data = formData, inds = indicators) => {
    // Step 1
    const s1 = data.programa && data.proyecto && data.subproyecto && data.gap && data.lineaEstrategica && data.codigo && data.financiador
    if (!s1) return false

    // Step 2
    const s2 = data.gerenteSubproyecto && data.responsableMeal && data.inicioMes && data.inicioAno && data.finMes && data.finAno && data.implementadores.length > 0 && data.ubicaciones.length > 0
    if (!s2) return false

    // Step 3
    const hasLine = inds.some(i => i.tipo.includes('Línea Estratégica'))
    const hasResult = inds.some(i => i.tipo.includes('Resultado'))
    const hasProduct = inds.some(i => i.tipo.includes('Producto'))
    const hasBeneficiary = inds.some(i => i.tipo === 'Beneficiario')
    if (!hasLine || !hasResult || !hasProduct || !hasBeneficiary) return false

    const startYearKey = `y${data.inicioAno}`
    const allFilled = inds.every(i => {
      const val = (i as any)[startYearKey]
      return val && val !== '0 000' && val.trim() !== ''
    })

    return allFilled
  }



  const handleSaveWizard = () => {
    if (editingItem) {
      setItems(items.map(p => p.id === editingItem.id ? {
        ...p,
        codigosubproyecto: formData.codigo,
        financiadorprincipal: formData.financiador || p.financiadorprincipal,
        subproyecto: formData.subproyecto || p.subproyecto,
        responsable: formData.responsableMeal || p.responsable,
        proyecto: formData.proyecto,
        fechainicio: `${formData.inicioMes} ${formData.inicioAno}`,
        fechafin: `${formData.finMes} ${formData.finAno}`
      } : p))
    } else {
      const newItem: PlanAnual = {
        id: Math.max(0, ...items.map(p => p.id)) + 1,
        codigosubproyecto: formData.codigo || '00000',
        financiadorprincipal: formData.financiador || 'N/A',
        subproyecto: formData.subproyecto || 'Nuevo Subproyecto',
        responsable: formData.responsableMeal || 'Usuario Actual',
        estado: 'Borrador',
        proyecto: formData.proyecto || 'Proyecto Defecto',
        programa: formData.programa,
        gap: formData.gap,
        linea: formData.lineaEstrategica,
        gerente: formData.gerenteSubproyecto,
        fechainicio: `${formData.inicioMes} ${formData.inicioAno}`,
        fechafin: `${formData.finMes} ${formData.finAno}`,
        implementadores: formData.implementadores,
        financiadoressecundarios: formData.financiadoresSecundarios,
        ubicaciones: formData.ubicaciones.map(u => ({ region: u.region, pais: u.pais, departamento: u.departamento, provincia: u.provincia }))
      }
      setItems([...items, newItem])
    }
    setViewMode('list')
    setShowConfirmSave(true)
  }

  const handleSaveStep3Indicator = () => {
    const selectedLabel = indicatorFormData.indicadorInstitucional
    const matched = institutionalIndicatorsData.find(x => `${x.codigo} - ${x.nombre}` === selectedLabel)
    const resolvedUnidad = matched?.unidad || 'Personas'
    const resolvedTipoValor = matched?.tipoValor || 'Numérico'
    if (editingStep3Indicator) {
      setIndicators(prev => prev.map(i => i.id === editingStep3Indicator.id ? {
        ...i,
        indicador: selectedLabel || i.indicador,
        tipo: indicatorFormData.tipo || i.tipo,
        unidad: resolvedUnidad,
        tipoValor: resolvedTipoValor
      } : i))
    } else {
      const newInd: any = {
        id: indicators.length > 0 ? Math.max(...indicators.map(i => i.id)) + 1 : 1,
        indicador: selectedLabel || 'Nuevo Indicador',
        tipo: indicatorFormData.tipo || 'Indicador de Producto',
        unidad: resolvedUnidad,
        tipoValor: resolvedTipoValor
      }
      selectedYears.forEach(year => newInd[`y${year}`] = '0 000')
      setIndicators([...indicators, newInd])
    }
    setIsIndicatorModalOpen(false)
    setEditingStep3Indicator(null)
  }

  const handleEditStep3Indicator = (row: IndicadoresAnuales) => {
    setEditingStep3Indicator(row)
    setIndicatorFormData({
      tipo: row.tipo,
      indicadorInstitucional: row.indicador
    })
    setIsIndicatorModalOpen(true)
  }

  const handleNewStep3Indicator = () => {
    setEditingStep3Indicator(null)
    setIndicatorFormData({
      tipo: '',
      indicadorInstitucional: ''
    })
    setIsIndicatorModalOpen(true)
  }

  // ------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------



  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      'Aprobado': { bg: '#e6f4ea', text: '#1e8e3e' },
      'Desaprobado': { bg: '#fce8e6', text: '#d93025' },
      'Pendiente': { bg: '#fef7e0', text: '#e37400' },
      'Borrador': { bg: '#f1f3f4', text: '#5f6368' }
    }
    const color = colors[status] || colors['Borrador']
    return (
      <span style={{
        backgroundColor: color.bg,
        color: color.text,
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        display: 'inline-block',
        textAlign: 'center',
        minWidth: '90px'
      }}>
        {status}
      </span>
    )
  }

  // Common options
  const programOptions = useMemo(() => programsData.map(p => p.nombre), [])
  const projectOptions = useMemo(() => {
    let filtered = projectCodesData
    if (formData.programa) {
      filtered = filtered.filter(p => p.programa === formData.programa)
    }
    return filtered.map(p => `${p.codigo} - ${p.nombre}`)
  }, [formData.programa])

  const subprojectOptions = useMemo(() => {
    let filtered = subprojectCodesData
    if (formData.proyecto) {
      filtered = filtered.filter(s => {
        const projMatch = projectCodesData.find(p => p.nombre === s.proyecto)
        const fullName = projMatch ? `${projMatch.codigo} - ${projMatch.nombre}` : s.proyecto
        return fullName === formData.proyecto || s.proyecto === formData.proyecto
      })
    } else if (formData.programa) {
      filtered = filtered.filter(s => s.programa === formData.programa)
    }
    return filtered.map(s => `${s.codigo} - ${s.nombre}`)
  }, [formData.programa, formData.proyecto])



  // List columns
  const listColumns: Column<PlanAnual>[] = [
    { key: 'programa', header: 'PROGRAMA' },
    { key: 'gap', header: 'GAP' },
    {
      key: 'linea',
      header: 'LÍNEA ESTRATÉGICA',
      render: (val: string) => {
        const line = strategicLinesData.find(l => l.nombre === val)
        return line ? `${line.codigo} - ${line.nombre}` : val
      }
    },
    {
      key: 'proyecto',
      header: 'PROYECTO',
      render: (val: string) => {
        const proj = projectCodesData.find(p => p.nombre === val)
        return proj ? `${proj.codigo} - ${proj.nombre}` : val
      }
    },
    { key: 'codigosubproyecto', header: 'CÓDIGO DE SUBPROYECTO' },
    { key: 'financiadorprincipal', header: 'FINANCIADOR PRINCIPAL' },
    { key: 'subproyecto', header: 'NOMBRE DE SUBPROYECTO' },
    {
      key: 'estado',
      header: 'ESTADO',
      sticky: 'right',
      width: '200px',
      render: (val: string) => getStatusBadge(val)
    },
    {
      key: 'actions',
      header: 'ACCIONES',
      sticky: 'right',
      width: '80px',
      render: (_: any, item: PlanAnual) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
          <button
            onClick={(e) => { e.stopPropagation(); handleViewList(item) }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a0a0a0',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            title="Ver detalle"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Eye size={18} />
          </button>
          <ActionMenu
            item={item}
            status={item.estado}
            canSend={isFormComplete(
              {
                ...formData,
                ...item,
                lineaEstrategica: item.linea,
                financiador: item.financiadorprincipal,
                gerenteSubproyecto: item.gerente,
                responsableMeal: item.responsable,
                inicioMes: parseDate(item.fechainicio).mes,
                inicioAno: parseDate(item.fechainicio).ano,
                finMes: parseDate(item.fechafin).mes,
                finAno: parseDate(item.fechafin).ano,
                codigo: item.codigosubproyecto,
                ubicaciones: item.ubicaciones.map((u, idx) => ({ ...u, id: idx, distrito: '' }))
              } as any,
              indicadoresAnualesData
            )}
            onEdit={handleEditList}
            onDelete={handleDeleteList}
            onSend={handleSendList}
          />
        </div>
      )
    }
  ]

  // Step 3 columns
  const step3Columns: Column<any>[] = useMemo(() => {
    const baseCols: Column<any>[] = []

    if (!isReadOnly) {
      baseCols.push({ key: 'checkbox', header: '' })
    }

    baseCols.push(
      {
        key: 'tipo',
        header: 'TIPO ↑↓',
        render: (val) => {
          let variant: any = 'line'
          if (val === 'Indicador de Resultado') variant = 'result'
          if (val === 'Indicador de Producto') variant = 'product'
          if (val === 'Beneficiario') variant = 'product'
          return <Badge variant={variant}>{val}</Badge>
        }
      },
      {
        key: 'indicador',
        header: 'INDICADOR ↑↓',
        render: (val: string, row: any) => {
          if (!isReadOnly && row.tipo !== 'Indicador de Línea Estratégica') {
            let opts = indicatorOptionsByTipo[row.tipo] || institutionalIndicatorsData.filter(i => i.tipo === row.tipo).map(i => `${i.codigo} - ${i.nombre}`)
            if (row.tipo === 'Beneficiario') {
              opts = ['BEN-T-Personas beneficiarias', 'BEN-H-Hombres beneficiarios', 'BEN-M-Mujeres beneficiarias']
            }
            return (
              <div style={{ minWidth: 360 }}>
                <FilterSelect
                  label=""
                  options={opts}
                  value={row.indicador === 'Seleccionar' ? '' : row.indicador}
                  placeholder="Seleccionar"
                  onChange={(v) => {
                    let unidad = 'Personas'
                    let tipoValor = 'Numérico'
                    if (row.tipo === 'Beneficiario') {
                      if (v === 'BEN-H-Hombres beneficiarios') unidad = 'Hombres'
                      else if (v === 'BEN-M-Mujeres beneficiarias') unidad = 'Mujeres'
                    } else {
                      const matched = institutionalIndicatorsData.find(x => `${x.codigo} - ${x.nombre}` === v)
                      unidad = (matched as any)?.unidad || unidadesData[0]?.nombre || 'Personas'
                      tipoValor = (matched as any)?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico'
                    }
                    setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, indicador: v, unidad, tipoValor } : i))
                  }}
                />
              </div>
            )
          }
          return val
        }
      },
      {
        key: 'unidad',
        header: 'UNIDAD ↑↓'
      },
      {
        key: 'tipoValor',
        header: 'TIPO VALOR ↑↓'
      }
    )

    const yearsToShow = [selectedYear]

    const yearCols = [...yearsToShow].sort().map(year => ({
      key: `y${year}`,
      header: `${year} ↑↓`,
      sticky: 'right' as const,
      width: '100px',
      render: (val: string, row: any) => (
        <input
          type="text"
          value={val || '0 000'}
          onChange={(e) => !isReadOnly && setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, [`y${year}`]: e.target.value } : i))}
          readOnly={isReadOnly}
          style={{ width: '80px', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', fontFamily: 'monospace', backgroundColor: isReadOnly ? '#f5f5f5' : 'white' }}
        />
      )
    }))

    const cols = [...baseCols, ...yearCols]

    if (!isReadOnly) {
      cols.push({
        key: 'actions',
        header: 'ACCIONES ↑↓',
        width: '80px',
        render: (_: any, row: any) => (
          (() => {
            const isDefault = !!row.isDefault
            const baseBtnStyle: React.CSSProperties = {
              background: 'none',
              border: 'none',
              cursor: isDefault ? 'not-allowed' : 'pointer',
              opacity: isDefault ? 0.4 : 1
            }
            return (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  disabled={isDefault}
                  onClick={() => !isDefault && handleEditStep3Indicator(row)}
                  style={baseBtnStyle}
                  title={isDefault ? 'Acción no disponible' : 'Editar'}
                >
                  <Pencil size={16} color="#a0a0a0" />
                </button>
                <button
                  disabled={isDefault}
                  onClick={() => !isDefault && setIndicators(prev => prev.filter(i => i.id !== row.id))}
                  style={baseBtnStyle}
                  title={isDefault ? 'Acción no disponible' : 'Quitar de la lista'}
                >
                  <CircleMinus size={16} color="#d93025" />
                </button>
              </div>
            )
          })()
        )
      })
    }

    return cols
  }, [selectedYear, isReadOnly])

  // Main Render Branching
  if (viewMode === 'list') {
    return (
      <div className={styles.root}>
        <header style={{ padding: '16px 16px 0' }}>
          <PageHeader
            title="Planificación Anual"
            subtitle="Gestión de Planificación Anual"
          />
        </header>

        <Toolbar
          onNew={handleNew}
          newLabel="Habilitar"
          onExport={() => { }}
          onRefresh={() => setProjectFilter('')}
          onFilterToggle={() => { }}
          onColumnToggle={() => { }}
        >
          <div style={{ flex: 1 }}>
            <FilterSelect
              label="Proyecto"
              options={projectOptions}
              value={projectFilter}
              onChange={setProjectFilter}
            />
          </div>
        </Toolbar>

        <div className={styles.tableContainer}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr>
                {listColumns.map((col, i) => {
                  const isStickyRight = col.sticky === 'right' || col.key === 'actions'
                  let rightOffset = 0
                  if (isStickyRight) {
                    const colIdx = listColumns.findIndex(c => c.key === col.key)
                    for (let k = colIdx + 1; k < listColumns.length; k++) {
                      const nc = listColumns[k]
                      if (nc.sticky === 'right' || nc.key === 'actions') {
                        rightOffset += parseInt(nc.width || '80')
                      }
                    }
                  }
                  return (
                    <th
                      key={i}
                      className={styles.th}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width,
                        textAlign: col.key === 'actions' ? 'right' : 'left',
                        paddingRight: col.key === 'actions' ? '32px' : '16px',
                        ...(isStickyRight ? { position: 'sticky', right: rightOffset, zIndex: 2, backgroundColor: '#fafafa' } : {})
                      }}
                    >
                      {col.header}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {programGroups.map(([progName, groupItems]) => {
                const isExpanded = expandedPrograms.has(progName)
                return (
                  <> 
                    {/* Program group separator row */}
                    <tr
                      key={`group-${progName}`}
                      onClick={() => toggleProgram(progName)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <td
                        colSpan={listColumns.length}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#382e2c',
                          backgroundColor: '#fff'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isExpanded
                            ? <ChevronDown size={18} color="#999" />
                            : <ChevronRight size={18} color="#999" />
                          }
                          {progName}
                        </div>
                      </td>
                    </tr>

                    {/* Data rows for this program */}
                    {isExpanded && groupItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        {listColumns.map((col, j) => {
                          const isStickyRight = col.sticky === 'right' || col.key === 'actions'
                          let rightOffset = 0
                          if (isStickyRight) {
                            const colIdx = listColumns.findIndex(c => c.key === col.key)
                            for (let k = colIdx + 1; k < listColumns.length; k++) {
                              const nc = listColumns[k]
                              if (nc.sticky === 'right' || nc.key === 'actions') {
                                rightOffset += parseInt(nc.width || '80')
                              }
                            }
                          }
                          return (
                            <td
                              key={j}
                              className={styles.td}
                              style={{
                                width: col.width,
                                minWidth: col.width,
                                maxWidth: col.width,
                                textAlign: col.key === 'actions' ? 'right' : 'left',
                                paddingLeft: j === 0 ? '32px' : '16px',
                                whiteSpace: 'nowrap',
                                ...(isStickyRight ? { position: 'sticky', right: rightOffset, zIndex: 1, backgroundColor: '#fff' } : {})
                              }}
                            >
                              {col.render
                                ? col.render(item[col.key as keyof PlanAnual] as any, item)
                                : (item[col.key as keyof PlanAnual] as any)
                              }
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>

        <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />

        <AlertModal
          isOpen={showConfirmSave}
          onClose={() => setShowConfirmSave(false)}
          variant="success"
          title="Cambios guardados con éxito"
          description="La información ha sido actualizada en el sistema"
          primaryAction={{ label: 'Continuar', onClick: () => setShowConfirmSave(false) }}
        />

        <AlertModal
          isOpen={showDeleteAlert}
          onClose={() => setShowDeleteAlert(false)}
          variant="danger"
          title="¿Estás seguro de eliminar?"
          description="Esta acción es irreversible"
          primaryAction={{ label: 'Eliminar', onClick: confirmDeleteList }}
          secondaryAction={{ label: 'Cancelar', onClick: () => setShowDeleteAlert(false) }}
        />
        <AlertModal
          isOpen={showSendAlert}
          onClose={() => setShowSendAlert(false)}
          variant="warning"
          title="¿Estás seguro de enviar?"
          description="Esto hará que el subproyecto pase a etapa de aprobación y el estado cambie a pendiente."
          primaryAction={{ label: 'Sí, enviar', onClick: confirmSendList }}
          secondaryAction={{ label: 'No, cancelar', onClick: () => setShowSendAlert(false) }}
        />
        <AlertModal
          isOpen={showIncompleteAlert}
          onClose={() => setShowIncompleteAlert(false)}
          variant="warning"
          title="Información incompleta"
          description="Aún falta información por completar. Puedes guardar los cambios como borrador para continuar después, o seguir llenando los datos ahora."
          primaryAction={{ label: 'Guardar como borrador', onClick: () => { setShowIncompleteAlert(false); handleSaveWizard(); } }}
          secondaryAction={{ label: 'Seguir llenando', onClick: () => setShowIncompleteAlert(false) }}
        />
      </div>
    )
  }

  // Create Mode Render (Wizard)
  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Planificación Anual > Habilitar Subproyecto"
          subtitle="Ingresa todos los detalles"
        />
      </header>

      {/* Wrapper box */}
      <div style={{ margin: '24px 32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 16px' }}>
              <span style={{ width: '3px', height: '20px', backgroundColor: '#382e2c', borderRadius: '2px' }} />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#382e2c' }}>1. Selección de subproyecto</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Información general</div>
                <FilterSelect
                  label="Programa"
                  options={programOptions}
                  value={formData.programa}
                  onChange={handleProgramaChange}
                  readOnly={isReadOnly}
                />
                <FilterSelect
                  label="Proyecto"
                  options={projectOptions}
                  value={formData.proyecto}
                  onChange={handleProyectoChange}
                  readOnly={isReadOnly}
                />
                <FilterSelect
                  label="Subproyecto"
                  options={subprojectOptions}
                  value={formData.subproyecto}
                  onChange={handleSubprojectChange}
                  readOnly={isReadOnly}
                />
                <FilterSelect
                  label="Año"
                  options={yearOptions}
                  value={selectedYear}
                  onChange={(v) => setSelectedYear(v as string)}
                  readOnly={isReadOnly}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Relación jerárquica</div>
                <Input
                  label="GAP"
                  value={formData.gap}
                  onChange={() => { }}
                  disabled
                />
                <Input
                  label="Línea Estratégica"
                  value={formData.lineaEstrategica}
                  onChange={() => { }}
                  disabled
                />
                <Input
                  label="Código"
                  value={formData.codigo}
                  onChange={(v) => setFormData(p => ({ ...p, codigo: v }))}
                  disabled
                />
                <Input
                  label="Financiador Principal"
                  value={formData.financiador}
                  onChange={(v) => setFormData(p => ({ ...p, financiador: v }))}
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 16px' }}>
              <span style={{ width: '3px', height: '20px', backgroundColor: '#382e2c', borderRadius: '2px' }} />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#382e2c' }}>2. Selección de indicadores y metas</span>
            </div>
            {!isReadOnly && (
              <Toolbar
                onNew={handleNewStep3Indicator}
                onRefresh={() => { }}
                onFilterToggle={() => { }}
                onColumnToggle={() => { }}
              >
              </Toolbar>
            )}

            <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflowX: 'auto', overflowY: 'hidden' }}>
              <Table
                columns={step3Columns}
                data={indicators}
                onEdit={() => { }}
                onDelete={(item) => setIndicators(indicators.filter(i => i.id !== item.id))}
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '16px', backgroundColor: '#fdfdfd', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
          <Button variant="secondary" onClick={() => setViewMode('list')} style={{ minWidth: '120px' }}>
            {isReadOnly ? 'Regresar' : 'Cancelar'}
          </Button>
          {!isReadOnly && (
            <Button
              variant="primary"
              onClick={() => {
                setShowIncompleteAlert(true)
              }}
              style={{ minWidth: '160px' }}
            >
              Guardar
            </Button>
          )}
        </div>
      </div>

      <AlertModal
        isOpen={showIncompleteAlert}
        onClose={() => setShowIncompleteAlert(false)}
        variant="warning"
        title="Información incompleta"
        description="Aún falta información por completar. Puedes guardar los cambios como borrador para continuar después, o seguir llenando los datos ahora."
        primaryAction={{ label: 'Guardar como borrador', onClick: () => { setShowIncompleteAlert(false); handleSaveWizard(); } }}
        secondaryAction={{ label: 'Seguir llenando', onClick: () => setShowIncompleteAlert(false) }}
      />

      <AlertModal
        isOpen={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        variant="success"
        title="Cambios guardados con éxito"
        description="La información ha sido actualizada en el sistema"
        primaryAction={{ label: 'Continuar', onClick: () => setShowConfirmSave(false) }}
      />

      {/* Indicator Add Modal */}
      <Modal
        isOpen={isIndicatorModalOpen}
        onClose={() => {
          setIsIndicatorModalOpen(false)
          setEditingStep3Indicator(null)
        }}
        title={editingStep3Indicator ? "Editar Indicador" : "Habilitar subproyecto"}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveStep3Indicator}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FilterSelect
            label="Tipo de Indicador Institucional"
            options={indicatorTipos}
            value={indicatorFormData.tipo}
            onChange={(val) => {
              setIndicatorFormData(p => ({ ...p, tipo: val, indicadorInstitucional: '' }))
            }}
          />
          <FilterSelect
            label="Indicador Institucional"
            options={indicatorNameOptions}
            value={indicatorFormData.indicadorInstitucional}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, indicadorInstitucional: val }))}
          />
        </div>
      </Modal>
    </div>
  )
}
