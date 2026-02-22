import { useState } from 'react'

function WhatsAppButton({ 
  phoneNumber = "+6281234567890", 
  defaultMessage = "Halo Mannazentrum, saya ingin bertanya tentang...",
  position = "bottom-right"
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    const message = encodeURIComponent(defaultMessage)
    const waUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className={`whatsapp-float ${position}`}>
      <div className={`whatsapp-chat ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span className="wa-icon">💬</span>
          <div className="chat-header-text">
            <span className="chat-title">Chat dengan kami</span>
            <span className="chat-status">Online • Respon cepat</span>
          </div>
        </div>
        <div className="chat-body">
          <div className="chat-message bot">
            <p>Halo! Ada yang bisa kami bantu?</p>
            <span className="msg-time">Sekarang</span>
          </div>
        </div>
        <button className="chat-start-btn" onClick={handleClick}>
          <span>💬</span> Mulai Chat
        </button>
      </div>

      <button 
        className={`whatsapp-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span>✕</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="white" width="28px" height="28px">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      <style>{`
        .whatsapp-float {
          position: fixed;
          z-index: 9999;
        }

        .whatsapp-float.bottom-right {
          bottom: 90px;
          right: 16px;
        }

        .whatsapp-float.bottom-left {
          bottom: 90px;
          left: 16px;
        }

        .whatsapp-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #25D366;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
        }

        .whatsapp-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.5);
        }

        .whatsapp-btn.open {
          transform: rotate(90deg);
        }

        .whatsapp-chat {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px) scale(0.95);
          transition: all 0.3s ease;
        }

        .whatsapp-chat.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .chat-header {
          background: linear-gradient(135deg, #25D366 0%, #20BD5A 100%);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-header .wa-icon {
          font-size: 32px;
        }

        .chat-header-text {
          display: flex;
          flex-direction: column;
        }

        .chat-title {
          color: white;
          font-weight: 600;
          font-size: 15px;
        }

        .chat-status {
          color: rgba(255, 255, 255, 0.85);
          font-size: 12px;
        }

        .chat-body {
          padding: 16px;
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
        }

        .chat-message {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .chat-message.bot {
          background: #F0F0F0;
          border-bottom-left-radius: 4px;
        }

        .msg-time {
          font-size: 10px;
          color: #999;
          display: block;
          margin-top: 4px;
        }

        .chat-start-btn {
          width: calc(100% - 32px);
          margin: 0 16px 16px;
          padding: 12px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s ease;
        }

        .chat-start-btn:hover {
          background: #20BD5A;
        }

        @media (max-width: 480px) {
          .whatsapp-float.bottom-right,
          .whatsapp-float.bottom-left {
            bottom: 120px;
            right: 16px;
          }

          .whatsapp-chat {
            width: 280px;
            right: -10px;
          }
        }
      `}</style>
    </div>
  )
}

export default WhatsAppButton
