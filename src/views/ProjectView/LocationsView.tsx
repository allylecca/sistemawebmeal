import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Badge } from '../../components/Badge/Badge'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Checkbox } from '../../components/Checkbox/Checkbox' 
import { locationsData } from '../../data/mockData'
import type { LocationNode } from '../../data/types'
import { PageHeader } from '../../components/PageTitle/PageTitle'
import { Button } from '../../components/Button/Button'
import { AlertModal } from '../../components/AlertDialog/AlertModal'
import styles from './LocationsView.module.css'

export function LocationsView() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['4', '4-4'])
  const [regionFilter, setRegionFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  
  // Estado para controlar el modal de éxito
  const [showConfirmSave, setShowConfirmSave] = useState(false)

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    )
  }

  const getAllIds = (node: LocationNode): string[] => {
    let ids = [node.id]
    if (node.children) {
      node.children.forEach(child => {
        ids = [...ids, ...getAllIds(child)]
      })
    }
    return ids
  }

  const handleCheckboxChange = (node: LocationNode, isChecked: boolean, e?: React.MouseEvent | React.ChangeEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation() 
    }
    
    const nodeAndChildrenIds = getAllIds(node)

    setSelectedNodes(prev => {
      if (isChecked) {
        return Array.from(new Set([...prev, ...nodeAndChildrenIds]))
      } else {
        return prev.filter(id => !nodeAndChildrenIds.includes(id))
      }
    })
  }

  const handleSave = () => {
    // Aquí iría tu lógica de guardado
    setShowConfirmSave(true)
  }

  const handleCancel = () => {
    setSelectedNodes([])
    setRegionFilter('')
    setCountryFilter('')
  }

  const uniqueRegions = useMemo(() => 
    Array.from(new Set(locationsData.filter(n => n.type === 'Region').map(n => n.label))), 
  [])
  
  const uniqueCountries = useMemo(() => {
    const countries: string[] = []
    locationsData.forEach(region => {
      if (region.children) {
        region.children.forEach(country => {
          if (country.type === 'País') countries.push(country.label)
        })
      }
    })
    return Array.from(new Set(countries))
  }, [])

  const filteredData = useMemo(() => {
    return locationsData.filter(node => {
      if (regionFilter && node.type === 'Region' && node.label !== regionFilter) return false
      return true
    })
  }, [regionFilter, countryFilter])

  const renderNode = (node: LocationNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id)
    const isSelected = selectedNodes.includes(node.id)
    const hasChildren = node.children && node.children.length > 0
    
    const badgeVariant = 
      node.type === 'Region' ? 'region' : 
      node.type === 'País' ? 'country' : 
      'dept'

    const badgeLabel = 
      node.type === 'Region' ? 'Región' : 
      node.type === 'País' ? 'País' : 
      'Departamento'

    return (
      <div key={node.id} className={styles.nodeGroup}>
        <div 
          className={styles.node} 
          style={{ paddingLeft: `${level * 32 + 24}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <div className={styles.nodeLeft}>
            <div className={styles.chevronContainer}>
              {hasChildren && (
                <ChevronRight 
                  size={16} 
                  className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                />
              )}
            </div>
            
            <div onClick={(e) => e.stopPropagation()} style={{ marginRight: '8px', display: 'flex' }}>
              <Checkbox 
                checked={isSelected}
                onChange={(e: any) => handleCheckboxChange(node, !isSelected, e)}
              />
            </div>
            
            <Badge variant={badgeVariant} className={styles.nodeBadge}>
              {badgeLabel}
            </Badge>
            
            <span className={styles.label}>{node.label}</span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className={styles.children}>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Ubicaciones"
          subtitle="Gestión de Ubicaciones del Marco Programático"
        />
      </header>

      {/* Toolbar Superior: Filtros */}
      <Toolbar 
        onExport={() => {}} 
        onRefresh={() => {
          setRegionFilter('')
          setCountryFilter('')
        }}
        onColumnToggle={() => {}}
      >
        <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
          <FilterSelect 
            label="Región" 
            options={uniqueRegions}
            value={regionFilter}
            onChange={setRegionFilter}
            width="100%"
          />
          <FilterSelect 
            label="País" 
            options={uniqueCountries}
            value={countryFilter}
            onChange={setCountryFilter}
            width="100%"
          />
        </div>
      </Toolbar>

      <div className={styles.content}>
        <div className={styles.treeHeader}>
          <div className={styles.headerCell}>
            NOMBRE <span className={styles.sortIcon}>↑↓</span>
          </div>
        </div>
        <div className={styles.treeBody}>
          {filteredData.map(node => renderNode(node))}
        </div>
      </div>

      {/* Toolbar Inferior: Acciones Finales */}
      <Toolbar>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </Toolbar>

      {/* Modal de éxito al Guardar */}
      <AlertModal
        isOpen={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        variant="success"
        title="Cambios guardados con éxito"
        description="Las ubicaciones seleccionadas han sido actualizadas"
        primaryAction={{
          label: 'Continuar',
          onClick: () => setShowConfirmSave(false)
        }}
      />
    </div>
  )
}