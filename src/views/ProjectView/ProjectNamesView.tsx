import { useState, useMemo } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { Pagination } from '../../components/Pagination/Pagination'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { projectNamesData } from '../../data/mockData'
import type { ProjectName } from '../../data/types'
import styles from './GapsView.module.css' // Reusing common table styles

export function ProjectNamesView() {
  const [projectNames, setProjectNames] = useState<ProjectName[]>(projectNamesData)
  const [selectedProjectName, setSelectedProjectName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectName | null>(null)
  const [formData, setFormData] = useState({ codigo: '', nombre: '' })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectName | null>(null)

  const filteredProjectNames = useMemo(() => {
    if (!selectedProjectName) return projectNames
    return projectNames.filter(p => p.nombre === selectedProjectName)
  }, [projectNames, selectedProjectName])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.nombre.trim() !== ''
    if (!isFilled) return true

    if (editingProject) {
      return formData.codigo === editingProject.codigo && formData.nombre === editingProject.nombre
    }
    return false
  }, [formData, editingProject])

  const handleNew = () => {
    setEditingProject(null)
    const nextCode = (projectNames.length + 1).toString()
    setFormData({ codigo: nextCode, nombre: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: ProjectName) => {
    setEditingProject(item)
    setFormData({ codigo: item.codigo, nombre: item.nombre })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingProject) {
      setProjectNames(projectNames.map(p => p.id === editingProject.id ? { ...p, ...formData } : p))
    } else {
      const newProject: ProjectName = {
        id: Math.max(0, ...projectNames.map(p => p.id)) + 1,
        ...formData
      }
      setProjectNames([...projectNames, newProject])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: ProjectName) => {
    setProjectToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjectNames(projectNames.filter(p => p.id !== projectToDelete.id))
    }
    setShowDeleteAlert(false)
    setProjectToDelete(null)
  }

  const handleFilterChange = (value: string) => {
    setSelectedProjectName(value)
  }

  const columns: Column<ProjectName>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'actions', header: 'Acciones' },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Nombres de Proyectos</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Nombres de Proyectos del Marco Programático
          </p>
        </div>
      </header>

      <Toolbar onNew={handleNew} onExport={() => {}} onRefresh={() => {}} onFilterToggle={() => {}} onColumnToggle={() => {}}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterSelect 
            label="Nombre de Proyecto"
            options={projectNames.map(p => p.nombre)}
            value={selectedProjectName}
            onChange={handleFilterChange}
            width="100%"
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          data={filteredProjectNames} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>

      <Pagination total={filteredProjectNames.length} range={`1-${filteredProjectNames.length}`} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Editar nombre de proyecto' : 'Crear nuevo nombre de proyecto'}
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
