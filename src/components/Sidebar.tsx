import { appModules, type ModuleId } from '../app/modules'

type SidebarProps = {
  activeModule: ModuleId
  onNavigate: (module: ModuleId) => void
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export function Sidebar({ activeModule, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="应用侧栏">
      <a className="brand sidebar-brand" href="#overview" onClick={(event) => { event.preventDefault(); onNavigate('overview') }}>
        <BrandMark />
        <span className="brand-copy">
          <strong>MZOL</strong>
          <small>Mirrorless Zoom Optics Lab</small>
        </span>
      </a>

      <nav className="sidebar-nav" aria-label="模块导航">
        {appModules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={`sidebar-nav-item ${activeModule === module.id ? 'is-active' : ''}`}
            aria-current={activeModule === module.id ? 'page' : undefined}
            onClick={() => onNavigate(module.id)}
          >
            <span className="sidebar-nav-number">{module.number}</span>
            <span className="sidebar-nav-copy">
              <strong>{module.label}</strong>
              <small>{module.kicker}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="sidebar-version">v1.0.0</span>
        <p>基于公开专利的教学示意模型</p>
        <span className="sidebar-status">非官方 · 非商业</span>
      </div>
    </aside>
  )
}
