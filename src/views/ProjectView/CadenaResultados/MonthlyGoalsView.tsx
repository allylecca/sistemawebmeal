import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { Toolbar } from '../../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import { Table } from '../../../components/Table/Table'
import type { Column } from '../../../components/Table/Table'
import { Pagination } from '../../../components/Pagination/Pagination'
import { Badge } from '../../../components/Badge/Badge'
import {
  planesAnualesData,
  strategicLinesData,
  institutionalIndicatorsData,
  unidadesData,
  tiposDeValorData
} from '../../../data/mockData'
import styles from './MonthlyGoalsView.module.css'

interface MonthlyGoalRow {
  id: number
  programa: string
  proyecto: string
  subproyecto: string
  codigosubproyecto: string
  indicador: string
  tipoIndicador: string
  unidad: string
  metaAnual: number
  ene: number
  feb: number
  mar: number
  abr: number
  may: number
  jun: number
  jul: number
  ago: number
  sep: number
  oct: number
  nov: number
  dic: number
}

const monthLabels: { key: keyof MonthlyGoalRow; label: string }[] = [
  { key: 'ene', label: 'ENE' },
  { key: 'feb', label: 'FEB' },
  { key: 'mar', label: 'MAR' },
  { key: 'abr', label: 'ABR' },
  { key: 'may', label: 'MAY' },
  { key: 'jun', label: 'JUN' },
  { key: 'jul', label: 'JUL' },
  { key: 'ago', label: 'AGO' },
  { key: 'sep', label: 'SEP' },
  { key: 'oct', label: 'OCT' },
  { key: 'nov', label: 'NOV' },
  { key: 'dic', label: 'DIC' },
]

function distributeMonthly(total: number): number[] {
  const base = Math.floor(total / 12)
  const remainder = total - base * 12
  const months = Array(12).fill(base) as number[]
  for (let i = 0; i < remainder; i++) {
    months[i] += 1
  }
  return months
}

export function MonthlyGoalsView() {
  const [programFilter, setProgramFilter] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const programOptions = useMemo(
    () => [...new Set(planesAnualesData.filter(p => p.estado === 'Aprobado').map(p => p.programa))].sort(),
    []
  )
  const projectOptions = useMemo(
    () => [...new Set(planesAnualesData.filter(p => p.estado === 'Aprobado').map(p => p.proyecto))].sort(),
    []
  )
  const typeOptions = ['Indicador de Línea Estratégica', 'Indicador de Resultado', 'Indicador de Producto']

  const monthlyData = useMemo(() => {
    const approved = planesAnualesData.filter(p => p.estado === 'Aprobado')
    const rows: MonthlyGoalRow[] = []
    let rowId = 1

    approved.forEach(plan => {
      const lineObj = strategicLinesData.find(l => l.nombre === plan.linea)

      const findBest = (tipo: string) =>
        institutionalIndicatorsData.find(i => i.tipo === tipo && i.lineaEstrategica === lineObj?.nombre) ||
        institutionalIndicatorsData.find(i => i.tipo === tipo)

      const indicators = [
        { inst: findBest('Indicador de Línea Estratégica'), total: 2300 },
        { inst: findBest('Indicador de Resultado'), total: 2500 },
        { inst: findBest('Indicador de Producto'), total: 2400 },
      ]

      indicators.forEach(({ inst, total }) => {
        if (!inst) return
        const months = distributeMonthly(total)
        rows.push({
          id: rowId++,
          programa: plan.programa,
          proyecto: plan.proyecto,
          subproyecto: plan.subproyecto,
          codigosubproyecto: plan.codigosubproyecto,
          indicador: `${inst.codigo} - ${inst.nombre}`,
          tipoIndicador: inst.tipo,
          unidad: inst.unidad || unidadesData[0]?.nombre || 'Personas',
          metaAnual: total,
          ene: months[0], feb: months[1], mar: months[2],
          abr: months[3], may: months[4], jun: months[5],
          jul: months[6], ago: months[7], sep: months[8],
          oct: months[9], nov: months[10], dic: months[11],
        })
      })
    })

    return rows
  }, [])

  const filteredData = useMemo(() => {
    return monthlyData.filter(row => {
      const byProgram = programFilter ? row.programa === programFilter : true
      const byProject = projectFilter ? row.proyecto === projectFilter : true
      const byType = typeFilter ? row.tipoIndicador === typeFilter : true
      return byProgram && byProject && byType
    })
  }, [monthlyData, programFilter, projectFilter, typeFilter])

  const monthCellStyle: React.CSSProperties = {
    border: '1px solid #eaeaea',
    padding: '4px 6px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
    fontSize: '12px',
    minWidth: '50px',
  }

  const columns: Column<MonthlyGoalRow>[] = [
    { key: 'codigosubproyecto', header: 'CÓDIGO' },
    { key: 'subproyecto', header: 'SUBPROYECTO' },
    { key: 'indicador', header: 'INDICADOR' },
    {
      key: 'tipoIndicador',
      header: 'TIPO',
      render: (val: string) => {
        let variant: any = 'line'
        if (val.includes('Resultado')) variant = 'result'
        if (val.includes('Producto')) variant = 'product'
        return <Badge variant={variant}>{val.replace('Indicador de ', '')}</Badge>
      }
    },
    { key: 'unidad', header: 'UNIDAD' },
    {
      key: 'metaAnual',
      header: 'META ANUAL',
      render: (val: number) => (
        <div style={{
          ...monthCellStyle,
          fontWeight: 600,
          backgroundColor: '#fff3e6',
          borderColor: '#ffc25b',
          minWidth: '70px',
        }}>
          {val.toLocaleString('es')}
        </div>
      )
    },
    ...monthLabels.map(({ key, label }) => ({
      key: key,
      header: label,
      render: (val: number) => (
        <div style={monthCellStyle}>
          {val.toLocaleString('es')}
        </div>
      )
    }))
  ]

  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Metas Mensuales"
          subtitle="Distribución mensual de metas por indicador y subproyecto"
        />
      </header>

      <Toolbar
        onNew={undefined}
        onExport={() => { }}
        onRefresh={() => { setProgramFilter(''); setProjectFilter(''); setTypeFilter('') }}
        onFilterToggle={() => { }}
        onColumnToggle={() => { }}
      >
        <div className={styles.filtersGroup}>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Programa"
              options={programOptions}
              value={programFilter}
              onChange={setProgramFilter}
            />
          </div>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Proyecto"
              options={projectOptions}
              value={projectFilter}
              onChange={setProjectFilter}
            />
          </div>
          <div className={styles.filterItem}>
            <FilterSelect
              label="Tipo de Indicador"
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </div>
      </Toolbar>

      <div className={styles.tableContainer}>
        <Table columns={columns} data={filteredData} />
      </div>

      <Pagination total={filteredData.length} range={`1-${filteredData.length}`} />
    </div>
  )
}
