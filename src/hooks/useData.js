import { useState, useEffect, useCallback } from 'react'
import dummyData from '../data/dummyData.json'
import { calculateAttendanceRecord, calculateDuration } from '../utils/attendance.js'

// Storage keys
const STORAGE_KEYS = {
  ATTENDANCE: 'mz_attendance',
  REPORTS: 'mz_reports',
  INVOICES: 'mz_invoices',
  USERS: 'mz_users'
}

// Initialize localStorage with dummy data if not present
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(dummyData.attendance))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(dummyData.reports))
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(dummyData.invoices))
  }
}

// Initialize on import
initializeStorage()

/**
 * Hook for managing attendance data with localStorage persistence
 * @returns {Object} Attendance state and functions
 */
export const useAttendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  // Load attendance from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE)
    if (stored) {
      setAttendance(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  // Save to localStorage when attendance changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance))
    }
  }, [attendance, loading])

  /**
   * Get today's attendance for all children in a branch
   */
  const getTodayAttendance = useCallback((branchId = null, date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    let records = attendance.filter(a => a.date === targetDate)
    
    if (branchId) {
      const branchChildIds = dummyData.children
        .filter(c => c.branchId === branchId)
        .map(c => c.id)
      records = records.filter(a => branchChildIds.includes(a.childId))
    }
    
    return records.sort((a, b) => (a.checkIn || '').localeCompare(b.checkIn || ''))
  }, [attendance])

  /**
   * Get attendance for a specific child
   */
  const getChildAttendance = useCallback((childId, date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    return attendance.find(a => a.childId === childId && a.date === targetDate) || null
  }, [attendance])

  /**
   * Check in a child
   */
  const checkIn = useCallback((childId, checkInTime, checkedInBy, notes = '') => {
    const today = new Date().toISOString().split('T')[0]
    
    setAttendance(prev => {
      // Check if already checked in today
      const existingIndex = prev.findIndex(a => a.childId === childId && a.date === today)
      
      if (existingIndex >= 0) {
        // Update existing record
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          checkIn: checkInTime,
          checkedInBy,
          notes: notes || updated[existingIndex].notes
        }
        return updated
      }
      
      // Create new record
      const newRecord = {
        id: `att_${Date.now()}`,
        childId,
        date: today,
        checkIn: checkInTime,
        checkOut: null,
        durationMinutes: 0,
        overtimeMinutes: 0,
        overtimeAmount: 0,
        checkedInBy,
        checkedOutBy: null,
        notes
      }
      
      return [...prev, newRecord]
    })
    
    return true
  }, [])

  /**
   * Check out a child
   */
  const checkOut = useCallback((childId, checkOutTime, checkedOutBy) => {
    const today = new Date().toISOString().split('T')[0]
    
    setAttendance(prev => {
      const index = prev.findIndex(a => a.childId === childId && a.date === today)
      
      if (index < 0) return prev
      
      const record = prev[index]
      if (!record.checkIn) return prev
      
      // Get child's package for overtime calculation
      const child = dummyData.children.find(c => c.id === childId)
      const pkg = child ? dummyData.packages.find(p => p.id === child.packageId) : null
      
      const calculation = calculateAttendanceRecord(
        record.checkIn,
        checkOutTime,
        child?.packageId
      )
      
      const updated = [...prev]
      updated[index] = {
        ...record,
        checkOut: checkOutTime,
        checkedOutBy,
        durationMinutes: calculation.durationMinutes,
        overtimeMinutes: calculation.overtimeMinutes,
        overtimeAmount: calculation.overtimeAmount
      }
      
      return updated
    })
    
    return true
  }, [])

  /**
   * Get attendance statistics for a child
   */
  const getChildStats = useCallback((childId, startDate, endDate) => {
    const records = attendance.filter(a => 
      a.childId === childId && 
      a.date >= startDate && 
      a.date <= endDate
    )
    
    return {
      totalDays: records.length,
      totalMinutes: records.reduce((sum, r) => sum + (r.durationMinutes || 0), 0),
      totalOvertimeMinutes: records.reduce((sum, r) => sum + (r.overtimeMinutes || 0), 0),
      totalOvertimeAmount: records.reduce((sum, r) => sum + (r.overtimeAmount || 0), 0),
      overtimeDays: records.filter(r => r.overtimeMinutes > 0).length
    }
  }, [attendance])

  return {
    attendance,
    loading,
    getTodayAttendance,
    getChildAttendance,
    checkIn,
    checkOut,
    getChildStats
  }
}

/**
 * Hook for managing report data with localStorage persistence
 * @returns {Object} Report state and functions
 */
export const useReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS)
    if (stored) {
      setReports(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports))
    }
  }, [reports, loading])

  /**
   * Get report for a child on a specific date
   */
  const getReport = useCallback((childId, date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0]
    return reports.find(r => r.childId === childId && r.date === targetDate) || null
  }, [reports])

  /**
   * Get all reports with optional filters
   */
  const getReports = useCallback((filters = {}) => {
    let filtered = [...reports]
    
    if (filters.childId) {
      filtered = filtered.filter(r => r.childId === filters.childId)
    }
    
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }
    
    if (filters.date) {
      filtered = filtered.filter(r => r.date === filters.date)
    }
    
    if (filters.branchId) {
      const childIds = dummyData.children
        .filter(c => c.branchId === filters.branchId)
        .map(c => c.id)
      filtered = filtered.filter(r => childIds.includes(r.childId))
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [reports])

  /**
   * Create or update a report (only if status is Draft)
   */
  const saveReport = useCallback((childId, data, createdBy) => {
    const today = new Date().toISOString().split('T')[0]
    
    setReports(prev => {
      const existingIndex = prev.findIndex(r => r.childId === childId && r.date === today)
      
      if (existingIndex >= 0) {
        // Only update if status is Draft
        const existing = prev[existingIndex]
        if (existing.status === 'Final') {
          return prev // Cannot edit Final reports
        }
        
        const updated = [...prev]
        updated[existingIndex] = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString()
        }
        return updated
      }
      
      // Create new report
      const newReport = {
        id: `rep_${Date.now()}`,
        childId,
        date: today,
        createdBy,
        status: 'Draft',
        lockedBy: null,
        lockedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      }
      
      return [...prev, newReport]
    })
    
    return true
  }, [])

  /**
   * Lock a report (Superadmin only)
   */
  const lockReport = useCallback((reportId, lockedBy) => {
    setReports(prev => {
      const index = prev.findIndex(r => r.id === reportId)
      if (index < 0) return prev
      
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        status: 'Final',
        lockedBy,
        lockedAt: new Date().toISOString()
      }
      
      return updated
    })
    
    return true
  }, [])

  /**
   * Get reports for today's date
   */
  const getTodayReports = useCallback((branchId = null) => {
    const today = new Date().toISOString().split('T')[0]
    let filtered = reports.filter(r => r.date === today)
    
    if (branchId) {
      const childIds = dummyData.children
        .filter(c => c.branchId === branchId)
        .map(c => c.id)
      filtered = filtered.filter(r => childIds.includes(r.childId))
    }
    
    return {
      all: filtered,
      draft: filtered.filter(r => r.status === 'Draft'),
      final: filtered.filter(r => r.status === 'Final'),
      pending: dummyData.children.filter(c => {
        if (branchId && c.branchId !== branchId) return false
        return !filtered.some(r => r.childId === c.id)
      })
    }
  }, [reports])

  return {
    reports,
    loading,
    getReport,
    getReports,
    saveReport,
    lockReport,
    getTodayReports
  }
}

/**
 * Hook for managing invoice data with localStorage persistence
 * @returns {Object} Invoice state and functions
 */
export const useInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICES)
    if (stored) {
      setInvoices(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices))
    }
  }, [invoices, loading])

  /**
   * Get invoices with filters
   */
  const getInvoices = useCallback((filters = {}) => {
    let filtered = [...invoices]
    
    if (filters.parentId) {
      filtered = filtered.filter(inv => inv.parentId === filters.parentId)
    }
    
    if (filters.childId) {
      filtered = filtered.filter(inv => inv.childId === filters.childId)
    }
    
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status === filters.status)
    }
    
    if (filters.month) {
      filtered = filtered.filter(inv => inv.month === filters.month)
    }
    
    if (filters.year) {
      filtered = filtered.filter(inv => inv.year === filters.year)
    }
    
    return filtered.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      if (a.month !== b.month) return b.month - a.month
      return 0
    })
  }, [invoices])

  /**
   * Approve an invoice (Owner only)
   */
  const approveInvoice = useCallback((invoiceId, approvedBy) => {
    setInvoices(prev => {
      const index = prev.findIndex(inv => inv.id === invoiceId)
      if (index < 0) return prev
      
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        status: 'Approved',
        approvedBy,
        approvedAt: new Date().toISOString()
      }
      
      return updated
    })
    
    return true
  }, [])

  /**
   * Mark invoice as paid
   */
  const markAsPaid = useCallback((invoiceId) => {
    setInvoices(prev => {
      const index = prev.findIndex(inv => inv.id === invoiceId)
      if (index < 0) return prev
      
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        paidAt: new Date().toISOString()
      }
      
      return updated
    })
    
    return true
  }, [])

  /**
   * Get financial summary
   */
  const getFinancialSummary = useCallback((month, year, branchId = null) => {
    let filtered = invoices.filter(inv => inv.month === month && inv.year === year)
    
    if (branchId) {
      const childIds = dummyData.children
        .filter(c => c.branchId === branchId)
        .map(c => c.id)
      filtered = filtered.filter(inv => childIds.includes(inv.childId))
    }
    
    const totalBaseAmount = filtered.reduce((sum, inv) => sum + inv.baseAmount, 0)
    const totalOvertimeAmount = filtered.reduce((sum, inv) => sum + inv.overtimeAmount, 0)
    const totalRevenue = filtered.reduce((sum, inv) => sum + inv.totalAmount, 0)
    
    return {
      totalInvoices: filtered.length,
      totalBaseAmount,
      totalOvertimeAmount,
      totalRevenue,
      draftCount: filtered.filter(inv => inv.status === 'Draft').length,
      approvedCount: filtered.filter(inv => inv.status === 'Approved').length,
      paidCount: filtered.filter(inv => inv.paidAt !== null).length,
      draftAmount: filtered.filter(inv => inv.status === 'Draft').reduce((sum, inv) => sum + inv.totalAmount, 0),
      approvedAmount: filtered.filter(inv => inv.status === 'Approved').reduce((sum, inv) => sum + inv.totalAmount, 0),
      paidAmount: filtered.filter(inv => inv.paidAt !== null).reduce((sum, inv) => sum + inv.totalAmount, 0)
    }
  }, [invoices])

  return {
    invoices,
    loading,
    getInvoices,
    approveInvoice,
    markAsPaid,
    getFinancialSummary
  }
}
