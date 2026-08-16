import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-[10px] bg-[#1C1C20] border border-[#2A2A2F] flex items-center justify-center mb-4">
          <Icon size={22} className="text-[#71717A]" />
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-[#F5F5F5] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#71717A] max-w-xs mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}
