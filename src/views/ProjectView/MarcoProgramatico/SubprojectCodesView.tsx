import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Input } from '../../../components/Input/Input'
import { Modal } from '../../../components/Modal/Modal'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { subprojectCodesData, strategicLinesData, projectCodesData, financiadoresData } from '../../../data/mockData'
import type { SubprojectCode } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
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
    lineaEstrategica: '',
    programa: ''
  })

  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<SubprojectCode | null>(null)

  const FINANCIERS = useMemo(() => financiadoresData.map(f => `${f.nombre} - ${f.moneda}`), [])

  // Auto-generate código basado en financiador
  useEffect(() => {
    if (formData.financiador && !editingCode) {
      const match = financiadoresData.find(f => `${f.nombre} - ${f.moneda}` === formData.financiador)
      if (match) {
        setFormData(prev => ({ ...prev, codigo: match.codigo }))
      }
    }
  }, [formData.financiador, editingCode])

  const _saveFinanciador = useMemo(() => {
    const match = financiadoresData.find(f => `${f.nombre} - ${f.moneda}` === formData.financiador)
    return match ? match.nombre : formData.financiador
  }, [formData.financiador])

  const handleProjectChange = (projectName: string) => {
    const mappedProject = projectCodesData.find(p =>
      p.nombre.trim() === projectName.trim() || projectName.includes(p.codigo)
    )

    if (mappedProject) {
      const lineObj = strategicLinesData.find(l => l.nombre === mappedProject.linea)
      const gapMatch = lineObj ? lineObj.gap : ''

      setFormData(prev => ({
        ...prev,
        proyecto: projectName,
        lineaEstrategica: mappedProject.linea || '',
        programa: mappedProject.programa || '',
        gap: gapMatch
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        proyecto: projectName,
        lineaEstrategica: '',
        programa: '',
        gap: ''
      }))
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
        _saveFinanciador === editingCode.financiador &&
        formData.nombre === editingCode.nombre &&
        formData.proyecto === editingCode.proyecto
      )
    }
    return false
  }, [formData, editingCode, _saveFinanciador])

  const handleNew = () => {
    setEditingCode(null)
    setFormData({ codigo: '', financiador: '', nombre: '', proyecto: '', gap: '', lineaEstrategica: '', programa: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: SubprojectCode) => {
    setEditingCode(item)
    // Rellenamos los campos disabled para que se vean bien en la vista de edición
    const mappedProject = projectCodesData.find(p =>
      p.nombre.trim() === item.proyecto.trim() || item.proyecto.includes(p.codigo)
    )
    let extraData = { gap: '', lineaEstrategica: '', programa: '' }
    if (mappedProject) {
      const lineObj = strategicLinesData.find(l => l.nombre === mappedProject.linea)
      extraData = {
        gap: lineObj ? lineObj.gap : '',
        lineaEstrategica: mappedProject.linea || '',
        programa: mappedProject.programa || ''
      }
    }

    const f = financiadoresData.find(fin => fin.nombre === item.financiador)
    const displayFinanciador = f ? `${f.nombre} - ${f.moneda}` : item.financiador

    setFormData({
      codigo: item.codigo,
      financiador: displayFinanciador,
      nombre: item.nombre,
      proyecto: item.proyecto,
      ...extraData
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const fMatch = financiadoresData.find(fin => `${fin.nombre} - ${fin.moneda}` === formData.financiador)
    const savedFinanciador = fMatch ? fMatch.nombre : formData.financiador

    if (editingCode) {
      // Guardamos la info basica del subproyecto
      const dataToSave = {
        codigo: formData.codigo,
        financiador: savedFinanciador,
        nombre: formData.nombre,
        proyecto: formData.proyecto
      }
      setSubprojectCodes(subprojectCodes.map(p => p.id === editingCode.id ? { ...p, ...dataToSave } : p))
    } else {
      const newCode: SubprojectCode = {
        id: Math.max(0, ...subprojectCodes.map(p => p.id)) + 1,
        codigo: formData.codigo,
        financiador: savedFinanciador,
        nombre: formData.nombre,
        proyecto: formData.proyecto,
        gap: formData.gap,
        linea: formData.lineaEstrategica,
        programa: formData.programa
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
    { key: 'programa', header: 'Programa' },
    { key: 'gap', header: 'GAP' },
    { key: 'linea', header: 'Línea Estratégica' },
    { key: 'proyecto', header: 'Proyecto' },
    { key: 'codigo', header: 'Código' },
    { key: 'financiador', header: 'Financiador Principal' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'actions', header: 'Acciones' },
  ]

  const projectOptions = useMemo(() => projectCodesData.map(p => p.nombre), [])

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Códigos de Subproyectos"
          subtitle="Gestión de Códigos de Subproyectos del Marco Programático"
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
              label="Proyecto"
              options={projectOptions}
              value={formData.proyecto}
              onChange={handleProjectChange}
            />
            <FilterSelect
              label="Financiador Principal"
              options={FINANCIERS}
              value={formData.financiador}
              onChange={(val) => setFormData({ ...formData, financiador: val })}
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
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
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
              label="Programa"
              value={formData.programa}
              onChange={() => { }}
              disabled
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
