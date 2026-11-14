import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { insforge, getSessionUser, isAdminUser } from '../lib/insforge'

const AdminCtx = createContext(null)

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const u = await getSessionUser()
    setUser(u)
    setIsAdmin(u ? await isAdminUser(u) : false)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const logout = async () => {
    await insforge.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AdminCtx.Provider value={{ user, isAdmin, loading, refresh, logout }}>
      {children}
    </AdminCtx.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminCtx)
}
