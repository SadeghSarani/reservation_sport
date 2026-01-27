import React from "react"
import type { Metadata, Viewport } from 'next'
import { Vazirmatn } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import {ThemeProvider} from "next-themes";


const vazirmatn = Vazirmatn({
    subsets: ['arabic', 'latin'],
    variable: '--font-vazirmatn'
})

export const metadata: Metadata = {
    title: 'اسپورت رزرو | رزرو آنلاین سالن‌های ورزشی',
    description: 'سامانه رزرو آنلاین سالن‌های ورزشی - فوتسال، والیبال، بسکتبال، بدمینتون و باشگاه',
    generator: 'v0.app',
    keywords: ['رزرو ورزشی', 'سالن فوتسال', 'باشگاه', 'رزرو آنلاین'],
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#22c55e' },
        { media: '(prefers-color-scheme: dark)', color: '#16a34a' },
    ],
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning>
        <body className={`${vazirmatn.className} font-sans antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
        >
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
        <Analytics />
        </body>
        </html>
    )
}
