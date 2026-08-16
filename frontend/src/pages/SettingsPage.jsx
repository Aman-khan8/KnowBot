import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { LogOut, User } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    addToast('Logged out successfully', 'success')
    navigate('/login')
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" description="Manage your account settings." />

      {/* Account info */}
      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-[#1C1C20] border border-[#2A2A2F] flex items-center justify-center">
            <User size={17} className="text-[#71717A]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#F5F5F5]">
              {user?.name || 'Your Account'}
            </p>
            <p className="text-xs text-[#71717A]">
              {user?.email || `User ID: ${user?.id}`}
            </p>
          </div>
        </div>

        <div className="border-t border-[#202024] pt-4">
          <Button
            variant="danger"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={15} />
            Log out
          </Button>
        </div>
      </div>

      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-5">
        <h3 className="text-sm font-semibold text-[#F5F5F5] mb-1">
          About KnowBot
        </h3>
        <p className="text-sm text-[#71717A]">
          KnowBot is a SaaS platform for building AI-powered knowledge bots backed
          by your documents.
        </p>
      </div>
    </div>
  )
}
