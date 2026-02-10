'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import {SportCard} from '@/components/sport-card'
import {VenueCard} from '@/components/venue-card'
import {mockVenues} from '@/lib/mock-data'
import type {SportType} from '@/lib/types'
import {sportTypeLabels} from '@/lib/types'
import {ArrowLeft, Calendar, CheckCircle, CreditCard, Search} from 'lucide-react'
import {useEffect, useState} from "react";
import {venuesApi} from "@/app/api/services/venues.api"

// Count venues by sport
// const sportCounts = Object.keys(sportTypeLabels).reduce(
//     (acc, sport) => {
//         acc[sport as SportType] = mockVenues.filter((v) => v.sportType === sport && v.isActive).length
//         return acc
//     },
//     {} as Record<SportType, number>
// )

export default function HomePage() {

    const [loading, setLoading] = useState(true)
    const [sportCounts, setSportCounts] = useState<Record<SportType, number>>({} as Record<SportType, number>)
    // const [featuredVenues, setFeaturedVenues] = useState([])
    const featuredVenues = mockVenues.filter((v) => v.isActive).slice(0, 4)

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await venuesApi.getVenuesDashboard()
                const countsData = response.data.data

                const counts: Record<SportType, number> = {} as Record<SportType, number>
                (Object.keys(sportTypeLabels) as SportType[]).forEach((sport) => {
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

    console.log(featuredVenues)
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden min-h-[85vh] flex items-center">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
                    <div className="absolute inset-0 sports-pattern" />

                    {/* Floating Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
                        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float delay-200" />
                        <div className="absolute top-1/2 right-[30%] w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float delay-300" />

                        {/* Sports Ball Icons */}
                        <div className="absolute top-[15%] left-[15%] w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/60 opacity-20 animate-bounce-soft" />
                        <div className="absolute bottom-[25%] right-[20%] w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 opacity-20 animate-bounce-soft delay-300" />
                        <div className="absolute top-[40%] right-[10%] w-8 h-8 rounded-full bg-gradient-to-br from-chart-3 to-chart-3/60 opacity-20 animate-bounce-soft delay-500" />
                    </div>

                    <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                                    <span>بیش از ۱۰۰ سالن ورزشی فعال</span>
                                </div>
                            </div>

                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight text-balance">
                                    رزرو آنلاین
                                    <br />
                                    <span className="text-gradient">سالن‌های ورزشی</span>
                                </h1>
                            </div>

                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
                                    به راحتی و با چند کلیک، بهترین سالن‌های ورزشی را پیدا کنید و رزرو کنید.
                                    <br className="hidden sm:block" />
                                    فوتسال، والیبال، بسکتبال، بدمینتون و باشگاه بدنسازی.
                                </p>
                            </div>

                            <div className="animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Link href="/venues">
                                        <Button size="lg" className="gap-2 text-base px-8 h-14 btn-sport shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                                            <span>مشاهده سالن‌ها</span>
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" size="lg" className="text-base px-8 h-14 bg-transparent border-2 hover:bg-secondary/50 transition-all duration-300 hover:scale-105">
                                            ثبت نام رایگان
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="animate-slide-up opacity-0 pt-8" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                                    {[
                                        { value: '۱۰۰+', label: 'سالن ورزشی' },
                                        { value: '۵۰۰۰+', label: 'رزرو موفق' },
                                        { value: '۹۸٪', label: 'رضایت کاربران' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                                            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sports Section */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12">
                            <span className="inline-block text-primary text-sm font-semibold mb-2">انتخاب رشته</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">رشته‌های ورزشی</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">رشته ورزشی مورد علاقه خود را انتخاب کنید و بهترین سالن‌ها را کشف کنید</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                            {(Object.keys(sportTypeLabels) as SportType[]).map((sport, index) => (
                                <div
                                    key={sport}
                                    className="animate-scale-in opacity-0"
                                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                                >
                                    <SportCard sportType={sport} venueCount={sportCounts[sport]} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-14">
                            <span className="inline-block text-primary text-sm font-semibold mb-2">راهنما</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">چگونه کار می‌کند؟</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">در سه مرحله ساده سالن ورزشی خود را رزرو کنید</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: Search,
                                    title: 'جستجو کنید',
                                    description: 'سالن ورزشی مورد نظر خود را بر اساس موقعیت، قیمت و امکانات پیدا کنید',
                                    step: '۱',
                                },
                                {
                                    icon: Calendar,
                                    title: 'زمان انتخاب کنید',
                                    description: 'تاریخ و ساعت مناسب را از بین زمان‌های خالی انتخاب نمایید',
                                    step: '۲',
                                },
                                {
                                    icon: CreditCard,
                                    title: 'پرداخت کنید',
                                    description: 'با درگاه امن زرین‌پال پرداخت کنید و رزرو خود را قطعی نمایید',
                                    step: '۳',
                                },
                            ].map((step, index) => (
                                <div key={step.title} className="relative group">
                                    <div className="bg-card border border-border rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            {step.step}
                                        </div>

                                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <step.icon className="w-10 h-10 text-primary" />
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                    </div>

                                    {/* Connection Line */}
                                    {index < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-gradient-to-l from-primary/40 to-transparent" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Venues */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
                            <div>
                                <span className="inline-block text-primary text-sm font-semibold mb-2">پیشنهاد ویژه</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">سالن‌های محبوب</h2>
                                <p className="text-muted-foreground">پرطرفدارترین سالن‌های ورزشی با بهترین امکانات</p>
                            </div>
                            <Link href="/venues">
                                <Button variant="outline" className="gap-2 bg-transparent border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                    <span>مشاهده همه</span>
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredVenues.map((venue, index) => (
                                <div key={venue.id} className="animate-slide-up opacity-0" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}>
                                    <VenueCard venue={venue} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-14">
                            <span className="inline-block text-primary text-sm font-semibold mb-2">مزایا</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">چرا اسپورت رزرو؟</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">مزایای استفاده از سامانه ما برای رزرو سالن‌های ورزشی</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'رزرو آسان', description: 'بدون نیاز به تماس تلفنی، ۲۴ ساعته رزرو کنید', icon: '⚡' },
                                { title: 'پرداخت امن', description: 'پرداخت آنلاین با درگاه معتبر زرین‌پال', icon: '🔒' },
                                { title: 'تنوع سالن‌ها', description: 'دسترسی به صدها سالن ورزشی در سراسر کشور', icon: '🏟️' },
                                { title: 'پشتیبانی', description: 'پشتیبانی ۷ روز هفته برای پاسخگویی به شما', icon: '💬' },
                            ].map((feature, index) => (
                                <div
                                    key={feature.title}
                                    className="group bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30"
                                >
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <CheckCircle className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
                    <div className="absolute inset-0 sports-pattern opacity-10" />

                    {/* Floating Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-10 right-[20%] w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
                        <div className="absolute bottom-10 left-[20%] w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float delay-200" />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-6">
                                همین الان شروع کنید
                            </h2>
                            <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
                                ثبت نام کنید و از تخفیف‌های ویژه اولین رزرو بهره‌مند شوید.
                                <br className="hidden sm:block" />
                                رزرو سالن ورزشی هیچوقت به این راحتی نبوده!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" variant="secondary" className="text-base px-10 h-14 font-bold shadow-xl hover:scale-105 transition-all duration-300">
                                        ثبت نام رایگان
                                    </Button>
                                </Link>
                                <Link href="/venues">
                                    <Button size="lg" variant="outline" className="text-base px-10 h-14 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300">
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
