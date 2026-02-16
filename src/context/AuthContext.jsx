import { createContext, useContext, useState, useEffect } from 'react'
import { authenticateUser, getRolePermissions, hasPermission as checkPermission, getDashboardType } from '../utils/auth.js'

// Create Auth Context
const AuthContext = createContext(null)

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('mz_session')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (e) {
        localStorage.removeItem('mz_session')
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const userData = authenticateUser(username, password)
    
    if (userData) {
      // Store user in localStorage and state (without password)
      localStorage.setItem('mz_session', JSON.stringify(userData))
      setUser(userData)
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    localStorage.removeItem('mz_session')
    setUser(null)
  }

  const getPermissions = () => {
    if (!user) return {}
    return getRolePermissions(user.role)
  }

  const hasPermission = (permission) => {
    if (!user) return false
    return checkPermission(user.role, permission)
  }

  const getDashboardRoute = () => {
    if (!user) return '/login'
    const dashboardType = getDashboardType(user.role)
    return `/dashboard/${dashboardType}`
  }

  const value = {
    user,
    loading,
    login,
    logout,
    getPermissions,
    hasPermission,
    permissions: getPermissions(),
    dashboardRoute: getDashboardRoute(),
    isAuthenticated: !!user,
    isOwner: user?.role?.toLowerCase() === 'owner',
    isSuperadmin: user?.role?.toLowerCase() === 'superadmin',
    isGuru: user?.role?.toLowerCase() === 'guru',
    isOrangtua: user?.role?.toLowerCase() === 'orangtua' || user?.role?.toLowerCase() === 'orang tua'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
