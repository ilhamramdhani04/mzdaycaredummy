function SectionStimulasi({ data, onChange, isReadOnly }) {
  const programOptions = [
    'Nursery - Baby',
    'Nursery - Pre Toddler',
    'Toddler',
    'Kinder'
  ]
  
  const penilaianOptions = [
    { value: 'BB', label: 'BB (Below Basic)' },
    { value: 'MB', label: 'MB (Meeting Basic)' },
    { value: 'BSH', label: 'BSH (Satisfactory)' },
    { value: 'BSB', label: 'BSB (Excellent)' }
  ]
  
  const alasanOptions = [
    { value: 'tidur', label: 'Tidur' },
    { value: 'adaptasi', label: 'Masih beradaptasi' },
    { value: 'sakit', label: 'Sakit' },
    { value: 'menolak', label: 'Menolak' },
    { value: 'lainnya', label: 'Lainnya' }
  ]
  
  const activities = [
    { key: 'grossMotor', label: '🏃 Gross Motor Skill', icon: '🏃' },
    { key: 'fineMotor', label: '✂️ Fine Motor Skill', icon: '✂️' }
  ]
  
  const handleActivityChange = (activity, field, value) => {
    onChange({
      ...data,
      [activity]: {
        ...data[activity],
        [field]: value
      }
    })
  }
  
  return (
    <div className="section-card">
      <h2 className="section-title">STIMULASI</h2>
      
      {activities.map(activity => (
        <div key={activity.key} className="meal-section">
          <h3 className="meal-title">{activity.label}</h3>
          
          <div className="card">
            <div className="card-row">
              <div>
                <div className="form-group">
                  <label className="form-label">Ikut?</label>
                  <div className="pill-group">
                    <button
                      type="button"
                      className={`pill-option ${data[activity.key]?.ikut === true ? 'active' : ''}`}
                      onClick={() => handleActivityChange(activity.key, 'ikut', true)}
                      disabled={isReadOnly}
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${data[activity.key]?.ikut === false ? 'active' : ''}`}
                      onClick={() => handleActivityChange(activity.key, 'ikut', false)}
                      disabled={isReadOnly}
                    >
                      Tidak
                    </button>
                  </div>
                </div>
                
                {data[activity.key]?.ikut === false && (
                  <div className="form-group">
                    <label className="form-label">Alasan Tidak Ikut</label>
                    <select
                      className="form-select"
                      value={data[activity.key]?.alasanTidakIkut || ''}
                      onChange={(e) => handleActivityChange(activity.key, 'alasanTidakIkut', e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option value="">Pilih alasan...</option>
                      {alasanOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {data[activity.key]?.ikut === true && (
                <>
                  <div>
                    <div className="form-group">
                      <label className="form-label">Kegiatan</label>
                      <input
                        type="text"
                        className="form-input"
                        value={data[activity.key]?.kegiatan || ''}
                        onChange={(e) => handleActivityChange(activity.key, 'kegiatan', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Apa kegiatannya?"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Program</label>
                      <select
                        className="form-select"
                        value={data[activity.key]?.program || ''}
                        onChange={(e) => handleActivityChange(activity.key, 'program', e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="">Pilih program...</option>
                        {programOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Penilaian</label>
                      <select
                        className="form-select"
                        value={data[activity.key]?.penilaian || ''}
                        onChange={(e) => handleActivityChange(activity.key, 'penilaian', e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="">Pilih penilaian...</option>
                        {penilaianOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SectionStimulasi
