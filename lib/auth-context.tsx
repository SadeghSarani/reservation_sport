'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole } from './types'
import { mockUsers } from './mock-data'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
    switchRole: (role: UserRole) => void // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const foundUser = mockUsers.find((u) => u.email === email)
        if (foundUser) {
            setUser(foundUser)
            setIsLoading(false)
            return true
        }

        setIsLoading(false)
        return false
    }, [])

    const logout = useCallback(() => {
        setUser(null)
    }, [])

    const register = useCallback(async (name: string, email: string, phone: string, _password: string): Promise<boolean> => {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if user already exists
        const existingUser = mockUsers.find((u) => u.email === email)
        if (existingUser) {
            setIsLoading(false)
            return false
        }

        // Create new user
        const newUser: User = {
            id: String(mockUsers.length + 1),
            name,
            email,
            phone,
            role: 'user',
            createdAt: new Date().toISOString().split('T')[0],
        }

        mockUsers.push(newUser)
        setUser(newUser)
        setIsLoading(false)
        return true
    }, [])

    // For demo: switch between roles
    const switchRole = useCallback((role: UserRole) => {
        const userWithRole = mockUsers.find((u) => u.role === role)
        if (userWithRole) {
            setUser(userWithRole)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register, switchRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
