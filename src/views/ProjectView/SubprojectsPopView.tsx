import { useState, useMemo } from 'react'
import { LayoutDashboard, FileText } from 'lucide-react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { Button } from '../../components/Button/Button'
import { subprojectsPopData, subprojectCodesData, projectCodesData, strategicLinesData, gapsData, locationsData } from '../../data/mockData'
import type { SubprojectPop, LocationNode } from '../../data/types'
import styles from './GapsView.module.css'

export function SubprojectsPopView() {
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojects, setSubprojects] = useState<SubprojectPop[]>(subprojectsPopData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubproject, setEditingSubproject] = useState<SubprojectPop | null>(null)
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [subprojectToDelete, setSubprojectToDelete] = useState<SubprojectPop | null>(null)

  // State for form
  const [formData, setFormData] = useState<Partial<SubprojectPop>>({
    proyectoId: undefined,
    subprojectCodeId: undefined,
    nombre: '',
    codigo: '',
    financiador: '',
    gerenteSubproyecto: '',
    responsableMeal: '',
    programa: '',
    fechaInicio: '',
    fechaFin: '',
    implementadores: [],
    financiadoresSecundarios: [],
    ubicaciones: []
  })

  // Options for form
  const gerenteOptions = ['Marco Aurelio', 'Percy Quispe', 'Micaela Castillo', 'Martina Gonzales']
  const responsableMealOptions = ['Claudia Teresa Sánchez', 'Alejandra Rio', 'Felipe Castillo']
  const implementadorOptions = ['AEA Ecuador', 'AEA Colombia', 'Municipalidad Local']
  const financiadorSecOptions = ['Unión Europea', 'BID', 'GIZ']

  // Location logic
  const [selectedPais, setSelectedPais] = useState('')
  const paisOptions = locationsData.find((l: LocationNode) => l.label === 'Sudamérica')?.children?.map((c: LocationNode) => c.label) || []
  const departamentoOptions = locationsData
    .find((l: LocationNode) => l.label === 'Sudamérica')?.children
    ?.find((c: LocationNode) => c.label === selectedPais)?.children?.map((d: LocationNode) => d.label) || []

  const isSaveDisabled = useMemo(() => {
    return !formData.proyectoId || !formData.subprojectCodeId || !formData.gerenteSubproyecto || !formData.responsableMeal
  }, [formData])

  const handleNew = () => {
    setEditingSubproject(null)
    setFormData({
      proyectoId: undefined,
      subprojectCodeId: undefined,
      nombre: '',
      codigo: '',
      financiador: '',
      gerenteSubproyecto: '',
      responsableMeal: '',
      programa: '',
      fechaInicio: '',
      fechaFin: '',
      implementadores: [],
      financiadoresSecundarios: [],
      ubicaciones: []
    })
    setIsModalOpen(true)
  }

  const handleEdit = (row: SubprojectsPopRow) => {
    const item = subprojects.find(s => s.id === row.id)
    if (!item) return
    setEditingSubproject(item)
    setFormData({ ...item })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingSubproject) {
      setSubprojects(subprojects.map(p => p.id === editingSubproject.id ? { ...p, ...formData } as SubprojectPop : p))
    } else {
      const newSubproject: SubprojectPop = {
        id: Math.max(0, ...subprojects.map(p => p.id)) + 1,
        ...formData
      } as SubprojectPop
      setSubprojects([...subprojects, newSubproject])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (row: SubprojectsPopRow) => {
    const item = subprojects.find(s => s.id === row.id)
    if (!item) return
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
    programa: string
    fechaInicio: string
    fechaFin: string
    implementadores: string
    financiadoresSecundarios: string
    ubicaciones: string
    proyecto: string
    recursos?: string // Add resources to avoid type error in columns
  }

  const rows = useMemo<SubprojectsPopRow[]>(() => {
    return subprojects.map(sp => {
      const project = projectCodesData.find(p => p.id === sp.proyectoId)
      
      return {
        id: sp.id,
        codigo: sp.codigo,
        financiadorPrincipal: sp.financiador,
        nombre: sp.nombre,
        gerenteSubproyecto: sp.gerenteSubproyecto,
        responsableMeal: sp.responsableMeal,
        programa: sp.programa,
        fechaInicio: sp.fechaInicio,
        fechaFin: sp.fechaFin,
        implementadores: sp.implementadores.join(', '),
        financiadoresSecundarios: sp.financiadoresSecundarios.join(', ') || '-',
        ubicaciones: sp.ubicaciones.map(u => `${u.pais} (${u.departamento})`).join(', '),
        proyecto: project ? `${project.codigo} - ${project.nombre}` : '-'
      }
    })
  }, [subprojects])

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const matchProgram = !programFilter || r.programa.includes(programFilter)
      const matchProject = !projectFilter || r.proyecto.includes(projectFilter)
      return matchProgram && matchProject
    })
  }, [rows, programFilter, projectFilter])

  const columns: Column<SubprojectsPopRow>[] = [
    { key: 'checkbox', header: '', width: '40px' },
    { key: 'codigo', header: 'Código', width: '100px' },
    { key: 'financiadorPrincipal', header: 'Financiador Principal', width: '250px' },
    { key: 'nombre', header: 'Nombre', width: '350px' },
    { key: 'gerenteSubproyecto', header: 'Gerente de Subproyecto', width: '220px' },
    { key: 'responsableMeal', header: 'Responsable MEAL', width: '220px' },
    { key: 'programa', header: 'Programa', width: '180px' },
    { key: 'fechaInicio', header: 'Fecha Inicio', width: '130px' },
    { key: 'fechaFin', header: 'Fecha Fin', width: '130px' },
    { key: 'implementadores', header: 'Implementadores', width: '200px' },
    { key: 'financiadoresSecundarios', header: 'Financiadores Secundarios', width: '250px' },
    { key: 'ubicaciones', header: 'Ubicaciones', width: '300px' },
    { 
      key: 'recursos', 
      header: 'Recursos',
      width: '360px',
      sticky: 'right',
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
    { key: 'actions', header: 'Acciones', width: '120px', sticky: 'right' },
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
          onEdit={handleEdit}
          onDelete={handleDelete}
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
        width="1000px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Primera Columna */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FilterSelect 
              label="Seleccionar Proyecto" 
              options={projectCodesData.map(p => `${p.codigo} - ${p.nombre}`)}
              value={formData.proyectoId ? `${projectCodesData.find(p => p.id === formData.proyectoId)?.codigo} - ${projectCodesData.find(p => p.id === formData.proyectoId)?.nombre}` : ''}
              onChange={(val) => {
                const project = projectCodesData.find(p => `${p.codigo} - ${p.nombre}` === val)
                setFormData({ ...formData, proyectoId: project?.id })
              }}
            />
            
            <FilterSelect 
              label="Seleccionar Subproyecto" 
              options={subprojectCodesData
                .filter(s => {
                  if (!formData.proyectoId) return true
                  const project = projectCodesData.find(p => p.id === formData.proyectoId)
                  return project ? s.proyecto.startsWith(project.codigo) : true
                })
                .map(s => `${s.codigo} - ${s.nombre}`)}
              value={formData.subprojectCodeId ? `${subprojectCodesData.find(s => s.id === formData.subprojectCodeId)?.codigo} - ${subprojectCodesData.find(s => s.id === formData.subprojectCodeId)?.nombre}` : ''}
              onChange={(val) => {
                const subCode = subprojectCodesData.find(s => `${s.codigo} - ${s.nombre}` === val)
                if (subCode) {
                  setFormData({ 
                    ...formData, 
                    subprojectCodeId: subCode.id,
                    nombre: subCode.nombre,
                    codigo: subCode.codigo,
                    financiador: subCode.financiador
                  })
                }
              }}
            />

            <Input 
              label="Nombre de Subproyecto"
              value={formData.nombre || ''}
              onChange={() => {}}
              disabled
            />

            <div style={{ display: 'flex', gap: '16px' }}>
              <Input 
                label="Código"
                value={formData.codigo || ''}
                onChange={() => {}}
                disabled
                grow
              />
              <Input 
                label="Financiador Principal"
                value={formData.financiador || ''}
                onChange={() => {}}
                disabled
                grow
              />
            </div>

            <FilterSelect 
              label="Gerente de Subproyecto" 
              options={gerenteOptions}
              value={formData.gerenteSubproyecto || ''}
              onChange={(val) => setFormData({ ...formData, gerenteSubproyecto: val })}
            />

            <FilterSelect 
              label="Responsable MEAL" 
              options={responsableMealOptions}
              value={formData.responsableMeal || ''}
              onChange={(val) => setFormData({ ...formData, responsableMeal: val })}
            />

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Fecha Inicio</p>
                <input 
                  type="month" 
                  value={formData.fechaInicio || ''} 
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Fecha Fin</p>
                <input 
                  type="month" 
                  value={formData.fechaFin || ''} 
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
                />
              </div>
            </div>
          </div>

          {/* Segunda Columna */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Implementadores (Múltiple)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {implementadorOptions.map(opt => (
                  <Button 
                    key={opt}
                    variant={formData.implementadores?.includes(opt) ? 'primary' : 'secondary'}
                    size="s"
                    onClick={() => {
                      const current = formData.implementadores || []
                      const next = current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt]
                      setFormData({ ...formData, implementadores: next })
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: '#a0a0a0', marginBottom: '8px' }}>Financiadores Secundarios (Múltiple)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {financiadorSecOptions.map(opt => (
                  <Button 
                    key={opt}
                    variant={formData.financiadoresSecundarios?.includes(opt) ? 'primary' : 'secondary'}
                    size="s"
                    onClick={() => {
                      const current = formData.financiadoresSecundarios || []
                      const next = current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt]
                      setFormData({ ...formData, financiadoresSecundarios: next })
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Ubicaciones</p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <FilterSelect 
                  label="País" 
                  options={paisOptions}
                  value={selectedPais}
                  onChange={setSelectedPais}
                  className="grow"
                />
                <FilterSelect 
                  label="Departamento" 
                  options={departamentoOptions}
                  onChange={(val) => {
                    if (selectedPais && val) {
                      const exists = formData.ubicaciones?.some(u => u.pais === selectedPais && u.departamento === val)
                      if (!exists) {
                        setFormData({
                          ...formData,
                          ubicaciones: [...(formData.ubicaciones || []), { pais: selectedPais, departamento: val }]
                        })
                      }
                      setSelectedPais('')
                    }
                  }}
                  className="grow"
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.ubicaciones?.map((u, i) => (
                  <div key={i} style={{ background: '#f5f5f5', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {u.pais} - {u.departamento}
                    <button 
                      onClick={() => setFormData({ ...formData, ubicaciones: formData.ubicaciones?.filter((_, idx) => idx !== i) })}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
