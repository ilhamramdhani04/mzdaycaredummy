import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAttendance, useReports } from '../../hooks/useData.js'
import { getSuperadminSummary, getAllChildren } from '../../utils/dataHelpers.js'
import { formatDuration, formatOvertime } from '../../utils/attendance.js'
import { formatCurrency } from '../../utils/invoice.js'

function SuperadminDashboard() {
  const { user } = useAuth()
  const { attendance, getTodayAttendance, checkIn, checkOut } = useAttendance()
  const { reports, getTodayReports, lockReport } = useReports()
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Get summary data
  const summary = useMemo(() => {
    return getSuperadminSummary(user?.branchId)
  }, [user?.branchId, attendance, reports])
  
  // Get today's attendance
  const todayAttendance = useMemo(() => {
    return getTodayAttendance(user?.branchId, selectedDate)
  }, [getTodayAttendance, user?.branchId, selectedDate])
  
  // Get today's reports
  const todayReports = useMemo(() => {
    return getTodayReports(user?.branchId)
  }, [getTodayReports, user?.branchId])
  
  // Get all children in branch
  const branchChildren = useMemo(() => {
    return getAllChildren({ branchId: user?.branchId, status: 'active' })
  }, [user?.branchId])
  
  // Combine children with attendance data
  const childrenWithAttendance = useMemo(() => {
    return branchChildren.map(child => {
      const att = todayAttendance.find(a => a.childId === child.id)
      const report = todayReports.all.find(r => r.childId === child.id)
      return {
        ...child,
        attendance: att,
        report
      }
    })
  }, [branchChildren, todayAttendance, todayReports])

  const handleLockReport = (reportId) => {
    if (confirm('Yakin ingin mengunci laporan ini? Status akan berubah menjadi Final dan tidak bisa diedit lagi.')) {
      lockReport(reportId, user.id)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="top-header-title">Superadmin Dashboard</h1>
          <p className="top-header-subtitle">Operational Control & Monitoring</p>
        </div>
        <div className="top-header-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-group input"
            style={{ padding: '8px 12px', border: '2px solid var(--color-bg-secondary)', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Anak Aktif</span>
            <div className="kpi-icon blue">👶</div>
          </div>
          <div className="kpi-value">{summary.totalChildren}</div>
          <div className="kpi-change neutral">Total terdaftar di cabang</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Hadir Hari Ini</span>
            <div className="kpi-icon green">✅</div>
          </div>
          <div className="kpi-value">
            {summary.todayAttendance.checkedIn + summary.todayAttendance.checkedOut}
          </div>
          <div className="kpi-change neutral">
            {summary.todayAttendance.notArrived} belum datang
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Laporan Draft</span>
            <div className="kpi-icon orange">📝</div>
          </div>
          <div className="kpi-value">{summary.reports.draft}</div>
          <div className="kpi-change neutral">
            {summary.reports.final} laporan Final
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Overtime Hari Ini</span>
            <div className="kpi-icon red">⏰</div>
          </div>
          <div className="kpi-value">{Math.round(summary.overtimeToday / 60)}j</div>
          <div className="kpi-change neutral">
            {Math.round(summary.overtimeToday)} menit
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Absensi Hari Ini</h2>
            <p className="card-subtitle">Status check-in/check-out anak - {selectedDate}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Anak</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Durasi</th>
                  <th>Overtime</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {childrenWithAttendance.map((child) => {
                  const att = child.attendance
                  const hasCheckedIn = att?.checkIn
                  const hasCheckedOut = att?.checkOut
                  
                  return (
                    <tr key={child.id}>
                      <td>
                        <strong>{child.name}</strong>
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {child.nickname} • {child.ageGroup}
                        </span>
                      </td>
                      <td>
                        {hasCheckedIn ? (
                          <span className="badge badge-green">{att.checkIn}</span>
                        ) : (
                          <span className="badge badge-gray">-</span>
                        )}
                      </td>
                      <td>
                        {hasCheckedOut ? (
                          <span className="badge badge-blue">{att.checkOut}</span>
                        ) : hasCheckedIn ? (
                          <span className="badge badge-orange">Belum</span>
                        ) : (
                          <span className="badge badge-gray">-</span>
                        )}
                      </td>
                      <td>
                        {att?.durationMinutes ? (
                          formatDuration(att.durationMinutes)
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {att?.overtimeMinutes > 0 ? (
                          <span className="badge badge-overtime">
                            {formatOvertime(att.overtimeMinutes).display}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {hasCheckedOut ? (
                          <span className="status-indicator">
                            <span className="status-dot green"></span>
                            Selesai
                          </span>
                        ) : hasCheckedIn ? (
                          <span className="status-indicator">
                            <span className="status-dot orange"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="status-indicator">
                            <span className="status-dot gray"></span>
                            Belum Datang
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Status Laporan</h2>
            <p className="card-subtitle">Laporan harian anak - {selectedDate}</p>
          </div>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Anak</th>
                  <th>Guru</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {childrenWithAttendance.map((child) => {
                  const report = child.report
                  
                  return (
                    <tr key={child.id}>
                      <td>
                        <strong>{child.name}</strong>
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {child.nickname}
                        </span>
                      </td>
                      <td>
                        {report ? (
                          <span>{report.createdBy}</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {report ? (
                          report.status === 'Final' ? (
                            <span className="badge badge-green">Final</span>
                          ) : (
                            <span className="badge badge-orange">Draft</span>
                          )
                        ) : (
                          <span className="badge badge-gray">Belum Dibuat</span>
                        )}
                      </td>
                      <td>
                        {report ? (
                          new Date(report.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {report && report.status === 'Draft' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleLockReport(report.id)}
                          >
                            🔒 Lock
                          </button>
                        )}
                        {report && report.status === 'Final' && (
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            🔒 Terkunci
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-warning)' }}>
              {summary.reports.pending}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Laporan Pending
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⏳</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-info)' }}>
              {summary.todayAttendance.checkedIn}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Sedang Aktif
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-success)' }}>
              {summary.todayAttendance.checkedOut}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Sudah Pulang
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperadminDashboard
