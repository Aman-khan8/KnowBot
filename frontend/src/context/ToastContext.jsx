import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const typeStyles = {
    success: 'border-[#4ADE80] text-[#4ADE80]',
    error: 'border-[#F87171] text-[#F87171]',
    info: 'border-[#60A5FA] text-[#60A5FA]',
  }

  const TypeIcon = ({ type }) => {
    if (type === 'success') return <CheckCircle size={16} />
    if (type === 'error') return <AlertCircle size={16} />
    return <Info size={16} />
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 bg-[#1C1C20] border rounded-[8px] px-4 py-3 shadow-lg ${typeStyles[t.type]}`}
          >
            <span className="mt-0.5 shrink-0">
              <TypeIcon type={t.type} />
            </span>
            <p className="text-sm text-[#F5F5F5] flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-[#71717A] hover:text-[#F5F5F5] transition-colors shrink-0 mt-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
