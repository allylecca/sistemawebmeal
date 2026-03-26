import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Input } from '../../../components/Input/Input'
import { Modal } from '../../../components/Modal/Modal'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { strategicLinesData, gapsData } from '../../../data/mockData'
import type { StrategicLine } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import styles from './GapsView.module.css'

export function StrategicLinesView() {
  const [filter, setFilter] = useState('')
  const [strategicLines, setStrategicLines] = useState<StrategicLine[]>(strategicLinesData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLine, setEditingLine] = useState<StrategicLine | null>(null)
  const [formData, setFormData] = useState({ gapName: '', nombre: '', codigo: '' })

  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [lineToDelete, setLineToDelete] = useState<StrategicLine | null>(null)

  const filteredData = useMemo(() => {
    if (!filter) return strategicLines
    return strategicLines.filter(item => item.gap === filter)
  }, [filter, strategicLines])

  // Lógica de generación de código automático
  useEffect(() => {
    if (!formData.gapName) {
      setFormData(prev => ({ ...prev, codigo: '' }))
      return
    }

    const selectedGap = gapsData.find(g => g.nombre === formData.gapName)
    if (!selectedGap) return

    if (editingLine && formData.gapName === editingLine.gap) {
      setFormData(prev => ({ ...prev, codigo: editingLine.codigo }))
      return
    }

    const linesForGap = strategicLines.filter(l => l.gap === formData.gapName)
    const nextNumber = linesForGap.length + 1
    const newCode = `${selectedGap.codigo}.${nextNumber}.0`
    setFormData(prev => ({ ...prev, codigo: newCode }))
  }, [formData.gapName, strategicLines, editingLine])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.gapName.trim() !== '' && formData.nombre.trim() !== ''
    if (!isFilled) return true

    if (editingLine) {
      return formData.gapName === editingLine.gap && formData.nombre === editingLine.nombre
    }
    return false
  }, [formData, editingLine])

  const handleNew = () => {
    setEditingLine(null)
    setFormData({ gapName: '', nombre: '', codigo: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: StrategicLine) => {
    setEditingLine(item)
    setFormData({ gapName: item.gap, nombre: item.nombre, codigo: item.codigo })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingLine) {
      setStrategicLines(strategicLines.map(l => l.id === editingLine.id ? { ...l, gap: formData.gapName, nombre: formData.nombre, codigo: formData.codigo } : l))
    } else {
      const newLine: StrategicLine = {
        id: Math.max(0, ...strategicLines.map(l => l.id)) + 1,
        codigo: formData.codigo,
        nombre: formData.nombre,
        gap: formData.gapName
      }
      setStrategicLines([...strategicLines, newLine])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: StrategicLine) => {
    setLineToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (lineToDelete) {
      setStrategicLines(strategicLines.filter(l => l.id !== lineToDelete.id))
    }
    setShowDeleteAlert(false)
    setLineToDelete(null)
  }

  const columns: Column<StrategicLine>[] = [
    { key: 'checkbox', header: '' },
    { key: 'gap', header: 'GAP' },
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'actions', header: 'Acciones' },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Líneas Estratégicas"
          subtitle="Gestión de Líneas Estratégicas del Marco Programático"
        />
      </header>

      <Toolbar
        onNew={handleNew}
        onExport={() => { }}
        onRefresh={() => setFilter('')}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect
            label="GAP"
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
        title={editingLine ? 'Editar línea estratégica' : 'Crear nueva línea estratégica'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FilterSelect
            label="GAP"
            options={gapsData.map(g => g.nombre)}
            value={formData.gapName}
            onChange={(val) => setFormData({ ...formData, gapName: val })}
          />
          <Input
            label="Código de Línea Estratégica"
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
