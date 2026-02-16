import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import childrenData from '../data/children.json'
import { useAuth } from '../context/AuthContext.jsx'

function Dashboard() {
  const { user, permissions } = useAuth()
  const [children, setChildren] = useState([])
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Filter children based on role
    let filteredChildren = childrenData
    
    if (!permissions.canViewAllChildren) {
      // Orangtua can only see their own children
      filteredChildren = childrenData.filter(child => child.parentId === user.id)
    }
    
    setChildren(filteredChildren)
  }, [user, permissions, navigate])
  
  const handleViewReport = (childId) => {
    navigate(`/report/${childId}`)
  }
  
  if (!user) {
    return <div className="empty-state">Loading...</div>
  }
  
  // Determine dashboard variant based on role
  const isSuperadmin = user.role === 'superadmin'
  const isGuru = user.role === 'guru'
  const isOrangtua = user.role === 'orang tua' || user.role === 'orangtua'
  
  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="report-meta">Welcome back, {user.displayName}!</p>
        
        {/* Role Badge */}
        <div style={{ marginTop: '12px' }}>
          {isSuperadmin && (
            <span style={{
              background: '#D62828',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              👑 Superadmin
            </span>
          )}
          {isGuru && (
            <span style={{
              background: '#F4B400',
              color: '#2B1D0E',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              👩‍🏫 Guru
            </span>
          )}
          {isOrangtua && (
            <span style={{
              background: '#6B5E4A',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              👨‍👩‍👧 Orang Tua
            </span>
          )}
        </div>
      </div>
      
      {/* Superadmin: User Management & Finance Section */}
      {isSuperadmin && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 className="card-title">🔧 Administration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{
              background: '#F3EBD8',
              padding: '20px',
              borderRadius: '16px',
              cursor: 'pointer'
            }}>
              <h3 style={{ marginBottom: '8px' }}>👥 Manajemen User</h3>
              <p style={{ fontSize: '14px', color: '#6B5E4A' }}>
                Manage users, roles, and permissions
              </p>
            </div>
            <div style={{
              background: '#F3EBD8',
              padding: '20px',
              borderRadius: '16px',
              cursor: 'pointer'
            }}>
              <h3 style={{ marginBottom: '8px' }}>💰 Finance</h3>
              <p style={{ fontSize: '14px', color: '#6B5E4A' }}>
                View financial reports and transactions
              </p>
            </div>
            <div style={{
              background: '#F3EBD8',
              padding: '20px',
              borderRadius: '16px',
              cursor: 'pointer'
            }}>
              <h3 style={{ marginBottom: '8px' }}>📊 Reports</h3>
              <p style={{ fontSize: '14px', color: '#6B5E4A' }}>
                View all children's daily reports
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Guru: Quick Actions */}
      {isGuru && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 className="card-title">⚡ Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              📝 Create New Report
            </button>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              👀 View All Reports
            </button>
          </div>
        </div>
      )}
      
      {/* Children Section */}
      <div className="card">
        <h2 className="card-title">
          {isOrangtua ? '👶 My Children' : '👶 Children'}
        </h2>
        
        {children.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👶</div>
            <p className="empty-state-text">
              {isOrangtua 
                ? 'No children found for your account.' 
                : 'No children available.'}
            </p>
          </div>
        ) : (
          <div className="children-grid">
            {children.map(child => (
              <div 
                key={child.id} 
                className="child-card" 
                onClick={() => handleViewReport(child.id)}
              >
                <h2 className="child-name">{child.name}</h2>
                <span className="child-age-group">{child.ageGroup}</span>
                
                {/* Report Status Badge */}
                <div style={{ marginTop: '12px' }}>
                  <span style={{
                    background: '#F6D57A',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#2B1D0E'
                  }}>
                    📄 View Report
                  </span>
                </div>
                
                {/* Edit indicator for guru */}
                {isGuru && (
                  <p style={{
                    fontSize: '12px',
                    color: '#6B5E4A',
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    ✏️ Click to edit report
                  </p>
                )}
                
                {/* Read-only indicator for orang tua */}
                {isOrangtua && (
                  <p style={{
                    fontSize: '12px',
                    color: '#6B5E4A',
                    marginTop: '8px',
                    fontStyle: 'italic'
                  }}>
                    👁️ Read-only view
                  </p>
                )}
                
                <div className="child-actions" style={{ marginTop: '16px' }}>
                  <button 
                    className="btn-view-report" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewReport(child.id)
                    }}
                  >
                    {isGuru ? '📝 Edit Report' : '👁️ View Report'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Orangtua: Last Report Summary */}
      {isOrangtua && children.length > 0 && (
        <div className="card" style={{ marginTop: '32px' }}>
          <h2 className="card-title">📋 Recent Activity</h2>
          <p style={{ color: '#6B5E4A' }}>
            Your children's daily reports are updated by teachers each day.
            Click on a child's card above to view their report.
          </p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
