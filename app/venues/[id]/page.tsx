'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockVenues, formatPrice, generateTimeSlots } from '@/lib/mock-data'
import { sportTypeLabels, persianDays } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { MapPin, Clock, Users, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@radix-ui/react-tabs";

// Generate dates for the next 7 days
function getNextDays(count: number) {
    const days = []
    const today = new Date()
    for (let i = 0; i < count; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        days.push({
            date: date.toISOString().split('T')[0],
            dayName: persianDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
            dayNumber: new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(date),
            monthName: new Intl.DateTimeFormat('fa-IR', { month: 'short' }).format(date),
            isToday: i === 0,
        })
    }
    return days
}

const sportGradients: Record<string, string> = {
    futsal: 'from-emerald-500 to-emerald-600',
    volleyball: 'from-orange-500 to-orange-600',
    basketball: 'from-amber-500 to-amber-600',
    badminton: 'from-sky-500 to-sky-600',
    gym: 'from-rose-500 to-rose-600',
}

export default function VenueDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const venue = mockVenues.find((v) => v.id === params.id)

    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [reservationType, setReservationType] = useState<'hourly' | 'monthly'>('hourly')

    const days = useMemo(() => getNextDays(7), [])
    const timeSlots = useMemo(() => {
        if (!venue || !selectedDate) return []
        return generateTimeSlots(venue, selectedDate)
    }, [venue, selectedDate])

    if (!venue) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-4">سالن یافت نشد</h1>
                        <Link href="/venues">
                            <Button>بازگشت به لیست سالن‌ها</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const handleReserve = () => {
        if (!user) {
            router.push('/login')
            return
        }

        if (reservationType === 'hourly' && (!selectedDate || !selectedTime)) {
            return
        }

        // Navigate to payment/confirmation page
        router.push(
            `/payment?venueId=${venue.id}&type=${reservationType}&date=${selectedDate}&time=${selectedTime}`
        )
    }

    const totalPrice = reservationType === 'hourly' ? venue.hourlyPrice : venue.monthlyPrice

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">خانه</Link>
                        <ChevronLeft className="w-4 h-4" />
                        <Link href="/venues" className="hover:text-foreground">سالن‌ها</Link>
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-foreground">{venue.name}</span>
                    </nav>
                </div>

                {/* Hero */}
                <section className={`bg-gradient-to-br ${sportGradients[venue.sportType]} py-12`}>
                    <div className="container mx-auto px-4">
                        <Badge variant="secondary" className="bg-white/90 text-foreground mb-4">
                            {sportTypeLabels[venue.sportType]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{venue.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span>{venue.address}، {venue.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{venue.openTime} - {venue.closeTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>ظرفیت: {venue.capacity} نفر</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>درباره سالن</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
                                    </CardContent>
                                </Card>

                                {/* Amenities */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>امکانات</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {venue.amenities.map((amenity) => (
                                                <Badge key={amenity} variant="secondary" className="gap-1">
                                                    <Check className="w-3 h-3" />
                                                    {amenity}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Booking Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>رزرو سالن</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Reservation Type */}
                                        <Tabs value={reservationType} onValueChange={(v) => setReservationType(v as 'hourly' | 'monthly')}>
                                            <TabsList className="w-full">
                                                <TabsTrigger value="hourly" className="flex-1">رزرو ساعتی</TabsTrigger>
                                                <TabsTrigger value="monthly" className="flex-1">رزرو ماهیانه</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="hourly" className="space-y-6 mt-6">
                                                {/* Date Selection */}
                                                <div>
                                                    <h4 className="font-medium mb-3">انتخاب تاریخ</h4>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {days.map((day) => (
                                                            <button
                                                                key={day.date}
                                                                onClick={() => {
                                                                    setSelectedDate(day.date)
                                                                    setSelectedTime(null)
                                                                }}
                                                                className={`flex flex-col items-center px-4 py-3 rounded-xl border min-w-[80px] transition-colors ${
                                                                    selectedDate === day.date
                                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                                        : 'bg-card border-border hover:border-primary/50'
                                                                }`}
                                                            >
                                                                <span className="text-xs">{day.dayName}</span>
                                                                <span className="text-lg font-bold">{day.dayNumber}</span>
                                                                <span className="text-xs">{day.monthName}</span>
                                                                {day.isToday && (
                                                                    <span className="text-[10px] mt-1 opacity-75">امروز</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Time Selection */}
                                                {selectedDate && (
                                                    <div>
                                                        <h4 className="font-medium mb-3">انتخاب ساعت</h4>
                                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                                            {timeSlots.map((slot) => (
                                                                <button
                                                                    key={slot.time}
                                                                    onClick={() => slot.available && setSelectedTime(slot.time)}
                                                                    disabled={!slot.available}
                                                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                                        selectedTime === slot.time
                                                                            ? 'bg-primary text-primary-foreground'
                                                                            : slot.available
                                                                                ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                                                                                : 'bg-muted text-muted-foreground cursor-not-allowed line-through'
                                                                    }`}
                                                                >
                                                                    {slot.time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {timeSlots.length === 0 && (
                                                            <p className="text-muted-foreground text-center py-4">
                                                                زمانی برای این تاریخ موجود نیست
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="monthly" className="mt-6">
                                                <div className="bg-muted/50 rounded-xl p-6 text-center">
                                                    <h4 className="font-medium mb-2">اشتراک ماهیانه</h4>
                                                    <p className="text-muted-foreground text-sm mb-4">
                                                        با خرید اشتراک ماهیانه، در تمام ساعات کاری سالن می‌توانید از امکانات استفاده کنید.
                                                    </p>
                                                    <div className="text-2xl font-bold text-primary">
                                                        {formatPrice(venue.monthlyPrice)}
                                                        <span className="text-sm font-normal text-muted-foreground mr-1">/ ماه</span>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar - Pricing */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <CardTitle>خلاصه رزرو</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">نوع رزرو:</span>
                                                <span>{reservationType === 'hourly' ? 'ساعتی' : 'ماهیانه'}</span>
                                            </div>
                                            {reservationType === 'hourly' && selectedDate && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">تاریخ:</span>
                                                    <span>{new Intl.DateTimeFormat('fa-IR').format(new Date(selectedDate))}</span>
                                                </div>
                                            )}
                                            {reservationType === 'hourly' && selectedTime && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">ساعت:</span>
                                                    <span>{selectedTime} - {parseInt(selectedTime.split(':')[0]) + 1}:00</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-border pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">مبلغ قابل پرداخت:</span>
                                                <span className="text-xl font-bold text-primary">
                          {formatPrice(totalPrice)}
                        </span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleReserve}
                                            className="w-full"
                                            size="lg"
                                            disabled={reservationType === 'hourly' && (!selectedDate || !selectedTime)}
                                        >
                                            {user ? 'ادامه و پرداخت' : 'ورود و رزرو'}
                                        </Button>

                                        {!user && (
                                            <p className="text-xs text-muted-foreground text-center">
                                                برای رزرو باید وارد حساب کاربری شوید
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
