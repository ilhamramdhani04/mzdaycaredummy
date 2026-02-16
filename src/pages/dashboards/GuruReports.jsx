import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useReports } from '../../hooks/useData.js'
import useMenus from '../../hooks/useMenus.js'
import useTeacherConfig from '../../hooks/useTeacherConfig.js'
import { getAllChildren } from '../../utils/dataHelpers.js'
import dummyData from '../../data/dummyData.json'

const getDayKey = (dateStr) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date(dateStr).getDay()]
}

const mapMenuToMeals = (menuSchedule, dayKey, defaultConsumption = 'All') => {
  const dayMenu = menuSchedule[dayKey] || menuSchedule['monday'] || {}
  
  return [
    { time: '08:00', menu: dayMenu.sarapan || '', consumption: defaultConsumption, type: 'Sarapan' },
    { time: '12:00', menu: dayMenu.makanSiang || '', consumption: defaultConsumption, type: 'Makan Siang' },
    { time: '15:00', menu: dayMenu.snackBuah || '', consumption: defaultConsumption, type: 'Snack Buah' },
    { time: '15:30', menu: dayMenu.snackSehat || '', consumption: defaultConsumption, type: 'Snack Sehat' }
  ].filter(m => m.menu)
}

function GuruReports() {
  const { user, permissions } = useAuth()
  const { success, error } = useToast()
  const { reports, getReports, saveReport, lockReport } = useReports()
  const { menus, getByAgeGroup } = useMenus()
  const { config: teacherConfig, getDefaultsForAgeGroup } = useTeacherConfig()
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedChild, setSelectedChild] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [loading, setLoading] = useState(false)

  const canEdit = permissions.canEditReport

  const branchChildren = useMemo(() => {
    return getAllChildren({ branchId: user?.branchId, status: 'active' })
  }, [user?.branchId])

  const filteredReports = useMemo(() => {
    return getReports({ 
      branchId: user?.branchId,
      date: selectedDate
    })
  }, [getReports, user?.branchId, selectedDate])

  const childrenWithReports = useMemo(() => {
    return branchChildren.map(child => {
      const report = filteredReports.find(r => r.childId === child.id)
      return { ...child, report }
    })
  }, [branchChildren, filteredReports])

  const stats = useMemo(() => ({
    total: branchChildren.length,
    draft: childrenWithReports.filter(c => c.report?.status === 'Draft').length,
    final: childrenWithReports.filter(c => c.report?.status === 'Final').length,
    pending: childrenWithReports.filter(c => !c.report).length
  }), [childrenWithReports, branchChildren.length])

  // Quick Mode & Batch Operations
  const presets = teacherConfig?.presets || {}
  const [quickMode, setQuickMode] = useState(presets.quickModeEnabled !== false)
  const [selectedChildren, setSelectedChildren] = useState([])
  const [quickMood, setQuickMood] = useState(presets.defaultMood || 'Happy')
  const [quickConsumption, setQuickConsumption] = useState(presets.defaultConsumption || 'All')
  const [quickNapQuality, setQuickNapQuality] = useState(presets.defaultNapQuality || 'Good')

  const toggleChildSelection = (childId) => {
    setSelectedChildren(prev => 
      prev.includes(childId) 
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    )
  }

  const selectAllChildren = () => {
    const pendingIds = childrenWithReports
      .filter(c => !c.report || c.report.status !== 'Final')
      .map(c => c.id)
    setSelectedChildren(pendingIds)
  }

  const clearSelection = () => setSelectedChildren([])

  const getDefaultFormData = (child) => {
    const dayKey = getDayKey(selectedDate)
    const ageDefaults = getDefaultsForAgeGroup(child.ageGroup) || presets
    const ageMenus = getByAgeGroup(child.ageGroup)
    const defaultMenu = ageMenus.find(m => m.isDefault) || ageMenus[0]
    const menuMeals = (defaultMenu && presets.autoFillMeals !== false) 
      ? mapMenuToMeals(defaultMenu.schedule, dayKey, quickConsumption)
      : []
    
    const defaultNapStart = presets.defaultNapStart || '13:00'
    const defaultNapEnd = presets.defaultNapEnd || '14:30'
    
    return {
      general: { mood: quickMood, activities: '', notes: '' },
      meals: menuMeals.length > 0 ? menuMeals : [
        { time: '08:00', menu: '', consumption: quickConsumption, type: 'Sarapan' },
        { time: '12:00', menu: '', consumption: quickConsumption, type: 'Makan Siang' },
        { time: '15:00', menu: '', consumption: quickConsumption, type: 'Snack' }
      ],
      nap: (presets.autoFillNap !== false) 
        ? { startTime: defaultNapStart, endTime: defaultNapEnd, quality: quickNapQuality }
        : { startTime: '', endTime: '', quality: '' },
      toilet: []
    }
  }

  const handleQuickFill = () => {
    if (selectedChildren.length === 0) {
      alert('Pilih setidaknya satu anak')
      return
    }
    
    selectedChildren.forEach(childId => {
      const child = childrenWithReports.find(c => c.id === childId)
      if (child && (!child.report || child.report.status !== 'Final')) {
        const defaultData = getDefaultFormData(child)
        saveReport(childId, defaultData, user.id)
      }
    })
    
    success(`Laporan berhasil dibuat untuk ${selectedChildren.length} anak!`)
    setSelectedChildren([])
    setQuickMode(false)
  }

  const handleSaveReport = (childId, data) => {
    try {
      saveReport(childId, data, user.id)
      success('Laporan berhasil disimpan!')
    } catch (err) {
      error('Gagal menyimpan laporan')
    }
  }

  const handleLockReport = (reportId) => {
    lockReport(reportId, user.id)
    success('Laporan berhasil dikunci!')
  }

  const getMoodEmoji = (mood) => {
    const moods = { 'Happy': '😊', 'Calm': '😌', 'Sleepy': '😴', 'Fussy': '😢', 'Energetic': '⚡' }
    return moods[mood] || '😐'
  }

  return (
    <div className="reports-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📝 Laporan Harian</h1>
          <p className="page-subtitle">Buat dan kelola laporan harian anak</p>
        </div>
        <div className="header-date">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value)
              setSelectedChild(null)
              setSelectedReport(null)
            }}
            className="form-input"
          />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Anak</div>
          </div>
        </div>
        <div className="stat-card draft">
          <div className="stat-icon">✏️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.draft}</div>
            <div className="stat-label">Draft</div>
          </div>
        </div>
        <div className="stat-card final">
          <div className="stat-icon">🔒</div>
          <div className="stat-info">
            <div className="stat-value">{stats.final}</div>
            <div className="stat-label">Final</div>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Belum Ada</div>
          </div>
        </div>
      </div>

      {/* Quick Mode Banner */}
      <div className="quick-mode-banner">
        <div className="quick-mode-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={quickMode}
              onChange={(e) => {
                setQuickMode(e.target.checked)
                if (!e.target.checked) setSelectedChildren([])
              }}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">⚡ Quick Report Mode</span>
          </label>
        </div>
        
        {quickMode && (
          <div className="quick-mode-content animate-fade-in">
            <div className="quick-options">
              <div className="quick-option">
                <label>Mood:</label>
                <div className="quick-pills">
                  {['Happy', 'Calm', 'Sleepy', 'Fussy', 'Energetic'].map(mood => (
                    <button
                      key={mood}
                      className={`quick-pill ${quickMood === mood ? 'active' : ''}`}
                      onClick={() => setQuickMood(mood)}
                    >
                      {mood === 'Happy' ? '😊' : mood === 'Calm' ? '😌' : mood === 'Sleepy' ? '😴' : mood === 'Fussy' ? '😢' : '⚡'} {mood}
                    </button>
                  ))}
                </div>
              </div>
              <div className="quick-option">
                <label>Makan:</label>
                <div className="quick-pills">
                  {[
                    { value: 'All', label: '✅ Habis' },
                    { value: 'Most', label: '🔶 Sebagian' },
                    { value: 'Little', label: '🔴 Sedikit' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`quick-pill ${quickConsumption === opt.value ? 'active' : ''}`}
                      onClick={() => setQuickConsumption(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="quick-option">
                <label>Tidur:</label>
                <div className="quick-pills">
                  {[
                    { value: 'Good', label: '😴 Baik' },
                    { value: 'Fair', label: '😐 Cukup' },
                    { value: 'Poor', label: '😫 Kurang' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`quick-pill ${quickNapQuality === opt.value ? 'active' : ''}`}
                      onClick={() => setQuickNapQuality(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="quick-selection">
              <div className="selection-header">
                <span>Pilih Anak ({selectedChildren.length} dipilih):</span>
                <div className="selection-actions">
                  <button className="btn btn-sm btn-secondary" onClick={selectAllChildren}>
                    Pilih Semua ({stats.pending})
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={clearSelection}>
                    Clear
                  </button>
                </div>
              </div>
              <div className="selection-grid">
                {childrenWithReports.map(child => {
                  const hasReport = child.report && child.report.status === 'Final'
                  return (
                    <label 
                      key={child.id} 
                      className={`selection-item ${hasReport ? 'disabled' : ''} ${selectedChildren.includes(child.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChildren.includes(child.id)}
                        onChange={() => !hasReport && toggleChildSelection(child.id)}
                        disabled={hasReport}
                      />
                      <span className="child-name">{child.name}</span>
                      <span className="child-age">{child.ageGroup}</span>
                      {hasReport && <span className="status-final">✓</span>}
                    </label>
                  )
                })}
              </div>
            </div>
            
            <div className="quick-actions">
              <button 
                className="btn btn-success btn-lg"
                onClick={handleQuickFill}
                disabled={selectedChildren.length === 0}
              >
                ⚡ Buat {selectedChildren.length} Laporan Sekaligus
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="reports-container">
        <div className="reports-list">
          <h3 className="section-title">Daftar Anak</h3>
          <div className="children-grid">
            {childrenWithReports.map(child => {
              const report = child.report
              const isFinal = report?.status === 'Final'
              const isDraft = report?.status === 'Draft'
              
              return (
                <div 
                  key={child.id}
                  className={`child-report-card ${selectedChild?.id === child.id ? 'selected' : ''} ${isFinal ? 'final' : isDraft ? 'draft' : 'empty'}`}
                  onClick={() => setSelectedChild(child)}
                >
                  <div className="card-header">
                    <span className="child-avatar">👶</span>
                    <div className="child-info">
                      <div className="child-name">{child.name}</div>
                      <div className="child-age">{child.ageGroup}</div>
                    </div>
                    <div className={`status-badge ${isFinal ? 'final' : isDraft ? 'draft' : 'empty'}`}>
                      {isFinal ? '🔒' : isDraft ? '✏️' : '⏳'}
                    </div>
                  </div>
                  {report && (
                    <div className="card-preview">
                      <span className="mood">{getMoodEmoji(report.general?.mood)}</span>
                      <span className="preview-text">{report.general?.activities?.substring(0, 30)}...</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="report-detail">
          {selectedChild ? (
            <ReportDetail 
              child={selectedChild}
              report={selectedChild.report}
              date={selectedDate}
              canEdit={canEdit}
              onSave={handleSaveReport}
              onLock={handleLockReport}
              getMoodEmoji={getMoodEmoji}
              menus={menus}
              getByAgeGroup={getByAgeGroup}
            />
          ) : (
            <div className="empty-detail">
              <span className="empty-icon">👈</span>
              <p>Pilih anak untuk melihat/buat laporan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReportDetail({ child, report, date, canEdit, onSave, onLock, getMoodEmoji, menus, getByAgeGroup }) {
  const dayKey = getDayKey(date)
  const ageGroupMenus = getByAgeGroup(child.ageGroup)
  const defaultMenu = ageGroupMenus.find(m => m.isDefault) || ageGroupMenus[0]
  
  const [autoFillEnabled, setAutoFillEnabled] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState(defaultMenu?.id || '')
  const [selectedMeals, setSelectedMeals] = useState({
    sarapan: true,
    makanSiang: true,
    snackBuah: true,
    snackSehat: true
  })
  
  const [formData, setFormData] = useState({
    general: {
      mood: report?.general?.mood || 'Happy',
      activities: report?.general?.activities || '',
      notes: report?.general?.notes || ''
    },
    meals: report?.meals || [
      { time: '08:00', menu: '', consumption: 'All', type: 'Sarapan' },
      { time: '12:00', menu: '', consumption: 'All', type: 'Makan Siang' },
      { time: '15:00', menu: '', consumption: 'All', type: 'Snack' }
    ],
    nap: report?.nap || {
      startTime: '13:00',
      endTime: '14:30',
      quality: 'Good'
    },
    toilet: report?.toilet || []
  })
  const [activeSection, setActiveSection] = useState('general')
  const [saving, setSaving] = useState(false)

  const isFinal = report?.status === 'Final'
  const isLocked = isFinal

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    onSave(child.id, formData)
    setSaving(false)
  }

  const handleLock = () => {
    if (report?.id) {
      onLock(report.id)
    }
  }

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const applyMealTemplate = (menuId, mealTypes) => {
    const menu = menus.find(m => m.id === menuId)
    if (!menu) return
    
    const menuMeals = mapMenuToMeals(menu.schedule, dayKey)
    const currentMeals = [...formData.meals]
    
    if (mealTypes.sarapan) {
      const idx = currentMeals.findIndex(m => m.type === 'Sarapan')
      if (idx >= 0 && menuMeals[0]) currentMeals[idx] = { ...currentMeals[idx], ...menuMeals[0] }
      else if (menuMeals[0]) currentMeals.push(menuMeals[0])
    }
    if (mealTypes.makanSiang) {
      const idx = currentMeals.findIndex(m => m.type === 'Makan Siang')
      if (idx >= 0 && menuMeals[1]) currentMeals[idx] = { ...currentMeals[idx], ...menuMeals[1] }
      else if (menuMeals[1]) currentMeals.push(menuMeals[1])
    }
    if (mealTypes.snackBuah) {
      const idx = currentMeals.findIndex(m => m.type === 'Snack Buah')
      if (idx >= 0 && menuMeals[2]) currentMeals[idx] = { ...currentMeals[idx], ...menuMeals[2] }
      else if (menuMeals[2]) currentMeals.push(menuMeals[2])
    }
    if (mealTypes.snackSehat) {
      const idx = currentMeals.findIndex(m => m.type === 'Snack Sehat')
      if (idx >= 0 && menuMeals[3]) currentMeals[idx] = { ...currentMeals[idx], ...menuMeals[3] }
      else if (menuMeals[3]) currentMeals.push(menuMeals[3])
    }
    
    setFormData(prev => ({ ...prev, meals: currentMeals }))
    setAutoFillEnabled(false)
  }

  const applyAllMeals = () => {
    applyMealTemplate(selectedMenuId, {
      sarapan: true,
      makanSiang: true,
      snackBuah: true,
      snackSehat: true
    })
  }

  const handleMealToggle = (mealType) => {
    setSelectedMeals(prev => ({ ...prev, [mealType]: !prev[mealType] }))
  }

  const consumptionOptions = [
    { value: 'All', label: 'Habis' },
    { value: 'Most', label: 'Sebagian' },
    { value: 'Little', label: 'Sedikit' },
    { value: 'None', label: 'Tidak' }
  ]

  const moodOptions = ['Happy', 'Calm', 'Sleepy', 'Fussy', 'Energetic']
  const qualityOptions = ['Good', 'Fair', 'Poor']

  return (
    <div className="report-detail-container">
      <div className="detail-header">
        <h2>Laporan: {child.name}</h2>
        <div className="detail-date">
          {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        {isLocked && (
          <div className="locked-badge">🔒 Laporan Final</div>
        )}
      </div>

      <div className="detail-tabs">
        <button 
          className={`tab-btn ${activeSection === 'general' ? 'active' : ''}`}
          onClick={() => setActiveSection('general')}
        >
          🌟 Umum
        </button>
        <button 
          className={`tab-btn ${activeSection === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveSection('meals')}
        >
          🍽️ Makan
        </button>
        <button 
          className={`tab-btn ${activeSection === 'nap' ? 'active' : ''}`}
          onClick={() => setActiveSection('nap')}
        >
          😴 Tidur
        </button>
        <button 
          className={`tab-btn ${activeSection === 'toilet' ? 'active' : ''}`}
          onClick={() => setActiveSection('toilet')}
        >
          🚽 Toilet
        </button>
      </div>

      <div className="detail-body">
        {activeSection === 'general' && (
          <div className="form-section">
            <div className="form-group">
              <label>Mood Hari Ini</label>
              <div className="mood-pills">
                {moodOptions.map(mood => (
                  <button
                    key={mood}
                    className={`mood-pill ${formData.general.mood === mood ? 'active' : ''}`}
                    onClick={() => updateFormData('general', { ...formData.general, mood })}
                    disabled={isLocked}
                  >
                    {getMoodEmoji(mood)} {mood}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Aktivitas</label>
              <textarea
                className="form-textarea"
                value={formData.general.activities}
                onChange={(e) => updateFormData('general', { ...formData.general, activities: e.target.value })}
                placeholder="Apa yang anak lakukan hari ini?"
                rows={3}
                disabled={isLocked}
              />
            </div>
            <div className="form-group">
              <label>Catatan</label>
              <textarea
                className="form-textarea"
                value={formData.general.notes}
                onChange={(e) => updateFormData('general', { ...formData.general, notes: e.target.value })}
                placeholder="Catatan tambahan dari guru"
                rows={2}
                disabled={isLocked}
              />
            </div>
          </div>
        )}

        {activeSection === 'meals' && (
          <div className="form-section">
            {!isLocked && (
              <div className="auto-fill-section">
                <div className="auto-fill-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={autoFillEnabled}
                      onChange={(e) => setAutoFillEnabled(e.target.checked)}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">�️ Auto-fill dari Menu Template</span>
                  </label>
                </div>
                
                {autoFillEnabled && (
                  <div className="auto-fill-options">
                    <div className="form-group">
                      <label>Pilih Menu:</label>
                      <select
                        className="form-select"
                        value={selectedMenuId}
                        onChange={(e) => setSelectedMenuId(e.target.value)}
                      >
                        <option value="">Pilih menu...</option>
                        {ageGroupMenus.map(menu => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name} {menu.isDefault && '(Default)'}
                          </option>
                        ))}
                      </select>
                      {ageGroupMenus.length === 0 && (
                        <p className="no-menu-warning">
                          ⚠️ Belum ada menu untuk kelompok umur {child.ageGroup}. 
                          Silakan buat menu di halaman Menu Makanan.
                        </p>
                      )}
                    </div>
                    
                    <div className="meal-checklist">
                      <label className="checklist-label">Pilih makanan:</label>
                      <div className="checklist-items">
                        <label className="checklist-item">
                          <input
                            type="checkbox"
                            checked={selectedMeals.sarapan}
                            onChange={() => handleMealToggle('sarapan')}
                          />
                          <span>🍳 Sarapan</span>
                        </label>
                        <label className="checklist-item">
                          <input
                            type="checkbox"
                            checked={selectedMeals.makanSiang}
                            onChange={() => handleMealToggle('makanSiang')}
                          />
                          <span>🍽️ Makan Siang</span>
                        </label>
                        <label className="checklist-item">
                          <input
                            type="checkbox"
                            checked={selectedMeals.snackBuah}
                            onChange={() => handleMealToggle('snackBuah')}
                          />
                          <span>🍎 Snack Buah</span>
                        </label>
                        <label className="checklist-item">
                          <input
                            type="checkbox"
                            checked={selectedMeals.snackSehat}
                            onChange={() => handleMealToggle('snackSehat')}
                          />
                          <span>🥕 Snack Sehat</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="auto-fill-actions">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => applyMealTemplate(selectedMenuId, selectedMeals)}
                        disabled={!selectedMenuId}
                      >
                        ✓ Apply Selected
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={applyAllMeals}
                        disabled={!selectedMenuId}
                      >
                        ✓ Apply All
                      </button>
                    </div>
                    
                    <p className="auto-fill-info">
                      📅 Menu untuk hari ini: <strong>{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</strong>
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {formData.meals.map((meal, idx) => (
              <div key={idx} className="meal-card">
                <div className="meal-header">
                  <span className="meal-type">{meal.type}</span>
                  <input
                    type="time"
                    className="form-input"
                    style={{ width: 'auto' }}
                    value={meal.time}
                    onChange={(e) => {
                      const newMeals = [...formData.meals]
                      newMeals[idx] = { ...meal, time: e.target.value }
                      updateFormData('meals', newMeals)
                    }}
                    disabled={isLocked}
                  />
                </div>
                <input
                  type="text"
                  className="form-input meal-input"
                  value={meal.menu}
                  onChange={(e) => {
                    const newMeals = [...formData.meals]
                    newMeals[idx] = { ...meal, menu: e.target.value }
                    updateFormData('meals', newMeals)
                  }}
                  placeholder="Menu makanan..."
                  disabled={isLocked}
                />
                <div className="consumption-pills">
                  {consumptionOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`consumption-pill ${meal.consumption === opt.value ? 'active' : ''}`}
                      onClick={() => {
                        const newMeals = [...formData.meals]
                        newMeals[idx] = { ...meal, consumption: opt.value }
                        updateFormData('meals', newMeals)
                      }}
                      disabled={isLocked}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'nap' && (
          <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Jam Tidur</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.nap.startTime}
                    onChange={(e) => updateFormData('nap', { ...formData.nap, startTime: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
                <div className="form-group">
                  <label>Jam Bangun</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.nap.endTime}
                    onChange={(e) => updateFormData('nap', { ...formData.nap, endTime: e.target.value })}
                    disabled={isLocked}
                  />
                </div>
              </div>
            <div className="form-group">
              <label>Kualitas Tidur</label>
              <div className="quality-pills">
                {qualityOptions.map(q => (
                  <button
                    key={q}
                    className={`quality-pill ${formData.nap.quality === q ? 'active' : ''}`}
                    onClick={() => updateFormData('nap', { ...formData.nap, quality: q })}
                    disabled={isLocked}
                  >
                    {q === 'Good' ? '😴 Baik' : q === 'Fair' ? '😐 Cukup' : '😫 Kurang'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'toilet' && (
          <div className="form-section">
            <div className="toilet-list">
              {formData.toilet.map((t, idx) => (
                <div key={idx} className="toilet-item">
                  <input type="time" className="form-input" value={t.time} disabled={isLocked} />
                  <select className="form-select" value={t.type} disabled={isLocked}>
                    <option value="Wet">💧 Pipis</option>
                    <option value="Dry">✅ Kering</option>
                    <option value="Poop">💩 Pup</option>
                  </select>
                </div>
              ))}
            </div>
            {!isLocked && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const newToilet = [...formData.toilet, { time: '', type: 'Wet', notes: '' }]
                  updateFormData('toilet', newToilet)
                }}
              >
                + Tambah
              </button>
            )}
          </div>
        )}
      </div>

      <div className="detail-footer">
        {!isLocked && (
          <>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Menyimpan...' : '💾 Simpan Laporan'}
            </button>
            {report?.status === 'Draft' && (
              <button className="btn btn-success" onClick={handleLock}>
                🔒 Kunci Laporan
              </button>
            )}
          </>
        )}
        {isLocked && (
          <div className="locked-info">
            <p>Laporan sudah dikunci dan tidak dapat diedit</p>
            {report?.lockedBy && <p>Dikunci oleh: {report.lockedBy}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default GuruReports
