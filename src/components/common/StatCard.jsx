function StatCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend, 
  trendValue,
  color = 'primary',
  onClick 
}) {
  const colorClasses = {
    primary: { bg: 'linear-gradient(135deg, #F4B400 0%, #FF8C42 100%)', text: '#2D3748' },
    success: { bg: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)', text: '#FFFFFF' },
    danger: { bg: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)', text: '#FFFFFF' },
    info: { bg: 'linear-gradient(135deg, #4299E1 0%, #3182CE 100%)', text: '#FFFFFF' },
    warning: { bg: 'linear-gradient(135deg, #ED8936 0%, #DD6B20 100%)', text: '#FFFFFF' },
    purple: { bg: 'linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)', text: '#FFFFFF' },
  }

  const colors = colorClasses[color] || colorClasses.primary

  return (
    <div 
      className={`stat-card-pro ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{ '--card-gradient': colors.bg }}
    >
      <div className="stat-card-icon">
        <span>{icon}</span>
      </div>
      
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-value">
          <span className="value">{value}</span>
          {trend && (
            <span className={`trend ${trend}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>

      <style>{`
        .stat-card-pro {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card-pro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: var(--card-gradient);
          border-radius: 0 0 0 20px;
        }

        .stat-card-pro.clickable {
          cursor: pointer;
        }

        .stat-card-pro:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--card-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .stat-card-content {
          flex: 1;
          min-width: 0;
        }

        .stat-card-title {
          font-size: 13px;
          color: #718096;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .stat-card-value {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stat-card-value .value {
          font-size: 24px;
          font-weight: 700;
          color: #2D3748;
          line-height: 1.2;
        }

        .trend {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .trend.up {
          background: #DCFCE7;
          color: #22C55E;
        }

        .trend.down {
          background: #FEE2E2;
          color: #EF4444;
        }

        .stat-card-subtitle {
          font-size: 12px;
          color: #A0AEC0;
          display: block;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .stat-card-pro {
            padding: 16px;
          }

          .stat-card-icon {
            width: 44px;
            height: 44px;
            font-size: 20px;
          }

          .stat-card-value .value {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default StatCard
