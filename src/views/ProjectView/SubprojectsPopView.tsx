import { useState, useMemo } from 'react'
import { Eye, Pencil, Trash2, LayoutDashboard, FileText } from 'lucide-react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { Button } from '../../components/Button/Button'
import { IconButton } from '../../components/IconButton/IconButton'
import { subprojectsPopData, subprojectCodesData, projectCodesData, strategicLinesData, gapsData } from '../../data/mockData'
import type { SubprojectPop } from '../../data/types'
import styles from './GapsView.module.css'

export function SubprojectsPopView() {
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojects, setSubprojects] = useState<SubprojectPop[]>(subprojectsPopData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubproject, setEditingSubproject] = useState<SubprojectPop | null>(null)
  const [formData, setFormData] = useState({ codigo: '', financiador: '', nombre: '', responsable: '', implementado: '' })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [subprojectToDelete, setSubprojectToDelete] = useState<SubprojectPop | null>(null)

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.financiador.trim() !== '' && formData.nombre.trim() !== '' && formData.responsable.trim() !== '' && formData.implementado.trim() !== ''
    if (!isFilled) return true

    if (editingSubproject) {
      return (
        formData.codigo === editingSubproject.codigo &&
        formData.financiador === editingSubproject.financiador &&
        formData.nombre === editingSubproject.nombre &&
        formData.responsable === editingSubproject.responsable &&
        formData.implementado === editingSubproject.implementado
      )
    }
    return false
  }, [formData, editingSubproject])

  const handleNew = () => {
    setEditingSubproject(null)
    setFormData({ codigo: '', financiador: '', nombre: '', responsable: '', implementado: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: SubprojectPop) => {
    setEditingSubproject(item)
    setFormData({ codigo: item.codigo, financiador: item.financiador, nombre: item.nombre, responsable: item.responsable, implementado: item.implementado })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingSubproject) {
      setSubprojects(subprojects.map(p => p.id === editingSubproject.id ? { ...p, ...formData } : p))
    } else {
      const newSubproject: SubprojectPop = {
        id: Math.max(0, ...subprojects.map(p => p.id)) + 1,
        ...formData
      }
      setSubprojects([...subprojects, newSubproject])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: SubprojectPop) => {
    setSubprojectToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (subprojectToDelete) {
      setSubprojects(subprojects.filter(p => p.id !== subprojectToDelete.id))
    }
    setShowDeleteAlert(false)
    setSubprojectToDelete(null)
  }

  type SubprojectsPopRow = {
    id: number
    codigo: string
    financiadorPrincipal: string
    nombre: string
    gerenteSubproyecto: string
    responsableMeal: string
    implementadores: string
    financiadoresSecundarios: string
    recursos: string
    proyecto: string
    pais: string
    region: string
    lineaEstrategica: string
    gap: string
    acciones: string
  }

  const rows = useMemo<SubprojectsPopRow[]>(() => {
    const matchByName = (candidate: string, selected: string) => {
      const base = candidate.replace(/\.\.\.$/, '').trim()
      const pick = selected.replace(/\.\.\.$/, '').trim()
      return base !== '' && pick !== '' && (pick.startsWith(base) || base.startsWith(pick))
    }

    return subprojects.map(sp => {
      const subCode = subprojectCodesData.find(s => {
        const financerOk = !sp.financiador || s.financiador.includes(sp.financiador) || sp.financiador.includes(s.financiador)
        return financerOk && matchByName(s.nombre, sp.nombre)
      }) || subprojectCodesData.find(s => matchByName(s.nombre, sp.nombre))

      const projectValue = subCode?.proyecto || '-'
      const projectCode = projectValue === '-' ? '' : projectValue.split('-')[0]?.trim()
      const project = projectCode ? projectCodesData.find(p => p.codigo === projectCode) : undefined

      const ubicacion = project?.ubicacion || ''
      const pais = ubicacion ? (ubicacion.split(',')[0]?.trim() || '-') : '-'
      const region = ubicacion ? (ubicacion.split(',')[1]?.trim() || '-') : '-'

      const lineValue = project?.linea || ''
      const lineCode = lineValue ? (lineValue.split(' ')[0] || '') : ''
      const line = lineCode ? strategicLinesData.find(l => l.codigo === lineCode) : undefined
      const lineaEstrategica = line ? `${line.codigo} ${line.nombre}` : (lineValue || '-')

      const gapCode = lineCode ? (lineCode.split('.')[0] || '') : ''
      const gap = gapCode ? (gapsData.find(g => g.codigo === gapCode)?.codigo || gapCode) : '-'

      return {
        id: sp.id,
        codigo: sp.codigo,
        financiadorPrincipal: sp.financiador,
        nombre: sp.nombre,
        gerenteSubproyecto: '-',
        responsableMeal: sp.responsable,
        implementadores: sp.implementado,
        financiadoresSecundarios: '-',
        recursos: '',
        proyecto: projectValue,
        pais,
        region,
        lineaEstrategica,
        gap,
        acciones: ''
      }
    })
  }, [subprojects])

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const matchProgram = !programFilter || r.pais.includes(programFilter)
      const matchProject = !projectFilter || r.proyecto.includes(projectFilter)
      return matchProgram && matchProject
    })
  }, [rows, programFilter, projectFilter])

  const columns: Column<SubprojectsPopRow>[] = [
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'financiadorPrincipal', header: 'Financiador Principal', width: '220px' },
    { key: 'nombre', header: 'Nombre', width: '220px' },
    { key: 'gerenteSubproyecto', header: 'Gerente de Subproyecto', width: '220px' },
    { key: 'responsableMeal', header: 'Responsable MEAL', width: '220px' },
    { key: 'implementadores', header: 'Implementadores', width: '160px' },
    { key: 'financiadoresSecundarios', header: 'Financiadores Secundarios', width: '220px' },
    { 
      key: 'recursos', 
      header: 'Recursos',
      width: '360px',
      render: () => (
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
          <Button variant="secondary" size="s" leftIcon={<LayoutDashboard size={16} />}>
            Ver Dashboards
          </Button>
          <Button variant="secondary" size="s" leftIcon={<FileText size={16} />}>
            FFVV
          </Button>
        </div>
      )
    },
    { key: 'proyecto', header: 'Proyecto', width: '260px' },
    { key: 'pais', header: 'País', width: '140px' },
    { key: 'region', header: 'Región', width: '140px' },
    { key: 'lineaEstrategica', header: 'Línea Estratégica', width: '280px' },
    { key: 'gap', header: 'GAP', width: '90px' },
    { 
      key: 'acciones', 
      header: 'Acciones',
      width: '140px',
      align: 'right',
      render: (_val, row) => (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <IconButton icon={<Eye size={18} />} onClick={() => {}} />
          <IconButton icon={<Pencil size={18} />} onClick={() => {
            const original = subprojects.find(s => s.id === row.id)
            if (original) handleEdit(original)
          }} />
          <IconButton
            icon={<Trash2 size={18} />}
            style={{ color: '#f44336', borderColor: '#f44336' }}
            onClick={() => {
            const original = subprojects.find(s => s.id === row.id)
            if (original) handleDelete(original)
          }}
          />
        </div>
      )
    },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Subproyectos</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Subproyectos en POP Institucional
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => {
          setProgramFilter('')
          setProjectFilter('')
        }} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Programa" 
            options={['Programa 1', 'Programa 2']} 
            value={programFilter}
            onChange={setProgramFilter}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Proyecto" 
            options={['Proyecto A', 'Proyecto B']} 
            value={projectFilter}
            onChange={setProjectFilter}
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          data={filteredRows} 
        />
      </div>

      <Pagination total={filteredRows.length} range={`1-${filteredRows.length}`} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubproject ? 'Editar subproyecto' : 'Crear nuevo subproyecto'}
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
            label="Financiador Principal"
            value={formData.financiador}
            onChange={(val) => setFormData({ ...formData, financiador: val })}
          />
          <Input 
            label="Nombre"
            value={formData.nombre}
            onChange={(val) => setFormData({ ...formData, nombre: val })}
          />
          <Input 
            label="Responsable"
            value={formData.responsable}
            onChange={(val) => setFormData({ ...formData, responsable: val })}
          />
          <Input 
            label="Implementado por"
            value={formData.implementado}
            onChange={(val) => setFormData({ ...formData, implementado: val })}
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
