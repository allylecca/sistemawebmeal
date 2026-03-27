import { useState, useMemo } from 'react'
import {
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Badge } from '../../../components/Badge/Badge'
import { Checkbox } from '../../../components/Checkbox/Checkbox'
import { Modal } from '../../../components/Modal/Modal'
import { SideSheet } from '../../../components/SideSheet/SideSheet'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { Input } from '../../../components/Input/Input'
import {
  planesAnualesData,
  objGeneralData,
  objEspecificoData,
  resultadosData,
  actividadData,
  subactividadData,
  unidadesData,
  tiposDeValorData
} from '../../../data/mockData'
import type { LogicalFrameTreeItem } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import styles from './LogicalFrameView.module.css'

export function LogicalFrameView() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [headerChecked, setHeaderChecked] = useState(false)
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')
  const [isFiltered, setIsFiltered] = useState(false)

  // Local state for hierarchy data to allow persistence
  const [localObjGeneral, setLocalObjGeneral] = useState(objGeneralData)
  const [localObjEspecifico, setLocalObjEspecifico] = useState(objEspecificoData)
  const [localResultados, setLocalResultados] = useState(resultadosData)
  const [localActividades, setLocalActividades] = useState(actividadData)
  const [localSubactividades, setLocalSubactividades] = useState(subactividadData)

  // Modal state for Obj. General
  const [isOGModalOpen, setIsOGModalOpen] = useState(false)
  const [editingOG, setEditingOG] = useState<{ id: number; codigo: string; nombre: string } | null>(null)
  const [ogForm, setOgForm] = useState({ codigo: '', nombre: '' })
  const [showConfirmSave, setShowConfirmSave] = useState(false)

  // Modal state for Objetivo Específico
  const [isOEModalOpen, setIsOEModalOpen] = useState(false)
  const [editingOE, setEditingOE] = useState<{ id: number; codigo: string; nombre: string; objetivoGeneral: string } | null>(null)
  const [oeForm, setOeForm] = useState({ objetivoGeneral: '', codigo: '', nombre: '' })

  // Modal state for Resultado
  const [isRModalOpen, setIsRModalOpen] = useState(false)
  const [editingR, setEditingR] = useState<{ id: number; codigo: string; nombre: string; objetivoGeneral: string; objetivoEspecifico: string } | null>(null)
  const [rForm, setRForm] = useState({ objetivoGeneral: '', objetivoEspecifico: '', codigo: '', nombre: '' })

  // Modal state for Actividad
  const [isActModalOpen, setIsActModalOpen] = useState(false)
  const [editingAct, setEditingAct] = useState<{ id: number; tipo: string; codigoActividad: string; codigoActividadPresupuesto: string; nombre: string; unidad: string; tipoValor: string; objetivoGeneral: string; objetivoEspecifico: string; resultado: string } | null>(null)
  const [actForm, setActForm] = useState({
    tipo: '',
    codigoActividad: '',
    codigoActividadPresupuesto: '',
    nombre: '',
    unidad: '',
    tipoValor: '',
    objetivoGeneral: '',
    objetivoEspecifico: '',
    resultado: ''
  })

  // Modal state for Subactividad
  const [isSubactModalOpen, setIsSubactModalOpen] = useState(false)
  const [editingSubact, setEditingSubact] = useState<{ id: number; tipo: string; codigoSubactividad: string; codigoSubactividadPresupuesto: string; nombre: string; unidad: string; tipoValor: string; objetivoGeneral: string; objetivoEspecifico: string; resultado: string; actividad: string } | null>(null)
  const [subactForm, setSubactForm] = useState({
    tipo: '',
    codigoSubactividad: '',
    codigoSubactividadPresupuesto: '',
    nombre: '',
    unidad: '',
    tipoValor: '',
    objetivoGeneral: '',
    objetivoEspecifico: '',
    resultado: '',
    actividad: ''
  })

  // State for deletion
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<LogicalFrameTreeItem | null>(null)

  // SideSheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedSheetItem, setSelectedSheetItem] = useState<LogicalFrameTreeItem | null>(null)

  // Build unique options from planesAnualesData (no dependency on other filters for the full list)
  const programOptions = useMemo(() =>
    [...new Set(planesAnualesData.map(p => p.programa))].sort(),
    []
  )

  const projectOptions = useMemo(() =>
    [...new Set(planesAnualesData.map(p => p.proyecto))].sort(),
    []
  )

  const subprojectOptions = useMemo(() =>
    [...new Set(planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`))].sort(),
    []
  )

  // Auto-fill related fields based on selection
  const handleProgramChange = (val: string) => {
    setProgramFilter(val)
    // If current proyecto doesn't belong to new programa, clear it
    if (val && projectFilter) {
      const match = planesAnualesData.find(p => p.programa === val && p.proyecto === projectFilter)
      if (!match) {
        setProjectFilter('')
        setSubprojectFilter('')
      }
    }
    if (val && subprojectFilter) {
      const subLabel = subprojectFilter
      const match = planesAnualesData.find(p => p.programa === val && `${p.codigosubproyecto} - ${p.subproyecto}` === subLabel)
      if (!match) setSubprojectFilter('')
    }
    setIsFiltered(false)
  }

  const handleProjectChange = (val: string) => {
    setProjectFilter(val)
    if (val) {
      // Auto-fill programa from the selected proyecto
      const plan = planesAnualesData.find(p => p.proyecto === val)
      if (plan) setProgramFilter(plan.programa)
      // If current subproyecto doesn't match, clear it
      if (subprojectFilter) {
        const match = planesAnualesData.find(p => p.proyecto === val && `${p.codigosubproyecto} - ${p.subproyecto}` === subprojectFilter)
        if (!match) setSubprojectFilter('')
      }
    }
    setIsFiltered(false)
  }

  const handleSubprojectChange = (val: string) => {
    setSubprojectFilter(val)
    if (val) {
      // Auto-fill programa and proyecto from the selected subproyecto
      const plan = planesAnualesData.find(p => `${p.codigosubproyecto} - ${p.subproyecto}` === val)
      if (plan) {
        setProgramFilter(plan.programa)
        setProjectFilter(plan.proyecto)
      }
    }
    setIsFiltered(false)
  }

  const toggleNode = (id: string) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    )
  }

  const handleFilter = () => {
    if (programFilter || projectFilter || subprojectFilter) {
      setIsFiltered(true)
      setExpandedNodes(['group-og', 'group-oe', 'group-r', 'group-act', 'group-subact'])
    }
  }

  // Subproyecto label from filter
  const subprojectLabel = subprojectFilter || ''

  const isOGSaveDisabled = useMemo(() => {
    const filled = ogForm.codigo.trim() !== '' && ogForm.nombre.trim() !== ''
    if (!filled) return true
    if (editingOG) {
      return ogForm.codigo === editingOG.codigo && ogForm.nombre === editingOG.nombre
    }
    return false
  }, [ogForm, editingOG])

  const handleNewOG = () => {
    setEditingOG(null)
    setOgForm({ codigo: '', nombre: '' })
    setIsOGModalOpen(true)
  }

  // Delete logic
  const handleDelete = (item: LogicalFrameTreeItem) => {
    setItemToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    const { id, tipo } = itemToDelete
    const parts = id.split('-')
    const numericId = parseInt(parts[parts.length - 1])

    if (isNaN(numericId)) {
       // It's a group node, we don't delete groups in this view usually, 
       // but if we were to, we'd handle it here.
       setShowDeleteAlert(false)
       return
    }

    if (tipo === 'Obj. General') {
      setLocalObjGeneral(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'Obj. Específico') {
      setLocalObjEspecifico(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'Resultado') {
      setLocalResultados(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'Actividad') {
      setLocalActividades(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'Subactividad') {
      setLocalSubactividades(prev => prev.filter(i => i.id !== numericId))
    }

    setShowDeleteAlert(false)
    setItemToDelete(null)
  }

  const handleEditOG = (item: LogicalFrameTreeItem) => {
    setEditingOG({ id: Number(item.id.replace('og-', '')), codigo: item.codigo || '', nombre: item.nombre })
    setOgForm({ codigo: item.codigo || '', nombre: item.nombre })
    setIsOGModalOpen(true)
  }

  const handleSaveOG = () => {
    if (editingOG) {
      setLocalObjGeneral(prev => prev.map(og => og.id === editingOG.id ? { ...og, ...ogForm } : og))
    } else {
      const newId = Math.max(0, ...localObjGeneral.map(og => og.id)) + 1
      setLocalObjGeneral(prev => [...prev, { id: newId, ...ogForm }])
    }
    setIsOGModalOpen(false)
    setShowConfirmSave(true)
  }

  // OE Handlers
  const handleNewOE = (parent?: LogicalFrameTreeItem) => {
    setEditingOE(null)
    let og = ''
    if (parent && parent.id.startsWith('group-oe-og-')) {
        const ogId = Number(parent.id.replace('group-oe-og-', ''))
        const parentOG = localObjGeneral.find(x => x.id === ogId)
        if (parentOG) {
            og = `${parentOG.codigo} - ${parentOG.nombre}`
        }
    }
    setOeForm({ objetivoGeneral: og, codigo: '', nombre: '' })
    setIsOEModalOpen(true)
  }
  const handleEditOE = (item: LogicalFrameTreeItem) => {
    const original = localObjEspecifico.find(oe => oe.id === Number(item.id.replace('oe-', '')))
    setEditingOE({ id: original?.id || 0, codigo: item.codigo || '', nombre: item.nombre, objetivoGeneral: original?.objetivoGeneral || '' })
    setOeForm({ objetivoGeneral: original?.objetivoGeneral || '', codigo: item.codigo || '', nombre: item.nombre })
    setIsOEModalOpen(true)
  }
  const handleSaveOE = () => {
    if (editingOE) {
      setLocalObjEspecifico(prev => prev.map(oe => oe.id === editingOE.id ? { ...oe, ...oeForm } : oe))
    } else {
      const newId = Math.max(0, ...localObjEspecifico.map(oe => oe.id)) + 1
      setLocalObjEspecifico(prev => [...prev, { id: newId, ...oeForm }])
    }
    setIsOEModalOpen(false)
    setShowConfirmSave(true)
  }

  // Resultado Handlers
  const handleNewR = (parent?: LogicalFrameTreeItem) => {
    setEditingR(null)
    let og = ''
    let oe = ''
    if (parent && parent.id.startsWith('group-r-oe-')) {
        const oeId = Number(parent.id.replace('group-r-oe-', ''))
        const parentOE = localObjEspecifico.find(x => x.id === oeId)
        if (parentOE) {
            oe = `${parentOE.codigo} - ${parentOE.nombre}`
            og = parentOE.objetivoGeneral
        }
    }
    setRForm({ objetivoGeneral: og, objetivoEspecifico: oe, codigo: '', nombre: '' })
    setIsRModalOpen(true)
  }
  const handleEditR = (item: LogicalFrameTreeItem) => {
    const original = localResultados.find(r => r.id === Number(item.id.replace('r-', '')))
    setEditingR({ 
      id: original?.id || 0, 
      codigo: item.codigo || '', 
      nombre: item.nombre, 
      objetivoGeneral: original?.objetivoGeneral || '', 
      objetivoEspecifico: original?.objetivoEspecifico || '' 
    })
    setRForm({ 
      objetivoGeneral: original?.objetivoGeneral || '', 
      objetivoEspecifico: original?.objetivoEspecifico || '', 
      codigo: item.codigo || '', 
      nombre: item.nombre 
    })
    setIsRModalOpen(true)
  }
  const handleSaveR = () => {
    if (editingR) {
        setLocalResultados(prev => prev.map(r => r.id === editingR.id ? { ...r, ...rForm } : r))
    } else {
        const newId = Math.max(0, ...localResultados.map(r => r.id)) + 1
        setLocalResultados(prev => [...prev, { id: newId, ...rForm }])
    }
    setIsRModalOpen(false)
    setShowConfirmSave(true)
  }

  // Actividad Handlers
  const handleNewAct = (parent?: LogicalFrameTreeItem) => {
    setEditingAct(null)
    let og = ''
    let oe = ''
    let r = ''
    if (parent && parent.id.startsWith('group-act-r-')) {
        const rId = Number(parent.id.replace('group-act-r-', ''))
        const parentR = localResultados.find(x => x.id === rId)
        if (parentR) {
            r = `${parentR.codigo} - ${parentR.nombre}`
            oe = parentR.objetivoEspecifico
            og = parentR.objetivoGeneral
        }
    }
    setActForm({
      tipo: 'Actividad de Marco Lógico',
      codigoActividad: '',
      codigoActividadPresupuesto: '',
      nombre: '',
      unidad: '',
      tipoValor: '',
      objetivoGeneral: og,
      objetivoEspecifico: oe,
      resultado: r
    })
    setIsActModalOpen(true)
  }
  const handleEditAct = (item: LogicalFrameTreeItem) => {
    const original = localActividades.find(a => a.id === Number(item.id.replace('act-', '')))
    if (original) {
      setEditingAct({ 
        id: original.id, 
        tipo: original.tipo, 
        codigoActividad: original.codigoActividad, 
        codigoActividadPresupuesto: original.codigoPresupuesto, 
        nombre: original.nombre, 
        unidad: original.unidad || '', 
        tipoValor: original.tipoValor || '', 
        objetivoGeneral: original.objetivoGeneral || '', 
        objetivoEspecifico: original.objetivoEspecifico || '', 
        resultado: original.resultado || '' 
      })
      setActForm({ 
        tipo: original.tipo,
        codigoActividad: original.codigoActividad,
        codigoActividadPresupuesto: original.codigoPresupuesto,
        nombre: original.nombre,
        unidad: original.unidad || '',
        tipoValor: original.tipoValor || '',
        objetivoGeneral: original.objetivoGeneral || '', 
        objetivoEspecifico: original.objetivoEspecifico || '', 
        resultado: original.resultado || '' 
      })
    }
    setIsActModalOpen(true)
  }
  const handleSaveAct = () => {
    if (editingAct) {
        setLocalActividades(prev => prev.map(a => a.id === editingAct.id ? { 
            ...a, 
            tipo: actForm.tipo as any, 
            codigoActividad: actForm.codigoActividad, 
            codigoPresupuesto: actForm.codigoActividadPresupuesto, 
            nombre: actForm.nombre, 
            unidad: actForm.unidad, 
            tipoValor: actForm.tipoValor, 
            objetivoGeneral: actForm.objetivoGeneral, 
            objetivoEspecifico: actForm.objetivoEspecifico, 
            resultado: actForm.resultado 
        } : a))
    } else {
        const newId = Math.max(0, ...localActividades.map(a => a.id)) + 1
        setLocalActividades(prev => [...prev, { 
            id: newId, 
            tipo: actForm.tipo as any, 
            codigoActividad: actForm.codigoActividad, 
            codigoPresupuesto: actForm.codigoActividadPresupuesto, 
            nombre: actForm.nombre, 
            unidad: actForm.unidad, 
            tipoValor: actForm.tipoValor, 
            objetivoGeneral: actForm.objetivoGeneral, 
            objetivoEspecifico: actForm.objetivoEspecifico, 
            resultado: actForm.resultado 
        }])
    }
    setIsActModalOpen(false)
    setShowConfirmSave(true)
  }

  // Subactividad Handlers
  const handleNewSubact = (parent?: LogicalFrameTreeItem) => {
    setEditingSubact(null)
    let og = ''
    let oe = ''
    let r = ''
    let act = ''
    if (parent && parent.id.startsWith('group-subact-act-')) {
        const actId = Number(parent.id.replace('group-subact-act-', ''))
        const parentAct = localActividades.find(x => x.id === actId)
        if (parentAct) {
            act = parentAct.nombre
            r = parentAct.resultado || ''
            oe = parentAct.objetivoEspecifico || ''
            og = parentAct.objetivoGeneral || ''
        }
    }
    setSubactForm({
      tipo: 'Subactividad de Marco Lógico',
      codigoSubactividad: '',
      codigoSubactividadPresupuesto: '',
      nombre: '',
      unidad: '',
      tipoValor: '',
      objetivoGeneral: og,
      objetivoEspecifico: oe,
      resultado: r,
      actividad: act
    })
    setIsSubactModalOpen(true)
  }
  const handleEditSubact = (item: LogicalFrameTreeItem) => {
    const original = localSubactividades.find(sa => sa.id === Number(item.id.replace('subact-', '')))
    if (original) {
      setEditingSubact({ 
        id: original.id, 
        tipo: original.tipo, 
        codigoSubactividad: original.codigoSubactividad, 
        codigoSubactividadPresupuesto: original.codigoSubactividadPresupuesto, 
        nombre: original.nombre, 
        unidad: original.unidad, 
        tipoValor: original.tipoValor, 
        objetivoGeneral: original.objetivoGeneral || '', 
        objetivoEspecifico: original.objetivoEspecifico || '', 
        resultado: original.resultado || '',
        actividad: original.actividad || ''
      })
      setSubactForm({ 
        tipo: original.tipo,
        codigoSubactividad: original.codigoSubactividad,
        codigoSubactividadPresupuesto: original.codigoSubactividadPresupuesto,
        nombre: original.nombre,
        unidad: original.unidad,
        tipoValor: original.tipoValor,
        objetivoGeneral: original.objetivoGeneral || '', 
        objetivoEspecifico: original.objetivoEspecifico || '', 
        resultado: original.resultado || '',
        actividad: original.actividad || ''
      })
    }
    setIsSubactModalOpen(true)
  }
  const handleSaveSubact = () => {
    if (editingSubact) {
        setLocalSubactividades(prev => prev.map(sa => sa.id === editingSubact.id ? { ...sa, ...subactForm, tipo: subactForm.tipo as any } : sa))
    } else {
        const newId = Math.max(0, ...localSubactividades.map(sa => sa.id)) + 1
        setLocalSubactividades(prev => [...prev, { id: newId, ...subactForm, tipo: subactForm.tipo as any }])
    }
    setIsSubactModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleClickNew = (tipo: string, parent?: LogicalFrameTreeItem) => {
    if (tipo === 'Objetivos Generales') handleNewOG()
    if (tipo === 'Objetivos Específicos') handleNewOE(parent)
    if (tipo === 'Resultados') handleNewR(parent)
    if (tipo === 'Actividad') handleNewAct(parent)
    if (tipo === 'Subactividades') handleNewSubact(parent)
  }

  // Hierarchical Options
  const ogOptions = useMemo(() => localObjGeneral.map(og => `${og.codigo} - ${og.nombre}`), [localObjGeneral])
  const getOeOptions = (ogLabel: string) => localObjEspecifico.filter(oe => oe.objetivoGeneral === ogLabel).map(oe => `${oe.codigo} - ${oe.nombre}`)
  const getROptions = (oeLabel: string) => localResultados.filter(r => r.objetivoEspecifico === oeLabel).map(r => `${r.codigo} - ${r.nombre}`)
  const getActOptions = (rLabel: string) => localActividades.filter(a => a.resultado === rLabel).map(a => a.nombre) // Actividad matches by name in hierarchical filters usually

  const unidadesOptions = useMemo(() => unidadesData.map(u => u.nombre), [])
  const tiposValorOptions = useMemo(() => tiposDeValorData.map(t => t.nombre), [])
  const tiposActividadOptions = ['Actividad de Marco Lógico', 'Actividad de Gasto', 'Actividad Complementaria o de Soporte']
  const tiposSubactividadOptions = ['Subactividad de Marco Lógico', 'Subactividad de Gasto', 'Subactividad Complementaria o de Soporte', 'Subactividad de Gasto sin Resultado']

  const isOESaveDisabled = useMemo(() => oeForm.objetivoGeneral && oeForm.codigo && oeForm.nombre, [oeForm])
  const isRSaveDisabled = useMemo(() => rForm.objetivoGeneral && rForm.objetivoEspecifico && rForm.codigo && rForm.nombre, [rForm])
  const isActSaveDisabled = useMemo(() => actForm.tipo && actForm.codigoActividad && actForm.nombre && actForm.unidad && actForm.tipoValor && actForm.objetivoGeneral && actForm.objetivoEspecifico && actForm.resultado, [actForm])
  const isSubactSaveDisabled = useMemo(() => subactForm.tipo && subactForm.codigoSubactividad && subactForm.nombre && subactForm.unidad && subactForm.tipoValor && subactForm.objetivoGeneral && subactForm.objetivoEspecifico && subactForm.resultado && subactForm.actividad, [subactForm])

  // SideSheet helpers
  const handleViewDetails = (item: LogicalFrameTreeItem) => {
    setSelectedSheetItem(item)
    setIsSheetOpen(true)
  }

  const handleEditFromSheet = () => {
    if (!selectedSheetItem) return
    const item = selectedSheetItem
    setIsSheetOpen(false)
    if (item.tipo === 'Obj. General') handleEditOG(item)
    if (item.tipo === 'Obj. Específico') handleEditOE(item)
    if (item.tipo === 'Resultado') handleEditR(item)
    if (item.tipo === 'Actividad') handleEditAct(item)
    if (item.id.startsWith('subact-')) handleEditSubact(item)
  }

  const renderSheetContent = () => {
    if (!selectedSheetItem) return null
    const item = selectedSheetItem

    // Find original data for more fields
    let originalData: any = null
    const numericId = parseInt(item.id.split('-').pop() || '0')

    if (item.tipo === 'Obj. General') originalData = localObjGeneral.find(i => i.id === numericId)
    if (item.tipo === 'Obj. Específico') originalData = localObjEspecifico.find(i => i.id === numericId)
    if (item.tipo === 'Resultado') originalData = localResultados.find(i => i.id === numericId)
    if (item.tipo === 'Actividad') originalData = localActividades.find(i => i.id === numericId)
    if (item.tipo === 'Subactividad' || item.tipo.startsWith('Subact')) originalData = localSubactividades.find(i => i.id === numericId)

    const isComplex = item.tipo === 'Actividad' || item.tipo.startsWith('Subact')

    return (
      <>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Información</h3>
          <div className={styles.fieldGroup}>
            {isComplex ? (
              <>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Tipo de {item.tipo}</span>
                  <span className={styles.fieldValue}>{originalData?.tipo}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Código de {item.tipo}</span>
                  <span className={styles.fieldValue}>{item.tipo === 'Actividad' ? originalData?.codigoActividad : originalData?.codigoSubactividad}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Código de {item.tipo} Presupuesto</span>
                  <span className={styles.fieldValue}>{item.tipo === 'Actividad' ? originalData?.codigoActividadPresupuesto : originalData?.codigoSubactividadPresupuesto}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Nombre</span>
                  <span className={styles.fieldValue}>{item.nombre}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Unidad</span>
                  <span className={styles.fieldValue}>{originalData?.unidad}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Tipo de Valor</span>
                  <span className={styles.fieldValue}>{originalData?.tipoValor}</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Código</span>
                  <span className={styles.fieldValue}>{item.codigo}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Nombre</span>
                  <span className={styles.fieldValue}>{item.nombre}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Jerarquía</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Programa</span>
              <span className={styles.fieldValue}>{programFilter}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Proyecto</span>
              <span className={styles.fieldValue}>{projectFilter}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Subproyecto</span>
              <span className={styles.fieldValue}>{subprojectFilter}</span>
            </div>
            {(item.tipo !== 'Obj. General') && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Objetivo General</span>
                <span className={styles.fieldValue}>{originalData?.objetivoGeneral}</span>
              </div>
            )}
            {(item.tipo === 'Resultado' || item.tipo === 'Actividad' || item.tipo.startsWith('Subact')) && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Objetivo Específico</span>
                <span className={styles.fieldValue}>{originalData?.objetivoEspecifico}</span>
              </div>
            )}
            {(item.tipo === 'Actividad' || item.tipo.startsWith('Subact')) && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Resultado</span>
                <span className={styles.fieldValue}>{originalData?.resultado}</span>
              </div>
            )}
            {(item.tipo.startsWith('Subact')) && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Actividad</span>
                <span className={styles.fieldValue}>{originalData?.actividad}</span>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // Build the hierarchical tree from the data arrays
  const filteredData = useMemo((): LogicalFrameTreeItem[] => {
    if (!isFiltered) return []

    const ogItems: LogicalFrameTreeItem[] = localObjGeneral.map(og => {
      const ogLabel = `${og.codigo} - ${og.nombre}`
      const oeChildren: LogicalFrameTreeItem[] = localObjEspecifico
        .filter(oe => oe.objetivoGeneral === ogLabel)
        .map(oe => {
          const oeLabel = `${oe.codigo} - ${oe.nombre}`
          const rChildren: LogicalFrameTreeItem[] = localResultados
            .filter(r => r.objetivoGeneral === ogLabel && r.objetivoEspecifico === oeLabel)
            .map(r => {
              const rLabel = `${r.codigo} - ${r.nombre}`
              const actChildren: LogicalFrameTreeItem[] = localActividades
                .filter(a => a.resultado === rLabel)
                .map(a => {
                  const subActChildren: LogicalFrameTreeItem[] = localSubactividades
                    .filter(sa => sa.actividad === a.nombre)
                    .map(sa => ({
                      id: `subact-${sa.id}`,
                      tipo: sa.tipo,
                      badgeVariant: 'subact' as const,
                      codigo: sa.codigoSubactividad,
                      nombre: sa.nombre,
                    }))

                  return {
                    id: `act-${a.id}`,
                    tipo: 'Actividad',
                    badgeVariant: 'act' as const,
                    codigo: a.codigoActividad,
                    nombre: a.nombre,
                    children: [
                        {
                            id: `group-subact-act-${a.id}`,
                            tipo: 'Subactividades',
                            badgeVariant: 'subact-group' as const,
                            isGroup: true,
                            nombre: '',
                            children: subActChildren,
                        }
                    ],
                  } as LogicalFrameTreeItem
                })

              return {
                id: `r-${r.id}`,
                tipo: 'Resultado',
                badgeVariant: 'result' as const,
                codigo: r.codigo,
                nombre: r.nombre,
                children: [
                    {
                        id: `group-act-r-${r.id}`,
                        tipo: 'Actividad',
                        badgeVariant: 'act-group' as const,
                        isGroup: true,
                        nombre: '',
                        children: actChildren,
                    }
                ],
              } as LogicalFrameTreeItem
            })

          return {
            id: `oe-${oe.id}`,
            tipo: 'Obj. Específico',
            badgeVariant: 'oe' as const,
            codigo: oe.codigo,
            nombre: oe.nombre,
            children: [
                {
                    id: `group-r-oe-${oe.id}`,
                    tipo: 'Resultados',
                    badgeVariant: 'result-group' as const,
                    isGroup: true,
                    nombre: '',
                    children: rChildren,
                }
            ],
          } as LogicalFrameTreeItem
        })

      const oeGroup: LogicalFrameTreeItem | null = {
        id: `group-oe-og-${og.id}`,
        tipo: 'Objetivos Específicos',
        badgeVariant: 'oe-group' as const,
        isGroup: true,
        nombre: '',
        children: oeChildren,
      }

      return {
        id: `og-${og.id}`,
        tipo: 'Obj. General',
        badgeVariant: 'og' as const,
        codigo: og.codigo,
        nombre: og.nombre,
        children: [oeGroup],
      } as LogicalFrameTreeItem
    })

    // Wrap all OGs in a top-level group
    return [
      {
        id: 'group-og',
        tipo: 'Objetivos Generales',
        badgeVariant: 'og-group' as const,
        isGroup: true,
        nombre: '',
        children: ogItems,
      }
    ]
  }, [isFiltered, localObjGeneral, localObjEspecifico, localResultados, localActividades, localSubactividades])

  const handleSelectAll = () => {
    if (headerChecked) {
      setSelectedIds(new Set())
      setHeaderChecked(false)
    } else {
      const allIds: string[] = []
      const collectIds = (items: LogicalFrameTreeItem[]) => {
        items.forEach(item => {
          allIds.push(item.id)
          if (item.children) collectIds(item.children)
        })
      }
      collectIds(filteredData)
      setSelectedIds(new Set(allIds))
      setHeaderChecked(true)
    }
  }

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setHeaderChecked(false)
  }

  const getNewButtonLabel = (tipo: string) => {
    if (tipo === 'Objetivos Generales') return 'Nuevo Obj. General'
    if (tipo === 'Objetivos Específicos') return 'Nuevo Obj. Específico'
    if (tipo === 'Resultados') return 'Nuevo Resultado'
    if (tipo === 'Actividad') return 'Nueva Actividad'
    if (tipo === 'Subactividades') return 'Nueva Subactividad'
    return `Nuevo ${tipo}`
  }

  const renderRow = (item: LogicalFrameTreeItem, ancestors: boolean[] = [], isLast: boolean = false) => {
    const isExpanded = expandedNodes.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id} className={styles.rowGroup}>
        <div className={`${styles.tr} ${selectedIds.has(item.id) ? styles.rowSelected : ''}`}>
          <div className={styles.td} style={{ width: '48px', padding: '16px 0 16px 24px' }}>
            <Checkbox
              checked={selectedIds.has(item.id)}
              onChange={() => handleSelectItem(item.id)}
            />
          </div>
          <div className={styles.td} style={{ whiteSpace: 'nowrap' }}>
            <div className={styles.hierarchy}>
              {ancestors.map((hasNext, idx) => (
                <span key={idx} className={styles.indent} data-line={hasNext ? 'true' : 'false'} />
              ))}
              <span className={styles.joint} data-line={isLast ? 'false' : 'true'} data-last={isLast ? 'true' : 'false'}>
                {hasChildren ? (
                  <ChevronRight
                    size={16}
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                    onClick={() => toggleNode(item.id)}
                  />
                ) : (
                  <span style={{ width: 16, height: 16, display: 'inline-block' }} />
                )}
              </span>
              <Badge variant={item.badgeVariant}>{item.tipo}</Badge>
            </div>
          </div>
          <div className={styles.td} style={{ width: '120px' }}>
            {item.codigo || ''}
          </div>
          <div className={styles.td} style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {item.nombre}
          </div>
          <div className={styles.td} style={{ width: '240px', textAlign: 'right' }}>
            <div className={styles.actions}>
              {item.isGroup ? (
                <button className={styles.newButton} onClick={() => handleClickNew(item.tipo, item)}>
                  <Plus size={14} /> {getNewButtonLabel(item.tipo)}
                </button>
              ) : (
                <>
                  <Eye size={18} className={styles.actionIcon} onClick={() => handleViewDetails(item)} />
                  <Pencil size={18} className={styles.actionIcon} onClick={() => {
                    if (item.tipo === 'Obj. General') handleEditOG(item)
                    if (item.tipo === 'Obj. Específico') handleEditOE(item)
                    if (item.tipo === 'Resultado') handleEditR(item)
                    if (item.id.startsWith('act-')) handleEditAct(item)
                    if (item.id.startsWith('subact-')) handleEditSubact(item)
                  }} />
                  <Trash2 
                    size={18} 
                    className={`${styles.actionIcon} ${styles.deleteIcon}`} 
                    onClick={() => handleDelete(item)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className={styles.children}>
            {item.children!.map((child, idx) => renderRow(child, [...ancestors, !isLast], idx === item.children!.length - 1))}
          </div>
        )}
      </div>
    )
  }

  // Count total items for pagination
  const countItems = (items: LogicalFrameTreeItem[]): number => {
    return items.reduce((acc, item) => {
      return acc + 1 + (item.children ? countItems(item.children) : 0)
    }, 0)
  }
  const totalItems = filteredData.length > 0 ? countItems(filteredData) : 0

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Marco Lógico"
          subtitle="Gestión de Objetivos, Resultados, Actividades y Subactividades"
        />
      </header>

      <Toolbar
        onExport={() => { }}
        onRefresh={() => { }}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
      >
        <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'nowrap', minWidth: 0, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect
              label="Programa"
              options={programOptions}
              value={programFilter}
              onChange={handleProgramChange}
              width="100%"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect
              label="Proyecto"
              options={projectOptions}
              value={projectFilter}
              onChange={handleProjectChange}
              width="100%"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect
              label="Subproyecto"
              options={subprojectOptions}
              value={subprojectFilter}
              onChange={handleSubprojectChange}
              width="100%"
            />
          </div>
          <button
            className={styles.filterButton}
            onClick={handleFilter}
            disabled={!programFilter && !projectFilter && !subprojectFilter}
          >
            Filtrar
          </button>
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <div className={styles.treeTable}>
          <div style={{ display: 'flex', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            <div className={styles.th} style={{ width: '48px', padding: '16px 0 16px 24px' }}>
              <Checkbox
                checked={headerChecked}
                onChange={handleSelectAll}
              />
            </div>
            <div className={styles.th} style={{ whiteSpace: 'nowrap' }}>Tipo</div>
            <div className={styles.th} style={{ width: '120px' }}>Código</div>
            <div className={styles.th} style={{ flex: 1 }}>Nombre</div>
            <div className={styles.th} style={{ width: '240px', textAlign: 'right', paddingRight: '32px' }}>Acciones</div>
          </div>
          {!isFiltered && (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>Seleccione un subproyecto y presione <strong>Filtrar</strong> para visualizar el Marco Lógico</p>
            </div>
          )}
          {filteredData.map((item, idx) => renderRow(item, [], idx === filteredData.length - 1))}
        </div>
      </div>

      {totalItems > 0 && <Pagination total={totalItems} range={`1-${totalItems}`} />}

      {/* Modal Obj. General */}
      <Modal
        isOpen={isOGModalOpen}
        onClose={() => setIsOGModalOpen(false)}
        title={editingOG ? 'Editar Obj. General' : 'Nuevo Obj. General'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveOG}
        isSaveDisabled={isOGSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Subproyecto"
            value={subprojectLabel}
            onChange={() => {}}
            disabled
          />
          <Input
            label="Código"
            value={ogForm.codigo}
            onChange={(val) => setOgForm({ ...ogForm, codigo: val })}
          />
          <Input
            label="Nombre"
            value={ogForm.nombre}
            onChange={(val) => setOgForm({ ...ogForm, nombre: val })}
          />
        </div>
      </Modal>

      {/* Modal Obj. Específico */}
      <Modal
        isOpen={isOEModalOpen}
        onClose={() => setIsOEModalOpen(false)}
        title={editingOE ? 'Editar Obj. Específico' : 'Nuevo Obj. Específico'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveOE}
        isSaveDisabled={!isOESaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Subproyecto" value={subprojectLabel} onChange={() => {}} disabled />
          <FilterSelect
            label="Objetivo General"
            options={ogOptions}
            value={oeForm.objetivoGeneral}
            onChange={(val) => setOeForm({ ...oeForm, objetivoGeneral: val, codigo: '', nombre: '' })}
          />
          <Input
            label="Código"
            value={oeForm.codigo}
            onChange={(val) => setOeForm({ ...oeForm, codigo: val })}
          />
          <Input
            label="Nombre"
            value={oeForm.nombre}
            onChange={(val) => setOeForm({ ...oeForm, nombre: val })}
          />
        </div>
      </Modal>

      {/* Modal Resultado */}
      <Modal
        isOpen={isRModalOpen}
        onClose={() => setIsRModalOpen(false)}
        title={editingR ? 'Editar Resultado' : 'Nuevo Resultado'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveR}
        isSaveDisabled={!isRSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input label="Subproyecto" value={subprojectLabel} onChange={() => {}} disabled />
          <FilterSelect
            label="Objetivo General"
            options={ogOptions}
            value={rForm.objetivoGeneral}
            onChange={(val) => setRForm({ ...rForm, objetivoGeneral: val, objetivoEspecifico: '', codigo: '', nombre: '' })}
          />
          <FilterSelect
            label="Objetivo Específico"
            options={getOeOptions(rForm.objetivoGeneral)}
            value={rForm.objetivoEspecifico}
            onChange={(val) => setRForm({ ...rForm, objetivoEspecifico: val, codigo: '', nombre: '' })}
          />
          <Input
            label="Código"
            value={rForm.codigo}
            onChange={(val) => setRForm({ ...rForm, codigo: val })}
          />
          <Input
            label="Nombre"
            value={rForm.nombre}
            onChange={(val) => setRForm({ ...rForm, nombre: val })}
          />
        </div>
      </Modal>

      {/* Modal Actividad */}
      <Modal
        isOpen={isActModalOpen}
        onClose={() => setIsActModalOpen(false)}
        title={editingAct ? 'Editar Actividad' : 'Nueva Actividad'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveAct}
        isSaveDisabled={!isActSaveDisabled}
        width="1320px"
      >
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <FilterSelect
              label="Tipo de Actividad"
              options={tiposActividadOptions}
              value={actForm.tipo}
              onChange={(val) => setActForm({ ...actForm, tipo: val })}
              width="600px"
            />
            <Input
              label="Código de Actividad"
              value={actForm.codigoActividad}
              onChange={(val) => setActForm({ ...actForm, codigoActividad: val })}
              width="600px"
            />
            <Input
              label="Código de Actividad Presupuesto"
              value={actForm.codigoActividadPresupuesto}
              onChange={(val) => setActForm({ ...actForm, codigoActividadPresupuesto: val })}
              width="600px"
            />
            <Input
              label="Nombre de Actividad"
              value={actForm.nombre}
              onChange={(val) => setActForm({ ...actForm, nombre: val })}
              width="600px"
            />
            <FilterSelect
              label="Unidad"
              options={unidadesOptions}
              value={actForm.unidad}
              onChange={(val) => setActForm({ ...actForm, unidad: val })}
              width="600px"
            />
            <FilterSelect
              label="Tipo de Valor"
              options={tiposValorOptions}
              value={actForm.tipoValor}
              onChange={(val) => setActForm({ ...actForm, tipoValor: val })}
              width="600px"
            />
          </div>
          <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>Jerarquía Requerida</h3>
            <Input label="Subproyecto" value={subprojectLabel} onChange={() => {}} disabled width="600px" />
            <FilterSelect
              label="Objetivo General"
              options={ogOptions}
              value={actForm.objetivoGeneral}
              onChange={(val) => setActForm({ ...actForm, objetivoGeneral: val, objetivoEspecifico: '', resultado: '' })}
              width="600px"
            />
            <FilterSelect
              label="Objetivo Específico"
              options={getOeOptions(actForm.objetivoGeneral)}
              value={actForm.objetivoEspecifico}
              onChange={(val) => setActForm({ ...actForm, objetivoEspecifico: val, resultado: '' })}
              width="600px"
            />
            <FilterSelect
              label="Resultado"
              options={getROptions(actForm.objetivoEspecifico)}
              value={actForm.resultado}
              onChange={(val) => setActForm({ ...actForm, resultado: val })}
              width="600px"
            />
          </div>
        </div>
      </Modal>

      {/* Modal Subactividad */}
      <Modal
        isOpen={isSubactModalOpen}
        onClose={() => setIsSubactModalOpen(false)}
        title={editingSubact ? 'Editar Subactividad' : 'Nueva Subactividad'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSaveSubact}
        isSaveDisabled={!isSubactSaveDisabled}
        width="1320px"
      >
        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <FilterSelect
              label="Tipo de Subactividad"
              options={tiposSubactividadOptions}
              value={subactForm.tipo}
              onChange={(val) => setSubactForm({ ...subactForm, tipo: val })}
              width="600px"
            />
            <Input
              label="Código de Subactividad"
              value={subactForm.codigoSubactividad}
              onChange={(val) => setSubactForm({ ...subactForm, codigoSubactividad: val })}
              width="600px"
            />
            <Input
              label="Código de Subactividad Presupuesto"
              value={subactForm.codigoSubactividadPresupuesto}
              onChange={(val) => setSubactForm({ ...subactForm, codigoSubactividadPresupuesto: val })}
              width="600px"
            />
            <Input
              label="Nombre de Subactividad"
              value={subactForm.nombre}
              onChange={(val) => setSubactForm({ ...subactForm, nombre: val })}
              width="600px"
            />
            <FilterSelect
              label="Unidad"
              options={unidadesOptions}
              value={subactForm.unidad}
              onChange={(val) => setSubactForm({ ...subactForm, unidad: val })}
              width="600px"
            />
            <FilterSelect
              label="Tipo de Valor"
              options={tiposValorOptions}
              value={subactForm.tipoValor}
              onChange={(val) => setSubactForm({ ...subactForm, tipoValor: val })}
              width="600px"
            />
          </div>
          <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>Jerarquía Requerida</h3>
            <Input label="Subproyecto" value={subprojectLabel} onChange={() => {}} disabled width="600px" />
            <FilterSelect
              label="Objetivo General"
              options={ogOptions}
              value={subactForm.objetivoGeneral}
              onChange={(val) => setSubactForm({ ...subactForm, objetivoGeneral: val, objetivoEspecifico: '', resultado: '', actividad: '' })}
              width="600px"
            />
            <FilterSelect
              label="Objetivo Específico"
              options={getOeOptions(subactForm.objetivoGeneral)}
              value={subactForm.objetivoEspecifico}
              onChange={(val) => setSubactForm({ ...subactForm, objetivoEspecifico: val, resultado: '', actividad: '' })}
              width="600px"
            />
            <FilterSelect
              label="Resultado"
              options={getROptions(subactForm.objetivoEspecifico)}
              value={subactForm.resultado}
              onChange={(val) => setSubactForm({ ...subactForm, resultado: val, actividad: '' })}
              width="600px"
            />
            <FilterSelect
              label="Actividad"
              options={getActOptions(subactForm.resultado)}
              value={subactForm.actividad}
              onChange={(val) => setSubactForm({ ...subactForm, actividad: val })}
              width="600px"
            />
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        variant="success"
        title="Cambios guardados con éxito"
        description="La información ha sido actualizada en el sistema"
        primaryAction={{
          label: 'Continuar',
          onClick: () => setShowConfirmSave(false)
        }}
      />
      {/* Side Sheet de Detalles */}
      <SideSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedSheetItem ? `${selectedSheetItem.codigo ? selectedSheetItem.codigo + ' - ' : ''}${selectedSheetItem.nombre}` : ''}
        subtitle={selectedSheetItem?.tipo}
        onEdit={handleEditFromSheet}
      >
        {renderSheetContent()}
      </SideSheet>

      {/* Modal de confirmación (Eliminar) */}
      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        variant="danger"
        title="¿Estás seguro de eliminar?"
        description="Esta acción eliminará el elemento y todos sus descendientes de forma irreversible."
        primaryAction={{
          label: 'Eliminar',
          onClick: confirmDelete
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setShowDeleteAlert(false)
        }}
      />
    </div>
  )
}
