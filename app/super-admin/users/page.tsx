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
import { mockUsers, mockVenues, mockReservations, formatPersianDate } from '@/lib/mock-data'
import { roleLabels, type UserRole } from '@/lib/types'
import { Search, Plus, Edit2, Trash2, Eye, Shield } from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";

const roleColors: Record<UserRole, string> = {
    user: 'bg-blue-500/10 text-blue-600',
    admin: 'bg-orange-500/10 text-orange-600',
    superadmin: 'bg-purple-500/10 text-purple-600',
}

export default function SuperAdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">مدیریت کاربران</h1>
                    <p className="text-muted-foreground">مشاهده و مدیریت تمام کاربران سیستم</p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    افزودن کاربر جدید
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {mockUsers.filter((u) => u.role === 'user').length}
                                </div>
                                <div className="text-sm text-muted-foreground">کاربران عادی</div>
                            </div>
                            <Badge variant="secondary" className={roleColors.user}>کاربر</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {mockUsers.filter((u) => u.role === 'admin').length}
                                </div>
                                <div className="text-sm text-muted-foreground">مدیران سالن</div>
                            </div>
                            <Badge variant="secondary" className={roleColors.admin}>مدیر</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {mockUsers.filter((u) => u.role === 'superadmin').length}
                                </div>
                                <div className="text-sm text-muted-foreground">مدیران کل</div>
                            </div>
                            <Badge variant="secondary" className={roleColors.superadmin}>مدیر کل</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="جستجو بر اساس نام، ایمیل یا تلفن..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="نقش" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">همه نقش‌ها</SelectItem>
                                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {roleLabels[role]}
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
                                    <TableHead>کاربر</TableHead>
                                    <TableHead>تلفن</TableHead>
                                    <TableHead>نقش</TableHead>
                                    <TableHead>سالن مدیریتی</TableHead>
                                    <TableHead>رزروها</TableHead>
                                    <TableHead>تاریخ عضویت</TableHead>
                                    <TableHead>عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            کاربری یافت نشد
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const managedVenue = user.managedVenueId
                                            ? mockVenues.find((v) => v.id === user.managedVenueId)
                                            : null
                                        const reservationCount = mockReservations.filter((r) => r.userId === user.id).length

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary">
                                {user.name.charAt(0)}
                              </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground" dir="ltr">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell dir="ltr" className="text-left">{user.phone}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={roleColors[user.role]}>
                                                        {roleLabels[user.role]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {managedVenue ? (
                                                        <span className="text-sm">{managedVenue.name}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{reservationCount}</TableCell>
                                                <TableCell>{formatPersianDate(user.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button size="icon" variant="ghost" title="مشاهده">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" title="ویرایش">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" title="تغییر نقش">
                                                            <Shield className="w-4 h-4" />
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
                نمایش {filteredUsers.length} کاربر از {mockUsers.length}
            </div>
        </div>
    )
}
