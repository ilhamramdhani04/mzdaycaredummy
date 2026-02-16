import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useMenus from '../../hooks/useMenus'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'

const MEAL_LABELS = {
  sarapan: 'Sarapan',
  makanSiang: 'Makan Siang',
  snackBuah: 'Snack Buah',
  snackSehat: 'Snack Sehat'
}

const DAY_LABELS = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu'
}

function GuruMenus() {
  const { permissions } = useAuth()
  const { menus, loading, create, update, remove, duplicate, ageGroups, days, mealTypes, DEFAULT_SCHEDULE } = useMenus()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [filterAgeGroup, setFilterAgeGroup] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    schedule: { ...DEFAULT_SCHEDULE }
  })

  const canManage = permissions.canManageMenus

  const filteredMenus = useMemo(() => {
    if (!filterAgeGroup) return menus
    return menus.filter(m => m.ageGroup === filterAgeGroup)
  }, [menus, filterAgeGroup])

  const columns = [
    { 
      key: 'name', 
      label: 'Nama Menu',
      sortable: true,
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          {row.isDefault && <span className="admin-badge default">Default</span>}
        </div>
      )
    },
    { key: 'ageGroup', label: 'Kelompok Umur', sortable: true },
    { 
      key: 'actions', 
      label: 'Aksi',
      sortable: false,
      render: (_, row) => (
        <div className="action-buttons">
          {canManage && (
            <>
              <button className="btn-icon-sm" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>✏️</button>
              <button className="btn-icon-sm" onClick={(e) => { e.stopPropagation(); handleDuplicate(row.id); }}>📋</button>
              <button className="btn-icon-sm danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}>🗑️</button>
            </>
          )}
        </div>
      )
    }
  ]

  const handleAdd = () => {
    setSelectedMenu(null)
    setFormData({
      name: '',
      ageGroup: '',
      schedule: { ...DEFAULT_SCHEDULE }
    })
    setIsModalOpen(true)
  }

  const handleEdit = (menu) => {
    setSelectedMenu(menu)
    setFormData({
      name: menu.name,
      ageGroup: menu.ageGroup,
      schedule: { ...menu.schedule }
    })
    setIsModalOpen(true)
  }

  const handleDuplicate = (id) => {
    duplicate(id)
  }

  const handleDeleteClick = (menu) => {
    setSelectedMenu(menu)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedMenu) {
      remove(selectedMenu.id)
      setSelectedMenu(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.ageGroup) {
      alert('Mohon lengkapi semua field')
      return
    }

    if (selectedMenu) {
      update(selectedMenu.id, formData)
    } else {
      create(formData)
    }
    setIsModalOpen(false)
  }

  const handleScheduleChange = (day, mealType, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [mealType]: value
        }
      }
    }))
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Menu Makanan</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola menu makanan."
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Menu Makanan</h1>
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
            + Tambah Menu
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredMenus.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="Belum Ada Menu"
          message="Belum ada menu makanan. Tambahkan menu pertama Anda."
          actionLabel="Tambah Menu"
          onAction={handleAdd}
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredMenus}
          searchable
          searchPlaceholder="Cari menu..."
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMenu ? 'Edit Menu' : 'Tambah Menu'}
        onSubmit={handleSubmit}
        submitLabel={selectedMenu ? 'Update' : 'Simpan'}
        size="large"
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Menu</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Menu Baby Mingguan"
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

        <div className="schedule-section">
          <h3 className="section-subtitle">Jadwal Menu Mingguan</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Hari</th>
                {mealTypes.map(meal => (
                  <th key={meal}>{MEAL_LABELS[meal]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td><strong>{DAY_LABELS[day]}</strong></td>
                  {mealTypes.map(meal => (
                    <td key={meal}>
                      <input
                        type="text"
                        className="form-input schedule-input"
                        value={formData.schedule[day]?.[meal] || ''}
                        onChange={(e) => handleScheduleChange(day, meal, e.target.value)}
                        placeholder="-"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Menu"
        message={`Apakah Anda yakin ingin menghapus menu "${selectedMenu?.name}"?`}
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruMenus
