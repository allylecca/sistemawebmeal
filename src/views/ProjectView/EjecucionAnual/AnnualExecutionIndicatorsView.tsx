import { useState, useMemo } from 'react'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Badge } from '../../../components/Badge/Badge'
import type { BadgeVariant } from '../../../components/Badge/Badge'
import { annualExecutionIndicatorsData } from '../../../data/mockData'
import type { AnnualExecutionIndicator } from '../../../data/types'
import styles from './AnnualExecutionIndicatorsView.module.css'

export function AnnualExecutionIndicatorsView() {
  const [typeFilter, setTypeFilter] = useState('')

  const filteredData = useMemo(() => {
    if (!typeFilter) return annualExecutionIndicatorsData
    return annualExecutionIndicatorsData.filter(item => item.tipo === typeFilter)
  }, [typeFilter])

  const columns: Column<AnnualExecutionIndicator>[] = [
    { key: 'checkbox', header: '' },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (val) => {
        let variant: BadgeVariant = 'indicador'
        if (val === 'Resultado') variant = 'resultado-indicador'
        if (val === 'Objetivo') variant = 'objetivo-indicador'
        return <Badge variant={variant}>{val.substring(0, 5)}...</Badge>
      }
    },
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'unidad', header: 'Unidad' },
    { key: 'tipoValor', header: 'Tipo de Valor' },
    {
      key: 'id',
      header: 'Permisos',
      render: () => (
        <button className={styles.formulaButton}>
          <span className={styles.formulaIcon}>Σ</span> Fórmulas
        </button>
      )
    },
    { key: 'actions', header: 'Acciones' },
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Indicadores</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Indicadores en Ejecución Anual
          </p>
        </div>
      </header>

      <Toolbar
        onNew={() => { }}
        onExport={() => { }}
        onRefresh={() => setTypeFilter('')}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
      >
        <div style={{ flex: 1 }}>
          <FilterSelect
            label="Tipo de Indicador"
            options={Array.from(new Set(annualExecutionIndicatorsData.map(i => i.tipo)))}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          data={filteredData}
          onEdit={() => { }}
          onDelete={() => { }}
        />
      </div>

      <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />
    </div>
  )
}
