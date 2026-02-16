import { useState, useMemo, useRef } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useMedia from '../../hooks/useMedia'
import useMenus from '../../hooks/useMenus'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import dummyData from '../../data/dummyData.json'

function GuruMedia() {
  const { user, permissions } = useAuth()
  const { media, loading, upload, updateCaption, remove, getByChild, getTotalSize } = useMedia()
  const { menus } = useMenus()
  
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditCaptionOpen, setIsEditCaptionOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [filterChild, setFilterChild] = useState('')
  const [filterType, setFilterType] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [editCaption, setEditCaption] = useState('')
  const fileInputRef = useRef(null)

  const canManage = permissions.canManageMedia
  const children = dummyData.children || []

  const filteredMedia = useMemo(() => {
    return media.filter(m => {
      if (filterChild && m.childId !== filterChild) return false
      if (filterType && m.type !== filterType) return false
      return true
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [media, filterChild, filterType])

  const totalSize = getTotalSize()
  const maxSize = 50 * 1024 * 1024 // 50MB

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar. Maksimum 2MB.')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedChildId) {
      alert('Mohon pilih file dan anak')
      return
    }

    try {
      await upload(selectedFile, selectedChildId, uploadCaption, user?.displayName || 'Guru')
      setIsUploadOpen(false)
      setSelectedFile(null)
      setPreviewUrl('')
      setUploadCaption('')
      setSelectedChildId('')
    } catch (err) {
      alert('Gagal upload: ' + err.message)
    }
  }

  const handleEditCaption = (item) => {
    setSelectedMedia(item)
    setEditCaption(item.caption || '')
    setIsEditCaptionOpen(true)
  }

  const handleSaveCaption = () => {
    if (selectedMedia) {
      updateCaption(selectedMedia.id, editCaption)
      setIsEditCaptionOpen(false)
    }
  }

  const handleDeleteClick = (item) => {
    setSelectedMedia(item)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedMedia) {
      remove(selectedMedia.id)
      setSelectedMedia(null)
    }
  }

  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId)
    return child?.name || 'Unknown'
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Foto & Video</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola media."
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">📷 Foto & Video</h1>
        <div className="page-actions">
          <div className="storage-info">
            💾 {Math.round(totalSize / 1024)}KB / {Math.round(maxSize / 1024)}KB
          </div>
          <select 
            className="form-select"
            value={filterChild}
            onChange={(e) => setFilterChild(e.target.value)}
          >
            <option value="">Semua Anak</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          <select 
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Semua Tipe</option>
            <option value="photo">Foto</option>
            <option value="video">Video</option>
          </select>
          <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
            + Upload Media
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          icon="📷"
          title="Belum Ada Media"
          message="Belum ada foto atau video. Upload media pertama Anda."
          actionLabel="Upload Media"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className="media-grid">
          {filteredMedia.map(item => (
            <div key={item.id} className="media-card">
              <div className="media-preview">
                {item.type === 'video' ? (
                  <video src={item.data} controls />
                ) : (
                  <img src={item.data} alt={item.caption} />
                )}
              </div>
              <div className="media-info">
                <div className="media-child">{getChildName(item.childId)}</div>
                <div className="media-caption">{item.caption || '-'}</div>
                <div className="media-meta">
                  📅 {item.date} ⏰ {item.time}
                </div>
              </div>
              <div className="media-actions">
                <button className="btn-icon" onClick={() => handleEditCaption(item)}>✏️</button>
                <button className="btn-icon btn-danger" onClick={() => handleDeleteClick(item)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false)
          setSelectedFile(null)
          setPreviewUrl('')
        }}
        title="Upload Media"
        onSubmit={handleUpload}
        submitLabel="Upload"
        size="medium"
      >
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">📁</span>
              <p>Klik untuk memilih file</p>
              <p className="upload-hint">Maksimum 2MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pilih Anak</label>
          <select
            className="form-select"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            <option value="">Pilih...</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Caption (Opsional)</label>
          <input
            type="text"
            className="form-input"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            placeholder="Contoh: Aisy sedang bermain"
          />
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isEditCaptionOpen}
        onClose={() => setIsEditCaptionOpen(false)}
        title="Edit Caption"
        onSubmit={handleSaveCaption}
        submitLabel="Simpan"
      >
        <div className="form-group">
          <label className="form-label">Caption</label>
          <input
            type="text"
            className="form-input"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Masukkan caption..."
          />
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Media"
        message="Apakah Anda yakin ingin menghapus media ini?"
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruMedia
