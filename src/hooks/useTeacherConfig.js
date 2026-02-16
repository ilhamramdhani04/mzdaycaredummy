import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_teacher_config'

const DEFAULT_CONFIG = {
  id: 'teacher_config',
  // Default presets that teachers must use
  presets: {
    defaultMood: 'Happy',
    defaultConsumption: 'All',
    defaultNapQuality: 'Good',
    defaultNapStart: '13:00',
    defaultNapEnd: '14:30',
    // Auto-fill settings
    autoFillMeals: true,
    autoFillNap: true,
    autoFillToilet: false,
    // Required fields
    requireMood: true,
    requireActivities: false,
    requireMeal: true,
    requireNap: true,
    // Quick mode settings
    quickModeEnabled: true,
    batchModeEnabled: true,
    // Report defaults
    reportTitle: 'Laporan Harian',
    includePhotos: false,
  },
  // Age group specific defaults
  ageGroupDefaults: {
    Baby: {
      defaultMood: 'Happy',
      defaultConsumption: 'All',
      napRequired: true,
      mealsRequired: true,
    },
    Toddler: {
      defaultMood: 'Happy',
      defaultConsumption: 'Most',
      napRequired: true,
      mealsRequired: true,
    },
    Kinder: {
      defaultMood: 'Happy',
      defaultConsumption: 'Most',
      napRequired: false,
      mealsRequired: true,
    }
  },
  // Allowed options for teachers (configured by superadmin)
  allowedOptions: {
    moods: ['Happy', 'Calm', 'Sleepy', 'Fussy', 'Energetic'],
    consumptions: ['All', 'Most', 'Little', 'None'],
    napQualities: ['Good', 'Fair', 'Poor'],
  },
  // Quick templates
  templates: [
    {
      id: 'template_1',
      name: 'Laporan Normal',
      description: 'Laporan dengan kondisi normal',
      data: {
        general: { mood: 'Happy', activities: '', notes: '' },
        meals: [],
        nap: { startTime: '13:00', endTime: '14:30', quality: 'Good' },
        toilet: []
      }
    },
    {
      id: 'template_2',
      name: 'Laporan Sakit',
      description: 'Laporan untuk anak yang sakit',
      data: {
        general: { mood: 'Fussy', activities: 'Istirahat', notes: 'Demam' },
        meals: [],
        nap: { startTime: '13:00', endTime: '15:00', quality: 'Fair' },
        toilet: []
      }
    }
  ],
  updatedAt: '',
  updatedBy: ''
}

function useTeacherConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setConfig(JSON.parse(stored))
      } else {
        setConfig(DEFAULT_CONFIG)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveConfig = useCallback((newConfig) => {
    try {
      const updated = {
        ...newConfig,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setConfig(updated)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getConfig = useCallback(() => {
    return config
  }, [config])

  const updatePresets = useCallback((presets) => {
    const newConfig = { ...config, presets: { ...config.presets, ...presets } }
    saveConfig(newConfig)
    return newConfig
  }, [config, saveConfig])

  const updateAgeGroupDefaults = useCallback((ageGroup, defaults) => {
    const newConfig = {
      ...config,
      ageGroupDefaults: {
        ...config.ageGroupDefaults,
        [ageGroup]: { ...config.ageGroupDefaults[ageGroup], ...defaults }
      }
    }
    saveConfig(newConfig)
    return newConfig
  }, [config, saveConfig])

  const addTemplate = useCallback((template) => {
    const newTemplate = {
      ...template,
      id: `template_${Date.now()}`
    }
    const newConfig = {
      ...config,
      templates: [...config.templates, newTemplate]
    }
    saveConfig(newConfig)
    return newTemplate
  }, [config, saveConfig])

  const removeTemplate = useCallback((templateId) => {
    const newConfig = {
      ...config,
      templates: config.templates.filter(t => t.id !== templateId)
    }
    saveConfig(newConfig)
  }, [config, saveConfig])

  const getTemplate = useCallback((templateId) => {
    return config?.templates.find(t => t.id === templateId)
  }, [config])

  const getDefaultsForAgeGroup = useCallback((ageGroup) => {
    return config?.ageGroupDefaults?.[ageGroup] || config?.presets
  }, [config])

  const resetToDefault = useCallback(() => {
    saveConfig(DEFAULT_CONFIG)
  }, [saveConfig])

  return {
    config,
    loading,
    error,
    getConfig,
    updatePresets,
    updateAgeGroupDefaults,
    addTemplate,
    removeTemplate,
    getTemplate,
    getDefaultsForAgeGroup,
    resetToDefault
  }
}

export default useTeacherConfig
