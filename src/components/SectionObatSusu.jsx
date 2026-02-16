function SectionObatSusu({ data, onChange, isReadOnly }) {
  const tipeSusuOptions = ['ASI', 'UHT', 'Sufor', 'Soya']
  
  const handleSusuChange = (field, value) => {
    onChange({
      ...data,
      susu: {
        ...data.susu,
        [field]: value
      }
    })
  }
  
  const handleObatChange = (index, field, value) => {
    const newObat = [...data.obat]
    newObat[index] = {
      ...newObat[index],
      [field]: value
    }
    onChange({
      ...data,
      obat: newObat
    })
  }
  
  const addObat = () => {
    onChange({
      ...data,
      obat: [
        ...data.obat,
        { namaObat: '', jam: '', diberikan: false }
      ]
    })
  }
  
  const removeObat = (index) => {
    if (data.obat.length === 1) {
      // Don't remove the last one, just clear it
      handleObatChange(0, 'namaObat', '')
      handleObatChange(0, 'jam', '')
      handleObatChange(0, 'diberikan', false)
      return
    }
    
    const newObat = data.obat.filter((_, i) => i !== index)
    onChange({
      ...data,
      obat: newObat
    })
  }
  
  return (
    <div className="section-card">
      <h2 className="section-title">OBAT & SUSU</h2>
      
      <div className="card-row">
        {/* Susu Section */}
        <div className="card">
          <h3 className="card-group-title">🍼 Susu</h3>
          
          <div className="form-group">
            <label className="form-label">Jam</label>
            <input
              type="time"
              className="form-input"
              value={data.susu?.jam || ''}
              onChange={(e) => handleSusuChange('jam', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Volume</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                className="form-input"
                value={data.susu?.volume || ''}
                onChange={(e) => handleSusuChange('volume', e.target.value)}
                disabled={isReadOnly}
                style={{ width: '100px' }}
              />
              <span style={{ color: '#6B5E4A' }}>ml</span>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Tipe</label>
            <select
              className="form-select"
              value={data.susu?.tipe || ''}
              onChange={(e) => handleSusuChange('tipe', e.target.value)}
              disabled={isReadOnly}
            >
              <option value="">Pilih tipe...</option>
              {tipeSusuOptions.map(tipe => (
                <option key={tipe} value={tipe}>{tipe}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Obat Section */}
        <div className="card">
          <h3 className="card-group-title">💊 Obat</h3>
          
          {data.obat.map((obat, index) => (
            <div key={index} style={{ marginBottom: index < data.obat.length - 1 ? '24px' : '0' }}>
              <div className="form-group">
                <label className="form-label">Nama Obat {index + 1}</label>
                <input
                  type="text"
                  className="form-input"
                  value={obat.namaObat || ''}
                  onChange={(e) => handleObatChange(index, 'namaObat', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Nama obat..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Jam</label>
                <input
                  type="time"
                  className="form-input"
                  value={obat.jam || ''}
                  onChange={(e) => handleObatChange(index, 'jam', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Diberikan?</label>
                <div className="pill-group">
                  <button
                    type="button"
                    className={`pill-option ${obat.diberikan === true ? 'active' : ''}`}
                    onClick={() => handleObatChange(index, 'diberikan', true)}
                    disabled={isReadOnly}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    className={`pill-option ${obat.diberikan === false ? 'active' : ''}`}
                    onClick={() => handleObatChange(index, 'diberikan', false)}
                    disabled={isReadOnly}
                  >
                    Tidak
                  </button>
                </div>
              </div>
              
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeObat(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D62828',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}
                >
                  🗑️ Hapus
                </button>
              )}
            </div>
          ))}
          
          {!isReadOnly && (
            <button
              type="button"
              onClick={addObat}
              className="btn btn-primary"
              style={{ marginTop: '16px', width: '100%' }}
            >
              + Tambah Obat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionObatSusu
