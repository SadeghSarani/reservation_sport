'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-label'
import { Switch } from '@radix-ui/react-switch'
import {
    Save, Plus, Trash2, MapPin, Clock, Users,
    ImagePlus, X, GripVertical, Eye, Building2,
    ChevronRight, ToggleLeft
} from 'lucide-react'
import { venuesApi } from '@/app/api/services/venues.api'
import { useToast } from "@/components/ui/use-toast"
import {SportType, sportTypeLabels} from "@/lib/types";

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

interface VenueImage {
    id: string
    file: File
    preview: string
    uploading?: boolean
}

/* ===================== Section Wrapper ===================== */

function Section({
                     icon: Icon,
                     title,
                     subtitle,
                     children,
                 }: {
    icon: React.ElementType
    title: string
    subtitle?: string
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600">
                    <Icon className="w-4 h-4" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    )
}

/* ===================== Field ===================== */

function Field({
                   label,
                   children,
                   hint,
               }: {
    label: string
    children: React.ReactNode
    hint?: string
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
            {children}
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    )
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
        price: 0,
        isActive: true,
    })

    const [additionals, setAdditionals] = useState<Additional[]>([])
    const [calendar, setCalendar] = useState<CalendarDay[]>([])
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
    const [times, setTimes] = useState<TimeSlot[]>([])
    const [loadingTimes, setLoadingTimes] = useState(false)

    /* ---- Images ---- */
    const [images, setImages] = useState<VenueImage[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* ===================== Fetch Venue ===================== */

    interface Venue {
        id: number
        name: string
        description: string
        address: string
        capacity: number
        price: number
        is_active: number
        additionals?: any[],
        type: string,
        billing_type: string
    }

    interface SingleVenueResponse {
        data: Venue
    }

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await venuesApi.getAdminSingleVenue(venueId) as {
                    data: { data: Venue }
                }

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

    useEffect(() => {
        if (!venue) return
        venuesApi.getCalendars(venue.id).then((res: any) => {
            setCalendar(res.data.data)
        })
    }, [venue])

    const fetchTimeForDay = async (day: CalendarDay) => {
        setSelectedDay(day)
        setLoadingTimes(true)
        try {
            const res =
                await venuesApi.getTimeCalendar(day.id, venueId).then((res: any) => {
                    setTimes(res.data.data)
            })
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
            toast({ title: 'عملیات موفق', description: 'سالن بروزرسانی شد ✅', variant: 'success' })
        } catch (e) {
            console.error(e)
            toast({ title: 'خطا', description: 'خطا در بروزرسانی سالن ❌', variant: 'destructive' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveImage = async () => {
        if (!venue) return

        setIsSaving(true)

        try {
            const form = new FormData()

            images.forEach((img) => {
                // Only send NEW uploaded images
                if (img.file instanceof File) {
                    form.append('photo[]', img.file)
                }
            })

            await venuesApi.updateVenuePhoto(venue.id, form)

            toast({
                title: 'موفق',
                description: 'تصاویر با موفقیت ذخیره شدند ✅',
            })

        } catch (error) {
            console.error(error)

            toast({
                title: 'خطا',
                description: 'آپلود تصاویر انجام نشد ❌',
                variant: 'destructive',
            })
        } finally {
            setIsSaving(false)
        }
    }

    /* ===================== Additionals ===================== */

    const addAdditional = () => {
        setAdditionals(prev => [...prev, { option_name: '', option_price: 0, is_active: false }])
    }

    const removeAdditional = (index: number) => {
        setAdditionals(prev => prev.filter((_, i) => i !== index))
    }

    /* ===================== Images ===================== */

    const handleImageFiles = (files: FileList | null) => {
        if (!files) return
        const newImgs: VenueImage[] = Array.from(files).map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
        }))
        setImages(prev => [...prev, ...newImgs])
    }

    const removeImage = (id: string) => {
        setImages(prev => {
            const img = prev.find(i => i.id === id)
            if (img) URL.revokeObjectURL(img.preview)
            return prev.filter(i => i.id !== id)
        })
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        handleImageFiles(e.dataTransfer.files)
    }

    /* ===================== Loading ===================== */

    if (loadingVenue)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-slate-500">در حال بارگذاری...</p>
                </div>
            </div>
        )

    if (!venue)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500">سالن یافت نشد</p>
            </div>
        )

    /* ===================== Render ===================== */

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-slate-50 font-sans"
            style={{ fontFamily: "'Vazirmatn', 'Segoe UI', sans-serif" }}
        >
            <ToastViewport />

            {/* ── Top Bar ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>مدیریت سالن‌ها</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-slate-800">{venue.name}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Active toggle pill */}
                    <button
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, isActive: !f.isActive }))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            formData.isActive
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                        {formData.isActive ? 'فعال' : 'غیرفعال'}
                    </button>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 text-sm font-semibold gap-2"
                    >
                        {isSaving ? (
                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        ذخیره تغییرات
                    </Button>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Venue summary card */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">سالن</p>
                                <h1 className="text-2xl font-bold">{venue.name}</h1>
                            </div>
                            <Badge className="bg-white/20 text-white border-white/30 text-xs">{sportTypeLabels[venue.type as SportType]}</Badge>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-5 text-sm text-indigo-100">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-300" />
                                {venue.address}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-300" />
                                {venue.capacity} نفر ظرفیت
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-300" />
                                {venue.billing_type && venue.billing_type === 'hourly' && (
                                    <span>ساعتی</span>
                                )}
                                {venue.billing_type && venue.billing_type === 'monthly' && (
                                    <span>ماهانه</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Edit Form ── */}
                <Section icon={Building2} title="اطلاعات سالن" subtitle="مشخصات اصلی را ویرایش کنید">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <Field label="نام سالن">
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg"
                                />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="توضیحات">
                                <Textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg resize-none"
                                />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="آدرس">
                                <Input
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg"
                                />
                            </Field>
                        </div>

                        <Field label="ظرفیت (نفر)" hint="حداکثر تعداد افراد مجاز">
                            <Input
                                type="number"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: +e.target.value })}
                                className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg"
                            />
                        </Field>

                        <Field label="قیمت پایه (تومان)" hint="قیمت بر اساس نوع صورتحساب">
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: +e.target.value })}
                                className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 rounded-lg"
                            />
                        </Field>
                    </div>
                </Section>

                {/* ── Gallery / Images ── */}
                <Section icon={ImagePlus} title="گالری تصاویر" subtitle="تصاویر برای نمایش به کاربران">
                    {/* Drop zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                        className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 transition-colors p-8 flex flex-col items-center justify-center gap-3 text-center"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-300 flex items-center justify-center shadow-sm transition-colors">
                            <ImagePlus className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">تصاویر را اینجا رها کنید یا کلیک کنید</p>
                            <p className="text-xs text-slate-400 mt-1">PNG، JPG، WEBP — حداکثر ۱۰ مگابایت</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleImageFiles(e.target.files)}
                        />
                    </div>

                    {/* Thumbnails */}
                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {images.map((img, idx) => (
                                <div
                                    key={img.id}
                                    className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.preview}
                                        alt={`venue-img-${idx}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <a
                                            href={img.preview}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <Eye className="w-4 h-4 text-slate-700" />
                                        </a>
                                        <button
                                            onClick={e => { e.stopPropagation(); removeImage(img.id) }}
                                            className="w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center hover:bg-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>

                                    {/* First image badge */}
                                    {idx === 0 && (
                                        <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                            اصلی
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Add more */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 flex flex-col items-center justify-center gap-1 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-slate-400" />
                                <span className="text-xs text-slate-400">افزودن</span>
                            </button>

                            <Button
                                onClick={handleSaveImage}
                                disabled={isSaving}
                                className="bg-blue hover:bg-indigo-700 text-white rounded-lg px-5 py-2 text-sm font-semibold gap-2"
                            >
                                {isSaving ? (
                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                ذخیره عکس ها
                            </Button>
                        </div>
                    )}

                    {images.length > 0 && (
                        <p className="text-xs text-slate-400 mt-3">
                            {images.length} تصویر انتخاب شده — اولین تصویر به عنوان تصویر اصلی نمایش داده می‌شود.
                        </p>
                    )}
                </Section>

                {/* ── Additionals ── */}
                <Section icon={ToggleLeft} title="افزودنی‌ها" subtitle="گزینه‌های اضافی قابل فعال‌سازی">
                    <div className="space-y-3">
                        {additionals.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">هیچ افزودنی‌ای ثبت نشده است.</p>
                        )}

                        {additionals.map((a, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                                    a.is_active
                                        ? 'border-emerald-200 bg-emerald-50'
                                        : 'border-slate-200 bg-slate-50'
                                }`}
                            >
                                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />

                                <Input
                                    placeholder="نام گزینه"
                                    value={a.option_name}
                                    onChange={e => {
                                        const updated = [...additionals]
                                        updated[i].option_name = e.target.value
                                        setAdditionals(updated)
                                    }}
                                    className="flex-1 border-slate-200 rounded-lg bg-white text-sm"
                                />

                                <div className="relative flex-shrink-0 w-36">
                                    <Input
                                        placeholder="قیمت"
                                        value={a.option_price}
                                        onChange={e => {
                                            const updated = [...additionals]
                                            updated[i].option_price = +e.target.value
                                            setAdditionals(updated)
                                        }}
                                        className="border-slate-200 rounded-lg bg-white text-sm pl-12"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">تومان</span>
                                </div>

                                {/* Active switch */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = [...additionals]
                                        updated[i].is_active = !updated[i].is_active
                                        setAdditionals(updated)
                                    }}
                                    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                                        a.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                            a.is_active ? 'translate-x-1' : 'translate-x-5'
                                        }`}
                                    />
                                </button>

                                <button
                                    onClick={() => removeAdditional(i)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addAdditional}
                            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors hover:bg-indigo-50"
                        >
                            <Plus className="w-4 h-4" />
                            افزودن گزینه جدید
                        </button>
                    </div>
                </Section>

                {/* ── Calendar ── */}
                <Section icon={Clock} title="تقویم رزرو" subtitle="روز مورد نظر را انتخاب کنید">
                    <div className="flex flex-wrap gap-2">
                        {calendar.map(day => {
                            const isSelected = selectedDay?.id === day.id
                            return (
                                <button
                                    key={day.id}
                                    onClick={() => fetchTimeForDay(day)}
                                    className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                        day.holiday
                                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                            : isSelected
                                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                                    }`}
                                >
                                    {day.day_jalali}
                                    {day.event && (
                                        <span className="block text-[10px] opacity-70 mt-0.5">{day.event}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </Section>

                {/* ── Time Slots ── */}
                {selectedDay && (
                    <Section icon={Clock} title={`زمان‌بندی — ${selectedDay.day_jalali}`}>
                        {loadingTimes ? (
                            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                                <span className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                                در حال بارگذاری...
                            </div>
                        ) : times.length === 0 ? (
                            <p className="text-sm text-slate-400 py-4 text-center">زمانی برای این روز ثبت نشده است.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {times.map(time => {
                                    const confirmed = time.reservation?.status === 'confirmed'
                                    return (
                                        <div
                                            key={time.id}
                                            className={`rounded-xl border p-3 text-center transition-colors ${
                                                confirmed
                                                    ? 'border-emerald-200 bg-emerald-50'
                                                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                                            }`}
                                        >
                                            <p className="text-sm font-semibold text-slate-800">
                                                {time.start_time} – {time.end_time}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {Number(time.price).toLocaleString('fa-IR')} تومان
                                            </p>
                                            {confirmed && (
                                                <span className="mt-2 inline-block text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                                    رزرو شده
                                                </span>
                                            )}

                                            {!confirmed && (
                                                <Button className="
                                                order-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200
                                                px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer"
                                                >
                                                    حذف تایم
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Section>
                )}

            </div>
        </div>
    )
}