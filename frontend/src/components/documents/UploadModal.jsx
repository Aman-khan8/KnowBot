import React, { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { uploadDocument } from '../../services/documentService'
import { useToast } from '../../context/ToastContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'

const ACCEPTED_TYPES = [
  'application/pdf',
  
]
const ACCEPTED_EXTENSIONS = '.pdf'

export default function UploadModal({ botId, onClose, onUploaded }) {
  const { addToast } = useToast()
  const fileInputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const validateFile = (f) => {
    if (!f) return 'No file selected.'
    if (f.size > 20 * 1024 * 1024) return 'File must be smaller than 20 MB.'
    // Allow by extension if MIME type isn't recognized
    const ext = f.name.split('.').pop().toLowerCase()
    const allowedExts = ['pdf']
    if (!ACCEPTED_TYPES.includes(f.type) && !allowedExts.includes(ext)) {
      return 'Unsupported file type. Please upload a PDF File.'
    }
    return null
  }

  const selectFile = (f) => {
    const err = validateFile(f)
    if (err) {
      setError(err)
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }

  const handleFileInput = (e) => {
    const f = e.target.files[0]
    if (f) selectFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) selectFile(f)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.')
      return
    }
    setUploading(true)
    setError('')
    try {
      await uploadDocument(botId, file)
      addToast('Document uploaded successfully', 'success')
      onUploaded()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Modal title="Upload Document" onClose={onClose}>
      <div className="space-y-4">
        {/* Drop zone */}
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[10px] px-6 py-10 text-center cursor-pointer transition-colors ${
              dragging
                ? 'border-[#F43F8C] bg-[#F43F8C]/5'
                : 'border-[#2A2A2F] hover:border-[#3a3a3f] hover:bg-[#1C1C20]'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C1C20] border border-[#2A2A2F] flex items-center justify-center">
                <Upload size={18} className="text-[#71717A]" />
              </div>
              <div>
                <p className="text-sm text-[#F5F5F5] font-medium">
                  Drag and drop your document here
                </p>
                <p className="text-xs text-[#71717A] mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-[#71717A]">
                PDF — max 20 MB
              </p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Selected file preview */}
        {file && (
          <div className="flex items-center gap-3 bg-[#1C1C20] border border-[#2A2A2F] rounded-lg px-4 py-3">
            <FileText size={16} className="text-[#F43F8C] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F5F5F5] truncate">{file.name}</p>
              <p className="text-xs text-[#71717A]">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            {!uploading && (
              <button
                onClick={removeFile}
                className="text-[#71717A] hover:text-[#F87171] transition-colors shrink-0"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {uploading && (
          <div className="text-sm text-[#A1A1AA] text-center py-1">
            Uploading and processing document...
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            loading={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
