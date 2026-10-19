import { appModules, type ModuleIconName, type ModuleId } from '../app/modules'

type SidebarProps = {
  activeModule: ModuleId
  collapsed: boolean
  onToggle: () => void
  onNavigate: (module: ModuleId) => void
  onExit: () => void
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

function ModuleIcon({ name }: { name: ModuleIconName }) {
  if (name === 'lens') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="2" y="6" width="16" height="8" rx="3" />
        <circle cx="12.5" cy="10" r="2.2" />
        <path d="M2 8.5h3M15 8.5h3" />
      </svg>
    )
  }
  if (name === 'focus') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="5.5" />
        <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3" />
        <circle cx="10" cy="10" r="1.5" />
      </svg>
    )
  }
  if (name === 'guide') {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 4.5h5.5c1 0 1.5.6 1.5 1.5v10c0-.9-.5-1.5-1.5-1.5H3z" />
        <path d="M17 4.5h-5.5c-1 0-1.5.6-1.5 1.5v10c0-.9.5-1.5 1.5-1.5H17z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
      <path d="M3.5 5v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5M3.5 10v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5" />
    </svg>
  )
}

export function Sidebar({
  activeModule,
  collapsed,
  onToggle,
  onNavigate,
  onExit,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-label="应用侧栏">
      <div className="sidebar-top">
        <a
          className="brand sidebar-brand"
          href="#"
          aria-label="返回起始页"
          onClick={(event) => {
            event.preventDefault()
            onExit()
          }}
        >
          <BrandMark />
          <span className="brand-copy">
            <strong>MZOL</strong>
            <small>Mirrorless Zoom Optics Lab</small>
          </span>
        </a>
        <button
          type="button"
          className="sidebar-collapse"
          aria-expanded={!collapsed}
          aria-label={collapsed ? '展开菜单' : '折叠菜单'}
          onClick={onToggle}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="模块导航">
        {appModules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={`sidebar-nav-item ${activeModule === module.id ? 'is-active' : ''}`}
            aria-current={activeModule === module.id ? 'page' : undefined}
            aria-label={module.label}
            title={collapsed ? module.label : undefined}
            onClick={() => onNavigate(module.id)}
          >
            <span className="sidebar-nav-icon">
              <ModuleIcon name={module.icon} />
            </span>
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
        <button type="button" className="sidebar-home" onClick={onExit}>
          返回起始页
        </button>
      </div>
    </aside>
  )
}
