import type { 
  Gap, 
  StrategicLine, 
  LocationNode, 
  InstitutionalIndicator, 
  Program, 
  ProjectName, 
  ProjectCode, 
  SubprojectCode, 
  SubprojectPop, 
  AnnualPlanningItem, 
  LogicalFrameTreeItem, 
  AnnualExecutionIndicator 
} from './types'

export const gapsData: Gap[] = [
  { id: 1, codigo: 'PRO', nombre: 'PROTECCIÓN DE LA VIOLENCIA Y LA INTOLERANCIA' },
  { id: 2, codigo: 'CLI', nombre: 'ADAPTACIÓN AL CAMBIO CLIMÁTICO' },
  { id: 3, codigo: 'OPO', nombre: 'GENERACIÓN DE OPORTUNIDADES' },
  { id: 4, codigo: 'SAL', nombre: 'SALVAR VIDAS' },
]

export const strategicLinesData: StrategicLine[] = [
  { id: 1, codigo: 'PRO.1.0', nombre: 'Protección y atención frente a violencia, abuso y distintas formas de explotación', gap: gapsData[0].nombre },
  { id: 2, codigo: 'PRO.2.0', nombre: 'Igualdad de oportunidades entre H y M y eliminando cualquier tipo de discriminación', gap: gapsData[0].nombre },
  { id: 3, codigo: 'PRO.3.0', nombre: 'Cultura de paz, la solidaridad y la participación ciudadana frente a la prevención de violencia y los conflictos', gap: gapsData[0].nombre },
  { id: 4, codigo: 'CLI.1.0', nombre: 'Acceso sostenible a alimentos a través de agricultura climaticamente inteligente', gap: gapsData[1].nombre },
  { id: 5, codigo: 'CLI.2.0', nombre: 'Acceso sostenible a agua en contextos áridos y semiáridos', gap: gapsData[1].nombre },
  { id: 6, codigo: 'CLI.3.0', nombre: 'Transición justa e inclusiva hacia modelos de energía verde', gap: gapsData[1].nombre },
  { id: 7, codigo: 'OPO.1.0', nombre: 'Educación de calidad', gap: gapsData[2].nombre },
  { id: 8, codigo: 'OPO.2.0', nombre: 'Desarrollar de cadenas de valor sostenibles-sistemas de mercado inclusivo', gap: gapsData[2].nombre },
  { id: 9, codigo: 'OPO.3.0', nombre: 'Promoción del empleo y emprendimiento', gap: gapsData[2].nombre },
  { id: 10, codigo: 'SAL.1.0', nombre: 'Respuesta y post respuesta frente a crisis humanitarias', gap: gapsData[3].nombre },
  { id: 11, codigo: 'SAL.2.0', nombre: 'Gestión de riesgo ante desastres, prevención, mitigación y preparación', gap: gapsData[3].nombre },
]

export const locationsData: LocationNode[] = [
  { id: '1', label: 'África', type: 'Region',
    children: [
      { id: '1-1', label: 'Etiopía', type: 'País' },
      { id: '1-2', label: 'Malí', type: 'País' },
      { id: '1-3', label: 'Mozambique', type: 'País' },
      { id: '1-4', label: 'Níger', type: 'País' },
    ]
  },
  { id: '2', label: 'Centroamérica', type: 'Region',
    children: [
      { id: '2-1', label: 'Costa Rica', type: 'País' },
      { id: '2-2', label: 'El Salvador', type: 'País' },
      { id: '2-3', label: 'Guatemala', type: 'País' },
      { id: '2-4', label: 'Honduras', type: 'País' },
      { id: '2-5', label: 'México', type: 'País' },
      { id: '2-6', label: 'Honduras', type: 'País' },
      { id: '2-7', label: 'Nicaragua', type: 'País' },
    ]
  },
  { id: '3', label: 'Europa', type: 'Region',
    children: [
      { id: '3-1', label: 'España', type: 'País' },
      { id: '3-2', label: 'Portugal', type: 'País' },
    ]
   },
  {
    id: '4',
    label: 'Sudamérica',
    type: 'Region',
    children: [
      { id: '4-1', label: 'Bolivia', type: 'País' },
      { id: '4-2', label: 'Colombia', type: 'País' },
      { id: '4-3', label: 'Ecuador', type: 'País' },
      {
        id: '4-4',
        label: 'Perú',
        type: 'País',
        children: [
          { id: '4-4-1', label: 'La Libertad', type: 'Departamento' },
          { id: '4-4-2', label: 'Lima', type: 'Departamento' },
        ]
      },
    ]
  },
]

export const institutionalIndicatorsData: InstitutionalIndicator[] = [
  {
    id: 1,
    codigo: 'PROT-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número personas que se benefician de sistemas comunitarios de protección de la infancia articulados',
    var1: 'PROT-LE - Número personas que se benefician de sistemas comunitarios de protección de la infancia articulados',
    var2: 'PROT-LE - Number of people benefiting from community-based child protection systems',
    var3: "PROT-LE - Nombre de personnes bénéficiant de systèmes communautaires de protection de l'enfance",
    lineaEstrategica: 'PRO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación',
    gap: gapsData[0].nombre
  },
  {
    id: 2,
    codigo: 'IGUA-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de mujeres que ejecutan acciones individuales y/o colectivas por la promoción de los derechos de la mujer',
    var1: 'IGUA-LE - Número de mujeres que ejecutan acciones individuales y/o colectivas por la promoción de los derechos de la mujer',
    var2: "IGUA-LE - Number of women carrying out individual and/or collective actions promoting women's rights",
    var3: "IGUA-LE - Nombre de femmes menant des actions individuelles et/ou collectives pour promouvoir les droits des femmes",
    lineaEstrategica: 'PRO.2.0 Igualdad de oportunidades entre H y M y eliminando cualquier tipo de discriminación',
    gap: gapsData[0].nombre
  },
  {
    id: 3,
    codigo: 'CUPA-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número comunidades con programas de cultura de paz, prevención de la intolerancia y promoción de la cultura de los DDHH.',
    var1: 'CUPA-LE - Número comunidades con programas de cultura de paz, prevención de la intolerancia y promoción de la cultura de los DDHH.',
    var2: 'CUPA-LE - Number of communities with peace culture, intolerance prevention and human rights promotion programs',
    var3: "CUPA-LE - Nombre de communautés avec des programmes de culture de paix, prévention de l'intolérance et promotion des droits humains",
    lineaEstrategica: 'PRO.3.0 Cultura de paz, la solidaridad y la participación ciudadana frente a la prevención de violencia y los conflictos',
    gap: gapsData[0].nombre
  },
  {
    id: 4,
    codigo: 'ALIM-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'N.° de personas que acceden a la canasta básica familiar de forma estable',
    var1: 'ALIM-LE - N.° de personas que acceden a la canasta básica familiar de forma estable',
    var2: 'ALIM-LE - Number of people with stable access to basic family food basket',
    var3: "ALIM-LE - Nombre de personnes ayant un accès stable au panier alimentaire de base",
    lineaEstrategica: 'CLI.1.0 Acceso sostenible a alimentos a través de agricultura climáticamente inteligente',
    gap: gapsData[1].nombre
  },
  {
    id: 5,
    codigo: 'AGUA-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de personas con acceso a algún tipo de abastecimiento de agua segura gestionada sin riesgos',
    var1: 'AGUA-LE - Número de personas con acceso a algún tipo de abastecimiento de agua segura gestionada sin riesgos',
    var2: 'AGUA-LE - Number of people with access to safely managed water supply',
    var3: "AGUA-LE - Nombre de personnes ayant accès à un approvisionnement en eau potable géré en toute sécurité",
    lineaEstrategica: 'CLI.2.0 Acceso sostenible a agua en contextos áridos y semiáridos',
    gap: gapsData[1].nombre
  },
  {
    id: 6,
    codigo: 'ENER-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de personas con acceso a energía asequible, segura, sostenible y moderna',
    var1: 'ENER-LE - Número de personas con acceso a energía asequible, segura, sostenible y moderna',
    var2: 'ENER-LE - Number of people with access to affordable, reliable, sustainable and modern energy',
    var3: "ENER-LE - Nombre de personnes ayant accès à une énergie abordable, fiable, durable et moderne",
    lineaEstrategica: 'CLI.3.0 Transición justa e inclusiva hacia modelos de energía verde',
    gap: gapsData[1].nombre
  },
  {
    id: 7,
    codigo: 'EDUC-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de NNAJ que asiste regularmente a clase (>75%) respecto a valores previos al inicio del programa',
    var1: 'EDUC-LE - Número de NNAJ que asiste regularmente a clase (>75%) respecto a valores previos al inicio del programa',
    var2: 'EDUC-LE - Number of children and youth regularly attending school (>75%) compared to baseline',
    var3: "EDUC-LE - Nombre d'enfants et de jeunes assistant régulièrement à l'école (>75%) par rapport aux valeurs initiales",
    lineaEstrategica: 'OPO.1.0 Educación de calidad',
    gap: gapsData[2].nombre
  },
  {
    id: 8,
    codigo: 'CADE-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de personas que superan la pobreza monetaria incrementando su nivel de ingresos',
    var1: 'CADE-LE - Número de personas que superan la pobreza monetaria incrementando su nivel de ingresos',
    var2: 'CADE-LE - Number of people overcoming monetary poverty by increasing income levels',
    var3: 'CADE-LE - Nombre de personnes sortant de la pauvreté monétaire en augmentant leurs revenus',
    lineaEstrategica: 'OPO.2.0 Desarrollar de cadenas de valor sostenibles-sistemas de mercado inclusivo',
    gap: gapsData[2].nombre
  },
  {
    id: 9,
    codigo: 'EMPL-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de personas que acceden a un empleo',
    var1: 'EMPL-LE - Número de personas que acceden a un empleo',
    var2: 'EMPL-LE - Number of people accessing employment',
    var3: "EMPL-LE - Nombre de personnes accédant à un emploi",
    lineaEstrategica: 'OPO.3.0 Promoción del empleo y emprendimiento',
    gap: gapsData[2].nombre
  },
  {
    id: 10,
    codigo: 'HUMA-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número personas atendidas en crisis humanitarias',
    var1: 'HUMA-LE - Número personas atendidas en crisis humanitarias',
    var2: 'HUMA-LE - Number of people assisted in humanitarian crises',
    var3: 'HUMA-LE - Nombre de personnes assistées lors de crises humanitaires',
    lineaEstrategica: 'SAL.1.0 Respuesta y post respuesta frente a crisis humanitarias',
    gap: gapsData[3].nombre
  },
  {
    id: 11,
    codigo: 'RIES-LE',
    tipo: 'Indicador de Línea Estratégica',
    nombre: 'Número de comunidades que cuentan con un sistema de gestión integral del riesgo articulado y funcionando',
    var1: 'RIES-LE - Número de comunidades que cuentan con un sistema de gestión integral del riesgo articulado y funcionando',
    var2: 'RIES-LE - Number of communities with integrated risk management systems in place and functioning',
    var3: "RIES-LE - Nombre de communautés disposant d'un système de gestion intégrée des risques fonctionnel",
    lineaEstrategica: 'SAL.2.0 Gestión de riesgo ante desastres, prevención, mitigación y preparación',
    gap: gapsData[3].nombre
  },
  {
    id: 12,
    codigo: 'PRO-RI',
    tipo: 'Indicador de Resultado',
    nombre: 'Personas que acceden a servicios de protección frente a violencia y abuso',
    var1: 'PRO-RI - Personas que acceden a servicios de protección frente a violencia y abuso',
    var2: 'PRO-RI - People accessing protection services against violence and abuse',
    var3: 'PRO-RI - Personnes accédant à des services de protection contre la violence et les abus',
    lineaEstrategica: 'PRO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación',
    gap: gapsData[0].nombre
  },
  {
    id: 13,
    codigo: 'CLI-RI',
    tipo: 'Indicador de Resultado',
    nombre: 'Personas con acceso sostenible a recursos de agua y alimentos',
    var1: 'CLI-RI - Personas con acceso sostenible a recursos de agua y alimentos',
    var2: 'CLI-RI - People with sustainable access to water and food resources',
    var3: "CLI-RI - Personnes ayant un accès durable à l'eau et à l'alimentation",
    lineaEstrategica: 'CLI.1.0 Acceso sostenible a alimentos a través de agricultura climáticamente inteligente',
    gap: gapsData[1].nombre
  },
  {
    id: 14,
    codigo: 'OPO-RI',
    tipo: 'Indicador de Resultado',
    nombre: 'Personas que mejoran sus oportunidades de empleo y generación de ingresos',
    var1: 'OPO-RI - Personas que mejoran sus oportunidades de empleo e ingresos',
    var2: 'OPO-RI - People improving employment and income opportunities',
    var3: "OPO-RI - Personnes améliorant leurs opportunités d'emploi et de revenus",
    lineaEstrategica: 'OPO.3.0 Promoción del empleo y emprendimiento',
    gap: gapsData[2].nombre
  },
  {
    id: 15,
    codigo: 'PRO-PR',
    tipo: 'Indicador de Producto',
    nombre: 'Servicios de atención y protección implementados',
    var1: 'PRO-PR - Servicios de atención y protección implementados',
    var2: 'PRO-PR - Protection and care services implemented',
    var3: 'PRO-PR - Services de protection et de prise en charge mis en œuvre',
    lineaEstrategica: 'PRO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación',
    gap: gapsData[0].nombre
  },
  {
    id: 16,
    codigo: 'CLI-PR',
    tipo: 'Indicador de Producto',
    nombre: 'Sistemas de acceso a agua y alimentos implementados',
    var1: 'CLI-PR - Sistemas de acceso a agua y alimentos implementados',
    var2: 'CLI-PR - Water and food access systems implemented',
    var3: "CLI-PR - Systèmes d'accès à l'eau et à l'alimentation mis en œuvre",
    lineaEstrategica: 'CLI.2.0 Acceso sostenible a agua en contextos áridos y semiáridos',
    gap: gapsData[1].nombre
  },
  {
    id: 17,
    codigo: 'SAL-PR',
    tipo: 'Indicador de Producto',
    nombre: 'Acciones de respuesta humanitaria ejecutadas',
    var1: 'SAL-PR - Acciones de respuesta humanitaria ejecutadas',
    var2: 'SAL-PR - Humanitarian response actions implemented',
    var3: 'SAL-PR - Actions de réponse humanitaire mises en œuvre',
    lineaEstrategica: 'SAL.1.0 Respuesta y post respuesta frente a crisis humanitarias',
    gap: gapsData[3].nombre
  }
]

export const programsData: Program[] = [
  { id: 1, nombre: 'Programa Ecuador', pais: 'Ecuador', region: 'Sudamérica' },
  { id: 2, nombre: 'Programa Nicaragua', pais: 'Nicaragua', region: 'Centroamérica' },
  { id: 3, nombre: 'Programa Costa Rica', pais: 'Costa Rica', region: 'Centroamérica' },
  { id: 4, nombre: 'Programa Perú', pais: 'Perú', region: 'Sudamérica' },
  { id: 5, nombre: 'Programa Guatemala', pais: 'Guatemala', region: 'Centroamérica' },
  { id: 6, nombre: 'Programa Bolivia', pais: 'Bolivia', region: 'Sudamérica' },
  { id: 7, nombre: 'Programa España', pais: 'España', region: 'Europa' },
  { id: 8, nombre: 'Programa Portugal', pais: 'Portugal', region: 'Europa' },
  { id: 9, nombre: 'Programa Etiopía', pais: 'Etiopía', region: 'África' },
  { id: 10, nombre: 'Programa Europa', pais: 'España, Portugal', region: 'Europa' },
]

export const projectNamesData: ProjectName[] = [
  { id: 1, codigo: '01', nombre: 'DERECHOS ECONÓMICOS DE LAS MUJERES' },
  { id: 2, codigo: '02', nombre: 'GESTIÓN SOCIAL DEL AGUA' },
  { id: 3, codigo: '03', nombre: 'VÍNCULOS SOLIDARIOS' },
  { id: 4, codigo: '04', nombre: 'DESARROLLO DE CADENAS DE VALOR SOSTENIBLE' },
  { id: 5, codigo: '05', nombre: 'AYUDA HUMANITARIA' },
  { id: 6, codigo: '06', nombre: 'INNOVA Y CREA' },
  { id: 7, codigo: '07', nombre: 'EDUCACIÓN DE CALIDAD' },
  { id: 8, codigo: '08', nombre: 'CADENAS DE VALOR SOSTENIBLES' },
  { id: 9, codigo: '09', nombre: 'PROTECCIÓN' },
  { id: 10, codigo: '10', nombre: 'PROMOCIÓN Y DEFENSA DE LOS DERECHOS DE LAS NIÑAS, NIÑOS Y ADOLESCENTES' },
]

export const projectCodesData: ProjectCode[] = [
  { id: 1, codigo: '032601', nombre: 'DERECHOS ECONÓMICOS DE LAS MUJERES', tipologia: 'HABILITANTE', ubicacion: 'Perú, Sudamérica', linea: 'PRO.2.0 Igualdad de oportunidades entre H y M y eliminando cualquier tipo de discriminación' },
  { id: 2, codigo: '042601', nombre: 'GESTION SOCIAL DEL AGUA', tipologia: 'HABILITANTE', ubicacion: 'Bolivia, Sudamér...', linea: 'CLI.2.0 Acceso sostenible a agua en contextos áridos y semiáridos' },
  { id: 3, codigo: '082601', nombre: 'VINCULOS SOLIDARIOS', tipologia: 'HABILITANTE', ubicacion: 'México, Centroam...', linea: 'PRO 3.0. Cultura de paz, la solidaridad y la participación ciudadana frente a la prevención de violencia y los conflictos' },
  { id: 4, codigo: '032602', nombre: 'DESARROLLO DE CADENAS DE VALOR SOSTENIBLE', tipologia: 'HABILITANTE', ubicacion: 'Perú, Sudamérica', linea: 'OPO.2.0 Desarrollar de cadenas de valor sostenibles-sistemas de mercado inclusivo' },
  { id: 5, codigo: '502601', nombre: 'AYUDA HUMANITARIA', tipologia: 'HABILITANTE', ubicacion: 'Portugal, Europa', linea: 'SAL.1.0 Respuesta y post respuesta frente a crisis humanitarias' },
  { id: 6, codigo: '022601', nombre: 'INNOVA Y CREA', tipologia: 'HABILITANTE', ubicacion: 'Ecuador, Sudamér...', linea: 'PRO.2.0 Igualdad de oportunidades entre H y M y eliminando cualquier tipo de discriminación' },
  { id: 7, codigo: '362601', nombre: 'EDUCACIÓN DE CALIDAD', tipologia: 'CORE', ubicacion: 'Malí, África', linea: 'OPO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación' },
  { id: 8, codigo: '322601', nombre: 'CADENAS DE VALOR SOSTENIBLES', tipologia: 'CORE', ubicacion: 'Etiopía, África', linea: 'OPO.2.0 Desarrollar de cadenas de valor sostenibles-sistemas de mercado inclusivo' },
  { id: 9, codigo: '072601', nombre: 'PROTECCIÓN', tipologia: 'HABILITANTE', ubicacion: 'Honduras, Centro...', linea: 'PRO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación' },
  { id: 10, codigo: '322602', nombre: 'PROMOCION Y DEFENSA DE LOS DERECHOS DE LAS NIÑAS, NIÑOS Y ADOLESCENTES', tipologia: 'HABILITANTE', ubicacion: 'Etiopía, África', linea: 'PRO.1.0 Protección y atención frente a violencia, abuso y distintas formas de explotación' },
]

export const subprojectCodesData: SubprojectCode[] = [
  { id: 1, codigo: '269041', financiador: 'AECID', nombre: 'MUJERES LIDERANDO LA PRODU...', proyecto: '032601-DERECHOS ECONÓMICOS...' },
  { id: 2, codigo: '269022', financiador: 'PMA - PROGRAMA MUNDIAL DE...', nombre: 'ACCESO A AGUA SEGURA PARA...', proyecto: '042601-GESTION SOCIAL DEL...' },
  { id: 3, codigo: '269041', financiador: 'AECID', nombre: 'VINCULOS SOLIDARIOS - 2026...', proyecto: '082601-VINCULOS SOLIDARIOS' },
  { id: 4, codigo: '269022', financiador: 'PMA - PROGRAMA MUNDIAL DE...', nombre: 'DESARROLLO DE CADENAS DE V...', proyecto: '032602-DESARROLLO DE CADEN...' },
  { id: 5, codigo: '269041', financiador: 'AECID', nombre: 'GENERACIÓN DE OPORTUNIDADE...', proyecto: '502601-AYUDA HUMANITARIA' },
  { id: 6, codigo: '269041', financiador: 'AECID', nombre: 'INNOVALAC...', proyecto: '022601-INNOVA Y CREA' },
  { id: 7, codigo: '269041', financiador: 'AECID', nombre: 'EDUCACIÓN PARA LA EMPLEABI...', proyecto: '362601-EDUCACIÓN DE CALIDAD' },
  { id: 8, codigo: '269022', financiador: 'PMA - PROGRAMA MUNDIAL DE...', nombre: 'ORGANIZACIONES CAMPESINAS...', proyecto: '322601-CADENAS DE VALOR SO...' },
  { id: 9, codigo: '269041', financiador: 'AECID', nombre: 'CUIDADO ENTRE VINCULOS SOC...', proyecto: '072601-PROTECCIÓN' },
  { id: 10, codigo: '269022', financiador: 'PMA - PROGRAMA MUNDIAL DE...', nombre: 'COMUNIDADES ACTIVAS Y SOST...', proyecto: '322602-PROMOCION Y DEFENSA...' },
]

export const subprojectsPopData: SubprojectPop[] = [
  { 
    id: 1, 
    codigo: '269041', 
    financiador: 'AECID', 
    nombre: 'MUJERES LIDERANDO LA PRODUCCIÓN', 
    gerenteSubproyecto: 'Martina Gonzales', 
    responsableMeal: 'Claudia Teresa Sánchez', 
    programa: 'Programa Perú',
    fechaInicio: '2026-01',
    fechaFin: '2026-12',
    implementadores: ['AEA Perú'],
    financiadoresSecundarios: [],
    ubicaciones: [{ pais: 'Perú', departamento: 'Lima' }],
    proyectoId: 1,
    subprojectCodeId: 1
  },
  { 
    id: 2, 
    codigo: '269022', 
    financiador: 'PMA - PROGRAMA MUNDIAL DE ALIMENTOS', 
    nombre: 'DESARROLLO DE CADENAS DE VALOR', 
    gerenteSubproyecto: 'Martina Gonzales', 
    responsableMeal: 'Alejandra Rio', 
    programa: 'Programa Perú',
    fechaInicio: '2026-03',
    fechaFin: '2027-03',
    implementadores: ['AEA Perú'],
    financiadoresSecundarios: ['BID'],
    ubicaciones: [{ pais: 'Perú', departamento: 'La Libertad' }],
    proyectoId: 4,
    subprojectCodeId: 4
  },
]

export const annualPlanningData: AnnualPlanningItem[] = [
  { id: 1, ubicacion: 'Perú, Sudamérica', linea: 'PRO.2.0 Igualdad de oport...', proyecto: '032601-DERECHOS ECONÓMICO...', estado: 'check', meta: '2 350' },
  { id: 2, ubicacion: 'Bolivia, Sudamérica', linea: 'CLI.2.0 Acceso sostenible...', proyecto: '042601-GESTION SOCIAL DEL...', estado: 'check', meta: '1 220' },
  { id: 3, ubicacion: 'México, Centroamérica', linea: 'PRO 3.0. Cultura de paz,...', proyecto: '082601-VINCULOS SOLIDARIOS', estado: 'x', meta: '0' },
  { id: 4, ubicacion: 'Perú, Sudamérica', linea: 'OPO.2.0 Desarrollar de ca...', proyecto: '032602-DESARROLLO DE CADE...', estado: 'check', meta: '880' },
  { id: 5, ubicacion: 'Portugal, Europa', linea: 'SAL.1.0 Respuesta y post...', proyecto: '502601-AYUDA HUMANITARIA', estado: 'check', meta: '350' },
  { id: 6, ubicacion: 'Ecuador, Sudamérica', linea: 'PRO.2.0 Igualdad de oport...', proyecto: '022601-INNOVA Y CREA', estado: 'x', meta: '0' },
  { id: 7, ubicacion: 'Malí, África', linea: 'OPO.1.0 Protección y aten...', proyecto: '362601-EDUCACIÓN DE CALID...', estado: 'none', meta: '0' },
  { id: 8, ubicacion: 'Etiopía, África', linea: 'OPO.2.0 Desarrollar de ca...', proyecto: '322601-CADENAS DE VALOR S...', estado: 'check', meta: '480' },
  { id: 9, ubicacion: 'Honduras, Centroamérica', linea: 'PRO.1.0 Protección y aten...', proyecto: '072601-PROTECCIÓN', estado: 'x', meta: '0' },
  { id: 10, ubicacion: 'Etiopía, África', linea: 'PRO.1.0 Protección y aten...', proyecto: '322602-PROMOCION Y DEFENS...', estado: 'none', meta: '0' },
]

export const logicalFrameData: LogicalFrameTreeItem[] = [
  {
    id: 'group-og',
    tipo: 'Objetivos Generales',
    badgeVariant: 'og-group',
    nombre: '',
    level: 0,
    isGroup: true,
    children: [
      {
        id: 'og-1',
        tipo: 'OG',
        badgeVariant: 'og',
        codigo: 'OG1',
        nombre: 'CONTRIBUIR A LA PLENA Y EFECTIVA P...',
        level: 1,
        children: [
          {
            id: 'group-oe',
            tipo: 'Objetivos Específicos',
            badgeVariant: 'oe-group',
            nombre: '',
            level: 2,
            isGroup: true,
            children: [
              {
                id: 'oe-1',
                tipo: 'OE',
                badgeVariant: 'oe',
                codigo: 'OE1',
                nombre: 'PROMOVER VÍNCULOS SOLIDARIOS A TRA...',
                level: 3,
                children: [
                  {
                    id: 'group-r',
                    tipo: 'Resultados',
                    badgeVariant: 'result-group',
                    nombre: '',
                    level: 4,
                    isGroup: true,
                    children: [
                      {
                        id: 'r-1',
                        tipo: 'OE',
                        badgeVariant: 'result',
                        codigo: 'R.1.1',
                        nombre: 'GESTIÓN DEL AUSPICIAMIENTO REALIZA...',
                        level: 5,
                        children: [
                          {
                            id: 'group-act',
                            tipo: 'Actividad',
                            badgeVariant: 'act-group',
                            nombre: '',
                            level: 6,
                            isGroup: true,
                            children: [
                              {
                                id: 'act-1',
                                tipo: 'ACT',
                                badgeVariant: 'act',
                                codigo: 'A.1.1.1',
                                nombre: 'LEVANTAMIENTO DE LINEA BASE DEL PR...',
                                level: 7,
                                children: [
                                  {
                                    id: 'group-subact',
                                    tipo: 'Subactividad',
                                    badgeVariant: 'subact-group',
                                    nombre: '',
                                    level: 8,
                                    isGroup: true,
                                    children: [
                                      {
                                        id: 'subact-1',
                                        tipo: 'SUBACT',
                                        badgeVariant: 'subact',
                                        codigo: 'A.1.1.1.1',
                                        nombre: 'SITIO NUEVO BENEFICIARIOS',
                                        level: 9,
                                      },
                                      {
                                        id: 'subact-2',
                                        tipo: 'SUBACT',
                                        badgeVariant: 'subact',
                                        codigo: 'A.1.1.1.2',
                                        nombre: 'LA SILVERIA BENEFICIARIOS',
                                        level: 9,
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export const annualExecutionIndicatorsData: AnnualExecutionIndicator[] = [
  { id: 1, tipo: 'Indicador', codigo: 'PROT-LE', nombre: 'Número personas...', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 2, tipo: 'Indicador', codigo: 'IGUA-LE', nombre: 'Número de mujere...', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 3, tipo: 'Indicador', codigo: 'CUPA-LE', nombre: 'Número comunidad...', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 4, tipo: 'Indicador', codigo: 'ALIM-LE', nombre: 'N.º de personas q...', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 5, tipo: 'Indicador', codigo: 'AGUA-LE', nombre: 'Número de person...', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 6, tipo: 'Resultado', codigo: 'IND-R-001', nombre: 'Porcentaje de niñ...', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
  { id: 7, tipo: 'Resultado', codigo: 'IND-R-002', nombre: 'Porcentaje de muj...', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
  { id: 8, tipo: 'Objetivo', codigo: 'IND-OG-001', nombre: 'Porcentaje de mej...', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
  { id: 9, tipo: 'Objetivo', codigo: 'IND-OG-002', nombre: 'Porcentaje de mej...', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
]
