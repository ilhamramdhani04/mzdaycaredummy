import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useMedication from '../../hooks/useMedication'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'

function GuruMedication() {
  const { permissions } = useAuth()
  const { medications, loading, create, update, remove, toggleActive, types, TYPE_LABELS } = useMedication()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [filterType, setFilterType] = useState('')
  const [formData, setFormData] = useState({
    type: 'milk',
    name: '',
    brand: '',
    defaultVolume: '',
    dosage: '',
    instructions: '',
    isActive: true
  })

  const canManage = permissions.canManageMedication

  const filteredMedications = useMemo(() => {
    if (!filterType) return medications
    return medications.filter(m => m.type === filterType)
  }, [medications, filterType])

  const columns = [
    { 
      key: 'type', 
      label: 'Tipe',
      render: (value) => (
        <span className={`badge badge-${value}`}>
          {TYPE_LABELS[value]}
        </span>
      )
    },
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'brand', label: 'Merek' },
    { 
      key: 'defaultVolume', 
      label: 'Volume/Dosis',
      render: (value, row) => row.type === 'milk' ? `${value}ml` : row.dosage || '-'
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => value ? '✅ Aktif' : '❌ Nonaktif'
    },
    { 
      key: 'actions', 
      label: 'Aksi',
      render: (_, row) => (
        <div className="action-buttons">
          {canManage && (
            <>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>✏️</button>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleToggle(row); }}>
                {row.isActive ? '⏸️' : '▶️'}
              </button>
              <button className="btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}>🗑️</button>
            </>
          )}
        </div>
      )
    }
  ]

  const handleAdd = (type = 'milk') => {
    setSelectedMedication(null)
    setFormData({
      type,
      name: '',
      brand: '',
      defaultVolume: '',
      dosage: '',
      instructions: '',
      isActive: true
    })
    setIsModalOpen(true)
  }

  const handleEdit = (medication) => {
    setSelectedMedication(medication)
    setFormData({
      type: medication.type,
      name: medication.name,
      brand: medication.brand,
      defaultVolume: medication.defaultVolume,
      dosage: medication.dosage,
      instructions: medication.instructions,
      isActive: medication.isActive
    })
    setIsModalOpen(true)
  }

  const handleToggle = (medication) => {
    toggleActive(medication.id)
  }

  const handleDeleteClick = (medication) => {
    setSelectedMedication(medication)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedMedication) {
      remove(selectedMedication.id)
      setSelectedMedication(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Mohon lengkapi nama')
      return
    }

    if (selectedMedication) {
      update(selectedMedication.id, formData)
    } else {
      create(formData)
    }
    setIsModalOpen(false)
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Obat & Susu</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola obat dan susu."
        />
      </div>
    )
  }

  const milkCount = medications.filter(m => m.type === 'milk').length
  const medCount = medications.filter(m => m.type === 'medication').length

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Obat & Susu</h1>
        <div className="page-actions">
          <select 
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Semua Tipe</option>
            {types.map(t => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <button className="btn btn-milk" onClick={() => handleAdd('milk')}>
            + Tambah Susu
          </button>
          <button className="btn btn-med" onClick={() => handleAdd('medication')}>
            + Tambah Obat
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card" onClick={() => setFilterType('milk')}>
          <div className="stat-icon">🍼</div>
          <div className="stat-info">
            <div className="stat-value">{milkCount}</div>
            <div className="stat-label">Jenis Susu</div>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilterType('medication')}>
          <div className="stat-icon">💊</div>
          <div className="stat-info">
            <div className="stat-value">{medCount}</div>
            <div className="stat-label">Jenis Obat</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredMedications.length === 0 ? (
        <EmptyState
          icon="💊"
          title="Belum Ada Data"
          message="Belum ada obat atau susu. Tambahkan data pertama Anda."
          actionLabel="Tambah Susu"
          onAction={() => handleAdd('milk')}
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredMedications}
          searchable
          searchPlaceholder="Cari obat atau susu..."
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMedication ? `Edit ${TYPE_LABELS[formData.type]}` : `Tambah ${TYPE_LABELS[formData.type]}`}
        onSubmit={handleSubmit}
        submitLabel={selectedMedication ? 'Update' : 'Simpan'}
      >
        <div className="form-group">
          <label className="form-label">Tipe</label>
          <select
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            disabled={!!selectedMedication}
          >
            {types.map(t => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.type === 'milk' ? 'Contoh: ASI, Sufor, UHT' : 'Contoh: Paracetamol'}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Merek</label>
            <input
              type="text"
              className="form-input"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="Contoh: Morinaga, Panadol"
            />
          </div>
        </div>

        {formData.type === 'milk' ? (
          <div className="form-group">
            <label className="form-label">Volume Default (ml)</label>
            <input
              type="text"
              className="form-input"
              value={formData.defaultVolume}
              onChange={(e) => setFormData({ ...formData, defaultVolume: e.target.value })}
              placeholder="Contoh: 120"
            />
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Dosis</label>
            <input
              type="text"
              className="form-input"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="Contoh: 5ml, 1 tablet"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Instruksi</label>
          <textarea
            className="form-textarea"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Petunjuk penggunaan..."
            rows={2}
          />
        </div>

        {selectedMedication && (
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Aktif
            </label>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Data"
        message={`Apakah Anda yakin ingin menghapus "${selectedMedication?.name}"?`}
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruMedication
