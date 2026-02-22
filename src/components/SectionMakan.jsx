function SectionMakan({ data, onChange, isReadOnly }) {
  const meals = ['sarapan', 'makanSiang', 'snackBuah', 'snackSehat']
  const mealLabels = {
    sarapan: '🍳 Sarapan',
    makanSiang: '🍽️ Makan Siang',
    snackBuah: '🍎 Snack Buah',
    snackSehat: '🥕 Snack Sehat'
  }
  
  const handleMealChange = (meal, field, value) => {
    onChange({
      ...data,
      [meal]: {
        ...data[meal],
        [field]: value
      }
    })
  }
  
  return (
    <div className="section-card">
      <h2 className="section-title">MAKAN</h2>
      
      {meals.map(meal => (
        <div key={meal} className="meal-section">
          <h3 className="meal-title">{mealLabels[meal]}</h3>
          
          <div className="card">
            <div className="card-row">
              <div>
                <div className="form-group">
                  <label className="form-label">Ikut?</label>
                  <div className="pill-group">
                    <button
                      type="button"
                      className={`pill-option ${data[meal]?.ikut === true ? 'active' : ''}`}
                      onClick={() => handleMealChange(meal, 'ikut', true)}
                      disabled={isReadOnly}
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${data[meal]?.ikut === false ? 'active' : ''}`}
                      onClick={() => handleMealChange(meal, 'ikut', false)}
                      disabled={isReadOnly}
                    >
                      Tidak
                    </button>
                  </div>
                </div>
                
                {data[meal]?.ikut === false && (
                  <div className="form-group">
                    <label className="form-label">Alasan Tidak Ikut</label>
                    <textarea
                      className="form-textarea"
                      value={data[meal]?.alasanTidakIkut || ''}
                      onChange={(e) => handleMealChange(meal, 'alasanTidakIkut', e.target.value)}
                      disabled={isReadOnly}
                      placeholder="Jelaskan alasan..."
                    />
                  </div>
                )}
              </div>
              
              {data[meal]?.ikut === true && (
                <>
                  <div>
                    <div className="form-group">
                      <label className="form-label">Menu</label>
                      <input
                        type="text"
                        className="form-input"
                        value={data[meal]?.menu || ''}
                        onChange={(e) => handleMealChange(meal, 'menu', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Apa yang dimakan?"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Habis?</label>
                      <div className="pill-group">
                        <button
                          type="button"
                          className={`pill-option ${data[meal]?.habis === true ? 'active' : ''}`}
                          onClick={() => handleMealChange(meal, 'habis', true)}
                          disabled={isReadOnly}
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          className={`pill-option ${data[meal]?.habis === false ? 'active' : ''}`}
                          onClick={() => handleMealChange(meal, 'habis', false)}
                          disabled={isReadOnly}
                        >
                          Tidak
                        </button>
                      </div>
                    </div>
                    
                    {data[meal]?.habis === false && (
                      <div className="form-group">
                        <label className="form-label">Alasan Tidak Habis</label>
                        <textarea
                          className="form-textarea"
                          value={data[meal]?.alasanTidakHabis || ''}
                          onChange={(e) => handleMealChange(meal, 'alasanTidakHabis', e.target.value)}
                          disabled={isReadOnly}
                          placeholder="Jelaskan alasan..."
                        />
                      </div>
                    )}
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
          
export default SectionMakan
