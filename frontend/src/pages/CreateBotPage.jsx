import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBot } from '../services/botService'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import PageHeader from '../components/ui/PageHeader'

export default function CreateBotPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  // Backend expects: { name, businessName, des }
  const [form, setForm] = useState({ name: '', businessName: '', des: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Bot name is required'
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
    setLoading(true)
    try {
      const res = await createBot(form.name, form.businessName, form.des)
      addToast('Bot created successfully', 'success')
      // Navigate to the new bot's documents page
      navigate(`/bots/${res.data.id}/documents`)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Create Bot"
        description="Set up a new AI knowledge bot for your business."
      />

      <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="name"
            name="name"
            label="Bot Name"
            placeholder="e.g. Customer Support Bot"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
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
            id="des"
            name="des"
            label="Description"
            placeholder="Briefly describe what this bot does..."
            value={form.des}
            onChange={handleChange}
            error={errors.des}
            textarea
            rows={3}
          />

          {apiError && <ErrorMessage message={apiError} />}

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/bots')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              {loading ? 'Creating...' : 'Create Bot'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
