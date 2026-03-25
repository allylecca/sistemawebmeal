import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { subprojectCodesData, projectNamesData, gapsData, strategicLinesData } from '../../data/mockData'
import type { SubprojectCode } from '../../data/types'
import styles from './GapsView.module.css'

export function SubprojectCodesView() {
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectCodes, setSubprojectCodes] = useState<SubprojectCode[]>(subprojectCodesData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<SubprojectCode | null>(null)
  const [formData, setFormData] = useState({ 
    codigo: '', 
    financiador: '', 
    nombre: '', 
    proyecto: '',
    gap: '',
    lineaEstrategica: ''
  })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<SubprojectCode | null>(null)

  const FINANCIERS = [
    '269041-AECID',
    '269022-PMA-PROGRAMA MUNDIAL DE ALIMENTOS'
  ]

  // Auto-generate código basado en financiador
  useEffect(() => {
    if (formData.financiador && !editingCode) {
      const code = formData.financiador.split('-')[0]
      setFormData(prev => ({ ...prev, codigo: code }))
    }
  }, [formData.financiador, editingCode])

  // Lógica de auto-completado cruzado
  const availableLines = useMemo(() => {
    if (!formData.gap) return strategicLinesData.map(l => l.nombre)
    return strategicLinesData.filter(l => l.gap === formData.gap).map(l => l.nombre)
  }, [formData.gap])

  const handleProjectChange = (projectName: string) => {
    // Si tuviéramos un mapeo real de Proyecto -> GAP, se haría aquí.
    // Por ahora solo seteamos el proyecto
    setFormData(prev => ({ ...prev, proyecto: projectName }))
  }

  const handleLineChange = (lineName: string) => {
    const line = strategicLinesData.find(l => l.nombre === lineName)
    if (line) {
      setFormData(prev => ({ ...prev, lineaEstrategica: lineName, gap: line.gap }))
    } else {
      setFormData(prev => ({ ...prev, lineaEstrategica: lineName }))
    }
  }

  const filteredData = useMemo(() => {
    if (!projectFilter) return subprojectCodes
    return subprojectCodes.filter(item => item.proyecto === projectFilter)
  }, [projectFilter, subprojectCodes])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.financiador.trim() !== '' && formData.nombre.trim() !== '' && formData.proyecto.trim() !== ''
    if (!isFilled) return true

    if (editingCode) {
      return (
        formData.codigo === editingCode.codigo &&
        formData.financiador === editingCode.financiador &&
        formData.nombre === editingCode.nombre &&
        formData.proyecto === editingCode.proyecto
      )
    }
    return false
  }, [formData, editingCode])

  const handleNew = () => {
    setEditingCode(null)
    setFormData({ codigo: '', financiador: '', nombre: '', proyecto: '', gap: '', lineaEstrategica: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: SubprojectCode) => {
    setEditingCode(item)
    setFormData({ 
      codigo: item.codigo, 
      financiador: item.financiador, 
      nombre: item.nombre, 
      proyecto: item.proyecto,
      gap: '', // Mock data no tiene estos campos, los dejamos vacíos por ahora
      lineaEstrategica: ''
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingCode) {
      setSubprojectCodes(subprojectCodes.map(p => p.id === editingCode.id ? { ...p, ...formData } : p))
    } else {
      const newCode: SubprojectCode = {
        id: Math.max(0, ...subprojectCodes.map(p => p.id)) + 1,
        ...formData
      }
      setSubprojectCodes([...subprojectCodes, newCode])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: SubprojectCode) => {
    setCodeToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (codeToDelete) {
      setSubprojectCodes(subprojectCodes.filter(p => p.id !== codeToDelete.id))
    }
    setShowDeleteAlert(false)
    setCodeToDelete(null)
  }

  const columns: Column<SubprojectCode>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'Código' },
    { key: 'financiador', header: 'Financiador Principal' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'proyecto', header: 'Proyecto' },
    { key: 'actions', header: 'Acciones' },
  ]

  const projectOptions = useMemo(() => projectNamesData.map(p => p.nombre), [])

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Códigos de Subproyectos</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Códigos de Subproyectos del Marco Programático
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => setProjectFilter('')} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
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
        title={editingCode ? 'Editar código de subproyecto' : 'Crear nuevo código de subproyecto'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
        width="800px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
            <FilterSelect 
              label="Financiador Principal"
              options={FINANCIERS}
              value={formData.financiador}
              onChange={(val) => setFormData({ ...formData, financiador: val })}
            />
            <Input 
              label="Nombre"
              value={formData.nombre}
              onChange={(val) => setFormData({ ...formData, nombre: val })}
            />
            <Input 
              label="Código"
              value={formData.codigo}
              onChange={(val) => setFormData({ ...formData, codigo: val })}
            />
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
            <FilterSelect 
              label="Proyecto"
              options={projectOptions}
              value={formData.proyecto}
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
              value={formData.lineaEstrategica}
              onChange={handleLineChange}
            />
          </div>
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
