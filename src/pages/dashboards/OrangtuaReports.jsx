import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useReports } from '../../hooks/useData.js'
import dummyData from '../../data/dummyData.json'

function OrangtuaReports() {
  const { user } = useAuth()
  const { reports, getReports } = useReports()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const parentId = user?.id
    if (!parentId) return

    const parentChildren = dummyData.children.filter(c => c.parentId === parentId)
    setChildren(parentChildren)
    
    if (parentChildren.length > 0) {
      setSelectedChild(parentChildren[0])
    }
    
    setLoading(false)
  }, [user?.id, reports])

  const childReports = useMemo(() => {
    if (!selectedChild) return []
    return getReports({ childId: selectedChild.id })
  }, [getReports, selectedChild, reports])

  const getMoodEmoji = (mood) => {
    const moods = { 'Happy': '😊', 'Calm': '😌', 'Sleepy': '😴', 'Fussy': '😢', 'Energetic': '⚡' }
    return moods[mood] || '😐'
  }

  if (loading) {
    return (
      <div className="orangtua-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat laporan perkembangan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="orangtua-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📝 Perkembangan Anak</h1>
          <p className="page-subtitle">
            Lihat laporan harian lengkap tentang aktivitas, mood, dan perkembangan anak
          </p>
        </div>
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
                  setSelectedReport(null)
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
        <div className="reports-content">
          <div className="reports-grid">
            {childReports.length > 0 ? (
              childReports.map((report) => (
                <div
                  key={report.id}
                  className={`report-card ${selectedReport?.id === report.id ? 'selected' : ''} ${report.status === 'Final' ? 'final' : 'draft'}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="report-card-header">
                    <div className="report-date">
                      <div className="date-day">
                        {new Date(report.date).getDate()}
                      </div>
                      <div className="date-month">
                        {new Date(report.date).toLocaleString('id-ID', { month: 'short' })}
                      </div>
                    </div>
                    <div className="report-status">
                      {report.status === 'Final' ? (
                        <span className="status-final">🔒 Final</span>
                      ) : (
                        <span className="status-draft">📝 Draft</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="report-preview">
                    <div className="preview-mood">
                      <span className="mood-emoji">{getMoodEmoji(report.general?.mood)}</span>
                      <span className="mood-text">{report.general?.mood || 'Baik'}</span>
                    </div>
                    <p className="preview-activities">
                      {report.general?.activities?.substring(0, 60)}...
                    </p>
                    {report.nap && (
                      <div className="preview-nap">
                        😴 {report.nap.startTime || '--:--'} - {report.nap.endTime || '--:--'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-reports">
                <span className="empty-icon">📝</span>
                <p>Belum ada laporan untuk {selectedChild.name}</p>
                <p className="empty-subtitle">Laporan akan muncul setelah guru membuatnya</p>
              </div>
            )}
          </div>

          {selectedReport && (
            <div className="report-detail-card animate-fade-in">
              <div className="detail-header">
                <h2 className="detail-title">
                  Laporan {new Date(selectedReport.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="detail-body">
                <div className="detail-section">
                  <h3 className="section-title">🌟 Informasi Umum</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Mood Hari Ini</span>
                      <span className="info-value mood">
                        {getMoodEmoji(selectedReport.general?.mood)} {selectedReport.general?.mood}
                      </span>
                    </div>
                    <div className="info-item full-width">
                      <span className="info-label">Aktivitas</span>
                      <p className="info-text">{selectedReport.general?.activities || '-'}</p>
                    </div>
                    <div className="info-item full-width">
                      <span className="info-label">Catatan Guru</span>
                      <p className="info-text">{selectedReport.general?.notes || '-'}</p>
                    </div>
                  </div>
                </div>

                {selectedReport.meals && selectedReport.meals.length > 0 && (
                  <div className="detail-section">
                    <h3 className="section-title">🍽️ Makanan</h3>
                    <div className="meals-list">
                      {selectedReport.meals.map((meal, idx) => (
                        <div key={idx} className="meal-item">
                          <span className="meal-time">{meal.time}</span>
                          <span className="meal-type">{meal.type}</span>
                          <span className={`meal-consumption ${meal.consumption?.toLowerCase()}`}>
                            {meal.consumption === 'All' ? 'Habis' : 
                             meal.consumption === 'Most' ? 'Sebagian' : 
                             meal.consumption === 'Little' ? 'Sedikit' : 'Tidak'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.nap && (
                  <div className="detail-section">
                    <h3 className="section-title">😴 Tidur Siang</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Waktu</span>
                        <span className="info-value">
                          {selectedReport.nap.startTime || '--:--'} - {selectedReport.nap.endTime || '--:--'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Kualitas</span>
                        <span className={`info-value quality ${selectedReport.nap.quality?.toLowerCase()}`}>
                          {selectedReport.nap.quality || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.toilet && selectedReport.toilet.length > 0 && (
                  <div className="detail-section">
                    <h3 className="section-title">🚽 Toilet</h3>
                    <div className="toilet-list">
                      {selectedReport.toilet.map((t, idx) => (
                        <div key={idx} className="toilet-item">
                          <span className="toilet-time">{t.time}</span>
                          <span className={`toilet-type ${t.type?.toLowerCase()}`}>
                            {t.type === 'Wet' ? '💧 Pipis' : t.type === 'Dry' ? '✅ Kering' : '💩 Pup'}
                          </span>
                          <span className="toilet-notes">{t.notes || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-footer">
                  <p>
                    Dibuat oleh: <strong>{selectedReport.createdBy || 'Guru'}</strong>
                  </p>
                  <p>
                    Status: <strong>{selectedReport.status}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="reassuring-footer">
            <p>
              💙 Laporan ini dibuat dengan penuh cinta dan perhatian oleh guru untuk 
              memantau perkembangan anak Anda setiap hari.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrangtuaReports
