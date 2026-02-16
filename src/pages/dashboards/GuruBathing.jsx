import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useBathing from '../../hooks/useBathing'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'

function GuruBathing() {
  const { permissions } = useAuth()
  const { schedules, loading, create, update, remove, ageGroups } = useBathing()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [filterAgeGroup, setFilterAgeGroup] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    schedule: {
      mandiPagi: '07:00',
      mandiSore: '16:00',
      toiletTraining: false
    }
  })

  const canManage = permissions.canManageBathing

  const filteredSchedules = filterAgeGroup 
    ? schedules.filter(s => s.ageGroup === filterAgeGroup)
    : schedules

  const columns = [
    { key: 'name', label: 'Nama Jadwal', sortable: true },
    { 
      key: 'ageGroup', 
      label: 'Kelompok Umur', 
      sortable: true,
      render: (value) => <span className="badge badge-age">{value}</span>
    },
    { 
      key: 'mandiPagi', 
      label: 'Mandi Pagi',
      render: (_, row) => row.schedule?.mandiPagi || '-'
    },
    { 
      key: 'mandiSore', 
      label: 'Mandi Sore',
      render: (_, row) => row.schedule?.mandiSore || '-'
    },
    { 
      key: 'toiletTraining', 
      label: 'Toilet Training',
      render: (value) => value ? '✅ Ya' : '❌ Tidak'
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
    setSelectedSchedule(null)
    setFormData({
      name: '',
      ageGroup: '',
      schedule: {
        mandiPagi: '07:00',
        mandiSore: '16:00',
        toiletTraining: false
      }
    })
    setIsModalOpen(true)
  }

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule)
    setFormData({
      name: schedule.name,
      ageGroup: schedule.ageGroup,
      schedule: { ...schedule.schedule }
    })
    setIsModalOpen(true)
  }

  const handleDeleteClick = (schedule) => {
    setSelectedSchedule(schedule)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedSchedule) {
      remove(selectedSchedule.id)
      setSelectedSchedule(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.ageGroup) {
      alert('Mohon lengkapi semua field')
      return
    }

    if (selectedSchedule) {
      update(selectedSchedule.id, formData)
    } else {
      create(formData)
    }
    setIsModalOpen(false)
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Jadwal Mandi</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola jadwal mandi."
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Jadwal Mandi</h1>
        <div className="page-actions">
          <select 
            className="form-select"
            value={filterAgeGroup}
            onChange={(e) => setFilterAgeGroup(e.target.value)}
          >
            <option value="">Semua Kelompok Umur</option>
            {ageGroups.map(ag => (
              <option key={ag} value={ag}>{ag}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Jadwal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          icon="🛁"
          title="Belum Ada Jadwal"
          message="Belum ada jadwal mandi. Tambahkan jadwal pertama Anda."
          actionLabel="Tambah Jadwal"
          onAction={handleAdd}
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredSchedules}
          searchable
          searchPlaceholder="Cari jadwal..."
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSchedule ? 'Edit Jadwal Mandi' : 'Tambah Jadwal Mandi'}
        onSubmit={handleSubmit}
        submitLabel={selectedSchedule ? 'Update' : 'Simpan'}
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Jadwal</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Jadwal Mandi Baby"
            />
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
        </div>

        <div className="schedule-times">
          <h3 className="section-subtitle">Jam Mandi</h3>
          <div className="time-inputs">
            <div className="form-group">
              <label className="form-label">Mandi Pagi</label>
              <input
                type="time"
                className="form-input"
                value={formData.schedule.mandiPagi}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, mandiPagi: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mandi Sore</label>
              <input
                type="time"
                className="form-input"
                value={formData.schedule.mandiSore}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, mandiSore: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label checkbox-label">
            <input
              type="checkbox"
              checked={formData.schedule.toiletTraining}
              onChange={(e) => setFormData({
                ...formData,
                schedule: { ...formData.schedule, toiletTraining: e.target.checked }
              })}
            />
            Aktifkan Toilet Training
          </label>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Jadwal"
        message={`Apakah Anda yakin ingin menghapus jadwal "${selectedSchedule?.name}"?`}
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruBathing
