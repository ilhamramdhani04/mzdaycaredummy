import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAttendance, useReports } from '../../hooks/useData.js'
import { getAllChildren } from '../../utils/dataHelpers.js'
import { formatDuration, formatOvertime } from '../../utils/attendance.js'

/**
 * Guru Dashboard - Teacher Panel
 * 
 * Design Philosophy: Efficiency-focused, quick actions, clear status
 * Teachers need: Speed, clarity, minimal friction
 */

function GuruDashboard() {
  const { user } = useAuth()
  const { success, error } = useToast()
  const { attendance, getTodayAttendance, checkIn, checkOut } = useAttendance()
  const { reports, getTodayReports, saveReport } = useReports()
  
  const [selectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab] = useState('attendance')
  
  // Modal states
  const [checkInModal, setCheckInModal] = useState(null)
  const [checkOutModal, setCheckOutModal] = useState(null)
  const [reportModal, setReportModal] = useState(null)
  
  // Get children in guru's branch
  const branchChildren = useMemo(() => {
    return getAllChildren({ branchId: user?.branchId, status: 'active' })
  }, [user?.branchId])
  
  // Get today's attendance
  const todayAttendance = useMemo(() => {
    return getTodayAttendance(user?.branchId, selectedDate)
  }, [getTodayAttendance, user?.branchId, selectedDate, attendance])
  
  // Get today's reports
  const todayReports = useMemo(() => {
    return getTodayReports(user?.branchId)
  }, [getTodayReports, user?.branchId, reports])
  
  // Combine children data
  const childrenWithData = useMemo(() => {
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
  
  // Calculate quick stats
  const stats = useMemo(() => ({
    notCheckedIn: childrenWithData.filter(c => !c.attendance?.checkIn).length,
    active: childrenWithData.filter(c => c.attendance?.checkIn && !c.attendance?.checkOut).length,
    checkedOut: childrenWithData.filter(c => c.attendance?.checkOut).length,
    draftReports: todayReports.draft.length,
    finalReports: todayReports.final.length
  }), [childrenWithData, todayReports])
  
  // Check In Handler with toast
  const handleCheckIn = (childId) => {
    try {
      const now = new Date()
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      checkIn(childId, timeString, user.id, '')
      setCheckInModal(null)
      success('✅ Check-in berhasil dicatat')
    } catch (err) {
      error('❌ Gagal melakukan check-in')
    }
  }
  
  // Check Out Handler with toast
  const handleCheckOut = (childId) => {
    try {
      const now = new Date()
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      checkOut(childId, timeString, user.id)
      setCheckOutModal(null)
      success('🏠 Check-out berhasil dicatat')
    } catch (err) {
      error('❌ Gagal melakukan check-out')
    }
  }
  
  // Save Report Handler with toast
  const handleSaveReport = (childId, reportData) => {
    try {
      saveReport(childId, reportData, user.id)
      setReportModal(null)
      success('📝 Laporan berhasil disimpan')
    } catch (err) {
      error('❌ Gagal menyimpan laporan')
    }
  }

  return (
    <div className="guru-dashboard animate-fade-in">
      {/* Efficiency Header */}
      <div className="guru-header">
        <div className="guru-title-section">
          <h1 className="guru-title">Absensi & Laporan</h1>
          <p className="guru-subtitle">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {/* Quick Action Stats */}
        <div className="guru-quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-value">{stats.notCheckedIn}</span>
            <span className="quick-stat-label">Belum</span>
          </div>
          <div className="quick-stat active">
            <span className="quick-stat-value">{stats.active}</span>
            <span className="quick-stat-label">Aktif</span>
          </div>
          <div className="quick-stat completed">
            <span className="quick-stat-value">{stats.checkedOut}</span>
            <span className="quick-stat-label">Pulang</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Pills */}
      <div className="guru-tabs">
        <button
          className={`guru-tab ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <span className="tab-icon">⏰</span>
          <span className="tab-label">Absensi</span>
          {stats.notCheckedIn > 0 && (
            <span className="tab-badge">{stats.notCheckedIn}</span>
          )}
        </button>
        <button
          className={`guru-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-label">Laporan</span>
          {stats.draftReports > 0 && (
            <span className="tab-badge draft">{stats.draftReports}</span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="guru-content">
        {activeTab === 'attendance' ? (
          <AttendanceView 
            children={childrenWithData}
            onCheckIn={setCheckInModal}
            onCheckOut={setCheckOutModal}
          />
        ) : (
          <ReportsView 
            children={childrenWithData}
            onEditReport={setReportModal}
            draftCount={stats.draftReports}
            finalCount={stats.finalReports}
          />
        )}
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="mobile-sticky-actions">
        <button 
          className="sticky-action-btn primary"
          onClick={() => {
            const firstNotCheckedIn = childrenWithData.find(c => !c.attendance?.checkIn)
            if (firstNotCheckedIn) {
              setCheckInModal(firstNotCheckedIn)
            } else {
              success('✅ Semua anak sudah check-in!')
            }
          }}
        >
          <span>➕</span>
          <span>Check-in Cepat</span>
        </button>
      </div>

      {/* Modals */}
      {checkInModal && (
        <CheckInModal 
          child={checkInModal}
          onClose={() => setCheckInModal(null)}
          onConfirm={() => handleCheckIn(checkInModal.id)}
        />
      )}
      
      {checkOutModal && (
        <CheckOutModal 
          child={checkOutModal}
          onClose={() => setCheckOutModal(null)}
          onConfirm={() => handleCheckOut(checkOutModal.id)}
        />
      )}
      
      {reportModal && (
        <ReportModal 
          child={reportModal}
          existingReport={reportModal.report}
          onClose={() => setReportModal(null)}
          onSave={(data) => handleSaveReport(reportModal.id, data)}
        />
      )}
    </div>
  )
}

// Sub-components for cleaner organization

function AttendanceView({ children, onCheckIn, onCheckOut }) {
  return (
    <div className="attendance-view">
      <div className="attendance-grid">
        {children.map((child) => {
          const att = child.attendance
          const hasCheckedIn = att?.checkIn
          const hasCheckedOut = att?.checkOut
          
          return (
            <div key={child.id} className={`attendance-card ${hasCheckedOut ? 'completed' : hasCheckedIn ? 'active' : 'pending'}`}>
              <div className="attendance-card-header">
                <div className="child-info">
                  <span className="child-avatar">👶</span>
                  <div>
                    <div className="child-name">{child.name}</div>
                    <div className="child-meta">{child.nickname} • {child.ageGroup}</div>
                  </div>
                </div>
                <div className={`status-badge ${hasCheckedOut ? 'completed' : hasCheckedIn ? 'active' : 'pending'}`}>
                  {hasCheckedOut ? '✅ Pulang' : hasCheckedIn ? '🟢 Aktif' : '⏳ Belum'}
                </div>
              </div>
              
              {hasCheckedIn && (
                <div className="attendance-times">
                  <div className="time-row">
                    <span>Datang:</span>
                    <span className="time-value">{att.checkIn}</span>
                  </div>
                  {hasCheckedOut && (
                    <div className="time-row">
                      <span>Pulang:</span>
                      <span className="time-value">{att.checkOut}</span>
                    </div>
                  )}
                  {att.durationMinutes > 0 && (
                    <div className="time-row">
                      <span>Durasi:</span>
                      <span className="time-value">{formatDuration(att.durationMinutes)}</span>
                    </div>
                  )}
                  {att.overtimeMinutes > 0 && (
                    <div className="time-row overtime">
                      <span>Overtime:</span>
                      <span className="time-value">{formatOvertime(att.overtimeMinutes).display}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="attendance-actions">
                {!hasCheckedIn && (
                  <button className="action-btn check-in" onClick={() => onCheckIn(child)}>
                    ✅ Check In
                  </button>
                )}
                {hasCheckedIn && !hasCheckedOut && (
                  <button className="action-btn check-out" onClick={() => onCheckOut(child)}>
                    🏠 Check Out
                  </button>
                )}
                {hasCheckedOut && (
                  <span className="completed-text">✓ Selesai</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReportsView({ children, onEditReport, draftCount, finalCount }) {
  return (
    <div className="reports-view">
      <div className="reports-summary">
        <div className="summary-badge draft">
          <span className="count">{draftCount}</span>
          <span className="label">Draft</span>
        </div>
        <div className="summary-badge final">
          <span className="count">{finalCount}</span>
          <span className="label">Final</span>
        </div>
      </div>
      
      <div className="reports-grid">
        {children.map((child) => {
          const report = child.report
          const isLocked = report?.status === 'Final'
          
          return (
            <div key={child.id} className={`report-card ${isLocked ? 'locked' : report ? 'draft' : 'empty'}`}>
              <div className="report-card-header">
                <div className="child-info">
                  <span className="child-avatar">👶</span>
                  <div>
                    <div className="child-name">{child.name}</div>
                    <div className="child-meta">{child.nickname}</div>
                  </div>
                </div>
                <div className={`status-badge ${isLocked ? 'final' : report ? 'draft' : 'empty'}`}>
                  {isLocked ? '🔒 Final' : report ? '📝 Draft' : '⏳ Belum'}
                </div>
              </div>
              
              {report && (
                <div className="report-preview">
                  <div className="preview-item">
                    <span>Mood:</span>
                    <span>{report.general?.mood || '-'}</span>
                  </div>
                  <div className="preview-item">
                    <span>Update:</span>
                    <span>{new Date(report.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )}
              
              <div className="report-actions">
                {!isLocked && (
                  <button className="action-btn edit" onClick={() => onEditReport(child)}>
                    {report ? '✏️ Edit Laporan' : '📝 Buat Laporan'}
                  </button>
                )}
                {isLocked && (
                  <span className="locked-text">🔒 Terkunci supervisor</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CheckInModal({ child, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Check In - {child.name}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Konfirmasi check-in untuk:</p>
          <div className="child-preview">
            <span className="preview-avatar">👶</span>
            <div>
              <strong>{child.name}</strong>
              <p>{child.nickname} • {child.ageGroup}</p>
            </div>
          </div>
          <p className="time-display">
            Waktu: <strong>{new Date().toLocaleTimeString('id-ID')}</strong>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-success" onClick={onConfirm}>✅ Konfirmasi</button>
        </div>
      </div>
    </div>
  )
}

function CheckOutModal({ child, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Check Out - {child.name}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Konfirmasi check-out untuk:</p>
          <div className="child-preview">
            <span className="preview-avatar">👶</span>
            <div>
              <strong>{child.name}</strong>
              <p>{child.nickname} • {child.ageGroup}</p>
            </div>
          </div>
          {child.attendance && (
            <div className="attendance-summary">
              <p>Datang: <strong>{child.attendance.checkIn}</strong></p>
              <p>Durasi: <strong>{formatDuration(child.attendance.durationMinutes)}</strong></p>
            </div>
          )}
          <p className="time-display">
            Waktu pulang: <strong>{new Date().toLocaleTimeString('id-ID')}</strong>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button className="btn btn-primary" onClick={onConfirm}>🏠 Konfirmasi</button>
        </div>
      </div>
    </div>
  )
}

export default GuruDashboard
