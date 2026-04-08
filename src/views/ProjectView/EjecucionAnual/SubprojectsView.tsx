import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Eye, EllipsisVertical, RotateCcw, Download, Table as TableIcon, Upload, FileText, FileSpreadsheet, File, Trash2 } from 'lucide-react'
import {
  planesAnualesData,
  strategicLinesData,
  gerentesData,
  responsablesMealData,
  implementadoresData,
  financiadoresData,
  locationsData,
  institutionalIndicatorsData,
  unidadesData,
  tiposDeValorData
} from '../../../data/mockData'
import type { PlanAnual } from '../../../data/types'
import { Modal } from '../../../components/Modal/Modal'
import { Input } from '../../../components/Input/Input'
import { Badge } from '../../../components/Badge/Badge'
import styles from './SubprojectsView.module.css'
import { LogicalFrameView } from './LogicalFrameView'

const ActionMenu = ({ onInfoGeneral, onMarcoLogico, onDocumentacion }: { onInfoGeneral: () => void, onMarcoLogico: () => void, onDocumentacion: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom,
          right: document.documentElement.clientWidth - rect.right
        })
      }
    }
    updatePosition()
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target)) return
      if (menuRef.current && !menuRef.current.contains(target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside, true)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top + 4}px`,
    right: `${position.right}px`,
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    padding: '8px 0',
    zIndex: 100,
    minWidth: '220px',
    display: 'flex',
    flexDirection: 'column'
  }

  const itemStyle: React.CSSProperties = {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    color: '#382e2c',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left'
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(v => !v) }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#a0a0a0',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
        title="Más acciones"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <EllipsisVertical size={18} />
      </button>
      {isOpen && createPortal(
        <div ref={menuRef} style={menuStyle}>
          <button style={itemStyle} onClick={() => { setIsOpen(false); onInfoGeneral() }}>Información general</button>
          <button style={itemStyle} onClick={() => { setIsOpen(false); onDocumentacion() }}>Documentación</button>
          <button style={itemStyle} onClick={() => { setIsOpen(false); onMarcoLogico() }}>Marco Lógico</button>
          <button style={itemStyle} onClick={() => setIsOpen(false)}>Ver dashboard</button>
        </div>,
        document.body
      )}
    </>
  )
}

export function SubprojectsView() {
  const [viewMode, setViewMode] = useState<'list' | 'marco'>('list')
  const [selectedItem, setSelectedItem] = useState<PlanAnual | null>(null)
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false)
  const [infoForm, setInfoForm] = useState({
    gerenteSubproyecto: '',
    responsableMeal: '',
    inicioMes: '',
    inicioAno: '2027',
    finMes: '',
    finAno: '',
    implementadores: [] as string[],
    financiadoresSecundarios: [] as string[],
    ubicaciones: [] as Array<{ id: number, region: string, pais: string, departamento: string, provincia: string, distrito: string }>
  })
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<PlanAnual | null>(null)

  const getInitialIndicators = (lineaNombre: string) => {
    const lineObj = strategicLinesData.find(l => l.nombre === lineaNombre || `${l.codigo} - ${l.nombre}` === lineaNombre)
    const findBest = (tipo: string, excludeIds: number[] = []) => {
      const candidates = institutionalIndicatorsData.filter(i => i.tipo === tipo && !excludeIds.includes(i.id))
      let match = candidates.find(i => i.lineaEstrategica === lineObj?.nombre)
      if (!match && lineObj) {
        match = candidates.find(i => i.nombre.includes(lineObj.nombre))
      }
      return match || candidates[0]
    }
    const base: any[] = []
    const le = findBest('Indicador de Línea Estratégica')
    base.push({ id: 1, tipo: 'Indicador de Línea Estratégica', indicador: le ? `${le.codigo} - ${le.nombre}` : 'LE', unidad: le?.unidad || unidadesData[0]?.nombre || 'Personas', tipoValor: le?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico', y2026: '2 300' })
    const res = findBest('Indicador de Resultado')
    base.push({ id: 2, tipo: 'Indicador de Resultado', indicador: res ? `${res.codigo} - ${res.nombre}` : 'Res', unidad: res?.unidad || unidadesData[0]?.nombre || 'Personas', tipoValor: res?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico', y2026: '2 500' })
    const prod1 = findBest('Indicador de Producto')
    base.push({ id: 3, tipo: 'Indicador de Producto', indicador: prod1 ? `${prod1.codigo} - ${prod1.nombre}` : 'Prod1', unidad: prod1?.unidad || unidadesData[0]?.nombre || 'Personas', tipoValor: prod1?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico', y2026: '2 400' })
    const prod2 = findBest('Indicador de Producto', [prod1?.id].filter(Boolean) as number[])
    base.push({ id: 4, tipo: 'Indicador de Producto', indicador: prod2 ? `${prod2.codigo} - ${prod2.nombre}` : 'Prod2', unidad: prod2?.unidad || unidadesData[0]?.nombre || 'Personas', tipoValor: prod2?.tipoValor || tiposDeValorData[0]?.nombre || 'Numérico', y2026: '2 200' })
    return base
  }

  const programOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.programa))].sort(),
    []
  )
  const projectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.proyecto))].sort(),
    []
  )
  const subprojectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`))].sort(),
    []
  )

  const handleProgramChange = (val: string) => {
    setProgramFilter(val)
    if (val && projectFilter) {
      const match = planesAnualesData.find(p => p.programa === val && p.proyecto === projectFilter)
      if (!match) {
        setProjectFilter('')
        setSubprojectFilter('')
      }
    }
    if (val && subprojectFilter) {
      const subLabel = subprojectFilter
      const match = planesAnualesData.find(p => p.programa === val && `${p.codigosubproyecto} - ${p.subproyecto}` === subLabel)
      if (!match) setSubprojectFilter('')
    }
  }

  const handleProjectChange = (val: string) => {
    setProjectFilter(val)
    if (val) {
      const plan = planesAnualesData.find(p => p.proyecto === val)
      if (plan) setProgramFilter(plan.programa)
      if (subprojectFilter) {
        const match = planesAnualesData.find(p => p.proyecto === val && `${p.codigosubproyecto} - ${p.subproyecto}` === subprojectFilter)
        if (!match) setSubprojectFilter('')
      }
    }
  }

  const handleSubprojectChange = (val: string) => {
    setSubprojectFilter(val)
    if (val) {
      const plan = planesAnualesData.find(p => `${p.codigosubproyecto} - ${p.subproyecto}` === val)
      if (plan) {
        setProgramFilter(plan.programa)
        setProjectFilter(plan.proyecto)
      }
    }
  }

  const filteredData = useMemo(() => {
    return planesAnualesData.filter(p => {
      const byProgram = programFilter ? p.programa === programFilter : true
      const byProject = projectFilter ? p.proyecto === projectFilter : true
      const bySubproject = subprojectFilter ? `${p.codigosubproyecto} - ${p.subproyecto}` === subprojectFilter : true
      const byApproved = p.estado === 'Aprobado'
      return byProgram && byProject && bySubproject && byApproved
    })
  }, [programFilter, projectFilter, subprojectFilter])

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const gerenteOptions = useMemo(() => gerentesData.map(g => g.nombre), [])
  const responsableMealOptions = useMemo(() => responsablesMealData.map(r => r.nombre), [])
  const implementadorOptions = useMemo(() => implementadoresData.map(i => i.nombre), [])
  const financiadorSecundarioOptions = useMemo(() => financiadoresData.map(f => f.nombre), [])
  const getRegionesOptions = () => locationsData.map(l => l.label)
  const getPaisesOptions = (regionLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    return region?.children?.map(p => p.label) || []
  }
  const getDptosOptions = (regionLabel: string, paisLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    return pais?.children?.map(d => d.label) || []
  }
  const getProvinciasOptions = (regionLabel: string, paisLabel: string, dptoLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    const dpto = pais?.children?.find(d => d.label === dptoLabel)
    return dpto?.children?.map(pr => pr.label) || []
  }
  const getDistritosOptions = (regionLabel: string, paisLabel: string, dptoLabel: string, provLabel: string) => {
    const region = locationsData.find(r => r.label === regionLabel)
    const pais = region?.children?.find(p => p.label === paisLabel)
    const dpto = pais?.children?.find(d => d.label === dptoLabel)
    const prov = dpto?.children?.find(pr => pr.label === provLabel)
    return prov?.children?.map(di => di.label) || []
  }
  const handleUbiChange = (id: number, field: string, value: string) => {
    setInfoForm(p => ({
      ...p,
      ubicaciones: p.ubicaciones.map(u => {
        if (u.id === id) {
          const newU = { ...u, [field]: value } as any
          if (field === 'region') { newU.pais = ''; newU.departamento = ''; newU.provincia = ''; newU.distrito = '' }
          if (field === 'pais') { newU.departamento = ''; newU.provincia = ''; newU.distrito = '' }
          if (field === 'departamento') { newU.provincia = ''; newU.distrito = '' }
          if (field === 'provincia') { newU.distrito = '' }
          return newU
        }
        return u
      })
    }))
  }

  const columns: Column<PlanAnual>[] = [
    { key: 'codigosubproyecto', header: 'CÓDIGO' },
    { key: 'subproyecto', header: 'SUBPROYECTO' },
    { key: 'financiadorprincipal', header: 'FINANCIADOR PRINCIPAL' },
    { key: 'programa', header: 'PROGRAMA' },
    { key: 'proyecto', header: 'PROYECTO' },
    { key: 'gap', header: 'GAP' },
    { 
      key: 'linea', 
      header: 'LÍNEA ESTRATÉGICA',
      render: (val: string) => {
        const line = strategicLinesData.find(l => l.nombre === val)
        return line ? `${line.codigo} - ${line.nombre}` : val
      }
    },
    {
      key: 'actions',
      header: 'ACCIONES',
      sticky: 'right',
      width: '80px',
      render: (_: any, item: PlanAnual) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setDetailItem(item); setIsDetailModalOpen(true) }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a0a0a0',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            title="Ver detalle"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Eye size={18} />
          </button>
          <ActionMenu onInfoGeneral={() => {
            setInfoForm({
              gerenteSubproyecto: '',
              responsableMeal: '',
              inicioMes: '',
              inicioAno: '2027',
              finMes: '',
              finAno: '',
              implementadores: [],
              financiadoresSecundarios: [],
              ubicaciones: []
            })
            setIsInfoModalOpen(true)
          }} onMarcoLogico={() => { setSelectedItem(item); setViewMode('marco') }} onDocumentacion={() => setIsDocsModalOpen(true)} />
        </div>
      )
    }
  ]

  if (viewMode === 'marco') {
    return (
      <div className={styles.root}>
        <header style={{ padding: '16px 16px 0' }}>
          <PageHeader
            title="Subproyectos > Marco lógico"
            subtitle={<span style={{ cursor: 'pointer', color: '#db5e4e', fontWeight: 600, display: 'inline-block', marginTop: '4px' }} onClick={() => setViewMode('list')}>Regresar</span>}
          />
        </header>

        <div style={{
          margin: '16px 32px 0',
          background: '#fff',
          border: '1px solid #eaeaea',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          padding: '24px 24px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Subproyecto"
                value={selectedItem ? `${selectedItem.codigosubproyecto} - ${selectedItem.subproyecto}` : ''}
                onChange={() => { }}
                disabled
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
              <button style={{
                background: 'none',
                border: '1px solid #eaeaea',
                borderRadius: '4px',
                padding: '8px',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TableIcon size={18} />
              </button>
              <button style={{
                background: 'none',
                border: '1px solid #eaeaea',
                borderRadius: '4px',
                padding: '8px',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RotateCcw size={18} />
              </button>
              <button style={{
                backgroundColor: 'white',
                border: '1px solid #ffc25b',
                borderRadius: '20px',
                padding: '8px 20px',
                color: '#382e2c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                <Download size={18} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div style={{ 
          margin: '0 32px 32px', 
          background: '#fff', 
          border: '1px solid #eaeaea', 
          borderTop: 'none', 
          borderRadius: '0 0 8px 8px', 
          flex: 1, 
          minHeight: 0, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden' 
        }}>
          <LogicalFrameView
            isEmbedded={true}
            initialSubproject={selectedItem ? `${selectedItem.codigosubproyecto} - ${selectedItem.subproyecto}` : ''}
          />
        </div>


      </div>
    )
  }

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Subproyectos"
          subtitle="Listado y filtrado de subproyectos"
        />
      </header>

      <Toolbar onNew={undefined} onExport={() => { }} onRefresh={() => { setProgramFilter(''); setProjectFilter(''); setSubprojectFilter('') }} onFilterToggle={() => { }} onColumnToggle={() => { }}>
        <div className={styles.filtersGroup}>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Programa"
              options={programOptions}
              value={programFilter}
              onChange={handleProgramChange}
            />
          </div>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Proyecto"
              options={projectOptions}
              value={projectFilter}
              onChange={handleProjectChange}
            />
          </div>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Subproyecto"
              options={subprojectOptions}
              value={subprojectFilter}
              onChange={handleSubprojectChange}
            />
          </div>
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table columns={columns} data={filteredData} />
      </div>

      <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />

      {/* MODAL DE VISUALIZACIÓN DE DETALLE */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Información del subproyecto"
        subtitle="Se muestra la información general del subproyecto"
        onSave={() => {}}
        showFooter={false}
        width="calc(100vw - 200px)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: '#db5e4e', marginBottom: '24px', fontWeight: 600 }}>1. Información del subproyecto</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Información general</div>
                <Input label="Programa" value={detailItem?.programa || ''} onChange={() => {}} disabled />
                <Input label="Proyecto" value={detailItem?.proyecto || ''} onChange={() => {}} disabled />
                <Input label="Subproyecto" value={detailItem?.subproyecto || ''} onChange={() => {}} disabled />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Relación jerárquica</div>
                <Input label="GAP" value={detailItem?.gap || ''} onChange={() => {}} disabled />
                <Input label="Línea Estratégica" value={detailItem?.linea || ''} onChange={() => {}} disabled />
                <Input label="Código" value={detailItem?.codigosubproyecto || ''} onChange={() => {}} disabled />
                <Input label="Financiador principal" value={detailItem?.financiadorprincipal || ''} onChange={() => {}} disabled />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', color: '#db5e4e', marginBottom: '24px', fontWeight: 600 }}>2. Indicadores y metas</h3>
            <div style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
              <Table 
                columns={[
                  { key: 'indicador', header: 'INDICADOR' },
                  { 
                    key: 'tipo', 
                    header: 'TIPO',
                    render: (val: string) => {
                      let variant: any = 'line'
                      if (val.includes('Resultado')) variant = 'result'
                      if (val.includes('Producto')) variant = 'product'
                      return <Badge variant={variant}>{val.replace('Indicador de ', '')}</Badge>
                    }
                  },
                  { key: 'unidad', header: 'UNIDAD' },
                  { key: 'tipoValor', header: 'TIPO DE VALOR' },
                  { 
                    key: 'y2026', 
                    header: '2026',
                    render: (val: string) => (
                      <div style={{ 
                        border: '1px solid #eaeaea', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f9f9f9',
                        textAlign: 'right',
                        fontSize: '13px',
                        minWidth: '80px'
                      }}>
                        {val}
                      </div>
                    )
                  }
                ]}
                data={detailItem ? getInitialIndicators(detailItem.linea) : []}
              />
              <div style={{ padding: '12px 16px', borderTop: '1px solid #eaeaea', fontSize: '12px', color: '#666', backgroundColor: '#fafafa' }}>
                Mostrando del 1-4 | Total: 4 Registros
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="Información general"
        subtitle="Ingresa todos los detalles"
        onSave={() => setIsInfoModalOpen(false)}
        width="calc(100vw - 200px)"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Información general</div>
            <FilterSelect
              label="Gerente de Subproyecto"
              options={gerenteOptions}
              value={infoForm.gerenteSubproyecto}
              onChange={(v) => setInfoForm(p => ({ ...p, gerenteSubproyecto: v as string }))}
            />
            <FilterSelect
              label="Responsable MEAL"
              options={responsableMealOptions}
              value={infoForm.responsableMeal}
              onChange={(v) => setInfoForm(p => ({ ...p, responsableMeal: v as string }))}
            />
            <div>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha inicio</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <FilterSelect label="Mes" options={meses} value={infoForm.inicioMes} onChange={(v) => setInfoForm(p => ({ ...p, inicioMes: v as string }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <Input label="Año" value={infoForm.inicioAno} onChange={() => { }} disabled />
                </div>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Fecha fin</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <FilterSelect label="Mes" options={meses} value={infoForm.finMes} onChange={(v) => setInfoForm(p => ({ ...p, finMes: v as string }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <FilterSelect label="Año" options={['2027', '2028', '2029', '2030']} value={infoForm.finAno} onChange={(v) => setInfoForm(p => ({ ...p, finAno: v as string }))} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginBottom: '8px' }}>Asociaciones</div>
            <FilterSelect
              label="Implementadores"
              options={implementadorOptions}
              value={infoForm.implementadores}
              onChange={(v) => setInfoForm(p => ({ ...p, implementadores: v as string[] }))}
              isMulti
            />
            <FilterSelect
              label="Financiadores Secundarios"
              options={financiadorSecundarioOptions}
              value={infoForm.financiadoresSecundarios}
              onChange={(v) => setInfoForm(p => ({ ...p, financiadoresSecundarios: v as string[] }))}
              isMulti
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '0px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Ubicaciones</span>
              <button onClick={() => setInfoForm(p => ({
                ...p,
                ubicaciones: [...p.ubicaciones, { id: Date.now(), region: '', pais: '', departamento: '', provincia: '', distrito: '' }]
              }))} style={{ padding: '0', fontSize: '20px', color: '#333', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {infoForm.ubicaciones.length === 0 && <p style={{ fontSize: '12px', color: '#999' }}>Ninguna ubicación agregada</p>}
              {infoForm.ubicaciones.map((ubi) => (
                <div key={ubi.id} style={{ display: 'flex', gap: '12px', border: '1px solid #eee', padding: '16px', borderRadius: '8px', backgroundColor: '#fafafa', position: 'relative' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <FilterSelect label="Región" options={getRegionesOptions()} value={ubi.region} onChange={v => handleUbiChange(ubi.id, 'region', v as string)} />
                    {ubi.region && getPaisesOptions(ubi.region).length > 0 && <FilterSelect label="País" options={getPaisesOptions(ubi.region)} value={ubi.pais} onChange={v => handleUbiChange(ubi.id, 'pais', v as string)} />}
                    {ubi.pais && getDptosOptions(ubi.region, ubi.pais).length > 0 && <FilterSelect label="Departamento" options={getDptosOptions(ubi.region, ubi.pais)} value={ubi.departamento} onChange={v => handleUbiChange(ubi.id, 'departamento', v as string)} />}
                    {ubi.departamento && getProvinciasOptions(ubi.region, ubi.pais, ubi.departamento).length > 0 && <FilterSelect label="Provincia" options={getProvinciasOptions(ubi.region, ubi.pais, ubi.departamento)} value={ubi.provincia} onChange={v => handleUbiChange(ubi.id, 'provincia', v as string)} />}
                    {ubi.provincia && getDistritosOptions(ubi.region, ubi.pais, ubi.departamento, ubi.provincia).length > 0 && <FilterSelect label="Distrito" options={getDistritosOptions(ubi.region, ubi.pais, ubi.departamento, ubi.provincia)} value={ubi.distrito} onChange={v => handleUbiChange(ubi.id, 'distrito', v as string)} />}
                  </div>
                  <button onClick={() => setInfoForm(p => ({ ...p, ubicaciones: p.ubicaciones.filter(u => u.id !== ubi.id) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', height: 'fit-content', marginTop: '8px' }}>
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
      </Modal>

      {/* MODAL DE DOCUMENTACIÓN */}
      <Modal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        title="Documentación de formulación"
        showFooter={false}
        onSave={() => {}}
        width="600px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px' }}>
          {/* DRAG AND DROP AREA */}
          <div style={{
            border: '2px dashed #e0e0e0',
            borderRadius: '8px',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            backgroundColor: '#fafafa',
            cursor: 'pointer'
          }}>
            <Upload size={32} color="#666" />
            <div style={{ fontSize: '14px', color: '#333' }}>
              Arrastra archivos aquí o <span style={{ color: '#db5e4e', textDecoration: 'underline' }}>selecciona desde tu equipo</span>
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Formatos permitidos: .pdf, .docx, .xlsx
            </div>
          </div>

          {/* LIST OF DOCUMENTS */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>Documentos (3)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', gap: '16px' }}>
                <FileText size={20} color="#db5e4e" />
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#333' }}>Marco Lógico v2.pdf</div>
                <div style={{ fontSize: '12px', color: '#888' }}>2.4 MB</div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Download size={16} color="#db5e4e" /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Trash2 size={16} color="#db5e4e" /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', gap: '16px' }}>
                <FileSpreadsheet size={20} color="#2eaa63" />
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#333' }}>Presupuesto_2024.xlsx</div>
                <div style={{ fontSize: '12px', color: '#888' }}>1.1 MB</div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Download size={16} color="#db5e4e" /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Trash2 size={16} color="#db5e4e" /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', gap: '16px' }}>
                <File size={20} color="#4582eb" />
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#333' }}>Formulación_narrativa.docx</div>
                <div style={{ fontSize: '12px', color: '#888' }}>850 KB</div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Download size={16} color="#db5e4e" /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Trash2 size={16} color="#db5e4e" /></button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0', paddingTop: '16px', marginTop: '8px' }}>
            <button 
              onClick={() => setIsDocsModalOpen(false)}
              style={{
                padding: '8px 24px',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#333',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
