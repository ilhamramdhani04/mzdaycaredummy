import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_inventory'
const USAGE_LOG_KEY = 'mz_inventory_usage'

const DEFAULT_ITEM = {
  id: '',
  name: '',
  category: '',
  quantity: 0,
  unit: '',
  minThreshold: 0,
  lastRestocked: '',
  createdAt: ''
}

const DEFAULT_ITEMS = [
  {
    id: 'inv_1',
    name: 'Popok Bayi',
    category: 'hygiene',
    quantity: 100,
    unit: 'pcs',
    minThreshold: 50,
    lastRestocked: '2024-01-15',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_2',
    name: 'Tisu Basah',
    category: 'hygiene',
    quantity: 50,
    unit: 'packs',
    minThreshold: 20,
    lastRestocked: '2024-01-10',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_3',
    name: 'Sabun Bayi',
    category: 'hygiene',
    quantity: 15,
    unit: 'pcs',
    minThreshold: 10,
    lastRestocked: '2024-01-05',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_4',
    name: 'Bedak',
    category: 'hygiene',
    quantity: 8,
    unit: 'pcs',
    minThreshold: 5,
    lastRestocked: '2024-01-08',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_5',
    name: 'Mie Instan',
    category: 'food',
    quantity: 30,
    unit: 'pcs',
    minThreshold: 20,
    lastRestocked: '2024-01-12',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_6',
    name: 'Biskuit',
    category: 'food',
    quantity: 40,
    unit: 'packs',
    minThreshold: 15,
    lastRestocked: '2024-01-14',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_7',
    name: 'Susu UHT',
    category: 'food',
    quantity: 24,
    unit: 'pcs',
    minThreshold: 12,
    lastRestocked: '2024-01-11',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_8',
    name: 'Pisang',
    category: 'food',
    quantity: 5,
    unit: 'kg',
    minThreshold: 3,
    lastRestocked: '2024-01-15',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_9',
    name: 'Paracetamol',
    category: 'medicine',
    quantity: 20,
    unit: 'pcs',
    minThreshold: 10,
    lastRestocked: '2024-01-09',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_10',
    name: 'Kasa Steril',
    category: 'medicine',
    quantity: 15,
    unit: 'rolls',
    minThreshold: 5,
    lastRestocked: '2024-01-07',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_11',
    name: 'Pembersih Lantai',
    category: 'supplies',
    quantity: 5,
    unit: 'liters',
    minThreshold: 2,
    lastRestocked: '2024-01-06',
    createdAt: '2024-01-01'
  },
  {
    id: 'inv_12',
    name: 'Detergen',
    category: 'supplies',
    quantity: 3,
    unit: 'liters',
    minThreshold: 2,
    lastRestocked: '2024-01-04',
    createdAt: '2024-01-01'
  }
]

const CATEGORY_LABELS = {
  food: 'Makanan',
  medicine: 'Obat-obatan',
  hygiene: 'Kesehatan & Kebersihan',
  supplies: 'Perlengkapan'
}

const CATEGORIES = Object.keys(CATEGORY_LABELS)

function useInventory() {
  const [items, setItems] = useState([])
  const [usageLog, setUsageLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      } else {
        setItems(DEFAULT_ITEMS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS))
      }

      const usageStored = localStorage.getItem(USAGE_LOG_KEY)
      if (usageStored) {
        setUsageLog(JSON.parse(usageStored))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveItems = useCallback((newItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
      setItems(newItems)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const saveUsageLog = useCallback((newLog) => {
    try {
      localStorage.setItem(USAGE_LOG_KEY, JSON.stringify(newLog))
      setUsageLog(newLog)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return items
  }, [items])

  const getById = useCallback((id) => {
    return items.find(i => i.id === id)
  }, [items])

  const getByCategory = useCallback((category) => {
    return items.filter(i => i.category === category)
  }, [items])

  const getLowStock = useCallback(() => {
    return items.filter(i => i.quantity <= i.minThreshold)
  }, [items])

  const create = useCallback((itemData) => {
    const newItem = {
      ...DEFAULT_ITEM,
      ...itemData,
      id: `inv_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    const newItems = [...items, newItem]
    saveItems(newItems)
    return newItem
  }, [items, saveItems])

  const update = useCallback((id, itemData) => {
    const newItems = items.map(i => 
      i.id === id 
        ? { ...i, ...itemData }
        : i
    )
    saveItems(newItems)
    return getById(id)
  }, [items, saveItems, getById])

  const remove = useCallback((id) => {
    const newItems = items.filter(i => i.id !== id)
    saveItems(newItems)
  }, [items, saveItems])

  const restock = useCallback((id, quantity) => {
    const item = getById(id)
    if (item) {
      update(id, { 
        quantity: item.quantity + quantity,
        lastRestocked: new Date().toISOString().split('T')[0]
      })
    }
  }, [getById, update])

  const logUsage = useCallback((itemId, quantity, notes = '') => {
    const item = getById(itemId)
    if (!item || item.quantity < quantity) return false

    const newQuantity = item.quantity - quantity
    update(itemId, { quantity: newQuantity })

    const logEntry = {
      id: `usage_${Date.now()}`,
      itemId,
      itemName: item.name,
      quantity,
      previousQuantity: item.quantity,
      newQuantity,
      notes,
      usedAt: new Date().toISOString()
    }
    const newLog = [...usageLog, logEntry]
    saveUsageLog(newLog)
    return true
  }, [getById, update, usageLog, saveUsageLog])

  const getUsageLog = useCallback((itemId = null) => {
    if (itemId) {
      return usageLog.filter(l => l.itemId === itemId)
    }
    return usageLog
  }, [usageLog])

  return {
    items,
    loading,
    error,
    getAll,
    getById,
    getByCategory,
    getLowStock,
    create,
    update,
    remove,
    restock,
    logUsage,
    getUsageLog,
    categories: CATEGORIES,
    CATEGORY_LABELS
  }
}

export default useInventory
