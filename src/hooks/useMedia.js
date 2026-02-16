import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'mz_media'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const COMPRESSION_QUALITY = 0.7

const DEFAULT_MEDIA = {
  id: '',
  childId: '',
  type: 'photo',
  data: '',
  caption: '',
  date: '',
  time: '',
  uploadedBy: '',
  createdAt: ''
}

function useMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMedia(JSON.parse(stored))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveMedia = useCallback((newMedia) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMedia))
      setMedia(newMedia)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const getAll = useCallback(() => {
    return media
  }, [media])

  const getById = useCallback((id) => {
    return media.find(m => m.id === id)
  }, [media])

  const getByChild = useCallback((childId) => {
    return media.filter(m => m.childId === childId)
  }, [media])

  const getByDate = useCallback((date) => {
    return media.filter(m => m.date === date)
  }, [media])

  const getByType = useCallback((type) => {
    return media.filter(m => m.type === type)
  }, [media])

  const compressImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const maxWidth = 800
          const scale = maxWidth / img.width
          const width = img.width > maxWidth ? maxWidth : img.width
          const height = img.width > maxWidth ? img.height * scale : img.height
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          const compressed = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY)
          resolve(compressed)
        }
        img.onerror = reject
        img.src = e.target.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const upload = useCallback(async (file, childId, caption = '', uploadedBy = '') => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 2MB limit')
    }

    const isVideo = file.type.startsWith('video/')
    
    let data
    if (isVideo) {
      const reader = new FileReader()
      data = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    } else {
      data = await compressImage(file)
    }

    const now = new Date()
    const newMedia = {
      ...DEFAULT_MEDIA,
      id: `media_${Date.now()}`,
      childId,
      type: isVideo ? 'video' : 'photo',
      data,
      caption,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      uploadedBy,
      createdAt: now.toISOString()
    }

    const newMediaList = [...media, newMedia]
    saveMedia(newMediaList)
    return newMedia
  }, [media, saveMedia, compressImage])

  const updateCaption = useCallback((id, caption) => {
    const newMedia = media.map(m => 
      m.id === id 
        ? { ...m, caption }
        : m
    )
    saveMedia(newMedia)
    return getById(id)
  }, [media, saveMedia, getById])

  const remove = useCallback((id) => {
    const newMedia = media.filter(m => m.id !== id)
    saveMedia(newMedia)
  }, [media, saveMedia])

  const getTotalSize = useCallback(() => {
    return media.reduce((total, m) => total + (m.data?.length || 0), 0)
  }, [media])

  const types = ['photo', 'video']

  return {
    media,
    loading,
    error,
    getAll,
    getById,
    getByChild,
    getByDate,
    getByType,
    upload,
    updateCaption,
    remove,
    getTotalSize,
    types,
    MAX_FILE_SIZE
  }
}

export default useMedia
