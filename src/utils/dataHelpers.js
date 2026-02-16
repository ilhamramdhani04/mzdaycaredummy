import dummyData from '../data/dummyData.json'

/**
 * Get all children from dummy data
 * @param {Object} filters - Optional filters
 * @returns {Array} Children array
 */
export const getAllChildren = (filters = {}) => {
  let children = [...dummyData.children]
  
  if (filters.branchId) {
    children = children.filter(c => c.branchId === filters.branchId)
  }
  
  if (filters.parentId) {
    children = children.filter(c => c.parentId === filters.parentId)
  }
  
  if (filters.status) {
    children = children.filter(c => c.status === filters.status)
  }
  
  return children
}

/**
 * Get child by ID
 * @param {string} childId - Child ID
 * @returns {Object|null}
 */
export const getChildById = (childId) => {
  const child = dummyData.children.find(c => c.id === childId)
  if (!child) return null
  
  // Enrich with package info
  const pkg = dummyData.packages.find(p => p.id === child.packageId)
  return {
    ...child,
    package: pkg || null
  }
}

/**
 * Get children by parent ID
 * @param {string} parentId - Parent ID
 * @returns {Array} Children array
 */
export const getChildrenByParent = (parentId) => {
  return dummyData.children
    .filter(c => c.parentId === parentId)
    .map(child => {
      const pkg = dummyData.packages.find(p => p.id === child.packageId)
      return { ...child, package: pkg }
    })
}

/**
 * Get package by ID
 * @param {string} packageId - Package ID
 * @returns {Object|null}
 */
export const getPackageById = (packageId) => {
  return dummyData.packages.find(p => p.id === packageId) || null
}

/**
 * Get all packages
 * @returns {Array} Packages array
 */
export const getAllPackages = () => {
  return [...dummyData.packages]
}

/**
 * Get branch by ID
 * @param {string} branchId - Branch ID
 * @returns {Object|null}
 */
export const getBranchById = (branchId) => {
  const branch = dummyData.branches.find(b => b.id === branchId)
  if (!branch) return null
  
  // Enrich with manager info
  const manager = dummyData.users.find(u => u.id === branch.managerId)
  return {
    ...branch,
    manager: manager ? { id: manager.id, displayName: manager.displayName } : null
  }
}

/**
 * Get all branches
 * @returns {Array} Branches array
 */
export const getAllBranches = () => {
  return dummyData.branches.map(branch => {
    const manager = dummyData.users.find(u => u.id === branch.managerId)
    return {
      ...branch,
      manager: manager ? { id: manager.id, displayName: manager.displayName } : null,
      childCount: dummyData.children.filter(c => c.branchId === branch.id).length
    }
  })
}

/**
 * Calculate child's age in years and months
 * @param {string} dateOfBirth - Date of birth (YYYY-MM-DD)
 * @returns {Object} Age object
 */
export const calculateAge = (dateOfBirth) => {
  const birth = new Date(dateOfBirth)
  const today = new Date()
  
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  return { years, months, display: `${years}th ${months}bln` }
}

/**
 * Get KPI statistics for owner dashboard
 * @returns {Object} KPI data
 */
export const getOwnerKPIs = () => {
  const activeChildren = dummyData.children.filter(c => c.status === 'active')
  const totalChildren = activeChildren.length
  
  // Get current month invoices
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  const currentInvoices = dummyData.invoices.filter(
    inv => inv.month === currentMonth && inv.year === currentYear
  )
  
  const totalRevenue = currentInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalOvertime = currentInvoices.reduce((sum, inv) => sum + inv.overtimeAmount, 0)
  
  // Calculate total overtime minutes for this month
  const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
  const endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
  
  const monthlyAttendance = dummyData.attendance.filter(
    a => a.date >= startDate && a.date <= endDate
  )
  
  const totalOvertimeMinutes = monthlyAttendance.reduce(
    (sum, a) => sum + (a.overtimeMinutes || 0), 0
  )
  const overtimeDays = monthlyAttendance.filter(a => a.overtimeMinutes > 0).length
  
  // Branch stats
  const branchStats = dummyData.branches.map(branch => ({
    ...branch,
    childCount: dummyData.children.filter(c => c.branchId === branch.id && c.status === 'active').length,
    monthlyRevenue: currentInvoices
      .filter(inv => {
        const child = dummyData.children.find(c => c.id === inv.childId)
        return child?.branchId === branch.id
      })
      .reduce((sum, inv) => sum + inv.totalAmount, 0)
  }))
  
  return {
    totalChildren,
    totalRevenue,
    totalOvertime,
    totalOvertimeMinutes,
    overtimeDays,
    totalBranches: dummyData.branches.length,
    activeStaff: dummyData.users.filter(u => ['guru', 'superadmin'].includes(u.role)).length,
    branchStats,
    pendingApprovals: currentInvoices.filter(inv => inv.status === 'Draft').length,
    approvalRate: currentInvoices.length > 0 
      ? Math.round((currentInvoices.filter(inv => inv.status === 'Approved').length / currentInvoices.length) * 100)
      : 0
  }
}

/**
 * Get dashboard summary for superadmin
 * @param {string} branchId - Branch ID
 * @returns {Object} Summary data
 */
export const getSuperadminSummary = (branchId) => {
  const today = new Date().toISOString().split('T')[0]
  
  // Get branch children
  const children = dummyData.children.filter(
    c => c.branchId === branchId && c.status === 'active'
  )
  
  // Today's attendance
  const todayAttendance = dummyData.attendance.filter(a => a.date === today)
  const checkedInChildren = todayAttendance.filter(a => a.checkIn && !a.checkOut).length
  const checkedOutChildren = todayAttendance.filter(a => a.checkOut).length
  const notArrived = children.length - todayAttendance.length
  
  // Reports status
  const todayReports = dummyData.reports.filter(r => r.date === today)
  const draftReports = todayReports.filter(r => r.status === 'Draft').length
  const finalReports = todayReports.filter(r => r.status === 'Final').length
  
  // Pending reports (children without reports today)
  const childrenWithReports = todayReports.map(r => r.childId)
  const pendingReports = children.filter(c => !childrenWithReports.includes(c.id)).length
  
  return {
    totalChildren: children.length,
    todayAttendance: {
      checkedIn: checkedInChildren,
      checkedOut: checkedOutChildren,
      notArrived,
      total: children.length
    },
    reports: {
      draft: draftReports,
      final: finalReports,
      pending: pendingReports
    },
    overtimeToday: todayAttendance
      .filter(a => children.map(c => c.id).includes(a.childId))
      .reduce((sum, a) => sum + (a.overtimeMinutes || 0), 0)
  }
}
