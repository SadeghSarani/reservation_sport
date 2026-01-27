'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockVenues, formatPrice } from '@/lib/mock-data'
import { sportTypeLabels } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { CheckCircle, Loader2, CreditCard, Shield, ArrowRight } from 'lucide-react'

function PaymentContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const venueId = searchParams.get('venueId')
    const type = searchParams.get('type') as 'hourly' | 'monthly'
    const date = searchParams.get('date')
    const time = searchParams.get('time')

    const venue = mockVenues.find((v) => v.id === venueId)

    if (!user) {
        router.push('/login')
        return null
    }

    if (!venue) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-4">خطا در بارگذاری</h1>
                        <Link href="/venues">
                            <Button>بازگشت به لیست سالن‌ها</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const totalPrice = type === 'hourly' ? venue.hourlyPrice : venue.monthlyPrice

    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulate Zarinpal payment
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setIsSuccess(true)
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <Card className="w-full max-w-md text-center">
                        <CardContent className="pt-8 pb-6 space-y-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-2">پرداخت موفق</h1>
                                <p className="text-muted-foreground">
                                    رزرو شما با موفقیت ثبت شد
                                </p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2 text-right">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">سالن:</span>
                                    <span className="font-medium">{venue.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">نوع رزرو:</span>
                                    <span>{type === 'hourly' ? 'ساعتی' : 'ماهیانه'}</span>
                                </div>
                                {type === 'hourly' && date && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">تاریخ:</span>
                                        <span>{new Intl.DateTimeFormat('fa-IR').format(new Date(date))}</span>
                                    </div>
                                )}
                                {type === 'hourly' && time && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ساعت:</span>
                                        <span>{time}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-border">
                                    <span className="text-muted-foreground">مبلغ پرداختی:</span>
                                    <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">کد پیگیری:</span>
                                    <span dir="ltr">ZP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/reservations" className="flex-1">
                                    <Button variant="outline" className="w-full bg-transparent">رزروهای من</Button>
                                </Link>
                                <Link href="/" className="flex-1">
                                    <Button className="w-full">صفحه اصلی</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Back Link */}
                        <Link href={`/venues/${venue.id}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6">
                            <ArrowRight className="w-4 h-4" />
                            <span>بازگشت به صفحه سالن</span>
                        </Link>

                        <h1 className="text-2xl font-bold text-foreground mb-6">تکمیل رزرو</h1>

                        <div className="grid gap-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>خلاصه سفارش</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-2xl">{sportTypeLabels[venue.sportType].charAt(0)}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{venue.name}</h3>
                                            <p className="text-sm text-muted-foreground">{venue.address}</p>
                                            <p className="text-sm text-muted-foreground">{sportTypeLabels[venue.sportType]}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">نوع رزرو:</span>
                                            <span>{type === 'hourly' ? 'ساعتی' : 'ماهیانه'}</span>
                                        </div>
                                        {type === 'hourly' && date && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">تاریخ:</span>
                                                <span>{new Intl.DateTimeFormat('fa-IR').format(new Date(date))}</span>
                                            </div>
                                        )}
                                        {type === 'hourly' && time && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">ساعت:</span>
                                                <span>{time} - {parseInt(time.split(':')[0]) + 1}:00</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-border pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">مبلغ قابل پرداخت:</span>
                                            <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>اطلاعات کاربر</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">نام:</span>
                                        <span>{user.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">ایمیل:</span>
                                        <span dir="ltr">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">موبایل:</span>
                                        <span dir="ltr">{user.phone}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>درگاه پرداخت</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-4 border border-primary rounded-lg bg-primary/5">
                                        <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                                            <span className="text-xl font-bold text-black">Z</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">زرین‌پال</h4>
                                            <p className="text-sm text-muted-foreground">پرداخت امن با کارت‌های شتاب</p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Notice */}
                            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
                                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">
                                    تمامی تراکنش‌ها از طریق درگاه امن زرین‌پال انجام می‌شود و اطلاعات کارت شما نزد ما ذخیره نمی‌شود.
                                </p>
                            </div>

                            {/* Pay Button */}
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                size="lg"
                                className="w-full gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        در حال اتصال به درگاه...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        پرداخت {formatPrice(totalPrice)}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    )
}
