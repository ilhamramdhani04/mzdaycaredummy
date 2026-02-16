import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route (optional)
 * @param {boolean} props.requirePermission - Permission key to check (optional)
 * @param {React.ReactNode} props.children - Child components to render if authorized
 */
function ProtectedRoute({ 
  allowedRoles, 
  requirePermission, 
  children 
}) {
  const { user, loading, hasPermission } = useAuth()
  const location = useLocation()

  // Show loading state
  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <p className="empty-state-text">Loading...</p>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    // Redirect to login, but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = user.role === 'orangtua' ? 'orang tua' : user.role
    const normalizedAllowedRoles = allowedRoles.map(role => 
      role === 'orangtua' ? 'orang tua' : role
    )
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      // User role not in allowed roles - redirect to dashboard
      return <Navigate to="/dashboard" replace />
    }
  }

  // Check permission-based access
  if (requirePermission) {
    if (!hasPermission(requirePermission)) {
      // User doesn't have required permission - redirect to dashboard
      return <Navigate to="/dashboard" replace />
    }
  }

  // User is authorized
  return children
}

export default ProtectedRoute
