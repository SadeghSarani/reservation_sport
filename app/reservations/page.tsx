'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockReservations, mockVenues, formatPrice, formatPersianDate } from '@/lib/mock-data'
import { reservationStatusLabels, paymentStatusLabels, sportTypeLabels } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Calendar, Clock, MapPin, Plus } from 'lucide-react'

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

const paymentColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    paid: 'bg-green-500/10 text-green-600',
    failed: 'bg-red-500/10 text-red-600',
    refunded: 'bg-blue-500/10 text-blue-600',
}

export default function ReservationsPage() {
    const router = useRouter()
    const { user } = useAuth()

    if (!user) {
        router.push('/login')
        return null
    }

    const userReservations = mockReservations
        .filter((r) => r.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">رزروهای من</h1>
                            <p className="text-muted-foreground">مشاهده و مدیریت رزروهای شما</p>
                        </div>
                        <Link href="/venues">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                رزرو جدید
                            </Button>
                        </Link>
                    </div>

                    {userReservations.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">رزروی ندارید</h2>
                                <p className="text-muted-foreground mb-6">
                                    هنوز هیچ رزروی انجام نداده‌اید. همین الان شروع کنید!
                                </p>
                                <Link href="/venues">
                                    <Button>مشاهده سالن‌ها</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {userReservations.map((reservation) => {
                                const venue = mockVenues.find((v) => v.id === reservation.venueId)
                                if (!venue) return null

                                return (
                                    <Card key={reservation.id} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Venue Info */}
                                                <div className="md:w-1/3 p-6 bg-muted/30">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-primary">
                                {sportTypeLabels[venue.sportType].charAt(0)}
                              </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-foreground">{venue.name}</h3>
                                                            <p className="text-sm text-muted-foreground">{sportTypeLabels[venue.sportType]}</p>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{venue.city}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reservation Details */}
                                                <div className="flex-1 p-6">
                                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge variant="outline" className={statusColors[reservation.status]}>
                                                                {reservationStatusLabels[reservation.status]}
                                                            </Badge>
                                                            <Badge variant="secondary" className={paymentColors[reservation.paymentStatus]}>
                                                                {paymentStatusLabels[reservation.paymentStatus]}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {reservation.type === 'hourly' ? 'ساعتی' : 'ماهیانه'}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-lg font-bold text-primary">
                                                                {formatPrice(reservation.totalPrice)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{formatPersianDate(reservation.date)}</span>
                                                        </div>
                                                        {reservation.type === 'hourly' && reservation.startTime && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{reservation.startTime} - {reservation.endTime}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              ثبت شده در: {formatPersianDate(reservation.createdAt)}
                            </span>
                                                        {reservation.status === 'pending' && reservation.paymentStatus === 'pending' && (
                                                            <Button size="sm">پرداخت</Button>
                                                        )}
                                                        {reservation.status === 'confirmed' && (
                                                            <Button size="sm" variant="outline">لغو رزرو</Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
