'use client'

import {useEffect, useMemo, useState} from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    mockReservations,
    mockVenues,
    mockUsers,
    formatPrice,
    formatPersianDate,
    formatPersianDateWithHour
} from '@/lib/mock-data'
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
import {userApi} from "@/app/api/services/user.api";

const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
    confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    completed: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
}

const statCards = [
    {
        key: 'total',
        label: 'کل رزروها',
        icon: Calendar,
        colorClass: 'text-violet-400',
        bgClass: 'bg-violet-500/10',
        format: (v: any) => v,
    },
    {
        key: 'today',
        label: 'رزرو امروز',
        icon: Clock,
        colorClass: 'text-sky-400',
        bgClass: 'bg-sky-500/10',
        format: (v: any) => v,
    },
    {
        key: 'pending',
        label: 'در انتظار تایید',
        icon: TrendingUp,
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10',
        format: (v: any) => v,
    },
    {
        key: 'thisMonthRevenue',
        label: 'درآمد این ماه',
        icon: CreditCard,
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        format: (v: any) => formatPrice(v),
    },
]

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState<any>({})
    const [recentReservations, setRecentReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await userApi.getAdminDashboardData()
                setStats(response.data.stats ?? {})
                setRecentReservations(response.data.recentReservations ?? [])
            } catch (error) {
                console.error('Failed to load dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const venue = useMemo(() => {
        if (!user?.managedVenueId) return mockVenues[0]
        return mockVenues.find((v) => v.id === user.managedVenueId) || mockVenues[0]
    }, [user])

    const venueReservations = useMemo(() => {
        return mockReservations.filter((r) => r.venueId === venue?.id)
    }, [venue])

    return (
        <div className="space-y-8 p-1">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    داشبورد مدیریت
                </h1>
                <p className="text-sm text-muted-foreground">
                    {venue?.name} — خوش آمدید
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ key, label, icon: Icon, colorClass, bgClass, format }) => (
                    <Card
                        key={key}
                        className="border border-border/50 bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6">
                                {/* Icon */}
                                <div className={`w-11 m-2 h-11 ${bgClass} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${colorClass}`} />
                                </div>
                                {/* Number + label */}
                                <div className="flex flex-col gap-1.5">
                        <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight leading-none">
                            {loading ? (
                                <span className="inline-block w-20 h-7 bg-muted animate-pulse rounded" />
                            ) : (
                                format(stats[key] ?? 0)
                            )}
                        </span>
                                    <span className="text-sm text-muted-foreground">
                            {label}
                        </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="border border-border/50 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
                            <CardTitle className="text-base font-semibold text-foreground">
                                آخرین رزروها
                            </CardTitle>
                            <Link href="/admin/reservations">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    مشاهده همه
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : recentReservations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2">
                                    <Calendar className="w-8 h-8 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">رزروی وجود ندارد</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentReservations.map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="group flex items-center gap-4 p-3.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors duration-150 border border-transparent hover:border-border/40"
                                        >
                                            {/* Avatar */}
                                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
                                                <span className="font-semibold text-primary text-sm leading-none">
                                                    {reservation.user?.name?.charAt(0) ?? '?'}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-foreground truncate">
                                                    {reservation.user?.name || 'کاربر ناشناس'}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                                                    <span>{formatPersianDate(reservation.created_at)}</span>
                                                    {reservation.start_at && (
                                                        <>
                                                            <span className="text-border">·</span>
                                                            <span>{formatPersianDateWithHour(reservation.start_at)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <Badge
                                                variant="outline"
                                                className={`text-xs font-medium px-2 py-0.5 ${statusColors[reservation.status]}`}
                                            >
                                                {reservationStatusLabels[reservation.status]}
                                            </Badge>

                                            {/* Price */}
                                            <div className="text-left flex-shrink-0">
                                                <span className="text-sm font-semibold text-foreground tabular-nums">
                                                    {formatPrice(reservation.total_price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}