function SkeletonLoader({ type = 'card', count = 3 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text short"></div>
          </div>
        )
      
      case 'stat':
        return (
          <div className="skeleton-stat">
            <div className="skeleton-icon"></div>
            <div className="skeleton-stat-content">
              <div className="skeleton-line skeleton-label"></div>
              <div className="skeleton-line skeleton-value"></div>
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div className="skeleton-list">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-list-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-subtitle"></div>
            </div>
          </div>
        )
      
      case 'table':
        return (
          <div className="skeleton-table">
            <div className="skeleton-table-header">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
            {[...Array(count)].map((_, i) => (
              <div className="skeleton-table-row" key={i}>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
              </div>
            ))}
          </div>
        )
      
      case 'invoice':
        return (
          <div className="skeleton-invoice">
            <div className="skeleton-invoice-header">
              <div className="skeleton-line skeleton-month"></div>
              <div className="skeleton-badge"></div>
            </div>
            <div className="skeleton-invoice-body">
              <div className="skeleton-line skeleton-amount"></div>
              <div className="skeleton-line skeleton-due"></div>
            </div>
          </div>
        )
      
      case 'gallery':
        return (
          <div className="skeleton-gallery">
            {[...Array(count)].map((_, i) => (
              <div className="skeleton-image" key={i}></div>
            ))}
          </div>
        )
      
      default:
        return (
          <div className="skeleton-card">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        )
    }
  }

  return (
    <div className="skeleton-container">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}

      <style>{`
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-item {
          opacity: 1;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .skeleton-card, .skeleton-stat, .skeleton-list, .skeleton-invoice {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 0.8s ease-in-out infinite;
          border-radius: 8px;
        }

        .skeleton-title {
          height: 20px;
          width: 60%;
          margin-bottom: 12px;
        }

        .skeleton-subtitle {
          height: 14px;
          width: 40%;
          margin-bottom: 12px;
        }

        .skeleton-text {
          height: 14px;
          width: 100%;
          margin-bottom: 8px;
        }

        .skeleton-text.short {
          width: 60%;
        }

        .skeleton-stat {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .skeleton-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #f0f0f0;
        }

        .skeleton-stat-content {
          flex: 1;
        }

        .skeleton-label {
          height: 12px;
          width: 50%;
          margin-bottom: 8px;
        }

        .skeleton-value {
          height: 24px;
          width: 70%;
        }

        .skeleton-list {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f0f0f0;
        }

        .skeleton-list-content {
          flex: 1;
        }

        .skeleton-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }

        .skeleton-table-header, .skeleton-table-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 16px;
        }

        .skeleton-table-header {
          background: #f9fafb;
        }

        .skeleton-table-header .skeleton-line {
          height: 12px;
        }

        .skeleton-table-row .skeleton-line {
          height: 16px;
        }

        .skeleton-invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .skeleton-month {
          height: 20px;
          width: 40%;
        }

        .skeleton-badge {
          width: 80px;
          height: 28px;
          border-radius: 20px;
          background: #f0f0f0;
        }

        .skeleton-invoice-body {
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .skeleton-amount {
          height: 28px;
          width: 50%;
          margin-bottom: 8px;
        }

        .skeleton-due {
          height: 14px;
          width: 30%;
        }

        .skeleton-gallery {
          display: flex;
          gap: 12px;
          overflow: hidden;
        }

        .skeleton-image {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          background: #f0f0f0;
          flex-shrink: 0;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export default SkeletonLoader
