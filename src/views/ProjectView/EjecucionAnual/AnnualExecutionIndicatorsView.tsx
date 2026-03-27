import { useState, useMemo, useRef } from 'react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Badge } from '../../../components/Badge/Badge'
import type { BadgeVariant } from '../../../components/Badge/Badge'
import type { Indicador } from '../../../data/types'
import {
  indicadoresData,
  planesAnualesData,
  unidadesData,
  tiposDeValorData,
  objGeneralData,
  objEspecificoData,
  resultadosData,
  institutionalIndicatorsData
} from '../../../data/mockData'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { Modal } from '../../../components/Modal/Modal'
import { Input } from '../../../components/Input/Input'
import { AlertModal } from '../../../components/AlertDialog/AlertModal'
import { Calculator } from 'lucide-react'
import styles from './AnnualExecutionIndicatorsView.module.css'

export function AnnualExecutionIndicatorsView() {
  const [localIndicadores, setLocalIndicadores] = useState<Indicador[]>(indicadoresData)
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Indicador | null>(null)
  const [editingIndicator, setEditingIndicator] = useState<Indicador | null>(null)
  const [indicatorForm, setIndicatorForm] = useState<Partial<Indicador>>({
    tipo: 'Indicador de Subproyecto',
    codigo: '',
    nombre: '',
    unidad: '',
    tipoValor: '',
    subproyecto: '',
    objetivoGeneral: '',
    objetivoEspecifico: '',
    resultado: ''
  })

  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false)
  const [formulaIndicator, setFormulaIndicator] = useState<Indicador | null>(null)

  const formulaRef = useRef<HTMLDivElement>(null)
  const [savedRange, setSavedRange] = useState<Range | null>(null)

  // Combined indicators for formula selection
  const allIndicatorsForFormula = useMemo(() => {
    const inst = institutionalIndicatorsData.map(i => ({
      id: `inst-${i.id}`,
      label: `${i.codigo} - ${i.nombre}`,
      original: i
    }))
    const local = localIndicadores.map(i => ({
      id: `local-${i.id}`,
      label: `${i.codigo} - ${i.nombre}`,
      original: i
    }))
    return [...inst, ...local]
  }, [localIndicadores])

  // Filter options from planesAnualesData
  const programOptions = useMemo(() =>
    [...new Set(planesAnualesData.map(p => p.programa))].sort(),
    []
  )

  const projectOptions = useMemo(() => {
    let base = planesAnualesData
    if (programFilter) base = base.filter(p => p.programa === programFilter)
    return [...new Set(base.map(p => p.proyecto))].sort()
  }, [programFilter])

  const subprojectOptions = useMemo(() => {
    let base = planesAnualesData
    if (programFilter) base = base.filter(p => p.programa === programFilter)
    if (projectFilter) base = base.filter(p => p.proyecto === projectFilter)
    return [...new Set(base.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`))].sort()
  }, [programFilter, projectFilter])

  // Handlers for hierarchical logic
  const handleProgramChange = (val: string) => {
    setProgramFilter(val)
    if (val && projectFilter) {
      const match = planesAnualesData.find(p => p.programa === val && p.proyecto === projectFilter)
      if (!match) {
        setProjectFilter('')
        setSubprojectFilter('')
      }
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
    let data = localIndicadores

    if (programFilter) {
      const validSubCodes = planesAnualesData
        .filter(p => p.programa === programFilter)
        .map(p => p.codigosubproyecto)
      data = data.filter(i => i.subproyecto && validSubCodes.includes(i.subproyecto))
    }

    if (projectFilter) {
      const validSubCodes = planesAnualesData
        .filter(p => p.proyecto === projectFilter)
        .map(p => p.codigosubproyecto)
      data = data.filter(i => i.subproyecto && validSubCodes.includes(i.subproyecto))
    }

    if (subprojectFilter) {
      const subCode = subprojectFilter.split(' - ')[0]
      data = data.filter(i => i.subproyecto === subCode)
    }

    return data
  }, [localIndicadores, programFilter, projectFilter, subprojectFilter])

  // Modal options
  const subprojectModalOptions = useMemo(() =>
    planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`).sort(),
    []
  )

  const ogOptionsForModal = useMemo(() =>
    objGeneralData.map(og => `${og.codigo} - ${og.nombre}`).sort(),
    []
  )

  const oeOptionsForModal = useMemo(() => {
    if (!indicatorForm.objetivoGeneral) return []
    return objEspecificoData
      .filter(oe => oe.objetivoGeneral === indicatorForm.objetivoGeneral)
      .map(oe => `${oe.codigo} - ${oe.nombre}`)
      .sort()
  }, [indicatorForm.objetivoGeneral])

  const resultadoOptionsForModal = useMemo(() => {
    if (!indicatorForm.objetivoEspecifico) return []
    return resultadosData
      .filter(r => r.objetivoEspecifico === indicatorForm.objetivoEspecifico)
      .map(r => `${r.codigo} - ${r.nombre}`)
      .sort()
  }, [indicatorForm.objetivoEspecifico])

  const handleNew = () => {
    setEditingIndicator(null)
    setIndicatorForm({
      tipo: 'Indicador de Subproyecto',
      codigo: '',
      nombre: '',
      unidad: '',
      tipoValor: '',
      subproyecto: subprojectFilter || '', // Pre-fill if filtered
      objetivoGeneral: '',
      objetivoEspecifico: '',
      resultado: ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item: Indicador) => {
    setEditingIndicator(item)
    setIndicatorForm({ ...item })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    const subprojectCode = indicatorForm.subproyecto
    const plan = planesAnualesData.find(p => p.codigosubproyecto === subprojectCode)

    if (editingIndicator) {
      const indicatorToSave: Indicador = {
        ...editingIndicator,
        ...indicatorForm,
        programa: plan?.programa || '',
        proyecto: plan?.proyecto || ''
      } as Indicador
      setLocalIndicadores(prev => prev.map(i => i.id === editingIndicator.id ? indicatorToSave : i))
    } else {
      const newId = Math.max(0, ...localIndicadores.map(i => i.id)) + 1
      const indicatorToSave: Indicador = {
        ...indicatorForm,
        id: newId,
        programa: plan?.programa || '',
        proyecto: plan?.proyecto || ''
      } as any
      setLocalIndicadores(prev => [...prev, indicatorToSave as Indicador])
    }
    setIsModalOpen(false)
  }

  const handleSaveFormula = () => {
    if (formulaIndicator && formulaRef.current) {
      // Parse HTML back to simple string format
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formulaRef.current.innerHTML;

      const badges = tempDiv.querySelectorAll(`.${styles.formulaTokenBadge}`);
      badges.forEach(badge => {
        const code = (badge as HTMLElement).dataset.code;
        badge.replaceWith(`[${code}]`);
      });

      let formulaString = tempDiv.innerText.replace(/\n/g, '').trim();
      // Ensure formula starts with =
      if (!formulaString.startsWith('=')) {
        formulaString = '=' + formulaString;
      }

      setLocalIndicadores(prev =>
        prev.map(i => i.id === formulaIndicator.id ? { ...i, formula: formulaString } : i)
      )
    }
    setIsFormulaModalOpen(false)
  }

  const handleFormulaIndicatorsChange = (selectedLabels: string[]) => {
    if (!formulaRef.current) return;

    // This is more of an "Insert" action or toggle
    const currentBadges = Array.from(formulaRef.current.querySelectorAll(`.${styles.formulaTokenBadge}`))
      .map(b => (b as HTMLElement).dataset.code)
      .filter((c): c is string => Boolean(c));

    selectedLabels.forEach(label => {
      const code = label.split(' - ')[0];
      if (!currentBadges.includes(code)) {
        insertBadge(code);
      }
    });

    const codesInLabels = selectedLabels.map(l => l.split(' - ')[0]);
    currentBadges.forEach(code => {
      if (!codesInLabels.includes(code)) {
        const badgeEls = formulaRef.current?.querySelectorAll(`[data-code="${code}"]`);
        badgeEls?.forEach((el: Element) => el.remove());
      }
    });
  }

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }
  }

  const insertBadge = (code: string) => {
    if (!formulaRef.current) return;

    formulaRef.current.focus();
    const selection = window.getSelection();
    if (savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range) return;

    const span = document.createElement('span');
    span.contentEditable = 'false';
    span.className = styles.formulaTokenBadge;
    span.dataset.code = code;
    span.innerHTML = `${code}<span class="${styles.tokenRemove}" style="cursor: pointer; margin-left: 6px;">×</span>`;

    // Manual listener for removal
    span.querySelector(`.${styles.tokenRemove}`)?.addEventListener('click', (e) => {
      e.stopPropagation();
      span.remove();
    });

    range.deleteContents();
    range.insertNode(span);

    const space = document.createTextNode('\u00A0');
    range.setStartAfter(span);
    range.insertNode(space);
    range.setStartAfter(space);

    selection?.removeAllRanges();
    selection?.addRange(range);
    setSavedRange(range.cloneRange());
  }

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent deleting the first '=' character
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const text = formulaRef.current?.innerText || '';

    if (e.key === 'Backspace' && range.startOffset === 1 && text.startsWith('=') && range.startContainer === formulaRef.current?.firstChild) {
      e.preventDefault();
    }
    if (e.key === 'Backspace' && text === '=' && range.startOffset === 1) {
      e.preventDefault();
    }
  }
  const handleDeleteClick = (item: Indicador) => {
    setItemToDelete(item)
    setShowDeleteAlert(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setLocalIndicadores(prev => prev.filter(i => i.id !== itemToDelete.id))
      setShowDeleteAlert(false)
      setItemToDelete(null)
    }
  }

  const isSaveDisabled = !indicatorForm.tipo || !indicatorForm.codigo || !indicatorForm.nombre || !indicatorForm.subproyecto

  const columns: Column<Indicador>[] = [
    { key: 'checkbox', header: '', width: '40px', sticky: 'left' },
    {
      key: 'tipo',
      header: 'Tipo',
      width: '180px',
      render: (val) => {
        let variant: BadgeVariant = 'indicador'
        if (val === 'Indicador de Objetivo General') variant = 'og'
        if (val === 'Indicador de Objetivo Específico') variant = 'oe'
        if (val === 'Indicador de Resultado') variant = 'result'
        if (val === 'Indicador de Subproyecto') variant = 'subact' // Reusing subact variant for subproject level
        return <Badge variant={variant}>{val}</Badge>
      }
    },
    { key: 'codigo', header: 'Código', width: '120px' },
    { key: 'nombre', header: 'Nombre', width: '300px' },
    { key: 'unidad', header: 'Unidad', width: '120px' },
    { key: 'tipoValor', header: 'Tipo de Valor', width: '120px' },
    { key: 'programa', header: 'Programa', width: '150px' },
    { key: 'proyecto', header: 'Proyecto', width: '150px' },
    { key: 'subproyecto', header: 'Subproyecto', width: '150px' },
    { key: 'objetivoGeneral', header: 'Obj. General', width: '250px' },
    { key: 'objetivoEspecifico', header: 'Obj. Específico', width: '250px' },
    { key: 'resultado', header: 'Resultado', width: '250px' },
    {
      key: 'id',
      header: 'Fórmulas',
      width: '100px',
      sticky: 'right',
      render: (_, item) => (
        <button
          className={styles.formulaAction}
          title="Configurar Fórmulas"
          onClick={() => {
            setFormulaIndicator(item)
            setTimeout(() => {
              if (formulaRef.current) {
                const formula = item.formula || '='
                const html = formula.replace(/\[(.*?)\]/g, (_, code) => {
                  return `<span contenteditable="false" class="${styles.formulaTokenBadge}" data-code="${code}">${code}<span class="${styles.tokenRemove}" style="cursor: pointer; margin-left: 6px; font-weight: bold;">×</span></span>`
                })
                formulaRef.current.innerHTML = html

                // Add click listeners to initial badges
                formulaRef.current.querySelectorAll(`.${styles.tokenRemove}`).forEach(btn => {
                  (btn as HTMLElement).addEventListener('click', (e: MouseEvent) => {
                    e.stopPropagation()
                      ; (btn as HTMLElement).parentElement?.remove()
                  })
                })
              }
            }, 0)
            setIsFormulaModalOpen(true)
          }}
        >
          <Calculator size={18} />
        </button>
      )
    },
    { key: 'actions', header: 'Acciones', width: '120px', sticky: 'right' },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Indicadores"
          subtitle="Gestión de Indicadores en Ejecución Anual"
        />
      </header>

      <Toolbar
        onNew={handleNew}
        onExport={() => { }}
        onRefresh={() => {
          setProgramFilter('')
          setProjectFilter('')
          setSubprojectFilter('')
        }}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
      >
        <div className={styles.filtersGroup}>
          <FilterSelect
            label="Programa"
            options={programOptions}
            value={programFilter}
            onChange={handleProgramChange}
            className={styles.filterItem}
          />
          <FilterSelect
            label="Proyecto"
            options={projectOptions}
            value={projectFilter}
            onChange={handleProjectChange}
            className={styles.filterItem}
          />
          <FilterSelect
            label="Subproyecto"
            options={subprojectOptions}
            value={subprojectFilter}
            onChange={handleSubprojectChange}
            className={styles.filterItem}
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          className={styles.indicadoresTable}
        />
        {filteredData.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No se encontraron indicadores para la selección actual.</p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />
      )}

      {/* Modal de Indicadores */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndicator ? 'Editar Indicador' : 'Nuevo Indicador'}
        subtitle="Ingresa todos los detalles técnicos y de jerarquía"
        onSave={handleSave}
        isSaveDisabled={isSaveDisabled}
        width="1420px"
      >
        <div className={styles.modalTwoColumns}>
          {/* Columna Izquierda: Datos Técnicos */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Datos Técnicos</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Tipo de Indicador"
                options={[
                  'Indicador de Subproyecto',
                  'Indicador de Objetivo General',
                  'Indicador de Objetivo Específico',
                  'Indicador de Resultado'
                ]}
                value={indicatorForm.tipo}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipo: val, objetivoGeneral: '', objetivoEspecifico: '', resultado: '' })}
                width="600px"
              />
              <Input
                label="Código"
                value={indicatorForm.codigo || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, codigo: val })}
              />
              <Input
                label="Nombre"
                value={indicatorForm.nombre || ''}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, nombre: val })}
              />
              <FilterSelect
                label="Unidad"
                options={unidadesData.map(u => u.nombre)}
                value={indicatorForm.unidad}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, unidad: val })}
                width="600px"
              />
              <FilterSelect
                label="Tipo de Valor"
                options={tiposDeValorData.map(t => t.nombre)}
                value={indicatorForm.tipoValor}
                onChange={(val) => setIndicatorForm({ ...indicatorForm, tipoValor: val })}
                width="600px"
              />
            </div>
          </div>

          {/* Columna Derecha: Jerarquía */}
          <div className={styles.modalColumn}>
            <div className={styles.columnHeader}>Jerarquía y Contexto</div>
            <div className={styles.modalFields}>
              <FilterSelect
                label="Subproyecto"
                options={subprojectModalOptions}
                value={indicatorForm.subproyecto ? `${indicatorForm.subproyecto} - ${planesAnualesData.find(p => p.codigosubproyecto === indicatorForm.subproyecto)?.subproyecto || ''}` : ''}
                onChange={(val) => {
                  const code = val.split(' - ')[0]
                  setIndicatorForm({ ...indicatorForm, subproyecto: code })
                }}
                width="600px"
              />

              {(indicatorForm.tipo === 'Indicador de Objetivo General' ||
                indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo General"
                    options={ogOptionsForModal}
                    value={indicatorForm.objetivoGeneral}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoGeneral: val, objetivoEspecifico: '', resultado: '' })}
                    width="600px"
                  />
                )}

              {(indicatorForm.tipo === 'Indicador de Objetivo Específico' ||
                indicatorForm.tipo === 'Indicador de Resultado') && (
                  <FilterSelect
                    label="Objetivo Específico"
                    options={oeOptionsForModal}
                    value={indicatorForm.objetivoEspecifico}
                    onChange={(val) => setIndicatorForm({ ...indicatorForm, objetivoEspecifico: val, resultado: '' })}
                    width="600px"
                  />
                )}

              {indicatorForm.tipo === 'Indicador de Resultado' && (
                <FilterSelect
                  label="Resultado"
                  options={resultadoOptionsForModal}
                  value={indicatorForm.resultado}
                  onChange={(val) => setIndicatorForm({ ...indicatorForm, resultado: val })}
                  width="600px"
                />
              )}
            </div>
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        variant="danger"
        title="¿Estás seguro de eliminar?"
        description="Esta acción eliminará el indicador de forma irreversible."
        primaryAction={{
          label: 'Eliminar',
          onClick: confirmDelete
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setShowDeleteAlert(false)
        }}
      />

      {/* Modal de Fórmulas */}
      <Modal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title={`Configurar Fórmula: ${formulaIndicator?.codigo || ''}`}
        subtitle="Construye tu fórmula personalizada arrastrando indicadores y escribiendo operadores"
        onSave={handleSaveFormula}
        width="900px"
      >
        <div className={styles.formulaModalContent}>

          <div className={styles.indicatorSelectorTop}>
            <FilterSelect
              label="Agregar Indicador"
              value={(() => {
                if (!formulaRef.current) return [];
                return Array.from(formulaRef.current.querySelectorAll(`.${styles.formulaTokenBadge}`))
                  .map(b => {
                    const code = (b as HTMLElement).dataset.code;
                    const match = allIndicatorsForFormula.find(i => i.original.codigo === code);
                    return match?.label || '';
                  }).filter(Boolean);
              })()}
              onChange={handleFormulaIndicatorsChange}
              options={allIndicatorsForFormula.map(i => i.label)}
              width="100%"
              isMulti={true}
            />
          </div>

          <div className={styles.formulaEditorBox}>
            <div
              ref={formulaRef}
              className={styles.formulaEditable}
              contentEditable
              onBlur={saveSelection}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onKeyDown={handleFormulaKeyDown}
            />
          </div>

          <p className={styles.formulaHint}>
            Puedes escribir operadores (+, -, *, /) y números directamente entre los indicadores.
          </p>
        </div>
      </Modal>
    </div>
  )
}
