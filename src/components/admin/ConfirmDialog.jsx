function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  type = 'danger' // danger, warning, info
}) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="admin-modal-overlay" onClick={handleBackdropClick}>
      <div className="admin-modal admin-modal-small">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{title}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="admin-modal-body">
          <div className="confirm-dialog-content">
            <div className={`confirm-dialog-icon confirm-dialog-icon-${type}`}>
              {type === 'danger' && '⚠️'}
              {type === 'warning' && '⚡'}
              {type === 'info' && 'ℹ️'}
            </div>
            <p className="confirm-dialog-message">{message}</p>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button 
            type="button" 
            className={`btn btn-${type === 'danger' ? 'danger' : 'primary'}`}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
