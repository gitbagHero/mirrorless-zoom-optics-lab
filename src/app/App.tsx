import { useEffect, useRef, useState } from 'react'
import { DataNotes } from '../components/DataNotes'
import { FocusPanel } from '../components/FocusPanel'
import { GuideSection } from '../components/GuideSection'
import { LandingPage } from '../components/LandingPage'
import type { Selection, ViewMode } from '../components/LensStructure'
import { Sidebar } from '../components/Sidebar'
import { WorkbenchSection, type WorkbenchTab } from '../components/WorkbenchSection'
import type { GuidePreset } from '../data/guide'
import { elementById } from '../data/lensStructure'
import { useFocusController } from '../hooks/useFocusController'
import type { RayMode } from '../optics/trace'
import { spacingAtFocal } from '../optics/zoom'
import { isModuleId, moduleById, type ModuleId } from './modules'

const COLLAPSE_KEY = 'mzol-sidebar-collapsed'

function moduleFromHash(): ModuleId {
  const hash = window.location.hash.replace('#', '')
  return isModuleId(hash) ? hash : 'workbench'
}

function hasModuleHash() {
  return isModuleId(window.location.hash.replace('#', ''))
}

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

function App() {
  const [landingVisible, setLandingVisible] = useState(() => !hasModuleHash())
  const [entering, setEntering] = useState(false)
  const [activeModule, setActiveModule] = useState<ModuleId>(moduleFromHash)
  const [viewMode, setViewMode] = useState<ViewMode>('elements')
  const [selection, setSelection] = useState<Selection>({ kind: 'group', id: 'G1' })
  const [rayMode, setRayMode] = useState<RayMode>('onAxis')
  const [showRays, setShowRays] = useState(true)
  const [showShell, setShowShell] = useState(false)
  const [focal, setFocal] = useState(24)
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('structure')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsed)
  const spacing = spacingAtFocal(focal)
  const focus = useFocusController(focal, spacing)
  const enterTimer = useRef<number | null>(null)

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (isModuleId(hash)) {
        setActiveModule(hash)
        setLandingVisible(false)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, sidebarCollapsed ? '1' : '0')
    } catch {
      // Storage is optional; the layout still works without it.
    }
  }, [sidebarCollapsed])

  useEffect(() => {
    document.title = landingVisible
      ? 'Mirrorless Zoom Optics Lab · 微单变焦镜头光学实验室'
      : `${moduleById[activeModule].label} · Mirrorless Zoom Optics Lab`
    document.getElementById('module-main')?.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeModule, landingVisible])

  useEffect(
    () => () => {
      if (enterTimer.current !== null) window.clearTimeout(enterTimer.current)
    },
    [],
  )

  const navigate = (module: ModuleId) => {
    setActiveModule(module)
    if (window.location.hash !== `#${module}`) {
      window.history.replaceState(null, '', `#${module}`)
    }
  }

  const startEnter = () => {
    if (entering) return
    setShowShell(false)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      navigate('workbench')
      setLandingVisible(false)
      return
    }
    navigate('workbench')
    setEntering(true)
    enterTimer.current = window.setTimeout(() => {
      setLandingVisible(false)
      setEntering(false)
      enterTimer.current = null
    }, 900)
  }

  const exitToLanding = () => {
    if (enterTimer.current !== null) {
      window.clearTimeout(enterTimer.current)
      enterTimer.current = null
    }
    setEntering(false)
    setLandingVisible(true)
    window.history.replaceState(null, '', window.location.pathname)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'groups' && selection.kind === 'element') {
      setSelection({ kind: 'group', id: elementById[selection.id].group })
    }
  }

  const handleGuidePreset = (preset: GuidePreset) => {
    switch (preset) {
      case 'structure':
        setFocal(24)
        setViewMode('elements')
        setSelection({ kind: 'group', id: 'G1' })
        setShowRays(false)
        setRayMode('onAxis')
        setWorkbenchTab('structure')
        navigate('workbench')
        break
      case 'zoom':
        setFocal(200)
        setViewMode('groups')
        setSelection({ kind: 'group', id: 'G5' })
        setShowRays(true)
        setRayMode('fan')
        setWorkbenchTab('motion')
        navigate('workbench')
        break
      case 'focus':
        setFocal(105)
        setViewMode('elements')
        setSelection({ kind: 'group', id: 'G5' })
        setShowRays(true)
        setRayMode('onAxis')
        focus.setTargetDistance(4)
        focus.setMode('AF-C')
        navigate('focus')
        break
      case 'autofocus':
        setFocal(200)
        setSelection({ kind: 'group', id: 'G5' })
        setShowRays(true)
        focus.setTargetDistance(4)
        focus.setMode('AF-C')
        navigate('focus')
        break
      case 'elements':
        setFocal(50)
        setViewMode('elements')
        setSelection({ kind: 'element', id: 'L12' })
        setShowRays(true)
        setRayMode('onAxis')
        setWorkbenchTab('structure')
        navigate('workbench')
        break
      case 'model':
        navigate('data')
        break
    }
  }

  return (
    <div className="app-root">
      {landingVisible ? <LandingPage exiting={entering} onEnter={startEnter} /> : null}

      {!landingVisible || entering ? (
        <div
          className={`app-shell ${sidebarCollapsed ? 'is-collapsed' : ''} ${entering ? 'is-entering' : ''}`}
          aria-hidden={entering ? true : undefined}
        >
          <a className="skip-link" href="#module-main">
            跳到主内容
          </a>

          <Sidebar
            activeModule={activeModule}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((value) => !value)}
            onNavigate={navigate}
            onExit={exitToLanding}
          />

          <main
            className="app-main"
            id="module-main"
            data-module={activeModule}
            tabIndex={-1}
          >
            <div className="app-module">
              {activeModule === 'workbench' ? (
                <WorkbenchSection
                  focal={focal}
                  spacing={spacing}
                  focusSpacing={focus.focusSpacing}
                  objectDistanceMm={focus.targetDistance * 1000}
                  viewMode={viewMode}
                  selection={selection}
                  rayMode={rayMode}
                  showRays={showRays}
                  showShell={showShell}
                  tab={workbenchTab}
                  onTabChange={setWorkbenchTab}
                  onFocalChange={setFocal}
                  onViewModeChange={handleViewModeChange}
                  onSelect={setSelection}
                  onRayModeChange={setRayMode}
                  onShowRaysChange={setShowRays}
                  onShowShellChange={setShowShell}
                />
              ) : null}

              {activeModule === 'focus' ? <FocusPanel controller={focus} focal={focal} /> : null}

              {activeModule === 'guide' ? <GuideSection onTryThis={handleGuidePreset} /> : null}

              {activeModule === 'data' ? <DataNotes /> : null}
            </div>
          </main>
        </div>
      ) : null}
    </div>
  )
}

export default App
