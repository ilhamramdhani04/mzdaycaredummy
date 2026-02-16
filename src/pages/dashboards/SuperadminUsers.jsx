import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

function SuperadminUsers() {
  const { success, error } = useToast()
  const [users, setUsers] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (data) {
      setUsers(data.users || [])
      setBranches(data.branches || [])
    }
    setLoading(false)
  }

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId)
    return branch?.name || '-'
  }

  const getRoleBadge = (role) => {
    const colors = {
      'owner': 'purple',
      'superadmin': 'blue',
      'guru': 'green',
      'orangtua': 'orange'
    }
    return <span className={`badge badge-${colors[role] || 'gray'}`}>{role}</span>
  }

  const filteredUsers = users.filter(user => {
    const matchesBranch = selectedBranch === 'all' || user.branchId === selectedBranch
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesBranch && matchesRole
  })

  const handleSave = () => {
    success('Perubahan disimpan! (Demo mode)')
    setIsEditing(false)
    setSelectedUser(null)
  }

  const handleDelete = () => {
    error('Hapus user tidak diizinkan dalam demo mode')
    setSelectedUser(null)
  }

  const stats = {
    total: users.length,
    owner: users.filter(u => u.role === 'owner').length,
    superadmin: users.filter(u => u.role === 'superadmin').length,
    guru: users.filter(u => u.role === 'guru').length,
    orangtua: users.filter(u => u.role === 'orangtua').length
  }

  if (loading) {
    return (
      <div className="superadmin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="superadmin-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">👥 Manajemen Pengguna</h1>
          <p className="page-subtitle">
            Kelola guru, orang tua, dan staff daycare
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => error('Tambah user coming soon')}>
          ➕ Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Pengguna</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <div className="stat-value">{stats.owner}</div>
            <div className="stat-label">Owner</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">👩‍🏫</div>
          <div className="stat-info">
            <div className="stat-value">{stats.guru}</div>
            <div className="stat-label">Guru</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">👨‍👩‍👧</div>
          <div className="stat-info">
            <div className="stat-value">{stats.orangtua}</div>
            <div className="stat-label">Orang Tua</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Role:</label>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Semua Role</option>
            <option value="guru">Guru</option>
            <option value="orangtua">Orang Tua</option>
            <option value="superadmin">Super Admin</option>
          </select>
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

      {/* Users Table */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">Daftar Pengguna</h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Cabang</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.displayName}</strong></td>
                    <td><code>{user.username}</code></td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getBranchName(user.branchId)}</td>
                    <td>{user.email}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => { setSelectedUser(user); setIsEditing(true) }}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedUser && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Pengguna</h3>
              <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama</label>
                <input type="text" defaultValue={selectedUser.displayName} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select defaultValue={selectedUser.role}>
                  <option value="guru">Guru</option>
                  <option value="orangtua">Orang Tua</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Hapus
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Batal
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                💾 Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperadminUsers
