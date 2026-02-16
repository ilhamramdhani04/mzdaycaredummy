function SectionUmum({ data, onChange, isReadOnly }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }
  
  return (
    <div className="section-card">
      <h2 className="section-title">UMUM</h2>
      
      <div className="card-row">
        {/* Left Card */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">Jam Datang</label>
            <input
              type="time"
              className="form-input"
              value={data.jamDatang || ''}
              onChange={(e) => handleChange('jamDatang', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Suhu Tubuh Datang</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={data.suhuDatang || ''}
                onChange={(e) => handleChange('suhuDatang', e.target.value)}
                disabled={isReadOnly}
                style={{ width: '100px' }}
              />
              <span style={{ color: '#6B5E4A' }}>°C</span>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Kondisi Datang</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-option ${data.kondisiDatang === 'sehat' ? 'active' : ''}`}
                onClick={() => handleChange('kondisiDatang', 'sehat')}
                disabled={isReadOnly}
              >
                😊 sehat
              </button>
              <button
                type="button"
                className={`pill-option ${data.kondisiDatang === 'sakit' ? 'active' : ''}`}
                onClick={() => handleChange('kondisiDatang', 'sakit')}
                disabled={isReadOnly}
              >
                🥺 sakit
              </button>
              <button
                type="button"
                className={`pill-option ${data.kondisiDatang === 'lesu' ? 'active' : ''}`}
                onClick={() => handleChange('kondisiDatang', 'lesu')}
                disabled={isReadOnly}
              >
                😢 lesu
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Ada Luka?</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-option ${data.adaLuka === true ? 'active' : ''}`}
                onClick={() => handleChange('adaLuka', true)}
                disabled={isReadOnly}
              >
                Ya
              </button>
              <button
                type="button"
                className={`pill-option ${data.adaLuka === false ? 'active' : ''}`}
                onClick={() => handleChange('adaLuka', false)}
                disabled={isReadOnly}
              >
                Tidak
              </button>
            </div>
          </div>
          
          {data.adaLuka && (
            <div className="form-group">
              <label className="form-label">Upload Foto Luka</label>
              <input
                type="file"
                accept="image/*"
                className="form-input"
                disabled={isReadOnly}
              />
              <p style={{ fontSize: '12px', color: '#6B5E4A', marginTop: '4px' }}>
                (Preview only - no real storage)
              </p>
            </div>
          )}
        </div>
        
        {/* Right Card */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">Tidur Siang</label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-option ${data.tidurSiang === true ? 'active' : ''}`}
                onClick={() => handleChange('tidurSiang', true)}
                disabled={isReadOnly}
              >
                Ya
              </button>
              <button
                type="button"
                className={`pill-option ${data.tidurSiang === false ? 'active' : ''}`}
                onClick={() => handleChange('tidurSiang', false)}
                disabled={isReadOnly}
              >
                Tidak
              </button>
            </div>
          </div>
          
          {data.tidurSiang === true && (
            <>
              <div className="form-group">
                <label className="form-label">Durasi Tidur Siang</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={data.durasiTidur || ''}
                    onChange={(e) => handleChange('durasiTidur', e.target.value)}
                    disabled={isReadOnly}
                    style={{ width: '100px' }}
                  />
                  <span style={{ color: '#6B5E4A' }}>menit</span>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Jam Bangun Tidur</label>
                <input
                  type="time"
                  className="form-input"
                  value={data.jamBangun || ''}
                  onChange={(e) => handleChange('jamBangun', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Suhu Tubuh Bangun Tidur</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={data.suhuBangun || ''}
                    onChange={(e) => handleChange('suhuBangun', e.target.value)}
                    disabled={isReadOnly}
                    style={{ width: '100px' }}
                  />
                  <span style={{ color: '#6B5E4A' }}>°C</span>
                </div>
              </div>
            </>
          )}
          
          {data.tidurSiang === false && (
            <div className="form-group">
              <label className="form-label">Alasan Tidak Tidur</label>
              <textarea
                className="form-textarea"
                value={data.alasanTidakTidur || ''}
                onChange={(e) => handleChange('alasanTidakTidur', e.target.value)}
                disabled={isReadOnly}
                placeholder="Jelaskan alasan tidak tidur..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionUmum
