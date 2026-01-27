'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { roleLabels } from '@/lib/types'
import {
    LayoutDashboard,
    Calendar,
    Building2,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Home,
    ChevronRight,
} from 'lucide-react'
import { Button } from './ui/button'

interface AdminSidebarProps {
    type: 'admin' | 'superadmin'
}

export function AdminSidebar({ type }: AdminSidebarProps) {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const adminLinks = [
        { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
        { href: '/admin/reservations', label: 'رزروها', icon: Calendar },
        { href: '/admin/venue', label: 'مدیریت سالن', icon: Building2 },
        { href: '/admin/settings', label: 'تنظیمات', icon: Settings },
    ]

    const superadminLinks = [
        { href: '/superadmin', label: 'داشبورد', icon: LayoutDashboard },
        { href: '/superadmin/venues', label: 'سالن‌ها', icon: Building2 },
        { href: '/superadmin/users', label: 'کاربران', icon: Users },
        { href: '/superadmin/reservations', label: 'رزروها', icon: Calendar },
        { href: '/superadmin/reports', label: 'گزارشات', icon: BarChart3 },
        { href: '/superadmin/settings', label: 'تنظیمات', icon: Settings },
    ]

    const links = type === 'admin' ? adminLinks : superadminLinks

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-sidebar-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v12M6 12h12" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-bold text-sidebar-foreground">اسپورت رزرو</span>
                        <span className="block text-xs text-sidebar-foreground/60">
              {type === 'admin' ? 'پنل مدیریت سالن' : 'پنل مدیر کل'}
            </span>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            {user && (
                <div className="p-4 border-b border-sidebar-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="font-bold text-sidebar-accent-foreground">
                {user.name.charAt(0)}
              </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.name}</div>
                            <div className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    )}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-2">
                <Link href="/">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                        <Home className="w-5 h-5" />
                        صفحه اصلی
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    خروج
                </Button>
            </div>
        </aside>
    )
}
