import { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

function OwnerInvoices() {
  const { success, error } = useToast()
  const [invoices, setInvoices] = useState([])
  const [children, setChildren] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (data) {
      setInvoices(data.invoices || [])
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getMonthName = (month) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return months[month - 1] || ''
  }

  const handleApprove = (invoiceId) => {
    const updated = invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'Approved', approvedBy: 'owner_1', approvedAt: new Date().toISOString() }
        : inv
    )
    setInvoices(updated)
    
    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : {}
    data.invoices = updated
    localStorage.setItem('dummyData', JSON.stringify(data))
    
    success('Invoice berhasil disetujui!')
    setSelectedInvoice(null)
  }

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(i => i.status.toLowerCase() === filter)

  const stats = {
    total: invoices.reduce((acc, i) => acc + i.totalAmount, 0),
    pending: invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.totalAmount, 0),
    approved: invoices.filter(i => i.status === 'Approved').reduce((acc, i) => acc + i.totalAmount, 0),
    paid: invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0)
  }

  if (loading) {
    return (
      <div className="owner-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data invoice...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="owner-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📄 Approval Invoice</h1>
          <p className="page-subtitle">
            Review dan setujui tagihan dari superadmin
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats.total)}</div>
            <div className="stat-label">Total Tagihan</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats.pending)}</div>
            <div className="stat-label">Menunggu Approval</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats.approved)}</div>
            <div className="stat-label">Sudah Disetujui</div>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats.paid)}</div>
            <div className="stat-label">Sudah Dibayar</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Semua
        </button>
        <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
          Pending
        </button>
        <button className={`filter-tab ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
          Approved
        </button>
        <button className={`filter-tab ${filter === 'paid' ? 'active' : ''}`} onClick={() => setFilter('paid')}>
          Paid
        </button>
      </div>

      {/* Invoices Table */}
      <div className="data-card">
        <div className="card-header">
          <h2 className="card-title">Daftar Invoice</h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Anak</th>
                  <th>Cabang</th>
                  <th>Periode</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><code>{invoice.id}</code></td>
                    <td>{getChildName(invoice.childId)}</td>
                    <td>{getBranchName(invoice.childId)}</td>
                    <td>{getMonthName(invoice.month)} {invoice.year}</td>
                    <td className="amount">{formatCurrency(invoice.totalAmount)}</td>
                    <td>
                      <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      {invoice.status === 'Pending' && (
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          ✅ Approve
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        👁️ Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Invoice</h3>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="invoice-detail">
                <p><strong>Anak:</strong> {getChildName(selectedInvoice.childId)}</p>
                <p><strong>Cabang:</strong> {getBranchName(selectedInvoice.childId)}</p>
                <p><strong>Periode:</strong> {getMonthName(selectedInvoice.month)} {selectedInvoice.year}</p>
                <hr />
                <p><strong>Biaya Dasar:</strong> {formatCurrency(selectedInvoice.baseAmount)}</p>
                {selectedInvoice.overtimeAmount > 0 && (
                  <p><strong>Overtime:</strong> {formatCurrency(selectedInvoice.overtimeAmount)}</p>
                )}
                <p className="total"><strong>Total:</strong> {formatCurrency(selectedInvoice.totalAmount)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Tutup
              </button>
              {selectedInvoice.status === 'Pending' && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedInvoice.id)}
                >
                  ✅ Setujui Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerInvoices
