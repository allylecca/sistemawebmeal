import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff
} from 'lucide-react'
import styles from './LoginView.module.css'

import loginPhoto from '../../assets/login-photo.png'
import loginLogo from '../../assets/login-logo.svg'
import isologo from '../../assets/isologo.svg'
import { InputText } from '../../components/InputText/InputText'
import { Button } from '../../components/Button/Button'
import { Checkbox } from '../../components/Checkbox/Checkbox'

type ThemeMode = 'light' | 'dark' | 'system'

export type LoginViewProps = {
  onLogin?: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [zoom, setZoom] = useState(100)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const zoomText = useMemo(() => `${zoom}%`, [zoom])

  const handleLogin = () => {
    if (onLogin) onLogin()
  }

  useEffect(() => {
    const root = document.documentElement
    if (themeMode === 'system') {
      delete root.dataset.theme
      return
    }
    root.dataset.theme = themeMode
  }, [themeMode])

  const canContinue = email.length > 0 && password.length > 0

  return (
    <div className={styles.root} data-name="Login-default">
      <div className={styles.layout}>
        <aside className={styles.photo} aria-hidden="true">
          <img src={loginPhoto} alt="Login decoration" />
        </aside>

        <section className={styles.content} aria-label="Login">
          <header className={styles.header}>
            <button type="button" className={styles.ghostButton}>
              <span aria-hidden="true">🇪🇸</span> ES <ChevronDown size={14} />
            </button>

            <div className={styles.separator} />

            <div className={styles.pillGroup} aria-label="Theme">
              <button
                type="button"
                className={`${styles.pillIconButton} ${
                  themeMode === 'light' ? styles.pillIconButtonActive : ''
                }`}
                onClick={() => setThemeMode('light')}
                aria-pressed="true"
                title="Light"
              >
                <Sun size={20} />
              </button>
              <button
                type="button"
                className={`${styles.pillIconButton} ${
                  themeMode === 'dark' ? styles.pillIconButtonActive : ''
                }`}
                onClick={() => setThemeMode('dark')}
                aria-pressed={themeMode === 'dark'}
                title="Dark"
              >
                <Moon size={20} />
              </button>
              <button
                type="button"
                className={`${styles.pillIconButton} ${
                  themeMode === 'system' ? styles.pillIconButtonActive : ''
                }`}
                onClick={() => setThemeMode('system')}
                aria-pressed={themeMode === 'system'}
                title="System"
              >
                <Monitor size={20} />
              </button>
            </div>

            <div className={styles.separator} />

            <div className={styles.zoom} aria-label="Zoom">
              <button
                type="button"
                className={styles.pillIconButton}
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                title="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <span className={styles.zoomText}>{zoomText}</span>
              <button
                type="button"
                className={styles.pillIconButton}
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                title="Zoom in"
              >
                <ZoomIn size="20" />
              </button>
            </div>
          </header>

          <main className={styles.formWrapper}>
            <div className={styles.formContainer} style={{ transform: `scale(${zoom / 100})` }}>
              <img src={loginLogo} alt="Ayuda en Acción" className={styles.logo} />

              <div className={styles.titleGroup}>
                <h1 className={styles.title}>¡Te damos la bienvenida!</h1>
                <p className={styles.subtitle}>
                  Sistema Web MEAL para el seguimiento y monitoreo de proyectos de AEA.
                </p>
              </div>

              <Button
                variant="primary"
                fullWidth
                leftIcon={<img src={isologo} alt="" className={styles.ssoIcon} />}
                className={styles.ssoButton}
                onClick={handleLogin}
              >
                Ingresar con Ayuda en Acción
              </Button>

              <div className={styles.divider}>
                <span>o ingreso externo</span>
              </div>

              <div className={styles.inputs}>
                <InputText
                  label="Correo electrónico"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <div className={styles.passwordWrapper}>
                  <InputText
                    label="Contraseña"
                    placeholder="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.options}>
                <Checkbox label="Recordarme" />
                <a href="#" className={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                variant="primary"
                fullWidth
                disabled={!canContinue}
                className={styles.continueButton}
                onClick={handleLogin}
              >
                Continuar
              </Button>
            </div>
          </main>
        </section>
      </div>
    </div>
  )
}

