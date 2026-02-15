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
import { Save, Plus, Trash2, MapPin, Clock, Users } from 'lucide-react'
import { venuesApi } from '@/app/api/services/venues.api'
import {useToast} from "@/components/ui/use-toast";

/* ===================== Types ===================== */

interface Additional {
    option_name: string
    option_price: number
    is_active: boolean
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
    additionals: Additional[]
}

interface CalendarDay {
    id: number
    day_jalali: string
    holiday: number
    event: string | null
}

interface TimeSlot {
    id: number
    start_time: string
    end_time: string
    price: string
    reservation?: {
        status: string
    }
}

/* ===================== Page ===================== */

export default function AdminVenuePage() {
    const { id } = useParams()
    const venueId = id as string
    const { toast, ToastViewport } = useToast()

    const [venue, setVenue] = useState<Venue | null>(null)
    const [loadingVenue, setLoadingVenue] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        capacity: 0,
        price: '',
        isActive: true,
    })

    const [additionals, setAdditionals] = useState<Additional[]>([])

    const [calendar, setCalendar] = useState<CalendarDay[]>([])
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)

    const [times, setTimes] = useState<TimeSlot[]>([])
    const [loadingTimes, setLoadingTimes] = useState(false)

    /* ===================== Fetch Venue ===================== */

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await venuesApi.getAdminSingleVenue(venueId)
                const data = res.data.data

                setVenue(data)
                setAdditionals(data.additionals || [])

                setFormData({
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    capacity: data.capacity,
                    price: Number(data.price),
                    isActive: data.is_active === 1,
                })
            } catch (e) {
                console.error(e)
            } finally {
                setLoadingVenue(false)
            }
        }

        fetchVenue()
    }, [venueId])

    /* ===================== Fetch Calendar ===================== */

    useEffect(() => {
        if (!venue) return

        venuesApi.getCalendars(venue.id).then(res => {
            setCalendar(res.data.data)
        })
    }, [venue])

    const fetchTimeForDay = async (day: CalendarDay) => {
        setSelectedDay(day)
        setLoadingTimes(true)

        try {
            const res = await venuesApi.getTimeCalendar(day.id, venueId)
            setTimes(res.data.data)
        } catch {
            setTimes([])
        } finally {
            setLoadingTimes(false)
        }
    }

    /* ===================== Save ===================== */

    const handleSave = async () => {
        if (!venue) return
        setIsSaving(true)

        try {
            await venuesApi.updateVenue(venue.id, {
                ...formData,
                is_active: formData.isActive ? 1 : 0,
                additionals: additionals.map(a => ({
                    option_name: a.option_name,
                    option_price: a.option_price,
                    is_active: a.is_active,
                })),
            })
            toast({ title: 'عملیات موفق', description: 'سالن بروزرسانی شد ✅', variant: 'success' })}
        catch (e) {
            console.error(e)
            toast({ title: 'خطا', description: 'خطا در بروزرسانی سالن ❌', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    /* ===================== Additionals ===================== */

    const addAdditional = () => {
        setAdditionals(prev => [
            ...prev,
            { option_name: '', option_price: 0, is_active: false },
        ])
    }

    const removeAdditional = (index: number) => {
        setAdditionals(prev => prev.filter((_, i) => i !== index))
    }

    /* ===================== UI ===================== */

    if (loadingVenue)
        return <div className="text-center py-16 text-muted-foreground">Loading venue...</div>

    if (!venue)
        return <div className="text-center py-16">Venue not found</div>

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">مدیریت سالن</h1>
                    <p className="text-muted-foreground">ویرایش اطلاعات سالن</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    ذخیره
                </Button>
            </div>
            <ToastViewport />

            {/* Venue Info */}
            <Card>
                <CardHeader>
                    <CardTitle>{venue.name}</CardTitle>
                    <CardDescription>
                        <Badge>{venue.type}</Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex gap-2"><MapPin className="w-4" />{venue.address}</div>
                    <div className="flex gap-2"><Users className="w-4" />{venue.capacity}</div>
                    <div className="flex gap-2"><Clock className="w-4" />{venue.billing_type}</div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
                <CardHeader><CardTitle>اطلاعات سالن</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    <Input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: +e.target.value })} />
                    <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: +e.target.value })} />
                    <div className="flex gap-3 items-center">
                        <Label>فعال</Label>
                        <Switch checked={formData.isActive} onCheckedChange={c => setFormData({ ...formData, isActive: c })} />
                    </div>
                </CardContent>
            </Card>

            {/* Additionals */}
            <Card>
                <CardHeader>
                    <CardTitle>افزودنی‌ها</CardTitle>
                    <CardDescription>قابل ویرایش و فعال‌سازی</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {additionals.map((a, i) => (
                        <div key={i} className={`flex gap-3 items-center p-3 border rounded ${a.is_active ? 'bg-green-50' : ''}`}>
                            <Input
                                placeholder="نام"
                                value={a.option_name}
                                onChange={e => {
                                    const updated = [...additionals]
                                    updated[i].option_name = e.target.value
                                    setAdditionals(updated)
                                }}
                            />
                            <Input
                                type="number"
                                placeholder="قیمت"
                                value={a.option_price}
                                onChange={e => {
                                    const updated = [...additionals]
                                    updated[i].option_price = +e.target.value
                                    setAdditionals(updated)
                                }}
                            />
                            <Switch
                                checked={a.is_active}
                                onCheckedChange={c => {
                                    const updated = [...additionals]
                                    updated[i].is_active = c
                                    setAdditionals(updated)
                                }}
                            />
                            <Button variant="ghost" onClick={() => removeAdditional(i)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" onClick={addAdditional}>
                        <Plus className="w-4 h-4 mr-2" />
                        افزودن گزینه
                    </Button>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
                <CardHeader><CardTitle>تقویم</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {calendar.map(day => (
                            <button
                                key={day.id}
                                onClick={() => fetchTimeForDay(day)}
                                className={`px-3 py-1 border rounded
                  ${day.holiday ? 'bg-red-100' :
                                    selectedDay?.id === day.id ? 'bg-blue-200' :
                                        'bg-green-100'}`}
                            >
                                {day.day_jalali} {day.event ? `(${day.event})` : ''}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDay && (
                <Card>
                    <CardHeader>
                        <CardTitle>زمان‌های {selectedDay.day_jalali}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {loadingTimes ? (
                            <p>Loading times...</p>
                        ) : times.length === 0 ? (
                            <p className="text-muted-foreground">زمانی موجود نیست</p>
                        ) : (
                            times.map(time => {
                                const confirmed = time.reservation?.status === 'confirmed'
                                return (
                                    <button
                                        key={time.id}
                                        disabled={confirmed}
                                        className={`px-4 py-2 border rounded-lg text-sm min-w-[120px]
                      ${confirmed
                                            ? 'bg-green-500 text-white cursor-not-allowed'
                                            : 'bg-white hover:bg-blue-100'}`}
                                    >
                                        <span className="block">{time.start_time} - {time.end_time}</span>
                                        <span className="block text-xs">
                      {Number(time.price).toLocaleString()} تومان
                    </span>
                                        {confirmed && (
                                            <span className="block text-xs mt-1">رزرو شده</span>
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    )
}
