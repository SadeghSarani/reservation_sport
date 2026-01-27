'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockReservations, mockVenues, mockUsers, formatPrice, formatPersianDate } from '@/lib/mock-data'
import { reservationStatusLabels, paymentStatusLabels } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import {
    Calendar,
    CreditCard,
    Clock,
    TrendingUp,
    ArrowLeft,
    CheckCircle,
    XCircle,
} from 'lucide-react'

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

export default function AdminDashboard() {
    const { user } = useAuth()

    // Get venue managed by this admin
    const venue = useMemo(() => {
        if (!user?.managedVenueId) {
            // If no managed venue, show first venue for demo
            return mockVenues[0]
        }
        return mockVenues.find((v) => v.id === user.managedVenueId) || mockVenues[0]
    }, [user])

    // Get reservations for this venue
    const venueReservations = useMemo(() => {
        return mockReservations.filter((r) => r.venueId === venue?.id)
    }, [venue])

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0]
        const todayReservations = venueReservations.filter((r) => r.date === today)
        const pendingReservations = venueReservations.filter((r) => r.status === 'pending')
        const totalRevenue = venueReservations
            .filter((r) => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + r.totalPrice, 0)
        const thisMonthRevenue = venueReservations
            .filter((r) => {
                const date = new Date(r.date)
                const now = new Date()
                return r.paymentStatus === 'paid' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            })
            .reduce((sum, r) => sum + r.totalPrice, 0)

        return {
            total: venueReservations.length,
            today: todayReservations.length,
            pending: pendingReservations.length,
            totalRevenue,
            thisMonthRevenue,
        }
    }, [venueReservations])

    const recentReservations = [...venueReservations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

    const pendingReservations = venueReservations
        .filter((r) => r.status === 'pending')
        .slice(0, 3)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">داشبورد مدیریت</h1>
                <p className="text-muted-foreground">
                    {venue?.name} - خوش آمدید
                </p>
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
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <div className="text-sm text-muted-foreground">کل رزروها</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.today}</div>
                                <div className="text-sm text-muted-foreground">رزرو امروز</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                                <div className="text-sm text-muted-foreground">در انتظار تایید</div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Reservations */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>آخرین رزروها</CardTitle>
                            <Link href="/admin/reservations">
                                <Button variant="ghost" size="sm" className="gap-1">
                                    مشاهده همه
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentReservations.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">رزروی وجود ندارد</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentReservations.map((reservation) => {
                                        const reservationUser = mockUsers.find((u) => u.id === reservation.userId)

                                        return (
                                            <div
                                                key={reservation.id}
                                                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                                            >
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary text-sm">
                            {reservationUser?.name.charAt(0) || '?'}
                          </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">
                                                        {reservationUser?.name || 'کاربر ناشناس'}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{formatPersianDate(reservation.date)}</span>
                                                        {reservation.startTime && (
                                                            <>
                                                                <span>|</span>
                                                                <span>{reservation.startTime}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={statusColors[reservation.status]}>
                                                    {reservationStatusLabels[reservation.status]}
                                                </Badge>
                                                <div className="text-left">
                                                    <div className="font-medium text-primary">
                                                        {formatPrice(reservation.totalPrice)}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Actions */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>در انتظار تایید</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingReservations.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4 text-sm">
                                    همه رزروها بررسی شده‌اند
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {pendingReservations.map((reservation) => {
                                        const reservationUser = mockUsers.find((u) => u.id === reservation.userId)

                                        return (
                                            <div key={reservation.id} className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-sm">{reservationUser?.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                            {formatPersianDate(reservation.date)}
                          </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" className="flex-1 gap-1 text-green-600 border-green-600/30 hover:bg-green-500/10 bg-transparent">
                                                        <CheckCircle className="w-3 h-3" />
                                                        تایید
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="flex-1 gap-1 text-red-600 border-red-600/30 hover:bg-red-500/10 bg-transparent">
                                                        <XCircle className="w-3 h-3" />
                                                        رد
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                آمار کلی
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">کل درآمد:</span>
                                <span className="font-bold text-primary">{formatPrice(stats.totalRevenue)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">نرخ تکمیل:</span>
                                <span className="font-medium">
                  {stats.total > 0
                      ? Math.round(
                          (venueReservations.filter((r) => r.status === 'completed').length / stats.total) * 100
                      )
                      : 0}
                                    %
                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">نرخ لغو:</span>
                                <span className="font-medium">
                  {stats.total > 0
                      ? Math.round(
                          (venueReservations.filter((r) => r.status === 'cancelled').length / stats.total) * 100
                      )
                      : 0}
                                    %
                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
