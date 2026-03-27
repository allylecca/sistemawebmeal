import { useState, useMemo, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Modal } from '../../../components/Modal/Modal'
import { Send, ChartBarBig, FileText, Eye, Pencil, Trash2, EllipsisVertical } from 'lucide-react'
import { Input } from '../../../components/Input/Input'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { Button } from '../../../components/Button/Button'
import { Badge } from '../../../components/Badge/Badge'
import { planesAnualesData, programsData, subprojectCodesData, projectCodesData, strategicLinesData, gerentesData, responsablesMealData, implementadoresData, financiadoresData, locationsData, institutionalIndicatorsData, unidadesData, tiposDeValorData, indicadoresAnualesData } from '../../../data/mockData'
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
              <MenuItem icon={FileText} label="Documentos" />
              <div style={sepStyle} />
              <MenuItem icon={Pencil} label="Editar" onClick={() => onEdit(item)} />
              <MenuItem icon={Trash2} label="Eliminar" danger onClick={() => onDelete(item)} />
            </>
          )}

          {status === 'Aprobado' && (
            <>
              <MenuItem icon={ChartBarBig} label="Ver dashboard" />
              <MenuItem icon={FileText} label="Documentos" />
            </>
          )}

          {status === 'Pendiente' && (
            <>
              <MenuItem icon={FileText} label="Documentos" />
            </>
          )}

          {status === 'Desaprobado' && (
            <MenuItem icon={FileText} label="Documentos" />
          )}
        </div>,
        document.body
      )}
    </>
  )
}

export function AnnualPlanningView() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [activeStep, setActiveStep] = useState(1)

  // --- List Mode States ---
  const [projectFilter, setProjectFilter] = useState('')
  const [items, setItems] = useState<PlanAnual[]>(planesAnualesData)
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
    indicadorInstitucional: '',
    unidad: '',
    tipoValor: ''
  })
  const [editingStep3Indicator, setEditingStep3Indicator] = useState<IndicadoresAnuales | null>(null)

  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showSendAlert, setShowSendAlert] = useState(false)
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false)
  const [itemToSend, setItemToSend] = useState<PlanAnual | null>(null)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // Step 3 Year logic
  const [selectedYears, setSelectedYears] = useState<string[]>([])

  useEffect(() => {
    if (formData.inicioAno) {
      setSelectedYears([formData.inicioAno])
    }
  }, [formData.inicioAno])

  const availableYears = useMemo(() => {
    const start = parseInt(formData.inicioAno) || 2026
    const end = parseInt(formData.finAno) || 2029
    const range = []
    for (let i = start; i <= end; i++) {
      range.push(i.toString())
    }
    return range
  }, [formData.inicioAno, formData.finAno])

  const indicatorTipos = useMemo(() => Array.from(new Set(institutionalIndicatorsData.map(i => i.tipo))), [])
  
  const indicatorNameOptions = useMemo(() => {
    if (!indicatorFormData.tipo) return []
    return institutionalIndicatorsData.filter(i => i.tipo === indicatorFormData.tipo).map(i => `${i.codigo} - ${i.nombre}`)
  }, [indicatorFormData.tipo])

  const unidadOptions = useMemo(() => unidadesData.map(u => u.nombre), [])
  const tipoValorOptions = useMemo(() => tiposDeValorData.map(t => t.nombre), [])

  // ------------------------------------------
  // LIST MODE HELPERS
  // ------------------------------------------

  const filteredData = useMemo(() => {
    if (!projectFilter) return items
    return items.filter(item => item.proyecto.includes(projectFilter) || item.proyecto === projectFilter)
  }, [projectFilter, items])

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
    setActiveStep(1)
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
    setIndicators(indicadoresAnualesData)
    setViewMode('create')
    setActiveStep(1)
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
    setIndicators(indicadoresAnualesData)
    setViewMode('create')
    setActiveStep(1)
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
    if (!hasLine || !hasResult || !hasProduct) return false

    const startYearKey = `y${data.inicioAno}`
    const allFilled = inds.every(i => {
      const val = (i as any)[startYearKey]
      return val && val !== '0 000' && val.trim() !== ''
    })

    return allFilled
  }

  const handleUbiChange = (id: number, field: string, value: string) => {
    setFormData(p => ({
      ...p,
      ubicaciones: p.ubicaciones.map(u => {
        if (u.id === id) {
          const newUbi = { ...u, [field]: value }
          // reset children
          if (field === 'region') { newUbi.pais = ''; newUbi.departamento = ''; newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'pais') { newUbi.departamento = ''; newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'departamento') { newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'provincia') { newUbi.distrito = ''; }
          return newUbi
        }
        return u
      })
    }))
  }

  const handleDeleteUbi = (id: number) => {
    setFormData(p => ({
      ...p,
      ubicaciones: p.ubicaciones.filter(u => u.id !== id)
    }))
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
    if (editingStep3Indicator) {
      setIndicators(prev => prev.map(i => i.id === editingStep3Indicator.id ? {
        ...i,
        indicador: indicatorFormData.indicadorInstitucional || i.indicador,
        tipo: indicatorFormData.tipo || i.tipo,
        unidad: indicatorFormData.unidad || i.unidad,
        tipoValor: indicatorFormData.tipoValor || i.tipoValor,
      } : i))
    } else {
      const newInd: any = {
        id: indicators.length > 0 ? Math.max(...indicators.map(i => i.id)) + 1 : 1,
        indicador: indicatorFormData.indicadorInstitucional || 'Nuevo Indicador',
        tipo: indicatorFormData.tipo || 'Línea Estratégica',
        unidad: indicatorFormData.unidad || 'Personas',
        tipoValor: indicatorFormData.tipoValor || 'Planificado',
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
      indicadorInstitucional: row.indicador,
      unidad: row.unidad,
      tipoValor: row.tipoValor
    })
    setIsIndicatorModalOpen(true)
  }

  const handleNewStep3Indicator = () => {
    setEditingStep3Indicator(null)
    setIndicatorFormData({
      tipo: '',
      indicadorInstitucional: '',
      unidad: '',
      tipoValor: ''
    })
    setIsIndicatorModalOpen(true)
  }

  // ------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------

  const STEPS = [
    { id: 1, label: 'Selección de Subproyecto' },
    { id: 2, label: 'Datos del Subproyecto' },
    { id: 3, label: 'Metas de Indicadores' }
  ]

  const renderStepper = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0' }}>
      {STEPS.map((step, index) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveStep(step.id)}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: activeStep >= step.id ? '#db5e4e' : '#f0f0f0',
            color: activeStep >= step.id ? 'white' : '#999',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 'bold'
          }}>
            {step.id}
          </div>
          <span style={{
            marginLeft: '12px',
            color: activeStep >= step.id ? '#333' : '#999',
            fontSize: '12px',
            fontWeight: activeStep >= step.id ? 600 : 400
          }}>
            {step.label}
          </span>
          {index < STEPS.length - 1 && (
            <div style={{ width: '120px', height: '1px', backgroundColor: '#e0e0e0', margin: '0 24px' }} />
          )}
        </div>
      ))}
    </div>
  )

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
  
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const anos = ['2025', '2026', '2027', '2028', '2029', '2030']
  
  const gerenteOptions = useMemo(() => gerentesData.map(g => g.nombre), [])
  const responsableMealOptions = useMemo(() => responsablesMealData.map(r => r.nombre), [])
  const implementadorOptions = useMemo(() => implementadoresData.map(i => i.nombre), [])
  const financiadorSecundarioOptions = useMemo(() => {
    return financiadoresData
      .filter(f => f.nombre !== formData.financiador)
      .map(f => f.nombre)
  }, [formData.financiador])

  const getRegionesOptions = () => locationsData.map(l => l.label)
  
  const getPaisesOptions = (regionLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    return region?.children?.map(p => p.label) || []
  }

  const getDptosOptions = (regionLabel: string, paisLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    return pais?.children?.map(d => d.label) || []
  }

  const getProvinciasOptions = (regionLabel: string, paisLabel: string, dptoLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    const dpto = pais?.children?.find(d => d.label === dptoLabel)
    return dpto?.children?.map(pr => pr.label) || []
  }

  const getDistritosOptions = (regionLabel: string, paisLabel: string, dptoLabel: string, provLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    const dpto = pais?.children?.find(d => d.label === dptoLabel)
    const prov = dpto?.children?.find(pr => pr.label === provLabel)
    return prov?.children?.map(di => di.label) || []
  }


  // List columns
  const listColumns: Column<PlanAnual>[] = [
    { key: 'checkbox', header: '' },
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
    { key: 'gerente', header: 'GERENTE DE SUBPROYECTO' },
    { key: 'responsable', header: 'RESPONSABLE MEAL' },
    { key: 'fechainicio', header: 'FECHA INICIO' },
    { key: 'fechafin', header: 'FECHA FIN' },
    { 
      key: 'implementadores', 
      header: 'IMPLEMENTADORES',
      render: (val: string[]) => val.join(', ')
    },
    { 
      key: 'financiadoressecundarios', 
      header: 'FINANCIADORES SECUNDARIOS',
      render: (val: string[]) => val.join(', ')
    },
    { 
      key: 'ubicaciones', 
      header: 'UBICACIONES',
      render: (_, item) => {
        const groups = item.ubicaciones.map(u => [u.region, u.pais, u.departamento, u.provincia].filter(Boolean).join(', '))
        const uniqueGroups = Array.from(new Set(groups))
        return uniqueGroups.length > 2 ? uniqueGroups.join(' | ') : uniqueGroups.join(', ')
      }
    },
    { 
      key: 'estado', 
      header: 'ESTADO', 
      sticky: 'right', 
      width: '120px',
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
          return <Badge variant={variant}>{val}</Badge>
        }
      },
      {
        key: 'indicador',
        header: 'INDICADOR ↑↓'
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

    const yearsToShow = isReadOnly ? availableYears : selectedYears

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
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => handleEditStep3Indicator(row)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Pencil size={16} color="#a0a0a0" />
            </button>
            <button onClick={() => setIndicators(prev => prev.filter(i => i.id !== row.id))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Trash2 size={16} color="#d93025" />
            </button>
          </div>
        )
      })
    }

    return cols
  }, [selectedYears, availableYears, isReadOnly])

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
          <Table
            columns={listColumns}
            data={filteredData}
            onEdit={handleEditList}
            onDelete={handleDeleteList}
          />
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

        {renderStepper()}

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px' }}>
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
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
          )}

          {activeStep === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', alignItems: 'start' }}>

              {/* LADO IZQUIERDO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <FilterSelect
                  label="Gerente de Subproyecto"
                  options={gerenteOptions}
                  value={formData.gerenteSubproyecto}
                  onChange={(v) => setFormData(p => ({ ...p, gerenteSubproyecto: v as string }))}
                  readOnly={isReadOnly}
                />
                <FilterSelect
                  label="Responsable MEAL"
                  options={responsableMealOptions}
                  value={formData.responsableMeal}
                  onChange={(v) => setFormData(p => ({ ...p, responsableMeal: v as string }))}
                  readOnly={isReadOnly}
                />

                <div>
                  <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha inicio</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Mes" options={meses} value={formData.inicioMes} onChange={(v) => setFormData(p => ({ ...p, inicioMes: v as string }))} readOnly={isReadOnly} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Año" options={anos} value={formData.inicioAno} onChange={(v) => setFormData(p => ({ ...p, inicioAno: v as string }))} readOnly={isReadOnly} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha fin</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Mes" options={meses} value={formData.finMes} onChange={(v) => setFormData(p => ({ ...p, finMes: v as string }))} readOnly={isReadOnly} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Año" options={anos} value={formData.finAno} onChange={(v) => setFormData(p => ({ ...p, finAno: v as string }))} readOnly={isReadOnly} />
                    </div>
                  </div>
                </div>

                {/* Toggle Subactividades */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Involucrar subactividades</span>
                  <div
                    onClick={() => !isReadOnly && setFormData(p => ({ ...p, involucrarSubactividades: !p.involucrarSubactividades }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px',
                      backgroundColor: formData.involucrarSubactividades ? '#db5e4e' : '#dcdcdc',
                      position: 'relative', cursor: isReadOnly ? 'default' : 'pointer', transition: 'all 0.3s'
                    }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                      position: 'absolute', top: '2px', left: formData.involucrarSubactividades ? '22px' : '2px',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* LADO DERECHO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <FilterSelect
                  label="Implementadores"
                  options={implementadorOptions}
                  value={formData.implementadores}
                  onChange={(v) => setFormData(p => ({ ...p, implementadores: v as string[] }))}
                  isMulti
                  readOnly={isReadOnly}
                />

                <FilterSelect
                  label="Financiadores Secundarios"
                  options={financiadorSecundarioOptions}
                  value={formData.financiadoresSecundarios}
                  onChange={(v) => setFormData(p => ({ ...p, financiadoresSecundarios: v as string[] }))}
                  isMulti
                  readOnly={isReadOnly}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '0px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>Ubicaciones</span>
                  <button onClick={() => setFormData(p => ({
                    ...p,
                    ubicaciones: [...p.ubicaciones, { id: Date.now(), region: '', pais: '', departamento: '', provincia: '', distrito: '' }]
                  }))} style={{ padding: '0', fontSize: '20px', color: '#333', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.ubicaciones.length === 0 && <p style={{ fontSize: '12px', color: '#999' }}>Ninguna ubicación agregada</p>}
                  {formData.ubicaciones.map((ubi) => (
                    <div key={ubi.id} style={{ display: 'flex', gap: '12px', border: '1px solid #eee', padding: '16px', borderRadius: '8px', backgroundColor: '#fafafa', position: 'relative' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <FilterSelect label="Región" options={getRegionesOptions()} value={ubi.region} onChange={v => handleUbiChange(ubi.id, 'region', v as string)} readOnly={isReadOnly} />
                        {ubi.region && getPaisesOptions(ubi.region).length > 0 && <FilterSelect label="País" options={getPaisesOptions(ubi.region)} value={ubi.pais} onChange={v => handleUbiChange(ubi.id, 'pais', v as string)} readOnly={isReadOnly} />}
                        {ubi.pais && getDptosOptions(ubi.region, ubi.pais).length > 0 && <FilterSelect label="Departamento" options={getDptosOptions(ubi.region, ubi.pais)} value={ubi.departamento} onChange={v => handleUbiChange(ubi.id, 'departamento', v as string)} readOnly={isReadOnly} />}
                        {ubi.departamento && getProvinciasOptions(ubi.region, ubi.pais, ubi.departamento).length > 0 && <FilterSelect label="Provincia" options={getProvinciasOptions(ubi.region, ubi.pais, ubi.departamento)} value={ubi.provincia} onChange={v => handleUbiChange(ubi.id, 'provincia', v as string)} readOnly={isReadOnly} />}
                        {ubi.provincia && getDistritosOptions(ubi.region, ubi.pais, ubi.departamento, ubi.provincia).length > 0 && <FilterSelect label="Distrito" options={getDistritosOptions(ubi.region, ubi.pais, ubi.departamento, ubi.provincia)} value={ubi.distrito} onChange={v => handleUbiChange(ubi.id, 'distrito', v as string)} readOnly={isReadOnly} />}
                      </div>
                      {!isReadOnly && (
                        <button onClick={() => handleDeleteUbi(ubi.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', height: 'fit-content', marginTop: '8px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              {!isReadOnly && (
                <Toolbar
                  onNew={handleNewStep3Indicator}
                  onExport={() => { }}
                  onRefresh={() => { }}
                  onFilterToggle={() => { }}
                  onColumnToggle={() => { }}
                >
                  <div style={{ flex: 1 }}>
                    <FilterSelect
                      label="Año"
                      options={availableYears}
                      value={selectedYears}
                      onChange={(v) => setSelectedYears(v as string[])}
                      isMulti
                    />
                  </div>
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
          )}
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
          <FilterSelect
            label="Unidad"
            options={unidadOptions}
            value={indicatorFormData.unidad}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, unidad: val }))}
          />
          <FilterSelect
            label="Tipo de Valor"
            options={tipoValorOptions}
            value={indicatorFormData.tipoValor}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, tipoValor: val }))}
          />
        </div>
      </Modal>
    </div>
  )
}
