import type { BadgeVariant } from '../components/Badge/Badge'
import type { StatusIndicatorType } from '../components/StatusIndicator/StatusIndicator'

export interface Gap {
  id: number
  codigo: string
  nombre: string
}

export interface StrategicLine {
  id: number
  codigo: string
  nombre: string
  gap: string
}

export interface LocationNode {
  id: string
  label: string
  type: 'Region' | 'País' | 'Departamento'
  children?: LocationNode[]
}

export interface InstitutionalIndicator {
  id: number
  codigo: string
  tipo: string
  nombre: string
  var1: string
  var2: string
  var3: string
  gap: string
  lineaEstrategica?: string
}

export interface Program {
  id: number
  nombre: string
  pais: string
  region: string
}

export interface ProjectName {
  id: number
  codigo: string
  nombre: string
}

export interface ProjectCode {
  id: number
  codigo: string
  nombre: string
  tipologia: string
  ubicacion: string
  linea: string
}

export interface SubprojectCode {
  id: number
  codigo: string
  financiador: string
  nombre: string
  proyecto: string
}

export interface SubprojectPop {
  id: number
  codigo: string
  financiador: string
  nombre: string
  gerenteSubproyecto: string
  responsableMeal: string
  programa: string
  fechaInicio: string
  fechaFin: string
  implementadores: string[]
  financiadoresSecundarios: string[]
  ubicaciones: { pais: string; departamento: string }[]
  proyectoId?: number
  subprojectCodeId?: number
}

export interface AnnualPlanningItem {
  id: number
  ubicacion: string
  linea: string
  proyecto: string
  estado: StatusIndicatorType
  meta: string
}

export interface LogicalFrameTreeItem {
  id: string
  tipo: string
  badgeVariant: BadgeVariant
  codigo?: string
  nombre: string
  level: number
  isGroup?: boolean
  children?: LogicalFrameTreeItem[]
}

export interface AnnualExecutionIndicator {
  id: number
  tipo: string
  codigo: string
  nombre: string
  unidad: string
  tipoValor: string
}
