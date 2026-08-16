import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FileText,
  Upload,
  Eye,
  Pencil,
  Trash2,
  Settings,
  ArrowLeft,
} from 'lucide-react'
import {
  getDocuments,
  deleteDocument,
  getDocumentUrl,
  updateDocument,
  uploadDocument,
} from '../services/documentService'
import { getAllBots } from '../services/botService'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import { SkeletonRow } from '../components/ui/Skeleton'
import UploadModal from '../components/documents/UploadModal'

// ── Delete confirmation modal ──────────────────────────────────────────────
function DeleteDocModal({ doc, botId, onClose, onDeleted }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      await deleteDocument(doc.id)
      addToast('Document deleted successfully', 'success')
      onDeleted(doc.id)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Delete document?" onClose={onClose}>
      <p className="text-sm text-[#A1A1AA] mb-1">
        This will permanently remove{' '}
        <span className="text-[#F5F5F5] font-medium">{doc.file_name}</span> and its
        associated knowledge chunks.
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

// ── Rename modal ───────────────────────────────────────────────────────────
function RenameDocModal({ doc, botId, onClose, onRenamed }) {
  const { addToast } = useToast()
  const [fileName, setFileName] = useState(doc.file_name)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!fileName.trim()) {
      setError('File name is required')
      return
    }
    setSaving(true)
    try {
      await updateDocument(botId, doc.id, fileName.trim())
      addToast('Document renamed successfully', 'success')
      onRenamed(doc.id, fileName.trim())
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Rename Document" onClose={onClose}>
      <form onSubmit={handleSave} className="space-y-4" noValidate>
        <div>
          <p className="text-xs text-[#71717A] mb-3">
            Current name:{' '}
            <span className="text-[#A1A1AA]">{doc.file_name}</span>
          </p>
          <Input
            id="fileName"
            label="New name"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value)
              setError('')
            }}
            error={error}
            placeholder="document-name.pdf"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ── Document row ────────────────────────────────────────────────────────────
function DocRow({ doc, botId, onDelete, onRename, onView }) {
  const [viewing, setViewing] = useState(false)

  const handleView = async () => {
    setViewing(true)
    await onView(doc)
    setViewing(false)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#202024] last:border-b-0 hover:bg-[#161619]/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText size={16} className="text-[#71717A] shrink-0" />
        <span className="text-sm text-[#F5F5F5] truncate">{doc.file_name}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleView}
          disabled={viewing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20] transition-colors disabled:opacity-50"
          title="View document"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">{viewing ? 'Opening...' : 'View'}</span>
        </button>
        <button
          onClick={() => onRename(doc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#1C1C20] transition-colors"
          title="Rename document"
        >
          <Pencil size={14} />
          <span className="hidden sm:inline">Rename</span>
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#71717A] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
          title="Delete document"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { botId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [botName, setBotName] = useState('')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [docToDelete, setDocToDelete] = useState(null)
  const [docToRename, setDocToRename] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      
      const res = await getDocuments(botId)
      setDocs(res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [botId])

  useEffect(() => {
    // Fetch bot name for the header
    const fetchBotName = async () => {
      try {
        const res = await getAllBots()
        const found = (res.data || []).find((b) => String(b.id) === String(botId))
        if (found) setBotName(found.name)
      } catch {
        // Non-critical; page still works without bot name
      }
    }
    fetchBotName()
    fetchDocs()
  }, [botId, fetchDocs])

  const handleView = async (doc) => {
    try {
      const res = await getDocumentUrl(botId, doc.id)
      // res.data is the presigned URL string
      const url = res.data
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      } else {
        addToast('Could not retrieve document URL', 'error')
      }
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleDeleted = (deletedId) => {
    setDocs((prev) => prev.filter((d) => d.id !== deletedId))
  }

  const handleRenamed = (docId, newName) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, file_name: newName } : d)),
    )
  }

  const handleUploaded = () => {
    setShowUpload(false)
    fetchDocs()
  }

  return (
    <div>
      <div className="mb-1">
        <button
          onClick={() => navigate('/bots')}
          className="flex items-center gap-1.5 text-sm text-[#71717A] hover:text-[#F5F5F5] transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          All Bots
        </button>
      </div>

      <PageHeader
        title={botName ? `${botName}` : 'Documents'}
        description={`${docs.length} document${docs.length !== 1 ? 's' : ''}`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/bots/${botId}/edit`)}
              size="sm"
            >
              <Settings size={14} />
              Settings
            </Button>
            <Button onClick={() => setShowUpload(true)} size="sm">
              <Upload size={14} />
              Upload Document
            </Button>
          </div>
        }
      />

      {error && <ErrorMessage message={error} />}

      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-3 border-b border-[#2A2A2F] hidden sm:flex items-center gap-3">
          <p className="text-xs font-medium text-[#71717A] flex-1">Document</p>
          <p className="text-xs font-medium text-[#71717A]">Actions</p>
        </div>

        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : docs.length === 0 && !error ? (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload documents to give your bot knowledge."
            action={
              <Button onClick={() => setShowUpload(true)}>
                <Upload size={15} />
                Upload Document
              </Button>
            }
          />
        ) : (
          docs.map((doc) => (
            <DocRow
              key={doc.id}
              doc={doc}
              botId={botId}
              onDelete={setDocToDelete}
              onRename={setDocToRename}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {docToDelete && (
        <DeleteDocModal
          doc={docToDelete}
          botId={botId}
          onClose={() => setDocToDelete(null)}
          onDeleted={handleDeleted}
        />
      )}
      {docToRename && (
        <RenameDocModal
          doc={docToRename}
          botId={botId}
          onClose={() => setDocToRename(null)}
          onRenamed={handleRenamed}
        />
      )}
      {showUpload && (
        <UploadModal
          botId={botId}
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  )
}
