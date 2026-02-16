import dummyData from '../data/dummyData.json'

// ============================================
// CENTRALIZED ATTENDANCE CALCULATION ENGINE
// ============================================

/**
 * Calculate duration in minutes between two time strings
 * @param {string} checkIn - Time in HH:MM format
 * @param {string} checkOut - Time in HH:MM format
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  
  const [inHours, inMinutes] = checkIn.split(':').map(Number)
  const [outHours, outMinutes] = checkOut.split(':').map(Number)
  
  const inTotal = inHours * 60 + inMinutes
  const outTotal = outHours * 60 + outMinutes
  
  return Math.max(0, outTotal - inTotal)
}

/**
 * Calculate overtime minutes and amount
 * @param {number} durationMinutes - Total duration
 * @param {number} maxMinutes - Maximum allowed minutes per package
 * @param {number} overtimeRatePerHour - Overtime rate per hour
 * @returns {Object} Overtime details
 */
export const calculateOvertime = (durationMinutes, maxMinutes, overtimeRatePerHour) => {
  if (durationMinutes <= maxMinutes) {
    return {
      overtimeMinutes: 0,
      overtimeAmount: 0,
      isOvertime: false
    }
  }
  
  const overtimeMinutes = durationMinutes - maxMinutes
  const overtimeHours = overtimeMinutes / 60
  const overtimeAmount = Math.ceil(overtimeHours * overtimeRatePerHour)
  
  return {
    overtimeMinutes,
    overtimeAmount,
    isOvertime: true
  }
}

/**
 * Calculate complete attendance record
 * @param {string} checkIn - Time in HH:MM format
 * @param {string} checkOut - Time in HH:MM format
 * @param {string} packageId - Package ID
 * @returns {Object} Complete attendance calculation
 */
export const calculateAttendanceRecord = (checkIn, checkOut, packageId) => {
  const pkg = dummyData.packages.find(p => p.id === packageId)
  if (!pkg) {
    return {
      durationMinutes: 0,
      overtimeMinutes: 0,
      overtimeAmount: 0,
      isOvertime: false,
      maxMinutesPerDay: 0
    }
  }
  
  const durationMinutes = calculateDuration(checkIn, checkOut)
  const overtimeResult = calculateOvertime(
    durationMinutes,
    pkg.maxMinutesPerDay,
    pkg.overtimeRatePerHour
  )
  
  return {
    durationMinutes,
    maxMinutesPerDay: pkg.maxMinutesPerDay,
    ...overtimeResult
  }
}

/**
 * Format minutes to hours and minutes
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted string (e.g., "8h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0h 0m'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Format overtime with visual indicator
 * @param {number} overtimeMinutes - Overtime in minutes
 * @returns {Object} Formatted overtime info
 */
export const formatOvertime = (overtimeMinutes) => {
  if (!overtimeMinutes || overtimeMinutes <= 0) {
    return {
      display: '-',
      isOvertime: false,
      badgeColor: 'green'
    }
  }
  
  const hours = Math.floor(overtimeMinutes / 60)
  const mins = overtimeMinutes % 60
  let display = ''
  
  if (hours > 0) {
    display = `${hours}j ${mins > 0 ? mins + 'm' : ''}`
  } else {
    display = `${mins}m`
  }
  
  return {
    display,
    isOvertime: true,
    badgeColor: overtimeMinutes > 60 ? 'red' : 'orange',
    hours,
    minutes: mins
  }
}

/**
 * Get today's attendance for a child
 * @param {string} childId - Child ID
 * @param {string} date - Date string (YYYY-MM-DD), defaults to today
 * @returns {Object|null} Attendance record
 */
export const getTodayAttendance = (childId, date = null) => {
  const targetDate = date || new Date().toISOString().split('T')[0]
  return dummyData.attendance.find(
    a => a.childId === childId && a.date === targetDate
  ) || null
}

/**
 * Get attendance history for a child
 * @param {string} childId - Child ID
 * @param {number} limit - Maximum records to return
 * @returns {Array} Attendance records
 */
export const getChildAttendanceHistory = (childId, limit = 30) => {
  return dummyData.attendance
    .filter(a => a.childId === childId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

/**
 * Get all attendance for a specific date
 * @param {string} date - Date string (YYYY-MM-DD), defaults to today
 * @param {string} branchId - Optional branch filter
 * @returns {Array} Attendance records
 */
export const getAttendanceByDate = (date = null, branchId = null) => {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  let attendance = dummyData.attendance.filter(a => a.date === targetDate)
  
  if (branchId) {
    const childIds = dummyData.children
      .filter(c => c.branchId === branchId)
      .map(c => c.id)
    attendance = attendance.filter(a => childIds.includes(a.childId))
  }
  
  return attendance.sort((a, b) => a.checkIn?.localeCompare(b.checkIn))
}

/**
 * Get attendance statistics for a child in a date range
 * @param {string} childId - Child ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Object} Statistics object
 */
export const getAttendanceStats = (childId, startDate, endDate) => {
  const records = dummyData.attendance.filter(a => {
    return a.childId === childId && 
           a.date >= startDate && 
           a.date <= endDate
  })
  
  const totalDays = records.length
  const totalMinutes = records.reduce((sum, r) => sum + (r.durationMinutes || 0), 0)
  const totalOvertimeMinutes = records.reduce((sum, r) => sum + (r.overtimeMinutes || 0), 0)
  const totalOvertimeAmount = records.reduce((sum, r) => sum + (r.overtimeAmount || 0), 0)
  const overtimeDays = records.filter(r => r.overtimeMinutes > 0).length
  
  return {
    totalDays,
    totalMinutes,
    totalOvertimeMinutes,
    totalOvertimeAmount,
    overtimeDays,
    averageDuration: totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0
  }
}
