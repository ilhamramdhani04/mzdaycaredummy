import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useOvertimeConfig from '../../hooks/useOvertimeConfig'
import EmptyState from '../../components/admin/EmptyState'

function GuruOvertime() {
  const { user, permissions } = useAuth()
  const { config, loading, updateConfig, setPackageRate, setBranchRate, resetToDefault, packages, branches } = useOvertimeConfig()
  
  const [formData, setFormData] = useState(null)
  const [packageRates, setPackageRates] = useState({})
  const [branchRates, setBranchRates] = useState({})
  const [saved, setSaved] = useState(false)

  const canManage = permissions.canManageOvertime

  useEffect(() => {
    if (config) {
      setFormData({
        enabled: config.enabled ?? true,
        defaultRate: config.defaultRate ?? 50000,
        gracePeriodMinutes: config.gracePeriodMinutes ?? 15,
        maxOvertimeMinutes: config.maxOvertimeMinutes ?? 120,
        weekendEnabled: config.weekendEnabled ?? false,
        weekendRateMultiplier: config.weekendRateMultiplier ?? 1.5
      })
      setPackageRates(config.packageOverrides || {})
      setBranchRates(config.branchRates || {})
    }
  }, [config])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handlePackageRateChange = (packageId, value) => {
    setPackageRates(prev => ({ ...prev, [packageId]: parseInt(value) || 0 }))
    setSaved(false)
  }

  const handleBranchRateChange = (branchId, value) => {
    setBranchRates(prev => ({ ...prev, [branchId]: parseInt(value) || 0 }))
    setSaved(false)
  }

  const handleSave = () => {
    updateConfig({
      ...formData,
      packageOverrides: packageRates,
      branchRates: branchRates,
      updatedBy: user?.displayName || 'Admin'
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Reset ke pengaturan default?')) {
      resetToDefault()
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) return `${hours}j ${mins}m`
    if (hours > 0) return `${hours} jam`
    return `${mins} menit`
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">⚙️ Konfigurasi Overtime</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola konfigurasi overtime."
        />
      </div>
    )
  }

  if (loading || !formData) {
    return <div className="text-center p-lg">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">⚙️ Konfigurasi Overtime</h1>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset Default
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Simpan Konfigurasi
          </button>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success">
          ✅ Konfigurasi berhasil disimpan!
        </div>
      )}

      <div className="config-grid">
        {/* General Settings */}
        <div className="config-card">
          <h2 className="config-title">📋 Pengaturan Umum</h2>
          
          <div className="form-group">
            <label className="checkbox-label large">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
              />
              <span>Aktifkan Sistem Overtime</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rate Default (per jam)</label>
              <div className="input-with-prefix">
                <span className="prefix">Rp</span>
                <input
                  type="number"
                  className="form-input"
                  value={formData.defaultRate}
                  onChange={(e) => handleChange('defaultRate', parseInt(e.target.value) || 0)}
                  disabled={!formData.enabled}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Grace Period (menit)</label>
              <input
                type="number"
                className="form-input"
                value={formData.gracePeriodMinutes}
                onChange={(e) => handleChange('gracePeriodMinutes', parseInt(e.target.value) || 0)}
                disabled={!formData.enabled}
              />
              <span className="form-hint">Waktu tambahan gratis sebelum overtime dihitung</span>
            </div>

            <div className="form-group">
              <label className="form-label">Max Overtime (menit/hari)</label>
              <input
                type="number"
                className="form-input"
                value={formData.maxOvertimeMinutes}
                onChange={(e) => handleChange('maxOvertimeMinutes', parseInt(e.target.value) || 0)}
                disabled={!formData.enabled}
              />
              <span className="form-hint">Batas maksimal overtime per hari (0 = tidak terbatas)</span>
            </div>
          </div>
        </div>

        {/* Package Rates */}
        <div className="config-card">
          <h2 className="config-title">📦 Rate per Package</h2>
          <p className="config-desc">Override rate default untuk setiap package</p>

          <div className="package-rates">
            {packages.map(pkg => (
              <div key={pkg.id} className="package-rate-item">
                <label className="form-label">{pkg.name}</label>
                <div className="input-with-prefix">
                  <span className="prefix">Rp</span>
                  <input
                    type="number"
                    className="form-input"
                    value={packageRates[pkg.id] || formData.defaultRate}
                    onChange={(e) => handlePackageRateChange(pkg.id, e.target.value)}
                    disabled={!formData.enabled}
                  />
                  <span className="suffix">/jam</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rate-preview">
            <h4>📊 Preview Rate</h4>
            {packages.map(pkg => {
              const rate = packageRates[pkg.id] || formData.defaultRate
              return (
                <div key={pkg.id} className="preview-item">
                  <span>{pkg.name}:</span>
                  <span className="preview-rate">{formatCurrency(rate)}/jam</span>
                  <span className="preview-hours">({formatCurrency(rate * 2)}/2 jam)</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weekend Settings */}
        <div className="config-card">
          <h2 className="config-title">📅 Pengaturan Weekend</h2>

          <div className="form-group">
            <label className="checkbox-label large">
              <input
                type="checkbox"
                checked={formData.weekendEnabled}
                onChange={(e) => handleChange('weekendEnabled', e.target.checked)}
                disabled={!formData.enabled}
              />
              <span>Aktifkan Overtime di Weekend</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Weekend Rate Multiplier</label>
            <div className="multiplier-input">
              <input
                type="number"
                className="form-input"
                value={formData.weekendRateMultiplier}
                onChange={(e) => handleChange('weekendRateMultiplier', parseFloat(e.target.value) || 1)}
                step="0.1"
                min="1"
                max="3"
                disabled={!formData.enabled || !formData.weekendEnabled}
              />
              <span className="multiplier-label">x</span>
            </div>
            <span className="form-hint">
              Rate weekend = Rate normal × {formData.weekendRateMultiplier}x
            </span>
          </div>

          {formData.weekendEnabled && (
            <div className="weekend-preview">
              <h4>📊 Preview Weekend Rate</h4>
              {packages.map(pkg => {
                const baseRate = packageRates[pkg.id] || formData.defaultRate
                const weekendRate = baseRate * formData.weekendRateMultiplier
                return (
                  <div key={pkg.id} className="preview-item">
                    <span>{pkg.name}:</span>
                    <span className="preview-rate highlight">{formatCurrency(weekendRate)}/jam</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Branch Rates */}
        <div className="config-card">
          <h2 className="config-title">🏢 Rate per Branch</h2>
          <p className="config-desc">Override rate untuk cabang tertentu (opsional)</p>

          {branches.length === 0 ? (
            <div className="empty-branch">
              <p>Belum ada cabang yang dikonfigurasi</p>
            </div>
          ) : (
            <div className="branch-rates">
              {branches.map(branch => (
                <div key={branch.id} className="branch-rate-item">
                  <label className="form-label">{branch.name}</label>
                  <div className="input-with-prefix">
                    <span className="prefix">Rp</span>
                    <input
                      type="number"
                      className="form-input"
                      value={branchRates[branch.id] || ''}
                      onChange={(e) => handleBranchRateChange(branch.id, e.target.value)}
                      placeholder="Default"
                      disabled={!formData.enabled}
                    />
                    <span className="suffix">/jam</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="branch-note">
            <span>💡 Kosongkan untuk menggunakan rate default/package</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="config-summary">
        <h3>📝 Ringkasan Konfigurasi</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Status:</span>
            <span className={`summary-value ${formData.enabled ? 'active' : 'inactive'}`}>
              {formData.enabled ? '✅ Aktif' : '❌ Nonaktif'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Rate Default:</span>
            <span className="summary-value">{formatCurrency(formData.defaultRate)}/jam</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Grace Period:</span>
            <span className="summary-value">{formData.gracePeriodMinutes} menit</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Max Overtime:</span>
            <span className="summary-value">{formData.maxOvertimeMinutes > 0 ? formatTime(formData.maxOvertimeMinutes) : 'Tidak terbatas'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Weekend:</span>
            <span className="summary-value">{formData.weekendEnabled ? `Aktif (${formData.weekendRateMultiplier}x)` : 'Nonaktif'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Terakhir Update:</span>
            <span className="summary-value">{config?.updatedAt || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuruOvertime
