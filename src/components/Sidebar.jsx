import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, permissions, logout } = useAuth()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const isActive = (path) => location.pathname === path
  
  // Determine role
  const isSuperadmin = user?.role === 'superadmin'
  const isGuru = user?.role === 'guru'
  const isOrangtua = user?.role === 'orang tua' || user?.role === 'orangtua'
  
  return (
    <aside className="sidebar">
      <div>
        <h2 className="sidebar-title">MZdaycare</h2>
        <p className="sidebar-subtitle">Admin Dashboard</p>
        
        {/* Role indicator in sidebar */}
        <div style={{ marginTop: '12px' }}>
          {isSuperadmin && (
            <span style={{
              background: '#D62828',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Superadmin
            </span>
          )}
          {isGuru && (
            <span style={{
              background: '#F4B400',
              color: '#2B1D0E',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Guru
            </span>
          )}
          {isOrangtua && (
            <span style={{
              background: '#6B5E4A',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Orang Tua
            </span>
          )}
        </div>
      </div>
      
      <ul className="sidebar-nav">
        <li 
          className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </li>
        
        {/* Superadmin: Additional menu items */}
        {isSuperadmin && (
          <>
            <li 
              className={`sidebar-nav-item ${isActive('/users') ? 'active' : ''}`}
              onClick={() => navigate('/users')}
            >
              Manajemen User
            </li>
            <li 
              className={`sidebar-nav-item ${isActive('/finance') ? 'active' : ''}`}
              onClick={() => navigate('/finance')}
            >
              Finance
            </li>
          </>
        )}
        
        {/* Guru: Quick access */}
        {isGuru && (
          <li 
            className={`sidebar-nav-item ${isActive('/reports') ? 'active' : ''}`}
            onClick={() => navigate('/reports')}
          >
            All Reports
          </li>
        )}
      </ul>
      
      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
