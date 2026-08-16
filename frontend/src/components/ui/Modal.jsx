import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, children, onClose, maxWidth = 'max-w-md' }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} bg-[#161619] border border-[#2A2A2F] rounded-[12px] shadow-xl`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2F]">
          <h2 className="text-[15px] font-semibold text-[#F5F5F5]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#71717A] hover:text-[#F5F5F5] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
