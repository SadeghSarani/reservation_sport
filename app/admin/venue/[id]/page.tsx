'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import { Switch } from '@radix-ui/react-switch'
import { Save, MapPin, Clock, Users } from 'lucide-react'
import { venuesApi } from '@/app/api/services/venues.api'

interface VenuePrice {
    id: number
    start_time: string
    end_time: string
    price: string
}

interface Venue {
    id: number
    name: string
    type: string
    billing_type: string
    address: string
    capacity: number
    is_active: number
    description: string
    price: string
    venue_price: VenuePrice[]
}

interface CalendarDay {
    id: number
    day: string
    day_jalali: string
    holiday: number
    event: string | null
}

interface TimeSlot {
    id: number
    start_time: string
    end_time: string
    price: string
}

export default function AdminVenuePage() {
    const params = useParams()
    const venueId = params.id as string

    // Venue State
    const [venue, setVenue] = useState<Venue | null>(null)
    const [loadingVenue, setLoadingVenue] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        capacity: 0,
        price: 0,
        isActive: true,
    })

    // Calendar State
    const [calendar, setCalendar] = useState<CalendarDay[]>([])
    const [loadingCalendar, setLoadingCalendar] = useState(true)
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

    // Time Slots State
    const [times, setTimes] = useState<TimeSlot[]>([])
    const [loadingTimes, setLoadingTimes] = useState(false)

    /** Fetch Venue */
    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const response = await venuesApi.getAdminSingleVenue(venueId)
                const venueData = response.data.data
                setVenue(venueData)
                setFormData({
                    name: venueData.name,
                    description: venueData.description,
                    address: venueData.address,
                    capacity: venueData.capacity,
                    price: Number(venueData.price),
                    isActive: venueData.is_active === 1,
                })
            } catch (error) {
                console.error('Failed to fetch venue:', error)
            } finally {
                setLoadingVenue(false)
            }
        }
        fetchVenue()
    }, [venueId])

    /** Fetch Calendar */
    useEffect(() => {
        if (!venue) return
        const fetchCalendar = async () => {
            try {
                const response = await venuesApi.getCalendars(venue.id)
                setCalendar(response.data.data)
            } catch (error) {
                console.error('Failed to fetch calendar:', error)
            } finally {
                setLoadingCalendar(false)
            }
        }
        fetchCalendar()
    }, [venue])

    /** Fetch Time Slots for selected day */
    const fetchTimeForDay = async (day: CalendarDay) => {
        setSelectedDay(day)
        setLoadingTimes(true)
        try {
            const response = await venuesApi.getTimeCalendar(day.id, venueId)
            setTimes(response.data.data)
        } catch (error) {
            console.error('Failed to fetch times:', error)
            setTimes([])
        } finally {
            setLoadingTimes(false)
        }
    }

    /** Save Venue */
    const handleSave = async () => {
        if (!venue) return
        try {
            setIsSaving(true)
            await venuesApi.updateVenue(venue.id, {
                ...formData,
                is_active: formData.isActive ? 1 : 0,
            })
        } catch (error) {
            console.error('Save failed:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (loadingVenue) return <div className="text-center py-16 text-muted-foreground">Loading venue...</div>
    if (!venue) return <div className="text-center py-16 text-muted-foreground">سالنی یافت نشد</div>

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">مدیریت سالن</h1>
                    <p className="text-muted-foreground">ویرایش اطلاعات سالن</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </Button>
            </div>

            {/* Venue Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>{venue.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {venue.type === 'futsal' ? 'فوتسال' :
                                venue.type === 'volleyball' ? 'والیبال' :
                                    venue.type === 'basketball' ? 'بسکتبال' : 'نامشخص'}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{venue.address}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" />ظرفیت: {venue.capacity} نفر</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" />نوع پرداخت: {venue.billing_type === 'hourly' ? 'ساعتی' : 'ماهیانه'}</div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
                <CardHeader><CardTitle>ویرایش اطلاعات</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div><Label>نام سالن</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    <div><Label>توضیحات</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
                    <div><Label>آدرس</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                    <div><Label>ظرفیت</Label><Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} /></div>
                    <div><Label>قیمت پایه</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} /></div>
                    <div className="flex items-center gap-3"><Label>فعال</Label><Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} /></div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
                <CardHeader><CardTitle>تقویم</CardTitle></CardHeader>
                <CardContent>
                    {loadingCalendar ? (
                        <p>Loading calendar...</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {calendar.map(day => (
                                <button
                                    key={day.id}
                                    className={`px-3 py-1 border rounded ${
                                        day.holiday ? 'bg-red-100' : selectedDay?.id === day.id ? 'bg-blue-200' : 'bg-green-100'
                                    }`}
                                    onClick={() => fetchTimeForDay(day)}
                                >
                                    {day.day_jalali} {day.event ? `(${day.event})` : ''}
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDay && (
                <Card>
                    <CardHeader>
                        <CardTitle>زمان‌های موجود برای {selectedDay.day_jalali}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {loadingTimes ? (
                            <p>Loading times...</p>
                        ) : times.length === 0 ? (
                            <p className="text-muted-foreground">زمانی موجود نیست</p>
                        ) : (
                            times.map(time => (
                                <button
                                    key={time.id}
                                    className="px-4 py-2 border rounded-lg bg-white hover:bg-blue-100 transition-colors text-sm flex-1 min-w-[120px] text-center"
                                >
                                    <span className="block font-medium">{time.start_time} - {time.end_time}</span>
                                    <span className="block text-gray-500">{Number(time.price).toLocaleString()} تومان</span>
                                </button>
                            ))
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    )
}
