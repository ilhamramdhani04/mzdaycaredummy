import dummyData from '../data/dummyData.json'

// ============================================
// CENTRALIZED ROLE PERMISSIONS MATRIX
// ============================================
export const ROLE_PERMISSIONS = {
  owner: {
    // Strategic Level
    canViewDashboard: true,
    canViewKPIs: true,
    canViewFinancialSummary: true,
    canViewAllBranches: true,
    canApproveInvoice: true,
    canViewInvoices: true,
    canViewAllChildren: true,
    canViewAttendance: true,
    canViewReports: true,
    canManageUsers: false,
    canEditAttendance: false,
    canEditReports: false,
    canCheckInOut: false,
    canLockReports: false,
    canCreateReports: false,
    canViewOwnChildOnly: false,
    canViewOwnInvoicesOnly: false
  },
  superadmin: {
    // Operational Control
    canViewDashboard: true,
    canViewKPIs: false,
    canViewFinancialSummary: true,
    canViewAllBranches: false,
    canApproveInvoice: false,
    canViewInvoices: true,
    canViewAllChildren: true,
    canViewAttendance: true,
    canViewReports: true,
    canManageUsers: true,
    canEditAttendance: false,
    canEditReports: false,
    canCheckInOut: false,
    canLockReports: true,
    canCreateReports: false,
    canViewOwnChildOnly: false,
    canViewOwnInvoicesOnly: false,
    // Management Features
    canManageMenus: true,
    canManageBathing: true,
    canManageStimulasi: true,
    canManageMedication: true,
    canManageInventory: true,
    canManageMedia: true,
    canManageOvertime: true
  },
  guru: {
    // Execution Layer
    canViewDashboard: true,
    canViewKPIs: false,
    canViewFinancialSummary: false,
    canViewAllBranches: false,
    canApproveInvoice: false,
    canViewInvoices: false,
    canViewAllChildren: true,
    canViewAttendance: true,
    canViewReports: true,
    canManageUsers: false,
    canEditAttendance: true,
    canEditReports: true,
    canCheckInOut: true,
    canLockReports: false,
    canCreateReports: true,
    canViewOwnChildOnly: false,
    canViewOwnInvoicesOnly: false,
    // Management Features
    canManageMenus: true,
    canManageBathing: true,
    canManageStimulasi: true,
    canManageMedication: true,
    canManageInventory: true,
    canManageMedia: true,
    canManageOvertime: true
  },
  orangtua: {
    // Client View
    canViewDashboard: true,
    canViewKPIs: false,
    canViewFinancialSummary: false,
    canViewAllBranches: false,
    canApproveInvoice: false,
    canViewInvoices: true,
    canViewAllChildren: false,
    canViewAttendance: true,
    canViewReports: true,
    canManageUsers: false,
    canEditAttendance: false,
    canEditReports: false,
    canCheckInOut: false,
    canLockReports: false,
    canCreateReports: false,
    canViewOwnChildOnly: true,
    canViewOwnInvoicesOnly: true
  }
}

/**
 * Get permissions for a specific role
 * @param {string} role - User role
 * @returns {Object} Permission object
 */
export const getRolePermissions = (role) => {
  const normalizedRole = role?.toLowerCase()?.replace(' ', '') || ''
  return ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS[role] || {}
}

/**
 * Check if user has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission key
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const permissions = getRolePermissions(role)
  return permissions[permission] === true
}

/**
 * Get dashboard type based on role
 * @param {string} role - User role
 * @returns {string} Dashboard type
 */
export const getDashboardType = (role) => {
  const normalizedRole = role?.toLowerCase()?.replace(' ', '') || ''
  switch (normalizedRole) {
    case 'owner':
      return 'owner'
    case 'superadmin':
      return 'superadmin'
    case 'guru':
      return 'guru'
    case 'orangtua':
    case 'orangtua':
      return 'orangtua'
    default:
      return 'guru'
  }
}

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

/**
 * Authenticate user with credentials
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object|null} User object or null if invalid
 */
export const authenticateUser = (username, password) => {
  const user = dummyData.users.find(
    u => u.username === username && u.password === password
  )
  
  if (!user) return null
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null}
 */
export const getUserById = (userId) => {
  const user = dummyData.users.find(u => u.id === userId)
  if (!user) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Get all users
 * @returns {Array} Array of users
 */
export const getAllUsers = () => {
  return dummyData.users.map(({ password, ...user }) => user)
}
