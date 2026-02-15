'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { roleLabels } from '@/lib/types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()

    const getDashboardLink = () => {
        if (!user) return '/login'
        if (user.role === 'superadmin') return '/superadmin'
        if (user.role === 'venue_admin') return '/admin'
        return '/dashboard'
    }

    return (
        <header className="sticky top-0 z-50 glass border-b border-border/50 transition-all duration-300">
            <nav className="container mx-auto px-4">
                <div className="flex h-18 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                            <Zap className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-foreground">اسپورت رزرو</span>
                            <span className="text-[10px] text-muted-foreground -mt-1">رزرو آنلاین ورزشی</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/venues" className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200">
                            سالن‌های ورزشی
                        </Link>
                        <Link href="/about" className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200">
                            درباره ما
                        </Link>
                        <Link href="/contact" className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-200">
                            تماس با ما
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <User className="w-4 h-4" />
                                        <span>{user.name}</span>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {roleLabels[user.role]}
                    </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem asChild>
                                        <Link href={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span>داشبورد</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/reservations" className="flex items-center gap-2 cursor-pointer">
                                            <Calendar className="w-4 h-4" />
                                            <span>رزروهای من</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {/* Demo: Role switcher */}
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground">تغییر نقش (دمو):</div>
                                    <DropdownMenuItem onClick={() => switchRole('user')} className="cursor-pointer">
                                        کاربر عادی
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => switchRole('admin')} className="cursor-pointer">
                                        مدیر سالن
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => switchRole('superadmin')} className="cursor-pointer">
                                        مدیر کل
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                                        <LogOut className="w-4 h-4 ml-2" />
                                        <span>خروج</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">ورود</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>ثبت نام</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/venues"
                                className="text-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                سالن‌های ورزشی
                            </Link>
                            <Link
                                href="/about"
                                className="text-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                درباره ما
                            </Link>
                            <Link
                                href="/contact"
                                className="text-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                تماس با ما
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-border">
                                {user ? (
                                    <>
                                        <div className="text-sm text-muted-foreground">
                                            {user.name} - {roleLabels[user.role]}
                                        </div>
                                        <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full bg-transparent">داشبورد</Button>
                                        </Link>
                                        <Button variant="destructive" onClick={logout} className="w-full">
                                            خروج
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full bg-transparent">ورود</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full">ثبت نام</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
