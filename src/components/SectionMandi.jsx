function SectionMandi({ data, onChange, isReadOnly }) {
  const alasanOptions = [
    { value: 'pulang_lebih_awal', label: 'pulang lebih awal' },
    { value: 'mandi_di_rumah', label: 'mandi di rumah' },
    { value: 'kurang_sehat', label: 'kurang sehat' },
    { value: 'lainnya', label: 'lainnya' }
  ]
  
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }
  
  return (
    <div className="section-card">
      <h2 className="section-title">MANDI & TOILET</h2>
      
      <div className="card-row">
        <div className="card">
          <h3 className="card-group-title">🛁 Mandi</h3>
          
          <div className="form-group">
            <label className="form-label">Mandi Pagi</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-option ${data.mandiPagi === true ? 'active' : ''}`}
                onClick={() => handleChange('mandiPagi', true)}
                disabled={isReadOnly}
              >
                Ya
              </button>
              <button
                type="button"
                className={`pill-option ${data.mandiPagi === false ? 'active' : ''}`}
                onClick={() => handleChange('mandiPagi', false)}
                disabled={isReadOnly}
              >
                Tidak
              </button>
            </div>
          </div>
          
          {data.mandiPagi === false && (
            <div className="form-group">
              <label className="form-label">Alasan</label>
              <select
                className="form-select"
                value={data.alasanTidakMandiPagi || ''}
                onChange={(e) => handleChange('alasanTidakMandiPagi', e.target.value)}
                disabled={isReadOnly}
              >
                <option value="">Pilih alasan...</option>
                {alasanOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Mandi Sore</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-option ${data.mandiSore === true ? 'active' : ''}`}
                onClick={() => handleChange('mandiSore', true)}
                disabled={isReadOnly}
              >
                Ya
              </button>
              <button
                type="button"
                className={`pill-option ${data.mandiSore === false ? 'active' : ''}`}
                onClick={() => handleChange('mandiSore', false)}
                disabled={isReadOnly}
              >
                Tidak
              </button>
            </div>
          </div>
          
          {data.mandiSore === false && (
            <div className="form-group">
              <label className="form-label">Alasan</label>
              <select
                className="form-select"
                value={data.alasanTidakMandiSore || ''}
                onChange={(e) => handleChange('alasanTidakMandiSore', e.target.value)}
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
        
        <div className="card">
          <h3 className="card-group-title">🚽 Toilet / Popok</h3>
          
          <div className="form-group">
            <label className="form-label">BAB Pertama</label>
            <input
              type="time"
              className="form-input"
              value={data.poop1 || ''}
              onChange={(e) => handleChange('poop1', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">BAB Kedua</label>
            <input
              type="time"
              className="form-input"
              value={data.poop2 || ''}
              onChange={(e) => handleChange('poop2', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionMandi
