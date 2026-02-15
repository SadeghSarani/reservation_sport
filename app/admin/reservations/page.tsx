'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { useAuth } from '@/lib/auth-context'
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import {useToast} from "@/components/ui/use-toast";
import {reservationApi} from "@/app/api/services/reservation.api";

// Status colors
const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

const paymentColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    paid: 'bg-green-500/10 text-green-600',
    failed: 'bg-red-500/10 text-red-600',
    refunded: 'bg-blue-500/10 text-blue-600',
}

// Labels (replace with your actual labels if needed)
const reservationStatusLabels: Record<string, string> = {
    pending: 'در انتظار',
    confirmed: 'تایید شده',
    cancelled: 'لغو شده',
    completed: 'تکمیل شده',
}

const paymentStatusLabels: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'مرجوع شده',
}

export default function AdminReservationsPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast, ToastViewport } = useToast()


    // Fetch reservations from API
    useEffect(() => {
        const fetchReservations = async () => {

            setLoading(true)
            try {
                const res = await reservationApi.getReservation()
                const data = res.data
                setReservations(data.data || [])
            } catch (e) {
                console.error(e)
                toast({
                    title: 'خطا',
                    description: 'مشکل در دریافت رزروها ❌',
                    variant: 'destructive',
                })
            } finally {
                setLoading(false)
            }
        }

        fetchReservations()
    }, [user])

    // Filtered reservations
    const filteredReservations = useMemo(() => {
        let result = [...reservations]

        if (statusFilter !== 'all') {
            result = result.filter((r) => r.status === statusFilter)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter((r) => {
                const name = r.user?.name?.toLowerCase() || ''
                const phone = r.user?.phone || ''
                return name.includes(query) || phone.includes(query) || r.id.toString().includes(query)
            })
        }

        return result.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }, [reservations, statusFilter, searchQuery])

    return (
        <div className="space-y-6">
            {/* Toast */}
            <ToastViewport />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">مدیریت رزروها</h1>
                <p className="text-muted-foreground">سالن شما</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="جستجو بر اساس نام، تلفن یا کد رزرو..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="وضعیت" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                                {Object.keys(reservationStatusLabels).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {reservationStatusLabels[status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>کد رزرو</TableHead>
                                    <TableHead>کاربر</TableHead>
                                    <TableHead>تاریخ</TableHead>
                                    <TableHead>زمان</TableHead>
                                    <TableHead>نوع</TableHead>
                                    <TableHead>مبلغ</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead>پرداخت</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            در حال بارگذاری...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReservations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            رزروی یافت نشد
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReservations.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-mono text-sm">#{r.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{r.user?.name}</div>
                                                    <div className="text-xs text-muted-foreground" dir="ltr">
                                                        {r.user?.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(r.start_at).toLocaleDateString('fa-IR')}</TableCell>
                                            <TableCell>
                                                {r.start_at && r.end_at
                                                    ? `${new Date(r.start_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(r.end_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{r.type === 'hourly' ? 'ساعتی' : 'ماهیانه'}</TableCell>
                                            <TableCell className="font-medium">{r.total_price.toLocaleString()} تومان</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={statusColors[r.status]}>
                                                    {reservationStatusLabels[r.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={paymentColors[r.payment_status]}>
                                                    {paymentStatusLabels[r.payment_status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button size="icon" variant="ghost" title="مشاهده">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {r.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                                                                title="تایید"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                                                                title="رد"
                                                            >
                                                                <XCircle className="w-4 h-4" />
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
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="text-sm text-muted-foreground">
                نمایش {filteredReservations.length} رزرو
            </div>
        </div>
    )
}
