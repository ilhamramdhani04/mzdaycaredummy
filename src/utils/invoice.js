import dummyData from '../data/dummyData.json'
import { getAttendanceStats } from './attendance.js'

// ============================================
// CENTRALIZED INVOICE CALCULATION ENGINE
// ============================================

/**
 * Calculate monthly invoice for a child
 * @param {string} childId - Child ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Object} Invoice calculation
 */
export const calculateMonthlyInvoice = (childId, month, year) => {
  const child = dummyData.children.find(c => c.id === childId)
  if (!child) return null
  
  const pkg = dummyData.packages.find(p => p.id === child.packageId)
  if (!pkg) return null
  
  // Get start and end of month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]
  
  // Get attendance stats
  const stats = getAttendanceStats(childId, startDate, endDate)
  
  // Calculate overtime details
  const attendanceRecords = dummyData.attendance.filter(a => 
    a.childId === childId && 
    a.date >= startDate && 
    a.date <= endDate &&
    a.overtimeMinutes > 0
  )
  
  const overtimeDetails = attendanceRecords.map(a => ({
    date: a.date,
    minutes: a.overtimeMinutes,
    amount: a.overtimeAmount
  }))
  
  const baseAmount = pkg.monthlyPrice
  const overtimeAmount = stats.totalOvertimeAmount
  const totalAmount = baseAmount + overtimeAmount
  
  return {
    childId,
    parentId: child.parentId,
    month,
    year,
    baseAmount,
    overtimeAmount,
    totalAmount,
    overtimeDetails,
    packageName: pkg.name,
    attendanceDays: stats.totalDays,
    totalOvertimeMinutes: stats.totalOvertimeMinutes
  }
}

/**
 * Get all invoices for a parent
 * @param {string} parentId - Parent ID
 * @returns {Array} Invoices
 */
export const getParentInvoices = (parentId) => {
  return dummyData.invoices
    .filter(inv => inv.parentId === parentId)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })
}

/**
 * Get invoice by ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Object|null}
 */
export const getInvoiceById = (invoiceId) => {
  return dummyData.invoices.find(inv => inv.id === invoiceId) || null
}

/**
 * Get all invoices (for owner/superadmin)
 * @param {Object} filters - Optional filters
 * @returns {Array} Invoices
 */
export const getAllInvoices = (filters = {}) => {
  let invoices = [...dummyData.invoices]
  
  if (filters.status) {
    invoices = invoices.filter(inv => inv.status === filters.status)
  }
  
  if (filters.month) {
    invoices = invoices.filter(inv => inv.month === filters.month)
  }
  
  if (filters.year) {
    invoices = invoices.filter(inv => inv.year === filters.year)
  }
  
  if (filters.branchId) {
    const childIds = dummyData.children
      .filter(c => c.branchId === filters.branchId)
      .map(c => c.id)
    invoices = invoices.filter(inv => childIds.includes(inv.childId))
  }
  
  return invoices.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    if (a.month !== b.month) return b.month - a.month
    return 0
  })
}

/**
 * Get financial summary for dashboard
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @param {string} branchId - Optional branch filter
 * @returns {Object} Financial summary
 */
export const getFinancialSummary = (month, year, branchId = null) => {
  const invoices = getAllInvoices({ month, year, branchId })
  
  const totalBaseAmount = invoices.reduce((sum, inv) => sum + inv.baseAmount, 0)
  const totalOvertimeAmount = invoices.reduce((sum, inv) => sum + inv.overtimeAmount, 0)
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  
  const draftInvoices = invoices.filter(inv => inv.status === 'Draft')
  const approvedInvoices = invoices.filter(inv => inv.status === 'Approved')
  const paidInvoices = invoices.filter(inv => inv.paidAt !== null)
  
  return {
    totalInvoices: invoices.length,
    totalBaseAmount,
    totalOvertimeAmount,
    totalRevenue,
    draftCount: draftInvoices.length,
    approvedCount: approvedInvoices.length,
    paidCount: paidInvoices.length,
    draftAmount: draftInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    approvedAmount: approvedInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paidAmount: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  }
}

/**
 * Format currency to Rupiah
 * @param {number} amount - Amount
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format currency shorthand (for KPI cards)
 * @param {number} amount - Amount
 * @returns {string} Formatted shorthand
 */
export const formatCurrencyShorthand = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  
  if (amount >= 1000000000) {
    return 'Rp ' + (amount / 1000000000).toFixed(1) + 'M'
  }
  if (amount >= 1000000) {
    return 'Rp ' + (amount / 1000000).toFixed(1) + 'jt'
  }
  if (amount >= 1000) {
    return 'Rp ' + (amount / 1000).toFixed(1) + 'rb'
  }
  
  return formatCurrency(amount)
}

/**
 * Get invoice status badge color
 * @param {string} status - Invoice status
 * @returns {string} Color class
 */
export const getInvoiceStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'green'
    case 'Draft':
      return 'orange'
    case 'Paid':
      return 'blue'
    default:
      return 'gray'
  }
}
