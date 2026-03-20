import { useState, useMemo } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { gapsData } from '../../data/mockData'
import type { Gap } from '../../data/types'
import styles from './GapsView.module.css'

export function GapsView() {
  const [filter, setFilter] = useState('')
  const [gaps, setGaps] = useState<Gap[]>(gapsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGap, setEditingGap] = useState<Gap | null>(null)
  const [formData, setFormData] = useState({ codigo: '', nombre: '' })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [gapToDelete, setGapToDelete] = useState<Gap | null>(null)

  const filteredData = useMemo(() => {
    if (!filter) return gaps
    return gaps.filter(item => item.nombre === filter)
  }, [filter, gaps])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.nombre.trim() !== ''
    if (!isFilled) return true

    if (editingGap) {
      return formData.codigo === editingGap.codigo && formData.nombre === editingGap.nombre
    }
    return false
  }, [formData, editingGap])

  const handleNew = () => {
    setEditingGap(null)
    setFormData({ codigo: '', nombre: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Gap) => {
    setEditingGap(item)
    setFormData({ codigo: item.codigo, nombre: item.nombre })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingGap) {
      setGaps(gaps.map(g => g.id === editingGap.id ? { ...g, ...formData } : g))
    } else {
      const newGap: Gap = {
        id: Math.max(0, ...gaps.map(g => g.id)) + 1,
        ...formData
      }
      setGaps([...gaps, newGap])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: Gap) => {
    setGapToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (gapToDelete) {
      setGaps(gaps.filter(g => g.id !== gapToDelete.id))
    }
    setShowDeleteAlert(false)
    setGapToDelete(null)
  }

  const columns: Column<Gap>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'actions', header: 'Acciones' },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>GAPS</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de GAPS del Marco Programático
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => setFilter('')} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Nombre de GAP" 
            options={gapsData.map(g => g.nombre)}
            value={filter}
            onChange={setFilter}
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
        title={editingGap ? 'Editar GAP' : 'Crear nuevo GAP'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
