import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

function OrangtuaInvoices() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = () => {
    const parentId = user?.id
    if (!parentId) return

    const stored = localStorage.getItem('dummyData')
    const data = stored ? JSON.parse(stored) : null
    if (!data) return

    const parentChildren = data.children.filter(c => c.parentId === parentId)
    setChildren(parentChildren)
    
    if (parentChildren.length > 0) {
      setSelectedChild(parentChildren[0])
    }

    setInvoices(data.invoices || [])
    setLoading(false)
  }

  const getChildInvoices = (childId) => {
    return invoices
      .filter(inv => inv.childId === childId)
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="badge badge-green">✅ Lunas</span>
      case 'Approved':
        return <span className="badge badge-blue">📋 Disetujui</span>
      case 'Pending':
        return <span className="badge badge-orange">⏳ Pending</span>
      case 'Draft':
        return <span className="badge badge-gray">📝 Draft</span>
      default:
        return <span className="badge badge-gray">{status}</span>
    }
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

  if (loading) {
    return (
      <div className="orangtua-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data tagihan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orangtua-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📄 Tagihan & Pembayaran</h1>
          <p className="page-subtitle">
            Kelola tagihan daycare dan lihat riwayat pembayaran
          </p>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="child-selector-section">
          <div className="selector-label">Pilih Anak:</div>
          <div className="child-pills">
            {children.map((child) => (
              <button
                key={child.id}
                className={`child-pill ${selectedChild?.id === child.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChild(child)
                  setSelectedInvoice(null)
                }}
              >
                <span className="pill-avatar">👶</span>
                <span className="pill-name">{child.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedChild && (
        <div className="invoices-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            {(() => {
              const childInv = getChildInvoices(selectedChild.id)
              const pending = childInv.filter(i => i.status === 'Pending' || i.status === 'Draft')
              const totalPending = pending.reduce((acc, i) => acc + i.totalAmount, 0)
              const paid = childInv.filter(i => i.status === 'Paid')
              
              return (
                <>
                  <div className="stat-card orange">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                      <div className="stat-value">{pending.length}</div>
                      <div className="stat-label">Menunggu Pembayaran</div>
                    </div>
                  </div>
                  
                  <div className="stat-card red">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <div className="stat-value">{formatCurrency(totalPending)}</div>
                      <div className="stat-label">Total Tagihan Aktif</div>
                    </div>
                  </div>
                  
                  <div className="stat-card green">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <div className="stat-value">{paid.length}</div>
                      <div className="stat-label">Sudah Lunas</div>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>

          {/* Invoices List */}
          <div className="invoices-list">
            <div className="list-header">
              <h2 className="list-title">📋 Daftar Tagihan - {selectedChild.name}</h2>
            </div>
            
            {getChildInvoices(selectedChild.id).length > 0 ? (
              getChildInvoices(selectedChild.id).map((invoice) => (
                <div
                  key={invoice.id}
                  className={`invoice-item ${invoice.status.toLowerCase()} ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="invoice-main">
                    <div className="invoice-period">
                      <span className="month">{getMonthName(invoice.month)}</span>
                      <span className="year">{invoice.year}</span>
                    </div>
                    <div className="invoice-details">
                      <div className="invoice-amount">{formatCurrency(invoice.totalAmount)}</div>
                      <div className="invoice-status">{getStatusBadge(invoice.status)}</div>
                    </div>
                  </div>
                  
                  {invoice.overtimeAmount > 0 && (
                    <div className="invoice-overtime">
                      <span className="overtime-label">Termasuk overtime:</span>
                      <span className="overtime-amount">{formatCurrency(invoice.overtimeAmount)}</span>
                    </div>
                  )}
                  
                  <div className="invoice-due">
                    <span className="due-label">Jatuh tempo:</span>
                    <span className={`due-date ${new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid' ? 'overdue' : ''}`}>
                      {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-invoices">
                <span className="empty-icon">📄</span>
                <p>Belum ada tagihan untuk {selectedChild.name}</p>
                <p className="empty-subtitle">Tagihan akan muncul setiap bulan otomatis</p>
              </div>
            )}
          </div>

          {/* Selected Invoice Detail */}
          {selectedInvoice && (
            <div className="invoice-detail-card animate-fade-in">
              <div className="detail-header">
                <h2 className="detail-title">
                  Detail Tagihan {getMonthName(selectedInvoice.month)} {selectedInvoice.year}
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="detail-body">
                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Biaya Bulanan</span>
                    <span>{formatCurrency(selectedInvoice.baseAmount)}</span>
                  </div>
                  
                  {selectedInvoice.overtimeAmount > 0 && (
                    <div className="summary-row overtime">
                      <span>
                        Biaya Overtime 
                        <small>({selectedInvoice.overtimeDetails?.length || 0} hari)</small>
                      </span>
                      <span>{formatCurrency(selectedInvoice.overtimeAmount)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row total">
                    <span>Total Tagihan</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>

                {/* Overtime Details */}
                {selectedInvoice.overtimeDetails && selectedInvoice.overtimeDetails.length > 0 && (
                  <div className="overtime-section">
                    <h3 className="section-title">📅 Detail Overtime</h3>
                    <div className="overtime-list">
                      {selectedInvoice.overtimeDetails.map((detail, idx) => (
                        <div key={idx} className="overtime-item">
                          <span className="date">{new Date(detail.date).toLocaleDateString('id-ID')}</span>
                          <span className="duration">{Math.floor(detail.minutes / 60)}j {detail.minutes % 60}m</span>
                          <span className="amount">{formatCurrency(detail.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="payment-info">
                  <h3 className="section-title">💳 Informasi Pembayaran</h3>
                  
                  {selectedInvoice.status === 'Paid' ? (
                    <div className="paid-info">
                      <div className="paid-badge">✅ SUDAH LUNAS</div>
                      <p>Tanggal bayar: {selectedInvoice.paidAt ? new Date(selectedInvoice.paidAt).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                  ) : (
                    <div className="pending-info">
                      <div className={`due-warning ${new Date(selectedInvoice.dueDate) < new Date() ? 'overdue' : ''}`}>
                        {new Date(selectedInvoice.dueDate) < new Date() 
                          ? '⚠️ JATUH TEMPO LEWAT' 
                          : '⏳ MENUNGGU PEMBAYARAN'}
                      </div>
                      <p>Silakan hubungi admin untuk pembayaran</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="detail-footer">
                  <p>Invoice ID: <code>{selectedInvoice.id}</code></p>
                  {selectedInvoice.approvedBy && (
                    <p>Disetujui oleh: <strong>{selectedInvoice.approvedBy}</strong></p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reassuring Footer */}
          <div className="reassuring-footer">
            <p>
              💙 Transparansi adalah prioritas kami. Setiap tagihan mencakup detail 
              lengkap biaya daycare dan overtime jika ada.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrangtuaInvoices
