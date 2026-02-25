'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { Search, CheckCircle, XCircle, Eye, SlidersHorizontal, CalendarDays } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useToast } from '@/components/ui/use-toast'
import { reservationApi } from '@/app/api/services/reservation.api'

interface User {
    name: string
    phone: string
}

interface Reservation {
    id: number
    status: string
    payment_status: string
    start_at: string
    end_at: string
    type: string
    total_price: number
    created_at: string
    user?: User
}

interface ReservationApiResponse {
    data: Reservation[]
}

const statusColors: Record<string, string> = {
    pending:   'bg-amber-500/10 text-amber-500 border-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    completed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
}

const paymentColors: Record<string, string> = {
    pending:  'bg-amber-500/10 text-amber-500',
    paid:     'bg-emerald-500/10 text-emerald-500',
    failed:   'bg-rose-500/10 text-rose-400',
    refunded: 'bg-sky-500/10 text-sky-400',
}

const reservationStatusLabels: Record<string, string> = {
    pending:   'در انتظار',
    confirmed: 'تایید شده',
    cancelled: 'لغو شده',
    completed: 'تکمیل شده',
}

const paymentStatusLabels: Record<string, string> = {
    pending:  'در انتظار پرداخت',
    paid:     'پرداخت شده',
    failed:   'ناموفق',
    refunded: 'مرجوع شده',
}



function SkeletonRow() {
    return (
        <TableRow className={"hover:bg-transparent"}>
            {Array.from({ length: 9 }).map((_, i) => (
                <TableCell key={i}>
                    <div className="h-4 bg-muted/60 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                </TableCell>
            ))}
        </TableRow>
    )
}

export default function AdminReservationsPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast, ToastViewport } = useToast()

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true)
            try {

                const res = await reservationApi.getReservation() as {
                    data: { data: any[] }
                }

                setReservations(res.data.data || [])

            } catch (e) {
                console.error(e)
                toast({ title: 'خطا', description: 'مشکل در دریافت رزروها ❌', variant: 'destructive' })
            } finally {
                setLoading(false)
            }
        }
        fetchReservations()
    }, [user])

    const filteredReservations = useMemo(() => {
        let result = [...reservations]
        if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter)
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter((r) => {
                const name = r.user?.name?.toLowerCase() || ''
                const phone = r.user?.phone || ''
                return name.includes(q) || phone.includes(q) || r.id.toString().includes(q)
            })
        }
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }, [reservations, statusFilter, searchQuery])

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: reservations.length }
        Object.keys(reservationStatusLabels).forEach((s) => {
            counts[s] = reservations.filter((r) => r.status === s).length
        })
        return counts
    }, [reservations])

    return (
        <div className="space-y-6">
            <ToastViewport />

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">مدیریت رزروها</h1>
                    <p className="text-sm text-muted-foreground mt-1">سالن شما — {reservations.length} رزرو در کل</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border/40 rounded-lg px-3 py-2">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>آخرین بروزرسانی: همین الان</span>
                </div>
            </div>

            {/* Status pill filters */}
            <div className="flex items-center gap-2 flex-wrap">
                {[{ value: 'all', label: 'همه' }, ...Object.entries(reservationStatusLabels).map(([k, v]) => ({ value: k, label: v }))].map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setStatusFilter(value)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                            statusFilter === value
                                ? 'bg-foreground text-background border-foreground shadow-sm'
                                : 'bg-muted/30 text-muted-foreground border-border/40 hover:border-border hover:text-foreground'
                        }`}
                    >
                        {label}
                        <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                            statusFilter === value ? 'bg-background/20' : 'bg-muted/60'
                        }`}>
                            {statusCounts[value] ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="جستجو بر اساس نام، تلفن یا کد رزرو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 bg-muted/20 border-border/50 focus:bg-card h-10 placeholder:text-muted-foreground/60 transition-colors"
                />
            </div>

            {/* Table */}
            <Card className="border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border/40 bg-muted/20 hover:bg-muted/20">
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3 pr-6">کد</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">کاربر</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">تاریخ</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">زمان</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">نوع</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">مبلغ</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">وضعیت</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">پرداخت</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3 pl-6">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredReservations.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={9} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center">
                                                <Search className="w-4 h-4 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">رزروی یافت نشد</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReservations.map((r, idx) => (
                                    <TableRow
                                        key={r.id}
                                        className="border-border/30 hover:bg-muted/20 transition-colors duration-100 group"
                                    >
                                        <TableCell className="pr-6">
                                            <span className="font-mono text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                                                #{r.id}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
                                                    <span className="text-[11px] font-semibold text-primary leading-none">
                                                        {r.user?.name?.charAt(0) ?? '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground leading-none">{r.user?.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{r.user?.phone}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-foreground">
                                            {new Date(r.start_at).toLocaleDateString('fa-IR')}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground tabular-nums">
                                            {r.start_at && r.end_at
                                                ? `${new Date(r.start_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} – ${new Date(r.end_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {r.type === 'hourly' ? 'ساعتی' : 'ماهیانه'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-semibold text-foreground tabular-nums">
                                                {r.total_price.toLocaleString()}
                                                <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge  className={`text-xs font-medium px-2 py-0.5 ${statusColors[r.status]}`}>
                                                {reservationStatusLabels[r.status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge  className={`text-xs font-medium px-2 py-0.5 ${paymentColors[r.payment_status]}`}>
                                                {paymentStatusLabels[r.payment_status]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="secondary" title="مشاهده" className="w-7 h-7">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                                {r.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            title="تایید"
                                                            className="w-7 h-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            title="رد"
                                                            className="w-7 h-7 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10"
                                                        >
                                                            <XCircle className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                {!loading && filteredReservations.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-border/40 bg-muted/10">
                        <span className="text-xs text-muted-foreground">
                            نمایش <span className="font-medium text-foreground">{filteredReservations.length}</span> از <span className="font-medium text-foreground">{reservations.length}</span> رزرو
                        </span>
                    </div>
                )}
            </Card>
        </div>
    )
}