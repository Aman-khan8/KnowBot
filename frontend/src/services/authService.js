import api from './api'

/**
 * POST /api/users/signup
 * Body: { name, email, password }
 * Response data: { user: { id, name, email } }
 */
export const signup = async (name, email, password) => {
  const res = await api.post('/users/signup', { name, email, password })
  return res.data // { statuscode, status, message, data: { user } }
}

/**
 * POST /api/users/login
 * Body: { email, password }
 * Response data: { user: { id } }
 * Sets httpOnly cookie automatically.
 */
export const login = async (email, password) => {
  const res = await api.post('/users/login', { email, password })
  return res.data // { statuscode, status, message, data: { user } }
}
