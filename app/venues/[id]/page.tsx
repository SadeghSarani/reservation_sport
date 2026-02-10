'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { VenueImageSlider } from '@/components/venue-image-slider'

import { sportTypeLabels, persianDays } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/mock-data'

import { MapPin, Clock, Users, ChevronLeft } from 'lucide-react'
import {venuesApi} from "@/app/api/services/venues.api";

/* -------------------- helpers -------------------- */

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

/* -------------------- page -------------------- */

export default function VenueDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const [venue, setVenue] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<any>(null)
    const [reservationType, setReservationType] = useState<'hourly'>('hourly')

    const days = useMemo(() => getNextDays(7), [])

    /* -------------------- fetch venue -------------------- */

    useEffect(() => {
        if (!id) return

        const fetchVenue = async () => {
            setLoading(true)
            try {
                const res = await venuesApi.getVenue(id)
                setVenue(res.data)
            } catch (e) {
                setVenue(null)
            } finally {
                setLoading(false)
            }
        }

        fetchVenue()
    }, [id])

    /* -------------------- states -------------------- */

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>
    }

    if (!venue) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Link href="/venues">
                    <Button>بازگشت به سالن‌ها</Button>
                </Link>
            </div>
        )
    }

    const timeSlots = venue.venue_price || []

    const handleReserve = () => {
        if (!user) {
            router.push('/login')
            return
        }

        if (!selectedDate || !selectedSlot) return

        router.push(
            `/payment?venueId=${venue.id}&date=${selectedDate}&slot=${selectedSlot.id}`
        )
    }

    /* -------------------- render -------------------- */

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-4 text-sm text-muted-foreground flex items-center gap-2">
                    <Link href="/">خانه</Link>
                    <ChevronLeft className="w-4 h-4" />
                    <Link href="/venues">سالن‌ها</Link>
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-foreground">{venue.name}</span>
                </div>

                {/* Hero */}
                <section className="relative">
                    <VenueImageSlider images={venue.images} />

                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${sportGradients[venue.type]} opacity-70`} />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="container mx-auto px-4 pb-8 text-white">
                            <Badge variant="secondary" className="bg-white/90 text-foreground mb-3">
                                {sportTypeLabels[venue.type]}
                            </Badge>

                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {venue.name}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>{venue.address}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span>ظرفیت {venue.capacity} نفر</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Content */}
                <section className="py-8">
                    <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>درباره سالن</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    {venue.description}
                                </CardContent>
                            </Card>

                            {/* Booking */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>رزرو ساعتی</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Date */}
                                    <div>
                                        <h4 className="font-medium mb-2">انتخاب تاریخ</h4>
                                        <div className="flex gap-2 overflow-x-auto">
                                            {days.map((d) => (
                                                <button
                                                    key={d.date}
                                                    onClick={() => {
                                                        setSelectedDate(d.date)
                                                        setSelectedSlot(null)
                                                    }}
                                                    className={`px-4 py-3 rounded-xl border min-w-[80px] ${
                                                        selectedDate === d.date
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-card'
                                                    }`}
                                                >
                                                    <div className="text-xs">{d.dayName}</div>
                                                    <div className="text-lg font-bold">{d.dayNumber}</div>
                                                    <div className="text-xs">{d.monthName}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time slots */}
                                    {selectedDate && (
                                        <div>
                                            <h4 className="font-medium mb-2">انتخاب ساعت</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {timeSlots.map((slot: any) => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`p-3 rounded-lg border text-sm ${
                                                            selectedSlot?.id === slot.id
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-secondary'
                                                        }`}
                                                    >
                                                        <div>{slot.start_time} - {slot.end_time}</div>
                                                        <div className="font-bold">{formatPrice(slot.price)}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>خلاصه رزرو</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {selectedSlot && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span>ساعت</span>
                                                <span>{selectedSlot.start_time} - {selectedSlot.end_time}</span>
                                            </div>

                                            <div className="flex justify-between font-bold">
                                                <span>مبلغ</span>
                                                <span className="text-primary">
                          {formatPrice(selectedSlot.price)}
                        </span>
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        disabled={!selectedDate || !selectedSlot}
                                        onClick={handleReserve}
                                        className="w-full"
                                    >
                                        {user ? 'ادامه و پرداخت' : 'ورود و رزرو'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
