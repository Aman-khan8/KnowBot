import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F8C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D] disabled:opacity-50 disabled:cursor-not-allowed'

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-[15px]',
  }

  const variants = {
    primary: 'bg-[#F43F8C] text-white hover:bg-[#FF5A9D] active:bg-[#B92768]',
    secondary:
      'bg-transparent border border-[#2A2A2F] text-[#F5F5F5] hover:bg-[#1C1C20] active:bg-[#2A2A2F]',
    danger:
      'bg-transparent border border-[#F87171] text-[#F87171] hover:bg-[#F87171]/10 active:bg-[#F87171]/20',
    ghost:
      'bg-transparent text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20]',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
