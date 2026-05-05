import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { Button } from '../common/Button'

export function Navbar({ quickLinks = [] }) {
  const { logout, user } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="navbar">
      <div className="navbar__intro">
        <p className="navbar__eyebrow">Pharmacy Workspace</p>
        <h1 className="navbar__title">Pharmacy Order & Prescription Management</h1>
        <p className="navbar__subtitle">
          Signed in as {user?.fullName} ({user?.role})
        </p>
      </div>

      <div className="navbar__actions">
        <nav aria-label="Quick navigation" className="navbar__quick-links">
          {quickLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `navbar__chip${isActive ? ' navbar__chip--active' : ''}`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="navbar__button-row">
          {user?.role === 'PATIENT' ? (
            <div className="cart-indicator">Cart items: {itemCount}</div>
          ) : null}
          <Button onClick={logout} variant="secondary">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
