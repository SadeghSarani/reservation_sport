'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {Label} from "@radix-ui/react-label";

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('لطفا تمام فیلدها را پر کنید')
            return
        }

        const success = await login(email, password)
        if (success) {
            router.push('/')
        } else {
            setError('ایمیل یا رمز عبور اشتباه است')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
                        <CardDescription>
                            برای ادامه، اطلاعات خود را وارد کنید
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">ایمیل</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    aria-placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    dir="ltr"
                                    className="text-left"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">رمز عبور</Label>
                                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                        فراموشی رمز عبور؟
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    aria-placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                        در حال ورود...
                                    </>
                                ) : (
                                    'ورود'
                                )}
                            </Button>

                            {/* Demo accounts */}
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">حساب‌های آزمایشی:</p>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>مدیر کل: ali@example.com</p>
                                    <p>مدیر سالن: mohammad@example.com</p>
                                    <p>کاربر: reza@example.com</p>
                                    <p className="text-primary">(هر رمز عبوری قبول می‌شود)</p>
                                </div>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            حساب کاربری ندارید؟{' '}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                ثبت نام کنید
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    )
}
