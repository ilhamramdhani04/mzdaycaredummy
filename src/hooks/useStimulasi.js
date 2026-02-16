import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_stimulasi'

const DEFAULT_ACTIVITY = {
  id: '',
  name: '',
  category: '',
  ageGroup: '',
  description: '',
  assessmentCriteria: [],
  createdAt: ''
}

const DEFAULT_ACTIVITIES = [
  {
    id: 'stim_1',
    name: 'Main Bola',
    category: 'grossMotor',
    ageGroup: 'Baby',
    description: 'Bermain bola untuk mengembangkan koordinasi dan motorik kasar',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_2',
    name: 'Tummy Time',
    category: 'grossMotor',
    ageGroup: 'Baby',
    description: 'Berbaring tengkurap untuk penguatan otot leher dan punggung',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_3',
    name: 'Menggenggam Benda',
    category: 'fineMotor',
    ageGroup: 'Baby',
    description: 'Latihan menggenggam mainan atau benda dengan berbagai tekstur',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_4',
    name: 'Melacak Objek',
    category: 'cognitive',
    ageGroup: 'Baby',
    description: 'Mengikuti gerakan objek dengan mata',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_5',
    name: 'Berlari',
    category: 'grossMotor',
    ageGroup: 'Toddler',
    description: 'Berlari di area permainan untuk pengembangan motorik kasar',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_6',
    name: 'Melompat',
    category: 'grossMotor',
    ageGroup: 'Toddler',
    description: 'Latihan melompat dengan kedua kaki',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_7',
    name: 'Mewarnai',
    category: 'fineMotor',
    ageGroup: 'Toddler',
    description: 'Mewarnai gambar dengan crayon atau pensil warna',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_8',
    name: 'Memasang Button',
    category: 'fineMotor',
    ageGroup: 'Toddler',
    description: 'Latihan memasang dan melepas button atau resleting',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_9',
    name: 'Bermain Pasir',
    category: 'fineMotor',
    ageGroup: 'Toddler',
    description: 'Bermain pasir dengan cetakan, sekop, atau tangan',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_10',
    name: 'Mengenal Warna',
    category: 'cognitive',
    ageGroup: 'Toddler',
    description: 'Belajar mengenal dan menyebutkan warna-warna dasar',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_11',
    name: 'Bermain Puzzle',
    category: 'cognitive',
    ageGroup: 'Kinder',
    description: 'Menyelesaikan puzzle dengan potongan yang sesuai',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_12',
    name: 'Berhitung',
    category: 'cognitive',
    ageGroup: 'Kinder',
    description: 'Belajar berhitung dengan benda-benda konkret',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_13',
    name: 'Mengenal Huruf',
    category: 'cognitive',
    ageGroup: 'Kinder',
    description: 'Belajar mengenal dan menulis huruf alphabet',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_14',
    name: 'Bermain dengan Teman',
    category: 'social',
    ageGroup: 'Toddler',
    description: 'Interaksi sosial dengan teman sekelas',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  },
  {
    id: 'stim_15',
    name: 'Berbagi Mainan',
    category: 'social',
    ageGroup: 'Kinder',
    description: 'Belajar berbagi mainan dengan teman',
    assessmentCriteria: ['BB', 'MB', 'BSH', 'BSB'],
    createdAt: '2024-01-01'
  }
]

const CATEGORY_LABELS = {
  grossMotor: 'Gross Motor Skill',
  fineMotor: 'Fine Motor Skill',
  cognitive: 'Cognitive',
  social: 'Social'
}

const ASSESSMENT_CRITERIA = [
  { value: 'BB', label: 'BB (Below Basic)' },
  { value: 'MB', label: 'MB (Meeting Basic)' },
  { value: 'BSH', label: 'BSH (Satisfactory)' },
  { value: 'BSB', label: 'BSB (Excellent)' }
]

function useStimulasi() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setActivities(JSON.parse(stored))
      } else {
        setActivities(DEFAULT_ACTIVITIES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITIES))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveActivities = useCallback((newActivities) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivities))
      setActivities(newActivities)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return activities
  }, [activities])

  const getById = useCallback((id) => {
    return activities.find(a => a.id === id)
  }, [activities])

  const getByAgeGroup = useCallback((ageGroup) => {
    return activities.filter(a => a.ageGroup === ageGroup)
  }, [activities])

  const getByCategory = useCallback((category) => {
    return activities.filter(a => a.category === category)
  }, [activities])

  const create = useCallback((activityData) => {
    const newActivity = {
      ...DEFAULT_ACTIVITY,
      ...activityData,
      id: `stim_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    const newActivities = [...activities, newActivity]
    saveActivities(newActivities)
    return newActivity
  }, [activities, saveActivities])

  const update = useCallback((id, activityData) => {
    const newActivities = activities.map(a => 
      a.id === id 
        ? { ...a, ...activityData }
        : a
    )
    saveActivities(newActivities)
    return getById(id)
  }, [activities, saveActivities, getById])

  const remove = useCallback((id) => {
    const newActivities = activities.filter(a => a.id !== id)
    saveActivities(newActivities)
  }, [activities, saveActivities])

  const ageGroups = ['Baby', 'Toddler', 'Kinder']
  const categories = Object.keys(CATEGORY_LABELS)

  return {
    activities,
    loading,
    error,
    getAll,
    getById,
    getByAgeGroup,
    getByCategory,
    create,
    update,
    remove,
    ageGroups,
    categories,
    CATEGORY_LABELS,
    ASSESSMENT_CRITERIA
  }
}

export default useStimulasi
