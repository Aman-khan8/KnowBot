import api from './api'

/**
 * GET /api/bots/getallbots
 * Response data: array of bot rows
 * Bot row fields: id, user_id, name, business_name, description, created_at, updated_at
 */
export const getAllBots = async () => {
  const res = await api.get('/bots/getallbots')
  return res.data // { statuscode, status, message, data: [...] }
}

/**
 * POST /api/bots/createbot
 * Body: { name, businessName, des }
 * Response data: created bot row
 */
export const createBot = async (name, businessName, des) => {
  const res = await api.post('/bots/createbot', { name, businessName, des })
  return res.data
}

/**
 * PATCH /api/bots/updatebot
 * Body: { botId, botName, businessName, description }
 * Response data: updated rows
 */
export const updateBot = async (botId, botName, businessName, description) => {
  const res = await api.patch('/bots/updatebot', {
    botId,
    botName,
    businessName,
    description,
  })
  return res.data
}

/**
 * DELETE /api/bots/deletebot
 * Body: { botId }
 */
export const deleteBot = async (botId) => {
  const res = await api.delete('/bots/deletebot', { data: { botId } })
  return res.data
}
