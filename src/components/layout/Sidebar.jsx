import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getNavigationItems, ROLE_LABELS, ROLE_AVATARS } from '../../config/navigation.js'
import { useLocation, useNavigate } from 'react-router-dom'

function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout, isOwner, isSuperadmin, isGuru, isOrangtua } = useAuth()
  const { success } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [activeRole, setActiveRole] = useState(null)
  
  useEffect(() => {
    if (isOwner) setActiveRole('owner')
    else if (isSuperadmin) setActiveRole('superadmin')
    else if (isGuru) setActiveRole('guru')
    else if (isOrangtua) setActiveRole('orangtua')
  }, [isOwner, isSuperadmin, isGuru, isOrangtua])
  
  const navItems = getNavigationItems(activeRole) || []
  const currentPath = location.pathname
  
  const handleLogout = () => {
    logout()
    success('Anda telah berhasil logout')
    navigate('/login')
  }
  
  const handleNavClick = (path) => {
    navigate(path)
    if (onMobileClose) onMobileClose()
  }

  const roleLabel = ROLE_LABELS[activeRole] || 'User'
  const roleAvatar = ROLE_AVATARS[activeRole] || '👤'

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">🌙</span>
            <div className="sidebar-brand-text">
              <div className="sidebar-brand-name">Mannazentrum</div>
              <div className="sidebar-brand-tagline">Daycare Management</div>
            </div>
          </div>
        </div>

        <div className="sidebar-role-badge">
          <span className="sidebar-role-icon">{roleAvatar}</span>
          <span className="sidebar-role-label">{roleLabel}</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            <div className="sidebar-nav-title">Menu Utama</div>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`sidebar-nav-item ${currentPath.startsWith(item.path) ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
                {item.description && (
                  <span className="sidebar-nav-description">{item.description}</span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{roleAvatar}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.displayName}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" onClick={onMobileClose}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="sidebar-brand">
                <span className="sidebar-brand-icon">🌙</span>
                <div className="sidebar-brand-text">
                  <div className="sidebar-brand-name">Mannazentrum</div>
                </div>
              </div>
              <button className="mobile-drawer-close" onClick={onMobileClose}>×</button>
            </div>

            <div className="sidebar-role-badge mobile">
              <span className="sidebar-role-icon">{roleAvatar}</span>
              <span className="sidebar-role-label">{roleLabel}</span>
            </div>

            <nav className="sidebar-nav mobile">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`sidebar-nav-item ${currentPath.startsWith(item.path) ? 'active' : ''}`}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mobile-drawer-footer">
              <div className="sidebar-user mobile">
                <div className="sidebar-user-avatar">{roleAvatar}</div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{user?.displayName}</div>
                  <div className="sidebar-user-email">{user?.email}</div>
                </div>
              </div>
              <button className="sidebar-logout-btn mobile" onClick={handleLogout}>
                <span>🚪</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
