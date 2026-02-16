import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import childrenData from '../data/children.json'
import SectionUmum from '../components/SectionUmum'
import SectionMakan from '../components/SectionMakan'
import SectionMandi from '../components/SectionMandi'
import SectionStimulasi from '../components/SectionStimulasi'
import SectionObatSusu from '../components/SectionObatSusu'
import { useAuth } from '../context/AuthContext.jsx'

function Report({ activeTab }) {
  const { childId } = useParams()
  const navigate = useNavigate()
  const { user, permissions } = useAuth()
  const [child, setChild] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Find child
    const childData = childrenData.find(c => c.id === parseInt(childId))
    if (!childData) {
      navigate('/dashboard')
      return
    }
    
    // Check permission for Orangtua
    if (!permissions.canViewAllChildren && childData.parentId !== user.id) {
      navigate('/dashboard')
      return
    }
    
    setChild(childData)
    
    // Load existing report or create new one
    const reports = JSON.parse(localStorage.getItem('mz_reports') || '[]')
    const today = new Date().toISOString().split('T')[0]
    const existingReport = reports.find(r => r.childId === parseInt(childId) && r.date === today)
    
    if (existingReport) {
      setReport(existingReport)
    } else {
      // Create new empty report
      const newReport = {
        id: `${childId}-${today}`,
        childId: parseInt(childId),
        date: today,
        sections: {
          umum: {
            jamDatang: '',
            suhuDatang: '',
            kondisiDatang: '',
            adaLuka: false,
            tidurSiang: '',
            durasiTidur: '',
            jamBangun: '',
            suhuBangun: '',
            alasanTidakTidur: ''
          },
          makan: {
            sarapan: { ikut: '', menu: '', habis: '', alasanTidakIkut: '', alasanTidakHabis: '' },
            makanSiang: { ikut: '', menu: '', habis: '', alasanTidakIkut: '', alasanTidakHabis: '' },
            snackBuah: { ikut: '', menu: '', habis: '', alasanTidakIkut: '', alasanTidakHabis: '' },
            snackSehat: {ikut: '', menu: '', habis: '', alasanTidakIkut: '', alasanTidakHabis: '' }
          },
          mandi: {
            mandiPagi: '',
            mandiSore: '',
            alasanTidakMandiPagi: '',
            alasanTidakMandiSore: '',
            poop1: '',
            poop2: ''
          },
          stimulasi: {
            grossMotor: { ikut: '', kegiatan: '', program: '', penilaian: '', alasanTidakIkut: '' },
            fineMotor: {ikut: '', kegiatan: '', program: '', penilaian: '', alasanTidakIkut: '' }
          },
          obatSusu: {
            susu: { jam: '', volume: '', tipe: '' },
            obat: [{ namaObat: '', jam: '', diberikan: false }]
          }
        }
      }
      setReport(newReport)
    }
    
    setLoading(false)
  }, [childId, user, permissions, navigate])
  
  const handleSave = () => {
    // Permission check - only guru can save
    if (!permissions.canEditReport) {
      alert("You do not have permission to save reports.")
      return
    }
    
    const reports = JSON.parse(localStorage.getItem('mz_reports') || '[]')
    const existingIndex = reports.findIndex(r => r.id === report.id)
    
    if (existingIndex >= 0) {
      reports[existingIndex] = report
    } else {
      reports.push(report)
    }
    
    localStorage.setItem('mz_reports', JSON.stringify(reports))
    alert('Report saved successfully!')
    navigate('/dashboard')
  }
  
  const handleUpdateReport = (section, data) => {
    // Permission check - only guru can edit
    if (!permissions.canEditReport) {
      return
    }
    
    setReport(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: data
      }
    }))
  }
  
  if (loading || !child || !report) {
    return <div className="empty-state">Loading...</div>
  }
  
  // Use permission check instead of role check
  const isReadOnly = !permissions.canEditReport
  
  return (
    <div>
      <div className="report-header">
        <h1 className="report-title">Daily Report - {child.name}</h1>
        <p className="report-meta">Date: {report.date} | Age Group: {child.ageGroup}</p>
        
        {/* Role indicator */}
        <div style={{ marginTop: '12px' }}>
          {!permissions.canEditReport && (
            <span style={{
              background: '#D62828',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              🔒 Read Only
            </span>
          )}
          {permissions.canEditReport && (
            <span style={{
              background: '#F4B400',
              color: '#2B1D0E',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✏️ Edit Mode
            </span>
          )}
        </div>
      </div>
      
      {activeTab === 'umum' && (
        <SectionUmum 
          data={report.sections.umum} 
          onChange={(data) => handleUpdateReport('umum', data)}
          isReadOnly={isReadOnly}
        />
      )}
      
      {activeTab === 'makan' && (
        <SectionMakan 
          data={report.sections.makan} 
          onChange={(data) => handleUpdateReport('makan', data)}
          isReadOnly={isReadOnly}
        />
      )}
      
      {activeTab === 'mandi' && (
        <SectionMandi 
          data={report.sections.mandi} 
          onChange={(data) => handleUpdateReport('mandi', data)}
          isReadOnly={isReadOnly}
        />
      )}
      
      {activeTab === 'stimulasi' && (
        <SectionStimulasi 
          data={report.sections.stimulasi} 
          onChange={(data) => handleUpdateReport('stimulasi', data)}
          isReadOnly={isReadOnly}
        />
      )}
      
      {activeTab === 'obatSusu' && (
        <SectionObatSusu 
          data={report.sections.obatSusu} 
          onChange={(data) => handleUpdateReport('obatSusu', data)}
          isReadOnly={isReadOnly}
        />
      )}
      
      {isReadOnly && (
        <div className="card mt-32">
          <p className="text-center" style={{ color: '#6B5E4A' }}>
            🔒 This report is read-only. Only teachers (guru) can edit reports.
          </p>
        </div>
      )}
      
      {!isReadOnly && (
        <button className="btn btn-save" onClick={handleSave}>
          Simpan Laporan
        </button>
      )}
    </div>
  )
}

export default Report
