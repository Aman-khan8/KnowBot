import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2.5 rounded-[8px] bg-[#F87171]/10 border border-[#F87171]/30 px-4 py-3">
      <AlertCircle size={16} className="text-[#F87171] mt-0.5 shrink-0" />
      <p className="text-sm text-[#F87171] leading-snug">{message}</p>
    </div>
  )
}
