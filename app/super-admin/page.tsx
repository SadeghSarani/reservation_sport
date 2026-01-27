'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockReservations, mockVenues, mockUsers, formatPrice, formatPersianDate } from '@/lib/mock-data'
import { reservationStatusLabels, sportTypeLabels, roleLabels } from '@/lib/types'
import Link from 'next/link'
import {
    Calendar,
    CreditCard,
    Building2,
    Users,
    TrendingUp,
    ArrowLeft,
    Activity,
} from 'lucide-react'

export default function SuperAdminDashboard() {
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0]
        const totalRevenue = mockReservations
            .filter((r) => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + r.totalPrice, 0)
        const thisMonthRevenue = mockReservations
            .filter((r) => {
                const date = new Date(r.date)
                const now = new Date()
                return r.paymentStatus === 'paid' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            })
            .reduce((sum, r) => sum + r.totalPrice, 0)

        return {
            totalReservations: mockReservations.length,
            todayReservations: mockReservations.filter((r) => r.date === today).length,
            pendingReservations: mockReservations.filter((r) => r.status === 'pending').length,
            totalVenues: mockVenues.length,
            activeVenues: mockVenues.filter((v) => v.isActive).length,
            totalUsers: mockUsers.length,
            totalRevenue,
            thisMonthRevenue,
        }
    }, [])

    const recentReservations = [...mockReservations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    const venueStats = mockVenues.slice(0, 5).map((venue) => {
        const venueReservations = mockReservations.filter((r) => r.venueId === venue.id)
        const revenue = venueReservations
            .filter((r) => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + r.totalPrice, 0)
        return {
            venue,
            reservations: venueReservations.length,
            revenue,
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">داشبورد مدیر کل</h1>
                <p className="text-muted-foreground">نمای کلی از عملکرد سیستم</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalReservations}</div>
                                <div className="text-sm text-muted-foreground">کل رزروها</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.activeVenues}/{stats.totalVenues}</div>
                                <div className="text-sm text-muted-foreground">سالن‌های فعال</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                <div className="text-sm text-muted-foreground">کاربران</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-xl font-bold">{formatPrice(stats.thisMonthRevenue)}</div>
                                <div className="text-sm text-muted-foreground">درآمد این ماه</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-yellow-500/5 border-yellow-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-yellow-600">{stats.pendingReservations}</div>
                                <div className="text-sm text-muted-foreground">در انتظار تایید</div>
                            </div>
                            <Activity className="w-8 h-8 text-yellow-500/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-blue-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-blue-600">{stats.todayReservations}</div>
                                <div className="text-sm text-muted-foreground">رزرو امروز</div>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</div>
                                <div className="text-sm text-muted-foreground">کل درآمد</div>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reservations */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>آخرین رزروها</CardTitle>
                        <Link href="/superadmin/reservations">
                            <Button variant="ghost" size="sm" className="gap-1">
                                مشاهده همه
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReservations.map((reservation) => {
                                const user = mockUsers.find((u) => u.id === reservation.userId)
                                const venue = mockVenues.find((v) => v.id === reservation.venueId)

                                return (
                                    <div
                                        key={reservation.id}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium truncate">{user?.name}</h4>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {venue?.name} - {formatPersianDate(reservation.date)}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={
                                            reservation.status === 'confirmed' ? 'border-green-500/30 text-green-600' :
                                                reservation.status === 'pending' ? 'border-yellow-500/30 text-yellow-600' :
                                                    'border-red-500/30 text-red-600'
                                        }>
                                            {reservationStatusLabels[reservation.status]}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Venue Performance */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>عملکرد سالن‌ها</CardTitle>
                        <Link href="/superadmin/venues">
                            <Button variant="ghost" size="sm" className="gap-1">
                                مشاهده همه
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {venueStats.map(({ venue, reservations, revenue }) => (
                                <div
                                    key={venue.id}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                                >
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary text-sm">
                      {sportTypeLabels[venue.sportType].charAt(0)}
                    </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{venue.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {reservations} رزرو
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-primary">{formatPrice(revenue)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
