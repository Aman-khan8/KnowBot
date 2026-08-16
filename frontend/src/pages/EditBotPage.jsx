import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAllBots, updateBot } from '../services/botService'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import PageHeader from '../components/ui/PageHeader'
import { Skeleton } from '../components/ui/Skeleton'

export default function EditBotPage() {
  const { botId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [bot, setBot] = useState(null)
  const [loadingBot, setLoadingBot] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // Backend update expects: { botId, botName, businessName, description }
  const [form, setForm] = useState({ botName: '', businessName: '', description: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // The backend has no single-bot GET endpoint.
    // We fetch all bots and find the one matching botId.
    const fetchBot = async () => {
      try {
        const res = await getAllBots()
        const found = (res.data || []).find((b) => String(b.id) === String(botId))
        if (!found) {
          setFetchError('Bot not found.')
          return
        }
        setBot(found)
        setForm({
          botName: found.name || '',
          businessName: found.business_name || '',
          description: found.description || '',
        })
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setLoadingBot(false)
      }
    }
    fetchBot()
  }, [botId])

  const validate = () => {
    const e = {}
    if (!form.botName.trim()) e.botName = 'Bot name is required'
    if (!form.businessName.trim()) e.businessName = 'Business name is required'
    return e
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      await updateBot(botId, form.botName, form.businessName, form.description)
      addToast('Changes saved successfully', 'success')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadingBot) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-xl">
        <ErrorMessage message={fetchError} />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/bots')}
        >
          Back to Bots
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Bot Settings"
        description={`Edit settings for ${bot?.name || 'this bot'}.`}
      />

      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="botName"
            name="botName"
            label="Bot Name"
            placeholder="e.g. Customer Support Bot"
            value={form.botName}
            onChange={handleChange}
            error={errors.botName}
          />
          <Input
            id="businessName"
            name="businessName"
            label="Business Name"
            placeholder="e.g. Acme Corp"
            value={form.businessName}
            onChange={handleChange}
            error={errors.businessName}
          />
          <Input
            id="description"
            name="description"
            label="Description"
            placeholder="Describe what this bot does..."
            value={form.description}
            onChange={handleChange}
            error={errors.description}
            textarea
            rows={3}
          />

          {apiError && <ErrorMessage message={apiError} />}

          <div className="flex items-center justify-between pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(`/bots/${botId}/documents`)}
              disabled={saving}
            >
              ← Documents
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/bots')}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
