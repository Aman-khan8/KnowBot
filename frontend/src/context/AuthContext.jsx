import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Stores the user object as returned by the backend:
 * login response: data.user = { id }
 * signup response: data.user = { id, name, email }
 * We store whatever the backend returns without transformation.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kb_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const saveUser = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('kb_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('kb_user')
    }
  }

  const logout = () => {
    saveUser(null)
    // The httpOnly cookie lives on the backend side; clearing local state
    // is enough to "log out" from the frontend perspective.
    // A real /logout endpoint could clear the cookie server-side.
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
