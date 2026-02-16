import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useStimulasi from '../../hooks/useStimulasi'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'

function GuruStimulasi() {
  const { permissions } = useAuth()
  const { activities, loading, create, update, remove, ageGroups, categories, CATEGORY_LABELS, ASSESSMENT_CRITERIA } = useStimulasi()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filterAgeGroup, setFilterAgeGroup] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ageGroup: '',
    description: '',
    assessmentCriteria: []
  })

  const canManage = permissions.canManageStimulasi

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      if (filterAgeGroup && a.ageGroup !== filterAgeGroup) return false
      if (filterCategory && a.category !== filterCategory) return false
      return true
    })
  }, [activities, filterAgeGroup, filterCategory])

  const columns = [
    { key: 'name', label: 'Nama Aktivitas', sortable: true },
    { 
      key: 'category', 
      label: 'Kategori',
      render: (value) => CATEGORY_LABELS[value] || value
    },
    { key: 'ageGroup', label: 'Kelompok Umur' },
    { 
      key: 'description', 
      label: 'Deskripsi',
      render: (value) => value?.substring(0, 50) + (value?.length > 50 ? '...' : '')
    },
    { 
      key: 'actions', 
      label: 'Aksi',
      render: (_, row) => (
        <div className="action-buttons">
          {canManage && (
            <>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>✏️</button>
              <button className="btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}>🗑️</button>
            </>
          )}
        </div>
      )
    }
  ]

  const handleAdd = () => {
    setSelectedActivity(null)
    setFormData({
      name: '',
      category: '',
      ageGroup: '',
      description: '',
      assessmentCriteria: []
    })
    setIsModalOpen(true)
  }

  const handleEdit = (activity) => {
    setSelectedActivity(activity)
    setFormData({
      name: activity.name,
      category: activity.category,
      ageGroup: activity.ageGroup,
      description: activity.description,
      assessmentCriteria: activity.assessmentCriteria || []
    })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (activity) => {
    setSelectedActivity(activity)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedActivity) {
      remove(selectedActivity.id)
      setSelectedActivity(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.ageGroup) {
      alert('Mohon lengkapi semua field')
      return
    }

    if (selectedActivity) {
      update(selectedActivity.id, formData)
    } else {
      create(formData)
    }
    setIsModalOpen(false)
  }

  const handleCriteriaChange = (criteria) => {
    setFormData(prev => {
      const current = prev.assessmentCriteria || []
      if (current.includes(criteria)) {
        return { ...prev, assessmentCriteria: current.filter(c => c !== criteria) }
      }
      return { ...prev, assessmentCriteria: [...current, criteria] }
    })
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Stimulasi</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola aktivitas stimulasi."
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Aktivitas Stimulasi</h1>
        <div className="page-actions">
          <select 
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
          <select 
            className="form-select"
            value={filterAgeGroup}
            onChange={(e) => setFilterAgeGroup(e.target.value)}
          >
            <option value="">Semua Umur</option>
            {ageGroups.map(ag => (
              <option key={ag} value={ag}>{ag}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Aktivitas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredActivities.length === 0 ? (
        <EmptyState
          icon="🎨"
          title="Belum Ada Aktivitas"
          message="Belum ada aktivitas stimulasi. Tambahkan aktivitas pertama Anda."
          actionLabel="Tambah Aktivitas"
          onAction={handleAdd}
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredActivities}
          searchable
          searchPlaceholder="Cari aktivitas..."
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedActivity ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
        onSubmit={handleSubmit}
        submitLabel={selectedActivity ? 'Update' : 'Simpan'}
        size="medium"
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Aktivitas</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Main Bola"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Pilih...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Kelompok Umur</label>
          <select
            className="form-select"
            value={formData.ageGroup}
            onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
          >
            <option value="">Pilih...</option>
            {ageGroups.map(ag => (
              <option key={ag} value={ag}>{ag}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Jelaskan aktivitas stimulasi..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Kriteria Penilaian</label>
          <div className="criteria-checkboxes">
            {ASSESSMENT_CRITERIA.map(crit => (
              <label key={crit.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.assessmentCriteria?.includes(crit.value)}
                  onChange={() => handleCriteriaChange(crit.value)}
                />
                {crit.label}
              </label>
            ))}
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Aktivitas"
        message={`Apakah Anda yakin ingin menghapus aktivitas "${selectedActivity?.name}"?`}
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruStimulasi
