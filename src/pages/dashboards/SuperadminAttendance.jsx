import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

function SuperadminAttendance() {
  const { success, error } = useToast()
  const [attendance, setAttendance] = useState([])
  const [children, setChildren] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (data) {
      setAttendance(data.attendance || [])
      setChildren(data.children || [])
      setBranches(data.branches || [])
    }
    setLoading(false)
  }

  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId)
    return child?.name || 'Unknown'
  }

  const getBranchName = (childId) => {
    const child = children.find(c => c.id === childId)
    const branch = branches.find(b => b.id === child?.branchId)
    return branch?.name || 'Unknown'
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}j ${mins}m`
  }

  const filteredAttendance = attendance.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesBranch = selectedBranch === 'all' || getBranchName(record.childId) === branches.find(b => b.id === selectedBranch)?.name
    return matchesDate && matchesBranch
  })

  const stats = {
    checkedIn: filteredAttendance.filter(a => a.checkIn && !a.checkOut).length,
    checkedOut: filteredAttendance.filter(a => a.checkOut).length,
    notArrived: children.length - filteredAttendance.filter(a => a.checkIn).length,
    totalOvertime: filteredAttendance.reduce((acc, a) => acc + (a.overtimeMinutes || 0), 0)
  }

  if (loading) {
    return (
      <div className="superadmin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data absensi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="superadmin-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">⏰ Monitoring Absensi</h1>
          <p className="page-subtitle">
            Pantau kehadiran anak real-time di semua cabang
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Tanggal:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Cabang:</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">Semua Cabang</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <div className="stat-value">{stats.checkedIn}</div>
            <div className="stat-label">Sedang Aktif</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.checkedOut}</div>
            <div className="stat-label">Sudah Pulang</div>
          </div>
        </div>
        <div className="stat-card gray">
          <div className="stat-icon">⚪</div>
          <div className="stat-info">
            <div className="stat-value">{stats.notArrived}</div>
            <div className="stat-label">Belum Datang</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🕐</div>
          <div className="stat-info">
            <div className="stat-value">{formatDuration(stats.totalOvertime)}</div>
            <div className="stat-label">Total Overtime</div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">📋 Detail Kehadiran - {new Date(selectedDate).toLocaleDateString('id-ID')}</h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Anak</th>
                  <th>Cabang</th>
                  <th>Datang</th>
                  <th>Pulang</th>
                  <th>Durasi</th>
                  <th>Overtime</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr key={record.id}>
                      <td><strong>{getChildName(record.childId)}</strong></td>
                      <td>{getBranchName(record.childId)}</td>
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
                      <td>
                        {record.checkOut ? (
                          <span className="status-badge completed">Selesai</span>
                        ) : record.checkIn ? (
                          <span className="status-badge active">Aktif</span>
                        ) : (
                          <span className="status-badge pending">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <div className="empty-content">
                        <span className="empty-icon">📋</span>
                        <p>Belum ada data absensi untuk tanggal ini</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperadminAttendance
