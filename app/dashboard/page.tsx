'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {mockReservations, mockVenues, formatPrice, formatPersianDate, mockUsers} from '@/lib/mock-data'
import { reservationStatusLabels, sportTypeLabels } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Calendar, CreditCard, Clock, MapPin, ArrowLeft, User } from 'lucide-react'
import {useState} from "react";

export default function UserDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(mockUsers[3])

    if (!user) {
        router.push('/login')
        return null
    }

    const userReservations = mockReservations.filter((r) => r.userId === user.id)
    const upcomingReservations = userReservations.filter(
        (r) => r.status === 'confirmed' && new Date(r.date) >= new Date()
    )
    const totalSpent = userReservations
        .filter((r) => r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + r.totalPrice, 0)

    const recentReservations = [...userReservations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)

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
                        <p className="text-muted-foreground">خوش آمدید به پنل کاربری شما</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{userReservations.length}</div>
                                        <div className="text-sm text-muted-foreground">کل رزروها</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{upcomingReservations.length}</div>
                                        <div className="text-sm text-muted-foreground">رزروهای پیش رو</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
                                        <div className="text-sm text-muted-foreground">مجموع پرداخت‌ها</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                        <User className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold truncate">{user.email}</div>
                                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
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
                                    {recentReservations.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-muted-foreground mb-4">رزروی ندارید</p>
                                            <Link href="/venues">
                                                <Button>رزرو سالن</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recentReservations.map((reservation) => {
                                                const venue = mockVenues.find((v) => v.id === reservation.venueId)
                                                if (!venue) return null

                                                return (
                                                    <div
                                                        key={reservation.id}
                                                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                                                    >
                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-primary">
                                {sportTypeLabels[venue.sportType].charAt(0)}
                              </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">{venue.name}</h4>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{formatPersianDate(reservation.date)}</span>
                                                                {reservation.startTime && (
                                                                    <>
                                                                        <span>|</span>
                                                                        <span>{reservation.startTime}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-medium text-primary">
                                                                {formatPrice(reservation.totalPrice)}
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

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>دسترسی سریع</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href="/venues" className="block">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                            <MapPin className="w-4 h-4" />
                                            مشاهده سالن‌ها
                                        </Button>
                                    </Link>
                                    <Link href="/reservations" className="block">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                                            <Calendar className="w-4 h-4" />
                                            رزروهای من
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Upcoming */}
                            {upcomingReservations.length > 0 && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-primary">رزرو بعدی شما</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {(() => {
                                            const next = upcomingReservations[0]
                                            const venue = mockVenues.find((v) => v.id === next.venueId)
                                            if (!venue) return null

                                            return (
                                                <div>
                                                    <h4 className="font-medium">{venue.name}</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {formatPersianDate(next.date)}
                                                        {next.startTime && ` - ساعت ${next.startTime}`}
                                                    </p>
                                                    <Link href={`/venues/${venue.id}`}>
                                                        <Button size="sm" className="w-full">مشاهده جزئیات</Button>
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
