import { useEffect, useRef } from 'react'

function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  size = 'medium', // small, medium, large
  showFooter = true
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="admin-modal-overlay" onClick={handleBackdropClick}>
      <div className={`admin-modal admin-modal-${size}`} ref={modalRef}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{title}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="admin-modal-body">
          {children}
        </div>

        {showFooter && (
          <div className="admin-modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              {cancelLabel}
            </button>
            {onSubmit && (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onSubmit}
              >
                {submitLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminModal
