import { useState, useMemo } from 'react'
import { 
  ChevronRight, 
  Eye, 
  Pencil, 
  Trash2, 
  Plus 
} from 'lucide-react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../components/Pagination/Pagination'
import { Badge } from '../../components/Badge/Badge'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { logicalFrameData } from '../../data/mockData'
import type { LogicalFrameTreeItem } from '../../data/types'
import styles from './LogicalFrameView.module.css'

export function LogicalFrameView() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([
    'group-og', 'og-1', 'group-oe', 'oe-1', 'group-r', 'r-1', 'group-act', 'act-1', 'group-subact'
  ])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [headerChecked, setHeaderChecked] = useState(false)
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [subprojectFilter, setSubprojectFilter] = useState('')

  const toggleNode = (id: string) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (headerChecked) {
      setSelectedIds(new Set())
      setHeaderChecked(false)
    } else {
      const allIds: string[] = []
      const collectIds = (items: LogicalFrameTreeItem[]) => {
        items.forEach(item => {
          allIds.push(item.id)
          if (item.children) collectIds(item.children)
        })
      }
      collectIds(logicalFrameData)
      setSelectedIds(new Set(allIds))
      setHeaderChecked(true)
    }
  }

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setHeaderChecked(false)
  }

  const filteredData = useMemo(() => {
    // Note: The tree structure is complex to filter deeply without a recursive search.
    // For now, we'll keep the full data but show how state would be managed.
    return logicalFrameData
  }, [programFilter, projectFilter, subprojectFilter])

  const getNewButtonLabel = (tipo: string) => {
    if (tipo === 'Objetivos Generales') return 'Nuevo Obj. General'
    if (tipo === 'Objetivos Específicos') return 'Nuevo Obj. Específico'
    if (tipo === 'Resultados') return 'Nuevo Resultado'
    if (tipo === 'Actividad') return 'Nueva Actividad'
    if (tipo === 'Subactividad') return 'Nueva Subactividad'
    return `Nuevo ${tipo}`
  }

  const renderRow = (item: LogicalFrameTreeItem, ancestors: boolean[] = [], isLast: boolean = false) => {
    const isExpanded = expandedNodes.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id} className={styles.rowGroup}>
        <div className={`${styles.tr} ${selectedIds.has(item.id) ? styles.rowSelected : ''}`}>
          <div className={styles.td} style={{ width: '48px', padding: '16px 0 16px 24px' }}>
            <Checkbox 
              checked={selectedIds.has(item.id)}
              onChange={() => handleSelectItem(item.id)}
            />
          </div>
          <div className={styles.td} style={{ width: '250px' }}>
            <div className={styles.hierarchy}>
              {ancestors.map((hasNext, idx) => (
                <span key={idx} className={styles.indent} data-line={hasNext ? 'true' : 'false'} />
              ))}
              <span className={styles.joint} data-line={isLast ? 'false' : 'true'} data-last={isLast ? 'true' : 'false'}>
                {hasChildren ? (
                  <ChevronRight 
                    size={16} 
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                    onClick={() => toggleNode(item.id)}
                  />
                ) : (
                  <span style={{ width: 16, height: 16, display: 'inline-block' }} />
                )}
              </span>
              <Badge variant={item.badgeVariant}>{item.tipo}</Badge>
            </div>
          </div>
          <div className={styles.td} style={{ width: '120px' }}>
            {item.codigo || ''}
          </div>
          <div className={styles.td} style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {item.nombre}
          </div>
          <div className={styles.td} style={{ width: '240px', textAlign: 'right' }}>
            <div className={styles.actions}>
              {item.isGroup ? (
                <button className={styles.newButton}>
                  <Plus size={14} /> {getNewButtonLabel(item.tipo)}
                </button>
              ) : (
                <>
                  <Eye size={18} className={styles.actionIcon} />
                  <Pencil size={18} className={styles.actionIcon} />
                  <Trash2 size={18} className={`${styles.actionIcon} ${styles.deleteIcon}`} />
                </>
              )}
            </div>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className={styles.children}>
            {item.children!.map((child, idx) => renderRow(child, [...ancestors, !isLast], idx === item.children!.length - 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Marco Lógico</h1>
          <p className={styles.subtitle}>Gestión de Objetivos, Resultados, Actividades y Subactividades</p>
        </div>
      </header>

      <Toolbar 
        onExport={() => {}} 
        onRefresh={() => {}}
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'nowrap', minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect 
              label="Programa" 
              options={['Programa 1', 'Programa 2']} 
              value={programFilter}
              onChange={setProgramFilter}
              width="100%"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect 
              label="Proyecto" 
              options={['Proyecto A', 'Proyecto B']} 
              value={projectFilter}
              onChange={setProjectFilter}
              width="100%"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <FilterSelect 
              label="Subproyecto" 
              options={['Sub 1', 'Sub 2']} 
              value={subprojectFilter}
              onChange={setSubprojectFilter}
              width="100%"
            />
          </div>
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <div className={styles.treeTable}>
          <div style={{ display: 'flex', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            <div className={styles.th} style={{ width: '48px', padding: '16px 0 16px 24px' }}>
              <Checkbox 
                checked={headerChecked}
                onChange={handleSelectAll}
              />
            </div>
            <div className={styles.th} style={{ width: '250px' }}>Tipo</div>
            <div className={styles.th} style={{ width: '120px' }}>Código</div>
            <div className={styles.th} style={{ flex: 1 }}>Nombre</div>
            <div className={styles.th} style={{ width: '240px', textAlign: 'right', paddingRight: '32px' }}>Acciones</div>
          </div>
          {filteredData.map((item, idx) => renderRow(item, [], idx === filteredData.length - 1))}
        </div>
      </div>

      <Pagination total={4} range="1-4" />
    </div>
  )
}
