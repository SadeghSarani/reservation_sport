'use client'

import React from "react"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SuperAdminLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Check authentication
    if (!user) {
        router.push('/login')
        return null
    }

    // Check role
    if (user.role !== 'superadmin') {
        router.push('/')
        return null
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AdminSidebar type="superadmin" />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="w-64"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AdminSidebar type="superadmin" />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <span className="font-semibold">پنل مدیر کل</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
