'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import { mockReservations, mockVenues, mockUsers, formatPrice, formatPersianDate } from '@/lib/mock-data'
import { reservationStatusLabels, paymentStatusLabels, type ReservationStatus } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";

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

export default function AdminReservationsPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all')

    // Get venue managed by this admin
    const venue = useMemo(() => {
        if (!user?.managedVenueId) {
            return mockVenues[0]
        }
        return mockVenues.find((v) => v.id === user.managedVenueId) || mockVenues[0]
    }, [user])

    // Get reservations for this venue
    const reservations = useMemo(() => {
        let result = mockReservations.filter((r) => r.venueId === venue?.id)

        if (statusFilter !== 'all') {
            result = result.filter((r) => r.status === statusFilter)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter((r) => {
                const reservationUser = mockUsers.find((u) => u.id === r.userId)
                return (
                    reservationUser?.name.toLowerCase().includes(query) ||
                    reservationUser?.phone.includes(query) ||
                    r.id.includes(query)
                )
            })
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [venue, statusFilter, searchQuery])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">مدیریت رزروها</h1>
                <p className="text-muted-foreground">{venue?.name}</p>
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
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReservationStatus | 'all')}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="وضعیت" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                                {(Object.keys(reservationStatusLabels) as ReservationStatus[]).map((status) => (
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
                                {reservations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            رزروی یافت نشد
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reservations.map((reservation) => {
                                        const reservationUser = mockUsers.find((u) => u.id === reservation.userId)

                                        return (
                                            <TableRow key={reservation.id}>
                                                <TableCell className="font-mono text-sm">#{reservation.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{reservationUser?.name}</div>
                                                        <div className="text-xs text-muted-foreground" dir="ltr">
                                                            {reservationUser?.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatPersianDate(reservation.date)}</TableCell>
                                                <TableCell>
                                                    {reservation.type === 'hourly' && reservation.startTime
                                                        ? `${reservation.startTime} - ${reservation.endTime}`
                                                        : 'ماهیانه'}
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.type === 'hourly' ? 'ساعتی' : 'ماهیانه'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatPrice(reservation.totalPrice)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusColors[reservation.status]}>
                                                        {reservationStatusLabels[reservation.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={paymentColors[reservation.paymentStatus]}>
                                                        {paymentStatusLabels[reservation.paymentStatus]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button size="icon" variant="ghost" title="مشاهده">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        {reservation.status === 'pending' && (
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
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="text-sm text-muted-foreground">
                نمایش {reservations.length} رزرو
            </div>
        </div>
    )
}
