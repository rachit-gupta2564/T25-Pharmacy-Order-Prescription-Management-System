import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { PUBLIC_ROUTES, getDefaultRouteForRole } from '../../routes/routeConfig'

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isAuthReady, user } = useAuth()
  const location = useLocation()

  if (!isAuthReady) {
    return <div className="page-message">Loading your workspace...</div>
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to={PUBLIC_ROUTES.auth}
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={getDefaultRouteForRole(user.role)} />
  }

  return <Outlet />
}
