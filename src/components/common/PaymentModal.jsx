import { useState } from 'react'

function PaymentModal({ 
  isOpen, 
  onClose, 
  invoice, 
  paymentMethods, 
  onConfirm 
}) {
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen || !invoice) return null

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

  const handleConfirm = async () => {
    if (!selectedMethod) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    onConfirm(invoice.id, selectedMethod)
    setIsLoading(false)
    setSelectedMethod(null)
    onClose()
  }

  const getMethodIcon = (type) => {
    switch (type) {
      case 'bank': return '🏦'
      case 'ewallet': return '📱'
      case 'qr': return '📲'
      default: return '💳'
    }
  }

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💳 Metode Pembayaran</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="invoice-summary">
            <div className="summary-row">
              <span>Tagihan</span>
              <span className="summary-value">
                {getMonthName(invoice.month)} {invoice.year}
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="total-amount">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Pilih metode pembayaran:</h3>
            
            <div className="method-list">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`method-option ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <span className="method-icon">{getMethodIcon(method.type)}</span>
                  <div className="method-info">
                    <span className="method-name">{method.name}</span>
                    <span className="method-account">
                      {method.account || method.number}
                    </span>
                  </div>
                  <span className="check-icon">{selectedMethod === method.id ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedMethod && (
            <div className="payment-instructions animate-fade-in">
              <h4>📝 Petunjuk Pembayaran</h4>
              {selectedMethod.includes('bank') && (
                <ol>
                  <li>Transfer ke nomor rekening yang tertera</li>
                  <li>Jumlah transfer harus tepat</li>
                  <li>Simpan bukti transfer</li>
                  <li>Konfirmasi ke admin via WhatsApp</li>
                </ol>
              )}
              {selectedMethod.includes('ewallet') && (
                <ol>
                  <li>Klik lanjutkan untuk membuka GoPay</li>
                  <li>Periksa jumlah pembayaran</li>
                  <li>Konfirmasi dengan PIN</li>
                  <li>Simpan receipt pembayaran</li>
                </ol>
              )}
              {selectedMethod === 'ewallet_qris' && (
                <ol>
                  <li>Klik tombol Bayar</li>
                  <li>Scan QR Code dengan aplikasi payment</li>
                  <li>Periksa jumlah yang akan dibayarkan</li>
                  <li>Konfirmasi dengan PIN/指纹</li>
                </ol>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </button>
          <button 
            className={`btn-confirm ${!selectedMethod ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedMethod || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>Bayar Sekarang</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .payment-modal {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #E2E8F0;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #2D3748;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #F3F4F6;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #E5E7EB;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .invoice-summary {
          background: linear-gradient(135deg, #FDF8E8 0%, #FEF3C7 100%);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #6B7280;
        }

        .summary-row.total {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #D1D5DB;
        }

        .summary-value {
          font-weight: 600;
          color: #2D3748;
        }

        .total-amount {
          font-size: 20px;
          font-weight: 700;
          color: #C17817;
        }

        .payment-methods h3 {
          font-size: 14px;
          font-weight: 600;
          color: #4A5568;
          margin-bottom: 12px;
        }

        .method-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .method-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: white;
          border: 2px solid #E2E8F0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .method-option:hover {
          border-color: #F4B400;
        }

        .method-option.selected {
          border-color: #F4B400;
          background: #FFFBEB;
        }

        .method-icon {
          font-size: 24px;
        }

        .method-info {
          flex: 1;
          text-align: left;
        }

        .method-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2D3748;
        }

        .method-account {
          display: block;
          font-size: 12px;
          color: #718096;
        }

        .check-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F4B400;
          color: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .payment-instructions {
          margin-top: 20px;
          padding: 16px;
          background: #F9FAFB;
          border-radius: 12px;
        }

        .payment-instructions h4 {
          font-size: 14px;
          font-weight: 600;
          color: #2D3748;
          margin-bottom: 12px;
        }

        .payment-instructions ol {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #4A5568;
          line-height: 1.8;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #E2E8F0;
        }

        .btn-cancel, .btn-confirm {
          flex: 1;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel {
          background: #F3F4F6;
          border: none;
          color: #4B5563;
        }

        .btn-cancel:hover {
          background: #E5E7EB;
        }

        .btn-confirm {
          background: linear-gradient(135deg, #F4B400 0%, #FF8C42 100%);
          border: none;
          color: white;
 }

        .btn       -confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 180, 0, 0.4);
        }

        .btn-confirm.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  )
}

export default PaymentModal
