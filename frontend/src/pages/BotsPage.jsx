import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Bot,
  FileText,
  Settings,
  Trash2,
  Clock,
} from 'lucide-react'
import { getAllBots, deleteBot } from '../services/botService'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import { SkeletonRow } from '../components/ui/Skeleton'

function DeleteBotModal({ bot, onClose, onDeleted }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      await deleteBot(bot.id)
      addToast('Bot deleted successfully', 'success')
      onDeleted(bot.id)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Delete bot?" onClose={onClose}>
      <p className="text-sm text-[#A1A1AA] mb-2">
        This will permanently remove{' '}
        <span className="text-[#F5F5F5] font-medium">{bot.name}</span> and all its
        associated documents and knowledge chunks.
      </p>
      <p className="text-sm text-[#71717A] mb-5">This action cannot be undone.</p>
      {error && <ErrorMessage message={error} />}
      <div className="flex justify-end gap-2 mt-5">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} loading={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  )
}

function BotRow({ bot, onDelete, onManage, onEdit }) {
  const created = bot.created_at
    ? new Date(bot.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#202024] last:border-b-0 hover:bg-[#161619]/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-medium text-[#F5F5F5] truncate">{bot.name}</p>
          {bot.business_name && (
            <span className="text-[11px] text-[#F43F8C] bg-[#F43F8C]/10 border border-[#F43F8C]/20 px-2 py-0.5 rounded-[6px] shrink-0">
              {bot.business_name}
            </span>
          )}
        </div>
        {bot.description && (
          <p className="text-sm text-[#71717A] mt-0.5 truncate max-w-md">
            {bot.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#71717A] shrink-0">
        <Clock size={12} />
        {created}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onManage(bot)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20] transition-colors"
          title="Manage documents"
        >
          <FileText size={14} />
          <span className="hidden sm:inline">Documents</span>
        </button>
        <button
          onClick={() => onEdit(bot)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20] transition-colors"
          title="Edit bot"
        >
          <Settings size={14} />
          <span className="hidden sm:inline">Settings</span>
        </button>
        <button
          onClick={() => onDelete(bot)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm text-[#71717A] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
          title="Delete bot"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function BotsPage() {
  const navigate = useNavigate()
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [botToDelete, setBotToDelete] = useState(null)

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

  const handleDeleted = (deletedId) => {
    setBots((prev) => prev.filter((b) => b.id !== deletedId))
  }

  return (
    <div>
      <PageHeader
        title="Bots"
        description="Create and manage your AI knowledge bots."
        action={
          <Button onClick={() => navigate('/bots/create')}>
            <Plus size={15} />
            Create Bot
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}

      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] overflow-hidden">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : bots.length === 0 && !error ? (
          <EmptyState
            icon={Bot}
            title="No bots yet"
            description="Create your first knowledge bot to get started."
            action={
              <Button onClick={() => navigate('/bots/create')}>
                <Plus size={15} />
                Create Bot
              </Button>
            }
          />
        ) : (
          bots.map((bot) => (
            <BotRow
              key={bot.id}
              bot={bot}
              onDelete={setBotToDelete}
              onManage={(b) => navigate(`/bots/${b.id}/documents`)}
              onEdit={(b) => navigate(`/bots/${b.id}/edit`)}
            />
          ))
        )}
      </div>

      {botToDelete && (
        <DeleteBotModal
          bot={botToDelete}
          onClose={() => setBotToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
