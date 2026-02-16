import { useMemo } from 'react'
import { getOwnerKPIs } from '../../utils/dataHelpers.js'
import { formatCurrency, formatCurrencyShorthand } from '../../utils/invoice.js'
import { useInvoices } from '../../hooks/useData.js'

function OwnerDashboard() {
  const kpis = useMemo(() => getOwnerKPIs(), [])
  const { invoices, getFinancialSummary } = useInvoices()
  
  // Get current month financial summary
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const financeSummary = getFinancialSummary(currentMonth, currentYear)

  const kpiCards = [
    {
      label: 'Total Revenue (Bulan Ini)',
      value: formatCurrencyShorthand(kpis.totalRevenue),
      fullValue: formatCurrency(kpis.totalRevenue),
      change: '+12%',
      changeType: 'positive',
      icon: '💰',
      iconColor: 'green'
    },
    {
      label: 'Anak Aktif',
      value: kpis.totalChildren,
      fullValue: `${kpis.totalChildren} anak terdaftar`,
      change: '+3 bulan ini',
      changeType: 'positive',
      icon: '👶',
      iconColor: 'blue'
    },
    {
      label: 'Overtime (Bulan Ini)',
      value: `${Math.round(kpis.totalOvertimeMinutes / 60)}j`,
      fullValue: `${kpis.totalOvertimeMinutes} menit total`,
      change: `${kpis.overtimeDays} hari dengan overtime`,
      changeType: 'neutral',
      icon: '⏰',
      iconColor: 'orange'
    },
    {
      label: 'Invoice Pending',
      value: kpis.pendingApprovals,
      fullValue: `${formatCurrency(kpis.pendingApprovals * 3500000)} total`,
      change: 'Menunggu approval',
      changeType: kpis.pendingApprovals > 5 ? 'negative' : 'neutral',
      icon: '📄',
      iconColor: 'red'
    }
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="top-header">
        <div>
          <h1 className="top-header-title">Owner Dashboard</h1>
          <p className="top-header-subtitle">Overview & Strategic KPIs</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">{kpi.label}</span>
              <div className={`kpi-icon ${kpi.iconColor}`}>{kpi.icon}</div>
            </div>
            <div className="kpi-value" title={kpi.fullValue}>{kpi.value}</div>
            <div className={`kpi-change ${kpi.changeType}`}>
              {kpi.changeType === 'positive' && '↑ '}
              {kpi.changeType === 'negative' && '↓ '}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Branch Performance */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Performa Cabang</h2>
              <p className="card-subtitle">Revenue & jumlah anak per cabang</p>
            </div>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cabang</th>
                    <th>Anak Aktif</th>
                    <th>Revenue Bulan Ini</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.branchStats.map((branch) => (
                    <tr key={branch.id}>
                      <td>
                        <strong>{branch.name}</strong>
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {branch.address}
                        </span>
                      </td>
                      <td>{branch.childCount} anak</td>
                      <td>{formatCurrency(branch.monthlyRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Ringkasan Keuangan</h2>
              <p className="card-subtitle">Bulan {currentMonth}/{currentYear}</p>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--color-bg-primary)',
                borderRadius: '8px'
              }}>
                <span className="text-muted">Total Invoice</span>
                <span className="font-bold">{financeSummary.totalInvoices}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--color-bg-primary)',
                borderRadius: '8px'
              }}>
                <span className="text-muted">Pendapatan Dasar</span>
                <span className="font-bold">{formatCurrency(financeSummary.totalBaseAmount)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--color-bg-primary)',
                borderRadius: '8px'
              }}>
                <span className="text-muted">Overtime</span>
                <span className="font-bold text-warning">{formatCurrency(financeSummary.totalOvertimeAmount)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: 'var(--color-accent-primary)',
                borderRadius: '8px',
                color: 'white'
              }}>
                <span className="font-semibold">Total Revenue</span>
                <span className="font-bold" style={{ fontSize: '1.25rem' }}>
                  {formatCurrency(financeSummary.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Status Overview */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Status Invoice</h2>
            <p className="card-subtitle">Overview approval invoice bulan ini</p>
          </div>
        </div>
        <div className="card-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              background: 'var(--color-warning-light)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-warning)' }}>
                {financeSummary.draftCount}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Draft
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {formatCurrency(financeSummary.draftAmount)}
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              background: 'var(--color-success-light)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-success)' }}>
                {financeSummary.approvedCount}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Approved
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {formatCurrency(financeSummary.approvedAmount)}
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              background: 'var(--color-info-light)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-info)' }}>
                {financeSummary.paidCount}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Paid
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {formatCurrency(financeSummary.paidAmount)}
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              background: 'var(--color-bg-secondary)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {kpis.approvalRate}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Approval Rate
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Bulan ini
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Invoice Menunggu Approval</h2>
            <p className="card-subtitle">Invoice dengan status Draft yang perlu di-approve</p>
          </div>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Invoice</th>
                  <th>Anak</th>
                  <th>Periode</th>
                  <th>Base Amount</th>
                  <th>Overtime</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices
                  .filter(inv => inv.status === 'Draft')
                  .slice(0, 5)
                  .map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.childId}</td>
                      <td>{invoice.month}/{invoice.year}</td>
                      <td>{formatCurrency(invoice.baseAmount)}</td>
                      <td className={invoice.overtimeAmount > 0 ? 'text-warning' : ''}>
                        {formatCurrency(invoice.overtimeAmount)}
                      </td>
                      <td className="font-bold">{formatCurrency(invoice.totalAmount)}</td>
                      <td>
                        <span className="badge badge-orange">Draft</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
