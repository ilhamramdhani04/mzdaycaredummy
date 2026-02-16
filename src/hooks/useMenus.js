import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_menus'

const DEFAULT_SCHEDULE = {
  monday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  tuesday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  wednesday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  thursday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  friday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  saturday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' },
  sunday: { sarapan: '', makanSiang: '', snackBuah: '', snackSehat: '' }
}

const DEFAULT_MENU = {
  id: '',
  name: '',
  ageGroup: '',
  schedule: { ...DEFAULT_SCHEDULE },
  isDefault: false,
  createdAt: '',
  updatedAt: ''
}

const DEFAULT_MENUS = [
  {
    id: 'menu_1',
    name: 'Menu Baby Mingguan',
    ageGroup: 'Baby',
    schedule: {
      monday: { sarapan: 'Bubur ayam', makanSiang: 'Nasi tim ikan', snackBuah: 'Pisang', snackSehat: 'Biskuit' },
      tuesday: { sarapan: 'Bubur kacang hijau', makanSiang: 'Nasi tim tahu', snackBuah: 'Apel', snackSehat: 'Kue kering' },
      wednesday: { sarapan: 'Bubur santan', makanSiang: 'Nasi tim daging', snackBuah: 'Jeruk', snackSehat: 'Roti' },
      thursday: { sarapan: 'Bubur telur', makanSiang: 'Nasi tim sayuran', snackBuah: 'Pear', snackSehat: 'Cookies' },
      friday: { sarapan: 'Bubur oats', makanSiang: 'Nasi tim ayam', snackBuah: 'Mangga', snackSehat: 'Crackers' },
      saturday: { sarapan: 'Bubur mix', makanSiang: 'Nasi tim ikan', snackBuah: 'Semangka', snackSehat: 'Biskuit' },
      sunday: { sarapan: 'Bubur kari', makanSiang: 'Nasi tim sapi', snackBuah: 'Anggur', snackSehat: 'Pudding' }
    },
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'menu_2',
    name: 'Menu Toddler Mingguan',
    ageGroup: 'Toddler',
    schedule: {
      monday: { sarapan: 'Nasi goreng', makanSiang: 'Nasi + ayam + sayur', snackBuah: 'Pisang', snackSehat: 'Kue ulang tahun' },
      tuesday: { sarapan: 'Lontong', makanSiang: 'Nasi + ikan + kentang', snackBuah: 'Apel', snackSehat: 'Jus' },
      wednesday: { sarapan: 'Mie rebus', makanSiang: 'Nasi + daging + buncis', snackBuah: 'Jeruk', snackSehat: 'Popsicle' },
      thursday: { sarapan: 'Nasi uduk', makanSiang: 'Nasi + telur + tempe', snackBuah: 'Pear', snackSehat: 'Yogurt' },
      friday: { sarapan: 'Bubur putih', makanSiang: 'Nasi + ayam suwir', snackBuah: 'Mangga', snackSehat: 'Puding' },
      saturday: { sarapan: 'Roti tawar + telur', makanSiang: 'Nasi + ikan + bayam', snackBuah: 'Semangka', snackSehat: 'Biscuit' },
      sunday: { sarapan: 'Pancake', makanSiang: 'Nasi + daging + wortel', snackBuah: 'Anggur', snackSehat: 'Kue' }
    },
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'menu_3',
    name: 'Menu Kinder Mingguan',
    ageGroup: 'Kinder',
    schedule: {
      monday: { sarapan: 'Nasi goreng', makanSiang: 'Nasi + ayam + sayur', snackBuah: 'Pisang', snackSehat: 'Kue' },
      tuesday: { sarapan: 'Mie goreng', makanSiang: 'Nasi + ikan + tempe', snackBuah: 'Apel', snackSehat: 'Jus' },
      wednesday: { sarapan: 'Lontong', makanSiang: 'Nasi + daging + buncis', snackBuah: 'Jeruk', snackSehat: 'Cookies' },
      thursday: { sarapan: 'Nasi uduk', makanSiang: 'Nasi + telur + tahu', snackBuah: 'Pear', snackSehat: 'Yogurt' },
      friday: { sarapan: 'Bubur', makanSiang: 'Nasi + ayam panggang', snackBuah: 'Mangga', snackSehat: 'Pudding' },
      saturday: { sarapan: 'Roti + selai', makanSiang: 'Nasi + ikan + wortel', snackBuah: 'Semangka', snackSehat: 'Biscuit' },
      sunday: { sarapan: 'Omelette', makanSiang: 'Nasi + daging + brokoli', snackBuah: 'Anggur', snackSehat: 'Kue' }
    },
    isDefault: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

function useMenus() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMenus()
  }, [])

  const loadMenus = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMenus(JSON.parse(stored))
      } else {
        setMenus(DEFAULT_MENUS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENUS))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveMenus = useCallback((newMenus) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMenus))
      setMenus(newMenus)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return menus
  }, [menus])

  const getById = useCallback((id) => {
    return menus.find(m => m.id === id)
  }, [menus])

  const getByAgeGroup = useCallback((ageGroup) => {
    return menus.filter(m => m.ageGroup === ageGroup)
  }, [menus])

  const create = useCallback((menuData) => {
    const newMenu = {
      ...DEFAULT_MENU,
      ...menuData,
      id: `menu_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    const newMenus = [...menus, newMenu]
    saveMenus(newMenus)
    return newMenu
  }, [menus, saveMenus])

  const update = useCallback((id, menuData) => {
    const newMenus = menus.map(m => 
      m.id === id 
        ? { ...m, ...menuData, updatedAt: new Date().toISOString().split('T')[0] }
        : m
    )
    saveMenus(newMenus)
    return getById(id)
  }, [menus, saveMenus, getById])

  const remove = useCallback((id) => {
    const newMenus = menus.filter(m => m.id !== id)
    saveMenus(newMenus)
  }, [menus, saveMenus])

  const duplicate = useCallback((id) => {
    const menu = getById(id)
    if (!menu) return null
    
    const newMenu = {
      ...menu,
      id: `menu_${Date.now()}`,
      name: `${menu.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    const newMenus = [...menus, newMenu]
    saveMenus(newMenus)
    return newMenu
  }, [menus, saveMenus, getById])

  const ageGroups = ['Baby', 'Toddler', 'Kinder']
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const mealTypes = ['sarapan', 'makanSiang', 'snackBuah', 'snackSehat']

  return {
    menus,
    loading,
    error,
    getAll,
    getById,
    getByAgeGroup,
    create,
    update,
    remove,
    duplicate,
    ageGroups,
    days,
    mealTypes,
    DEFAULT_SCHEDULE
  }
}

export default useMenus
