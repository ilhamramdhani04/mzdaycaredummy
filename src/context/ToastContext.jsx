import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
    
    // Auto remove
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Helper methods for different toast types
  const success = useCallback((message, duration) => 
    addToast(message, 'success', duration), [addToast])
  
  const error = useCallback((message, duration) => 
    addToast(message, 'error', duration), [addToast])
  
  const warning = useCallback((message, duration) => 
    addToast(message, 'warning', duration), [addToast])
  
  const info = useCallback((message, duration) => 
    addToast(message, 'info', duration), [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          index={index}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, index, onRemove }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const titles = {
    success: 'Berhasil',
    error: 'Error',
    warning: 'Perhatian',
    info: 'Info'
  }

  return (
    <div className={`toast toast-${toast.type} toast-enter`} style={{ '--toast-index': index }}>
      <div className="toast-icon">{icons[toast.type]}</div>
      <div className="toast-content">
        <div className="toast-title">{titles[toast.type]}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onRemove}>×</button>
      <div className="toast-progress toast-progress-bar" style={{ animationDuration: `${toast.duration}ms` }} />
    </div>
  )
}
