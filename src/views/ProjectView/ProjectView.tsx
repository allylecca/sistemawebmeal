import { useState } from 'react'
import { MainLayout } from '../../components/Layout/MainLayout'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { GapsView } from './GapsView'
import { DashboardView } from './DashboardView'
import { StrategicLinesView } from './StrategicLinesView'
import { LocationsView } from './LocationsView'
import { InstitutionalIndicatorsView } from './InstitutionalIndicatorsView'
import { ProgramsView } from './ProgramsView'
import { ProjectNamesView } from './ProjectNamesView'
import { ProjectCodesView } from './ProjectCodesView'
import { SubprojectCodesView } from './SubprojectCodesView'
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
      case 'nombres-proy':
        return <ProjectNamesView />
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
