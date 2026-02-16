/**
 * Centralized Route Configuration
 * Mannazentrum Daycare Management System
 */

export const ROUTES = {
  // Public
  LOGIN: '/login',
  
  // Role-based dashboards
  OWNER: {
    ROOT: '/dashboard/owner',
    DASHBOARD: '/dashboard/owner',
    BRANCHES: '/dashboard/owner/branches',
    INVOICES: '/dashboard/owner/invoices',
    FINANCE: '/dashboard/owner/finance',
  },
  
  SUPERADMIN: {
    ROOT: '/dashboard/superadmin',
    DASHBOARD: '/dashboard/superadmin',
    ATTENDANCE: '/dashboard/superadmin/attendance',
    REPORTS: '/dashboard/superadmin/reports',
    USERS: '/dashboard/superadmin/users',
    FINANCE: '/dashboard/superadmin/finance',
    MENUS: '/dashboard/superadmin/menus',
    BATHING: '/dashboard/superadmin/bathing',
    STIMULASI: '/dashboard/superadmin/stimulasi',
    MEDICATION: '/dashboard/superadmin/medication',
    INVENTORY: '/dashboard/superadmin/inventory',
    MEDIA: '/dashboard/superadmin/media',
    OVERTIME: '/dashboard/superadmin/overtime',
    TEACHER_CONFIG: '/dashboard/superadmin/teacher-config',
  },
  
  GURU: {
    ROOT: '/dashboard/guru',
    DASHBOARD: '/dashboard/guru',
    ATTENDANCE: '/dashboard/guru/attendance',
    REPORTS: '/dashboard/guru/reports',
    MENUS: '/dashboard/guru/menus',
    BATHING: '/dashboard/guru/bathing',
    STIMULASI: '/dashboard/guru/stimulasi',
    MEDICATION: '/dashboard/guru/medication',
    INVENTORY: '/dashboard/guru/inventory',
    MEDIA: '/dashboard/guru/media',
    OVERTIME: '/dashboard/guru/overtime',
  },
  
  ORANGTUA: {
    ROOT: '/dashboard/orangtua',
    DASHBOARD: '/dashboard/orangtua',
    CHILDREN: '/dashboard/orangtua/children',
    ATTENDANCE: '/dashboard/orangtua/attendance',
    REPORTS: '/dashboard/orangtua/reports',
    INVOICES: '/dashboard/orangtua/invoices',
  },
}

// Get default route based on role
export const getDefaultRoute = (role) => {
  switch (role) {
    case 'owner':
      return ROUTES.OWNER.DASHBOARD
    case 'superadmin':
      return ROUTES.SUPERADMIN.DASHBOARD
    case 'guru':
      return ROUTES.GURU.DASHBOARD
    case 'orangtua':
      return ROUTES.ORANGTUA.DASHBOARD
    default:
      return ROUTES.LOGIN
  }
}

// Get role from path
export const getRoleFromPath = (path) => {
  if (path.includes('/dashboard/owner')) return 'owner'
  if (path.includes('/dashboard/superadmin')) return 'superadmin'
  if (path.includes('/dashboard/guru')) return 'guru'
  if (path.includes('/dashboard/orangtua')) return 'orangtua'
  return null
}
