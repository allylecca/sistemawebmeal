import { useState } from 'react'
import { Toolbar } from '../../components/Toolbar/Toolbar'
import { FilterSelect } from '../../components/FilterSelect/FilterSelect'
import { Download } from 'lucide-react'
import styles from './ProjectView.module.css'

import { GeneralSummaryView } from './GeneralSummaryView/GeneralSummaryView'
import { ProgrammaticAdvanceView } from './ProgrammaticAdvanceView/ProgrammaticAdvanceView'
import { BeneficiariesView } from './BeneficiariesView/BeneficiariesView'
import { BudgetView } from './BudgetView/BudgetView'
import { PACAdvanceView } from './PACAdvanceView/PACAdvanceView'

type Tab = 'resumen' | 'avance' | 'beneficiarios' | 'presupuesto' | 'pac'

export function DashboardView() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  
  // Mock states for filters
  const [program, setProgram] = useState('')
  const [project, setProject] = useState('')
  const [subproject, setSubproject] = useState('')

  return (
    <div className={styles.contentWrapper}>
      <Toolbar
        onRefresh={() => {
          setProgram('')
          setProject('')
          setSubproject('')
        }}
        onExport={() => {}}
        onFilterToggle={() => {}}
      >
        <div className={styles.filtersGroup}>
          <FilterSelect
            label="Programa"
            options={['Programa 1', 'Programa 2']}
            value={program}
            onChange={setProgram}
            width="120px"
          />
          <FilterSelect
            label="Proyecto"
            options={['Proyecto A', 'Proyecto B']}
            value={project}
            onChange={setProject}
            width="140px"
          />
          <FilterSelect
            label="Subproyecto"
            options={['Sub 1', 'Sub 2']}
            value={subproject}
            onChange={setSubproject}
            width="160px"
          />
          <div className={styles.dateFilter}>
            <span className={styles.dateLabel}>Desde</span>
            <input type="date" className={styles.dateInput} />
          </div>
          <div className={styles.dateFilter}>
            <span className={styles.dateLabel}>Hasta</span>
            <input type="date" className={styles.dateInput} />
          </div>
        </div>
      </Toolbar>

      <div className={styles.mainScrollableContent}>
        <div className={styles.contentHeader}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              {activeTab === 'resumen' ? 'Resumen General' : 
               activeTab === 'avance' ? 'Avance Programático' : 
               activeTab === 'beneficiarios' ? 'Beneficiarios y Atendidos' :
               activeTab === 'presupuesto' ? 'Presupuesto' :
               'Avance PAC'}
            </h1>
            <p className={styles.subtitle}>Última actualización: 27 de marzo de 2026</p>
          </div>
          <button className={styles.exportButton}>
            <Download size={18} />
            Exportar
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'resumen' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('resumen')}
          >
            Resumen General
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'avance' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('avance')}
          >
            Avance programático
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'beneficiarios' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('beneficiarios')}
          >
            Beneficiarios y Atendidos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'presupuesto' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('presupuesto')}
          >
            Presupuesto
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pac' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pac')}
          >
            Avance PAC
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'resumen' && <GeneralSummaryView />}
          {activeTab === 'avance' && <ProgrammaticAdvanceView />}
          {activeTab === 'beneficiarios' && <BeneficiariesView />}
          {activeTab === 'presupuesto' && <BudgetView />}
          {activeTab === 'pac' && <PACAdvanceView />}
          {!['resumen', 'avance', 'beneficiarios', 'presupuesto', 'pac'].includes(activeTab) && (
            <div className={styles.emptyContent} />
          )}
        </div>
      </div>
    </div>
  )
}
