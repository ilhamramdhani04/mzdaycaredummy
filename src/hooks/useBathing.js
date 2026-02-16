import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_bathing'

const DEFAULT_BATHING = {
  id: '',
  name: '',
  ageGroup: '',
  schedule: {
    mandiPagi: '07:00',
    mandiSore: '16:00',
    toiletTraining: false
  },
  createdAt: ''
}

const DEFAULT_BATHING_SCHEDULES = [
  {
    id: 'bath_1',
    name: 'Jadwal Mandi Baby',
    ageGroup: 'Baby',
    schedule: {
      mandiPagi: '07:30',
      mandiSore: '15:30',
      toiletTraining: false
    },
    createdAt: '2024-01-01'
  },
  {
    id: 'bath_2',
    name: 'Jadwal Mandi Toddler',
    ageGroup: 'Toddler',
    schedule: {
      mandiPagi: '07:00',
      mandiSore: '16:00',
      toiletTraining: true
    },
    createdAt: '2024-01-01'
  },
  {
    id: 'bath_3',
    name: 'Jadwal Mandi Kinder',
    ageGroup: 'Kinder',
    schedule: {
      mandiPagi: '07:00',
      mandiSore: '16:30',
      toiletTraining: true
    },
    createdAt: '2024-01-01'
  }
]

function useBathing() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSchedules(JSON.parse(stored))
      } else {
        setSchedules(DEFAULT_BATHING_SCHEDULES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BATHING_SCHEDULES))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveSchedules = useCallback((newSchedules) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedules))
      setSchedules(newSchedules)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return schedules
  }, [schedules])

  const getById = useCallback((id) => {
    return schedules.find(s => s.id === id)
  }, [schedules])

  const getByAgeGroup = useCallback((ageGroup) => {
    return schedules.filter(s => s.ageGroup === ageGroup)
  }, [schedules])

  const create = useCallback((scheduleData) => {
    const newSchedule = {
      ...DEFAULT_BATHING,
      ...scheduleData,
      id: `bath_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    const newSchedules = [...schedules, newSchedule]
    saveSchedules(newSchedules)
    return newSchedule
  }, [schedules, saveSchedules])

  const update = useCallback((id, scheduleData) => {
    const newSchedules = schedules.map(s => 
      s.id === id 
        ? { ...s, ...scheduleData }
        : s
    )
    saveSchedules(newSchedules)
    return getById(id)
  }, [schedules, saveSchedules, getById])

  const remove = useCallback((id) => {
    const newSchedules = schedules.filter(s => s.id !== id)
    saveSchedules(newSchedules)
  }, [schedules, saveSchedules])

  const ageGroups = ['Baby', 'Toddler', 'Kinder']

  return {
    schedules,
    loading,
    error,
    getAll,
    getById,
    getByAgeGroup,
    create,
    update,
    remove,
    ageGroups
  }
}

export default useBathing
