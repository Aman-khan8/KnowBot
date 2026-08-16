import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bot, FileText, Settings, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/bots', label: 'Bots', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
          isActive
            ? 'bg-[#F43F8C]/10 text-[#F43F8C]'
            : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20]'
        }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  )
}

export default function Sidebar({ onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    if (onClose) onClose()
  }

  return (
    <div className="flex flex-col h-full bg-[#0B0B0D] border-r border-[#2A2A2F]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2A2A2F]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[6px] bg-[#F43F8C] flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="text-[15px] font-semibold text-[#F5F5F5] tracking-tight">
            KnowBot
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#2A2A2F]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[8px] text-sm font-medium text-[#71717A] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  )
}
