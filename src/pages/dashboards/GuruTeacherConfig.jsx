import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import useTeacherConfig from '../../hooks/useTeacherConfig'

function GuruTeacherConfig() {
  const { user, permissions } = useAuth()
  const { success, error } = useToast()
  const { config, updatePresets, updateAgeGroupDefaults, addTemplate, removeTemplate, resetToDefault } = useTeacherConfig()
  
  const [activeTab, setActiveTab] = useState('presets')
  const [presets, setPresets] = useState({})
  const [ageGroupForm, setAgeGroupForm] = useState({})
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', data: {} })
  const [saved, setSaved] = useState(false)

  const canManage = permissions.canManageMenus

  useEffect(() => {
    if (config) {
      setPresets(config.presets || {})
      setAgeGroupForm({
        Baby: config.ageGroupDefaults?.Baby || {},
        Toddler: config.ageGroupDefaults?.Toddler || {},
        Kinder: config.ageGroupDefaults?.Kinder || {}
      })
    }
  }, [config])

  const handleSavePresets = () => {
    updatePresets(presets)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSaveAgeGroup = (ageGroup) => {
    updateAgeGroupDefaults(ageGroup, ageGroupForm[ageGroup])
    success(`Konfigurasi ${ageGroup} disimpan!`)
  }

  const handleAddTemplate = () => {
    if (!newTemplate.name) {
      alert('Mohon isi nama template')
      return
    }
    addTemplate({
      ...newTemplate,
      data: {
        general: { mood: presets.defaultMood, activities: '', notes: '' },
        meals: [],
        nap: { startTime: presets.defaultNapStart, endTime: presets.defaultNapEnd, quality: presets.defaultNapQuality },
        toilet: []
      }
    })
    setNewTemplate({ name: '', description: '', data: {} })
    success('Template berhasil ditambahkan!')
  }

  const handleReset = () => {
    if (confirm('Reset semua konfigurasi ke default?')) {
      resetToDefault()
    }
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">🔧 Konfigurasi Guru</h1>
        <div className="empty-state">
          <span>🔒</span>
          <p>Anda tidak memiliki akses untuk mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return <div className="text-center p-lg">Loading...</div>
  }

  return (
    <div className="admin-page animate-fade-in">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">🔧 Konfigurasi Guru</h1>
          <p className="page-subtitle">Konfigurasi default dan pengaturan untuk guru</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset Default
          </button>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success">
          ✅ Konfigurasi berhasil disimpan!
        </div>
      )}

      <div className="config-tabs">
        <button 
          className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          ⚙️ Default Presets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ageGroup' ? 'active' : ''}`}
          onClick={() => setActiveTab('ageGroup')}
        >
          👶 Age Group
        </button>
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'options' ? 'active' : ''}`}
          onClick={() => setActiveTab('options')}
        >
          ✅ Opsi Tersedia
        </button>
      </div>

      <div className="config-content">
        {activeTab === 'presets' && (
          <div className="config-section">
            <h3>Pengaturan Default</h3>
            <p className="section-desc">Nilai default yang akan digunakan guru</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Mood Default</label>
                <select
                  className="form-select"
                  value={presets.defaultMood}
                  onChange={(e) => setPresets({ ...presets, defaultMood: e.target.value })}
                >
                  <option value="Happy">😊 Happy</option>
                  <option value="Calm">😌 Calm</option>
                  <option value="Sleepy">😴 Sleepy</option>
                  <option value="Fussy">😢 Fussy</option>
                  <option value="Energetic">⚡ Energetic</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Konsumsi Makanan Default</label>
                <select
                  className="form-select"
                  value={presets.defaultConsumption}
                  onChange={(e) => setPresets({ ...presets, defaultConsumption: e.target.value })}
                >
                  <option value="All">✅ Habis</option>
                  <option value="Most">🔶 Sebagian</option>
                  <option value="Little">🔴 Sedikit</option>
                  <option value="None">❌ Tidak</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Kualitas Tidur Default</label>
                <select
                  className="form-select"
                  value={presets.defaultNapQuality}
                  onChange={(e) => setPresets({ ...presets, defaultNapQuality: e.target.value })}
                >
                  <option value="Good">😴 Baik</option>
                  <option value="Fair">😐 Cukup</option>
                  <option value="Poor">😫 Kurang</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Jam Tidur Default</label>
                <input
                  type="time"
                  className="form-input"
                  value={presets.defaultNapStart}
                  onChange={(e) => setPresets({ ...presets, defaultNapStart: e.target.value })}
                />
              </div>
            </div>

            <h4>Pengaturan Auto-fill</h4>
            <div className="toggle-list">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={presets.autoFillMeals}
                  onChange={(e) => setPresets({ ...presets, autoFillMeals: e.target.checked })}
                />
                <span>Auto-fill makanan dari menu</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={presets.autoFillNap}
                  onChange={(e) => setPresets({ ...presets, autoFillNap: e.target.checked })}
                />
                <span>Auto-fill jadwal tidur</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={presets.quickModeEnabled}
                  onChange={(e) => setPresets({ ...presets, quickModeEnabled: e.target.checked })}
                />
                <span>Aktifkan Quick Report Mode</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={presets.batchModeEnabled}
                  onChange={(e) => setPresets({ ...presets, batchModeEnabled: e.target.checked })}
                />
                <span>Aktifkan Batch Mode</span>
              </label>
            </div>

            <button className="btn btn-primary" onClick={handleSavePresets}>
              💾 Simpan Presets
            </button>
          </div>
        )}

        {activeTab === 'ageGroup' && (
          <div className="config-section">
            <h3>Konfigurasi per Kelompok Umur</h3>
            <p className="section-desc">Pengaturan khusus untuk setiap kelompok umur</p>
            
            {['Baby', 'Toddler', 'Kinder'].map(ageGroup => (
              <div key={ageGroup} className="age-group-card">
                <h4>👶 {ageGroup}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Mood Default</label>
                    <select
                      className="form-select"
                      value={ageGroupForm[ageGroup]?.defaultMood || presets.defaultMood}
                      onChange={(e) => setAgeGroupForm({
                        ...ageGroupForm,
                        [ageGroup]: { ...ageGroupForm[ageGroup], defaultMood: e.target.value }
                      })}
                    >
                      {config.allowedOptions?.moods?.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Konsumsi Default</label>
                    <select
                      className="form-select"
                      value={ageGroupForm[ageGroup]?.defaultConsumption || presets.defaultConsumption}
                      onChange={(e) => setAgeGroupForm({
                        ...ageGroupForm,
                        [ageGroup]: { ...ageGroupForm[ageGroup], defaultConsumption: e.target.value }
                      })}
                    >
                      {config.allowedOptions?.consumptions?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={ageGroupForm[ageGroup]?.napRequired !== false}
                        onChange={(e) => setAgeGroupForm({
                          ...ageGroupForm,
                          [ageGroup]: { ...ageGroupForm[ageGroup], napRequired: e.target.checked }
                        })}
                      />
                      Tidur Wajib
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={ageGroupForm[ageGroup]?.mealsRequired !== false}
                        onChange={(e) => setAgeGroupForm({
                          ...ageGroupForm,
                          [ageGroup]: { ...ageGroupForm[ageGroup], mealsRequired: e.target.checked }
                        })}
                      />
                      Makan Wajib
                    </label>
                  </div>
                </div>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleSaveAgeGroup(ageGroup)}
                >
                  Simpan {ageGroup}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="config-section">
            <h3>Quick Templates</h3>
            <p className="section-desc">Template laporan siap pakai untuk guru</p>
            
            <div className="templates-grid">
              {config.templates?.map(template => (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h4>{template.name}</h4>
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => removeTemplate(template.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p>{template.description}</p>
                  <div className="template-preview">
                    <span>Mood: {template.data?.general?.mood}</span>
                    <span>Tidur: {template.data?.nap?.quality}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-template-form">
              <h4>Tambah Template Baru</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nama Template</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Contoh: Laporan Sakit"
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Deskripsi singkat"
                  />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleAddTemplate}>
                + Tambah Template
              </button>
            </div>
          </div>
        )}

        {activeTab === 'options' && (
          <div className="config-section">
            <h3>Opsi yang Tersedia untuk Guru</h3>
            <p className="section-desc">Pilih opsi mana saja yang dapat dipilih guru</p>
            
            <div className="options-group">
              <h4>Mood Options</h4>
              <div className="options-list">
                {['Happy', 'Calm', 'Sleepy', 'Fussy', 'Energetic'].map(mood => (
                  <label key={mood} className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>{mood}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="options-group">
              <h4>Consumption Options</h4>
              <div className="options-list">
                {['All', 'Most', 'Little', 'None'].map(c => (
                  <label key={c} className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-page { padding: 20px; max-width: 1000px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .page-title { font-size: 24px; font-weight: 600; color: #2B1D0E; margin: 0; }
        .page-subtitle { color: #6B5E4A; margin: 4px 0 0; }
        
        .config-tabs { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #E5D4C0; padding-bottom: 12px; flex-wrap: wrap; }
        .tab-btn { padding: 10px 20px; border: none; background: none; color: #6B5E4A; cursor: pointer; font-size: 14px; border-radius: 8px; font-weight: 500; }
        .tab-btn.active { background: #F4B400; color: #2B1D0E; }
        
        .config-section { background: white; border-radius: 12px; padding: 24px; border: 1px solid #E5D4C0; }
        .config-section h3 { margin: 0 0 8px; color: #2B1D0E; }
        .config-section h4 { margin: 20px 0 12px; color: #2B1D0E; }
        .section-desc { color: #6B5E4A; font-size: 14px; margin: 0 0 20px; }
        
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-weight: 500; color: #2B1D0E; font-size: 14px; }
        .form-input, .form-select { padding: 10px 12px; border: 1px solid #E5D4C0; border-radius: 8px; font-size: 14px; }
        
        .toggle-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .toggle-item { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 10px; background: #F9F6F2; border-radius: 8px; }
        .toggle-item input { width: 18px; height: 18px; }
        
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .checkbox-label input { width: 18px; height: 18px; }
        
        .age-group-card { background: #F9F6F2; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
        .age-group-card h4 { margin-top: 0; }
        
        .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .template-card { background: #F9F6F2; border-radius: 10px; padding: 16px; border: 1px solid #E5D4C0; }
        .template-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .template-header h4 { margin: 0; }
        .template-card p { font-size: 13px; color: #6B5E4A; margin: 0 0 12px; }
        .template-preview { display: flex; gap: 12px; font-size: 12px; color: #6B5E4A; }
        
        .add-template-form { background: #F9F6F2; border-radius: 12px; padding: 20px; }
        
        .options-group { margin-bottom: 20px; }
        .options-group h4 { margin-bottom: 12px; }
        .options-list { display: flex; flex-wrap: wrap; gap: 12px; }
        
        .btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
        .btn-primary { background: #F4B400; color: #2B1D0E; }
        .btn-secondary { background: #E5D4C0; color: #2B1D0E; }
        .btn-sm { padding: 8px 16px; font-size: 13px; }
        .btn-icon { padding: 6px 10px; border: 1px solid #E5D4C0; border-radius: 6px; background: white; cursor: pointer; }
        .btn-icon.btn-danger { border-color: #D62828; }
        
        .alert { padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; }
        .alert-success { background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; }
        
        .loading { text-align: center; padding: 40px; color: #6B5E4A; }
        .empty-state { text-align: center; padding: 40px; color: #6B5E4A; }
      `}</style>
    </div>
  )
}

export default GuruTeacherConfig
