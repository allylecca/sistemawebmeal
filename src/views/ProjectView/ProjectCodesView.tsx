import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { projectCodesData, strategicLinesData, gapsData, programsData } from '../../data/mockData'
import type { ProjectCode } from '../../data/types'
import styles from './GapsView.module.css'

export function ProjectCodesView() {
  const [typologyFilter, setTypologyFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>(projectCodesData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<ProjectCode | null>(null)
  const [formData, setFormData] = useState({ 
    codigo: '', 
    nombre: '', 
    tipologia: '', 
    programa: '',
    linea: '',
    gap: ''
  })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<ProjectCode | null>(null)

  const COUNTRY_CODES: Record<string, string> = {
    'Perú': '03', 'Bolivia': '01', 'Colombia': '02', 'Ecuador': '04', 
    'España': '34', 'Portugal': '35', 'Etiopía': '25', 'Malí': '22',
    'Costa Rica': '50', 'El Salvador': '53', 'Honduras': '54', 'Nicaragua': '55', 
    'Guatemala': '56', 'México': '52', 'Mozambique': '258', 'Níger': '227'
  }

  // Auto-generate Tipología y Código
  useEffect(() => {
    let newCode = formData.codigo

    const selectedProgram = programsData.find(p => p.nombre === formData.programa)
    const firstCountry = selectedProgram?.pais ? selectedProgram.pais.split(',')[0].trim() : ''

    if (firstCountry && COUNTRY_CODES[firstCountry] && !editingCode) {
      const countryCode = COUNTRY_CODES[firstCountry]
      const year = new Date().getFullYear().toString().slice(-2)
      
      const countInProgram = projectCodes.filter(p => p.programa === formData.programa).length + 1
      const correlative = countInProgram.toString().padStart(2, '0')
      
      newCode = `${countryCode}${year}${correlative}`
    }

    const newTypology = formData.linea.startsWith('OPO') && newCode.endsWith('01') ? 'Core' : 'Habilitante'

    setFormData(prev => {
      if (prev.codigo === newCode && prev.tipologia === newTypology) return prev
      return { ...prev, tipologia: newTypology, codigo: newCode }
    })
  }, [formData.linea, formData.programa, editingCode, projectCodes])

  const availableLines = useMemo(() => {
    if (!formData.gap) return strategicLinesData.map(l => `${l.codigo} ${l.nombre}`)
    return strategicLinesData.filter(l => l.gap === formData.gap).map(l => `${l.codigo} ${l.nombre}`)
  }, [formData.gap])

  const handleProgramChange = (programName: string) => {
    setFormData(prev => ({ ...prev, programa: programName }))
  }



  const handleLineChange = (lineValue: string) => {
    if (!lineValue) {
      setFormData(prev => ({ ...prev, linea: '', gap: '' }))
      return
    }

    const codeCandidate = lineValue.split(' ')[0]
    const line = strategicLinesData.find(l => l.codigo === codeCandidate) || strategicLinesData.find(l => l.nombre === lineValue)
    if (line) {
      setFormData(prev => ({ ...prev, linea: lineValue, gap: line.gap }))
    } else {
      setFormData(prev => ({ ...prev, linea: lineValue }))
    }
  }

  const filteredData = useMemo(() => {
    return projectCodes.filter(item => {
      const matchTypology = !typologyFilter || item.tipologia === typologyFilter
      const matchProgram = !programFilter || item.programa === programFilter
      return matchTypology && matchProgram
    })
  }, [typologyFilter, programFilter, projectCodes])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.nombre.trim() !== '' && formData.tipologia.trim() !== '' && formData.programa.trim() !== '' && formData.linea.trim() !== ''
    if (!isFilled) return true

    if (editingCode) {
      return (
        formData.codigo === editingCode.codigo &&
        formData.nombre === editingCode.nombre &&
        formData.tipologia === editingCode.tipologia &&
        formData.programa === editingCode.programa &&
        formData.linea === editingCode.linea
      )
    }
    return false
  }, [formData, editingCode])

  const handleNew = () => {
    setEditingCode(null)
    setFormData({ codigo: '', nombre: '', tipologia: '', programa: '', linea: '', gap: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProjectCode) => {
    setEditingCode(item)
    const line = strategicLinesData.find(l => l.nombre === item.linea)
    setFormData({ 
      codigo: item.codigo, 
      nombre: item.nombre, 
      tipologia: item.tipologia, 
      programa: item.programa,
      linea: item.linea,
      gap: line ? line.gap : ''
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingCode) {
      setProjectCodes(projectCodes.map(p => p.id === editingCode.id ? { ...p, ...formData } : p))
    } else {
      const newCode: ProjectCode = {
        id: Math.max(0, ...projectCodes.map(p => p.id)) + 1,
        ...formData
      }
      setProjectCodes([...projectCodes, newCode])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: ProjectCode) => {
    setCodeToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (codeToDelete) {
      setProjectCodes(projectCodes.filter(p => p.id !== codeToDelete.id))
    }
    setShowDeleteAlert(false)
    setCodeToDelete(null)
  }

  const columns: Column<ProjectCode>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipologia', header: 'Tipología' },
    { key: 'programa', header: 'Programa' },
    { key: 'linea', header: 'Línea Estratégica' },
    { key: 'actions', header: 'Acciones' },
  ]

  const uniqueTypologies = useMemo(() => Array.from(new Set(projectCodes.map(p => p.tipologia))), [projectCodes])
  const uniquePrograms = useMemo(() => Array.from(new Set(programsData.map(p => p.nombre))), [])

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Códigos de Proyectos</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Códigos de Proyectos del Marco Programático
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => {
          setTypologyFilter('')
          setProgramFilter('')
        }} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Tipología" 
            options={uniqueTypologies}
            value={typologyFilter}
            onChange={setTypologyFilter}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Programa" 
            options={uniquePrograms}
            value={programFilter}
            onChange={setProgramFilter}
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          data={filteredData} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCode ? 'Editar código de proyecto' : 'Crear nuevo código de proyecto'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FilterSelect 
            label="GAP"
            options={gapsData.map(g => g.nombre)}
            value={formData.gap}
            onChange={(val) => setFormData({ ...formData, gap: val })}
          />
          <FilterSelect 
            label="Línea Estratégica"
            options={availableLines}
            value={formData.linea}
            onChange={handleLineChange}
          />
          <FilterSelect 
            label="Programa"
            options={uniquePrograms}
            value={formData.programa}
            onChange={handleProgramChange}
          />
          <Input 
            label="Código"
            value={formData.codigo}
            onChange={(val) => setFormData({ ...formData, codigo: val })}
          />
          <Input 
            label="Nombre"
            value={formData.nombre}
            onChange={(val) => setFormData({ ...formData, nombre: val })}
          />
          <Input 
            label="Tipología de Proyecto"
            value={formData.tipologia}
            onChange={() => {}}
            disabled
          />
        </div>
      </Modal>

      {/* Modal de confirmación (Éxito) */}
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

      {/* Modal de peligro (Eliminar) */}
      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        variant="danger"
        title="¿Estás seguro de eliminar?"
        description="Esta acción es irreversible"
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
