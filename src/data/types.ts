import type { BadgeVariant } from '../components/Badge/Badge'

//INICIO DE MARCO PROGRAMATICO
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

//FIN DE MARCO PROGRAMATICO

//INICIO DE PLANIFICACION ANUAL
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

//FIN DE PLANIFICACION ANUAL

//INICIO DE EJECUCION ANUAL
export interface ObjetivoGeneral {
  id: number;
  codigo: string;
  nombre: string;
}

export interface ObjetivoEspecifico {
  id: number;
  codigo: string;
  nombre: string;
  objetivoGeneral: string;
}

export interface Resultado {
  id: number
  codigo: string;
  nombre: string;
  objetivoEspecifico: string;
  objetivoGeneral: string;
}

export interface Actividad {
  id: number;
  tipo: 'Actividad de Marco Lógico' | 'Actividad de Gasto' | 'Actividad Complementaria o de Soporte';
  codigoActividad: string;
  codigoPresupuesto: string;
  nombre: string;
  unidad?: string;
  tipoValor?: string;
  // Jerarquía
  //subproyecto
  objetivoGeneral?: string; // Solo si es ML, Complementaria o Soporte
  objetivoEspecifico?: string;
  resultado?: string;
}

export interface Subactividad {
  id: number;
  tipo: 'Subactividad de Gasto' | 'Subactividad de Gasto sin Resultado' | 'Subactividad de Marco Lógico' | 'Subactividad Complementaria o de Soporte';
  codigoSubactividad: string;
  codigoSubactividadPresupuesto: string;
  nombre: string;
  unidad: string;
  tipoValor: string;
  // Jerarquía
  //subproyecto
  actividad: string;
  objetivoGeneral?: string; // No aplica en 'Gasto sin Resultado'
  objetivoEspecifico?: string;
  resultado?: string;
}

export interface LogicalFrameTreeItem {
  id: string
  tipo: string
  badgeVariant: BadgeVariant
  codigo?: string
  nombre: string
  level?: number
  isGroup?: boolean
  children?: LogicalFrameTreeItem[]
}

export interface Indicador {
  id: number;
  tipo: 'Indicador de Subproyecto' | 'Indicador de Objetivo General' | 'Indicador de Objetivo Específico' | 'Indicador de Resultado';
  codigo: string;
  nombre: string;
  unidad: string; // Traído de unidadesData
  tipoValor: string; // Traído de tiposDeValorData
  // --- Jerarquía ---
  // Se maneja como opcional dependiendo del nivel del indicador
  programa?: string;
  proyecto?: string;
  subproyecto?: string; // Relaciona a todos los niveles
  objetivoGeneral?: string; // Solo para Obj. General, Obj. Específico y Resultado
  objetivoEspecifico?: string; // Solo para Obj. Específico y Resultado
  resultado?: string; // Solo para Resultado
  formula?: string; // Fórmula personalizada
}

//FIN DE EJECUCION ANUAL







