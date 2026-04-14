import { useState, useMemo, useEffect } from 'react'
import { Languages } from 'lucide-react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Input } from '../../../components/Input/Input'
import { Modal } from '../../../components/Modal/Modal'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { institutionalIndicatorsData, gapsData, strategicLinesData, unidadesData, tiposDeValorData } from '../../../data/mockData'
import type { InstitutionalIndicator } from '../../../data/types'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import styles from './InstitutionalIndicatorsView.module.css'

export function InstitutionalIndicatorsView() {
  const [gapFilter, setGapFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const resolveStrategicLineGap = (gapRef: string) => {
    if (typeof gapRef === 'string' && gapRef.startsWith('strategicLinesData[')) {
      const match = gapRef.match(/\[(\d+)\]/);
      if (match) {
        const idx = parseInt(match[1]);
        return strategicLinesData[idx]?.gap || gapRef;
      }
    }
    return gapRef;
  }

  const resolveStrategicLineNombre = (lineRef: string) => {
    if (typeof lineRef === 'string' && lineRef.startsWith('strategicLinesData[')) {
      const match = lineRef.match(/\[(\d+)\]/);
      if (match) {
        const idx = parseInt(match[1]);
        return strategicLinesData[idx]?.nombre || lineRef;
      }
    }
    return lineRef;
  }

  const [indicators, setIndicators] = useState<InstitutionalIndicator[]>(() =>
    institutionalIndicatorsData.map((ind, idx) => ({
      ...ind,
      gap: resolveStrategicLineGap(ind.gap),
      lineaEstrategica: resolveStrategicLineNombre(ind.lineaEstrategica || ''),
      tipoValor: ind.tipoValor || 'Numérico',
      unidad: ind.unidad || unidadesData[(idx % unidadesData.length)]?.nombre
    }))
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showVariants, setShowVariants] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<InstitutionalIndicator | null>(null)
  const [formData, setFormData] = useState({
    codigo: '',
    tipo: '',
    nombre: '',
    vares: '',
    varen: '',
    varfra: '',
    gap: '',
    lineaEstrategica: '',
    categoria: '',
    unidad: '',
    tipoValor: ''
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
    if (!formData.gap) return strategicLinesData.map(l => `${l.codigo} - ${l.nombre}`)
    return strategicLinesData.filter(l => l.gap === formData.gap).map(l => `${l.codigo} - ${l.nombre}`)
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
    const { categoria, tipo, codigo: currentCodigo } = formData;

    if (categoria && tipo) {
      const catCode = CATEGORIES[categoria as keyof typeof CATEGORIES];
      const typeCode = TYPES_MAP[tipo as keyof typeof TYPES_MAP];

      if (catCode && typeCode) {
        const prefix = `${catCode}-${typeCode}`;

        // 1. Si estamos editando y NO han cambiado la categoría ni el tipo, mantenemos el código original
        if (editingIndicator &&
          editingIndicator.categoria === categoria &&
          editingIndicator.tipo === tipo) {
          if (currentCodigo !== editingIndicator.codigo) {
            setFormData(prev => ({ ...prev, codigo: editingIndicator.codigo }));
          }
          return;
        }

        // 2. Lógica de correlativo:
        // Filtramos todos los indicadores que coincidan exactamente con la categoría y el tipo seleccionados
        const matches = indicators.filter(ind =>
          ind.categoria === categoria && ind.tipo === tipo
        );

        // 3. Generar número (01, 02, 03...)
        // Si es un registro nuevo, el número será matches.length + 1
        const nextNumber = (matches.length + 1).toString().padStart(2, '0');
        const newCode = `${prefix}-${nextNumber}`;

        // 4. Solo actualizar si el código generado es distinto al actual para evitar loops
        if (currentCodigo !== newCode) {
          setFormData(prev => ({ ...prev, codigo: newCode }));
        }
      }
    }
  }, [formData.categoria, formData.tipo, indicators, editingIndicator]);

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
        formData.vares === editingIndicator.vares &&
        formData.varen === editingIndicator.varen &&
        formData.varfra === editingIndicator.varfra
      )
    }
    return false
  }, [formData, editingIndicator])

  const filledVariantsCount = useMemo(() => {
    return (formData.vares ? 1 : 0) + (formData.varen ? 1 : 0) + (formData.varfra ? 1 : 0)
  }, [formData.vares, formData.varen, formData.varfra])

  const handleNew = () => {
    setEditingIndicator(null)
    setFormData({ codigo: '', tipo: '', nombre: '', vares: '', varen: '', varfra: '', gap: '', lineaEstrategica: '', categoria: '', unidad: '', tipoValor: '' })
    setShowVariants(false)
    setIsModalOpen(true)
  }

  const handleEdit = (item: InstitutionalIndicator) => {
    setEditingIndicator(item)
    // For mock data, we might not have all fields, so default them
    setFormData({
      codigo: item.codigo,
      tipo: item.tipo,
      nombre: item.nombre,
      vares: item.vares,
      varen: item.varen,
      varfra: item.varfra,
      gap: item.gap,
      lineaEstrategica: item.lineaEstrategica || '',
      categoria: item.categoria || '',
      unidad: item.unidad || '',
      tipoValor: item.tipoValor || 'Numérico'
    })
    setShowVariants(false)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    // Definimos el tipo para la categoría basándonos en las llaves de CATEGORIES
    type CategoriaType = keyof typeof CATEGORIES;

    if (editingIndicator) {
      setIndicators(indicators.map(i => i.id === editingIndicator.id ? {
        ...i,
        ...formData,
        // Forzamos el tipo de los literales para que TS no se queje
        tipo: formData.tipo as 'Indicador de Línea Estratégica' | 'Indicador de Resultado' | 'Indicador de Producto',
        categoria: formData.categoria as CategoriaType
      } : i))
    } else {
      const newIndicator: InstitutionalIndicator = {
        ...formData,
        id: Math.max(0, ...indicators.map(i => i.id)) + 1,
        tipo: formData.tipo as 'Indicador de Línea Estratégica' | 'Indicador de Resultado' | 'Indicador de Producto',
        categoria: formData.categoria as CategoriaType
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
    { key: 'nombre', header: 'Nombre' },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (val) => {
        // Seleccionamos la clase específica
        const specificClass =
          val === 'Indicador de Línea Estratégica' ? styles.badgeLinea :
            val === 'Indicador de Resultado' ? styles.badgeResul :
              styles.badgeProdu;

        // Combinamos la clase base (.badge) con la específica usando template strings
        return (
          <span className={`${styles.badge} ${specificClass}`}>
            {val}
          </span>
        )
      }
    },
    {
      key: 'unidad',
      header: 'Unidad',
      render: (val) => val || '-'
    },
    {
      key: 'tipoValor',
      header: 'Tipo de dato',
      render: (val) => val || 'Numérico'
    },
    { key: 'gap', header: 'GAP' },
    { key: 'lineaEstrategica', header: 'Línea estratégica' },
    { key: 'vares', header: 'Variante Español' },
    { key: 'varen', header: 'Variante Inglés' },
    { key: 'varfra', header: 'Variante Francés' },
    { key: 'actions', header: 'Acciones' },
  ]

  const indicatorTypes = Object.keys(TYPES_MAP)

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Nombres de Indicadores Institucionales"
          subtitle="Gestión de Nombres de Indicadores Institucionales del Marco Programático"
        />
      </header>

      <Toolbar
        onNew={handleNew}
        onExport={() => { }}
        onRefresh={() => {
          setGapFilter('')
          setTypeFilter('')
        }}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
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
        width="calc(100vw - 200px)"
      >
        <div style={{ display: 'grid', gridTemplateColumns: showVariants ? 'minmax(0, 1fr) minmax(0, 1fr)' : '1fr', gap: '32px', alignItems: 'stretch' }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0, border: '1px solid #eaeaea', borderRadius: '4px', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#382e2c', fontWeight: 500, marginBottom: '8px' }}>Información general</div>
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
              label="Categoría"
              options={Object.keys(CATEGORIES)}
              value={formData.categoria}
              onChange={(val) => setFormData({ ...formData, categoria: val })}
            />
            <FilterSelect
              label="Tipo de Indicador"
              options={Object.keys(TYPES_MAP)}
              value={formData.tipo}
              onChange={(val) => setFormData({ ...formData, tipo: val })}
            />
            <FilterSelect
              label="Unidad"
              options={unidadesData.map(u => u.nombre)}
              value={formData.unidad}
              onChange={(val) => setFormData({ ...formData, unidad: val })}
            />
            <FilterSelect
              label="Tipo de Dato"
              options={tiposDeValorData.map(t => t.nombre)}
              value={formData.tipoValor}
              onChange={(val) => setFormData({ ...formData, tipoValor: val })}
            />
            <Input
              label="Código de Indicador Institucional"
              value={formData.codigo}
              onChange={(val) => setFormData({ ...formData, codigo: val })}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(val) => setFormData({ ...formData, nombre: val })}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowVariants(!showVariants)}
                style={{
                  height: '40px',
                  width: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ffc25b',
                  backgroundColor: showVariants ? '#fff8eb' : 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  position: 'relative',
                  color: '#382e2c',
                  flexShrink: 0
                }}
                title="Variantes de idioma"
              >
                <Languages size={20} />
                {filledVariantsCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#ffc25b',
                    color: '#382e2c',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {filledVariantsCount}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Columna Derecha (Variantes) */}
          {showVariants && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, minHeight: 0, height: '100%', border: '1px solid #eaeaea', borderRadius: '4px', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#382e2c', fontWeight: 500, marginBottom: '8px' }}>Variantes de idioma</div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Input
                label="Variante Español"
                value={formData.vares}
                onChange={(val) => {
                  setFormData({ ...formData, vares: val })
                }}
                multiline
                grow
              />
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Input
                label="Variante Inglés"
                value={formData.varen}
                onChange={(val) => setFormData({ ...formData, varen: val })}
                multiline
                grow
              />
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <Input
                label="Variante Francés"
                value={formData.varfra}
                onChange={(val) => setFormData({ ...formData, varfra: val })}
                multiline
                grow
              />
            </div>
            </div>
          )}
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
