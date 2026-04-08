import React from 'react'
import {
  Plus,
  Minus,
  Search
} from 'lucide-react'
import styles from './GeneralSummaryView.module.css'

interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  small?: boolean
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  size = 180,
  strokeWidth = 28,
  color = '#f07f59',
  small = false
}) => {
  const radius = (size - strokeWidth) / 2

  return (
    <div className={styles.radialContainer} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle with stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#fdf2ed"
          stroke="#FEEFEB"
          strokeWidth={strokeWidth}
        />
        {/* Progress segment with stroke */}
        <path
          d={describeArc(size / 2, size / 2, radius, -90, (value / 100) * 360 - 90)}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth + 2}
        />
        <path
          d={describeArc(size / 2, size / 2, radius, -90, (value / 100) * 360 - 90)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {/* Inner and Outer thin borders */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
        />
      </svg>
      <div className={`${styles.radialLabel} ${small ? styles.radialLabelSmall : ''}`}>
        {value}%
      </div>
    </div>
  )
}

export const StatCard: React.FC<{
  icon: React.ElementType,
  label: string,
  value: string,
  color: string,
  bgColor: string
}> = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className={styles.indicatorItem}>
    <div className={styles.indicatorIcon} style={{ backgroundColor: bgColor, color: color }}>
      <Icon size={20} />
    </div>
    <div className={styles.indicatorInfo}>
      <span className={styles.indicatorLabel}>{label}</span>
      <span className={styles.indicatorValue}>{value}</span>
    </div>
  </div>
)

// Helper to draw arcs for SVG
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;
}

export const GenderDonut: React.FC = () => {
  const size = 180
  const strokeWidth = 35
  const radius = (size - strokeWidth) / 2

  // Data: Hombres 47%, Mujeres 53%
  const hombresPercent = 47

  return (
    <div className={styles.donutWrapper}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Mujeres segment (Full background first) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f07f59"
          strokeWidth={strokeWidth}
        />
        {/* Hombres segment */}
        <path
          d={describeArc(size / 2, size / 2, radius, -90, (hombresPercent / 100) * 360 - 90)}
          fill="none"
          stroke="#fec354"
          strokeWidth={strokeWidth}
        />
        {/* Borders */}
        <circle cx={size / 2} cy={size / 2} r={radius + strokeWidth / 2} fill="none" stroke="#1a1a1a" strokeWidth="1" />
        <circle cx={size / 2} cy={size / 2} r={radius - strokeWidth / 2} fill="none" stroke="#1a1a1a" strokeWidth="1" />
        {/* Divider lines between segments */}
        <line
          x1={size / 2} y1={size / 2 - radius - strokeWidth / 2}
          x2={size / 2} y2={size / 2 - radius + strokeWidth / 2}
          stroke="#1a1a1a" strokeWidth="1"
        />
        {/* Approximation of the second divider */}
        <line
          {...polarToCartesian(size / 2, size / 2, radius - strokeWidth / 2, (hombresPercent / 100) * 360)}
          x2={polarToCartesian(size / 2, size / 2, radius + strokeWidth / 2, (hombresPercent / 100) * 360).x}
          y2={polarToCartesian(size / 2, size / 2, radius + strokeWidth / 2, (hombresPercent / 100) * 360).y}
          stroke="#1a1a1a" strokeWidth="1"
        />
      </svg>
      <div className={styles.legendList}>
        <div className={styles.legendItem}>
          <div className={styles.legendLabel}>
            <span className={styles.dot} style={{ backgroundColor: '#fec354', border: '1px solid #1a1a1a' }}></span>
            Hombres
          </div>
          <div className={styles.legendValues}>
            <span style={{ fontWeight: 600 }}>3,910</span>
            <span className={styles.percentage}>47.0%</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendLabel}>
            <span className={styles.dot} style={{ backgroundColor: '#f07f59', border: '1px solid #1a1a1a' }}></span>
            Mujeres
          </div>
          <div className={styles.legendValues}>
            <span style={{ fontWeight: 600 }}>4,410</span>
            <span className={styles.percentage}>53.0%</span>
          </div>
        </div>
        <div className={styles.legendItem} style={{ borderBottom: 'none' }}>
          <div className={styles.legendLabel} style={{ fontWeight: 600 }}>Total</div>
          <div className={styles.legendValues}>
            <span style={{ fontWeight: 700 }}>8,320</span>
            <span className={styles.percentage} style={{ background: '#fdf2ed' }}>100.0%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ageData = [
  { range: '0-5', h: 230, m: 290 },
  { range: '6-11', h: 110, m: 200 },
  { range: '12-14', h: 210, m: 210 },
  { range: '15-17', h: 230, m: 220 },
  { range: '18-24', h: 190, m: 200 },
  { range: '25-35', h: 134, m: 244 },
  { range: '36-59', h: 101, m: 240 },
  { range: '60-64', h: 132, m: 170 },
  { range: '65', h: 120, m: 200 },
]

export const AgePyramid: React.FC = () => {
  const maxVal = 300
  return (
    <div className={styles.pyramidWrapper}>
      <div className={styles.pyramidGrid}>
        <div className={styles.gridLine}></div>
        <div className={styles.gridLine}></div>
        <div className={styles.gridLine}></div>
        <div className={styles.gridLine} style={{ borderLeftStyle: 'solid', borderColor: '#d1d5db' }}></div>
        <div className={styles.gridLine}></div>
        <div className={styles.gridLine}></div>
        <div className={styles.gridLine}></div>
      </div>
      <div className={styles.pyramidContainer}>
        {ageData.map((d, i) => (
          <div key={i} className={styles.pyramidRow}>
            <div className={styles.pyramidBarLeftWrapper}>
              <div className={styles.pyramidBarLeft} style={{ width: `${(d.h / maxVal) * 100}%` }}>
                <span className={styles.barValue} style={{ right: '105%' }}>{d.h}</span>
              </div>
            </div>
            <div className={styles.pyramidLabel}>{d.range}</div>
            <div className={styles.pyramidBarRightWrapper}>
              <div className={styles.pyramidBarRight} style={{ width: `${(d.m / maxVal) * 100}%` }}>
                <span className={styles.barValue} style={{ left: '105%' }}>{d.m}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pyramidAxis}>
        <span>300</span>
        <span>200</span>
        <span>100</span>
        <span>0</span>
        <span>100</span>
        <span>200</span>
        <span>300</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Courier New', fontSize: '14px', textTransform: 'uppercase' }}>
          <span className={styles.dot} style={{ background: '#fec354', border: '1px solid #1a1a1a' }}></span> Hombres
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Courier New', fontSize: '14px', textTransform: 'uppercase' }}>
          <span className={styles.dot} style={{ background: '#f07f59', border: '1px solid #1a1a1a' }}></span> Mujeres
        </div>
      </div>
    </div>
  )
}

export const GeographicMap: React.FC = () => {
  return (
    <div className={styles.mapWrapper}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/South_America_laea_location_map.svg/800px-South_America_laea_location_map.svg.png"
        alt="South America Map"
        style={{ width: '100%', opacity: 0.6, filter: 'grayscale(1)' }}
      />
      {/* Simulation of markers or highlights */}
      <div style={{ position: 'absolute', top: '50%', left: '45%', width: '10px', height: '10px', background: '#ff4d4d', borderRadius: '50%', boxShadow: '0 0 10px #ff4d4d' }}></div>
      <div style={{ position: 'absolute', top: '60%', left: '50%', width: '8px', height: '8px', background: '#ff4d4d', borderRadius: '50%' }}></div>

      <div className={styles.mapControls}>
        <button className={styles.zoomButton}><Plus size={14} /></button>
        <button className={styles.zoomButton}><Minus size={14} /></button>
        <button className={styles.zoomButton}><Search size={14} /></button>
      </div>
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(255,255,255,0.8)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#6b7280' }}>
        Haz clic en un país resaltado para ver detalle
      </div>
      <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #e5e7eb' }}>
        Zona de intervención
      </div>
    </div>
  )
}
