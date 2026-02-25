'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockReservations, mockVenues, mockUsers, formatPrice } from '@/lib/mock-data'
import { sportTypeLabels, type SportType } from '@/lib/types'
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    CreditCard,
    Building2,
    Users,
    BarChart3,
} from 'lucide-react'

export default function SuperAdminReportsPage() {
    const stats = useMemo(() => {
        const now = new Date()
        const thisMonth = now.getMonth()
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
        const thisYear = now.getFullYear()
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear

        const thisMonthReservations = mockReservations.filter((r) => {
            const date = new Date(r.date)
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear
        })

        const lastMonthReservations = mockReservations.filter((r) => {
            const date = new Date(r.date)
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        })

        const thisMonthRevenue = thisMonthReservations
            .filter((r) => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + r.totalPrice, 0)

        const lastMonthRevenue = lastMonthReservations
            .filter((r) => r.paymentStatus === 'paid')
            .reduce((sum, r) => sum + r.totalPrice, 0)

        const revenueGrowth = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 100

        const reservationGrowth = lastMonthReservations.length > 0
            ? ((thisMonthReservations.length - lastMonthReservations.length) / lastMonthReservations.length) * 100
            : 100

        // Sport stats
        const sportStats = (Object.keys(sportTypeLabels) as SportType[]).map((sport) => {
            const venues = mockVenues.filter((v) => v.sportType === sport)
            const reservations = mockReservations.filter((r) =>
                venues.some((v) => v.id === Number(r.venueId))
            )
            const revenue = reservations
                .filter((r) => r.paymentStatus === 'paid')
                .reduce((sum, r) => sum + r.totalPrice, 0)

            return {
                sport,
                label: sportTypeLabels[sport],
                venues: venues.length,
                reservations: reservations.length,
                revenue,
            }
        }).sort((a, b) => b.revenue - a.revenue)

        // Top venues
        const venueStats = mockVenues.map((venue) => {
            const reservations = mockReservations.filter((r) => Number(r.venueId) === venue.id)
            const revenue = reservations
                .filter((r) => r.paymentStatus === 'paid')
                .reduce((sum, r) => sum + r.totalPrice, 0)

            return {
                venue,
                reservations: reservations.length,
                revenue,
            }
        }).sort((a, b) => b.revenue - a.revenue)

        // Status breakdown
        const statusStats = {
            confirmed: mockReservations.filter((r) => r.status === 'confirmed').length,
            pending: mockReservations.filter((r) => r.status === 'pending').length,
            completed: mockReservations.filter((r) => r.status === 'completed').length,
            cancelled: mockReservations.filter((r) => r.status === 'cancelled').length,
        }

        return {
            thisMonthRevenue,
            lastMonthRevenue,
            revenueGrowth,
            thisMonthReservations: thisMonthReservations.length,
            lastMonthReservations: lastMonthReservations.length,
            reservationGrowth,
            sportStats,
            venueStats,
            statusStats,
            totalRevenue: mockReservations
                .filter((r) => r.paymentStatus === 'paid')
                .reduce((sum, r) => sum + r.totalPrice, 0),
        }
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">گزارشات و آمار</h1>
                <p className="text-muted-foreground">تحلیل عملکرد و آمار سیستم</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">درآمد این ماه</p>
                                <p className="text-2xl font-bold mt-1">{formatPrice(stats.thisMonthRevenue)}</p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{Math.abs(stats.revenueGrowth).toFixed(0)}%</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            ماه قبل: {formatPrice(stats.lastMonthRevenue)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">رزروهای این ماه</p>
                                <p className="text-2xl font-bold mt-1">{stats.thisMonthReservations}</p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stats.reservationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.reservationGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{Math.abs(stats.reservationGrowth).toFixed(0)}%</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            ماه قبل: {stats.lastMonthReservations} رزرو
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">کل درآمد</p>
                                <p className="text-2xl font-bold mt-1">{formatPrice(stats.totalRevenue)}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-primary/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">کل رزروها</p>
                                <p className="text-2xl font-bold mt-1">{mockReservations.length}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-primary/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        وضعیت رزروها
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="text-3xl font-bold text-green-600">{stats.statusStats.confirmed}</div>
                            <div className="text-sm text-muted-foreground">تایید شده</div>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="text-3xl font-bold text-yellow-600">{stats.statusStats.pending}</div>
                            <div className="text-sm text-muted-foreground">در انتظار</div>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="text-3xl font-bold text-blue-600">{stats.statusStats.completed}</div>
                            <div className="text-sm text-muted-foreground">تکمیل شده</div>
                        </div>
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="text-3xl font-bold text-red-600">{stats.statusStats.cancelled}</div>
                            <div className="text-sm text-muted-foreground">لغو شده</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Sport */}
                <Card>
                    <CardHeader>
                        <CardTitle>عملکرد بر اساس رشته ورزشی</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.sportStats.map((stat) => (
                                <div key={stat.sport} className="flex items-center gap-4">
                                    <div className="w-24 font-medium">{stat.label}</div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{
                                                    width: `${(stat.revenue / (stats.totalRevenue || 1)) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-32 text-left text-sm">
                                        <div className="font-medium">{formatPrice(stat.revenue)}</div>
                                        <div className="text-xs text-muted-foreground">{stat.reservations} رزرو</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Venues */}
                <Card>
                    <CardHeader>
                        <CardTitle>برترین سالن‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.venueStats.slice(0, 5).map((stat, index) => (
                                <div key={stat.venue.id} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{stat.venue.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {sportTypeLabels[stat.venue.sportType]} | {stat.reservations} رزرو
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-primary">{formatPrice(stat.revenue)}</div>
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
