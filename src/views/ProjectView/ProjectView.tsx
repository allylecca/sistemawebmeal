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
import { DashboardView } from './DashboardView'
import { SubprojectsPopView } from './SubprojectsPopView'
import { AnnualPlanningView } from './AnnualPlanningView'
import { LogicalFrameView } from './LogicalFrameView'
import { AnnualExecutionIndicatorsView } from './AnnualExecutionIndicatorsView'

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
      case 'subproyectos':
        return <SubprojectsPopView />
      case 'planificacion':
        return <AnnualPlanningView />
      case 'marco-logico':
        return <LogicalFrameView />
      case 'indicadores':
        return <AnnualExecutionIndicatorsView />
      case 'dashboards':
        return <DashboardView />
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
