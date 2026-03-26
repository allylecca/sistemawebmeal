import { useState, useMemo } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Modal } from '../../components/Modal/Modal'
import { Input } from '../../components/Input/Input'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { Button } from '../../components/Button/Button'
import { Badge } from '../../components/Badge/Badge'
import { annualPlanningData, programsData, subprojectCodesData, projectCodesData } from '../../data/mockData'
import type { AnnualPlanningItem } from '../../data/types'
import styles from './AnnualPlanningView.module.css'

export function AnnualPlanningView() {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [activeStep, setActiveStep] = useState(1)

  // --- List Mode States ---
  const [projectFilter, setProjectFilter] = useState('')
  const [items, setItems] = useState<AnnualPlanningItem[]>(annualPlanningData)
  const [itemToDelete, setItemToDelete] = useState<AnnualPlanningItem | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  // --- Create/Edit Mode States ---
  const [editingItem, setEditingItem] = useState<AnnualPlanningItem | null>(null)

  // Form fields for Steps 1 & 2
  const [formData, setFormData] = useState({
    programa: '',
    proyecto: '',
    subproyecto: '',
    gap: '',
    lineaEstrategica: '',
    codigo: '',
    financiador: '',
    gerenteSubproyecto: '',
    responsableMeal: '',
    inicioMes: '',
    inicioAno: '',
    finMes: '',
    finAno: '',
    involucrarSubactividades: false,
    implementadores: [] as string[],
    financiadoresSecundarios: [] as string[],
    ubicaciones: [] as Array<{ id: number, region: string, pais: string, departamento: string, provincia: string, distrito: string }>
  })

  // Table Data for Step 3
  const [indicators, setIndicators] = useState<any[]>([])

  // Indicator Modal for Step 3
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false)
  const [indicatorFormData, setIndicatorFormData] = useState({
    tipo: '',
    indicadorInstitucional: '',
    unidad: '',
    tipoValor: ''
  })

  const [showConfirmSave, setShowConfirmSave] = useState(false)

  // ------------------------------------------
  // LIST MODE HELPERS
  // ------------------------------------------

  const filteredData = useMemo(() => {
    if (!projectFilter) return items
    return items.filter(item => item.proyecto.includes(projectFilter) || item.proyecto === projectFilter)
  }, [projectFilter, items])

  const defaultIndicators = [
    { id: 1, indicador: 'PROT-LE-01 - Lorem ipsum dolor sit amet', tipo: 'Línea Estratégica', y2026: '2 300', y2027: '0 000', y2028: '0 000', y2029: '0 000' },
    { id: 2, indicador: 'PROT-LE-02 - Lorem ipsum dolor sit amet', tipo: 'Línea Estratégica', y2026: '2 500', y2027: '0 000', y2028: '0 000', y2029: '0 000' },
    { id: 3, indicador: 'PROT-LE-03 - Lorem ipsum dolor sit amet', tipo: 'Línea Estratégica', y2026: '2 400', y2027: '0 000', y2028: '0 000', y2029: '0 000' },
    { id: 4, indicador: 'PROT-LE-04 - Lorem ipsum dolor sit amet', tipo: 'Línea Estratégica', y2026: '2 200', y2027: '0 000', y2028: '0 000', y2029: '0 000' }
  ]

  const handleNew = () => {
    setEditingItem(null)
    setFormData({
      programa: '', proyecto: '', subproyecto: '', gap: '', lineaEstrategica: '', codigo: '', financiador: '',
      gerenteSubproyecto: '', responsableMeal: '', inicioMes: '', inicioAno: '', finMes: '', finAno: '',
      involucrarSubactividades: false, implementadores: [], financiadoresSecundarios: [], ubicaciones: []
    })
    setIndicators(defaultIndicators)
    setViewMode('create')
    setActiveStep(1)
  }

  const handleEditList = (item: AnnualPlanningItem) => {
    setEditingItem(item)
    setFormData({
      programa: '',
      proyecto: item.proyecto,
      subproyecto: item.nombre,
      gap: '',
      lineaEstrategica: '',
      codigo: item.codigo,
      financiador: item.financiador,
      gerenteSubproyecto: '',
      responsableMeal: item.responsable,
      inicioMes: '', inicioAno: '', finMes: '', finAno: '',
      involucrarSubactividades: false, implementadores: [], financiadoresSecundarios: [], ubicaciones: []
    })
    setIndicators([{ id: 1, indicador: 'PROT-LE-01 - Lorem ipsum dolor sit amet', tipo: 'Línea Estratégica', y2026: '2 300', y2027: '0 000', y2028: '0 000', y2029: '0 000' }])
    setViewMode('create')
    setActiveStep(1)
  }

  const handleDeleteList = (item: AnnualPlanningItem) => {
    setItemToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDeleteList = () => {
    if (itemToDelete) {
      setItems(items.filter(p => p.id !== itemToDelete.id))
    }
    setShowDeleteAlert(false)
    setItemToDelete(null)
  }

  // ------------------------------------------
  // CREATE/EDIT WIZARD HELPERS
  // ------------------------------------------

  const handleSubprojectChange = (subName: string) => {
    const sub = subprojectCodesData.find(s => s.nombre === subName)
    if (sub) {
      setFormData(prev => ({
        ...prev,
        subproyecto: subName,
        codigo: sub.codigo,
        financiador: sub.financiador
      }))
    } else {
      setFormData(prev => ({ ...prev, subproyecto: subName }))
    }
  }

  const handleUbiChange = (id: number, field: string, value: string) => {
    setFormData(p => ({
      ...p,
      ubicaciones: p.ubicaciones.map(u => {
        if (u.id === id) {
          const newUbi = { ...u, [field]: value }
          // reset children
          if (field === 'region') { newUbi.pais = ''; newUbi.departamento = ''; newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'pais') { newUbi.departamento = ''; newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'departamento') { newUbi.provincia = ''; newUbi.distrito = ''; }
          if (field === 'provincia') { newUbi.distrito = ''; }
          return newUbi
        }
        return u
      })
    }))
  }

  const handleDeleteUbi = (id: number) => {
    setFormData(p => ({
      ...p,
      ubicaciones: p.ubicaciones.filter(u => u.id !== id)
    }))
  }

  const handleSaveWizard = () => {
    if (editingItem) {
      setItems(items.map(p => p.id === editingItem.id ? {
        ...p,
        codigo: formData.codigo,
        financiador: formData.financiador || editingItem.financiador,
        nombre: formData.subproyecto || editingItem.nombre,
        responsable: formData.responsableMeal || editingItem.responsable,
        proyecto: formData.proyecto
      } : p))
    } else {
      const newItem: AnnualPlanningItem = {
        id: Math.max(0, ...items.map(p => p.id)) + 1,
        codigo: formData.codigo || '00000',
        financiador: formData.financiador || 'N/A',
        nombre: formData.subproyecto || 'Nuevo Subproyecto',
        responsable: formData.responsableMeal || 'Usuario Actual',
        estado: 'Borrador',
        proyecto: formData.proyecto || 'Proyecto Defecto'
      }
      setItems([...items, newItem])
    }
    setViewMode('list')
    setShowConfirmSave(true)
  }

  const handleAddIndicator = () => {
    const newInd = {
      id: Math.max(0, ...indicators.map(i => i.id)) + 1,
      indicador: indicatorFormData.indicadorInstitucional || 'Nuevo Indicador',
      tipo: indicatorFormData.tipo || 'Línea Estratégica',
      y2026: '0 000', y2027: '0 000', y2028: '0 000', y2029: '0 000'
    }
    setIndicators([...indicators, newInd])
    setIsIndicatorModalOpen(false)
  }

  // ------------------------------------------
  // RENDER HELPERS
  // ------------------------------------------

  const STEPS = [
    { id: 1, label: 'Selección de Subproyecto' },
    { id: 2, label: 'Datos del Subproyecto' },
    { id: 3, label: 'Metas de Indicadores' }
  ]

  const renderStepper = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '32px 0' }}>
      {STEPS.map((step, index) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveStep(step.id)}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: activeStep >= step.id ? '#db5e4e' : '#f0f0f0',
            color: activeStep >= step.id ? 'white' : '#999',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 'bold'
          }}>
            {step.id}
          </div>
          <span style={{
            marginLeft: '12px',
            color: activeStep >= step.id ? '#333' : '#999',
            fontSize: '12px',
            fontWeight: activeStep >= step.id ? 600 : 400
          }}>
            {step.label}
          </span>
          {index < STEPS.length - 1 && (
            <div style={{ width: '120px', height: '1px', backgroundColor: '#e0e0e0', margin: '0 24px' }} />
          )}
        </div>
      ))}
    </div>
  )

  const getStatusBadge = (status: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      'Aprobado': { bg: '#e6f4ea', text: '#1e8e3e' },
      'Desaprobado': { bg: '#fce8e6', text: '#d93025' },
      'Pendiente': { bg: '#fef7e0', text: '#e37400' },
      'Borrador': { bg: '#f1f3f4', text: '#5f6368' }
    }
    const color = colors[status] || colors['Borrador']
    return (
      <span style={{
        backgroundColor: color.bg,
        color: color.text,
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 500,
        display: 'inline-block',
        textAlign: 'center',
        minWidth: '90px'
      }}>
        {status}
      </span>
    )
  }

  // Common options
  const projectOptions = useMemo(() => projectCodesData.map(p => p.nombre), [])
  const subprojectOptions = useMemo(() => subprojectCodesData.map(s => s.nombre), [])
  const programOptions = useMemo(() => programsData.map(p => p.nombre), [])
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const anos = ['2025', '2026', '2027', '2028', '2029', '2030']
  const implementadoresOps = ['Socio Local A', 'Socio Local B', 'Ayuda en Acción', 'Agencia Externa']
  const financiadoresOps = ['AECID', 'Unión Europea', 'Fondo Verde', 'USAID']
  const regionesOps = ['Sudamérica', 'Mesoamérica', 'África']
  const paisesOps = ['Perú', 'Bolivia', 'México', 'Costa Rica', 'Etiopía']
  const dptosOps = ['Lima', 'La Libertad', 'Cusco', 'Arequipa']

  // List columns
  const listColumns: Column<AnnualPlanningItem>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'CÓDIGO' },
    { key: 'financiador', header: 'FINANCIADOR PRINCIPAL' },
    { key: 'nombre', header: 'NOMBRE' },
    { key: 'responsable', header: 'RESPONSABLE' },
    {
      key: 'estado',
      header: 'Estado',
      render: (val) => getStatusBadge(val as string)
    },
    { key: 'actions', header: 'ACCIONES' }
  ]

  // Step 3 columns
  const step3Columns: Column<any>[] = [
    { key: 'checkbox', header: '' },
    { key: 'indicador', header: 'INDICADOR ↑↓' },
    {
      key: 'tipo',
      header: 'TIPO ↑↓',
      render: (val) => <Badge variant="line">{val}</Badge>
    },
    {
      key: 'y2026',
      header: '2026 ↑↓',
      render: (val, row) => (
        <input
          type="text"
          value={val}
          onChange={(e) => setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, y2026: e.target.value } : i))}
          style={{ width: '80px', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', fontFamily: 'monospace' }}
        />
      )
    },
    {
      key: 'y2027',
      header: '2027 ↑↓',
      render: (val, row) => (
        <input
          type="text"
          value={val}
          onChange={(e) => setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, y2027: e.target.value } : i))}
          style={{ width: '80px', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', fontFamily: 'monospace' }}
        />
      )
    },
    {
      key: 'y2028',
      header: '2028 ↑↓',
      render: (val, row) => (
        <input
          type="text"
          value={val}
          onChange={(e) => setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, y2028: e.target.value } : i))}
          style={{ width: '80px', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', fontFamily: 'monospace' }}
        />
      )
    },
    {
      key: 'y2029',
      header: '2029 ↑↓',
      render: (val, row) => (
        <input
          type="text"
          value={val}
          onChange={(e) => setIndicators(prev => prev.map(i => i.id === row.id ? { ...i, y2029: e.target.value } : i))}
          style={{ width: '80px', textAlign: 'center', border: '1px solid #ddd', padding: '4px', borderRadius: '4px', fontFamily: 'monospace' }}
        />
      )
    },
    { key: 'actions', header: 'ACCIONES ↑↓' },
  ]

  // Main Render Branching
  if (viewMode === 'list') {
    return (
      <div className={styles.root}>
        <header style={{ padding: '24px 32px 0' }}>
          <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Planificación Anual</h1>
            <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
              Gestión de Planificación Anual
            </p>
          </div>
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
            columns={listColumns}
            data={filteredData}
            onEdit={handleEditList}
            onDelete={handleDeleteList}
          />
        </div>

        <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />

        <AlertModal
          isOpen={showConfirmSave}
          onClose={() => setShowConfirmSave(false)}
          variant="success"
          title="Cambios guardados con éxito"
          description="La información ha sido actualizada en el sistema"
          primaryAction={{ label: 'Continuar', onClick: () => setShowConfirmSave(false) }}
        />

        <AlertModal
          isOpen={showDeleteAlert}
          onClose={() => setShowDeleteAlert(false)}
          variant="danger"
          title="¿Estás seguro de eliminar?"
          description="Esta acción es irreversible"
          primaryAction={{ label: 'Eliminar', onClick: confirmDeleteList }}
          secondaryAction={{ label: 'Cancelar', onClick: () => setShowDeleteAlert(false) }}
        />
      </div>
    )
  }

  // Create Mode Render (Wizard)
  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Planificación Anual &gt; Habilitar Subproyecto</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Ingresa todos los detalles
          </p>
        </div>
      </header>

      {/* Wrapper box */}
      <div style={{ margin: '24px 32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

        {renderStepper()}

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px' }}>
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <FilterSelect
                label="Programa"
                options={programOptions}
                value={formData.programa}
                onChange={(v) => setFormData(p => ({ ...p, programa: v as string }))}
              />
              <FilterSelect
                label="Proyecto"
                options={projectOptions}
                value={formData.proyecto}
                onChange={(v) => setFormData(p => ({ ...p, proyecto: v as string }))}
              />
              <FilterSelect
                label="Subproyecto"
                options={subprojectOptions}
                value={formData.subproyecto}
                onChange={handleSubprojectChange}
              />
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
                label="Código"
                value={formData.codigo}
                onChange={(v) => setFormData(p => ({ ...p, codigo: v }))}
                disabled
              />
              <Input
                label="Financiador Principal"
                value={formData.financiador}
                onChange={(v) => setFormData(p => ({ ...p, financiador: v }))}
                disabled
              />
            </div>
          )}

          {activeStep === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', alignItems: 'start' }}>

              {/* LADO IZQUIERDO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <FilterSelect
                  label="Gerente de Subproyecto"
                  options={['Carlos Pérez', 'Ana Gómez']}
                  value={formData.gerenteSubproyecto}
                  onChange={(v) => setFormData(p => ({ ...p, gerenteSubproyecto: v as string }))}
                />
                <FilterSelect
                  label="Responsable MEAL"
                  options={['María Silva', 'Jorge Luis']}
                  value={formData.responsableMeal}
                  onChange={(v) => setFormData(p => ({ ...p, responsableMeal: v as string }))}
                />

                <div>
                  <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha inicio</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Mes" options={meses} value={formData.inicioMes} onChange={(v) => setFormData(p => ({ ...p, inicioMes: v as string }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Año" options={anos} value={formData.inicioAno} onChange={(v) => setFormData(p => ({ ...p, inicioAno: v as string }))} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha fin</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Mes" options={meses} value={formData.finMes} onChange={(v) => setFormData(p => ({ ...p, finMes: v as string }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <FilterSelect label="Año" options={anos} value={formData.finAno} onChange={(v) => setFormData(p => ({ ...p, finAno: v as string }))} />
                    </div>
                  </div>
                </div>

                {/* Toggle Subactividades */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Involucrar subactividades</span>
                  <div
                    onClick={() => setFormData(p => ({ ...p, involucrarSubactividades: !p.involucrarSubactividades }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px',
                      backgroundColor: formData.involucrarSubactividades ? '#db5e4e' : '#dcdcdc',
                      position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                      position: 'absolute', top: '2px', left: formData.involucrarSubactividades ? '22px' : '2px',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* LADO DERECHO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <FilterSelect
                  label="Implementadores"
                  options={implementadoresOps}
                  value={formData.implementadores}
                  onChange={(v) => setFormData(p => ({ ...p, implementadores: v as string[] }))}
                  isMulti
                />

                <FilterSelect
                  label="Financiadores Secundarios"
                  options={financiadoresOps}
                  value={formData.financiadoresSecundarios}
                  onChange={(v) => setFormData(p => ({ ...p, financiadoresSecundarios: v as string[] }))}
                  isMulti
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '0px' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>Ubicaciones</span>
                  <button onClick={() => setFormData(p => ({
                    ...p,
                    ubicaciones: [...p.ubicaciones, { id: Date.now(), region: '', pais: '', departamento: '', provincia: '', distrito: '' }]
                  }))} style={{ padding: '0', fontSize: '20px', color: '#333', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.ubicaciones.length === 0 && <p style={{ fontSize: '12px', color: '#999' }}>Ninguna ubicación agregada</p>}
                  {formData.ubicaciones.map((ubi) => (
                    <div key={ubi.id} style={{ display: 'flex', gap: '12px', border: '1px solid #eee', padding: '16px', borderRadius: '8px', backgroundColor: '#fafafa', position: 'relative' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <FilterSelect label="Región" options={regionesOps} value={ubi.region} onChange={v => handleUbiChange(ubi.id, 'region', v as string)} />
                        {ubi.region && <FilterSelect label="País" options={paisesOps} value={ubi.pais} onChange={v => handleUbiChange(ubi.id, 'pais', v as string)} />}
                        {ubi.pais && <FilterSelect label="Departamento" options={dptosOps} value={ubi.departamento} onChange={v => handleUbiChange(ubi.id, 'departamento', v as string)} />}
                        {ubi.departamento && <FilterSelect label="Provincia" options={['Lima Provincia', 'Trujillo']} value={ubi.provincia} onChange={v => handleUbiChange(ubi.id, 'provincia', v as string)} />}
                        {ubi.provincia && <FilterSelect label="Distrito" options={['Comas', 'Miraflores']} value={ubi.distrito} onChange={v => handleUbiChange(ubi.id, 'distrito', v as string)} />}
                      </div>
                      <button onClick={() => handleDeleteUbi(ubi.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', height: 'fit-content', marginTop: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <Toolbar
                onNew={() => setIsIndicatorModalOpen(true)}
                onExport={() => { }}
                onRefresh={() => { }}
                onFilterToggle={() => { }}
                onColumnToggle={() => { }}
              >
                <div style={{ flex: 0.5 }}>
                  <FilterSelect
                    label="Año"
                    options={['2026', '2027', '2028', '2029']}
                    value={''}
                    onChange={() => { }}
                  />
                </div>
              </Toolbar>

              <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
                <Table
                  columns={step3Columns}
                  data={indicators}
                  onEdit={() => { }}
                  onDelete={(item) => setIndicators(indicators.filter(i => i.id !== item.id))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #eaeaea', display: 'flex', justifyContent: 'flex-end', gap: '16px', backgroundColor: '#fdfdfd', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
          <Button variant="secondary" onClick={() => setViewMode('list')} style={{ minWidth: '120px' }}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (activeStep < 3) {
                setActiveStep(activeStep + 1)
              } else {
                handleSaveWizard()
              }
            }}
            style={{ minWidth: '160px' }}
          >
            {activeStep === 3 ? 'Guardar cambios' : 'Continuar'}
          </Button>
        </div>
      </div>

      {/* Indicator Add Modal */}
      <Modal
        isOpen={isIndicatorModalOpen}
        onClose={() => setIsIndicatorModalOpen(false)}
        title="Habilitar subproyecto"
        subtitle="Ingresa todos los detalles"
        onSave={handleAddIndicator}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FilterSelect
            label="Tipo"
            options={['Línea Estratégica', 'Producto', 'Resultado']}
            value={indicatorFormData.tipo}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, tipo: val }))}
          />
          <Input
            label="Indicador Institucional"
            value={indicatorFormData.indicadorInstitucional}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, indicadorInstitucional: val }))}
          />
          <FilterSelect
            label="Unidad"
            options={['Porcentaje', 'Número', 'Monto']}
            value={indicatorFormData.unidad}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, unidad: val }))}
          />
          <FilterSelect
            label="Tipo de Valor"
            options={['Planificado', 'Real', 'Base']}
            value={indicatorFormData.tipoValor}
            onChange={(val) => setIndicatorFormData(p => ({ ...p, tipoValor: val }))}
          />
        </div>
      </Modal>
    </div>
  )
}
