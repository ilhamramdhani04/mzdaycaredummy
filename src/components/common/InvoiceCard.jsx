function InvoiceCard({ invoice, child, onClick, paymentMethods = [] }) {
  const getStatusConfig = (status) => {
    const configs = {
      Paid: { 
        label: 'Lunas', 
        color: '#22C55E', 
        bg: '#DCFCE7', 
        icon: '✅' 
      },
      Approved: { 
        label: 'Disetujui', 
        color: '#3B82F6', 
        bg: '#DBEAFE', 
        icon: '📋' 
      },
      Pending: { 
        label: 'Menunggu', 
        color: '#F59E0B', 
        bg: '#FEF3C7', 
        icon: '⏳' 
      },
      Draft: { 
        label: 'Draft', 
        color: '#6B7280', 
        bg: '#F3F4F6', 
        icon: '📝' 
      },
      Overdue: { 
        label: 'Jatuh Tempo', 
        color: '#EF4444', 
        bg: '#FEE2E2', 
        icon: '⚠️' 
      }
    }
    return configs[status] || configs.Draft
  }

  const getMonthName = (month) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    return months[month - 1] || ''
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const statusConfig = getStatusConfig(invoice.status)
  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid'

  return (
    <div 
      className={`invoice-card-pro ${invoice.status.toLowerCase()} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="invoice-card-header">
        <div className="invoice-period">
          <span className="month-name">{getMonthName(invoice.month)}</span>
          <span className="year">{invoice.year}</span>
        </div>
        <span 
          className="invoice-status"
          style={{ background: statusConfig.bg, color: statusConfig.color }}
        >
          <span>{statusConfig.icon}</span>
          {statusConfig.label}
        </span>
      </div>

      <div className="invoice-card-body">
        {child && (
          <div className="child-info">
            <span className="child-avatar">👶</span>
            <span className="child-name">{child.nickname || child.name}</span>
          </div>
        )}

        <div className="invoice-amount">
          <span className="amount-label">Total Tagihan</span>
          <span className="amount-value">{formatCurrency(invoice.totalAmount)}</span>
        </div>

        {invoice.overtimeAmount > 0 && (
          <div className="overtime-info">
            <span className="overtime-label">Termasuk overtime:</span>
            <span className="overtime-value">+{formatCurrency(invoice.overtimeAmount)}</span>
          </div>
        )}

        {invoice.discountAmount > 0 && (
          <div className="discount-info">
            <span className="discount-label">Diskon:</span>
            <span className="discount-value">-{formatCurrency(invoice.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="invoice-card-footer">
        <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
          <span className="due-label">
            {isOverdue ? '⚠️ Jatuh tempo:' : '⏰ Jatuh tempo:'}
          </span>
          <span className="due-value">
            {new Date(invoice.dueDate).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {invoice.status === 'Paid' && invoice.paidAt && (
          <div className="paid-info">
            <span className="paid-label">✅ Dibayar:</span>
            <span className="paid-value">
              {new Date(invoice.paidAt).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        )}

        {invoice.paymentMethod && (
          <div className="payment-method-info">
            <span className="method-label">💳 Via:</span>
            <span className="method-value">
              {paymentMethods.find(m => m.id === invoice.paymentMethod)?.name || invoice.paymentMethod}
            </span>
          </div>
        )}
      </div>

      <style>{`
        .invoice-card-pro {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .invoice-card-pro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #F4B400, #FF8C42);
        }

        .invoice-card-pro.paid::before {
          background: linear-gradient(90deg, #22C55E, #48BB78);
        }

        .invoice-card-pro.overdue::before {
          background: linear-gradient(90deg, #EF4444, #E53E3E);
        }

        .invoice-card-pro.clickable {
          cursor: pointer;
        }

        .invoice-card-pro:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .invoice-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .invoice-period {
          display: flex;
          flex-direction: column;
        }

        .month-name {
          font-size: 18px;
          font-weight: 700;
          color: #2D3748;
        }

        .year {
          font-size: 14px;
          color: #718096;
        }

        .invoice-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .invoice-card-body {
          padding: 16px 0;
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }

        .child-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .child-avatar {
          font-size: 24px;
        }

        .child-name {
          font-size: 14px;
          font-weight: 600;
          color: #4A5568;
        }

        .invoice-amount {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .amount-label {
          font-size: 12px;
          color: #718096;
        }

        .amount-value {
          font-size: 24px;
          font-weight: 700;
          color: #2D3748;
        }

        .overtime-info, .discount-info, .payment-method-info {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-top: 8px;
        }

        .overtime-value {
          color: #F59E0B;
          font-weight: 600;
        }

        .discount-value {
          color: #22C55E;
          font-weight: 600;
        }

        .invoice-card-footer {
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .due-date, .paid-info {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .due-label, .paid-label {
          color: #718096;
        }

        .due-value, .paid-value {
          font-weight: 500;
          color: #4A5568;
        }

        .due-date.overdue .due-value {
          color: #EF4444;
        }

        .method-label {
          color: #718096;
        }

        @media (max-width: 480px) {
          .invoice-card-pro {
            padding: 16px;
          }

          .amount-value {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default InvoiceCard
