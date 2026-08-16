import axios from 'axios'

// All requests go to /api — proxied to http://localhost:3000 in dev
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send httpOnly cookie on every request
})

// Response interceptor — unwrap ApiResponse or surface a clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract the backend message from ApiResponse shape: { statuscode, status, message, data }
    const message =
      error.response?.data?.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

export default api
