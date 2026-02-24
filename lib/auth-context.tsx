'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from './types'
import { authApi } from '@/app/api/services/auth.api'
import { getToken, removeToken } from '@/app/api/tokenManager'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
    switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Load user on mount if token exists
    useEffect(() => {
        const token = getToken()
        console.log(token)
        if (token) {
            setIsLoading(true)
            authApi
                .getProfile()
                .then((res) => setUser(res.user))
                .catch(() => removeToken())
                .finally(() => setIsLoading(false))
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const res = await authApi.login(email, password)
            if (!res.success) return false

            setUser(res.user)
            return true
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        removeToken()
        setUser(null)
    }, [])

    const register = useCallback(async (name: string, email: string, phone: string,password: string) => {
        setIsLoading(true)
        try {
            const res = await authApi.register(name, email, phone , password)
            if (!res.success) return false

            setUser(res.user)
            return true
        } finally {
            setIsLoading(false)
        }
    }, [])

    const switchRole = useCallback((role: UserRole) => {
        if (user) setUser({ ...user, role })
    }, [user])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register, switchRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
