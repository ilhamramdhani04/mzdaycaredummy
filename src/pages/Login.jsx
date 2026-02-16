import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Login.css'

// Demo credentials for easy access
const DEMO_CREDENTIALS = [
  { role: 'owner', username: 'owner', password: 'owner123', label: 'Owner (Strategic)' },
  { role: 'superadmin', username: 'superadmin', password: 'super123', label: 'Superadmin (Operational)' },
  { role: 'guru', username: 'guru1', password: 'guru123', label: 'Guru (Execution)' },
  { role: 'orangtua', username: 'bapak_ahmad', password: 'parent123', label: 'Orang Tua (Client)' }
]

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (roleData) => {
    setSelectedRole(roleData.role)
    setUsername(roleData.username)
    setPassword(roleData.password)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = login(username, password)
    
    if (result.success) {
      const role = result.user.role.toLowerCase().replace(' ', '')
      navigate(`/dashboard/${role}`)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🌙</span>
            <h1>Mannazentrum</h1>
          </div>
          <p className="login-subtitle">Daycare Management System</p>
          <p className="login-description">Sistem Manajemen Daycare Berbasis Nilai-Nilai Islami</p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="role-selector">
          <p className="role-label">Pilih Role untuk Demo:</p>
          <div className="role-buttons">
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.role}
                type="button"
                className={`role-btn ${selectedRole === cred.role ? 'active' : ''}`}
                onClick={() => handleRoleSelect(cred)}
              >
                <span className="role-icon">
                  {cred.role === 'owner' && '👑'}
                  {cred.role === 'superadmin' && '⚙️'}
                  {cred.role === 'guru' && '👩‍🏫'}
                  {cred.role === 'orangtua' && '👨‍👩‍👧'}
                </span>
                <span className="role-name">{cred.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-submit-btn"
            disabled={loading || !username || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials (click role buttons above)</p>
          <div className="credentials-grid">
            {DEMO_CREDENTIALS.map((cred) => (
              <div key={cred.role} className="credential-item">
                <code>{cred.username} / {cred.password}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
