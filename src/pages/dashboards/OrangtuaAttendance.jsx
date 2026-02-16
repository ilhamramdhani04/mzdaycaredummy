import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

function OrangtuaAttendance() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = () => {
    const parentId = user?.id
    if (!parentId) return

    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (!data) return

    const parentChildren = data.children.filter(c => c.parentId === parentId)
    setChildren(parentChildren)
    
    if (parentChildren.length > 0) {
      setSelectedChild(parentChildren[0])
    }

    const attendance = data.attendance || []
    setAttendanceData(attendance)
    setLoading(false)
  }

  const getChildAttendance = (childId) => {
    return attendanceData
      .filter(a => a.childId === childId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}j ${mins}m`
  }

  const getStatusBadge = (record) => {
    if (record.checkOut) {
      return <span className="badge badge-green">✅ Pulang</span>
    } else if (record.checkIn) {
      return <span className="badge badge-orange">🟢 Aktif</span>
    }
    return <span className="badge badge-gray">-</span>
  }

  if (loading) {
    return (
      <div className="orangtua-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data kehadiran...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orangtua-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📋 Riwayat Kehadiran</h1>
          <p className="page-subtitle">
            Pantau kapan anak datang dan pulang setiap hari
          </p>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="child-selector-section">
          <div className="selector-label">Pilih Anak:</div>
          <div className="child-pills">
            {children.map((child) => (
              <button
                key={child.id}
                className={`child-pill ${selectedChild?.id === child.id ? 'active' : ''}`}
                onClick={() => setSelectedChild(child)}
              >
                <span className="pill-avatar">👶</span>
                <span className="pill-name">{child.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChild && (
        <div className="attendance-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            {(() => {
              const childAtt = getChildAttendance(selectedChild.id)
              const thisMonth = childAtt.filter(a => {
                const date = new Date(a.date)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              })
              
              return (
                <>
                  <div className="stat-card blue">
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                      <div className="stat-value">{thisMonth.length}</div>
                      <div className="stat-label">Hari Aktif Bulan Ini</div>
                    </div>
                  </div>
                  
                  <div className="stat-card green">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <div className="stat-value">
                        {formatDuration(thisMonth.reduce((acc, a) => acc + (a.durationMinutes || 0), 0))}
                      </div>
                      <div className="stat-label">Total Durasi</div>
                    </div>
                  </div>
                  
                  <div className="stat-card orange">
                    <div className="stat-icon">🕐</div>
                    <div className="stat-info">
                      <div className="stat-value">
                        {thisMonth.filter(a => a.overtimeMinutes > 0).length}
                      </div>
                      <div className="stat-label">Hari Overtime</div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Attendance Table */}
          <div className="attendance-card">
            <div className="card-header">
              <h2 className="card-title">📊 Detail Kehadiran - {selectedChild.name}</h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Datang</th>
                      <th>Pulang</th>
                      <th>Durasi</th>
                      <th>Overtime</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getChildAttendance(selectedChild.id).length > 0 ? (
                      getChildAttendance(selectedChild.id).map((record) => (
                        <tr key={record.id}>
                          <td>
                            {new Date(record.date).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </td>
                          <td>
                            {record.checkIn ? (
                              <span className="time-badge in">{record.checkIn}</span>
                            ) : '-'}
                          </td>
                          <td>
                            {record.checkOut ? (
                              <span className="time-badge out">{record.checkOut}</span>
                            ) : (
                              <span className="pending-badge">Belum</span>
                            )}
                          </td>
                          <td>{formatDuration(record.durationMinutes || 0)}</td>
                          <td>
                            {record.overtimeMinutes > 0 ? (
                              <span className="overtime-badge">
                                {formatDuration(record.overtimeMinutes)}
                              </span>
                            ) : '-'}
                          </td>
                          <td>{getStatusBadge(record)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          <div className="empty-content">
                            <span className="empty-icon">📋</span>
                            <p>Belum ada data kehadiran</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reassuring Footer */}
          <div className="reassuring-footer">
            <p>
              💙 Setiap hari yang dihabiskan anak di daycare adalah investasi berharga 
              untuk perkembangannya. Kami mencatat setiap detail dengan penuh perhatian.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrangtuaAttendance
