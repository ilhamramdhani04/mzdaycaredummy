import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_medication'

const DEFAULT_MEDICATION = {
  id: '',
  type: 'milk', // milk | medication
  name: '',
  brand: '',
  defaultVolume: '',
  dosage: '',
  instructions: '',
  isActive: true,
  createdAt: ''
}

const DEFAULT_MEDICATIONS = [
  {
    id: 'med_1',
    type: 'milk',
    name: 'ASI',
    brand: '-',
    defaultVolume: '',
    dosage: '',
    instructions: 'Sesuai kebutuhan bayi',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_2',
    type: 'milk',
    name: 'UHT Milk',
    brand: 'Ultra Milk',
    defaultVolume: '120ml',
    dosage: '',
    instructions: 'Berikan dalam keadaan segar',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_3',
    type: 'milk',
    name: 'Sufor',
    brand: 'Morinaga',
    defaultVolume: '120ml',
    dosage: '',
    instructions: 'Campur dengan air hangat 40°C',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_4',
    type: 'milk',
    name: 'Sufor',
    brand: 'SGM',
    defaultVolume: '120ml',
    dosage: '',
    instructions: 'Campur dengan air hangat',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_5',
    type: 'milk',
    name: 'Soya Milk',
    brand: 'Soya',
    defaultVolume: '120ml',
    dosage: '',
    instructions: 'Untuk bayi dengan intolerance laktosa',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_6',
    type: 'medication',
    name: 'Paracetamol',
    brand: 'Panadol',
    defaultVolume: '',
    dosage: '5ml',
    instructions: 'Diberikan saat demam > 38°C',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_7',
    type: 'medication',
    name: 'Amoxicillin',
    brand: 'Amoxsan',
    defaultVolume: '',
    dosage: '3x sehari',
    instructions: 'Diberikan sesuai resep dokter',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_8',
    type: 'medication',
    name: 'OBH Combi',
    brand: 'OBH',
    defaultVolume: '',
    dosage: '5ml',
    instructions: 'Diberikan saat batuk',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'med_9',
    type: 'medication',
    name: 'Vitamin',
    brand: 'Curcuma',
    defaultVolume: '',
    dosage: '1 sachet',
    instructions: 'Diberikan setelah makan',
    isActive: true,
    createdAt: '2024-01-01'
  }
]

const TYPE_LABELS = {
  milk: 'Susu',
  medication: 'Obat'
}

function useMedication() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMedications()
  }, [])

  const loadMedications = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMedications(JSON.parse(stored))
      } else {
        setMedications(DEFAULT_MEDICATIONS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEDICATIONS))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveMedications = useCallback((newMedications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMedications))
      setMedications(newMedications)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return medications
  }, [medications])

  const getById = useCallback((id) => {
    return medications.find(m => m.id === id)
  }, [medications])

  const getByType = useCallback((type) => {
    return medications.filter(m => m.type === type && m.isActive)
  }, [medications])

  const getActive = useCallback(() => {
    return medications.filter(m => m.isActive)
  }, [medications])

  const create = useCallback((medicationData) => {
    const newMedication = {
      ...DEFAULT_MEDICATION,
      ...medicationData,
      id: `med_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    const newMedications = [...medications, newMedication]
    saveMedications(newMedications)
    return newMedication
  }, [medications, saveMedications])

  const update = useCallback((id, medicationData) => {
    const newMedications = medications.map(m => 
      m.id === id 
        ? { ...m, ...medicationData }
        : m
    )
    saveMedications(newMedications)
    return getById(id)
  }, [medications, saveMedications, getById])

  const remove = useCallback((id) => {
    const newMedications = medications.filter(m => m.id !== id)
    saveMedications(newMedications)
  }, [medications, saveMedications])

  const toggleActive = useCallback((id) => {
    const medication = getById(id)
    if (medication) {
      update(id, { isActive: !medication.isActive })
    }
  }, [getById, update])

  const types = ['milk', 'medication']

  return {
    medications,
    loading,
    error,
    getAll,
    getById,
    getByType,
    getActive,
    create,
    update,
    remove,
    toggleActive,
    types,
    TYPE_LABELS
  }
}

export default useMedication
