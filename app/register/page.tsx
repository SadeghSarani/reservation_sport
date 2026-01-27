'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Label} from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const { register, isLoading } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('لطفا تمام فیلدها را پر کنید')
            return
        }

        if (password !== confirmPassword) {
            setError('رمز عبور و تکرار آن مطابقت ندارند')
            return
        }

        if (password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
            return
        }

        const phoneRegex = /^09\d{9}$/
        if (!phoneRegex.test(phone)) {
            setError('شماره موبایل نامعتبر است')
            return
        }

        const success = await register(name, email, phone, password)
        if (success) {
            router.push('/')
        } else {
            setError('این ایمیل قبلا ثبت شده است')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">ثبت نام</CardTitle>
                        <CardDescription>
                            حساب کاربری جدید ایجاد کنید
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">نام و نام خانوادگی</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="مثال: علی احمدی"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">ایمیل</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">شماره موبایل</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="09121234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">رمز عبور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="حداقل ۶ کاراکتر"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="تکرار رمز عبور"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>

                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                        در حال ثبت نام...
                                    </>
                                ) : (
                                    'ثبت نام'
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                با ثبت نام، شما{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    قوانین و مقررات
                                </Link>
                                {' '}را می‌پذیرید.
                            </p>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            قبلا ثبت نام کرده‌اید؟{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                وارد شوید
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    )
}
