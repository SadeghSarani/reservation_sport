'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { mockVenues, formatPrice } from '@/lib/mock-data'
import { sportTypeLabels, persianDays } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Save, MapPin, Clock, Users, Check } from 'lucide-react'
import {Label} from "@radix-ui/react-label";
import {Switch} from "@radix-ui/react-switch";
import {Textarea} from "@/components/ui/textarea";

export default function AdminVenuePage() {
    const { user } = useAuth()
    const [isSaving, setIsSaving] = useState(false)

    // Get venue managed by this admin
    const venue = useMemo(() => {
        if (!user?.managedVenueId) {
            return mockVenues[0]
        }
        return mockVenues.find((v) => v.id === user.managedVenueId) || mockVenues[0]
    }, [user])

    const [formData, setFormData] = useState({
        name: venue?.name || '',
        description: venue?.description || '',
        address: venue?.address || '',
        hourlyPrice: venue?.hourlyPrice || 0,
        monthlyPrice: venue?.monthlyPrice || 0,
        openTime: venue?.openTime || '06:00',
        closeTime: venue?.closeTime || '23:00',
        capacity: venue?.capacity || 10,
        isActive: venue?.isActive ?? true,
    })

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    if (!venue) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">سالنی برای مدیریت یافت نشد</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">مدیریت سالن</h1>
                    <p className="text-muted-foreground">ویرایش اطلاعات و تنظیمات سالن</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
            </div>

            {/* Venue Info Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>{venue.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{sportTypeLabels[venue.sportType]}</Badge>
                                <span className="text-muted-foreground">|</span>
                                <span>{venue.city}</span>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="isActive" className="text-sm">فعال</Label>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{venue.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{venue.openTime} - {venue.closeTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>ظرفیت: {venue.capacity} نفر</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات پایه</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">نام سالن</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">توضیحات</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">آدرس</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity">ظرفیت (نفر)</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>قیمت‌گذاری</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hourlyPrice">قیمت ساعتی (تومان)</Label>
                            <Input
                                id="hourlyPrice"
                                type="number"
                                value={formData.hourlyPrice}
                                onChange={(e) => setFormData({ ...formData, hourlyPrice: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                قیمت فعلی: {formatPrice(formData.hourlyPrice)}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="monthlyPrice">قیمت ماهیانه (تومان)</Label>
                            <Input
                                id="monthlyPrice"
                                type="number"
                                value={formData.monthlyPrice}
                                onChange={(e) => setFormData({ ...formData, monthlyPrice: parseInt(e.target.value) || 0 })}
                            />
                            <p className="text-xs text-muted-foreground">
                                قیمت فعلی: {formatPrice(formData.monthlyPrice)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>ساعات کاری</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="openTime">ساعت شروع</Label>
                                <Input
                                    id="openTime"
                                    type="time"
                                    value={formData.openTime}
                                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closeTime">ساعت پایان</Label>
                                <Input
                                    id="closeTime"
                                    type="time"
                                    value={formData.closeTime}
                                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>روزهای کاری</Label>
                            <div className="flex flex-wrap gap-2">
                                {persianDays.map((day, index) => {
                                    const isActive = venue.availableDays.includes(index)
                                    return (
                                        <Badge
                                            key={day}
                                            variant={isActive ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                        >
                                            {isActive && <Check className="w-3 h-3 ml-1" />}
                                            {day}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amenities */}
                <Card>
                    <CardHeader>
                        <CardTitle>امکانات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {venue.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="gap-1">
                                    <Check className="w-3 h-3" />
                                    {amenity}
                                </Badge>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                            ویرایش امکانات
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
