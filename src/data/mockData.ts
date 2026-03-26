import type {
  //INICIO DE MARCO PROGRAMÁTICO
  Gap,
  StrategicLine,
  LocationNode,
  InstitutionalIndicator,
  Program,
  ProjectCode,
  Financiador,
  SubprojectCode,
  //FIN DE MARCO PROGRAMÁTICO
  SubprojectPop,
  AnnualPlanningItem,
  LogicalFrameTreeItem,
  AnnualExecutionIndicator
} from './types'


//INICIO DE MARCO PROGRAMÁTICO

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
  { id: 11, codigo: 'SAL.3.0', nombre: 'Gestión de riesgo ante desastres, prevención, mitigación y preparación', gap: gapsData[3].nombre },
]

export const locationsData: LocationNode[] = [
  {
    id: '1', label: 'África', type: 'Region',
    children: [
      { id: '1-1', label: 'Etiopía', type: 'País' },
      { id: '1-2', label: 'Malí', type: 'País' },
      { id: '1-3', label: 'Mozambique', type: 'País' },
      { id: '1-4', label: 'Níger', type: 'País' },
    ]
  },
  {
    id: '2', label: 'Centroamérica', type: 'Region',
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
  {
    id: '3', label: 'Europa', type: 'Region',
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
        id: '4-4', label: 'Perú', type: 'País',
        children: [
          {
            id: '4-4-1', label: 'Amazonas', type: 'Departamento',
            children: [
              { id: '4-4-1-1', label: 'Bagua', type: 'Provincia' },
              { id: '4-4-1-2', label: 'Bongará', type: 'Provincia' },
              { id: '4-4-1-3', label: 'Chachapoyas', type: 'Provincia' },
              { id: '4-4-1-4', label: 'Condorcanqui', type: 'Provincia' },
              { id: '4-4-1-5', label: 'Luya', type: 'Provincia' },
              { id: '4-4-1-6', label: 'Moyobamba', type: 'Provincia' },
              { id: '4-4-1-7', label: 'Rodríguez de Mendoza', type: 'Provincia' },
              { id: '4-4-1-8', label: 'San Ignacio', type: 'Provincia' },
              { id: '4-4-1-9', label: 'Utcubamba', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-2', label: 'Ánchash', type: 'Departamento',
            children: [
              { id: '4-4-2-1', label: 'Aija', type: 'Provincia' },
              { id: '4-4-2-2', label: 'Antonio Raimondi', type: 'Provincia' },
              { id: '4-4-2-3', label: 'Asunción', type: 'Provincia' },
              { id: '4-4-2-4', label: 'Bolognesi', type: 'Provincia' },
              { id: '4-4-2-5', label: 'Carhuaz', type: 'Provincia' },
              { id: '4-4-2-6', label: 'Carlos Fermín Fitzcarrald', type: 'Provincia' },
              { id: '4-4-2-7', label: 'Casma', type: 'Provincia' },
              { id: '4-4-2-8', label: 'Corongo', type: 'Provincia' },
              { id: '4-4-2-9', label: 'Huaraz', type: 'Provincia' },
              { id: '4-4-2-10', label: 'Huari', type: 'Provincia' },
              { id: '4-4-2-11', label: 'Huarmey', type: 'Provincia' },
              { id: '4-4-2-12', label: 'Huaylas', type: 'Provincia' },
              { id: '4-4-2-13', label: 'Mariscal Luzuriaga', type: 'Provincia' },
              { id: '4-4-2-14', label: 'Ocros', type: 'Provincia' },
              { id: '4-4-2-15', label: 'Pallasca', type: 'Provincia' },
              { id: '4-4-2-16', label: 'Pomabamba', type: 'Provincia' },
              { id: '4-4-2-17', label: 'Recuay', type: 'Provincia' },
              { id: '4-4-2-18', label: 'Santa', type: 'Provincia' },
              { id: '4-4-2-19', label: 'Sihuas', type: 'Provincia' },
              { id: '4-4-2-20', label: 'Yungay', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-3', label: 'Apurimac', type: 'Departamento',
            children: [
              { id: '4-4-3-1', label: 'Abancay', type: 'Provincia' },
              { id: '4-4-3-2', label: 'Andahuaylas', type: 'Provincia' },
              { id: '4-4-3-3', label: 'Antabamba', type: 'Provincia' },
              { id: '4-4-3-4', label: 'Aymaraes', type: 'Provincia' },
              { id: '4-4-3-5', label: 'Chincheros', type: 'Provincia' },
              { id: '4-4-3-6', label: 'Cotabambas', type: 'Provincia' },
              { id: '4-4-3-7', label: 'Grau', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-4', label: 'Arequipa', type: 'Departamento',
            children: [
              { id: '4-4-4-1', label: 'Arequipa', type: 'Provincia' },
              { id: '4-4-4-2', label: 'Camaná', type: 'Provincia' },
              { id: '4-4-4-3', label: 'Caravelí', type: 'Provincia' },
              { id: '4-4-4-4', label: 'Castilla', type: 'Provincia' },
              { id: '4-4-4-5', label: 'Caylloma', type: 'Provincia' },
              { id: '4-4-4-6', label: 'Condesuyos', type: 'Provincia' },
              { id: '4-4-4-7', label: 'Islay', type: 'Provincia' },
              { id: '4-4-4-8', label: 'La Unión', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-5', label: 'Ayacucho', type: 'Departamento',
            children: [
              { id: '4-4-5-1', label: 'Cangallo', type: 'Provincia' },
              { id: '4-4-5-2', label: 'Huamanga', type: 'Provincia' },
              { id: '4-4-5-3', label: 'Huanca Sancos', type: 'Provincia' },
              { id: '4-4-5-4', label: 'Huanta', type: 'Provincia' },
              { id: '4-4-5-5', label: 'La Mar', type: 'Provincia' },
              { id: '4-4-5-6', label: 'Lucanas', type: 'Provincia' },
              { id: '4-4-5-7', label: 'Parinacochas', type: 'Provincia' },
              { id: '4-4-5-8', label: 'Páucar del Sara Sara', type: 'Provincia' },
              { id: '4-4-5-9', label: 'Sucre', type: 'Provincia' },
              { id: '4-4-5-10', label: 'Víctor Fajardo', type: 'Provincia' },
              { id: '4-4-5-11', label: 'Vilcas Huamán', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-6', label: 'Cajamarca', type: 'Departamento',
            children: [
              { id: '4-4-6-1', label: 'Cajabamba', type: 'Provincia' },
              { id: '4-4-6-2', label: 'Cajamarca', type: 'Provincia' },
              { id: '4-4-6-3', label: 'Celendín', type: 'Provincia' },
              { id: '4-4-6-4', label: 'Chota', type: 'Provincia' },
              { id: '4-4-6-5', label: 'Contumazá', type: 'Provincia' },
              { id: '4-4-6-6', label: 'Cutervo', type: 'Provincia' },
              { id: '4-4-6-7', label: 'Hualgayoc', type: 'Provincia' },
              { id: '4-4-6-8', label: 'Jaén', type: 'Provincia' },
              { id: '4-4-6-9', label: 'San Ignacio', type: 'Provincia' },
              { id: '4-4-6-10', label: 'San Marcos', type: 'Provincia' },
              { id: '4-4-6-11', label: 'San Miguel', type: 'Provincia' },
              { id: '4-4-6-12', label: 'Santa Cruz', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-7', label: 'Cusco', type: 'Departamento',
            children: [
              { id: '4-4-7-1', label: 'Acomayo', type: 'Provincia' },
              { id: '4-4-7-2', label: 'Anta', type: 'Provincia' },
              { id: '4-4-7-3', label: 'Calca', type: 'Provincia' },
              { id: '4-4-7-4', label: 'Canas', type: 'Provincia' },
              { id: '4-4-7-5', label: 'Canchis', type: 'Provincia' },
              { id: '4-4-7-6', label: 'Chumbivilcas', type: 'Provincia' },
              { id: '4-4-7-7', label: 'Cusco', type: 'Provincia' },
              { id: '4-4-7-8', label: 'Espinar', type: 'Provincia' },
              { id: '4-4-7-9', label: 'La Convención', type: 'Provincia' },
              { id: '4-4-7-10', label: 'Paruro', type: 'Provincia' },
              { id: '4-4-7-11', label: 'Paucartambo', type: 'Provincia' },
              { id: '4-4-7-12', label: 'Quispicanchi', type: 'Provincia' },
              { id: '4-4-7-13', label: 'Urubamba', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-8', label: 'Huancavelica', type: 'Departamento',
            children: [
              { id: '4-4-8-1', label: 'Acobamba', type: 'Provincia' },
              { id: '4-4-8-2', label: 'Angaraes', type: 'Provincia' },
              { id: '4-4-8-3', label: 'Castrovirreyna', type: 'Provincia' },
              { id: '4-4-8-4', label: 'Churcampa', type: 'Provincia' },
              { id: '4-4-8-5', label: 'Huancavelica', type: 'Provincia' },
              { id: '4-4-8-6', label: 'Huaytará', type: 'Provincia' },
              { id: '4-4-8-7', label: 'Tayacaja', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-9', label: 'Huánuco', type: 'Departamento',
            children: [
              { id: '4-4-9-1', label: 'Ambo', type: 'Provincia' },
              { id: '4-4-9-2', label: 'Dos de Mayo', type: 'Provincia' },
              { id: '4-4-9-3', label: 'Huacaybamba', type: 'Provincia' },
              { id: '4-4-9-4', label: 'Huamalíes', type: 'Provincia' },
              { id: '4-4-9-5', label: 'Huánuco', type: 'Provincia' },
              { id: '4-4-9-6', label: 'Lauricocha', type: 'Provincia' },
              { id: '4-4-9-7', label: 'Leoncio Prado', type: 'Provincia' },
              { id: '4-4-9-8', label: 'Marañón', type: 'Provincia' },
              { id: '4-4-9-9', label: 'Pachitea', type: 'Provincia' },
              { id: '4-4-9-10', label: 'Puerto Inca', type: 'Provincia' },
              { id: '4-4-9-11', label: 'Yarowilca', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-10', label: 'Ica', type: 'Departamento',
            children: [
              { id: '4-4-10-1', label: 'Chincha', type: 'Provincia' },
              { id: '4-4-10-2', label: 'Ica', type: 'Provincia' },
              { id: '4-4-10-3', label: 'Nasca', type: 'Provincia' },
              { id: '4-4-10-4', label: 'Palpa', type: 'Provincia' },
              { id: '4-4-10-5', label: 'Pisco', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-11', label: 'Junin', type: 'Departamento',
            children: [
              { id: '4-4-11-1', label: 'Chanchamayo', type: 'Provincia' },
              { id: '4-4-11-2', label: 'Chupaca', type: 'Provincia' },
              { id: '4-4-11-3', label: 'Concepción', type: 'Provincia' },
              { id: '4-4-11-4', label: 'Huancayo', type: 'Provincia' },
              { id: '4-4-11-5', label: 'Jauja', type: 'Provincia' },
              { id: '4-4-11-6', label: 'Junín', type: 'Provincia' },
              { id: '4-4-11-7', label: 'Satipo', type: 'Provincia' },
              { id: '4-4-11-8', label: 'Tarma', type: 'Provincia' },
              { id: '4-4-11-9', label: 'Yauli', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-12', label: 'La Libertad', type: 'Departamento',
            children: [
              { id: '4-4-12-1', label: 'Ascope', type: 'Provincia' },
              { id: '4-4-12-2', label: 'Bolívar', type: 'Provincia' },
              { id: '4-4-12-3', label: 'Chepén', type: 'Provincia' },
              { id: '4-4-12-4', label: 'Gran Chimú', type: 'Provincia' },
              { id: '4-4-12-5', label: 'Julcán', type: 'Provincia' },
              { id: '4-4-12-6', label: 'La Conquista', type: 'Provincia' },
              { id: '4-4-12-7', label: 'La Libertad', type: 'Provincia' },
              { id: '4-4-12-8', label: 'Pacasmayo', type: 'Provincia' },
              { id: '4-4-12-9', label: 'Pataz', type: 'Provincia' },
              { id: '4-4-12-10', label: 'Sánchez Carrión', type: 'Provincia' },
              { id: '4-4-12-11', label: 'Santiago de Chuco', type: 'Provincia' },
              { id: '4-4-12-12', label: 'Trujillo', type: 'Provincia' },
              { id: '4-4-12-13', label: 'Virú', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-13', label: 'Lambayeque', type: 'Departamento',
            children: [
              { id: '4-4-13-1', label: 'Chiclayo', type: 'Provincia' },
              { id: '4-4-13-2', label: 'Ferreñafe', type: 'Provincia' },
              { id: '4-4-13-3', label: 'Lambayeque', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-14', label: 'Lima', type: 'Departamento',
            children: [
              { id: '4-4-14-1', label: 'Barranca', type: 'Provincia' },
              { id: '4-4-14-2', label: 'Cañete', type: 'Provincia' },
              { id: '4-4-14-3', label: 'Canta', type: 'Provincia' },
              { id: '4-4-14-4', label: 'Caral', type: 'Provincia' },
              { id: '4-4-14-5', label: 'Huaral', type: 'Provincia' },
              { id: '4-4-14-6', label: 'Huarochirí', type: 'Provincia' },
              { id: '4-4-14-7', label: 'Huaura', type: 'Provincia' },
              { id: '4-4-14-8', label: 'Lima', type: 'Provincia' },
              { id: '4-4-14-9', label: 'Oyón', type: 'Provincia' },
              { id: '4-4-14-10', label: 'Yauyos', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-15', label: 'Loreto', type: 'Departamento',
            children: [
              { id: '4-4-15-1', label: 'Alto Amazonas', type: 'Provincia' },
              { id: '4-4-15-2', label: 'Datem del Marañón', type: 'Provincia' },
              { id: '4-4-15-3', label: 'Loreto', type: 'Provincia' },
              { id: '4-4-15-4', label: 'Mariscal Ramón Castilla', type: 'Provincia' },
              { id: '4-4-15-5', label: 'Maynas', type: 'Provincia' },
              { id: '4-4-15-6', label: 'Putumayo', type: 'Provincia' },
              { id: '4-4-15-7', label: 'Requena', type: 'Provincia' },
              { id: '4-4-15-8', label: 'Ucayali', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-16', label: 'Madre de Dios', type: 'Departamento',
            children: [
              { id: '4-4-16-1', label: 'Manu', type: 'Provincia' },
              { id: '4-4-16-2', label: 'Madre de Dios', type: 'Provincia' },
              { id: '4-4-16-3', label: 'Tahuamanu', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-17', label: 'Moquegua', type: 'Departamento',
            children: [
              { id: '4-4-17-1', label: 'General Sánchez Cerro', type: 'Provincia' },
              { id: '4-4-17-2', label: 'Ilo', type: 'Provincia' },
              { id: '4-4-17-3', label: 'Mariscal Nieto', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-18', label: 'Pasco', type: 'Departamento',
            children: [
              { id: '4-4-18-1', label: 'Daniel Alcides Carrión', type: 'Provincia' },
              { id: '4-4-18-2', label: 'Oxapampa', type: 'Provincia' },
              { id: '4-4-18-3', label: 'Pasco', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-19', label: 'Piura', type: 'Departamento',
            children: [
              { id: '4-4-19-1', label: 'Ayabaca', type: 'Provincia' },
              { id: '4-4-19-2', label: 'Huancabamba', type: 'Provincia' },
              { id: '4-4-19-3', label: 'Morropón', type: 'Provincia' },
              { id: '4-4-19-4', label: 'Ocros', type: 'Provincia' },
              { id: '4-4-19-5', label: 'Paita', type: 'Provincia' },
              { id: '4-4-19-6', label: 'Piura', type: 'Provincia' },
              { id: '4-4-19-7', label: 'Sechura', type: 'Provincia' },
              { id: '4-4-19-8', label: 'Sullana', type: 'Provincia' },
              { id: '4-4-19-9', label: 'Talara', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-20', label: 'Puno', type: 'Departamento',
            children: [
              { id: '4-4-20-1', label: 'Azángaro', type: 'Provincia' },
              { id: '4-4-20-2', label: 'Carabaya', type: 'Provincia' },
              { id: '4-4-20-3', label: 'Chucuito', type: 'Provincia' },
              { id: '4-4-20-4', label: 'El Collao', type: 'Provincia' },
              { id: '4-4-20-5', label: 'Huancané', type: 'Provincia' },
              { id: '4-4-20-6', label: 'Lampa', type: 'Provincia' },
              { id: '4-4-20-7', label: 'Melgar', type: 'Provincia' },
              { id: '4-4-20-8', label: 'Moho', type: 'Provincia' },
              { id: '4-4-20-9', label: 'Puno', type: 'Provincia' },
              { id: '4-4-20-10', label: 'San Antonio de Putina', type: 'Provincia' },
              { id: '4-4-20-11', label: 'San Román', type: 'Provincia' },
              { id: '4-4-20-12', label: 'Sandia', type: 'Provincia' },
              { id: '4-4-20-13', label: 'Yunguyo', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-21', label: 'San Martín', type: 'Departamento',
            children: [
              { id: '4-4-21-1', label: 'Bellavista', type: 'Provincia' },
              { id: '4-4-21-2', label: 'El Dorado', type: 'Provincia' },
              { id: '4-4-21-3', label: 'Huallaga', type: 'Provincia' },
              { id: '4-4-21-4', label: 'Lamas', type: 'Provincia' },
              { id: '4-4-21-5', label: 'Mariscal Cáceres', type: 'Provincia' },
              { id: '4-4-21-6', label: 'Moyobamba', type: 'Provincia' },
              { id: '4-4-21-7', label: 'Picota', type: 'Provincia' },
              { id: '4-4-21-8', label: 'Rioja', type: 'Provincia' },
              { id: '4-4-21-9', label: 'San Martín', type: 'Provincia' },
              { id: '4-4-21-10', label: 'Tocache', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-22', label: 'Tacna', type: 'Departamento',
            children: [
              { id: '4-4-22-1', label: 'Candarave', type: 'Provincia' },
              { id: '4-4-22-2', label: 'Jorge Basadre', type: 'Provincia' },
              { id: '4-4-22-3', label: 'Tacna', type: 'Provincia' },
              { id: '4-4-22-4', label: 'Tarata', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-23', label: 'Tumbes', type: 'Departamento',
            children: [
              { id: '4-4-23-1', label: 'Contralmirante Villar', type: 'Provincia' },
              { id: '4-4-23-2', label: 'Tumbes', type: 'Provincia' },
              { id: '4-4-23-3', label: 'Zarumilla', type: 'Provincia' },
            ]
          },
          {
            id: '4-4-24', label: 'Ucayali', type: 'Departamento',
            children: [
              { id: '4-4-24-1', label: 'Atalaya', type: 'Provincia' },
              { id: '4-4-24-2', label: 'Coronel Portillo', type: 'Provincia' },
              { id: '4-4-24-3', label: 'Padre Abad', type: 'Provincia' },
              { id: '4-4-24-4', label: 'Purús', type: 'Provincia' },
            ]
          },
        ]
      },
    ]
  },
]

export const institutionalIndicatorsData: InstitutionalIndicator[] = [
  { id: 1, codigo: 'PROT-LE-01', categoria: 'Protección', tipo: 'Indicador de Línea Estratégica', nombre: 'Número personas que se benefician de sistemas comunitarios de protección de la infancia articulados', vares: 'PROT-LE_Número personas que se benefician de sistemas comunitarios de protección de la infancia articulados', varen: 'PROT-LE_#_OF_PERSONS_WHO_BENEFIT_FROM_COMMUNITY_CHILD_PROTECTION_SYSTEMS_ARTICULATED', varfra: 'PROT-N_DES_PERSONNES_QUI_BÉNÉFICIENT_DE_SYSTÈMES_DE_PROTECTION_DES_ENFANTS_ARTICULÉS_DE_LA_COMMUNAUTÉ', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 2, codigo: 'IGUA-LE-01', categoria: 'Igualdad', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de mujeres que ejecutan acciones individuales y/o colectivas por la promoción de los derechos de la mujer', vares: 'IGUA-LE_Número de mujeres que ejecutan acciones individuales y/o colectivas por la promoción de los derechos de la mujer', varen: 'IGUA-LE_# OF WOMEN WHO CARRY OUT INDIVIDUAL AND/OR COLLECTIVE ACTIONS FOR THE PROMOTION OF WOMEN\'S RIGHTS', varfra: 'IGUA-LE_N_ DES FEMMES QUI MÈNENT DES ACTIONS INDIVIDUELLES ET/OU COLLECTIVES POUR LA PROMOTION DES DROITS DES FEMMESS', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 3, codigo: 'CUPA-LE-01', categoria: 'Comunidades', tipo: 'Indicador de Línea Estratégica', nombre: 'Número comunidades con programas de cultura de paz, prevención de la intolerancia y promoción de la cultura de los DDHH.', vares: 'CUPA-LE_Número comunidades con programas de cultura de paz, prevención de la intolerancia y promoción de la cultura de los DDHH.', varen: 'CUPA-LE_#_OF_COMMUNITIES_WITH_PEACE_CULTURE_AND_INTOLERANCE_PREVENTION_PROGRAMMES_AND_PROMOTION_OF_HHRR_CULTURE', varfra: 'CUPA-N_DES_COMMUNAUTÉS_AVEC_DES_PROGRAMMES_DE_PRÉVENTION_DE_LA_CULTURE_DE_LA_PAIX_ET_DE_L\'INTOLÉRANCE_ET_DE_LA_PROMOTION_DE_LA_CULTURE_DES_DROITES_HUMAINES', lineaEstrategica: 'strategicLinesData[2].nombre', gap: 'strategicLinesData[2].gap' },
  { id: 4, codigo: 'ALIM-LE-01', categoria: 'Alimentación', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de personas que acceden a la canasta básica familiar de forma estable', vares: 'ALIM-LE_Número de personas que acceden a la canasta básica familiar de forma estable', varen: 'SUPPLY_LE-#_OF_PERSONS_WHO_ACCEDEN_TO_THE_BASIC_FAMILY_BASKET_ IN_STABLE_FORM', varfra: 'ALIM_LE_#_NOMBRE_DE_PERSONNES_QUI_ACCÈDENT_AU_PANIER_FAMILIAL_DE_BASE_DANS_UNE_FORME_STABLE', lineaEstrategica: 'strategicLinesData[3].nombre', gap: 'strategicLinesData[3].gap' },
  { id: 5, codigo: 'AGUA-LE-01', categoria: 'Agua', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de personas con acceso a algún tipo de abastecimiento de agua segura gestionada sin riesgos ', vares: 'AGUA-LE_Número de personas con acceso a algún tipo de abastecimiento de agua segura gestionada sin riesgos ', varen: 'WATER-LE_#_FOR_PERSONS_WITH_ACCESS_TO_SOME_TYPE_OF_SUPPLY_SAFE_WATER_MANAGED_NO_RISKS', varfra: 'EAU-LE_NOMBRE_DE_PERSONNES_AYANT_ACCÈS_À_UN_TYPE_D\'APPROVISIONNEMENT_EN_EAU_SAINE_GÉRÉE_SANS_RISQUES', lineaEstrategica: 'strategicLinesData[4].nombre', gap: 'strategicLinesData[4].gap' },
  { id: 6, codigo: 'ENER-LE-01', categoria: 'Energía', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de personas con acceso a energía asequible, segura, sostenible y moderna ', vares: 'ENER-LE_Número de personas con acceso a energía asequible, segura, sostenible y moderna ', varen: 'ENER-LE_#_E_PEOPLE_WITH_ACCESS_TO_SUSTAINABLE_SAFE_SUSTAINABLE_AND_MODERN_AFFORDABLE_ENERGY', varfra: 'ENERGIE_LE_N_DE_GENS_AYANT_ACCÈS_À_UNE_ÉNERGIE_DURABLE_ET_MODERNE_ABORDABLE', lineaEstrategica: 'strategicLinesData[5].nombre', gap: 'strategicLinesData[5].gap' },
  { id: 7, codigo: 'EDUC-LE-01', categoria: 'Educación', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de NNAJ que asiste regularmente a clase (>75%) respecto a valores previos al inicio del programa', vares: 'EDUC-LE_Número de NNAJ que asiste regularmente a clase (>75%) respecto a valores previos al inicio del programa', varen: 'EDUC-LE_#_NNAJ_REGULARLY_ATTENDING_CLASS_(>75%)_IN_RESPECT_TO_PREVIOUS_VALUES_AT_THE_START_OF_THE_PROGRAM', varfra: 'EDUC-N_DES_ENFANTS_ET_DES_JEUNES_QUI_ASSISTENT_RÉGULIÈREMENT_À_LA_CLASSE_(>75%)_PAR RAPPORT_AUX_VALEURS_AVANT_LE_DÉBUT_DU_PROGRAMME', lineaEstrategica: 'strategicLinesData[6].nombre', gap: 'strategicLinesData[6].gap' },
  { id: 8, codigo: 'CADE-LE-01', categoria: 'Cadena', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de personas que superan la pobreza monetaria incrementando su nivel de ingresos ', vares: 'CADE-LE_Número de personas que superan la pobreza monetaria incrementando su nivel de ingresos ', varen: 'CADE-LE_NUMBER_OF_PEOPLE_WHO_OVERCOME_MONETARY_POVERTY_BY_INCREASING_THEIR_INCOME_LEVELS', varfra: 'CADE - LE_#_NOMBRE_DE_PERSONNES_QUI_DÉPASSENT_LA_PAUVRETÉ_MONÉTAIRE_EN_AUGMENTANT_LEUR_NIVEAU_DE_REVENU', lineaEstrategica: 'strategicLinesData[7].nombre', gap: 'strategicLinesData[7].gap' },
  { id: 9, codigo: 'EMPL-LE-01', categoria: 'Cadena', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de personas que acceden a un empleo', vares: 'EMPL-LE_Número de personas que acceden a un empleo', varen: 'EMPL-LE_#_OF_PERSONS_WHO_ACCESS_TO_UN_EMPLOYMENT', varfra: 'EMPL-LE_#_DE_PERSONNES_QUI_ACCÈDENT_À_L\'EMPLOI', lineaEstrategica: 'strategicLinesData[8].nombre', gap: 'strategicLinesData[8].gap' },
  { id: 10, codigo: 'HUMA-LE-01', categoria: 'Humanitaria', tipo: 'Indicador de Línea Estratégica', nombre: 'Número personas atendidas en crisis humanitarias', vares: 'HUMA-LE_Número personas atendidas en crisis humanitarias', varen: 'HUMA-LE_#_PEOPLE_ATTENDED_IN_HUMANTARIAN_CRISES', varfra: 'HUMA-LE_#_PERSONNES ASSISTÉES DANS DES CRISES HUMANITAIRES', lineaEstrategica: 'strategicLinesData[9].nombre', gap: 'strategicLinesData[9].gap' },
  { id: 11, codigo: 'RIES-LE-01', categoria: 'Riesgo', tipo: 'Indicador de Línea Estratégica', nombre: 'Número de comunidades que cuentan con un sistema de gestión integral del riesgo articulado y funcionando.', vares: 'RIES-LE_Número de comunidades que cuentan con un sistema de gestión integral del riesgo articulado y funcionando.', varen: 'RIES-LE_#_OF_COMMUNITIES_WHICH_CONTAIN_WITH_AN_INTEGRAL_RISK_MANAGEMENT_SYSTEM_ARTICULATED_AND_WORKING', varfra: 'RISQUES-N_#_DES_COMMUNAUTÉS_QUI_CONTIENNENT_UN_SYSTÈME_INTÉGRAL_DE_GESTION_DES_RISQUES_ARTICULÉ_ET_FONCTIONNANT', lineaEstrategica: 'strategicLinesData[10].nombre', gap: 'strategicLinesData[10].gap' },
  { id: 12, codigo: 'PROT-RI-01', categoria: 'Protección', tipo: 'Indicador de Resultado', nombre: 'Número de NNA que expresan un mayor conocimiento de sus derechos.', vares: 'PROT-RI_Número de NNA que expresan un mayor conocimiento de sus derechos.', varen: 'PROT-RI_Number of children and adolescents who express greater knowledge of their rights.', varfra: 'PROT-RI_Nombre d\'enfants et d\'adolescents qui expriment una plus grande connaissance de leurs droits.', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 13, codigo: 'PROT-RI-02', categoria: 'Protección', tipo: 'Indicador de Resultado', nombre: 'Número de cuidadores/as que conocen los derechos de NNA e implementan prácticas de crianza afectiva y buen trato en entornos protectores.', vares: 'PROT-RI_Número de cuidadores/as que conocen los derechos de NNA e implementan prácticas de crianza afectiva y buen trato en entornos protectores.', varen: 'PROT-RI_Number of caregivers who know the rights of children and adolescents and implement affectionate parenting practices and good treatment in protective environments.', varfra: 'PROT-RI_Nombre d\'aidants conscients des droits des enfants et des adolescents et qui mettent en œuvre des pratiques parentales affectives et de bons traitements dans des environnements protecteurs.', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 14, codigo: 'PROT-RI-03', categoria: 'Protección', tipo: 'Indicador de Resultado', nombre: 'Número de comunidades que cuentan con organizaciones constituidas, capacitadas y operativas para la promoción y protección de los DDHH de NNA. ', vares: 'PROT-RI_Número de comunidades que cuentan con organizaciones constituidas, capacitadas y operativas para la promoción y protección de los DDHH de NNA. ', varen: 'PROT-RI_Number of communities that have organizations established, trained and operational for the promotion and protection of the human rights of children and adolescents.', varfra: 'PROT-RI_Nº de communautés qui ont constitué, formé et opérationnel des organisations pour la promotion et la protection des droits des enfants et des adolescents.', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 15, codigo: 'IGUA-RI-01', categoria: 'Igualdad', tipo: 'Indicador de Resultado', nombre: 'Número de organizaciones locales que aplican estrategias de promoción y asistencia a las mujeres bajo sistemas de protección integral.', vares: 'IGUA-RI_Número de organizaciones locales que aplican estrategias de promoción y asistencia a las mujeres bajo sistemas de protección integral.', varen: 'IGUA-RI_Number of local organizations that apply promotion and assistance strategies to women under comprehensive protection systems.', varfra: 'IGUA-RI_Nombre d\'organisations locales qui appliquent des stratégies de promotion et d\'assistance aux femmes dans le cadre de sistemas de protection intégrale.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 16, codigo: 'IGUA-RI-02', categoria: 'Igualdad', tipo: 'Indicador de Resultado', nombre: 'Número de comunidades que cuentan con sistemas de protección comunitaria en favor de la protección de sus derechos de las mujeres. ', vares: 'IGUA-RI_Número de comunidades que cuentan con sistemas de protección comunitaria en favor de la protección de sus derechos de las mujeres. ', varen: 'IGUA-RI_Number of communities that have community protection systems in favor of the protection of women\'s rights.', varfra: 'IGUA-RI_Nombre de communautés disposant de systèmes de protection communautaires en faveur de la protection des droits des femmes.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 17, codigo: 'IGUA-RI-03', categoria: 'Igualdad', tipo: 'Indicador de Resultado', nombre: 'Número de organizaciones locales que promocionan los derechos humanos de las mujeres y a vivir sin violencia.', vares: 'IGUA-RI_Número de organizaciones locales que promocionan los derechos humanos de las mujeres y a vivir sin violencia.', varen: 'IGUA-RI_Number of local organizations that promote the human rights of women and to live without violence.', varfra: 'IGUA-RI_Nombre d\'organisations locales qui promeuvent les droits humains des femmes et de vivre sans violence.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 18, codigo: 'PROT-PR-01', categoria: 'Protección', tipo: 'Indicador de Producto', nombre: 'Número de Programas de formación en DDHH de NNA y ciudadanía implementados.', vares: 'PROT-PR_Número de Programas de formación en DDHH de NNA y ciudadanía implementados.', varen: 'PROT-PR_Number of training programs on human rights for children and adolescents and citizens implemented.', varfra: 'PROT-PR_Nombre de programmes de formation aux droits de l\'homme pour les enfants et les adolescents mis en œuvre.', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 19, codigo: 'PROT-PR-02', categoria: 'Protección', tipo: 'Indicador de Producto', nombre: 'Número De NNA que participan en Programas de recreación, cultura y deporte para la promoción y ejercicio de derechos de NNA implementados.', vares: 'PROT-PR_Número De NNA que participan en Programas de recreación, cultura y deporte para la promoción y ejercicio de derechos de NNA implementados.', varen: 'PROT-PR_Nº Of children and adolescents who participate in recreation, culture and sports programs for the promotion and exercise of children\'s rights implemented.', varfra: 'PROT-PR_Nombre d\'enfants et d\'adolescents qui participent aux programmes récréatifs, culturels et sportifs mis en œuvre pour la promotion et l\'exercice des droits de l\'enfant.', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 20, codigo: 'PROT-PR-03', categoria: 'Protección', tipo: 'Indicador de Producto', nombre: 'Número de Personas que participan en los programas de formación en DDHH de NNA y ciudadanía implementados', vares: 'PROT-PR_Número de Personas que participan en los programas de formación en DDHH de NNA y ciudadanía implementados', varen: 'PROT-PR_Number of People who participate in the human rights training programs for children and adolescents and citizens implemented.', varfra: 'PROT-PR_Nº de personnes qui participent aux programmes de formation sur les droits de l\'homme pour les enfants et les adolescents mis en œuvre', lineaEstrategica: 'strategicLinesData[0].nombre', gap: 'strategicLinesData[0].gap' },
  { id: 21, codigo: 'IGUA-PR-01', categoria: 'Igualdad', tipo: 'Indicador de Producto', nombre: 'Número de mujeres sobrevivientes de violencia que reciben apoyo psicosocial y/o asistencia legal.', vares: 'IGUA-PR_Número de mujeres sobrevivientes de violencia que reciben apoyo psicosocial y/o asistencia legal.', varen: 'IGUA-PR_Number of women survivors of violence who receive psychosocial support and/or legal assistance.', varfra: 'IGUA-PR_Nombre de femmes victimes de violence qui reçoivent un soutien psychosocial et/ou une assistance juridique.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 22, codigo: 'IGUA-PR-02', categoria: 'Igualdad', tipo: 'Indicador de Producto', nombre: 'Número de iniciativas o acciones implementadas a nivel comunitario/local en favor de la prevención de la violencia basada en género. ', vares: 'IGUA-PR_Número de iniciativas o acciones implementadas a nivel comunitario/local en favor de la prevención de la violencia basada en género. ', varen: 'IGUA-PR_Number of initiatives or actions implemented at the community/local level in favor of the prevention of gender-based violence.', varfra: 'IGUA-PR_Nombre d\'initiatives ou d\'actions mises en œuvre au niveau communautaire/local en faveur de la prévention des violences basées sur le genre.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' },
  { id: 23, codigo: 'IGUA-PR-03', categoria: 'Igualdad', tipo: 'Indicador de Producto', nombre: 'Número de personas por sexo y edad con planes/proyectos de vida.', vares: 'IGUA-PR_Número de personas por sexo y edad con planes/proyectos de vida.', varen: 'IGUA-PR_Number of people by sex and age with life plans/projects.', varfra: 'IGUA-PR_Nombre de personnes par sexe et par âge ayant des plans/projets de vie.', lineaEstrategica: 'strategicLinesData[1].nombre', gap: 'strategicLinesData[1].gap' }
];

export const programsData: Program[] = [
  { id: 1, nombre: 'Programa Ecuador', pais: locationsData[3].children?.[2].label ?? '', region: locationsData[3].label },
  { id: 2, nombre: 'Programa Nicaragua', pais: locationsData[1].children?.[6].label ?? '', region: locationsData[1].label },
  { id: 3, nombre: 'Programa Costa Rica', pais: locationsData[1].children?.[0].label ?? '', region: locationsData[1].label },
  { id: 4, nombre: 'Programa Perú', pais: locationsData[3].children?.[3].label ?? '', region: locationsData[3].label },
  { id: 5, nombre: 'Programa Guatemala', pais: locationsData[1].children?.[2].label ?? '', region: locationsData[1].label },
  { id: 6, nombre: 'Programa Bolivia', pais: locationsData[3].children?.[0].label ?? '', region: locationsData[3].label },
  { id: 7, nombre: 'Programa España', pais: locationsData[2].children?.[0].label ?? '', region: locationsData[2].label },
  { id: 8, nombre: 'Programa Portugal', pais: locationsData[2].children?.[1].label ?? '', region: locationsData[2].label },
  { id: 9, nombre: 'Programa Etiopía', pais: locationsData[0].children?.[0].label ?? '', region: locationsData[0].label },
  { id: 10, nombre: 'Programa Europa', pais: `${locationsData[2].children?.[0].label ?? ''}, ${locationsData[2].children?.[1].label ?? ''}`, region: locationsData[2].label },
];

export const projectCodesData: ProjectCode[] = [
  { id: 1, codigo: '032601', nombre: 'DERECHOS ECONÓMICOS DE LAS MUJERES', tipologia: 'HABILITANTE', programa: programsData[3].nombre, linea: strategicLinesData[1].nombre, gap: strategicLinesData[1].gap },
  { id: 2, codigo: '042601', nombre: 'GESTION SOCIAL DEL AGUA', tipologia: 'HABILITANTE', programa: programsData[5].nombre, linea: strategicLinesData[4].nombre, gap: strategicLinesData[4].gap },
  { id: 3, codigo: '252601', nombre: 'VINCULOS SOLIDARIOS', tipologia: 'HABILITANTE', programa: programsData[4].nombre, linea: strategicLinesData[2].nombre, gap: strategicLinesData[2].gap },
  { id: 4, codigo: '032602', nombre: 'DESARROLLO DE CADENAS DE VALOR SOSTENIBLE', tipologia: 'HABILITANTE', programa: programsData[3].nombre, linea: strategicLinesData[7].nombre, gap: strategicLinesData[7].gap },
  { id: 5, codigo: '502601', nombre: 'AYUDA HUMANITARIA', tipologia: 'HABILITANTE', programa: programsData[7].nombre, linea: strategicLinesData[9].nombre, gap: strategicLinesData[9].gap },
  { id: 6, codigo: '022601', nombre: 'INNOVA Y CREA', tipologia: 'HABILITANTE', programa: programsData[0].nombre, linea: strategicLinesData[1].nombre, gap: strategicLinesData[1].gap },
  { id: 7, codigo: '322601', nombre: 'EDUCACIÓN DE CALIDAD', tipologia: 'CORE', programa: programsData[8].nombre, linea: strategicLinesData[0].nombre, gap: strategicLinesData[0].gap },
  { id: 8, codigo: '322601', nombre: 'CADENAS DE VALOR SOSTENIBLES', tipologia: 'CORE', programa: programsData[8].nombre, linea: strategicLinesData[7].nombre, gap: strategicLinesData[7].gap },
  { id: 9, codigo: '142601', nombre: 'PROTECCIÓN', tipologia: 'HABILITANTE', programa: programsData[2].nombre, linea: strategicLinesData[0].nombre, gap: strategicLinesData[0].gap },
  { id: 10, codigo: '322602', nombre: 'PROMOCION Y DEFENSA DE LOS DERECHOS DE LAS NIÑAS, NIÑOS Y ADOLESCENTES', tipologia: 'HABILITANTE', programa: programsData[8].nombre, linea: strategicLinesData[0].nombre, gap: strategicLinesData[0].gap }
];

export const financiadoresData: Financiador[] = [
  { id: 1, codigo: '239034', nombre: 'AACID', moneda: 'EUR (€)' },
  { id: 2, codigo: '239039', nombre: 'AECID', moneda: 'EUR (€)' },
  { id: 3, codigo: '322002', nombre: 'AeA', moneda: 'EUR (€)' },
  { id: 4, codigo: '259011', nombre: 'Agencia Italiana de Cooperación al Desarrollo (AICS)', moneda: 'EUR (€)' },
  { id: 5, codigo: '259026', nombre: 'Bizkaia HUM', moneda: 'EUR (€)' },
  { id: 6, codigo: '249062', nombre: 'GENERALITAT VALENCIANA', moneda: 'EUR (€)' },
  { id: 7, codigo: '258003', nombre: 'IMG', moneda: 'EUR (€)' },
  { id: 8, codigo: '258004', nombre: 'INDORAMA', moneda: 'USD ($)' },
  { id: 9, codigo: '249006', nombre: 'INTPA - UNIÓN EUROPEA', moneda: 'EUR (€)' },
  { id: 10, codigo: '259014', nombre: 'PMA - PROGRAMA MUNDIAL DE ALIMENTOS', moneda: 'USD ($)' },
  { id: 11, codigo: '249049', nombre: 'Unión Europea', moneda: 'EUR (€)' },
  { id: 12, codigo: '249022', nombre: 'XUNTA DE GALICIA', moneda: 'EUR (€)' }
];

export const subprojectCodesData: SubprojectCode[] = [
  { id: 1, codigo: financiadoresData[0].codigo, financiador: financiadoresData[0].nombre, nombre: 'Empoderamiento económico de mujeres rurales', proyecto: projectCodesData[0].nombre, gap: projectCodesData[0].gap, linea: projectCodesData[0].linea, programa: projectCodesData[0].programa },
  { id: 2, codigo: financiadoresData[1].codigo, financiador: financiadoresData[1].nombre, nombre: 'Infraestructura de riego comunitario', proyecto: projectCodesData[1].nombre, gap: projectCodesData[1].gap, linea: projectCodesData[1].linea, programa: projectCodesData[1].programa },
  { id: 3, codigo: financiadoresData[2].codigo, financiador: financiadoresData[2].nombre, nombre: 'Fortalecimiento de redes solidarias locales', proyecto: projectCodesData[2].nombre, gap: projectCodesData[2].gap, linea: projectCodesData[2].linea, programa: projectCodesData[2].programa },
  { id: 4, codigo: financiadoresData[3].codigo, financiador: financiadoresData[3].nombre, nombre: 'Acceso a mercados para cacao sostenible', proyecto: projectCodesData[3].nombre, gap: projectCodesData[3].gap, linea: projectCodesData[3].linea, programa: projectCodesData[3].programa },
  { id: 5, codigo: financiadoresData[4].codigo, financiador: financiadoresData[4].nombre, nombre: 'Respuesta inmediata a desastres naturales', proyecto: projectCodesData[4].nombre, gap: projectCodesData[4].gap, linea: projectCodesData[4].linea, programa: projectCodesData[4].programa },
  { id: 6, codigo: financiadoresData[5].codigo, financiador: financiadoresData[5].nombre, nombre: 'Capacitación técnica para jóvenes creativos', proyecto: projectCodesData[5].nombre, gap: projectCodesData[5].gap, linea: projectCodesData[5].linea, programa: projectCodesData[5].programa },
  { id: 7, codigo: financiadoresData[6].codigo, financiador: financiadoresData[6].nombre, nombre: 'Mejora de escuelas rurales primarias', proyecto: projectCodesData[6].nombre, gap: projectCodesData[6].gap, linea: projectCodesData[6].linea, programa: projectCodesData[6].programa },
  { id: 8, codigo: financiadoresData[7].codigo, financiador: financiadoresData[7].nombre, nombre: 'Productividad en fincas de café', proyecto: projectCodesData[7].nombre, gap: projectCodesData[7].gap, linea: projectCodesData[7].linea, programa: projectCodesData[7].programa },
  { id: 9, codigo: financiadoresData[8].codigo, financiador: financiadoresData[8].nombre, nombre: 'Sistemas de protección infantil comunitaria', proyecto: projectCodesData[8].nombre, gap: projectCodesData[8].gap, linea: projectCodesData[8].linea, programa: projectCodesData[8].programa },
  { id: 10, codigo: financiadoresData[9].codigo, financiador: financiadoresData[9].nombre, nombre: 'Defensa de derechos NNA en zonas urbanas', proyecto: projectCodesData[9].nombre, gap: projectCodesData[9].gap, linea: projectCodesData[9].linea, programa: projectCodesData[9].programa },
  { id: 11, codigo: financiadoresData[10].codigo, financiador: financiadoresData[10].nombre, nombre: 'Liderazgo femenino en cooperativas', proyecto: projectCodesData[0].nombre, gap: projectCodesData[0].gap, linea: projectCodesData[0].linea, programa: projectCodesData[0].programa },
  { id: 12, codigo: financiadoresData[11].codigo, financiador: financiadoresData[11].nombre, nombre: 'Gestión hídrica en cuencas altas', proyecto: projectCodesData[1].nombre, gap: projectCodesData[1].gap, linea: projectCodesData[1].linea, programa: projectCodesData[1].programa },
  { id: 13, codigo: financiadoresData[0].codigo, financiador: financiadoresData[0].nombre, nombre: 'Becas para formación docente', proyecto: projectCodesData[6].nombre, gap: projectCodesData[6].gap, linea: projectCodesData[6].linea, programa: projectCodesData[6].programa },
  { id: 14, codigo: financiadoresData[1].codigo, financiador: financiadoresData[1].nombre, nombre: 'Kits de emergencia y refugio', proyecto: projectCodesData[4].nombre, gap: projectCodesData[4].gap, linea: projectCodesData[4].linea, programa: projectCodesData[4].programa },
  { id: 15, codigo: financiadoresData[2].codigo, financiador: financiadoresData[2].nombre, nombre: 'Innovación tecnológica en artesanía', proyecto: projectCodesData[5].nombre, gap: projectCodesData[5].gap, linea: projectCodesData[5].linea, programa: projectCodesData[5].programa },
  { id: 16, codigo: financiadoresData[5].codigo, financiador: financiadoresData[5].nombre, nombre: 'Prevención de violencia en la infancia', proyecto: projectCodesData[8].nombre, gap: projectCodesData[8].gap, linea: projectCodesData[8].linea, programa: projectCodesData[8].programa },
  { id: 17, codigo: financiadoresData[6].codigo, financiador: financiadoresData[6].nombre, nombre: 'Comercialización de miel orgánica', proyecto: projectCodesData[7].nombre, gap: projectCodesData[7].gap, linea: projectCodesData[7].linea, programa: projectCodesData[7].programa },
  { id: 18, codigo: financiadoresData[9].codigo, financiador: financiadoresData[9].nombre, nombre: 'Seguridad alimentaria post-crisis', proyecto: projectCodesData[4].nombre, gap: projectCodesData[4].gap, linea: projectCodesData[4].linea, programa: projectCodesData[4].programa },
  { id: 19, codigo: financiadoresData[10].codigo, financiador: financiadoresData[10].nombre, nombre: 'Saneamiento básico y agua potable', proyecto: projectCodesData[1].nombre, gap: projectCodesData[1].gap, linea: projectCodesData[1].linea, programa: projectCodesData[1].programa },
  { id: 20, codigo: financiadoresData[8].codigo, financiador: financiadoresData[8].nombre, nombre: 'Protección legal para adolescentes', proyecto: projectCodesData[9].nombre, gap: projectCodesData[9].gap, linea: projectCodesData[9].linea, programa: projectCodesData[9].programa }
];

//FIN DE MARCO PROGRAMÁTICO

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
  { id: 1, codigo: '269041', financiador: 'AECID', nombre: 'MUJERES POR UNA VIDA LIBRE DE VIO...', responsable: 'Claudia Perez Ojeda', estado: 'Aprobado', proyecto: '032601-DERECHOS ECONÓMICOS DE LAS MUJERES' },
  { id: 2, codigo: '269041', financiador: 'AECID', nombre: 'MUJERES POR UNA VIDA LIBRE DE VIO...', responsable: 'Claudia Perez Ojeda', estado: 'Desaprobado', proyecto: '032601-DERECHOS ECONÓMICOS DE LAS MUJERES' },
  { id: 3, codigo: '269041', financiador: 'AECID', nombre: 'MUJERES POR UNA VIDA LIBRE DE VIO...', responsable: 'Claudia Perez Ojeda', estado: 'Pendiente', proyecto: '032601-DERECHOS ECONÓMICOS DE LAS MUJERES' },
  { id: 4, codigo: '269041', financiador: 'AECID', nombre: 'MUJERES POR UNA VIDA LIBRE DE VIO...', responsable: 'Claudia Perez Ojeda', estado: 'Borrador', proyecto: '032601-DERECHOS ECONÓMICOS DE LAS MUJERES' },
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
