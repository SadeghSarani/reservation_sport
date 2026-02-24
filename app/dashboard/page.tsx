'use client'

import Link from 'next/link'
import { useEffect, useState } from "react"
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {mockVenues, formatPrice, formatPersianDate, formatPersianDateWithHour} from '@/lib/mock-data'
import { reservationStatusLabels, sportTypeLabels } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Calendar, CreditCard, Clock, MapPin, ArrowLeft, User } from 'lucide-react'
import { userApi } from "@/app/api/services/user.api"

export default function UserDashboard() {

    const { user, isLoading } = useAuth()

    const [totalSpent, setTotalSpent] = useState<number>(0)
    const [userReservations, setUserReservations] = useState<number>(0)
    const [recentReservations, setRecentReservations] = useState<any[]>([])
    const [upcomingReservations, setUpcomingReservations] = useState<any[]>([])
    const [dashboardLoading, setDashboardLoading] = useState<boolean>(true)

    useEffect(() => {

        if (!user) return

        const fetchDashboardData = async () => {
            try {
                setDashboardLoading(true)

                const response = await userApi.getUserDashboardData()

                setUserReservations(response?.data?.all_reservationCount ?? 0)
                setTotalSpent(response?.data?.reservation_price_paid ?? 0)
                setRecentReservations(response?.data?.last_reservation ?? [])
                setUpcomingReservations(response?.data?.future_reservation ?? 0)

            } catch (error) {
                console.error("Dashboard fetch error:", error)
            } finally {
                setDashboardLoading(false)
            }
        }

        fetchDashboardData()

    }, [user])

    // 🔒 Wait until auth finishes initializing
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    // 🔒 If no user after auth → unauthorized
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Unauthorized</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">

                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground mb-1">
                            سلام، {user.name}
                        </h1>
                        <p className="text-muted-foreground">
                            خوش آمدید به پنل کاربری شما
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4 m-4">
                                <Calendar className="w-6 h-6 text-primary" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        {dashboardLoading ? '...' : userReservations}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        کل رزروها
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4 m-3">
                                <Clock className="w-6 h-6 text-green-600" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        {dashboardLoading ? '...' : upcomingReservations}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        رزروهای پیش رو
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4 m-3">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                                <div>
                                    <div className="text-2xl font-bold">
                                        {dashboardLoading ? '...' : formatPrice(totalSpent)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        مجموع پرداخت‌ها
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4 m-4">
                                <User className="w-6 h-6 text-orange-600" />
                                <div>
                                    <div className="text-lg font-bold truncate">
                                        {user.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {user.phone}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Recent Reservations */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>آخرین رزروها</CardTitle>
                                    <Link href="/reservations">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            مشاهده همه
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardHeader>

                                <CardContent>

                                    {dashboardLoading ? (
                                        <p>Loading reservations...</p>
                                    ) : recentReservations.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground mb-4">
                                                رزروی ندارید
                                            </p>
                                            <Link href="/venues">
                                                <Button>رزرو سالن</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentReservations.map((reservation) => {
                                                return (
                                                    <div
                                                        key={reservation.id}
                                                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                                                    >
                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <span className="font-bold text-primary">
                                                                {sportTypeLabels[reservation.venue.type]?.charAt(0)}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">
                                                                {reservation.venue.name}
                                                            </h4>

                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>
                                                                    {formatPersianDate(reservation.start_at)}
                                                                </span>

                                                                {reservation.start_at && (
                                                                    <>
                                                                        <span>|</span>
                                                                        <span>{formatPersianDateWithHour(reservation.start_at)}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-left">
                                                            <div className="text-sm font-medium text-primary">
                                                                {formatPrice(reservation.total_price)}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {reservationStatusLabels[reservation.status]}
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

                        {/* Quick Links + Upcoming */}
                        <div className="space-y-4">

                            <Card>
                                <CardHeader>
                                    <CardTitle>دسترسی سریع</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href="/venues">
                                        <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            مشاهده سالن‌ها
                                        </Button>
                                    </Link>

                                    <Link href="/reservations">
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Calendar className="w-4 h-4" />
                                            رزروهای من
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {!dashboardLoading && upcomingReservations.length > 0 && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-primary">
                                            رزرو بعدی شما
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        {(() => {
                                            const next = upcomingReservations[0]
                                            const venue = mockVenues.find(
                                                (v) => v.id === next.venueId
                                            )

                                            if (!venue) return null

                                            return (
                                                <div>
                                                    <h4 className="font-medium">
                                                        {venue.name}
                                                    </h4>

                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {formatPersianDate(next.date)}
                                                        {next.startTime && ` - ساعت ${next.startTime}`}
                                                    </p>

                                                    <Link href={`/venues/${venue.id}`}>
                                                        <Button size="sm" className="w-full">
                                                            مشاهده جزئیات
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>
                            )}

                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}