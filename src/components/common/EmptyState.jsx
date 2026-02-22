function EmptyState({ 
  type = 'default',
  title,
  description,
  actionLabel,
  onAction,
  icon
}) {
  const illustrations = {
    default: {
      icon: '📭',
      title: 'Belum Ada Data',
      description: 'Data akan muncul di sini'
    },
    invoice: {
      icon: '📄',
      title: 'Belum Ada Tagihan',
      description: 'Tagihan akan muncul setiap awal bulan'
    },
    message: {
      icon: '💬',
      title: 'Belum Ada Pesan',
      description: 'Mulai percakapan dengan guru'
    },
    photo: {
      icon: '📷',
      title: 'Belum Ada Foto',
      description: 'Foto akan diupload oleh guru'
    },
    attendance: {
      icon: '📅',
      title: 'Belum Ada Kehadiran',
      description: 'Riwayat kehadiran akan muncul di sini'
    },
    report: {
      icon: '📊',
      title: 'Belum Ada Laporan',
      description: 'Laporan akan tersedia setelah guru input'
    },
    search: {
      icon: '🔍',
      title: 'Tidak Ditemukan',
      description: 'Coba kata kunci lain'
    },
    error: {
      icon: '😔',
      title: 'Terjadi Kesalahan',
      description: 'Silakan coba lagi nanti'
    }
  }

  const config = illustrations[type] || illustrations.default

  return (
    <div className="empty-state-pro">
      <div className="empty-illustration">
        <span className="empty-icon">{icon || config.icon}</span>
        <div className="empty-shapes">
          <span className="shape shape-1"></span>
          <span className="shape shape-2"></span>
          <span className="shape shape-3"></span>
        </div>
      </div>
      
      <h3 className="empty-title">{title || config.title}</h3>
      <p className="empty-description">{description || config.description}</p>
      
      {actionLabel && onAction && (
        <button className="empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}

      <style>{`
        .empty-state-pro {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .empty-illustration {
          position: relative;
          margin-bottom: 24px;
        }

        .empty-icon {
          font-size: 64px;
          display: block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-shapes {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          z-index: -1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          background: #F4B400;
          top: -20px;
          left: -30px;
          animation: pulse 2s ease-in-out infinite;
        }

        .shape-2 {
          width: 50px;
          height: 50px;
          background: #FF8C42;
          bottom: -10px;
          right: -20px;
          animation: pulse 2s ease-in-out infinite 0.5s;
        }

        .shape-3 {
          width: 30px;
          height: 30px;
          background: #4ECDC4;
          top: 10px;
          right: -10px;
          animation: pulse 2s ease-in-out infinite 1s;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #2D3748;
          margin-bottom: 8px;
        }

        .empty-description {
          font-size: 14px;
          color: #718096;
          max-width: 280px;
          line-height: 1.6;
        }

        .empty-action {
          margin-top: 20px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #F4B400 0%, #FF8C42 100%);
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 180, 0, 0.4);
        }

        @media (max-width: 480px) {
          .empty-icon {
            font-size: 48px;
          }

          .empty-title {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}

export default EmptyState
