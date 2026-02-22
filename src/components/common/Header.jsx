import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Header({ showAnnouncement = true }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [announcements, setAnnouncements] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = () => {
    const stored = localStorage.getItem('dummyData')
    if (stored) {
      const data = JSON.parse(stored)
      const activeAnnouncements = data.announcements?.filter(a => a.isActive) || []
      setAnnouncements(activeAnnouncements.slice(0, 3))
      setUnreadCount(activeAnnouncements.length)
    }
  }

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/dashboard/dashboard': 'Dashboard',
      '/dashboard/attendance': 'Absensi',
      '/dashboard/reports': 'Laporan',
      '/dashboard/invoices': 'Tagihan',
      '/dashboard/finance': 'Keuangan',
      '/dashboard/branches': 'Cabang',
      '/dashboard/users': 'Pengguna',
      '/dashboard/menus': 'Menu Makanan',
      '/dashboard/bathing': 'Jadwal Mandi',
      '/dashboard/stimulasi': 'Stimulasi',
      '/dashboard/medication': 'Obat & Susu',
      '/dashboard/inventory': 'Inventaris',
      '/dashboard/media': 'Media',
      '/dashboard/overtime': 'Lembur',
      '/dashboard/teacher-config': 'Konfigurasi Guru',
    }
    return titles[location.pathname] || 'Mannazentrum'
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-section">
          <div className="logo-icon">🏫</div>
          <div className="logo-text">
            <span className="app-name">Mannazentrum</span>
            <span className="page-title">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Cari..." 
            className="search-input"
          />
        </div>

        <div className="notification-wrapper">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="bell-icon">🔔</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Pengumuman</h4>
                <span className="mark-read">Tandai semua dibaca</span>
              </div>
              <div className="notification-list">
                {announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <div key={ann.id} className="notification-item">
                      <div className={`priority-dot ${ann.priority}`}></div>
                      <div className="notification-content">
                        <p className="notification-title">{ann.title}</p>
                        <span className="notification-date">
                          {new Date(ann.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <p>Tidak ada pengumuman</p>
                  </div>
                )}
              </div>
              <Link to="/dashboard/announcements" className="view-all-btn">
                Lihat Semua
              </Link>
            </div>
          )}
        </div>

        <div className="profile-section">
          <div className="profile-avatar">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.displayName || 'User'}</span>
            <span className="profile-role">{user?.role || 'Guest'}</span>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            🚪
          </button>
        </div>
      </div>

      <style>{`
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 28px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .app-name {
          font-size: 16px;
          font-weight: 700;
          color: #C17817;
        }

        .page-title {
          font-size: 12px;
          color: #718096;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 24px;
          padding: 8px 16px;
          gap: 8px;
        }

        .search-icon {
          font-size: 14px;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          width: 120px;
        }

        .notification-wrapper {
          position: relative;
        }

        .notification-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .notification-btn:hover {
          background: #F3F4F6;
        }

        .bell-icon {
          font-size: 20px;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #EF4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          overflow: hidden;
          z-index: 10001;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #E5E7EB;
        }

        .notification-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: #2D3748;
          margin: 0;
        }

        .mark-read {
          font-size: 12px;
          color: #F4B400;
          cursor: pointer;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
          transition: background 0.2s;
        }

        .notification-item:hover {
          background: #F9FAFB;
        }

        .priority-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .priority-dot.high {
          background: #EF4444;
        }

        .priority-dot.normal {
          background: #F4B400;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-size: 13px;
          font-weight: 500;
          color: #2D3748;
          margin: 0 0 4px;
        }

        .notification-date {
          font-size: 11px;
          color: #9CA3AF;
        }

        .no-notifications {
          padding: 32px;
          text-align: center;
          color: #9CA3AF;
          font-size: 14px;
        }

        .view-all-btn {
          display: block;
          padding: 14px;
          text-align: center;
          background: #FFFBEB;
          color: #C17817;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .view-all-btn:hover {
          background: #FEF3C7;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F4B400, #FF8C42);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: #2D3748;
        }

        .profile-role {
          font-size: 11px;
          color: #718096;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          background: #FEE2E2;
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 10px 12px;
            flex-wrap: wrap;
            gap: 8px;
          }

          .header-left, .header-right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header-right {
            justify-content: flex-end;
            gap: 4px;
          }

          .search-box {
            display: none !important;
          }

          .profile-section {
            gap: 4px;
          }

          .profile-info {
            display: none !important;
          }

          .logout-btn {
            display: flex !important;
            width: 36px;
            height: 36px;
          }
          }

          .profile-info {
            display: none !important;
          }

          .logo-text .app-name {
            font-size: 14px;
          }

          .logo-text .page-title {
            font-size: 10px;
          }

          .notification-dropdown {
            width: calc(100vw - 24px);
            right: -8px;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
