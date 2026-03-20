import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { projectCodesData, strategicLinesData, gapsData, projectNamesData } from '../../data/mockData'
import type { ProjectCode } from '../../data/types'
import styles from './GapsView.module.css'

export function ProjectCodesView() {
  const [typologyFilter, setTypologyFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>(projectCodesData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<ProjectCode | null>(null)
  const [formData, setFormData] = useState({ 
    codigo: '', 
    nombre: '', 
    tipologia: '', 
    pais: '',
    ubicacion: '', 
    linea: '',
    gap: '',
    region: ''
  })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<ProjectCode | null>(null)

  const REGIONS_MAP: Record<string, string> = {
    'Etiopía': 'Africa', 'Malí': 'Africa', 'Mozambique': 'Africa', 'Níger': 'Africa',
    'Costa Rica': 'Centroamerica', 'El Salvador': 'Centroamerica', 'Guatemala': 'Centroamerica', 
    'Honduras': 'Centroamerica', 'México': 'Centroamerica', 'Nicaragua': 'Centroamerica',
    'España': 'Europa', 'Portugal': 'Europa',
    'Bolivia': 'Sudamerica', 'Colombia': 'Sudamerica', 'Ecuador': 'Sudamerica', 'Perú': 'Sudamerica'
  }

  const COUNTRY_CODES: Record<string, string> = {
    'Perú': '03', 'Bolivia': '01', 'Colombia': '02', 'Ecuador': '04', // Example codes
    'España': '34', 'Portugal': '35', 'Etiopía': '25', 'Malí': '22',
    'Costa Rica': '50', 'El Salvador': '53'
  }

  // Auto-generate Tipología y Código
  useEffect(() => {
    let newCode = formData.codigo

    // Generate Code logic: CountryCode + Year + Correlative
    if (formData.pais && COUNTRY_CODES[formData.pais] && !editingCode) {
      const countryCode = COUNTRY_CODES[formData.pais]
      const year = new Date().getFullYear().toString().slice(-2) // "26" para 2026
      
      // Contar proyectos en este país para el correlativo
      const countInCountry = projectCodes.filter(p => p.ubicacion.split(',')[0]?.trim() === formData.pais).length + 1
      const correlative = countInCountry.toString().padStart(2, '0') // "03"
      
      newCode = `${countryCode}${year}${correlative}`
    }

    const newTypology = formData.linea.startsWith('OPO') && newCode.endsWith('01') ? 'Core' : 'Habilitante'

    setFormData(prev => {
      if (prev.codigo === newCode && prev.tipologia === newTypology) return prev
      return { ...prev, tipologia: newTypology, codigo: newCode }
    })
  }, [formData.linea, formData.pais, editingCode, projectCodes])

  const availableLines = useMemo(() => {
    if (!formData.gap) return strategicLinesData.map(l => `${l.codigo} ${l.nombre}`)
    return strategicLinesData.filter(l => l.gap === formData.gap).map(l => `${l.codigo} ${l.nombre}`)
  }, [formData.gap])

  const handleLocationChange = (country: string) => {
    const region = REGIONS_MAP[country] || ''
    const ubicacion = region ? `${country}, ${region}` : country
    setFormData(prev => ({ ...prev, pais: country, region, ubicacion }))
  }

  const handleProjectChange = (projectName: string) => {
    const normalizedName = projectName.trim()

    const matchByName = (candidate: string, selected: string) => {
      const base = candidate.replace(/\.\.\.$/, '').trim()
      return base !== '' && (selected.startsWith(base) || base.startsWith(selected))
    }

    const mappedProject = projectCodes.find(p => matchByName(p.nombre, normalizedName)) ||
      projectCodesData.find(p => matchByName(p.nombre, normalizedName))

    if (!mappedProject) {
      setFormData(prev => ({ ...prev, nombre: projectName }))
      return
    }

    const lineValue = mappedProject.linea
    const codeCandidate = lineValue.split(' ')[0]
    const line = strategicLinesData.find(l => l.codigo === codeCandidate)
    const gapValue = line ? line.gap : ''

    setFormData(prev => ({ ...prev, nombre: projectName, gap: gapValue, linea: lineValue }))
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
      const matchLocation = !locationFilter || item.ubicacion === locationFilter
      return matchTypology && matchLocation
    })
  }, [typologyFilter, locationFilter, projectCodes])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.nombre.trim() !== '' && formData.tipologia.trim() !== '' && formData.pais.trim() !== '' && formData.region.trim() !== '' && formData.linea.trim() !== ''
    if (!isFilled) return true

    if (editingCode) {
      return (
        formData.codigo === editingCode.codigo &&
        formData.nombre === editingCode.nombre &&
        formData.tipologia === editingCode.tipologia &&
        formData.ubicacion === editingCode.ubicacion &&
        formData.linea === editingCode.linea
      )
    }
    return false
  }, [formData, editingCode])

  const handleNew = () => {
    setEditingCode(null)
    setFormData({ codigo: '', nombre: '', tipologia: '', pais: '', ubicacion: '', linea: '', gap: '', region: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProjectCode) => {
    setEditingCode(item)
    const country = item.ubicacion.split(',')[0]?.trim() || ''
    const region = item.ubicacion.split(',')[1]?.trim() || REGIONS_MAP[country] || ''
    const line = strategicLinesData.find(l => l.nombre === item.linea)
    setFormData({ 
      codigo: item.codigo, 
      nombre: item.nombre, 
      tipologia: item.tipologia, 
      pais: country,
      ubicacion: item.ubicacion, 
      linea: item.linea,
      gap: line ? line.gap : '',
      region
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingCode) {
      setProjectCodes(projectCodes.map(p => p.id === editingCode.id ? { ...p, ...formData } : p))
    } else {
      const ubicacion = formData.region ? `${formData.pais}, ${formData.region}` : formData.pais
      const newCode: ProjectCode = {
        id: Math.max(0, ...projectCodes.map(p => p.id)) + 1,
        ...formData,
        ubicacion
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
    { key: 'ubicacion', header: 'Ubicación' },
    { key: 'linea', header: 'Línea Estratégica' },
    { key: 'actions', header: 'Acciones' },
  ]

  const uniqueTypologies = useMemo(() => Array.from(new Set(projectCodes.map(p => p.tipologia))), [projectCodes])
  const uniqueLocations = useMemo(() => Array.from(new Set(projectCodes.map(p => p.ubicacion))), [projectCodes])

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
          setLocationFilter('')
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
            label="Ubicación" 
            options={uniqueLocations}
            value={locationFilter}
            onChange={setLocationFilter}
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
            label="País"
            options={Object.keys(REGIONS_MAP)}
            value={formData.pais}
            onChange={handleLocationChange}
          />
          <Input 
            label="Región"
            value={formData.region}
            onChange={() => {}}
            disabled
          />
          <FilterSelect 
            label="Proyecto"
            options={projectNamesData.map(p => p.nombre)}
            value={formData.nombre}
            onChange={handleProjectChange}
          />
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
          <Input 
            label="Tipología de Proyecto"
            value={formData.tipologia}
            onChange={() => {}}
            disabled
          />
          <Input 
            label="Código"
            value={formData.codigo}
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
