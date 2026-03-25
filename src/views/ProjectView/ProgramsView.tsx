import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { programsData } from '../../data/mockData'
import type { Program } from '../../data/types'
import styles from './GapsView.module.css'

const REGIONS_MAP: Record<string, string> = {
  'Etiopía': 'Africa',
  'Malí': 'Africa',
  'Mozambique': 'Africa',
  'Níger': 'Africa',
  'Costa Rica': 'Centroamerica',
  'El Salvador': 'Centroamerica',
  'Guatemala': 'Centroamerica',
  'Honduras': 'Centroamerica',
  'México': 'Centroamerica',
  'Nicaragua': 'Centroamerica',
  'España': 'Europa',
  'Portugal': 'Europa',
  'Bolivia': 'Sudamerica',
  'Colombia': 'Sudamerica',
  'Ecuador': 'Sudamerica',
  'Perú': 'Sudamerica'
}

const allCountries = Object.keys(REGIONS_MAP)
const uniqueRegions = Array.from(new Set(Object.values(REGIONS_MAP)))

export function ProgramsView() {
  const [countryFilter, setCountryFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [programs, setPrograms] = useState<Program[]>(programsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  
  // pais ahora es un array de strings para soportar selección múltiple
  const [formData, setFormData] = useState<{ nombre: string; pais: string[]; region: string }>({ nombre: '', pais: [], region: '' })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null)

  useEffect(() => {
    if (formData.pais.length === 0) {
      setFormData(prev => ({ ...prev, region: '' }))
      return
    }

    const regions = formData.pais.map(country => REGIONS_MAP[country] || '')
    const uniqueSelectedRegions = Array.from(new Set(regions.filter(Boolean)))
    
    setFormData(prev => ({ ...prev, region: uniqueSelectedRegions.join(', ') }))
  }, [formData.pais])

  const filteredData = useMemo(() => {
    return programs.filter(item => {
      const matchCountry = !countryFilter || (item.pais && item.pais.split(', ').includes(countryFilter))
      const matchRegion = !regionFilter || (item.region && item.region.split(', ').some(r => r.trim() === regionFilter))
      return matchCountry && matchRegion
    })
  }, [countryFilter, regionFilter, programs])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.nombre.trim() !== '' && formData.pais.length > 0 && formData.region.trim() !== ''
    if (!isFilled) return true

    if (editingProgram) {
      const editingPaisArray = editingProgram.pais ? editingProgram.pais.split(', ').map(p => p.trim()) : []
      const samePais = formData.pais.length === editingPaisArray.length && formData.pais.every(p => editingPaisArray.includes(p))
      return (
        formData.nombre === editingProgram.nombre &&
        samePais &&
        formData.region === editingProgram.region
      )
    }
    return false
  }, [formData, editingProgram])

  const handleNew = () => {
    setEditingProgram(null)
    setFormData({ nombre: '', pais: [], region: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Program) => {
    setEditingProgram(item)
    setFormData({ 
      nombre: item.nombre, 
      pais: item.pais ? item.pais.split(', ').map(p => p.trim()) : [], 
      region: item.region 
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const programDataToSave = {
      ...formData,
      pais: formData.pais.join(', ')
    }

    if (editingProgram) {
      setPrograms(programs.map(p => p.id === editingProgram.id ? { ...p, ...programDataToSave } : p))
    } else {
      const newProgram: Program = {
        id: Math.max(0, ...programs.map(p => p.id)) + 1,
        ...programDataToSave
      }
      setPrograms([...programs, newProgram])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: Program) => {
    setProgramToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (programToDelete) {
      setPrograms(programs.filter(p => p.id !== programToDelete.id))
    }
    setShowDeleteAlert(false)
    setProgramToDelete(null)
  }

  const columns: Column<Program>[] = [
    { key: 'checkbox', header: '' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'pais', header: 'País' },
    { key: 'region', header: 'Región' },
    { key: 'actions', header: 'Acciones' },
  ]

  const uniqueCountries = useMemo(() => {
    const fromPrograms = programsData.flatMap(p => p.pais ? p.pais.split(', ').map(s => s.trim()) : [])
    return Array.from(new Set([...allCountries, ...fromPrograms]))
  }, [])

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Programas</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Programas Institucionales
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => {
          setCountryFilter('')
          setRegionFilter('')
        }} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="País" 
            options={uniqueCountries}
            value={countryFilter}
            onChange={setCountryFilter}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Región" 
            options={uniqueRegions}
            value={regionFilter}
            onChange={setRegionFilter}
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
        title={editingProgram ? 'Editar programa' : 'Crear nuevo programa'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input 
            label="Nombre"
            value={formData.nombre}
            onChange={(val) => setFormData({ ...formData, nombre: val })}
          />
          <FilterSelect 
            label="País"
            options={uniqueCountries}
            value={formData.pais}
            onChange={(val) => setFormData({ ...formData, pais: val })}
            isMulti
          />
          <Input 
            label="Región"
            value={formData.region}
            onChange={(val) => setFormData({ ...formData, region: val })}
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
