import type { BadgeVariant } from '../components/Badge/Badge'


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
  type: 'Region' | 'País' | 'Departamento' | 'Provincia'
  children?: LocationNode[]
}

export interface InstitutionalIndicator {
  id: number
  codigo: string
  tipo: 'Indicador de Línea Estratégica' | 'Indicador de Resultado' | 'Indicador de Producto'
  nombre: string
  vares: string
  varen: string
  varfra: string
  gap: string
  lineaEstrategica?: string
  categoria: 'Protección' | 'Igualdad' | 'Comunidades' | 'Alimentación' | 'Agua' | 'Energía' | 'Educación' | 'Cadena' | 'Humanitaria' | 'Riesgo'
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
  programa: string
  linea: string
  gap: string
}

export interface Financiador {
  id: number
  codigo: string
  nombre: string
  moneda: 'EUR (€)' | 'USD ($)' | 'PEN (S/)'
}

export interface SubprojectCode {
  id: number
  codigo: string
  financiador: string
  nombre: string
  proyecto: string
  gap: string
  linea: string
  programa: string
}

export interface Gerentes {
  id: number
  nombre: string
}

export interface ResponsablesMeal {
  id: number
  nombre: string
}

export interface Implementadores {
  id: number
  nombre: string
}

export interface Unidad {
  id: number
  nombre: string
}

export interface TipodeValor {
  id: number
  nombre: string
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
  codigo: string
  financiador: string
  nombre: string
  responsable: string
  estado: 'Aprobado' | 'Desaprobado' | 'Pendiente' | 'Borrador'
  proyecto: string
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

export interface IndicadoresAnuales {
  id: number
  tipo: string
  indicador: string
  unidad: string
  tipoValor: string
  [key: string]: any
}

export interface PlanAnual {
  id: number
  programa: string
  proyecto: string
  subproyecto: string
  gap: string
  linea: string
  codigosubproyecto: string
  financiadorprincipal: string
  gerente: string
  responsable: string
  fechainicio: string
  fechafin: string
  implementadores: string[]
  financiadoressecundarios: string[]
  ubicaciones: { region: string; pais: string; departamento: string; provincia: string }[]
  estado: 'Aprobado' | 'Desaprobado' | 'Pendiente' | 'Borrador'
}
