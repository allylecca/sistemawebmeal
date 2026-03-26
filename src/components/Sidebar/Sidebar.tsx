import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Menu,
  Maximize,
  Minimize,
  Building2,
  NotebookTabs,
  BookOpenCheck,
  Goal,
  ListTodo,
  Users,
  DollarSign,
  Shield,
  FileSliders,
  Database,
  FileSpreadsheet,
  BrickWallShield,
  MessageCircleQuestion,
  Info,
  ChevronRight,
  ChevronDown,
  ChartBarBig
} from 'lucide-react'
import styles from './Sidebar.module.css'
import loginLogo from '../../assets/login-logo.svg'

export interface MenuItem {
  id: string
  label: string
  icon: ReactNode
  subItems?: { id: string; label: string }[]
}

const menuItems: MenuItem[] = [
  { id: 'dashboards', label: 'Dashboard', icon: <ChartBarBig size={20} /> },
  {
    id: 'marco',
    label: 'Marco Programático',
    icon: <Building2 size={20} />,
    subItems: [
      { id: 'gaps', label: 'GAPS' },
      { id: 'lineas', label: 'Líneas Estratégicas' },
      { id: 'indicadores-inst', label: 'Nombres de Indicadores Institucionales' },
      { id: 'ubicaciones', label: 'Ubicaciones' },
      { id: 'programas', label: 'Programas' },
      { id: 'codigos-proy', label: 'Códigos de Proyectos' },
      { id: 'codigos-subproy', label: 'Códigos de Subproyectos' },
    ]
  },
  { id: 'planificacion', label: 'Planificación Anual', icon: <NotebookTabs size={20} /> },
  {
    id: 'ejecucion',
    label: 'Ejecución Anual',
    icon: <BookOpenCheck size={20} />,
    subItems: [
      { id: 'marco-logico', label: 'Marco Lógico' },
      { id: 'indicadores', label: 'Indicadores' },
    ]
  },
  { id: 'cadena', label: 'Cadena de Resultados', icon: <Goal size={20} /> },
  { id: 'monitoreo', label: 'Monitoreo', icon: <ListTodo size={20} /> },
  { id: 'beneficiarios', label: 'Beneficiarios', icon: <Users size={20} /> },
  { id: 'presupuesto', label: 'Presupuesto', icon: <DollarSign size={20} /> },
  { id: 'seguridad', label: 'Seguridad', icon: <Shield size={20} /> },
  { id: 'administracion', label: 'Administración', icon: <FileSliders size={20} /> },
  { id: 'mantenimiento', label: 'Mantenimiento', icon: <Database size={20} /> },
  { id: 'tutoriales', label: 'Tutoriales', icon: <FileSpreadsheet size={20} /> },
  { id: 'gestion', label: 'Gestión del Sistema', icon: <BrickWallShield size={20} /> },
  { id: 'soporte', label: 'Soporte', icon: <MessageCircleQuestion size={20} /> },
  { id: 'acerca', label: 'Acerca de', icon: <Info size={20} /> },
]

interface SidebarProps {
  onNavigate: (id: string) => void
  activeSubItem: string
}

export function Sidebar({ onNavigate, activeSubItem }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(['marco', 'planificacion'])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMenu = (menuId: string) => {
    if (isCollapsed) {
      setIsCollapsed(false)
      setOpenMenus([menuId])
      return
    }
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        {!isCollapsed && <img src={loginLogo} alt="Ayuda en Acción" className={styles.logo} />}
        <button className={styles.menuButton} onClick={() => setIsCollapsed(!isCollapsed)}>
          <Menu size={20} />
        </button>
      </div>

      <div className={styles.actionSection}>
        <button
          className={styles.navItem}
          onClick={toggleFullscreen}
          title={isCollapsed ? "Pantalla completa" : undefined}
        >
          <span className={styles.navIcon}>{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</span>
          {!isCollapsed && (isFullscreen ? "Modo ventana" : "Pantalla completa")}
        </button>
      </div>

      <div className={styles.scrollArea}>
        <nav className={styles.navSection}>
          {menuItems.map((item) => {
            const isItemActive = item.id === activeSubItem;

            return (
              <div key={item.id}>
                <button
                  className={`${styles.navItem} ${isItemActive ? styles.navItemActive : ''}`}
                  onClick={() => {
                    if (item.subItems) {
                      toggleMenu(item.id)
                    } else {
                      onNavigate(item.id)
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      {item.label}
                      {item.subItems && (
                        <ChevronDown
                          size={16}
                          className={`${styles.navChevron} ${openMenus.includes(item.id) ? styles.navChevronOpen : ''}`}
                        />
                      )}
                      {!item.subItems && (
                        <ChevronRight size={16} className={styles.navChevron} />
                      )}
                    </>
                  )}
                </button>

                {item.subItems && openMenus.includes(item.id) && !isCollapsed && (
                  <div className={styles.subMenuContainer}>
                    <div className={styles.subMenuLine} />
                    <div className={styles.subMenu}>
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          className={`${styles.subNavItem} ${activeSubItem === subItem.id ? styles.subNavItemActive : ''}`}
                          onClick={() => onNavigate(subItem.id)}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className={styles.footer}>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
          alt="User"
          className={styles.avatar}
        />
        {!isCollapsed && (
          <>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Carolina Méndez Correa</span>
              <span className={styles.userRole}>Especialista MEAL</span>
            </div>
            <ChevronRight size={14} className={styles.navChevron} />
          </>
        )}
      </div>
    </aside>
  )
}
