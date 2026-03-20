import { useState, useMemo } from 'react'
import {
  ChevronRight,
} from 'lucide-react'
import { Badge } from '../../components/Badge/Badge'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { locationsData } from '../../data/mockData'
import type { LocationNode } from '../../data/types'
import styles from './LocationsView.module.css'

export function LocationsView() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['4', '4-4'])
  const [regionFilter, setRegionFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(nodeId => nodeId !== id) : [...prev, id]
    )
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
      // For country filter, we might need more complex logic if we want to filter the tree
      return true
    })
  }, [regionFilter, countryFilter])

  const renderNode = (node: LocationNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id)
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
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Ubicaciones</h1>
          <p className={styles.subtitle}>
            Visualización de ubicaciones disponibles
          </p>
        </div>
      </header>

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

      <footer className={styles.footer}>
        <div className={styles.pagination}>
          <span>Filas por página</span>
          <div className={styles.rowsSelect}>
            50 <span>⌄</span>
          </div>
        </div>
        <div className={styles.pageInfo}>
          Mostrando del 1-4 | Total: 4 Registros
          <div className={styles.navArrows}>
            <span className={styles.navArrow}>«</span>
            <span className={styles.navArrow}>‹</span>
            <span className={styles.pageNumber}>1/1</span>
            <span className={styles.navArrow}>›</span>
            <span className={styles.navArrow}>»</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
