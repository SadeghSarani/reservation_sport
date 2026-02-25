'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { mockReservations, mockVenues, formatPrice, formatPersianDate } from '@/lib/mock-data'
import {reservationStatusLabels, SportType, sportTypeLabels} from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import {
    Calendar, Clock, MapPin, Plus,
    CheckCircle2, XCircle, AlertCircle, Hourglass,
    CreditCard, RotateCcw, Ticket, ArrowLeft,
} from 'lucide-react'
import {useEffect, useState} from "react";
import {reservationApi} from "@/app/api/services/reservation.api";
import {venuesApi} from "@/app/api/services/venues.api";


const reservationStatus: Record<string, {
    label: string
    icon: React.ElementType
    cls: string
    dot: string
}> = {
    pending:   { label: 'در انتظار',  icon: Hourglass,    cls: 'bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400',  dot: 'bg-amber-500' },
    confirmed: { label: 'تأیید شده', icon: CheckCircle2,  cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400', dot: 'bg-emerald-500' },
    cancelled: { label: 'لغو شده',   icon: XCircle,       cls: 'bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400',          dot: 'bg-red-500' },
    completed: { label: 'انجام شده', icon: CheckCircle2,  cls: 'bg-blue-500/10 text-blue-600 border-blue-500/25 dark:text-blue-400',       dot: 'bg-blue-500' },
}

const sportAccentBorder: Record<string, string> = {
    futsal:     'border-l-emerald-500',
    volleyball: 'border-l-orange-500',
    basketball: 'border-l-amber-500',
    badminton:  'border-l-sky-500',
    gym:        'border-l-rose-500',
}

const sportAccentBg: Record<string, string> = {
    futsal:     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    volleyball: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    basketball: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badminton:  'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    gym:        'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}


function StatusBadge({ status }: { status: string }) {
    const cfg = reservationStatus[status] ?? reservationStatus.pending
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}


/* ─── Stat card ──────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, cls }: { label: string; value: number | string; icon: React.ElementType; cls: string }) {
    return (
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xl font-black text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
        </div>
    )
}

/* ─── Reservation card ───────────────────────────────────────────── */


export function ReservationCard({ reservation, index }: { reservation: any; index: number }) {
    const [venue, setVenue] = useState<any>(null)
    const [loadingVenue, setLoadingVenue] = useState(true)

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                setLoadingVenue(true)
                const response = await venuesApi.getVenue(reservation.venue_id)
                setVenue(response.data)
            } catch (err) {
                console.error('Failed to fetch venue', err)
                setVenue(null)
            } finally {
                setLoadingVenue(false)
            }
        }

        if (reservation.venue_id) fetchVenue()
    }, [reservation.venue_id])

    if (loadingVenue) return <p>Loading venue...</p>
    if (!venue) return <p>Venue not found</p>

    const borderCls = sportAccentBorder[venue.sportType] ?? 'border-l-primary'
    const sportBg = sportAccentBg[venue.sportType] ?? 'bg-primary/10 text-primary'
    const isActive = reservation.status === 'confirmed'
    const isPending = reservation.status === 'pending'

    return (
        <div
            className="opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]"
            style={{ animationDelay: `${index * 70}ms` }}
        >
            <div className={`
                group bg-card border border-border border-l-4 ${borderCls}
                rounded-2xl overflow-hidden transition-all duration-300
                hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5
            `}>
                <div className="flex flex-col md:flex-row">

                    {/* Left: Venue info */}
                    <div className="md:w-56 lg:w-64 flex-shrink-0 p-5 bg-muted/30 border-b md:border-b-0 md:border-l border-border flex flex-col justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg ${sportBg}`}>
                                {sportTypeLabels[venue.type as SportType]?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-foreground text-sm leading-tight line-clamp-2">{venue.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{sportTypeLabels[venue.type as SportType]}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{venue.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-0.5">مبلغ پرداختی</p>
                            <p className="text-base font-black text-primary">{formatPrice(reservation.total_price)}</p>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={reservation.status} />
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                <Ticket className="w-3 h-3" />
                                {reservation.type === 'hourly' ? 'ساعتی' : 'ماهیانه'}
                            </span>
                        </div>

                        {/* Date & time */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">{formatPersianDate(reservation.created_at)}</span>
                            </div>
                            {reservation.type === 'hourly' && reservation.start_at && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="font-medium text-foreground tabular-nums">
                                        {reservation.start_at} – {reservation.end_at}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Footer: created date + actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border gap-3 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                                ثبت شده: {formatPersianDate(reservation.created_at)}
                            </span>
                            <div className="flex items-center gap-2">
                                {isPending && (
                                    <Button size="sm" className="h-8 rounded-lg text-xs gap-1.5 shadow-sm shadow-primary/20">
                                        <CreditCard className="w-3.5 h-3.5" />
                                        پرداخت
                                    </Button>
                                )}
                                {isActive && (
                                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs gap-1.5 border-2 bg-transparent hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 transition-colors">
                                        <XCircle className="w-3.5 h-3.5" />
                                        لغو رزرو
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

/* ─── Empty state ────────────────────────────────────────────────── */

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            {/* Decorative rings */}
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-primary/5 border-2 border-primary/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-primary/60" />
                    </div>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-amber-600" />
                </div>
            </div>

            <h2 className="text-xl font-black text-foreground mb-2">هنوز رزروی ندارید</h2>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-8">
                هنوز هیچ رزروی انجام نداده‌اید. همین الان یک سالن ورزشی پیدا کنید و رزرو کنید!
            </p>
            <Link href="/venues">
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-md shadow-primary/20 hover:scale-105 transition-all duration-300">
                    مشاهده سالن‌ها
                    <ArrowLeft className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ReservationsPage() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [userReservations, setUserReservations] = useState<any[]>([])

    // ✅ Fetch reservations only when user exists
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await reservationApi.getReservation().then((response : any) => {
                    setUserReservations(response.data.data)
                })
            } catch (err) {
                console.error('Failed to fetch reservations', err)
                setUserReservations([])
            }
        }

        fetchReservations()
    }, [])

    // Summary counts
    const confirmed = userReservations.filter(r => r.status === 'confirmed').length
    const pending   = userReservations.filter(r => r.status === 'pending').length
    const cancelled = userReservations.filter(r => r.status === 'cancelled').length

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
            <Header />

            <main className="flex-1">

                {/* ════════ HERO HEADER ════════ */}
                <section className="relative overflow-hidden border-b border-border">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-background to-background pointer-events-none" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="container mx-auto px-4 py-10 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div>
                                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">پنل کاربری</p>
                                <h1 className="text-2xl md:text-3xl font-black text-foreground">رزروهای من</h1>
                                <p className="text-muted-foreground text-sm mt-1">مشاهده و مدیریت رزروهای شما</p>
                            </div>
                            <Link href="/venues">
                                <Button className="gap-2 rounded-xl h-11 px-5 shadow-md shadow-primary/20 hover:scale-105 transition-all duration-300">
                                    <Plus className="w-4 h-4" />
                                    رزرو جدید
                                </Button>
                            </Link>
                        </div>

                        {/* Stats row — only when there are reservations */}
                        {userReservations.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
                                <StatCard
                                    label="کل رزروها"
                                    value={userReservations.length}
                                    icon={Ticket}
                                    cls="bg-primary/10 text-primary"
                                />
                                <StatCard
                                    label="تأیید شده"
                                    value={confirmed}
                                    icon={CheckCircle2}
                                    cls="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                />
                                <StatCard
                                    label="در انتظار"
                                    value={pending}
                                    icon={Hourglass}
                                    cls="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                />
                                <StatCard
                                    label="لغو شده"
                                    value={cancelled}
                                    icon={XCircle}
                                    cls="bg-red-500/10 text-red-600 dark:text-red-400"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* ════════ LIST ════════ */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        {userReservations.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="space-y-4">
                                {userReservations.map((reservation, index) => (
                                    <ReservationCard
                                        key={reservation.id}
                                        reservation={reservation}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <Footer />

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}