import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMobileNavigationItems } from '../../config/navigation.js'
import { useLocation, useNavigate } from 'react-router-dom'

function BottomNavigation() {
  const { isOwner, isSuperadmin, isGuru, isOrangtua, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState(null)
  
  useEffect(() => {
    if (isOwner) setActiveRole('owner')
    else if (isSuperadmin) setActiveRole('superadmin')
    else if (isGuru) setActiveRole('guru')
    else if (isOrangtua) setActiveRole('orangtua')
  }, [isOwner, isSuperadmin, isGuru, isOrangtua])
  
  const navItems = getMobileNavigationItems(activeRole) || []
  const currentPath = location.pathname
  
  // Find active index for indicator position
  const activeIndex = navItems.findIndex(item => item.path === currentPath)
  const indicatorPosition = activeIndex >= 0 ? activeIndex : 0

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <nav 
      className="bottom-nav" 
      style={{ '--nav-item-count': navItems.length + 1 }}
    >
      {/* Active indicator line */}
      <div 
        className="bottom-nav-indicator" 
        style={{ transform: `translateX(${indicatorPosition * (100 / (navItems.length + 1))}%)` }}
      />
      
      {navItems.map((item) => {
        const isActive = currentPath === item.path
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        )
      })}

      <button
        onClick={handleLogout}
        className="bottom-nav-item logout-item"
        aria-label="Keluar"
      >
        <span className="bottom-nav-icon">🚪</span>
        <span className="bottom-nav-label">Keluar</span>
      </button>
    </nav>
  )
}

export default BottomNavigation
