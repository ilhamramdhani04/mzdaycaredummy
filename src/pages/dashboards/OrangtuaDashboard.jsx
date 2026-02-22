import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAttendance, useReports, useInvoices } from '../../hooks/useData.js'
import { getChildrenByParent, calculateAge } from '../../utils/dataHelpers.js'
import { formatDuration, formatOvertime } from '../../utils/attendance.js'
import { formatCurrency } from '../../utils/invoice.js'
import { WhatsAppButton } from '../../components/common'

/**
 * Orangtua Dashboard - Parent Panel
 * 
 * Design Philosophy: Warm, calm, and emotionally reassuring
 * Parents must feel: Informed, Secure, Calm, Respected
 */

function OrangtuaDashboard() {
  const { user } = useAuth()
  const { attendance } = useAttendance()
  const { reports } = useReports()
  const { invoices } = useInvoices()
  
  const [selectedChild, setSelectedChild] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Get parent's children
  const myChildren = useMemo(() => {
    return getChildrenByParent(user?.id)
  }, [user?.id])
  
  // Set first child as selected if none selected
  useMemo(() => {
    if (myChildren.length > 0 && !selectedChild) {
      setSelectedChild(myChildren[0])
    }
  }, [myChildren, selectedChild])
  
  // Get selected child data
  const selectedChildData = useMemo(() => {
    if (!selectedChild) return null
    
    // Get attendance history
    const childAttendance = attendance
      .filter(a => a.childId === selectedChild.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Get today's attendance
    const todayAttendance = childAttendance.find(a => a.date === selectedDate)
    
    // Get reports
    const childReports = reports
      .filter(r => r.childId === selectedChild.id && r.status === 'Final')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Get today's report
    const todayReport = childReports.find(r => r.date === selectedDate)
    
    // Get invoices
    const childInvoices = invoices
      .filter(inv => inv.childId === selectedChild.id)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
    
    return {
      ...selectedChild,
      age: calculateAge(selectedChild.dateOfBirth),
      attendance: childAttendance,
      todayAttendance,
      reports: childReports,
      todayReport,
      invoices: childInvoices
    }
  }, [selectedChild, attendance, reports, invoices, selectedDate])
  
  // Calculate today's stats
  const todayStats = useMemo(() => {
    if (!selectedChildData?.todayAttendance) return null
    
    const att = selectedChildData.todayAttendance
    return {
      checkIn: att.checkIn,
      checkOut: att.checkOut,
      duration: formatDuration(att.durationMinutes),
      overtime: att.overtimeMinutes > 0 ? formatOvertime(att.overtimeMinutes).display : null,
      isPresent: !!att.checkIn,
      isCheckedOut: !!att.checkOut
    }
  }, [selectedChildData])

  return (
    <div className="orangtua-dashboard animate-fade-in">
      <WhatsAppButton 
        phoneNumber="+6281234567890"
        defaultMessage={`Halo Mannazentrum, saya ingin bertanya tentang ${selectedChildData?.name || 'anak saya'}...`}
      />
      
      {/* Warm Welcome Header */}
      <div className="orangtua-header">
        <div className="orangtua-welcome">
          <h1 className="orangtua-greeting">
            {getGreeting()}, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p className="orangtua-subtitle">
            Semoga harimu menyenangkan. Berikut perkembangan si kecil hari ini.
          </p>
        </div>
        
        {/* Date Selector */}
        <div className="date-selector">
          <button 
            className="date-nav-btn"
            onClick={() => changeDate(selectedDate, -1, setSelectedDate)}
          >
            ‹
          </button>
          <div className="date-display">
            <span className="date-day">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
            <span className="date-full">{new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <button 
            className="date-nav-btn"
            onClick={() => changeDate(selectedDate, 1, setSelectedDate)}
          >
            ›
          </button>
        </div>
      </div>

      {/* Child Selector Pills */}
      {myChildren.length > 1 && (
        <div className="child-selector">
          {myChildren.map((child) => (
            <button
              key={child.id}
              className={`child-pill ${selectedChild?.id === child.id ? 'active' : ''}`}
              onClick={() => setSelectedChild(child)}
            >
              <span className="child-pill-avatar">👶</span>
              <span className="child-pill-name">{child.name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedChildData && (
        <div className="orangtua-content">
          {/* Child Profile Card - Warm Design */}
          <div className="child-profile-card card-hover">
            <div className="child-profile-header">
              <div className="child-avatar-large">
                <span className="child-avatar-icon">👶</span>
                <div className="child-avatar-ring"></div>
              </div>
              <div className="child-profile-info">
                <h2 className="child-name">{selectedChildData.name}</h2>
                <p className="child-details">
                  {selectedChildData.nickname} • {selectedChildData.age.display}
                </p>
                <div className="child-badges">
                  <span className="child-badge package">
                    📦 {selectedChildData.package?.name || 'Standard'}
                  </span>
                  {selectedChildData.allergies?.length > 0 && (
                    <span className="child-badge allergy">
                      ⚠️ Alergi: {selectedChildData.allergies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Status Overview */}
          {todayStats?.isPresent ? (
            <div className="today-status-card status-present">
              <div className="status-icon">✨</div>
              <div className="status-content">
                <h3 className="status-title">{selectedChildData.name} hadir hari ini</h3>
                <p className="status-message">
                  Anak Anda telah {todayStats.isCheckedOut ? 'menyelesaikan' : 'memulai'} 
                  aktivitas daycare hari ini dengan semangat.
                </p>
                <div className="status-meta">
                  <span className="status-time">
                    ⏰ {todayStats.checkIn} - {todayStats.checkOut || 'Sedang berlangsung'}
                  </span>
                  {todayStats.overtime && (
                    <span className="status-overtime">
                      🕐 Overtime: {todayStats.overtime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="today-status-card status-absent">
              <div className="status-icon">🏠</div>
              <div className="status-content">
                <h3 className="status-title">{selectedChildData.name} tidak hadir hari ini</h3>
                <p className="status-message">
                  Tidak ada data kehadiran untuk tanggal ini. 
                  Semoga si kecil sehat dan bahagia di rumah.
                </p>
              </div>
            </div>
          )}

          {/* Visual Timeline */}
          {todayStats?.isPresent && (
            <div className="timeline-section">
              <h3 className="section-title">📅 Timeline Hari Ini</h3>
              <div className="timeline">
                {/* Check-in */}
                <div className="timeline-item completed">
                  <div className="timeline-dot">🌅</div>
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">{todayStats.checkIn}</div>
                    <div className="timeline-title">Datang</div>
                    <div className="timeline-note">{selectedChildData.name} tiba dengan ceria</div>
                  </div>
                </div>
                
                {/* Activities */}
                <div className="timeline-item completed">
                  <div className="timeline-dot">🎨</div>
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">09:00 - 12:00</div>
                    <div className="timeline-title">Aktivitas & Belajar</div>
                    <div className="timeline-note">Bermain dan belajar bersama teman</div>
                  </div>
                </div>
                
                {/* Nap */}
                <div className={`timeline-item ${todayStats.checkOut ? 'completed' : 'active'}`}>
                  <div className="timeline-dot">😴</div>
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">12:00 - 14:00</div>
                    <div className="timeline-title">Istirahat Siang</div>
                    <div className="timeline-note">Tidur siang untuk mengisi energi</div>
                  </div>
                </div>
                
                {/* Check-out */}
                <div className={`timeline-item ${todayStats.checkOut ? 'completed' : 'pending'}`}>
                  <div className="timeline-dot">🏠</div>
                  <div className="timeline-content">
                    <div className="timeline-time">{todayStats.checkOut || '---'}</div>
                    <div className="timeline-title">Pulang</div>
                    <div className="timeline-note">
                      {todayStats.checkOut 
                        ? 'Sampai jumpa besok!' 
                        : 'Menunggu waktu pulang...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Today's Report Section */}
          <div className="report-section">
            <h3 className="section-title">📝 Laporan Hari Ini</h3>
            
            {selectedChildData.todayReport ? (
              <div className="report-card card-hover">
                <div className="report-header">
                  <div className="report-status-badge final">
                    <span className="status-dot"></span>
                    Laporan Final
                  </div>
                  <div className="report-timestamp">
                    Dibuat: {new Date(selectedChildData.todayReport.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    <br />
                    Dikunci: {new Date(selectedChildData.todayReport.lockedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div className="report-content">
                  {/* Mood */}
                  <div className="report-item mood">
                    <div className="report-item-icon">🌟</div>
                    <div className="report-item-content">
                      <span className="report-item-label">Mood Hari Ini</span>
                      <span className="report-item-value">{selectedChildData.todayReport.general?.mood || 'Happy'}</span>
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div className="report-item">
                    <div className="report-item-icon">🎯</div>
                    <div className="report-item-content">
                      <span className="report-item-label">Aktivitas</span>
                      <span className="report-item-value">{selectedChildData.todayReport.general?.activities || 'Bermain dan belajar'}</span>
                    </div>
                  </div>
                  
                  {/* Nap */}
                  {selectedChildData.todayReport.nap && (
                    <div className="report-item">
                      <div className="report-item-icon">😴</div>
                      <div className="report-item-content">
                        <span className="report-item-label">Tidur Siang</span>
                        <span className="report-item-value">
                          {selectedChildData.todayReport.nap.startTime} - {selectedChildData.todayReport.nap.endTime}
                          <span className="report-item-subtext">{selectedChildData.todayReport.nap.quality}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Teacher's Note - Highlighted */}
                  {selectedChildData.todayReport.general?.notes && (
                    <div className="teacher-note">
                      <div className="teacher-note-header">
                        <span>💬</span>
                        <span>Catatan Guru</span>
                      </div>
                      <p className="teacher-note-text">
                        {selectedChildData.todayReport.general.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="report-empty">
                <div className="report-empty-icon">📝</div>
                <p className="report-empty-title">Laporan belum tersedia</p>
                <p className="report-empty-message">
                  Laporan hari ini akan muncul setelah guru menyelesaikan dan 
                  supervisor mengunci laporan. Terima kasih atas kesabaran Anda.
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="quick-stats-grid">
            <div className="quick-stat-card card-hover">
              <div className="quick-stat-icon attendance">📊</div>
              <div className="quick-stat-content">
                <span className="quick-stat-value">{selectedChildData.attendance.length}</span>
                <span className="quick-stat-label">Hari Hadir Bulan Ini</span>
              </div>
            </div>
            
            <div className="quick-stat-card card-hover">
              <div className="quick-stat-icon reports">📝</div>
              <div className="quick-stat-content">
                <span className="quick-stat-value">{selectedChildData.reports.length}</span>
                <span className="quick-stat-label">Laporan Tersedia</span>
              </div>
            </div>
            
            <div className="quick-stat-card card-hover">
              <div className="quick-stat-icon invoices">📄</div>
              <div className="quick-stat-content">
                <span className="quick-stat-value">
                  {formatCurrency(selectedChildData.invoices
                    .filter(inv => inv.status === 'Draft')
                    .reduce((sum, inv) => sum + inv.totalAmount, 0))}
                </span>
                <span className="quick-stat-label">Tagihan Pending</span>
              </div>
            </div>
          </div>

          {/* Reassuring Footer Message */}
          <div className="reassuring-footer">
            <div className="reassuring-icon">💚</div>
            <p className="reassuring-text">
              "Terima kasih telah mempercayakan buah hati Anda kepada kami. 
              Kami berkomitmen memberikan yang terbaik untuk perkembangan si kecil."
            </p>
            <p className="reassuring-signature">— Tim Mannazentrum</p>
          </div>
        </div>
      )}

      {/* No Children State */}
      {myChildren.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-state-icon">👶</div>
          <h3 className="empty-state-title">Belum Ada Data Anak</h3>
          <p className="empty-state-message">
            Anda belum terdaftar sebagai wali untuk anak manapun.
            Silakan hubungi administrator untuk informasi lebih lanjut.
          </p>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'
  return 'Selamat malam'
}

function changeDate(currentDate, days, setter) {
  const date = new Date(currentDate)
  date.setDate(date.getDate() + days)
  setter(date.toISOString().split('T')[0])
}

export default OrangtuaDashboard
