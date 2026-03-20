import { useState, useMemo } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { Table } from '../../components/Table/Table'
import type { Column } from '../../components/Table/Table'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { StatusIndicator } from '../../components/StatusIndicator/StatusIndicator'
import { Button } from '../../components/Button/Button'
import { annualPlanningData, gapsData, strategicLinesData, projectCodesData, subprojectCodesData } from '../../data/mockData'
import type { AnnualPlanningItem } from '../../data/types'
import styles from './AnnualPlanningView.module.css'

export function AnnualPlanningView() {
  const [gapFilter, setGapFilter] = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [items, setItems] = useState<AnnualPlanningItem[]>(annualPlanningData)
  const [savedItems, setSavedItems] = useState<AnnualPlanningItem[]>(annualPlanningData)

  const uniqueCountries = useMemo(() => {
    const countries = items.map(i => i.ubicacion.split(',')[0]?.trim()).filter(Boolean) as string[]
    return Array.from(new Set(countries))
  }, [items])

  const availableLines = useMemo(() => {
    if (!gapFilter) return strategicLinesData.map(l => `${l.codigo} ${l.nombre}`)
    return strategicLinesData
      .filter(l => l.codigo.startsWith(`${gapFilter}.`))
      .map(l => `${l.codigo} ${l.nombre}`)
  }, [gapFilter])

  const handleGapChange = (val: string) => {
    setGapFilter(val)
    if (!val) return

    if (lineFilter) {
      const selectedLineCode = lineFilter.split(' ')[0]
      if (!selectedLineCode.startsWith(`${val}.`)) {
        setLineFilter('')
      }
    }
  }

  const handleLineChange = (val: string) => {
    setLineFilter(val)
    if (!val) return

    const selectedLineCode = val.split(' ')[0]
    const derivedGap = selectedLineCode.split('.')[0] || ''
    if (derivedGap && derivedGap !== gapFilter) {
      setGapFilter(derivedGap)
    }
  }

  type AnnualPlanningRow = {
    id: number
    ubicacion: string
    subproyecto: string
    gerenteSubproyecto: string
    responsableMeal: string
    linea: string
    tipologia: string
    financiadorPrincipal: string
    financiadoresSecundarios: string
    implementacion: AnnualPlanningItem['estado']
    meta: string
  }

  const filteredRows = useMemo<AnnualPlanningRow[]>(() => {
    return items
      .filter(item => {
        const lineCode = item.linea.split(' ')[0]
        const gapCode = lineCode.split('.')[0] || ''
        const country = item.ubicacion.split(',')[0]?.trim() || ''

        const matchGap = !gapFilter || gapCode === gapFilter
        const matchLine = !lineFilter || lineCode === lineFilter.split(' ')[0]
        const matchCountry = !countryFilter || country === countryFilter
        return matchGap && matchLine && matchCountry
      })
      .map(item => {
        const projectCode = item.proyecto.split('-')[0]?.trim() || ''
        const project = projectCodesData.find(p => p.codigo === projectCode)
        const subproject = subprojectCodesData.find(s => s.proyecto.startsWith(projectCode))

        const lineCode = item.linea.split(' ')[0]
        const line = strategicLinesData.find(l => l.codigo === lineCode)
        const lineaDisplay = line ? `${line.codigo} ${line.nombre}` : item.linea

        return {
          id: item.id,
          ubicacion: item.ubicacion,
          subproyecto: subproject ? `${subproject.codigo}-${subproject.nombre}` : '-',
          gerenteSubproyecto: '-',
          responsableMeal: '-',
          linea: lineaDisplay,
          tipologia: project?.tipologia || '-',
          financiadorPrincipal: subproject?.financiador || '-',
          financiadoresSecundarios: '-',
          implementacion: item.estado,
          meta: item.meta
        }
      })
  }, [items, gapFilter, lineFilter, countryFilter])

  const columns: Column<AnnualPlanningRow>[] = [
    { key: 'ubicacion', header: 'País / Región', width: '220px' },
    { key: 'subproyecto', header: 'Subproyecto', width: '350px' },
    { key: 'gerenteSubproyecto', header: 'Gerente subproyecto', width: '220px' },
    { key: 'responsableMeal', header: 'Responsable MEAL', width: '220px' },
    { key: 'linea', header: 'Línea estratégica', width: '450px' },
    { key: 'tipologia', header: 'Tipología de proyecto', width: '220px' },
    { key: 'financiadorPrincipal', header: 'Financiador principal', width: '220px' },
    { key: 'financiadoresSecundarios', header: 'Financiadores secundarios', width: '250px' },
    { 
      key: 'implementacion', 
      header: 'Implementación',
      width: '160px',
      sticky: 'right',
      render: (val, row) => (
        <StatusIndicator
          status={val}
          onChange={(next) => {
            setItems(prev => prev.map(it => it.id === row.id ? { ...it, estado: next } : it))
          }}
        />
      )
    },
    { 
      key: 'meta', 
      header: 'Meta anual',
      width: '140px',
      sticky: 'right',
      render: (val, row) => (
        <input
          type="text"
          value={val}
          className={styles.metaInput}
          onChange={(e) => {
            const next = e.target.value
            setItems(prev => prev.map(it => it.id === row.id ? { ...it, meta: next } : it))
          }}
        />
      )
    }
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '24px 32px 0' }}>
        <div style={{ borderLeft: '2px solid #ff7c56', paddingLeft: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Planificación Anual</h1>
          <p style={{ fontSize: '12px', color: '#a0a0a0', margin: '4px 0 0 0' }}>
            Gestión de Metas y Estados de Planificación
          </p>
        </div>
      </header>

      <Toolbar 
        onExport={() => {}} 
        onRefresh={() => {
          setGapFilter('')
          setLineFilter('')
          setCountryFilter('')
        }} 
        onFilterToggle={() => {}}
        onColumnToggle={() => {}}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterSelect 
            label="GAP" 
            options={gapsData.map(g => g.codigo)}
            value={gapFilter}
            onChange={handleGapChange}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterSelect 
            label="Línea Estratégica" 
            options={availableLines}
            value={lineFilter}
            onChange={handleLineChange}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterSelect 
            label="País" 
            options={uniqueCountries}
            value={countryFilter}
            onChange={setCountryFilter}
          />
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          data={filteredRows} 
          reorderableColumns
          fixedColumnKeys={['implementacion', 'meta']}
        />
      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={() => setItems(savedItems)}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={() => setSavedItems(items)}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
