import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

function OwnerBranches() {
  const { success, error } = useToast()
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (data) {
      setBranches(data.branches || [])
    }
    setLoading(false)
  }

  const getBranchStats = (branchId) => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (!data) return { children: 0, staff: 0, capacity: 0 }
    
    const children = data.children.filter(c => c.branchId === branchId).length
    const staff = data.users.filter(u => u.branchId === branchId).length
    const branch = data.branches.find(b => b.id === branchId)
    
    return {
      children,
      staff,
      capacity: branch?.capacity || 0
    }
  }

  if (loading) {
    return (
      <div className="owner-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data cabang...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="owner-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">🏢 Kelola Cabang</h1>
          <p className="page-subtitle">
            Pantau dan kelola semua cabang daycare
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => error('Fitur tambah cabang coming soon')}>
          ➕ Tambah Cabang
        </button>
      </div>

      <div className="branches-grid">
        {branches.map((branch) => {
          const stats = getBranchStats(branch.id)
          const occupancyRate = Math.round((stats.children / stats.capacity) * 100) || 0
          
          return (
            <div 
              key={branch.id} 
              className={`branch-card ${selectedBranch?.id === branch.id ? 'selected' : ''}`}
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="branch-header">
                <div className="branch-icon">🏢</div>
                <div className="branch-status">
                  <span className={`status-badge ${branch.status.toLowerCase()}`}>
                    {branch.status}
                  </span>
                </div>
              </div>
              
              <h3 className="branch-name">{branch.name}</h3>
              <p className="branch-address">{branch.address}</p>
              
              <div className="branch-stats">
                <div className="stat">
                  <span className="stat-value">{stats.children}</span>
                  <span className="stat-label">Anak</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{stats.staff}</span>
                  <span className="stat-label">Staff</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{stats.capacity}</span>
                  <span className="stat-label">Kapasitas</span>
                </div>
              </div>
              
              <div className="occupancy-bar">
                <div className="occupancy-label">
                  <span>Tingkat Hunian</span>
                  <span>{occupancyRate}%</span>
                </div>
                <div className="occupancy-progress">
                  <div 
                    className={`occupancy-fill ${occupancyRate > 90 ? 'high' : occupancyRate > 70 ? 'medium' : 'low'}`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
              
              <div className="branch-contact">
                <p>📞 {branch.phone}</p>
                <p>✉️ {branch.email}</p>
              </div>
            </div>
          )
        })}
      </div>

      {selectedBranch && (
        <div className="branch-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedBranch.name}</h2>
              <button className="close-btn" onClick={() => setSelectedBranch(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Alamat:</strong> {selectedBranch.address}</p>
              <p><strong>Telepon:</strong> {selectedBranch.phone}</p>
              <p><strong>Email:</strong> {selectedBranch.email}</p>
              <p><strong>Status:</strong> {selectedBranch.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerBranches
