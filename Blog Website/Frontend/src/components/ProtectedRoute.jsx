import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps any route that requires authentication.
 * Optionally pass `requireWriter` to also enforce writer/admin role.
 */
export default function ProtectedRoute({ children, requireWriter = false }) {
  const { isAuthenticated, canWrite, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-muted text-sm tracking-widest uppercase animate-pulse">
          Loading…
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireWriter && !canWrite) {
    return <Navigate to="/" replace />
  }

  return children
}