import { useState, useMemo, useRef, useEffect } from 'react'
import {
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  Pin,
  MoreHorizontal,
  Calculator
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
  tiposDeValorData,
  indicadoresData,
  institutionalIndicatorsData
} from '../../../data/mockData'
import type { Indicador, LogicalFrameTreeItem } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import styles from './LogicalFrameView.module.css'

export function LogicalFrameView({ isEmbedded = false, initialSubproject }: { isEmbedded?: boolean, initialSubproject?: string }) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [headerChecked, setHeaderChecked] = useState(false)
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    if (initialSubproject) {
      setSubprojectFilter(initialSubproject)
      const plan = planesAnualesData.find(p => `${p.codigosubproyecto} - ${p.subproyecto}` === initialSubproject)
      if (plan) {
        setProgramFilter(plan.programa)
        setProjectFilter(plan.proyecto)
      }
      setIsFiltered(true)
      setExpandedNodes(['group-og', 'group-oe', 'group-r', 'group-act', 'group-subact'])
    }
  }, [initialSubproject])

  // Local state for hierarchy data to allow persistence
  const [localObjGeneral, setLocalObjGeneral] = useState(objGeneralData)
  const [localObjEspecifico, setLocalObjEspecifico] = useState(objEspecificoData)
  const [localResultados, setLocalResultados] = useState(resultadosData)
  const [localActividades, setLocalActividades] = useState(actividadData)
  const [localSubactividades, setLocalSubactividades] = useState(subactividadData)
  const [localIndicadores, setLocalIndicadores] = useState<Indicador[]>(indicadoresData)
  
  // Indicator Modal state
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<Indicador | null>(null)
  const [indicatorForm, setIndicatorForm] = useState<Partial<Indicador>>({
    tipo: 'Indicador de Subproyecto',
    codigo: '',
    nombre: '',
    unidad: '',
    tipoValor: '',
    subproyecto: '',
    objetivoGeneral: '',
    objetivoEspecifico: '',
    resultado: ''
  })
  
  // Formula Modal state
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false)
  const [formulaIndicator, setFormulaIndicator] = useState<Indicador | null>(null)
  const formulaRef = useRef<HTMLDivElement>(null)
  const [savedRange, setSavedRange] = useState<Range | null>(null)

  // Combined indicators for formula selection
  const allIndicatorsForFormula = useMemo(() => {
    const inst = institutionalIndicatorsData.map(i => ({
      id: `inst-${i.id}`,
      label: `${i.codigo} - ${i.nombre}`,
      original: i
    }))
    const local = localIndicadores.map(i => ({
      id: `local-${i.id}`,
      label: `${i.codigo} - ${i.nombre}`,
      original: i
    }))
    return [...inst, ...local]
  }, [localIndicadores])
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

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

  // Modal options for indicators
  const subprojectModalOptions = useMemo(() =>
    planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`).sort(),
    []
  )

  const ogOptionsForModal = useMemo(() =>
    objGeneralData.map(og => `${og.codigo} - ${og.nombre}`).sort(),
    []
  )

  const oeOptionsForModal = useMemo(() => {
    if (!indicatorForm.objetivoGeneral) return []
    return objEspecificoData
      .filter(oe => oe.objetivoGeneral === indicatorForm.objetivoGeneral)
      .map(oe => `${oe.codigo} - ${oe.nombre}`)
      .sort()
  }, [indicatorForm.objetivoGeneral])

  const resultadoOptionsForModal = useMemo(() => {
    if (!indicatorForm.objetivoEspecifico) return []
    return resultadosData
      .filter(r => r.objetivoEspecifico === indicatorForm.objetivoEspecifico)
      .map(r => `${r.codigo} - ${r.nombre}`)
      .sort()
  }, [indicatorForm.objetivoEspecifico])

  const handleEditIndicator = (item: LogicalFrameTreeItem) => {
    const numericId = Number(item.id.split('-').pop())
    const original = localIndicadores.find(i => i.id === numericId)
    if (original) {
      setEditingIndicator(original)
      setIndicatorForm({ ...original })
      setIsIndicatorModalOpen(true)
    }
  }

  const handleNewIndicator = (tipo: string, parent?: LogicalFrameTreeItem) => {
    setEditingIndicator(null)
    
    // Auto-fill logic
    const subCode = subprojectFilter ? subprojectFilter.split(' - ')[0] : ''
    let og = ''
    let oe = ''
    let r = ''
    
    // Map shortened type back to full type
    let fullTipo = 'Indicador de Subproyecto'
    if (tipo === 'IND OG') fullTipo = 'Indicador de Objetivo General'
    if (tipo === 'IND OE') fullTipo = 'Indicador de Objetivo Específico'
    if (tipo === 'IND R') fullTipo = 'Indicador de Resultado'

    if (parent) {
       if (tipo === 'IND OG') {
         const ogId = Number(parent.id.replace('group-ind-og-', ''))
         const ogItem = localObjGeneral.find(x => x.id === ogId)
         if (ogItem) og = `${ogItem.codigo} - ${ogItem.nombre}`
       } else if (tipo === 'IND OE') {
         const oeId = Number(parent.id.replace('group-ind-oe-', ''))
         const oeItem = localObjEspecifico.find(x => x.id === oeId)
         if (oeItem) {
           oe = `${oeItem.codigo} - ${oeItem.nombre}`
           og = oeItem.objetivoGeneral || ''
         }
       } else if (tipo === 'IND R') {
         const rId = Number(parent.id.replace('group-ind-r-', ''))
         const rItem = localResultados.find(x => x.id === rId)
         if (rItem) {
           r = `${rItem.codigo} - ${rItem.nombre}`
           oe = rItem.objetivoEspecifico || ''
           // Find OE to get OG
           const parentOe = localObjEspecifico.find(x => `${x.codigo} - ${x.nombre}` === oe)
           if (parentOe) og = parentOe.objetivoGeneral || ''
         }
       }
    }

    setIndicatorForm({
      tipo: fullTipo as any,
      codigo: '',
      nombre: '',
      unidad: '',
      tipoValor: '',
      subproyecto: subCode,
      objetivoGeneral: og,
      objetivoEspecifico: oe,
      resultado: r
    })
    setIsIndicatorModalOpen(true)
  }

  const handleSaveIndicator = () => {
    const subprojectCode = indicatorForm.subproyecto
    const plan = planesAnualesData.find(p => p.codigosubproyecto === subprojectCode)

    if (editingIndicator) {
      const indicatorToSave: Indicador = {
        ...editingIndicator,
        ...indicatorForm,
        programa: plan?.programa || '',
        proyecto: plan?.proyecto || ''
      } as Indicador
      setLocalIndicadores(prev => prev.map(i => i.id === editingIndicator.id ? indicatorToSave : i))
    } else {
      const newId = Math.max(0, ...localIndicadores.map(i => i.id)) + 1
      const indicatorToSave: Indicador = {
        ...indicatorForm,
        id: newId,
        programa: plan?.programa || '',
        proyecto: plan?.proyecto || ''
      } as any
      setLocalIndicadores(prev => [...prev, indicatorToSave as Indicador])
    }
    setIsIndicatorModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleSaveFormula = () => {
    if (formulaIndicator && formulaRef.current) {
      // Parse HTML back to simple string format
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formulaRef.current.innerHTML;

      const badges = tempDiv.querySelectorAll(`.${styles.formulaTokenBadge}`);
      badges.forEach(badge => {
        const code = (badge as HTMLElement).dataset.code;
        badge.replaceWith(`[${code}]`);
      });

      let formulaString = tempDiv.innerText.replace(/\n/g, '').trim();
      // Ensure formula starts with =
      if (formulaString && !formulaString.startsWith('=')) {
        formulaString = '=' + formulaString;
      }

      setLocalIndicadores(prev =>
        prev.map(i => i.id === formulaIndicator.id ? { ...i, formula: formulaString } : i)
      )
    }
    setIsFormulaModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleFormulaIndicatorsChange = (selectedLabels: string[]) => {
    if (!formulaRef.current) return;

    const currentBadges = Array.from(formulaRef.current.querySelectorAll(`.${styles.formulaTokenBadge}`))
      .map(b => (b as HTMLElement).dataset.code)
      .filter((c): c is string => Boolean(c));

    selectedLabels.forEach(label => {
      const code = label.split(' - ')[0];
      if (!currentBadges.includes(code)) {
        insertBadge(code);
      }
    });

    const codesInLabels = selectedLabels.map(l => l.split(' - ')[0]);
    currentBadges.forEach(code => {
      if (!codesInLabels.includes(code)) {
        const badgeEls = formulaRef.current?.querySelectorAll(`[data-code="${code}"]`);
        badgeEls?.forEach((el: Element) => el.remove());
      }
    });
  }

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
  }

  const insertBadge = (code: string) => {
    if (!formulaRef.current) return;

    formulaRef.current.focus();
    const selection = window.getSelection();
    if (savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range) return;

    const span = document.createElement('span');
    span.contentEditable = 'false';
    span.className = styles.formulaTokenBadge;
    span.dataset.code = code;
    span.innerHTML = `${code}<span class="${styles.tokenRemove}" style="cursor: pointer; margin-left: 6px;">×</span>`;

    // Manual listener for removal
    span.querySelector(`.${styles.tokenRemove}`)?.addEventListener('click', (e) => {
      e.stopPropagation();
      span.remove();
    });

    range.deleteContents();
    range.insertNode(span);

    const space = document.createTextNode('\u00A0');
    range.setStartAfter(span);
    range.insertNode(space);
    range.setStartAfter(space);

    selection?.removeAllRanges();
    selection?.addRange(range);
    setSavedRange(range.cloneRange());
  }

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = formulaRef.current?.innerText || '';

    if (e.key === 'Backspace' && range.startOffset === 1 && text.startsWith('=') && range.startContainer === formulaRef.current?.firstChild) {
      e.preventDefault();
    }
    if (e.key === 'Backspace' && text === '=' && range.startOffset === 1) {
      e.preventDefault();
    }
  }

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

    if (tipo === 'OG') {
      setLocalObjGeneral(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'OE') {
      setLocalObjEspecifico(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'R') {
      setLocalResultados(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'ACT') {
      setLocalActividades(prev => prev.filter(i => i.id !== numericId))
    } else if (tipo === 'SUBACT') {
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
    if (tipo === 'OG') handleNewOG()
    if (tipo === 'OE') handleNewOE(parent)
    if (tipo === 'R') handleNewR(parent)
    if (tipo === 'ACT') handleNewAct(parent)
    if (tipo === 'SUBACT') handleNewSubact(parent)
    if (tipo.startsWith('IND')) handleNewIndicator(tipo, parent)
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
    if (item.tipo === 'OG') handleEditOG(item)
    else if (item.tipo === 'OE') handleEditOE(item)
    else if (item.tipo === 'R') handleEditR(item)
    else if (item.tipo === 'ACT') handleEditAct(item)
    else if (item.id.startsWith('subact-')) handleEditSubact(item)
    else if (item.id.startsWith('ind-')) handleEditIndicator(item)
  }

  const renderSheetContent = () => {
    if (!selectedSheetItem) return null
    const item = selectedSheetItem

    // Find original data for more fields
    let originalData: any = null
    const numericId = parseInt(item.id.split('-').pop() || '0')

    if (item.tipo === 'OG') originalData = localObjGeneral.find(i => i.id === numericId)
    if (item.tipo === 'OE') originalData = localObjEspecifico.find(i => i.id === numericId)
    if (item.tipo === 'R') originalData = localResultados.find(i => i.id === numericId)
    if (item.tipo === 'ACT') originalData = localActividades.find(i => i.id === numericId)
    if (item.tipo === 'SUBACT' || item.tipo.startsWith('Subact')) originalData = localSubactividades.find(i => i.id === numericId)
    if (item.id.startsWith('ind-')) originalData = localIndicadores.find(i => i.id === numericId)

    const isComplex = item.tipo === 'ACT' || item.tipo.startsWith('SUBACT') || item.id.startsWith('ind-')

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
                  <span className={styles.fieldValue}>{item.tipo === 'ACT' ? originalData?.codigoActividad : originalData?.codigoSubactividad}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Código de {item.tipo} Presupuesto</span>
                  <span className={styles.fieldValue}>{item.tipo === 'ACT' ? originalData?.codigoPresupuesto : originalData?.codigoSubactividadPresupuesto}</span>
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
                  <span className={styles.fieldLabel}>Tipo de Dato</span>
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
            {(item.tipo !== 'OG' && item.tipo !== 'IND SUBP') && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Objetivo General</span>
                <span className={styles.fieldValue}>{originalData?.objetivoGeneral}</span>
              </div>
            )}
            {(item.tipo === 'R' || item.tipo === 'ACT' || item.tipo.startsWith('SUBACT') || item.tipo === 'IND OE' || item.tipo === 'IND R') && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Objetivo Específico</span>
                <span className={styles.fieldValue}>{originalData?.objetivoEspecifico}</span>
              </div>
            )}
            {(item.tipo === 'ACT' || item.tipo.startsWith('SUBACT') || item.tipo === 'IND R') && (
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Resultado</span>
                <span className={styles.fieldValue}>{originalData?.resultado}</span>
              </div>
            )}
            {(item.tipo.startsWith('SUBACT')) && (
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

    const subprojectCode = subprojectFilter.split(' - ')[0]

    // 1. Indicadores de Subproyecto (Level 1)
    const spIndicadores: LogicalFrameTreeItem[] = localIndicadores
      .filter(ind => ind.tipo === 'Indicador de Subproyecto' && ind.subproyecto === subprojectCode)
      .map(ind => ({
        id: `ind-sp-${ind.id}`,
        tipo: 'IND SUBP',
        badgeVariant: 'sp-indicador' as const,
        codigo: ind.codigo,
        nombre: ind.nombre,
        unidad: ind.unidad,
        tipoValor: ind.tipoValor,
      }))

    const spIndicadorGroup: LogicalFrameTreeItem = {
      id: 'group-sp-ind',
      tipo: 'IND SUBP',
      badgeVariant: 'sp-indicador-group' as const,
      isGroup: true,
      nombre: '',
      children: spIndicadores,
    }

    // 2. Objetivos Generales (Level 1)
    const ogItems: LogicalFrameTreeItem[] = localObjGeneral.map(og => {
      const ogLabel = `${og.codigo} - ${og.nombre}`
      
      // 3. Indicadores de Objetivos Generales (Level 2, under OG)
      const ogIndicadores: LogicalFrameTreeItem[] = localIndicadores
        .filter(ind => ind.tipo === 'Indicador de Objetivo General' && ind.objetivoGeneral === ogLabel)
        .map(ind => ({
          id: `ind-og-${ind.id}`,
          tipo: 'IND OG',
          badgeVariant: 'og-indicador' as const,
          codigo: ind.codigo,
          nombre: ind.nombre,
          unidad: ind.unidad,
          tipoValor: ind.tipoValor,
        }))

      const ogIndicadorGroup: LogicalFrameTreeItem = {
        id: `group-ind-og-${og.id}`,
        tipo: 'IND OG',
        badgeVariant: 'og-indicador-group' as const,
        isGroup: true,
        nombre: '',
        children: ogIndicadores,
      }

      // 4. Objetivos Específicos (Level 2, under OG)
      const oeItems: LogicalFrameTreeItem[] = localObjEspecifico
        .filter(oe => oe.objetivoGeneral === ogLabel)
        .map(oe => {
          const oeLabel = `${oe.codigo} - ${oe.nombre}`

          // 5. Indicadores de Objetivos Específicos (Level 3, under OE)
          const oeIndicadores: LogicalFrameTreeItem[] = localIndicadores
            .filter(ind => ind.tipo === 'Indicador de Objetivo Específico' && ind.objetivoEspecifico === oeLabel)
            .map(ind => ({
              id: `ind-oe-${ind.id}`,
              tipo: 'IND OE',
              badgeVariant: 'oe-indicador' as const,
              codigo: ind.codigo,
              nombre: ind.nombre,
              unidad: ind.unidad,
              tipoValor: ind.tipoValor,
            }))

          const oeIndicadorGroup: LogicalFrameTreeItem = {
            id: `group-ind-oe-${oe.id}`,
            tipo: 'IND OE',
            badgeVariant: 'oe-indicador-group' as const,
            isGroup: true,
            nombre: '',
            children: oeIndicadores,
          }

          // 6. Resultados (Level 3, under OE)
          const rItems: LogicalFrameTreeItem[] = localResultados
            .filter(r => r.objetivoEspecifico === oeLabel)
            .map(r => {
              const rLabel = `${r.codigo} - ${r.nombre}`

              // 7. Indicadores de Resultados (Level 4, under R)
              const rIndicadores: LogicalFrameTreeItem[] = localIndicadores
                .filter(ind => ind.tipo === 'Indicador de Resultado' && ind.resultado === rLabel)
                .map(ind => ({
                  id: `ind-r-${ind.id}`,
                  tipo: 'IND R',
                  badgeVariant: 'r-indicador' as const,
                  codigo: ind.codigo,
                  nombre: ind.nombre,
                  unidad: ind.unidad,
                  tipoValor: ind.tipoValor,
                }))

              const rIndicadorGroup: LogicalFrameTreeItem = {
                id: `group-ind-r-${r.id}`,
                tipo: 'IND R',
                badgeVariant: 'r-indicador-group' as const,
                isGroup: true,
                nombre: '',
                children: rIndicadores,
              }

              // 8. Actividades (Level 4, under R)
              const actItems: LogicalFrameTreeItem[] = localActividades
                .filter(a => a.resultado === rLabel)
                .map(a => {
                  // 9. Subactividades (Level 5, under Act)
                  const subActChildren: LogicalFrameTreeItem[] = localSubactividades
                    .filter(sa => sa.actividad === a.nombre)
                    .map(sa => ({
                      id: `subact-${sa.id}`,
                      tipo: 'SUBACT',
                      badgeVariant: 'subact' as const,
                      codigo: sa.codigoSubactividad,
                      nombre: sa.nombre,
                      unidad: sa.unidad,
                      tipoValor: sa.tipoValor,
                    }))

                  return {
                    id: `act-${a.id}`,
                    tipo: 'ACT',
                    badgeVariant: 'act' as const,
                    codigo: a.codigoActividad,
                    nombre: a.nombre,
                    unidad: a.unidad,
                    tipoValor: a.tipoValor,
                    children: [
                      {
                        id: `group-subact-act-${a.id}`,
                        tipo: 'SUBACT',
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
                tipo: 'R',
                badgeVariant: 'result' as const,
                codigo: r.codigo,
                nombre: r.nombre,
                children: [
                  rIndicadorGroup,
                  {
                    id: `group-act-r-${r.id}`,
                    tipo: 'ACT',
                    badgeVariant: 'act-group' as const,
                    isGroup: true,
                    nombre: '',
                    children: actItems,
                  }
                ],
              } as LogicalFrameTreeItem
            })

          return {
            id: `oe-${oe.id}`,
            tipo: 'OE',
            badgeVariant: 'oe' as const,
            codigo: oe.codigo,
            nombre: oe.nombre,
            children: [
              oeIndicadorGroup,
              {
                id: `group-r-oe-${oe.id}`,
                tipo: 'R',
                badgeVariant: 'result-group' as const,
                isGroup: true,
                nombre: '',
                children: rItems,
              }
            ],
          } as LogicalFrameTreeItem
        })

      return {
        id: `og-${og.id}`,
        tipo: 'OG',
        badgeVariant: 'og' as const,
        codigo: og.codigo,
        nombre: og.nombre,
        children: [
          ogIndicadorGroup,
          {
            id: `group-oe-og-${og.id}`,
            tipo: 'OE',
            badgeVariant: 'oe-group' as const,
            isGroup: true,
            nombre: '',
            children: oeItems,
          }
        ],
      } as LogicalFrameTreeItem
    })

    return [
      spIndicadorGroup,
      {
        id: 'group-og',
        tipo: 'OG',
        badgeVariant: 'og-group' as const,
        isGroup: true,
        nombre: '',
        children: ogItems,
      }
    ]
  }, [isFiltered, subprojectFilter, localObjGeneral, localObjEspecifico, localResultados, localActividades, localSubactividades, localIndicadores])

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
    if (tipo === 'OG') return 'Nuevo OG'
    if (tipo === 'OE') return 'Nuevo OE'
    if (tipo === 'R') return 'Nuevo R'
    if (tipo === 'ACT') return 'Nueva ACT'
    if (tipo === 'SUBACT') return 'Nueva SUBACT'
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
          <div className={styles.td} style={{ flex: 1, minWidth: 0 }}>
            {item.codigo ? `${item.codigo} - ` : ''} {item.nombre}
          </div>
          <div className={styles.td} style={{ width: '150px' }}>
            {item.unidad || ''}
          </div>
          <div className={styles.td} style={{ width: '150px' }}>
            {item.tipoValor || ''}
          </div>
          <div className={styles.td} style={{ width: '180px', textAlign: 'right' }}>
            <div className={styles.actions}>
              <Eye 
                size={18} 
                className={styles.actionIcon} 
                onClick={() => handleViewDetails(item)} 
              />
              
              <div className={styles.menuWrapper}>
                <MoreHorizontal 
                  size={18} 
                  className={styles.actionIcon} 
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }} 
                />
                
                {openMenuId === item.id && (
                  <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
                    {item.isGroup ? (
                      <button 
                        className={styles.menuItem} 
                        onClick={() => {
                          handleClickNew(item.tipo, item)
                          setOpenMenuId(null)
                        }}
                      >
                        <Plus size={14} /> {getNewButtonLabel(item.tipo)}
                      </button>
                    ) : (
                      <>
                        {item.id.includes('ind-') && (
                          <button 
                            className={styles.menuItem} 
                            onClick={() => {
                              const numericId = Number(item.id.split('-').pop())
                              const indicator = localIndicadores.find(i => i.id === numericId)
                              if (indicator) {
                                setFormulaIndicator(indicator)
                                setTimeout(() => {
                                  if (formulaRef.current) {
                                    const formula = indicator.formula || '='
                                    const html = formula.replace(/\[(.*?)\]/g, (_, code) => {
                                      return `<span contenteditable="false" class="${styles.formulaTokenBadge}" data-code="${code}">${code}<span class="${styles.tokenRemove}" style="cursor: pointer; margin-left: 6px; font-weight: bold;">×</span></span>`
                                    })
                                    formulaRef.current.innerHTML = html

                                    // Add click listeners to initial badges
                                    formulaRef.current.querySelectorAll(`.${styles.tokenRemove}`).forEach(btn => {
                                      (btn as HTMLElement).addEventListener('click', (e: MouseEvent) => {
                                        e.stopPropagation()
                                          ; (btn as HTMLElement).parentElement?.remove()
                                      })
                                    })
                                  }
                                }, 0)
                                setIsFormulaModalOpen(true)
                              }
                              setOpenMenuId(null)
                            }}
                          >
                            <Calculator size={14} /> Fórmulas
                          </button>
                        )}
                        <button 
                          className={styles.menuItem} 
                          onClick={() => {
                            if (item.tipo === 'OG') handleEditOG(item)
                            else if (item.tipo === 'OE') handleEditOE(item)
                            else if (item.tipo === 'R') handleEditR(item)
                            else if (item.id.startsWith('act-')) handleEditAct(item)
                            else if (item.id.startsWith('subact-')) handleEditSubact(item)
                            else if (item.id.startsWith('ind-')) handleEditIndicator(item)
                            setOpenMenuId(null)
                          }}
                        >
                          <Pencil size={14} /> Editar
                        </button>
                        <div className={styles.menuDivider} />
                        <button 
                          className={styles.menuItem} 
                          data-variant="danger"
                          onClick={() => {
                            handleDelete(item)
                            setOpenMenuId(null)
                          }}
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
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
    <div className={isEmbedded ? styles.embeddedRoot : styles.root}>
      {!isEmbedded && (
        <>
          <header style={{ padding: '16px 16px 0' }}>
            <PageHeader
              title="Marco Lógico"
              subtitle="Gestión de Objetivos, Resultados, Actividades y Subactividades"
            />
          </header>

          <div style={{ padding: '0 16px 12px' }}>
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
          </div>
        </>
      )}

      <div className={styles.tableContainer} style={{ height: isEmbedded ? '100%' : undefined, overflowY: 'auto' }}>
        <div className={styles.treeTable}>
          <div style={{ display: 'flex', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 10 }}>
            <div className={styles.th} style={{ width: '48px', padding: '16px 0 16px 24px' }}>
              <Checkbox
                checked={headerChecked}
                onChange={handleSelectAll}
              />
            </div>
            <div className={styles.th} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={14} /> TIPO <Pin size={14} />
              </div>
            </div>
            <div className={styles.th} style={{ width: '150px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={14} /> UNIDAD <Pin size={14} />
              </div>
            </div>
            <div className={styles.th} style={{ width: '150px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={14} /> TIPO DE DATO <Pin size={14} />
              </div>
            </div>
            <div className={styles.th} style={{ width: '180px', textAlign: 'right', paddingRight: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                ACCIONES <Pin size={14} />
              </div>
            </div>
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
              label="Tipo de Dato"
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
              label="Tipo de Dato"
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
        title={selectedSheetItem ? `${selectedSheetItem.codigo ? selectedSheetItem.codigo + ' - ' : ''}${selectedSheetItem.nombre || selectedSheetItem.tipo}` : ''}
        subtitle={selectedSheetItem?.tipo}
        onEdit={selectedSheetItem?.isGroup ? undefined : handleEditFromSheet}
      >
        {renderSheetContent()}
      </SideSheet>

      {/* Modal de Indicadores */}
      <Modal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        title={editingIndicator ? 'Editar Indicador' : 'Nuevo Indicador'}
        subtitle="Ingresa todos los detalles técnicos y de jerarquía"
        onSave={handleSaveIndicator}
        isSaveDisabled={!indicatorForm.tipo || !indicatorForm.codigo || !indicatorForm.nombre || !indicatorForm.subproyecto}
        width="1420px"
      >
        <div className={styles.modalTwoColumns}>
          {/* Columna Izquierda: Datos Técnicos */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Datos Técnicos</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Tipo de Indicador"
                options={[
                  'Indicador de Subproyecto',
                  'Indicador de Objetivo General',
                  'Indicador de Objetivo Específico',
                  'Indicador de Resultado'
                ]}
                value={indicatorForm.tipo}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipo: val as any, objetivoGeneral: '', objetivoEspecifico: '', resultado: '' })}
                width="600px"
              />
              <Input
                label="Código"
                value={indicatorForm.codigo || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, codigo: val })}
                width="600px"
              />
              <Input
                label="Nombre"
                value={indicatorForm.nombre || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, nombre: val })}
                width="600px"
              />
              <FilterSelect
                label="Unidad"
                options={unidadesData.map(u => u.nombre)}
                value={indicatorForm.unidad}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, unidad: val })}
                width="600px"
              />
              <FilterSelect
                label="Tipo de Dato"
                options={tiposDeValorData.map(t => t.nombre)}
                value={indicatorForm.tipoValor}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipoValor: val })}
                width="600px"
              />
            </div>
          </div>

          {/* Columna Derecha: Jerarquía */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Jerarquía y Contexto</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Subproyecto"
                options={subprojectModalOptions}
                value={indicatorForm.subproyecto ? `${indicatorForm.subproyecto} - ${planesAnualesData.find(p => p.codigosubproyecto === indicatorForm.subproyecto)?.subproyecto || ''}` : ''}
                onChange={(val) => {
                  const code = val.split(' - ')[0]
                  setIndicatorForm({ ...indicatorForm, subproyecto: code })
                }}
                width="600px"
                readOnly
              />

              {(indicatorForm.tipo === 'Indicador de Objetivo General' ||
                indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo General"
                    options={ogOptionsForModal}
                    value={indicatorForm.objetivoGeneral}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoGeneral: val, objetivoEspecifico: '', resultado: '' })}
                    width="600px"
                  />
                )}

              {(indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo Específico"
                    options={oeOptionsForModal}
                    value={indicatorForm.objetivoEspecifico}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoEspecifico: val, resultado: '' })}
                    width="600px"
                  />
                )}

              {indicatorForm.tipo === 'Indicador de Resultado' && (
                <FilterSelect
                  label="Resultado"
                  options={resultadoOptionsForModal}
                  value={indicatorForm.resultado}
                  onChange={(val) => setIndicatorForm({ ...indicatorForm, resultado: val })}
                  width="600px"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
      {/* Modal de Indicadores */}
      <Modal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        title={editingIndicator ? 'Editar Indicador' : 'Nuevo Indicador'}
        subtitle="Ingresa todos los detalles técnicos y de jerarquía"
        onSave={handleSaveIndicator}
        isSaveDisabled={!indicatorForm.tipo || !indicatorForm.codigo || !indicatorForm.nombre || !indicatorForm.subproyecto}
        width="1420px"
      >
        <div className={styles.modalTwoColumns}>
          {/* Columna Izquierda: Datos Técnicos */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Datos Técnicos</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Tipo de Indicador"
                options={[
                  'Indicador de Subproyecto',
                  'Indicador de Objetivo General',
                  'Indicador de Objetivo Específico',
                  'Indicador de Resultado'
                ]}
                value={indicatorForm.tipo}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipo: val as any, objetivoGeneral: '', objetivoEspecifico: '', resultado: '' })}
                width="600px"
              />
              <Input
                label="Código"
                value={indicatorForm.codigo || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, codigo: val })}
                width="600px"
              />
              <Input
                label="Nombre"
                value={indicatorForm.nombre || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, nombre: val })}
                width="600px"
              />
              <FilterSelect
                label="Unidad"
                options={unidadesData.map(u => u.nombre)}
                value={indicatorForm.unidad}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, unidad: val })}
                width="600px"
              />
              <FilterSelect
                label="Tipo de Dato"
                options={tiposDeValorData.map(t => t.nombre)}
                value={indicatorForm.tipoValor}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipoValor: val })}
                width="600px"
              />
            </div>
          </div>

          {/* Columna Derecha: Jerarquía */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Jerarquía y Contexto</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Subproyecto"
                options={subprojectModalOptions}
                value={indicatorForm.subproyecto ? `${indicatorForm.subproyecto} - ${planesAnualesData.find(p => p.codigosubproyecto === indicatorForm.subproyecto)?.subproyecto || ''}` : ''}
                onChange={(val) => {
                  const code = val.split(' - ')[0]
                  setIndicatorForm({ ...indicatorForm, subproyecto: code })
                }}
                width="600px"
                readOnly
              />

              {(indicatorForm.tipo === 'Indicador de Objetivo General' ||
                indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo General"
                    options={ogOptionsForModal}
                    value={indicatorForm.objetivoGeneral}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoGeneral: val, objetivoEspecifico: '', resultado: '' })}
                    width="600px"
                  />
                )}

              {(indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo Específico"
                    options={oeOptionsForModal}
                    value={indicatorForm.objetivoEspecifico}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoEspecifico: val, resultado: '' })}
                    width="600px"
                  />
                )}

              {indicatorForm.tipo === 'Indicador de Resultado' && (
                <FilterSelect
                  label="Resultado"
                  options={resultadoOptionsForModal}
                  value={indicatorForm.resultado}
                  onChange={(val) => setIndicatorForm({ ...indicatorForm, resultado: val })}
                  width="600px"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>
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
      
      {/* Modal de Fórmulas */}
      <Modal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title={`Configurar Fórmula: ${formulaIndicator?.codigo || ''}`}
        subtitle="Construye tu fórmula personalizada arrastrando indicadores y escribiendo operadores"
        onSave={handleSaveFormula}
        width="900px"
      >
        <div className={styles.formulaModalContent}>
          <div className={styles.indicatorSelectorTop}>
            <FilterSelect
              label="Agregar Indicador"
              value={(() => {
                if (!formulaRef.current) return [];
                return Array.from(formulaRef.current.querySelectorAll(`.${styles.formulaTokenBadge}`))
                  .map(b => {
                    const code = (b as HTMLElement).dataset.code;
                    const match = allIndicatorsForFormula.find(i => (i.original as any).codigo === code);
                    return match?.label || '';
                  }).filter(Boolean);
              })()}
              onChange={handleFormulaIndicatorsChange}
              options={allIndicatorsForFormula.map(i => i.label)}
              width="100%"
              isMulti={true}
            />
          </div>

          <div className={styles.formulaEditorBox}>
            <div
              ref={formulaRef}
              className={styles.formulaEditable}
              contentEditable
              onBlur={saveSelection}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onKeyDown={handleFormulaKeyDown}
            />
          </div>

          <p className={styles.formulaHint}>
            Puedes escribir operadores (+, -, *, /) y números directamente entre los indicadores.
          </p>
        </div>
      </Modal>
    </div>
  )
}
