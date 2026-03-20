import { useState, useMemo, useEffect } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Badge } from '../../components/Badge/Badge'
import { Input } from '../../components/Input/Input'
import { Modal } from '../../components/Modal/Modal'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import { institutionalIndicatorsData, gapsData, strategicLinesData } from '../../data/mockData'
import type { InstitutionalIndicator } from '../../data/types'
import styles from './GapsView.module.css'

export function InstitutionalIndicatorsView() {
  const [gapFilter, setGapFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [indicators, setIndicators] = useState<InstitutionalIndicator[]>(institutionalIndicatorsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<InstitutionalIndicator | null>(null)
  const [formData, setFormData] = useState({ 
    codigo: '', 
    tipo: '', 
    nombre: '', 
    var1: '', 
    var2: '', 
    var3: '', 
    gap: '',
    lineaEstrategica: '',
    categoria: '' 
  })
  
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [indicatorToDelete, setIndicatorToDelete] = useState<InstitutionalIndicator | null>(null)

  const CATEGORIES = {
    'Protección': 'PROT',
    'Igualdad': 'IGUA',
    'Comunidades': 'CUPA',
    'Alimentación': 'ALIM',
    'Agua': 'AGUA',
    'Energía': 'ENER',
    'Educación': 'EDUC',
    'Cadena': 'CADE',
    'Humanitaria': 'HUMA',
    'Riesgo': 'RIES'
  }

  const TYPES_MAP = {
    'Indicador de Línea Estratégica': 'LE',
    'Indicador de Resultado': 'RI',
    'Indicador de Producto': 'PR'
  }

  // Cross-filtering logic for GAP and Strategic Line
  const availableLines = useMemo(() => {
    if (!formData.gap) return strategicLinesData.map(l => `${l.codigo} ${l.nombre}`)
    return strategicLinesData.filter(l => l.gap === formData.gap).map(l => `${l.codigo} ${l.nombre}`)
  }, [formData.gap])

  const handleLineChange = (lineValue: string) => {
    const codeCandidate = lineValue.split(' ')[0]
    const line = strategicLinesData.find(l => l.codigo === codeCandidate)
    if (line) {
      setFormData(prev => ({ ...prev, lineaEstrategica: lineValue, gap: line.gap }))
    } else {
      setFormData(prev => ({ ...prev, lineaEstrategica: '' }))
    }
  }

  // Auto-generate code
  useEffect(() => {
    if (formData.categoria && formData.tipo) {
      const catCode = CATEGORIES[formData.categoria as keyof typeof CATEGORIES]
      const typeCode = TYPES_MAP[formData.tipo as keyof typeof TYPES_MAP]
      
      if (catCode && typeCode) {
        const baseCode = `${catCode}-${typeCode}`
        setFormData(prev => {
          // Only update if it's not manually edited beyond the base code
          if (!prev.codigo.startsWith(baseCode)) {
            return { ...prev, codigo: baseCode }
          }
          return prev
        })
      }
    }
  }, [formData.categoria, formData.tipo])

  const filteredData = useMemo(() => {
    return indicators.filter(item => {
      const matchGap = !gapFilter || item.gap === gapFilter
      const matchType = !typeFilter || item.tipo === typeFilter
      return matchGap && matchType
    })
  }, [gapFilter, typeFilter, indicators])

  const isSaveDisabled = useMemo(() => {
    const isFilled = formData.codigo.trim() !== '' && formData.tipo.trim() !== '' && formData.nombre.trim() !== '' && formData.gap.trim() !== '' && formData.lineaEstrategica.trim() !== ''
    if (!isFilled) return true

    if (editingIndicator) {
      return (
        formData.codigo === editingIndicator.codigo &&
        formData.tipo === editingIndicator.tipo &&
        formData.nombre === editingIndicator.nombre &&
        formData.gap === editingIndicator.gap &&
        formData.lineaEstrategica === (editingIndicator.lineaEstrategica || '') &&
        formData.var1 === editingIndicator.var1 &&
        formData.var2 === editingIndicator.var2 &&
        formData.var3 === editingIndicator.var3
      )
    }
    return false
  }, [formData, editingIndicator])

  const handleNew = () => {
    setEditingIndicator(null)
    setFormData({ codigo: '', tipo: '', nombre: '', var1: '', var2: '', var3: '', gap: '', lineaEstrategica: '', categoria: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (item: InstitutionalIndicator) => {
    setEditingIndicator(item)
    // For mock data, we might not have all fields, so default them
    setFormData({ 
      codigo: item.codigo, 
      tipo: item.tipo, 
      nombre: item.nombre, 
      var1: item.var1, 
      var2: item.var2, 
      var3: item.var3, 
      gap: item.gap,
      lineaEstrategica: item.lineaEstrategica || '',
      categoria: '' 
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingIndicator) {
      setIndicators(indicators.map(i => i.id === editingIndicator.id ? { ...i, ...formData } : i))
    } else {
      const newIndicator: InstitutionalIndicator = {
        id: Math.max(0, ...indicators.map(i => i.id)) + 1,
        ...formData
      }
      setIndicators([...indicators, newIndicator])
    }
    setIsModalOpen(false)
    setShowConfirmSave(true)
  }

  const handleDelete = (item: InstitutionalIndicator) => {
    setIndicatorToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (indicatorToDelete) {
      setIndicators(indicators.filter(i => i.id !== indicatorToDelete.id))
    }
    setShowDeleteAlert(false)
    setIndicatorToDelete(null)
  }

  const columns: Column<InstitutionalIndicator>[] = [
    { key: 'checkbox', header: '' },
    { key: 'codigo', header: 'Código' },
    { 
      key: 'tipo', 
      header: 'Tipo',
      render: (val) => (
        <Badge variant={val === 'Indicador de Línea Estratégica' ? 'line' : val === 'Indicador de Resultado' ? 'result' : 'product'}>
          {val}
        </Badge>
      )
    },
    { key: 'nombre', header: 'Nombre' },
    { key: 'var1', header: 'Variante Español' },
    { key: 'var2', header: 'Variante Inglés' },
    { key: 'var3', header: 'Variante Francés' },
    { key: 'lineaEstrategica', header: 'Línea estratégica' },
    { key: 'gap', header: 'GAP' },
    { key: 'actions', header: 'Acciones' },
  ]

  const indicatorTypes = Object.keys(TYPES_MAP)

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Indicadores Institucionales</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Indicadores del Marco Programático
          </p>
        </div>
      </header>

      <Toolbar 
        onNew={handleNew} 
        onExport={() => {}} 
        onRefresh={() => {
          setGapFilter('')
          setTypeFilter('')
        }} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="GAP" 
            options={gapsData.map(g => g.nombre)}
            value={gapFilter}
            onChange={setGapFilter}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FilterSelect 
            label="Tipo" 
            options={indicatorTypes}
            value={typeFilter}
            onChange={setTypeFilter}
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
        title={editingIndicator ? 'Editar indicador institucional' : 'Crear nuevo indicador institucional'}
        subtitle="Ingresa todos los detalles"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
        width="800px"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', alignItems: 'stretch' }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
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
            <FilterSelect 
              label="Tipo de Indicador"
              options={Object.keys(TYPES_MAP)}
              value={formData.tipo}
              onChange={(val) => setFormData({ ...formData, tipo: val })}
            />
            <FilterSelect 
              label="Categoría"
              options={Object.keys(CATEGORIES)}
              value={formData.categoria}
              onChange={(val) => setFormData({ ...formData, categoria: val })}
            />
            <Input 
              label="Nombre"
              value={formData.nombre}
              onChange={(val) => setFormData({ ...formData, nombre: val })}
            />
            <Input 
              label="Código de Indicador Institucional"
              value={formData.codigo}
              onChange={() => {}}
              disabled
            />
          </div>

          {/* Columna Derecha (Variantes) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0, height: '100%' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Input 
                label="Variante Español"
                value={formData.var1}
                onChange={(val) => {
                  setFormData({ ...formData, var1: val })
                }}
                multiline
                grow
              />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Input 
                label="Variante Inglés"
                value={formData.var2}
                onChange={(val) => setFormData({ ...formData, var2: val })}
                multiline
                grow
              />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Input 
                label="Variante Francés"
                value={formData.var3}
                onChange={(val) => setFormData({ ...formData, var3: val })}
                multiline
                grow
              />
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
