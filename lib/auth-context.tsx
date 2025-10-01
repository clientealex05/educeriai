"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type User, mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, role: string) => {
    // Simple mock authentication
    const foundUser = mockUsers.find((u) => u.email === email && u.role === role)
    if (foundUser) {
      setUser(foundUser)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
