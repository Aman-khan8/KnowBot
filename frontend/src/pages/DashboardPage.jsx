import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, FileText, Plus, ArrowRight, Clock } from 'lucide-react'
import { getAllBots } from '../services/botService'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Skeleton'
import ErrorMessage from '../components/ui/ErrorMessage'

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-[#71717A]" />
        <span className="text-sm text-[#A1A1AA]">{label}</span>
      </div>
      {loading ? (
        <div className="h-8 w-12 bg-[#1C1C20] rounded animate-pulse" />
      ) : (
        <p className="text-[28px] font-semibold text-[#F5F5F5] leading-none">{value}</p>
      )}
    </div>
  )
}

function BotCard({ bot, onManage }) {
  const updated = bot.updated_at
    ? new Date(bot.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-[15px] font-semibold text-[#F5F5F5] leading-snug">
          {bot.name}
        </h3>
        {bot.business_name && (
          <p className="text-xs text-[#F43F8C] mt-0.5">{bot.business_name}</p>
        )}
        {bot.description && (
          <p className="text-sm text-[#A1A1AA] mt-2 line-clamp-2">{bot.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto pt-1">
        {updated && (
          <span className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <Clock size={12} />
            Updated {updated}
          </span>
        )}
        <button
          onClick={() => onManage(bot)}
          className="flex items-center gap-1.5 text-sm text-[#F43F8C] hover:text-[#FF5A9D] transition-colors ml-auto font-medium"
        >
          Manage <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await getAllBots()
        setBots(res.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBots()
  }, [])

  const recentBots = bots.slice(0, 4)

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const displayName = user?.name || null

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#F5F5F5] leading-tight">
          {getGreeting()}{displayName ? `, ${displayName}` : ''}
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-1">
          Manage your bots, documents and knowledge.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={Bot}
          label="Total Bots"
          value={bots.length}
          loading={loading}
        />
        <StatCard
          icon={FileText}
          label="Active Bots"
          value={bots.length}
          loading={loading}
        />
      </div>

      {/* Recent Bots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[#F5F5F5]">Recent Bots</h2>
          <button
            onClick={() => navigate('/bots')}
            className="text-sm text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentBots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentBots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                onManage={(b) => navigate(`/bots/${b.id}/documents`)}
              />
            ))}
          </div>
        ) : (
          !error && (
            <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] px-5 py-10 text-center">
              <p className="text-sm text-[#71717A] mb-4">
                No bots yet. Create your first knowledge bot to get started.
              </p>
              <Button onClick={() => navigate('/bots/create')}>
                <Plus size={15} />
                Create Bot
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
