import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import useInventory from '../../hooks/useInventory'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'

function GuruInventory() {
  const { permissions } = useAuth()
  const { items, loading, create, update, remove, restock, logUsage, getLowStock, categories, CATEGORY_LABELS } = useInventory()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [restockQuantity, setRestockQuantity] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minThreshold: 0
  })

  const canManage = permissions.canManageInventory

  const filteredItems = useMemo(() => {
    let result = items
    if (filterCategory) result = result.filter(i => i.category === filterCategory)
    if (showLowStock) result = result.filter(i => i.quantity <= i.minThreshold)
    return result
  }, [items, filterCategory, showLowStock])

  const lowStockCount = getLowStock().length

  const columns = [
    { 
      key: 'name', 
      label: 'Nama Item',
      sortable: true,
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          {row.quantity <= row.minThreshold && <span className="badge badge-warning">Low Stock</span>}
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Kategori',
      render: (value) => CATEGORY_LABELS[value] || value
    },
    { 
      key: 'quantity', 
      label: 'Stok',
      sortable: true,
      render: (value, row) => (
        <span className={value <= row.minThreshold ? 'text-danger' : 'text-success'}>
          {value} {row.unit}
        </span>
      )
    },
    { key: 'minThreshold', label: 'Min Stok' },
    { 
      key: 'lastRestocked', 
      label: 'Terakhir Restock',
      render: (value) => value || '-'
    },
    { 
      key: 'actions', 
      label: 'Aksi',
      render: (_, row) => (
        <div className="action-buttons">
          {canManage && (
            <>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleRestockClick(row); }}>📥</button>
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>✏️</button>
              <button className="btn-icon btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteClick(row); }}>🗑️</button>
            </>
          )}
        </div>
      )
    }
  ]

  const handleAdd = () => {
    setSelectedItem(null)
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minThreshold: 0
    })
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minThreshold: item.minThreshold
    })
    setIsModalOpen(true)
  }

  const handleRestockClick = (item) => {
    setSelectedItem(item)
    setRestockQuantity(10)
    setIsRestockOpen(true)
  }

  const handleRestock = () => {
    if (selectedItem && restockQuantity > 0) {
      restock(selectedItem.id, parseInt(restockQuantity))
      setIsRestockOpen(false)
    }
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (selectedItem) {
      remove(selectedItem.id)
      setSelectedItem(null)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.unit) {
      alert('Mohon lengkapi semua field')
      return
    }

    if (selectedItem) {
      update(selectedItem.id, formData)
    } else {
      create(formData)
    }
    setIsModalOpen(false)
  }

  if (!canManage) {
    return (
      <div className="admin-page">
        <h1 className="page-title">Inventaris</h1>
        <EmptyState
          icon="🔒"
          title="Akses Ditolak"
          message="Anda tidak memiliki akses untuk mengelola inventaris."
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Inventaris</h1>
        <div className="page-actions">
          <button 
            className={`btn ${showLowStock ? 'btn-warning' : 'btn-secondary'}`}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            ⚠️ Low Stock ({lowStockCount})
          </button>
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
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Item
          </button>
        </div>
      </div>

      <div className="stats-row">
        {categories.map(cat => {
          const count = items.filter(i => i.category === cat).length
          const lowCount = items.filter(i => i.category === cat && i.quantity <= i.minThreshold).length
          return (
            <div 
              key={cat} 
              className={`stat-card ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            >
              <div className="stat-info">
                <div className="stat-value">{count}</div>
                <div className="stat-label">{CATEGORY_LABELS[cat]}</div>
                {lowCount > 0 && <span className="badge badge-warning">{lowCount} low</span>}
              </div>
            </div>
          )
        })}
      </div>

      {loading ? (
        <div className="text-center p-lg">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Belum Ada Item"
          message="Belum ada item inventaris. Tambahkan item pertama Anda."
          actionLabel="Tambah Item"
          onAction={handleAdd}
        />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredItems}
          searchable
          searchPlaceholder="Cari item..."
        />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Tambah Item'}
        onSubmit={handleSubmit}
        submitLabel={selectedItem ? 'Update' : 'Simpan'}
      >
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nama Item</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Popok Bayi"
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

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Jumlah</label>
            <input
              type="number"
              className="form-input"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <input
              type="text"
              className="form-input"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="pcs, kg, liter"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Threshold (Batas Minimal)</label>
          <input
            type="number"
            className="form-input"
            value={formData.minThreshold}
            onChange={(e) => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 0 })}
            placeholder="Akan muncul warning jika stok di bawah ini"
          />
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        title={`Restock: ${selectedItem?.name}`}
        onSubmit={handleRestock}
        submitLabel="Restock"
      >
        <div className="restock-info">
          <p>Stok saat ini: <strong>{selectedItem?.quantity} {selectedItem?.unit}</strong></p>
          <div className="form-group">
            <label className="form-label">Jumlah Tambahan</label>
            <input
              type="number"
              className="form-input"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
              min={1}
            />
          </div>
          <p>Total setelah restock: <strong>{(selectedItem?.quantity || 0) + restockQuantity} {selectedItem?.unit}</strong></p>
        </div>
      </AdminModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Item"
        message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"?`}
        confirmLabel="Hapus"
        type="danger"
      />

    </div>
  )
}

export default GuruInventory
