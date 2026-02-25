'use client'

import {useState, useEffect, useMemo} from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { VenueImageSlider } from '@/components/venue-image-slider'

import {SportType, sportTypeLabels, Venue} from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { formatPrice } from '@/lib/mock-data'

import {
    MapPin, Users, ChevronLeft, Calendar,
    Clock, CheckCircle, ArrowLeft, Sparkles,
    AlertCircle,
} from 'lucide-react'
import { venuesApi } from '@/app/api/services/venues.api'

/* ─── Helpers ────────────────────────────────────────────────────── */

// Parse a Jalali date string like "1404/11/20" into day/month parts for display
function parseJalaliDay(jalali: string) {
    const parts = jalali.split('/')
    const monthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
    const day = parts[2] ? parseInt(parts[2], 10).toLocaleString('fa-IR') : jalali
    const month = parts[1] ? monthNames[parseInt(parts[1], 10) - 1] ?? parts[1] : ''
    return { day, month }
}

const sportAccent: Record<string, string> = {
    futsal:     'from-emerald-500 to-teal-600',
    volleyball: 'from-orange-500 to-amber-600',
    basketball: 'from-amber-500 to-orange-600',
    badminton:  'from-sky-500 to-blue-600',
    gym:        'from-rose-500 to-pink-600',
}

const sportBadgeBg: Record<string, string> = {
    futsal:     'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    volleyball: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    basketball: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    badminton:  'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    gym:        'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
}

/* ─── Skeleton ───────────────────────────────────────────────────── */
function PageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col bg-background animate-pulse">
            <Header />
            <div className="h-[50vh] bg-muted" />
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-5">
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                        <div className="h-5 bg-muted rounded-lg w-1/4" />
                        <div className="h-3 bg-muted rounded-lg w-full" />
                        <div className="h-3 bg-muted rounded-lg w-5/6" />
                        <div className="h-3 bg-muted rounded-lg w-3/4" />
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        <div className="h-5 bg-muted rounded-lg w-1/3" />
                        <div className="flex gap-3">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="h-20 w-20 flex-shrink-0 bg-muted rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 h-56" />
            </div>
        </div>
    )
}

/* ─── Info chip ──────────────────────────────────────────────────── */
function InfoChip({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-white/85">
            <Icon className="w-4 h-4 text-white/70" />
            <span>{label}</span>
        </div>
    )
}

/* ─── Section card ───────────────────────────────────────────────── */
function SectionCard({
                         title,
                         icon: Icon,
                         children,
                     }: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                </span>
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function VenueDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const [venue, setVenue] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [calendar, setCalendar] = useState<any[]>([])
    const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<any>(null)

    /* ─── Fetch ─────────────────────────────────────────────────── */


    const venueId = useMemo(() => {
        if (!id) return null
        return Array.isArray(id) ? Number(id[0]) : Number(id)
    }, [id])

    useEffect(() => {
        if (!venueId || Number.isNaN(venueId)) return

        const fetchAll = async () => {
            setLoading(true)
            try {
                const res = await venuesApi.getVenue(venueId) as { data: Venue }
                setVenue(res.data)

                const calRes = await venuesApi.getCalendars(res.data.id).then((response: any) => {
                    setCalendar(response.data.data || [])
                })


            } catch {
                setVenue(null)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [venueId])

    /* ─── Loading ───────────────────────────────────────────────── */
    if (loading) return <PageSkeleton />

    /* ─── Not found ─────────────────────────────────────────────── */
    if (!venue) {
        return (
            <div className="min-h-screen flex flex-col bg-background" dir="rtl">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 px-4 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-2">
                        <AlertCircle className="w-9 h-9 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">سالن یافت نشد</h2>
                    <p className="text-muted-foreground text-sm max-w-xs">
                        این سالن وجود ندارد یا حذف شده است.
                    </p>
                    <Link href="/venues">
                        <Button className="mt-2 gap-2 rounded-xl">
                            <ArrowLeft className="w-4 h-4" />
                            بازگشت به سالن‌ها
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const timeSlots = venue.venue_price || []

    // Filter slots for the currently selected calendar day
    const filteredSlots = selectedCalendarId
        ? timeSlots.filter((s: any) => s.calendar_id === selectedCalendarId)
        : []

    const selectedDay = calendar.find(d => d.id === selectedCalendarId) ?? null

    const handleReserve = () => {
        if (!user) { router.push('/login'); return }
        if (!selectedCalendarId || !selectedSlot) return
    }

    const gradient = sportAccent[venue.type] || 'from-primary to-primary/70'
    const badgeCls = sportBadgeBg[venue.type] || 'bg-primary/10 text-primary'

    /* ─── Render ────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
            <Header />

            <main className="flex-1">

                {/* ════════ BREADCRUMB ════════ */}
                <div className="border-b border-border bg-background/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-3">
                        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">خانه</Link>
                            <ChevronLeft className="w-3 h-3" />
                            <Link href="/venues" className="hover:text-foreground transition-colors">سالن‌ها</Link>
                            <ChevronLeft className="w-3 h-3" />
                            <span className="text-foreground font-medium truncate max-w-[200px]">{venue.name}</span>
                        </nav>
                    </div>
                </div>

                {/* ════════ HERO ════════ */}
                <section className="relative h-[52vh] min-h-[340px] overflow-hidden">
                    {/* Image slider */}
                    <div className="absolute inset-0">
                        <VenueImageSlider images={venue.images} />
                    </div>

                    {/* Gradient overlay — sport-tinted */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-75`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content pinned to bottom */}
                    <div className="absolute inset-x-0 bottom-0">
                        <div className="container mx-auto px-4 pb-8 pt-16">
                            {/* Sport badge */}
                            <div className="mb-3">
                                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${badgeCls} backdrop-blur-sm`}>
                                    {sportTypeLabels[venue.type as SportType]}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight drop-shadow-sm">
                                {venue.name}
                            </h1>

                            <div className="flex flex-wrap gap-4">
                                <InfoChip icon={MapPin} label={venue.address} />
                                <InfoChip icon={Users} label={`ظرفیت ${venue.capacity} نفر`} />
                                <InfoChip icon={Clock} label={venue.billing_type || 'ساعتی'} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════ CONTENT ════════ */}
                <section className="py-8">
                    <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── Left column ── */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* About */}
                            <SectionCard title="درباره سالن" icon={Sparkles}>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {venue.description}
                                </p>

                                {/* Quick stats */}
                                <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
                                    {[
                                        { label: 'ظرفیت', value: `${venue.capacity} نفر`, icon: Users },
                                        { label: 'نوع', value: sportTypeLabels[venue.type as SportType], icon: Calendar },
                                        { label: 'قیمت پایه', value: formatPrice(venue.price), icon: Clock },
                                    ].map(item => (
                                        <div key={item.label} className="text-center">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.label}</p>
                                            <p className="text-sm font-bold text-foreground mt-0.5">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>

                            {/* Booking */}
                            <SectionCard title="رزرو ساعتی" icon={Calendar}>
                                <div className="space-y-7">

                                    {/* Date picker — from real calendar API */}
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                            انتخاب تاریخ
                                        </p>
                                        {calendar.length === 0 ? (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl px-4 py-3">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                تقویمی برای این سالن ثبت نشده است
                                            </div>
                                        ) : (
                                            <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
                                                {calendar.map(day => {
                                                    const active = selectedCalendarId === day.id
                                                    const { day: dayNum, month } = parseJalaliDay(day.day_jalali)
                                                    const isHoliday = day.holiday === 1
                                                    return (
                                                        <button
                                                            key={day.id}
                                                            onClick={() => {
                                                                setSelectedCalendarId(day.id)
                                                                setSelectedSlot(null)
                                                            }}
                                                            className={`
                                                                relative flex-shrink-0 flex flex-col items-center
                                                                w-[76px] py-3 rounded-2xl border text-center
                                                                transition-all duration-200
                                                                ${active
                                                                ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                                                                : isHoliday
                                                                    ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/40 hover:border-red-400/60'
                                                                    : 'bg-background border-border hover:border-primary/40 hover:bg-primary/5'
                                                            }
                                                            `}
                                                        >
                                                            {isHoliday && !active && (
                                                                <span className="absolute -top-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                                                                    تعطیل
                                                                </span>
                                                            )}
                                                            {day.event && (
                                                                <span className={`absolute -top-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full truncate max-w-[70px]
                                                                    ${active ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'}`}>
                                                                    {day.event}
                                                                </span>
                                                            )}
                                                            <span className={`text-2xl font-black leading-tight ${active ? 'text-primary-foreground' : isHoliday ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                                                                {dayNum}
                                                            </span>
                                                            <span className={`text-[10px] mt-0.5 ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                                {month}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Time slots — filtered by selected calendar day */}
                                    {selectedCalendarId && (
                                        <div className="opacity-0 animate-[fadeSlideUp_0.3s_ease_forwards]">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                                انتخاب ساعت
                                            </p>
                                            {filteredSlots.length === 0 ? (
                                                <div className="flex flex-col items-center py-10 text-center">
                                                    <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
                                                    <p className="text-sm text-muted-foreground">بازه‌ای برای این روز تعریف نشده</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {filteredSlots.map((slot: any) => {
                                                        const active = selectedSlot?.id === slot.id
                                                        const booked = slot.reservation?.status === 'confirmed'
                                                        return (
                                                            <button
                                                                key={slot.id}
                                                                disabled={booked}
                                                                onClick={() => setSelectedSlot(slot)}
                                                                className={`
                                                                    relative rounded-xl border p-3.5 text-center text-sm
                                                                    transition-all duration-200
                                                                    ${booked
                                                                    ? 'bg-muted border-border text-muted-foreground cursor-not-allowed opacity-60'
                                                                    : active
                                                                        ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                                                        : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                                                                }
                                                                `}
                                                            >
                                                                {active && (
                                                                    <CheckCircle className="absolute top-2 left-2 w-3.5 h-3.5 text-primary-foreground/70" />
                                                                )}
                                                                <p className={`font-semibold tabular-nums ${active ? 'text-primary-foreground' : 'text-foreground'}`}>
                                                                    {slot.start_time} – {slot.end_time}
                                                                </p>
                                                                <p className={`text-xs mt-1 font-bold ${active ? 'text-primary-foreground/80' : 'text-primary'}`}>
                                                                    {formatPrice(slot.price)}
                                                                </p>
                                                                {booked && (
                                                                    <span className="block text-[10px] mt-1 font-semibold text-muted-foreground">
                                                                        رزرو شده
                                                                    </span>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Hint when no day selected */}
                                    {!selectedCalendarId && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl px-4 py-3">
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            ابتدا تاریخ مورد نظر را انتخاب کنید
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        </div>

                        {/* ── Sidebar ── */}
                        <div>
                            <div className="sticky top-24 rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-black/5">

                                {/* Header */}
                                <div className={`bg-gradient-to-br ${gradient} px-6 py-5`}>
                                    <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                                        خلاصه رزرو
                                    </p>
                                    <p className="text-white text-xl font-black">
                                        {selectedSlot
                                            ? <>{formatPrice(selectedSlot.price)}</>
                                            : 'انتخاب نشده'}
                                    </p>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-4">
                                    {/* Venue name */}
                                    <div className="flex items-start gap-3 pb-4 border-b border-border">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <MapPin className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">سالن</p>
                                            <p className="text-sm font-bold text-foreground mt-0.5">{venue.name}</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            تاریخ
                                        </span>
                                        <span className={`font-semibold ${selectedDay ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {selectedDay ? selectedDay.day_jalali : '—'}
                                        </span>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            ساعت
                                        </span>
                                        <span className={`font-semibold ${selectedSlot ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {selectedSlot
                                                ? `${selectedSlot.start_time} – ${selectedSlot.end_time}`
                                                : '—'}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    {selectedSlot && (
                                        <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
                                            <span className="font-bold text-foreground">مبلغ قابل پرداخت</span>
                                            <span className="font-black text-primary text-base">
                                                {formatPrice(selectedSlot.price)}
                                            </span>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <Button
                                        disabled={!selectedCalendarId || !selectedSlot}
                                        onClick={handleReserve}
                                        className="w-full h-12 rounded-xl text-base font-bold mt-2 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/30"
                                    >
                                        {user ? 'ادامه و پرداخت' : 'ورود و رزرو'}
                                    </Button>

                                    {!user && (
                                        <p className="text-center text-xs text-muted-foreground">
                                            برای رزرو باید وارد شوید
                                        </p>
                                    )}

                                    {(!selectedCalendarId || !selectedSlot) && (
                                        <p className="text-center text-xs text-muted-foreground">
                                            {!selectedCalendarId
                                                ? 'تاریخ را انتخاب کنید'
                                                : 'ساعت را انتخاب کنید'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}