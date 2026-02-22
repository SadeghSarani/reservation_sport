'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X, Plus, Building2, Trash2, Pencil } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { venuesApi } from '@/app/api/services/venues.api'
import { useRouter } from 'next/navigation'

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

const venueTypeLabels: Record<string, string> = {
    futsal:     'فوتسال',
    volleyball: 'والیبال',
    basketball: 'بسکتبال',
}

const venueTypeColors: Record<string, string> = {
    futsal:     'bg-orange-500/10 text-orange-500 border-orange-500/20',
    volleyball: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    basketball: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
}

function SkeletonRow() {
    return (
        <TableRow className="hover:bg-transparent">
            {Array.from({ length: 8 }).map((_, i) => (
                <TableCell key={i}>
                    <div className="h-4 bg-muted/60 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                </TableCell>
            ))}
        </TableRow>
    )
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">مدیریت سالن‌ها</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {loading ? '...' : `${venues.length} سالن ثبت‌شده`}
                    </p>
                </div>
                <Button size="sm" className="gap-2 h-9" onClick={ () => router.push('/admin/venue/create')}>
                    <Plus className="w-4 h-4" />
                    افزودن سالن
                </Button>
            </div>

            {/* Table Card */}
            <Card className="border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border/40 bg-muted/20 hover:bg-muted/20">
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3 pr-6 w-16">ID</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">نام سالن</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">نوع</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">مالک</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">ظرفیت</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">قیمت</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3">وضعیت</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground py-3 pl-6 text-left">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : venues.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={8} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">سالنی یافت نشد</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                venues.map((venue) => (
                                    <TableRow
                                        key={venue.id}
                                        className="border-border/30 hover:bg-muted/20 transition-colors duration-100 group"
                                    >
                                        {/* ID */}
                                        <TableCell className="pr-6">
                                            <span className="font-mono text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                                                #{venue.id}
                                            </span>
                                        </TableCell>

                                        {/* Name */}
                                        <TableCell>
                                            <span className="text-sm font-semibold text-foreground">
                                                {venue.name}
                                            </span>
                                        </TableCell>

                                        {/* Type */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs font-medium px-2 py-0.5 ${venueTypeColors[venue.type] ?? 'bg-muted/40 text-muted-foreground border-border/40'}`}
                                            >
                                                {venueTypeLabels[venue.type] ?? 'نامشخص'}
                                            </Badge>
                                        </TableCell>

                                        {/* Owner */}
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
                                                    <span className="text-[11px] font-semibold text-primary leading-none">
                                                        {venue.owner?.name?.charAt(0) ?? '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-foreground leading-none">
                                                        {venue.owner?.name || '—'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                                                        {venue.owner?.email || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Capacity */}
                                        <TableCell>
                                            <span className="text-sm text-foreground tabular-nums">
                                                {venue.capacity || '—'}
                                            </span>
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell>
                                            <span className="text-sm font-semibold text-foreground tabular-nums">
                                                {Number(venue.price).toLocaleString()}
                                                <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
                                            </span>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            {venue.is_active ? (
                                                <Badge variant="outline" className="gap-1 text-xs font-medium px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                    <Check className="w-3 h-3" />
                                                    فعال
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1 text-xs font-medium px-2 py-0.5 bg-rose-500/10 text-rose-400 border-rose-500/20">
                                                    <X className="w-3 h-3" />
                                                    غیرفعال
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    title="ویرایش"
                                                    className="w-7 h-7 hover:bg-muted/60"
                                                    onClick={() => router.push(`/admin/venue/${venue.id}`)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    title="حذف"
                                                    className="w-7 h-7 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer count */}
                {!loading && venues.length > 0 && (
                    <div className="px-6 py-3 border-t border-border/40 bg-muted/10">
                        <span className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{venues.length}</span> سالن نمایش داده می‌شود
                        </span>
                    </div>
                )}
            </Card>
        </div>
    )
}