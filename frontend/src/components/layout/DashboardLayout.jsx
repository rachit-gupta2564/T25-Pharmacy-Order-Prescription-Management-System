import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { QUICK_LINKS, SIDEBAR_SECTIONS } from '../../routes/routeConfig'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  const location = useLocation()
  const { user } = useAuth()

  const quickLinks = QUICK_LINKS.filter(
    (link) =>
      link.roles.includes(user.role) && location.pathname.startsWith(link.scope),
  )

  const sidebarSections = SIDEBAR_SECTIONS.filter((section) =>
    section.roles.includes(user.role),
  )

  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Sidebar sections={sidebarSections} />

      <div className="dashboard-shell__main">
        <Navbar quickLinks={quickLinks} />
        <main className="dashboard-shell__content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
