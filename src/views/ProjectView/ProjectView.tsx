import { useState } from 'react'
import { MainLayout } from '../../components/Layout/MainLayout'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { GapsView } from './MarcoProgramatico/GapsView'
import { StrategicLinesView } from './MarcoProgramatico/StrategicLinesView'
import { LocationsView } from './MarcoProgramatico/LocationsView'
import { InstitutionalIndicatorsView } from './MarcoProgramatico/InstitutionalIndicatorsView'
import { ProgramsView } from './MarcoProgramatico/ProgramsView'
import { ProjectCodesView } from './MarcoProgramatico/ProjectCodesView'
import { SubprojectCodesView } from './MarcoProgramatico/SubprojectCodesView'

import { AnnualPlanningView } from './PlanificacionAnual/AnnualPlanningView'
import { SubprojectsView } from './EjecucionAnual/SubprojectsView'

import { ResultsChainView } from './CadenaResultados/ResultsChainView'
import { MonthlyGoalsView } from './CadenaResultados/MonthlyGoalsView'

export function ProjectView() {
  const [activeSubItem, setActiveSubItem] = useState<string>('gaps')

  const renderContent = () => {
    switch (activeSubItem) {
      case 'gaps':
        return <GapsView />
      case 'lineas':
        return <StrategicLinesView />
      case 'ubicaciones':
        return <LocationsView />
      case 'indicadores-inst':
        return <InstitutionalIndicatorsView />
      case 'programas':
        return <ProgramsView />
      case 'codigos-proy':
        return <ProjectCodesView />
      case 'codigos-subproy':
        return <SubprojectCodesView />
      case 'planificacion-anual':
        return <AnnualPlanningView />

      case 'subproyectos':
        return <SubprojectsView />

      case 'cadena-resultados':
        return <ResultsChainView />
      case 'metas-mensuales':
        return <MonthlyGoalsView />

      default:
        return (
          <div style={{ padding: '32px' }}>
            <h2>Vista en construcción: {activeSubItem}</h2>
          </div>
        )
    }
  }

  return (
    <MainLayout
      sidebar={
        <Sidebar
          activeSubItem={activeSubItem}
          onNavigate={setActiveSubItem}
        />
      }
    >
      {renderContent()}
    </MainLayout>
  )
}
