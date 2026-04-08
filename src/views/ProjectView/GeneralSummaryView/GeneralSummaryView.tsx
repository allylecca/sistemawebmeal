import React from 'react'
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  HandHelping,
  Maximize2
} from 'lucide-react'
import styles from './GeneralSummaryView.module.css'
import { 
  RadialProgress, 
  StatCard, 
  GenderDonut, 
  AgePyramid, 
  GeographicMap 
} from './SummaryCharts'

export const GeneralSummaryView: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Row 1 */}
      <div className={styles.grid3}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Indicadores clave</h3>
          </div>
          <div className={styles.indicatorList}>
            <StatCard 
              icon={Users} 
              label="Asistencias brindadas" 
              value="12,450" 
              color="#ff4d4d" 
              bgColor="#fee2e2" 
            />
            <StatCard 
              icon={UserCheck} 
              label="Personas beneficiadas totales" 
              value="8,320" 
              color="#f97316" 
              bgColor="#ffedd5" 
            />
            <StatCard 
              icon={UserPlus} 
              label="Personas beneficiadas múltiples..." 
              value="5,180" 
              color="#ef4444" 
              bgColor="#fee2e2" 
            />
            <StatCard 
              icon={HandHelping} 
              label="Beneficiarios indirectos" 
              value="3,260" 
              color="#f87171" 
              bgColor="#fee2e2" 
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Avance Beneficiarios</h3>
          </div>
          <RadialProgress value={83} />
          <div className={styles.chartDetails}>
            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Meta</span>
                <span>10 000</span>
              </div>
            </div>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Ejecución</span>
                <span>8 320</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '83.2%' }}></div>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Saldo</span>
                <span>1 680</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '16.8%', backgroundColor: '#fdf2ed' }}></div>
                <div className={styles.progressFill} style={{ width: '24.3%', background: '#f07f59' }}></div> 
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Progreso presupuestario</h3>
          </div>
          <RadialProgress value={75} />
          <div className={styles.chartDetails}>
            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Presupuesto total</span>
                <span>USD 2,500,000.00</span>
              </div>
            </div>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Gasto</span>
                <span>USD 1,875,000.00</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.detailRow}>
                <span>Saldo</span>
                <span>USD 625,000.00</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '25%', backgroundColor: '#fdf2ed' }}></div>
                <div className={styles.progressFill} style={{ width: '25%', background: '#f07f59' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className={styles.grid3}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Personas beneficiarias por sexo</h3>
          </div>
          <GenderDonut />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Personas beneficiadas por rango etario</h3>
          </div>
          <AgePyramid />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Distribución geográfica de personas beneficiadas</h3>
          </div>
          <GeographicMap />
        </div>
      </div>

      {/* Row 3 */}
      <div className={styles.grid4}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Indicador Institucional</h3>
          </div>
          <RadialProgress value={78} size={120} strokeWidth={10} small />
          <div className={styles.chartDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Meta</span>
              <span className={styles.detailValue}>12</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ejecutado</span>
              <span className={styles.detailValue}>9</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '78%' }}></div>
            </div>
            <div className={styles.detailRow} style={{ marginTop: '8px' }}>
              <span className={styles.detailLabel}>Saldo</span>
              <span className={styles.detailValue}>3</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '25%', backgroundColor: '#fecaca' }}></div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Indicador Objetivo Específico</h3>
          </div>
          <RadialProgress value={65} size={120} strokeWidth={10} small />
          <div className={styles.chartDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Meta</span>
              <span className={styles.detailValue}>20</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ejecutado</span>
              <span className={styles.detailValue}>13</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '65%' }}></div>
            </div>
            <div className={styles.detailRow} style={{ marginTop: '8px' }}>
              <span className={styles.detailLabel}>Saldo</span>
              <span className={styles.detailValue}>7</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '35%', backgroundColor: '#fecaca' }}></div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Indicador de Resultado</h3>
          </div>
          <RadialProgress value={72} size={120} strokeWidth={10} small />
          <div className={styles.chartDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Meta</span>
              <span className={styles.detailValue}>18</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ejecutado</span>
              <span className={styles.detailValue}>13</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '72%' }}></div>
            </div>
            <div className={styles.detailRow} style={{ marginTop: '8px' }}>
              <span className={styles.detailLabel}>Saldo</span>
              <span className={styles.detailValue}>5</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '28%', backgroundColor: '#fecaca' }}></div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Actividades</h3>
            <button className={styles.iconButton}><Maximize2 size={16} /></button>
          </div>
          <RadialProgress value={84} size={120} strokeWidth={10} small />
          <div className={styles.chartDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Meta</span>
              <span className={styles.detailValue}>50</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ejecutado</span>
              <span className={styles.detailValue}>42</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '84%' }}></div>
            </div>
            <div className={styles.detailRow} style={{ marginTop: '8px' }}>
              <span className={styles.detailLabel}>Saldo</span>
              <span className={styles.detailValue}>8</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '16%', backgroundColor: '#fecaca' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
