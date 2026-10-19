import { useEffect, useState } from 'react'
import { DataNotes } from '../components/DataNotes'
import { FocusPanel } from '../components/FocusPanel'
import { GuideSection } from '../components/GuideSection'
import type { Selection, ViewMode } from '../components/LensStructure'
import { OverviewSection } from '../components/OverviewSection'
import { Sidebar } from '../components/Sidebar'
import { WorkbenchSection, type WorkbenchTab } from '../components/WorkbenchSection'
import type { GuidePreset } from '../data/guide'
import { elementById } from '../data/lensStructure'
import { useFocusController } from '../hooks/useFocusController'
import type { RayMode } from '../optics/trace'
import { spacingAtFocal } from '../optics/zoom'
import { isModuleId, moduleById, type ModuleId } from './modules'

function moduleFromHash(): ModuleId {
  const hash = window.location.hash.replace('#', '')
  return isModuleId(hash) ? hash : 'overview'
}

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(moduleFromHash)
  const [viewMode, setViewMode] = useState<ViewMode>('elements')
  const [selection, setSelection] = useState<Selection>({ kind: 'group', id: 'G1' })
  const [rayMode, setRayMode] = useState<RayMode>('onAxis')
  const [showRays, setShowRays] = useState(true)
  const [focal, setFocal] = useState(24)
  const [workbenchTab, setWorkbenchTab] = useState<WorkbenchTab>('structure')
  const spacing = spacingAtFocal(focal)
  const focus = useFocusController(focal, spacing)

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (isModuleId(hash)) setActiveModule(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = `${moduleById[activeModule].label} · Mirrorless Zoom Optics Lab`
    document.getElementById('module-main')?.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeModule])

  const navigate = (module: ModuleId) => {
    setActiveModule(module)
    if (window.location.hash !== `#${module}`) {
      window.history.replaceState(null, '', `#${module}`)
    }
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
    <div className="app-shell">
      <a className="skip-link" href="#module-main">
        跳到主内容
      </a>

      <Sidebar activeModule={activeModule} onNavigate={navigate} />

      <main
        className="app-main"
        id="module-main"
        data-module={activeModule}
        tabIndex={-1}
      >
        <div className="app-module">
          {activeModule === 'overview' ? <OverviewSection onNavigate={navigate} /> : null}

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
              tab={workbenchTab}
              onTabChange={setWorkbenchTab}
              onFocalChange={setFocal}
              onViewModeChange={handleViewModeChange}
              onSelect={setSelection}
              onRayModeChange={setRayMode}
              onShowRaysChange={setShowRays}
            />
          ) : null}

          {activeModule === 'focus' ? <FocusPanel controller={focus} focal={focal} /> : null}

          {activeModule === 'guide' ? <GuideSection onTryThis={handleGuidePreset} /> : null}

          {activeModule === 'data' ? <DataNotes /> : null}
        </div>
      </main>
    </div>
  )
}

export default App
