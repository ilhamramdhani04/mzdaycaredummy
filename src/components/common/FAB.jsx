import { useState } from 'react'

function FAB({ actions = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (actions.length === 0) return null

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-overlay" onClick={() => setIsOpen(false)} />
      )}
      
      <div className={`fab-actions ${isOpen ? 'open' : ''}`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className="fab-action"
            onClick={() => handleAction(action)}
            title={action.label}
            style={{ '--delay': `${index * 50}ms` }}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>

      <button 
        className={`fab-main ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fab-icon">{isOpen ? '✕' : '+'}</span>
      </button>

      <style>{`
        .fab-container {
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 1000;
        }

        .fab-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        .fab-main {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F4B400 0%, #FF8C42 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(244, 180, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .fab-main:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(244, 180, 0, 0.5);
        }

        .fab-main.open {
          transform: rotate(45deg);
        }

        .fab-icon {
          font-size: 28px;
          color: white;
          font-weight: bold;
        }

        .fab-actions {
          position: absolute;
          bottom: 70px;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        .fab-actions.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .fab-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          animation: fabSlideIn 0.3s ease forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        .fab-actions.open .fab-action {
          opacity: 1;
        }

        @keyframes fabSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fab-action:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .action-icon {
          font-size: 20px;
        }

        .action-label {
          font-size: 14px;
          font-weight: 500;
          color: #2D3748;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .fab-container {
            bottom: 90px !important;
            right: 16px !important;
          }

          .fab-main {
            width: 52px;
            height: 52px;
          }

          .action-label {
            display: none;
          }

          .fab-action {
            padding: 14px;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  )
}

export default FAB
