import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { 
  StatCard, 
  InvoiceCard, 
  EmptyState, 
  PaymentModal,
  WhatsAppButton
} from '../../components/common'

function OrangtuaInvoices() {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAndLoadData()
  }, [user])

  const initializeAndLoadData = async () => {
    let stored = localStorage.getItem('dummyData')
    
    if (!stored) {
      try {
        const response = await fetch('/src/data/dummyData.json')
        const data = await response.json()
        localStorage.setItem('dummyData', JSON.stringify(data))
        stored = JSON.stringify(data)
      } catch (e) {
        console.error('Failed to load data:', e)
        setLoading(false)
        return
      }
    }
    
    const data = JSON.parse(stored)
    const parentId = user?.id
    
    if (!parentId) {
      setLoading(false)
      return
    }

    const parentChildren = data.children.filter(c => c.parentId === parentId)
    setChildren(parentChildren)
    setPaymentMethods(data.paymentMethods || [])
    
    if (parentChildren.length > 0) {
      setSelectedChild(parentChildren[0])
    }

    setInvoices(data.invoices || [])
    setLoading(false)
  }

  const getChildInvoices = (childId) => {
    return invoices
      .filter(inv => inv.childId === childId)
      .sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1)
        const dateB = new Date(b.year, b.month - 1)
        return dateB - dateA
      })
  }

  const getStats = (childId) => {
    const childInv = getChildInvoices(childId)
    const pending = childInv.filter(i => i.status === 'Pending' || i.status === 'Draft' || i.status === 'Approved')
    const overdue = childInv.filter(i => i.status === 'Overdue')
    const totalPending = pending.reduce((acc, i) => acc + i.totalAmount, 0)
    const paid = childInv.filter(i => i.status === 'Paid')
    const totalPaid = paid.reduce((acc, i) => acc + i.totalAmount, 0)
    
    return { pending: pending.length, overdue: overdue.length, totalPending, paid: paid.length, totalPaid }
  }

  const handlePayment = (invoiceId, methodId) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'Paid', paidAt: new Date().toISOString(), paymentMethod: methodId }
        : inv
    )
    setInvoices(updatedInvoices)
    
    const stored = localStorage.getItem('dummyData')
    if (stored) {
      const data = JSON.parse(stored)
      data.invoices = updatedInvoices
      localStorage.setItem('dummyData', JSON.stringify(data))
    }
    
    alert('Pembayaran berhasil! Tagihan akan diverifikasi oleh admin.')
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
        <div className="page-container">
          <div className="skeleton-quick">
            <div className="skeleton-header"></div>
            <div className="skeleton-stats">
              <div className="skeleton-stat-box"></div>
              <div className="skeleton-stat-box"></div>
              <div className="skeleton-stat-box"></div>
            </div>
            <div className="skeleton-cards">
              <div className="skeleton-card-box"></div>
              <div className="skeleton-card-box"></div>
            </div>
          </div>
        </div>
        <style>{`
          .skeleton-quick { padding: 24px; max-width: 1200px; margin: 0 auto; }
          .skeleton-header { height: 40px; width: 200px; background: #f0f0f0; border-radius: 8px; margin-bottom: 24px; animation: pulse 1s ease-in-out infinite; }
          .skeleton-stats { display: flex; gap: 16px; margin-bottom: 24px; }
          .skeleton-stat-box { flex: 1; height: 100px; background: #f0f0f0; border-radius: 16px; animation: pulse 1s ease-in-out infinite; }
          .skeleton-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
          .skeleton-card-box { height: 200px; background: #f0f0f0; border-radius: 20px; animation: pulse 1s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
      </div>
    )
  }

  const stats = selectedChild ? getStats(selectedChild.id) : null

  return (
    <div className="orangtua-page animate-fade-in">
      <WhatsAppButton 
        phoneNumber="+6281234567890"
        defaultMessage="Halo Mannazentrum, saya ingin bertanya tentang tagihan..."
      />

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">📄 Tagihan & Pembayaran</h1>
          <p className="page-subtitle">
            Kelola tagihan daycare dan lihat riwayat pembayaran
          </p>
        </div>

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
                  <span className="pill-name">{child.nickname || child.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && children.length === 0 && (
          <div className="no-children-message">
            <EmptyState 
              type="default"
              title="Tidak Ada Data Anak"
              description="Anda belum memiliki anak yang terdaftar. Silakan hubungi admin."
            />
          </div>
        )}

        {selectedChild && (
          <>
            <div className="stats-grid">
              <StatCard
                title="Menunggu Pembayaran"
                value={stats?.pending || 0}
                icon="⏳"
                color="warning"
              />
              <StatCard
                title="Total Tagihan Aktif"
                value={`Rp ${((stats?.totalPending || 0) / 1000000).toFixed(1)}jt`}
                icon="💰"
                color="danger"
              />
              <StatCard
                title="Sudah Lunas"
                value={stats?.paid || 0}
                icon="✅"
                color="success"
                subtitle={`Total: Rp ${((stats?.totalPaid || 0) / 1000000).toFixed(1)}jt`}
              />
              {(stats?.overdue || 0) > 0 && (
                <StatCard
                  title="Jatuh Tempo Lewat"
                  value={stats.overdue}
                  icon="⚠️"
                  color="danger"
                />
              )}
            </div>

            <div className="invoices-section">
              <h2 className="section-title">
                📋 Riwayat Tagihan - {selectedChild.nickname || selectedChild.name.split(' ')[0]}
              </h2>

              {getChildInvoices(selectedChild.id).length > 0 ? (
                <div className="invoices-grid">
                  {getChildInvoices(selectedChild.id).map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      child={selectedChild}
                      paymentMethods={paymentMethods}
                      onClick={() => setSelectedInvoice(invoice)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  type="invoice"
                  title="Belum Ada Tagihan"
                  description="Tagihan akan muncul setiap bulan"
                />
              )}
            </div>
          </>
        )}

        {selectedInvoice && (
          <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
            <div className="invoice-detail-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Detail Tagihan</h2>
                <button className="close-btn" onClick={() => setSelectedInvoice(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="detail-status">
                  <span className={`status-badge ${selectedInvoice.status.toLowerCase()}`}>
                    {selectedInvoice.status === 'Paid' ? '✅ Lunas' : 
                     selectedInvoice.status === 'Approved' ? '📋 Disetujui' :
                     selectedInvoice.status === 'Pending' ? '⏳ Menunggu' :
                     selectedInvoice.status === 'Overdue' ? '⚠️ Jatuh Tempo' : '📝 Draft'}
                  </span>
                </div>

                <div className="detail-period">
                  <span className="period-month">{getMonthName(selectedInvoice.month)}</span>
                  <span className="period-year">{selectedInvoice.year}</span>
                </div>

                <div className="detail-child">
                  <span className="child-avatar">👶</span>
                  <span className="child-name">{selectedChild?.name}</span>
                </div>

                <div className="detail-breakdown">
                  <div className="breakdown-row">
                    <span>Biaya Bulanan</span>
                    <span>{formatCurrency(selectedInvoice.baseAmount)}</span>
                  </div>
                  
                  {selectedInvoice.overtimeAmount > 0 && (
                    <div className="breakdown-row overtime">
                      <span>Biaya Overtime</span>
                      <span>+{formatCurrency(selectedInvoice.overtimeAmount)}</span>
                    </div>
                  )}

                  {selectedInvoice.discountAmount > 0 && (
                    <div className="breakdown-row discount">
                      <span>Diskon</span>
                      <span>-{formatCurrency(selectedInvoice.discountAmount)}</span>
                    </div>
                  )}

                  <div className="breakdown-row total">
                    <span>Total Tagihan</span>
                    <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>

                <div className="detail-due">
                  <div className="due-row">
                    <span>📅 Jatuh Tempo</span>
                    <span>{new Date(selectedInvoice.dueDate).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}</span>
                  </div>
                  
                  {selectedInvoice.status === 'Paid' && selectedInvoice.paidAt && (
                    <div className="due-row paid">
                      <span>✅ Dibayar Pada</span>
                      <span>{new Date(selectedInvoice.paidAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}</span>
                    </div>
                  )}

                  {selectedInvoice.paymentMethod && (
                    <div className="due-row">
                      <span>💳 Via</span>
                      <span>{paymentMethods.find(m => m.id === selectedInvoice.paymentMethod)?.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedInvoice.status !== 'Paid' && (
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setSelectedInvoice(null)}>
                    Tutup
                  </button>
                  <button className="btn-primary" onClick={() => setShowPaymentModal(true)}>
                    💳 Bayar Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          invoice={selectedInvoice}
          paymentMethods={paymentMethods}
          onConfirm={handlePayment}
        />
      </div>

      <style>{`
        .page-container { max-width: 1200px; margin: 0 auto; padding: 24px; padding-bottom: 100px; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 28px; font-weight: 700; color: #2D3748; margin-bottom: 8px; }
        .page-subtitle { font-size: 14px; color: #718096; }
        .child-selector-section { margin-bottom: 24px; }
        .selector-label { font-size: 14px; font-weight: 600; color: #4A5568; margin-bottom: 12px; }
        .child-pills { display: flex; gap: 12px; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
        .child-pill { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: white; border: 2px solid #E2E8F0; border-radius: 50px; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
        .child-pill:hover { border-color: #F4B400; }
        .child-pill.active { background: linear-gradient(135deg, #F4B400 0%, #FF8C42 100%); border-color: transparent; color: white; }
        .pill-avatar { font-size: 20px; }
        .pill-name { font-size: 14px; font-weight: 600; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .invoices-section { margin-top: 32px; }
        .section-title { font-size: 18px; font-weight: 700; color: #2D3748; margin-bottom: 20px; }
        .invoices-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .no-children-message { padding: 40px 20px; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
        .invoice-detail-modal { background: white; border-radius: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #E2E8F0; }
        .modal-header h2 { font-size: 18px; font-weight: 700; color: #2D3748; }
        .close-btn { width: 32px; height: 32px; border: none; background: #F3F4F6; border-radius: 50%; font-size: 20px; cursor: pointer; color: #6B7280; }
        .modal-body { padding: 24px; }
        .detail-status { text-align: center; margin-bottom: 16px; }
        .status-badge { padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
        .status-badge.paid { background: #DCFCE7; color: #22C55E; }
        .status-badge.approved { background: #DBEAFE; color: #3B82F6; }
        .status-badge.pending { background: #FEF3C7; color: #F59E0B; }
        .status-badge.draft { background: #F3F4F6; color: #6B7280; }
        .status-badge.overdue { background: #FEE2E2; color: #EF4444; }
        .detail-period { text-align: center; margin-bottom: 12px; }
        .period-month { font-size: 24px; font-weight: 700; color: #2D3748; }
        .period-year { font-size: 16px; color: #718096; margin-left: 8px; }
        .detail-child { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; padding: 12px; background: #FDF8F3; border-radius: 12px; }
        .detail-child .child-avatar { font-size: 24px; }
        .detail-child .child-name { font-weight: 600; color: #2D3748; }
        .detail-breakdown { background: #F9FAFB; border-radius: 16px; padding: 16px; margin-bottom: 20px; }
        .breakdown-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #4A5568; }
        .breakdown-row.overtime span:last-child { color: #F59E0B; }
        .breakdown-row.discount span:last-child { color: #22C55E; }
        .breakdown-row.total { border-top: 2px dashed #E2E8F0; margin-top: 8px; padding-top: 16px; font-size: 18px; font-weight: 700; color: #2D3748; }
        .detail-due { display: flex; flex-direction: column; gap: 8px; }
        .due-row { display: flex; justify-content: space-between; font-size: 14px; color: #4A5568; }
        .due-row.paid span:last-child { color: #22C55E; font-weight: 600; }
        .modal-footer { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid #E2E8F0; }
        .btn-secondary, .btn-primary { flex: 1; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-secondary { background: #F3F4F6; border: none; color: #4B5563; }
        .btn-primary { background: linear-gradient(135deg, #F4B400 0%, #FF8C42 100%); border: none; color: white; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(244, 180, 0, 0.4); }
        
        @media (max-width: 768px) {
          .page-container { padding: 16px; padding-bottom: 100px; }
          .page-title { font-size: 22px; }
          .stats-grid { grid-template-columns: 1fr; gap: 12px; }
          .invoices-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
    </div>
  )
}

export default OrangtuaInvoices
