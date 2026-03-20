import { useState } from 'react'
import { LoginView } from './views/Login/LoginView'
import { ProjectView } from './views/ProjectView/ProjectView'

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'project'>('project')

  const handleLogin = () => {
    setCurrentView('project')
  }

  return (
    <>
      {currentView === 'login' ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <ProjectView />
      )}
    </>
  )
}
