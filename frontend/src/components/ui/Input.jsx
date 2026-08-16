import React from 'react'

export default function Input({
  label,
  error,
  id,
  className = '',
  textarea = false,
  rows = 3,
  ...props
}) {
  const inputClass = `w-full bg-[#111114] border rounded-[8px] px-3 py-2 text-sm text-[#F5F5F5] placeholder-[#71717A] transition-colors focus:outline-none focus:border-[#F43F8C] ${
    error ? 'border-[#F87171]' : 'border-[#2A2A2F]'
  } ${className}`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#F5F5F5]">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea id={id} rows={rows} className={inputClass} {...props} />
      ) : (
        <input id={id} className={inputClass} {...props} />
      )}
      {error && <p className="text-xs text-[#F87171]">{error}</p>}
    </div>
  )
}
