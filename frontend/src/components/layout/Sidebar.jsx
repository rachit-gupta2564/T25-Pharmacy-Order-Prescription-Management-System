import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar({ sections }) {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__badge">Rx</div>
        <div>
          <p className="sidebar__eyebrow">{user?.role ?? 'Workspace'}</p>
          <p className="sidebar__title">Pharmacy System</p>
        </div>
      </div>

      <nav aria-label="Primary sidebar navigation" className="sidebar__nav">
        {sections.map((section) => (
          <div className="sidebar__section" key={section.title}>
            <p className="sidebar__section-title">{section.title}</p>
            <div className="sidebar__links">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                  }
                  to={link.to}
                >
                  <span className="sidebar__link-icon">{link.short}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
