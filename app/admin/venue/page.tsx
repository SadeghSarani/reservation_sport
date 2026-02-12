'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {venuesApi} from "@/app/api/services/venues.api";
import {useRouter} from "next/navigation";

interface Venue {
    id: number
    name: string
    type: string
    billing_type: string
    address: string
    capacity: number
    is_active: number
    price: string
    owner: {
        name: string
        email: string
    }
}

export default function AdminVenuesPage() {
    const router = useRouter()
    const [venues, setVenues] = useState<Venue[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await venuesApi.getAdminVenues()
                setVenues(response.data.data ?? [])
            } catch (error) {
                console.error('Failed to load venues:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchVenues()
    }, [])

    if (loading) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                Loading venues...
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <CardTitle>لیست سالن‌ها</CardTitle>
                <Button size="sm" className="whitespace-nowrap">
                    افزودن سالن
                </Button>
            </CardHeader>

            <CardContent>
                {venues.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                        سالنی یافت نشد
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead className="min-w-[140px]">نام سالن</TableHead>
                                    <TableHead className="min-w-[100px]">نوع</TableHead>
                                    <TableHead className="min-w-[160px]">مالک</TableHead>
                                    <TableHead className="min-w-[80px]">ظرفیت</TableHead>
                                    <TableHead className="min-w-[110px]">قیمت</TableHead>
                                    <TableHead className="min-w-[90px]">وضعیت</TableHead>
                                    <TableHead className="text-right min-w-[140px]">عملیات</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {venues.map((venue) => (
                                    <TableRow key={venue.id} className="hover:bg-muted/40">
                                        <TableCell className="font-medium text-muted-foreground">
                                            {venue.id}
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {venue.name}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="secondary">
                                                {venue.type === 'futsal'
                                                    ? 'فوتسال'
                                                    : venue.type === 'volleyball'
                                                        ? 'والیبال'
                                                        : venue.type === 'basketball'
                                                            ? 'بسکتبال'
                                                            : 'نامشخص'}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm leading-tight">
                                                <div className="font-medium">{venue.owner?.name || '—'}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {venue.owner?.email || '—'}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>{venue.capacity || '—'}</TableCell>

                                        <TableCell className="whitespace-nowrap">
                                            {Number(venue.price).toLocaleString()} تومان
                                        </TableCell>

                                        <TableCell>
                                            {venue.is_active ? (
                                                <Badge variant="default" className="gap-1 bg-green-600/90 hover:bg-green-600">
                                                    <Check className="w-3.5 h-3.5" />
                                                    فعال
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="gap-1">
                                                    <X className="w-3.5 h-3.5" />
                                                    غیرفعال
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => router.push(`/admin/venue/${venue.id}`)}
                                                className="cursor-pointer"
                                            >
                                                ویرایش
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="cursor-pointer"
                                                // onClick={handleDelete(venue.id)} ← add your delete logic
                                            >
                                                حذف
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
