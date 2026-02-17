'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SportCard } from '@/components/sport-card'
import { VenueCard } from '@/components/venue-card'
import { mockVenues } from '@/lib/mock-data'
import type { SportType } from '@/lib/types'
import { sportTypeLabels } from '@/lib/types'
import {
    ArrowLeft, Calendar, CreditCard, Search,
    Star, Zap, Shield, HeadphonesIcon,
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { venuesApi } from '@/app/api/services/venues.api'

/* ─── Animated counter ───────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!start) return
        let startTime: number
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(ease * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target, duration, start])
    return count
}

function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true) },
            { threshold }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, inView }
}

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
    const { ref, inView } = useInView()
    const count = useCountUp(value, 1800, inView)
    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-5xl font-black text-primary tabular-nums">
                {count.toLocaleString('fa-IR')}{suffix}
            </div>
            <div className="text-sm text-muted-foreground mt-2 font-medium">{label}</div>
        </div>
    )
}

/* ─── Reusable section heading ───────────────────────────────────── */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
    return (
        <div className="text-center mb-14">
            <span className="inline-block text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">{title}</h2>
            {sub && <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm md:text-base">{sub}</p>}
        </div>
    )
}

/* ─── Step card ──────────────────────────────────────────────────── */
function StepCard({
                      icon: Icon, title, description, step, isLast,
                  }: {
    icon: React.ElementType; title: string; description: string; step: string; isLast?: boolean
}) {
    return (
        <div className="group relative bg-card border border-border rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                {step}
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
            {!isLast && (
                <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-px bg-gradient-to-l from-border to-transparent" />
            )}
        </div>
    )
}

/* ─── Feature card ───────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="group bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
    const [loading, setLoading] = useState(true)
    const [sportCounts, setSportCounts] = useState<Record<SportType, number>>({} as Record<SportType, number>)
    const featuredVenues = mockVenues.filter((v) => v.isActive).slice(0, 4)

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await venuesApi.getVenuesDashboard()
                const countsData = response.data.data
                const counts: Record<SportType, number> = {} as Record<SportType, number>
                ;(Object.keys(sportTypeLabels) as SportType[]).forEach((sport) => {
                    const found = countsData.find((item: any) => item.type === sport)
                    counts[sport] = found ? found.total : 0
                })
                setSportCounts(counts)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCounts()
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1">

                {/* ════════ HERO ════════ */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden" dir="rtl">

                    {/* Layered bg — all use CSS vars so they adapt to mode */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

                    {/* Soft glow blobs */}
                    <div className="absolute top-24 right-[15%] w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent/6 rounded-full blur-[120px] pointer-events-none" />

                    {/* Dot grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                        }}
                    />

                    {/* Spinning ring accents */}
                    <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-primary/10 animate-[spin_70s_linear_infinite] pointer-events-none" />
                    <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full border border-primary/7 animate-[spin_50s_linear_infinite_reverse] pointer-events-none" />
                    <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full border border-primary/7 animate-[spin_90s_linear_infinite] pointer-events-none" />

                    <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">

                            {/* Pulse badge */}
                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                                <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-xs font-semibold mb-10 backdrop-blur-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                    </span>
                                    بیش از ۱۰۰ سالن ورزشی فعال در سراسر کشور
                                </div>
                            </div>

                            {/* Headline */}
                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] mb-6">
                                    رزرو آنلاین
                                    <br />
                                    <span className="text-gradient">سالن‌های ورزشی</span>
                                </h1>
                            </div>

                            {/* Sub */}
                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '160ms', animationFillMode: 'forwards' }}>
                                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
                                    فوتسال، والیبال، بسکتبال، بدمینتون و بدنسازی را با چند کلیک رزرو کنید.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '240ms', animationFillMode: 'forwards' }}>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                    <Link href="/venues">
                                        <Button
                                            size="lg"
                                            className="gap-2.5 text-base px-8 h-14 rounded-xl btn-sport shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 hover:scale-105"
                                        >
                                            مشاهده سالن‌ها
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="text-base px-8 h-14 rounded-xl border-2 bg-transparent hover:bg-secondary/50 transition-all duration-300 hover:scale-105"
                                        >
                                            ثبت نام رایگان
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Animated stats */}
                            <div
                                className="animate-slide-up opacity-0 pt-10 border-t border-border"
                                style={{ animationDelay: '320ms', animationFillMode: 'forwards' }}
                            >
                                <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                                    <StatCounter value={100} label="سالن ورزشی" suffix="+" />
                                    <StatCounter value={5000} label="رزرو موفق" suffix="+" />
                                    <StatCounter value={98} label="رضایت کاربران" suffix="٪" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom fade into next section */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" />
                </section>

                {/* ════════ SPORTS ════════ */}
                <section className="py-24 relative overflow-hidden" dir="rtl">
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <SectionHeader
                            eyebrow="انتخاب رشته"
                            title="رشته‌های ورزشی"
                            sub="رشته ورزشی مورد علاقه خود را انتخاب کنید و بهترین سالن‌ها را کشف کنید"
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                            {(Object.keys(sportTypeLabels) as SportType[]).map((sport, index) => (
                                <div
                                    key={sport}
                                    className="animate-scale-in opacity-0"
                                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                                >
                                    <SportCard sportType={sport} venueCount={sportCounts[sport]} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════ HOW IT WORKS ════════ */}
                <section className="py-24 relative" dir="rtl">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="container mx-auto px-4">
                        <SectionHeader
                            eyebrow="راهنما"
                            title="چگونه کار می‌کند؟"
                            sub="در سه مرحله ساده سالن ورزشی خود را رزرو کنید"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <StepCard icon={Search} title="جستجو کنید" step="۱"
                                      description="سالن ورزشی مورد نظر خود را بر اساس موقعیت، قیمت و امکانات پیدا کنید" />
                            <StepCard icon={Calendar} title="زمان انتخاب کنید" step="۲"
                                      description="تاریخ و ساعت مناسب را از بین زمان‌های خالی انتخاب نمایید" />
                            <StepCard icon={CreditCard} title="پرداخت کنید" step="۳" isLast
                                      description="با درگاه امن زرین‌پال پرداخت کنید و رزرو خود را قطعی نمایید" />
                        </div>
                    </div>
                </section>

                {/* ════════ FEATURED VENUES ════════ */}
                <section className="py-24 relative overflow-hidden" dir="rtl">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                            <div>
                                <span className="inline-block text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                    پیشنهاد ویژه
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">سالن‌های محبوب</h2>
                                <p className="text-muted-foreground text-sm">پرطرفدارترین سالن‌های ورزشی با بهترین امکانات</p>
                            </div>
                            <Link href="/venues">
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-transparent border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
                                >
                                    مشاهده همه
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredVenues.map((venue, index) => (
                                <div
                                    key={venue.id}
                                    className="animate-slide-up opacity-0"
                                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                                >
                                    <VenueCard venue={venue} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════ FEATURES ════════ */}
                <section className="py-24 relative" dir="rtl">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="container mx-auto px-4">
                        <SectionHeader
                            eyebrow="مزایا"
                            title="چرا اسپورت رزرو؟"
                            sub="مزایای استفاده از سامانه ما برای رزرو سالن‌های ورزشی"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <FeatureCard icon={Zap}            title="رزرو آسان"    description="بدون نیاز به تماس تلفنی، ۲۴ ساعته رزرو کنید" />
                            <FeatureCard icon={Shield}         title="پرداخت امن"   description="پرداخت آنلاین با درگاه معتبر زرین‌پال" />
                            <FeatureCard icon={Star}           title="تنوع سالن‌ها" description="دسترسی به صدها سالن ورزشی در سراسر کشور" />
                            <FeatureCard icon={HeadphonesIcon} title="پشتیبانی"     description="پشتیبانی ۷ روز هفته برای پاسخگویی به شما" />
                        </div>
                    </div>
                </section>

                {/* ════════ CTA ════════ */}
                <section className="py-28 relative overflow-hidden" dir="rtl">
                    {/* Primary-color bg adapts automatically in both modes */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
                    <div className="absolute inset-0 sports-pattern opacity-10 pointer-events-none" />

                    {/* Floating glows */}
                    <div className="absolute top-10 right-[20%] w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl animate-float pointer-events-none" />
                    <div className="absolute bottom-10 left-[20%] w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl animate-float delay-200 pointer-events-none" />

                    {/* Ring accents */}
                    <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full border border-primary-foreground/10 animate-[spin_60s_linear_infinite] pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full border border-primary-foreground/10 animate-[spin_80s_linear_infinite_reverse] pointer-events-none" />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-2xl mx-auto">

                            <div className="inline-flex items-center gap-2 bg-primary-foreground/15 border border-primary-foreground/20 text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold mb-8">
                                <Star className="w-3 h-3 fill-current" />
                                تخفیف ویژه اولین رزرو
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-primary-foreground mb-6 leading-tight">
                                همین الان شروع کنید
                            </h2>

                            <p className="text-primary-foreground/80 text-base leading-relaxed mb-10 max-w-lg mx-auto">
                                ثبت نام کنید و از تخفیف‌های ویژه اولین رزرو بهره‌مند شوید.
                                رزرو سالن ورزشی هیچوقت به این راحتی نبوده!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="text-base px-10 h-14 font-bold shadow-xl rounded-xl hover:scale-105 transition-all duration-300"
                                    >
                                        ثبت نام رایگان
                                    </Button>
                                </Link>
                                <Link href="/venues">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-base px-10 h-14 rounded-xl bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
                                    >
                                        مشاهده سالن‌ها
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    )
}