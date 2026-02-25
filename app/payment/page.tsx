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

    const venueId =  Number(searchParams.get('venueId'))
    const type = searchParams.get('type') as 'hourly' | 'monthly'
    const date = searchParams.get('date')
    const time = searchParams.get('time')

    const venue = mockVenues.find((v) => v.id === venueId) ?? []

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

    const totalPrice = '150000'

    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulate Zarinpal payment
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setIsSuccess(true)
    }

    if (isSuccess) {
        return (
            <div></div>
        )
    }

    return (
        <div></div>
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
