import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_overtime_config'

const DEFAULT_CONFIG = {
  id: 'overtime_config',
  enabled: true,
  defaultRate: 50000,
  gracePeriodMinutes: 15,
  maxOvertimeMinutes: 120,
  weekendEnabled: false,
  weekendRateMultiplier: 1.5,
  packageOverrides: {
    pkg_full: 50000,
    pkg_half: 50000,
    pkg_extended: 75000
  },
  branchRates: {},
  updatedAt: '',
  updatedBy: ''
}

const DEFAULT_PACKAGES = [
  { id: 'pkg_full', name: 'Full Day', code: 'FULL' },
  { id: 'pkg_half', name: 'Half Day', code: 'HALF' },
  { id: 'pkg_extended', name: 'Extended', code: 'EXT' }
]

const DEFAULT_BRANCHES = [
  { id: 'branch_1', name: 'Mannazentrum Pusat' },
  { id: 'branch_2', name: 'Mannazentrum Cibubur' }
]

function useOvertimeConfig() {
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

  const updateConfig = useCallback((updates) => {
    const newConfig = { ...config, ...updates }
    saveConfig(newConfig)
    return newConfig
  }, [config, saveConfig])

  const setPackageRate = useCallback((packageId, rate) => {
    const newConfig = {
      ...config,
      packageOverrides: {
        ...config.packageOverrides,
        [packageId]: rate
      }
    }
    saveConfig(newConfig)
  }, [config, saveConfig])

  const setBranchRate = useCallback((branchId, rate) => {
    const newConfig = {
      ...config,
      branchRates: {
        ...config.branchRates,
        [branchId]: rate
      }
    }
    saveConfig(newConfig)
  }, [config, saveConfig])

  const resetToDefault = useCallback(() => {
    saveConfig(DEFAULT_CONFIG)
  }, [saveConfig])

  const calculateOvertime = useCallback((childId, checkIn, checkOut, packageId, branchId) => {
    if (!config || !config.enabled) return { minutes: 0, amount: 0 }

    const defaultMinutes = getMinutesBetween(checkIn, checkOut)
    const packageMaxMinutes = getPackageMaxMinutes(packageId)
    
    let overtimeMinutes = defaultMinutes - packageMaxMinutes
    if (overtimeMinutes < 0) overtimeMinutes = 0
    
    overtimeMinutes = Math.max(0, overtimeMinutes - config.gracePeriodMinutes)
    
    if (config.maxOvertimeMinutes > 0) {
      overtimeMinutes = Math.min(overtimeMinutes, config.maxOvertimeMinutes)
    }

    const rate = getOvertimeRate(packageId, branchId)
    const amount = Math.round((overtimeMinutes / 60) * rate)

    return { minutes: overtimeMinutes, amount }
  }, [config])

  const getOvertimeRate = useCallback((packageId, branchId) => {
    if (!config) return DEFAULT_CONFIG.defaultRate

    if (branchId && config.branchRates[branchId]) {
      return config.branchRates[branchId]
    }

    if (packageId && config.packageOverrides[packageId]) {
      return config.packageOverrides[packageId]
    }

    return config.defaultRate
  }, [config])

  const isWeekend = (date) => {
    const day = new Date(date).getDay()
    return day === 0 || day === 6
  }

  return {
    config,
    loading,
    error,
    getConfig,
    updateConfig,
    setPackageRate,
    setBranchRate,
    resetToDefault,
    calculateOvertime,
    getOvertimeRate,
    packages: DEFAULT_PACKAGES,
    branches: DEFAULT_BRANCHES
  }
}

function getMinutesBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  
  const [inHours, inMinutes] = checkIn.split(':').map(Number)
  const [outHours, outMinutes] = checkOut.split(':').map(Number)
  
  const inTotal = inHours * 60 + inMinutes
  const outTotal = outHours * 60 + outMinutes
  
  return Math.max(0, outTotal - inTotal)
}

function getPackageMaxMinutes(packageId) {
  const defaults = {
    pkg_full: 600,
    pkg_half: 300,
    pkg_extended: 720
  }
  return defaults[packageId] || 600
}

export default useOvertimeConfig
