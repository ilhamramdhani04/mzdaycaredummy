import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useReports } from '../../hooks/useData.js'
import { getAllChildren } from '../../utils/dataHelpers.js'
import dummyData from '../../data/dummyData.json'

function SuperadminReports() {
  const { user, permissions } = useAuth()
  const { success, error } = useToast()
  const { reports, getReports, lockReport } = useReports()
  
  const [selectedBranch, setSelectedBranch] = useState(user?.branchId || 'all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const canLock = permissions.canLockReports

  const branches = dummyData.branches || []
  const allChildren = getAllChildren({ status: 'active' })

  const filteredReports = useMemo(() => {
    return getReports({ 
      branchId: selectedBranch !== 'all' ? selectedBranch : null,
      date: selectedDate
    })
  }, [getReports, selectedBranch, selectedDate])

  const childrenWithReports = useMemo(() => {
    return allChildren.map(child => {
      const report = filteredReports.find(r => r.childId === child.id)
      const branch = branches.find(b => b.id === child.branchId)
      return { ...child, branchName: branch?.name, report }
    }).filter(child => selectedBranch === 'all' || child.branchId === selectedBranch)
  }, [allChildren, filteredReports, selectedBranch, branches])

  const stats = useMemo(() => ({
    total: childrenWithReports.length,
    draft: childrenWithReports.filter(c => c.report?.status === 'Draft').length,
    final: childrenWithReports.filter(c => c.report?.status === 'Final').length,
    pending: childrenWithReports.filter(c => !c.report).length
  }), [childrenWithReports])

  const handleLock = (reportId) => {
    lockReport(reportId, user.id)
    success('Laporan berhasil dikunci!')
  }

  const getMoodEmoji = (mood) => {
    const moods = { 'Happy': '😊', 'Calm': '😌', 'Sleepy': '😴', 'Fussy': '😢', 'Energetic': '⚡' }
    return moods[mood] || '😐'
  }

  return (
    <div className="superadmin-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📝 Review & Kunci Laporan</h1>
          <p className="page-subtitle">Review dan kunci laporan harian dari guru</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Tanggal:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Cabang:</label>
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">Semua Cabang</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Anak</div>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">✏️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.draft}</div>
            <div className="stat-label">Draft</div>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <div className="stat-value">{stats.final}</div>
            <div className="stat-label">Final</div>
          </div>
        </div>
        <div className="stat-card gray">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Belum Ada</div>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {childrenWithReports.length > 0 ? (
          childrenWithReports.map((child) => {
            const report = child.report
            const isFinal = report?.status === 'Final'
            
            return (
              <div 
                key={child.id}
                className={`report-card ${isFinal ? 'locked' : report ? 'draft' : 'empty'}`}
                onClick={() => report && setSelectedReport({ ...child, report })}
              >
                <div className="report-card-header">
                  <div className="child-info">
                    <span className="child-avatar">👶</span>
                    <div>
                      <div className="child-name">{child.name}</div>
                      <div className="child-meta">{child.branchName} • {child.ageGroup}</div>
                    </div>
                  </div>
                  <div className={`status-badge ${isFinal ? 'final' : report ? 'draft' : 'empty'}`}>
                    {isFinal ? '🔒 Final' : report ? '✏️ Draft' : '⏳ Belum'}
                  </div>
                </div>
                
                {report && (
                  <div className="report-preview">
                    <div className="preview-mood">
                      <span className="mood-emoji">{getMoodEmoji(report.general?.mood)}</span>
                      <span className="mood-text">{report.general?.mood || 'Baik'}</span>
                    </div>
                    <p className="preview-activities">
                      {report.general?.activities?.substring(0, 50)}...
                    </p>
                    {report.nap && (
                      <div className="preview-nap">
                        😴 {report.nap.startTime || '--:--'} - {report.nap.endTime || '--:--'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="empty-reports">
            <span className="empty-icon">📝</span>
            <p>Belum ada laporan untuk tanggal ini</p>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Laporan {selectedReport.name}</h3>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>🌟 Informasi Umum</h4>
                <p><strong>Mood:</strong> {getMoodEmoji(selectedReport.report.general?.mood)} {selectedReport.report.general?.mood}</p>
                <p><strong>Aktivitas:</strong> {selectedReport.report.general?.activities || '-'}</p>
                <p><strong>Catatan:</strong> {selectedReport.report.general?.notes || '-'}</p>
              </div>
              
              {selectedReport.report.meals && selectedReport.report.meals.length > 0 && (
                <div className="detail-section">
                  <h4>🍽️ Makan</h4>
                  {selectedReport.report.meals.map((meal, idx) => (
                    <p key={idx}>{meal.time} - {meal.type}: {meal.menu} ({meal.consumption})</p>
                  ))}
                </div>
              )}
              
              {selectedReport.report.nap && (
                <div className="detail-section">
                  <h4>😴 Tidur Siang</h4>
                  <p><strong>Waktu:</strong> {selectedReport.report.nap.startTime} - {selectedReport.report.nap.endTime}</p>
                  <p><strong>Kualitas:</strong> {selectedReport.report.nap.quality}</p>
                </div>
              )}
              
              {selectedReport.report.toilet && selectedReport.report.toilet.length > 0 && (
                <div className="detail-section">
                  <h4>🚽 Toilet</h4>
                  {selectedReport.report.toilet.map((t, idx) => (
                    <p key={idx}>{t.time} - {t.type}</p>
                  ))}
                </div>
              )}
              
              <div className="detail-section">
                <h4>Status</h4>
                <p><strong>Status:</strong> {selectedReport.report.status}</p>
                {selectedReport.report.lockedBy && (
                  <p><strong>Dikunci oleh:</strong> {selectedReport.report.lockedBy}</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>
                Tutup
              </button>
              {canLock && selectedReport.report.status !== 'Final' && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleLock(selectedReport.report.id)}
                >
                  🔒 Kunci Laporan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .superadmin-page { padding: 20px; }
        .page-header { margin-bottom: 20px; }
        .page-title { font-size: 24px; font-weight: 600; color: #2B1D0E; margin: 0; }
        .page-subtitle { color: #6B5E4A; margin: 4px 0 0; }
        
        .filter-bar { display: flex; gap: 16px; margin-bottom: 20px; }
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-group label { font-size: 14px; color: #6B5E4A; }
        .filter-group input, .filter-group select { padding: 8px 12px; border: 1px solid #E5D4C0; border-radius: 8px; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: white; border-radius: 12px; border: 1px solid #E5D4C0; }
        .stat-card.blue { border-color: #1976D2; background: #E3F2FD; }
        .stat-card.orange { border-color: #F4B400; background: #FFFBF0; }
        .stat-card.green { border-color: #2E7D32; background: #F1F8E9; }
        .stat-card.gray { border-color: #6B5E4A; background: #F5F0E8; }
        .stat-icon { font-size: 24px; }
        .stat-value { font-size: 24px; font-weight: 600; color: #2B1D0E; }
        .stat-label { font-size: 12px; color: #6B5E4A; }
        
        .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .report-card { padding: 16px; background: white; border-radius: 12px; border: 2px solid #E5D4C0; cursor: pointer; transition: all 0.2s; }
        .report-card:hover { border-color: #F4B400; }
        .report-card.locked { border-color: #2E7D32; }
        
        .report-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .child-info { display: flex; gap: 10px; align-items: center; }
        .child-avatar { font-size: 32px; }
        .child-name { font-weight: 600; color: #2B1D0E; }
        .child-meta { font-size: 12px; color: #6B5E4A; }
        .status-badge { font-size: 12px; padding: 4px 10px; border-radius: 12px; }
        .status-badge.final { background: #2E7D32; color: white; }
        .status-badge.draft { background: #F4B400; color: #2B1D0E; }
        .status-badge.empty { background: #E5D4C0; color: #6B5E4A; }
        
        .report-preview { padding-top: 12px; border-top: 1px solid #E5D4C0; }
        .preview-mood { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .mood-emoji { font-size: 20px; }
        .preview-activities { font-size: 13px; color: #6B5E4A; margin: 0; }
        .preview-nap { font-size: 12px; color: #6B5E4A; margin-top: 8px; }
        
        .empty-reports { grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #6B5E4A; }
        .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 16px; max-width: 600px; width: 90%; max-height: 80vh; overflow: auto; }
        .modal-content.large { max-width: 700px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #E5D4C0; }
        .modal-header h3 { margin: 0; color: #2B1D0E; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #6B5E4A; }
        .modal-body { padding: 20px; }
        .detail-section { margin-bottom: 20px; }
        .detail-section h4 { margin: 0 0 12px; color: #2B1D0E; }
        .detail-section p { margin: 4px 0; color: #6B5E4A; font-size: 14px; }
        .modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 20px; border-top: 1px solid #E5D4C0; }
        .btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
        .btn-secondary { background: #E5D4C0; color: #2B1D0E; }
        .btn-success { background: #2E7D32; color: white; }
      `}</style>
    </div>
  )
}

export default SuperadminReports
