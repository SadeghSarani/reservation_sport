'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table'
import { mockVenues, mockUsers, mockReservations, formatPrice } from '@/lib/mock-data'
import { sportTypeLabels, type SportType } from '@/lib/types'
import { Search, Plus, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";

export default function SuperAdminVenuesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all')

    const filteredVenues = mockVenues.filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.city.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSport = sportFilter === 'all' || venue.sportType === sportFilter
        return matchesSearch && matchesSport
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">مدیریت سالن‌ها</h1>
                    <p className="text-muted-foreground">مشاهده و مدیریت تمام سالن‌های ورزشی</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    افزودن سالن جدید
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="جستجو بر اساس نام یا شهر..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                        <Select value={sportFilter} onValueChange={(v) => setSportFilter(v as SportType | 'all')}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="رشته ورزشی" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">همه رشته‌ها</SelectItem>
                                {(Object.keys(sportTypeLabels) as SportType[]).map((sport) => (
                                    <SelectItem key={sport} value={sport}>
                                        {sportTypeLabels[sport]}
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
                                    <TableHead>سالن</TableHead>
                                    <TableHead>رشته</TableHead>
                                    <TableHead>شهر</TableHead>
                                    <TableHead>مدیر</TableHead>
                                    <TableHead>قیمت ساعتی</TableHead>
                                    <TableHead>رزروها</TableHead>
                                    <TableHead>وضعیت</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVenues.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            سالنی یافت نشد
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVenues.map((venue) => {
                                        const admin = mockUsers.find((u) => u.id === venue.adminId)
                                        const reservationCount = mockReservations.filter((r) => r.venueId === venue.id).length

                                        return (
                                            <TableRow key={venue.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{venue.name}</div>
                                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {venue.address}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{sportTypeLabels[venue.sportType]}</Badge>
                                                </TableCell>
                                                <TableCell>{venue.city}</TableCell>
                                                <TableCell>
                                                    {admin ? (
                                                        <div>
                                                            <div className="text-sm">{admin.name}</div>
                                                            <div className="text-xs text-muted-foreground" dir="ltr">{admin.phone}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{formatPrice(venue.hourlyPrice)}</TableCell>
                                                <TableCell>{reservationCount}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={venue.isActive ? 'default' : 'secondary'}
                                                        className={venue.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}
                                                    >
                                                        {venue.isActive ? 'فعال' : 'غیرفعال'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button size="icon" variant="ghost" title="مشاهده">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" title="ویرایش">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            title={venue.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                                                            className={venue.isActive ? 'text-red-600' : 'text-green-600'}
                                                        >
                                                            {venue.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                        </Button>
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

            <div className="text-sm text-muted-foreground">
                نمایش {filteredVenues.length} سالن از {mockVenues.length}
            </div>
        </div>
    )
}
