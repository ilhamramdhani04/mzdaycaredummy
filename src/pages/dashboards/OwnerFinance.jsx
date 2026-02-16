import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

function OwnerFinance() {
  const { success } = useToast()
  const [invoices, setInvoices] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-02')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (data) {
      setInvoices(data.invoices || [])
      setBranches(data.branches || [])
    }
    setLoading(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getBranchRevenue = (branchId) => {
    return invoices
      .filter(inv => {
        if (branchId === 'all') return true
        const stored = localStorage.getItem('dummyData')
        const data = stored ? JSON.parse(stored) : null
        const child = data?.children.find(c => c.id === inv.childId)
        return child?.branchId === branchId
      })
      .filter(inv => inv.status === 'Paid' || inv.status === 'Approved')
      .reduce((acc, inv) => acc + inv.totalAmount, 0)
  }

  const getStatusBreakdown = () => {
    const breakdown = { Paid: 0, Approved: 0, Pending: 0, Draft: 0 }
    invoices.forEach(inv => {
      breakdown[inv.status] = (breakdown[inv.status] || 0) + inv.totalAmount
    })
    return breakdown
  }

  const breakdown = getStatusBreakdown()
  const totalRevenue = getBranchRevenue(selectedBranch)

  if (loading) {
    return (
      <div className="owner-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data keuangan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="owner-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">💰 Laporan Keuangan</h1>
          <p className="page-subtitle">
            Overview pendapatan dan status pembayaran
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Cabang:</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">Semua Cabang</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Periode:</label>
          <input 
            type="month" 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={() => success('Export laporan coming soon')}>
          📥 Export
        </button>
      </div>

      {/* Revenue Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(totalRevenue)}</div>
            <div className="stat-label">Total Pendapatan</div>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <div className="stat-value">{invoices.length}</div>
            <div className="stat-label">Jumlah Invoice</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(breakdown.Pending || 0)}</div>
            <div className="stat-label">Menunggu Approval</div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">📊 Breakdown Status Pembayaran</h2>
        </div>
        <div className="card-body">
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <div className="breakdown-label">
                <span className="dot paid"></span> Lunas
              </div>
              <div className="breakdown-value">{formatCurrency(breakdown.Paid || 0)}</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">
                <span className="dot approved"></span> Disetujui
              </div>
              <div className="breakdown-value">{formatCurrency(breakdown.Approved || 0)}</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">
                <span className="dot pending"></span> Pending
              </div>
              <div className="breakdown-value">{formatCurrency(breakdown.Pending || 0)}</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">
                <span className="dot draft"></span> Draft
              </div>
              <div className="breakdown-value">{formatCurrency(breakdown.Draft || 0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Comparison */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">🏢 Perbandingan per Cabang</h2>
        </div>
        <div className="card-body">
          <div className="branch-list">
            {branches.map(branch => {
              const revenue = getBranchRevenue(branch.id)
              const percentage = totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
              
              return (
                <div key={branch.id} className="branch-row">
                  <div className="branch-info">
                    <span className="branch-name">{branch.name}</span>
                    <span className="branch-revenue">{formatCurrency(revenue)}</span>
                  </div>
                  <div className="branch-bar">
                    <div className="progress-fill" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="branch-percent">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerFinance
