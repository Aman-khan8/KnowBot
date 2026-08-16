import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0B0B0D] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-[240px] shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-[240px] flex flex-col z-50">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3.5 border-b border-[#2A2A2F] bg-[#0B0B0D]">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-[15px] font-semibold text-[#F5F5F5]">KnowBot</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#111114]">
          <div className="max-w-5xl mx-auto px-5 py-7 sm:px-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
