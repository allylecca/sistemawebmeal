import React, { useMemo, useState, useEffect, Fragment } from 'react'
import { PageHeader } from '../../../components/PageTitle/PageTitle'
import { FilterSelect } from '../../../components/FilterSelect/FilterSelect'
import {
  ChevronDown,
  ChevronRight,
  Search,
  RefreshCcw,
  Download,
  ArrowUpDown,
  ListFilter,
  Info,
  X,
  PencilRuler
} from 'lucide-react'
import {
  actividadData,
  implementadoresData,
  planesAnualesData,
  subactividadData
} from '../../../data/mockData'
import styles from './ResultsChainView.module.css'




/* ─── Indicator Mock Data (Selección de indicadores y metas) ─ */
type IndicatorType = 'lineaEstrategica' | 'resultado' | 'producto' | 'beneficiario'

interface IndicatorMeta {
  id: number
  tipo: IndicatorType
  codigo: string
  nombre: string
  y2025: number
  y2026: number
  y2027: number
}

const indicatorsMock: IndicatorMeta[] = [
  { id: 1, tipo: 'lineaEstrategica', codigo: 'PROT-LE-01', nombre: 'Sistemas comunitarios protección', y2025: 0, y2026: 0, y2027: 0 },
  { id: 2, tipo: 'resultado', codigo: 'PROT-RI-01', nombre: 'Conocimiento derechos NNA', y2025: 0, y2026: 0, y2027: 0 },
  { id: 3, tipo: 'producto', codigo: 'PROT-PR-01', nombre: 'Programas formación DDHH', y2025: 0, y2026: 0, y2027: 0 },
  { id: 4, tipo: 'producto', codigo: 'PROT-PR-02', nombre: 'Participación recreación deporte', y2025: 0, y2026: 0, y2027: 0 },
  { id: 5, tipo: 'beneficiario', codigo: 'BEN-T', nombre: 'Beneficiarios Totales', y2025: 0, y2026: 0, y2027: 0 },
  { id: 6, tipo: 'beneficiario', codigo: 'BEN-H', nombre: 'Beneficiarios Hombres', y2025: 0, y2026: 0, y2027: 0 },
  { id: 7, tipo: 'beneficiario', codigo: 'BEN-M', nombre: 'Beneficiarios Mujeres', y2025: 0, y2026: 0, y2027: 0 },
]

const subprojectIndicatorsMock = [
  { id: 1, codigo: 'IND-SUB-01', nombre: 'Metas subproyecto', unidad: 'Porcentaje', tipoValor: 'Porcentaje' },
  { id: 2, codigo: 'IND-OG-01', nombre: 'Gobernanza local', unidad: 'Personas', tipoValor: 'Numérico' },
  { id: 3, codigo: 'IND-OE-01', nombre: 'Capacitación funcionarios', unidad: 'Funcionarios', tipoValor: 'Numérico' },
  { id: 4, codigo: 'IND-OE-02', nombre: 'Transparencia institucional', unidad: 'Mecanismos', tipoValor: 'Numérico' },
  { id: 5, codigo: 'IND-R-01', nombre: 'Gestión pública', unidad: 'Certificados', tipoValor: 'Numérico' },
  { id: 6, codigo: 'IND-R-02', nombre: 'Manuales operativos', unidad: 'Manuales', tipoValor: 'Numérico' },
  { id: 7, codigo: 'IND-R-03', nombre: 'Datos abiertos', unidad: 'Portales', tipoValor: 'Numérico' },
]

const tipoLabels: Record<IndicatorType, string> = {
  lineaEstrategica: 'Indicador de Línea Estratégica',
  resultado: 'Indicador de Resultado',
  producto: 'Indicador de Producto',
  beneficiario: 'Beneficiario',
}

/* ─── IndicatorDetailModal ─────────────────────── */
function IndicatorDetailModal({ year, onClose }: { year: number; onClose: () => void }) {
  const yearKey = `y${year}` as 'y2025' | 'y2026' | 'y2027'
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose() }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Indicadores y Metas — {year}</h3>
            <p className={styles.modalSubtitle}>Proyectos habilitados · Selección de indicadores</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div className={styles.modalTableWrapper}>
          <table className={styles.modalTable}>
            <thead>
              <tr>
                <th className={styles.modalColTipo}>TIPO ⇵</th>
                <th className={styles.modalColIndicador}>INDICADOR ⇵</th>
                <th className={styles.modalColMeta}>{year} ⇵</th>
              </tr>
            </thead>
            <tbody>
              {indicatorsMock.map(ind => (
                <tr key={ind.id} className={styles.modalIndicatorRow}>
                  <td><span className={`${styles.tipoBadge} ${styles[`tipo_${ind.tipo}`]}`}>{tipoLabels[ind.tipo]}</span></td>
                  <td className={styles.modalIndicadorCell}>
                    <span className={styles.indicadorCodigo}>{ind.codigo}</span>
                    <span className={styles.indicadorNombre}> — {ind.nombre}</span>
                  </td>
                  <td>
                    <div className={styles.metaInputWrapper}>
                      <input type="text" className={styles.metaInput} defaultValue={`${ind[yearKey].toLocaleString('es')} 000`} readOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared tooltip hook ─────────────────────── */

/* ─── BudgetIcon with Tooltip ─────────────────── */


const implOptions = implementadoresData.map(i => i.nombre)

const IMPLEMENTORS = ['AEA Perú', 'AEA Bolivia', 'Power Mas'];
const LOCATIONS = ['Perú, La Libertad, Trujillo', 'Perú, La Libertad, Chepén'];
const YEARS = [2025, 2026, 2027];

const handleKeyDownVertical = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const colIndex = e.currentTarget.getAttribute('data-col-index');
    if (!colIndex) return;

    const allInputs = Array.from(document.querySelectorAll(`input[data-col-index="${colIndex}"]`)) as HTMLInputElement[];
    const currentIndex = allInputs.indexOf(e.currentTarget);
    const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex >= 0 && nextIndex < allInputs.length) {
      allInputs[nextIndex].focus();
      allInputs[nextIndex].select();
    }
  }
};

/* ─── Component ───────────────────────────────── */
export function ResultsChainView() {
  const [programFilter, setProgramFilter] = useState('Programa Perú')
  const [projectFilter, setProjectFilter] = useState('EDUCACIÓN DE CALIDAD')
  const [subprojectFilter, setSubprojectFilter] = useState('249062 - Capacitación técnica para jóvenes creativos')
  const [modalYear, setModalYear] = useState<number | null>(null)

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ inst: true });
  const toggleCategory = (cat: string) => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const toggleItem = (id: string) => setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const [quantities, setQuantities] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const ids = [
      'inst-1', 'inst-2', 'inst-3', 'inst-4', 'inst-5', 'inst-6', 'inst-7',
      'indsub-1', 'indsub-2', 'indsub-3', 'indsub-4', 'indsub-5', 'indsub-6', 'indsub-7'
    ];
    const vals = ['1845', '2410', '920', '2780', '1350', '2115', '675', '100', '1500', '45', '12', '80', '25', '5'];
    ids.forEach((id, i) => {
      YEARS.forEach(yr => {
        if (id.startsWith('inst-')) {
          initial[`${id}-${yr}`] = yr === 2025 ? vals[i] : '';
        } else if (id.startsWith('indsub-')) {
          initial[`${id}-${yr}`] = '';
        } else {
          initial[`${id}-${yr}`] = (parseFloat(vals[i]) / YEARS.length).toFixed(0);
        }
      });
    });
    return initial;
  });
  const [distState, setDistState] = useState({
    locTotals: {} as Record<string, string>,
    locTouched: {} as Record<string, boolean>,
    matrixValues: {} as Record<string, string>,
    matrixTouched: {} as Record<string, boolean>,
    topMatrixValues: {} as Record<string, string>,
    topMatrixTouched: {} as Record<string, boolean>
  });

  const [metricsPopover, setMetricsPopover] = useState<{ id: string, label: string, unidad: string, tipo: string, x: number, y: number } | null>(null);
  const [statusPopover, setStatusPopover] = useState<{
    title: string,
    expected: number,
    current: number,
    current2?: number,
    label2?: string,
    x: number,
    y: number
  } | null>(null);

  const handleStatusIconMouseEnter = (e: React.MouseEvent, title: string, expected: number, current: number, current2?: number, label2?: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setStatusPopover({
      title,
      expected,
      current,
      current2,
      label2,
      x: rect.left - 100,
      y: rect.bottom + 10
    });
  };

  const handleStatusIconMouseLeave = () => {
    setStatusPopover(null);
  };

  const handleUnitIconMouseEnter = (e: React.MouseEvent, id: string, label: string, unidad: string, tipo: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMetricsPopover({
      id,
      label,
      unidad: unidad || 'Personas',
      tipo: tipo || 'Numérico',
      x: rect.left - 130,
      y: rect.bottom + 10
    });
  };

  const handleUnitIconMouseLeave = () => {
    setMetricsPopover(null);
  };

  const handleQuantityChange = (id: string, yr: number, val: string) => {
    setQuantities(prev => ({ ...prev, [`${id}-${yr}`]: val }));
  };

  const handleLocTotalChange = (itemId: string, locIdx: number, yr: number, val: string) => {
    const locId = `${itemId}-${locIdx}-${yr}`;
    let numVal = parseFloat(val);
    if (isNaN(numVal) || numVal < 0) numVal = 0;

    setDistState(prev => {
      const newLocTotals = { ...prev.locTotals };

      let sumOtherLocs = 0;
      LOCATIONS.forEach((_, i) => {
        if (i !== locIdx) {
          sumOtherLocs += (parseFloat(newLocTotals[`${itemId}-${i}-${yr}`]) || 0);
        }
      });

      const totalAllowed = parseFloat(quantities[`${itemId}-${yr}`]) || 0;
      if (sumOtherLocs + numVal > totalAllowed) {
        numVal = totalAllowed - sumOtherLocs;
        if (numVal < 0) numVal = 0;
      }

      newLocTotals[locId] = numVal.toString();
      return { ...prev, locTotals: newLocTotals };
    });
  };

  const handleMatrixChange = (itemId: string, locIdx: number, yr: number, impIdx: number, val: string, locTotalAllowed: number) => {
    const cellId = `${itemId}-${locIdx}-${yr}-${impIdx}`;
    let numVal = parseFloat(val);
    if (isNaN(numVal) || numVal < 0) numVal = 0;

    setDistState(prev => {
      const newMatrixValues = { ...prev.matrixValues };

      let sumOtherCells = 0;
      IMPLEMENTORS.forEach((_, iIdx) => {
        const cId = `${itemId}-${locIdx}-${yr}-${iIdx}`;
        if (cId !== cellId) {
          sumOtherCells += (parseFloat(newMatrixValues[cId]) || 0);
        }
      });

      if (sumOtherCells + numVal > locTotalAllowed) {
        numVal = locTotalAllowed - sumOtherCells;
        if (numVal < 0) numVal = 0;
      }

      newMatrixValues[cellId] = numVal.toString();
      return { ...prev, matrixValues: newMatrixValues };
    });
  };

  const handleTopMatrixChange = (itemId: string, yr: number, impIdx: number, val: string, totalAllowed: number) => {
    const cellId = `${itemId}-${yr}-${impIdx}`;
    let numVal = parseFloat(val);
    if (isNaN(numVal) || numVal < 0) numVal = 0;

    setDistState(prev => {
      const newValues = { ...prev.topMatrixValues };

      let sumOtherCells = 0;
      IMPLEMENTORS.forEach((_, iIdx) => {
        const cId = `${itemId}-${yr}-${iIdx}`;
        if (cId !== cellId) {
          sumOtherCells += (parseFloat(newValues[cId]) || 0);
        }
      });

      if (sumOtherCells + numVal > totalAllowed) {
        numVal = totalAllowed - sumOtherCells;
        if (numVal < 0) numVal = 0;
      }

      newValues[cellId] = numVal.toString();
      return { ...prev, topMatrixValues: newValues };
    });
  };

  const renderItemRow = (id: string, label: string, unidad?: string, tipoValor?: string) => {
    const isExpanded = expandedItems[id];

    // Status logic at row level
    const rowBalances: boolean[] = [];
    YEARS.forEach(yr => {
      const yrQty = parseFloat(quantities[`${id}-${yr}`]) || 0;
      let yrSumTop = 0;
      IMPLEMENTORS.forEach((_, iIdx) => {
        yrSumTop += parseFloat(distState.topMatrixValues[`${id}-${yr}-${iIdx}`]) || 0;
      });
      let yrSumLoc = 0;
      LOCATIONS.forEach((_, locIdx) => {
        yrSumLoc += parseFloat(distState.locTotals[`${id}-${locIdx}-${yr}`]) || 0;
      });
      const isBalanced = yrQty > 0 && Math.abs(yrQty - yrSumTop) < 0.01 && Math.abs(yrQty - yrSumLoc) < 0.01;
      rowBalances.push(isBalanced);
    });


    const topColSums: Record<string, number> = {};
    YEARS.forEach(y => {
      IMPLEMENTORS.forEach((_, iIdx) => {
        let cSum = 0;
        LOCATIONS.forEach((_, locIdx) => {
          cSum += parseFloat(distState.matrixValues[`${id}-${locIdx}-${y}-${iIdx}`]) || 0;
        });
        topColSums[`${y}-${iIdx}`] = cSum;
      });
    });

    const getIconColor = (valStr: string, isBalanced: boolean) => {
      const val = parseFloat(valStr) || 0;
      if (valStr === '' || val === 0) return '#b3b3b3';
      return isBalanced ? '#4caf50' : '#ffb300';
    };

    const getYearlyStatus = (yr: number) => {
      const yrQtyStr = quantities[`${id}-${yr}`] || '';
      const yrQty = parseFloat(yrQtyStr) || 0;

      let yrSumTop = 0;
      IMPLEMENTORS.forEach((_, iIdx) => {
        yrSumTop += parseFloat(distState.topMatrixValues[`${id}-${yr}-${iIdx}`]) || 0;
      });

      let yrSumLoc = 0;
      LOCATIONS.forEach((_, locIdx) => {
        yrSumLoc += parseFloat(distState.locTotals[`${id}-${locIdx}-${yr}`]) || 0;
      });

      const isBalanced = yrQty > 0 && Math.abs(yrQty - yrSumTop) < 0.01 && Math.abs(yrQty - yrSumLoc) < 0.01;
      return { yrQtyStr, yrQty, yrSumTop, yrSumLoc, isBalanced };
    };

    const grandTotal = YEARS.reduce((sum, yr) => sum + (parseFloat(quantities[`${id}-${yr}`]) || 0), 0);

    return (
      <Fragment key={id}>
        <tr className={styles.activityRow} onClick={() => toggleItem(id)} style={{ cursor: 'pointer' }}>
          <td>
            <div className={styles.activityCell}>
              <button className={styles.chevronBtn}>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <span className={styles.activityName}>{label}</span>
              <div className={styles.iconBadgeGroup}>
                <div
                  className={`${styles.iconBadge} ${styles.iconBadgeUnit}`}
                  onMouseEnter={(e) => handleUnitIconMouseEnter(e, id, label, unidad || '', tipoValor || '')}
                  onMouseLeave={handleUnitIconMouseLeave}
                  style={{ cursor: 'help' }}
                >
                  <PencilRuler size={14} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </td>
          <td style={{ textAlign: 'right', backgroundColor: '#eeeeee', borderLeft: '2px solid #f7f7f7', fontWeight: 800, paddingRight: '12px', color: '#382e2c' }}>
            {grandTotal.toLocaleString('es')}
          </td>
          {YEARS.map(yr => {
            const { yrQtyStr, yrQty, yrSumTop, yrSumLoc, isBalanced } = getYearlyStatus(yr);

            return (
              <Fragment key={`item-${id}-${yr}`}>
                <td style={{ textAlign: 'right', backgroundColor: '#f9f9f9', borderLeft: '2px solid #f7f7f7', fontWeight: 700 }} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                    <input
                      type="number"
                      className={styles.valueInput}
                      value={yrQtyStr}
                      onChange={(e) => handleQuantityChange(id, yr, e.target.value)}
                      placeholder="0"
                      readOnly={id.startsWith('inst-')}
                      onKeyDown={handleKeyDownVertical}
                      data-col-index={`total-${yr}`}
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        width: '70px',
                        backgroundColor: id.startsWith('inst-') ? 'transparent' : undefined
                      }}
                    />
                    <Info
                      size={16}
                      color={getIconColor(yrQtyStr, isBalanced)}
                      style={{ flexShrink: 0, cursor: 'help' }}
                      onMouseEnter={(e) => handleStatusIconMouseEnter(e, `Total ${yr}`, yrQty, yrSumTop, yrSumLoc, 'Registro Ubicaciones')}
                      onMouseLeave={handleStatusIconMouseLeave}
                    />
                  </div>
                </td>
                {IMPLEMENTORS.map((imp, iIdx) => {
                  const cellId = `${id}-${yr}-${iIdx}`;
                  const cellValue = distState.topMatrixValues?.[cellId] || '';
                  const impTotal = parseFloat(cellValue) || 0;
                  const isColBalanced = cellValue !== '' && impTotal > 0 && topColSums[`${yr}-${iIdx}`] === impTotal;

                  return (
                    <td key={`item-${yr}-${imp}`} style={{ textAlign: 'right', borderLeft: iIdx === 0 ? '1px solid #f0f0f0' : undefined }} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.editableValue} style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <input
                          type="number"
                          className={styles.valueInput}
                          value={cellValue}
                          onChange={(e) => handleTopMatrixChange(id, yr, iIdx, e.target.value, yrQty)}
                          onKeyDown={handleKeyDownVertical}
                          data-col-index={`col-${yr}-${iIdx}`}
                          disabled={yrQty <= 0}
                          placeholder="0"
                          style={{
                            opacity: yrQty > 0 ? 1 : 0.5,
                            cursor: yrQty > 0 ? 'text' : 'not-allowed',
                            textAlign: 'right',
                            fontWeight: 600,
                            color: '#382e2c'
                          }}
                        />
                        <Info
                          size={16}
                          color={getIconColor(cellValue, isColBalanced)}
                          style={{ flexShrink: 0, cursor: 'help' }}
                          onMouseEnter={(e) => handleStatusIconMouseEnter(e, `Imp: ${imp} (${yr})`, impTotal, topColSums[`${yr}-${iIdx}`])}
                          onMouseLeave={handleStatusIconMouseLeave}
                        />
                      </div>
                    </td>
                  );
                })}
              </Fragment>
            );
          })}
        </tr>
        {isExpanded && LOCATIONS.map((loc, locIdx) => {
          return (
            <tr key={`${id}-loc-${locIdx}`} className={styles.implRow}>
              <td style={{ paddingLeft: '80px' }}>
                <div className={styles.implCell} style={{ whiteSpace: 'nowrap', padding: '6px 0', color: '#7a6e6a', fontSize: '12px' }}>
                  {loc}
                </div>
              </td>
              <td style={{ backgroundColor: '#f9f9f9', borderLeft: '2px solid #f7f7f7' }}></td>
              {YEARS.map(yr => {
                const locId = `${id}-${locIdx}-${yr}`;
                const locYrQtyStr = distState.locTotals[locId] || '';
                const locYrQty = parseFloat(locYrQtyStr) || 0;

                let yrSumImpLoc = 0;
                IMPLEMENTORS.forEach((_, iIdx) => {
                  yrSumImpLoc += parseFloat(distState.matrixValues[`${id}-${locIdx}-${yr}-${iIdx}`]) || 0;
                });

                const isLocYrBalanced = locYrQty > 0 && Math.abs(locYrQty - yrSumImpLoc) < 0.01;
                const yrQtyForLimit = parseFloat(quantities[`${id}-${yr}`]) || 0;

                return (
                  <Fragment key={`loc-yr-${yr}`}>
                    <td style={{ textAlign: 'right', backgroundColor: '#eeeeee', borderLeft: '2px solid #f7f7f7', fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.editableValue} style={{ justifyContent: 'flex-end', paddingRight: '0' }}>
                        <input
                          type="number"
                          className={styles.valueInput}
                          value={locYrQtyStr}
                          onChange={(e) => handleLocTotalChange(id, locIdx, yr, e.target.value)}
                          onKeyDown={handleKeyDownVertical}
                          data-col-index={`total-${yr}`}
                          placeholder="0"
                          disabled={yrQtyForLimit <= 0}
                          style={{
                            textAlign: 'right',
                            fontWeight: 600,
                            width: '60px',
                            fontSize: '11px',
                            backgroundColor: 'transparent',
                            opacity: yrQtyForLimit > 0 ? 1 : 0.5
                          }}
                        />
                        <Info
                          size={15}
                          color={getIconColor(locYrQtyStr, isLocYrBalanced)}
                          style={{ flexShrink: 0, cursor: 'help' }}
                          onMouseEnter={(e) => handleStatusIconMouseEnter(e, `Ubicación ${yr}`, locYrQty, yrSumImpLoc)}
                          onMouseLeave={handleStatusIconMouseLeave}
                        />
                      </div>
                    </td>
                    {IMPLEMENTORS.map((imp, iIdx) => {
                      const cellId = `${id}-${locIdx}-${yr}-${iIdx}`;
                      const cellValue = distState.matrixValues[cellId] || '';

                      return (
                        <td key={`loc-yr-${yr}-${imp}`} style={{ textAlign: 'right', borderLeft: iIdx === 0 ? '1px solid #f0f0f0' : undefined, backgroundColor: '#f5f5f5' }} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.editableValue} style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                            <input
                              type="number"
                              className={styles.valueInput}
                              value={cellValue}
                              onChange={(e) => handleMatrixChange(id, locIdx, yr, iIdx, e.target.value, locYrQty)}
                              onKeyDown={handleKeyDownVertical}
                              data-col-index={`col-${yr}-${iIdx}`}
                              disabled={locYrQty <= 0}
                              placeholder="0"
                              style={{
                                opacity: locYrQty > 0 ? 1 : 0.5,
                                cursor: locYrQty > 0 ? 'text' : 'not-allowed',
                                textAlign: 'right',
                                backgroundColor: 'transparent'
                              }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tr>
          );
        })}
      </Fragment>
    );
  };

  const programOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.programa))].sort(),
    []
  )
  const projectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => p.proyecto))].sort(),
    []
  )
  const subprojectOptions = useMemo(
    () => [...new Set(planesAnualesData.map(p => `${p.codigosubproyecto} - ${p.subproyecto}`))].sort(),
    []
  )

  const activities = useMemo(() => {
    return actividadData.filter(a => a.unidad && a.tipoValor)
  }, [])





  return (
    <div className={styles.root}>
      <header style={{ padding: '16px 16px 0' }}>
        <PageHeader
          title="Cadena de Resultados"
          subtitle="Gestiona la cadena de resultados técnicos"
        />
      </header>

      {/* ─── Filter Bar ──────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        padding: '16px 24px',
        borderBottom: '1px solid #ece6df',
        flexWrap: 'wrap'
      }}>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Programa"
            options={programOptions}
            value={programFilter}
            onChange={setProgramFilter}
          />
        </div>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Proyecto"
            options={projectOptions}
            value={projectFilter}
            onChange={setProjectFilter}
          />
        </div>
        <div style={{ minWidth: '180px', flex: 1 }}>
          <FilterSelect
            label="Subproyecto"
            options={subprojectOptions}
            value={subprojectFilter}
            onChange={setSubprojectFilter}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '2px' }}>
          <button style={{
            width: '36px', height: '36px',
            backgroundColor: '#FFC658', border: 'none', borderRadius: '6px',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Search size={16} />
          </button>
          <button style={{
            width: '36px', height: '36px',
            backgroundColor: '#fff', border: '1px solid #e0dcd6', borderRadius: '6px',
            color: '#7a6e6a', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} onClick={() => { setProgramFilter(''); setProjectFilter(''); setSubprojectFilter('') }}>
            <RefreshCcw size={16} />
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px',
            backgroundColor: '#fff', border: '1px solid #e0dcd6', borderRadius: '20px',
            color: '#382e2c', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600
          }}>
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* ─── Tree Table ──────────────────────────── */}
      <div className={styles.tableWrapper}>
        <table className={styles.chainTable}>
          <thead>
            <tr>
              <th className={styles.colActividad} rowSpan={2}>
                <div className={styles.thContent}>
                  INDICADORES Y ACTIVIDADES
                  <ArrowUpDown size={14} className={styles.thIcon} />
                  <ListFilter size={14} className={styles.thIcon} />
                </div>
              </th>

                <th rowSpan={2} className={styles.colYear} style={{ textAlign: 'center', borderBottom: '1px solid #ece6df', borderLeft: '2px solid #f7f7f7', minWidth: '100px' }}>
                  <div className={styles.thContent} style={{ justifyContent: 'center' }}>
                    <span>TOTAL GENERAL</span>
                  </div>
                </th>
                {YEARS.map(yr => (
                  <th key={yr} className={styles.colYear} colSpan={4} style={{ textAlign: 'center', borderBottom: '1px solid #ece6df', borderLeft: '2px solid #f7f7f7' }}>
                    <div className={styles.thContent} style={{ justifyContent: 'center', width: '100%' }}>
                      <ListFilter size={13} className={styles.thIcon} />
                      <span style={{ margin: '0 8px' }}>{yr}</span>
                      <ArrowUpDown size={13} className={styles.thIcon} />
                    </div>
                  </th>
                ))}
            </tr>
            <tr>
              {YEARS.map(yr => (
                <Fragment key={`sub-${yr}`}>
                  <th className={styles.colYear} style={{ textAlign: 'center', fontSize: '10px', padding: '6px', borderLeft: '2px solid #f7f7f7', color: '#382e2c', fontWeight: 700 }}>
                    TOTAL
                  </th>
                  {IMPLEMENTORS.map((imp, iIdx) => (
                    <th key={`${yr}-${imp}`} className={styles.colYear} style={{ textAlign: 'center', fontSize: '10px', padding: '6px', borderLeft: iIdx === 0 ? '1px solid #f0f0f0' : undefined }}>
                      {imp}
                    </th>
                  ))}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 1. Indicadores Institucionales */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('inst')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['inst'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Indicadores Institucionales</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f9f9f9', borderLeft: '2px solid #f7f7f7' }}></td>
              {YEARS.map(yr => <td key={`inst-${yr}`} colSpan={4} style={{ borderLeft: '2px solid #f7f7f7' }}></td>)}
            </tr>
            {expandedCategories['inst'] && indicatorsMock.map(item =>
              renderItemRow(`inst-${item.id}`, `${item.codigo} - ${item.nombre}`, (item as any).unidad, (item as any).tipoValor)
            )}

            {/* 2. Indicadores de subproyecto */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('indsub')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['indsub'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Indicadores de Subproyecto</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f9f9f9', borderLeft: '2px solid #f7f7f7' }}></td>
              {YEARS.map(yr => <td key={`indsub-${yr}`} colSpan={4} style={{ borderLeft: '2px solid #f7f7f7' }}></td>)}
            </tr>
            {expandedCategories['indsub'] && subprojectIndicatorsMock.map(item =>
              renderItemRow(`indsub-${item.id}`, `${item.codigo} - ${item.nombre}`, item.unidad, item.tipoValor)
            )}

            {/* 3. Actividades */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('act')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['act'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Actividades</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f9f9f9', borderLeft: '2px solid #f7f7f7' }}></td>
              {YEARS.map(yr => <td key={`act-${yr}`} colSpan={4} style={{ borderLeft: '2px solid #f7f7f7' }}></td>)}
            </tr>
            {expandedCategories['act'] && actividadData.slice(0, 5).map(item =>
              renderItemRow(`act-${item.id}`, `${item.codigoActividad} - ${item.nombre}`, item.unidad, item.tipoValor)
            )}

            {/* 4. Subactividades */}
            <tr className={styles.activityRow} onClick={() => toggleCategory('sub')}>
              <td>
                <div className={styles.activityCell}>
                  <button className={styles.chevronBtn}>
                    {expandedCategories['sub'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <span className={styles.activityName} style={{ fontWeight: 700 }}>Subactividades</span>
                </div>
              </td>
              <td style={{ backgroundColor: '#f0f0f0', borderLeft: '2px solid #f7f7f7' }}></td>
              {YEARS.map(yr => <td key={`sub-${yr}`} colSpan={4} style={{ borderLeft: '2px solid #f7f7f7' }}></td>)}
            </tr>
            {expandedCategories['sub'] && subactividadData.slice(0, 5).map(item =>
              renderItemRow(`sub-${item.id}`, `${item.codigoSubactividad} - ${item.nombre}`, item.unidad, item.tipoValor)
            )}
            

          </tbody>
        </table>
      </div>

      {/* ─── Metrics Popover ─── */}
      {metricsPopover && (
        <div
          className={styles.metricsPopover}
          style={{
            left: metricsPopover.x,
            top: metricsPopover.y,
            pointerEvents: 'none' // Evita parpadeos al pasar por encima del popover
          }}
        >
          <div className={styles.metricsHeader}>
            Definición de métricas
          </div>
          <table className={styles.metricsTable}>
            <thead>
              <tr>
                <th>Atributo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Unidad</td>
                <td style={{ fontWeight: 600 }}>{metricsPopover.unidad}</td>
              </tr>
              <tr>
                <td>Tipo de dato</td>
                <td style={{ fontWeight: 600 }}>{metricsPopover.tipo}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Status Popover ─── */}
      {statusPopover && (
        <div
          className={styles.metricsPopover}
          style={{
            left: statusPopover.x,
            top: statusPopover.y,
            pointerEvents: 'none',
            width: '260px'
          }}
        >
          <div className={styles.metricsHeader} style={{ backgroundColor: '#cacaca' }}>
            {statusPopover.title}
          </div>
          <div style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span>Total esperado</span>
              <span style={{ fontWeight: 600 }}>{statusPopover.expected.toLocaleString('es')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
              <span>{statusPopover.label2 ? 'Reg. Implementadores' : 'Total registrado'}</span>
              <span style={{
                fontWeight: 600,
                color: statusPopover.current === statusPopover.expected ? '#4caf50' : '#ff9800'
              }}>
                {statusPopover.current.toLocaleString('es')}
              </span>
            </div>
            {statusPopover.label2 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#e53935', fontStyle: 'italic', paddingLeft: '8px' }}>
                <span>Diferencia Impl.</span>
                <span>{(statusPopover.expected - statusPopover.current).toLocaleString('es')}</span>
              </div>
            )}

            {statusPopover.current2 !== undefined && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
                  <span>{statusPopover.label2}</span>
                  <span style={{
                    fontWeight: 600,
                    color: statusPopover.current2 === statusPopover.expected ? '#4caf50' : '#ff9800'
                  }}>
                    {statusPopover.current2.toLocaleString('es')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', color: '#e53935', fontStyle: 'italic', paddingLeft: '8px' }}>
                  <span>Diferencia Ubic.</span>
                  <span>{(statusPopover.expected - statusPopover.current2).toLocaleString('es')}</span>
                </div>
              </>
            )}

            {!statusPopover.label2 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #ece6df',
                fontWeight: 700,
                fontSize: '13px',
                color: (statusPopover.expected - statusPopover.current) === 0 ? '#4caf50' : '#e53935'
              }}>
                <span>Diferencia</span>
                <span>{(statusPopover.expected - statusPopover.current).toLocaleString('es')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Footer ──────────────────────────────────── */}
      <div className={styles.footer}>
        <button className={styles.cancelBtn}>Cancelar</button>
        <button className={styles.saveBtn}>Guardar</button>
      </div>

      {modalYear !== null && (
        <IndicatorDetailModal year={modalYear} onClose={() => setModalYear(null)} />
      )}
    </div>
  )
}


