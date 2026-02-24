'use client'

import {useState, useRef, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Save, Plus, Trash2, MapPin, Clock, Users,
    ImagePlus, X, GripVertical, Eye, Building2,
    ChevronRight, ToggleLeft, AlarmClock, Calendar
} from 'lucide-react'
import { venuesApi } from '@/app/api/services/venues.api'
import { useToast } from '@/components/ui/use-toast'
import { sportTypeLabels } from '@/lib/types'

/* ===================== Types ===================== */

interface Additional {
    option_name: string
    option_price: number
    is_active: boolean
}

interface VenueImage {
    id: string
    file: File
    preview: string
}

interface TimeRange {
    id: string
    from: string   // "HH:mm"
    to: string     // "HH:mm"
    price: number
}

interface TimeSchedule {
    id: string
    interval_minutes: number
    ranges: TimeRange[]
}

/* ===================== Helpers ===================== */

function timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
}

function minutesToTime(m: number): string {
    const h = Math.floor(m / 60) % 24
    const min = m % 60
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function generateSlots(from: string, to: string, intervalMin: number): string[] {
    const start = timeToMinutes(from)
    const end = timeToMinutes(to)
    if (start >= end || intervalMin <= 0) return []
    const slots: string[] = []
    for (let t = start; t + intervalMin <= end; t += intervalMin) {
        slots.push(`${minutesToTime(t)} – ${minutesToTime(t + intervalMin)}`)
    }
    return slots
}

const INTERVAL_OPTIONS = [
    { label: '۳۰ دقیقه', value: 30 },
    { label: '۴۵ دقیقه', value: 45 },
    { label: '۱ ساعت', value: 60 },
    { label: '۱ ساعت و ۱۵ دقیقه', value: 75 },
    { label: '۱ ساعت و ۳۰ دقیقه', value: 90 },
    { label: '۲ ساعت', value: 120 },
    { label: '۳ ساعت', value: 180 },
]

const SPORT_TYPES = Object.entries(sportTypeLabels)
const BILLING_TYPES = [
    { value: 'hourly', label: 'ساعتی' },
    { value: 'monthly', label: 'ماهانه' },
    { value: 'session', label: 'جلسه‌ای' },
]

/* ===================== Section ===================== */

function Section({
                     icon: Icon, title, subtitle, children,
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

function Field({
                   label, children, hint, required,
               }: {
    label: string; children: React.ReactNode; hint?: string; required?: boolean
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {label}{required && <span className="text-red-500 mr-1">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
    )
}

/* ===================== TimeScheduleSection ===================== */

function TimeScheduleSection({
                                 schedules,
                                 onChange,
                             }: {
    schedules: TimeSchedule[]
    onChange: (s: TimeSchedule[]) => void
}) {
    const makeRange = (): TimeRange => ({
        id: `${Date.now()}-${Math.random()}`,
        from: '08:00', to: '12:00', price: 0,
    })

    const makeSchedule = (): TimeSchedule => ({
        id: `${Date.now()}-${Math.random()}`,
        interval_minutes: 90,
        ranges: [makeRange()],
    })

    const addSchedule = () => onChange([...schedules, makeSchedule()])
    const removeSchedule = (sid: string) => onChange(schedules.filter(s => s.id !== sid))
    const patchSchedule = (sid: string, patch: Partial<TimeSchedule>) =>
        onChange(schedules.map(s => s.id === sid ? { ...s, ...patch } : s))

    const addRange = (sid: string) =>
        onChange(schedules.map(s =>
            s.id === sid ? { ...s, ranges: [...s.ranges, makeRange()] } : s
        ))
    const removeRange = (sid: string, rid: string) =>
        onChange(schedules.map(s =>
            s.id === sid ? { ...s, ranges: s.ranges.filter(r => r.id !== rid) } : s
        ))
    const patchRange = (sid: string, rid: string, patch: Partial<TimeRange>) =>
        onChange(schedules.map(s =>
            s.id === sid
                ? { ...s, ranges: s.ranges.map(r => r.id === rid ? { ...r, ...patch } : r) }
                : s
        ))

    return (
        <div className="space-y-5">
            {schedules.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">هیچ بازه زمانی تعریف نشده است.</p>
            )}

            {schedules.map((schedule, si) => (
                <div key={schedule.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                {si + 1}
                            </span>
                            <span className="text-sm font-semibold text-indigo-800">گروه زمانبندی</span>
                        </div>
                        <button
                            onClick={() => removeSchedule(schedule.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">

                        {/* Interval selector */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                                مدت هر نوبت
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {INTERVAL_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => patchSchedule(schedule.id, { interval_minutes: opt.value })}
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                            schedule.interval_minutes === opt.value
                                                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ranges */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                                بازه‌های زمانی با قیمت مجزا
                            </label>

                            {schedule.ranges.map((range) => {
                                const slots = generateSlots(range.from, range.to, schedule.interval_minutes)
                                const isInvalid = range.from && range.to && timeToMinutes(range.from) >= timeToMinutes(range.to)

                                return (
                                    <div key={range.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">

                                        {/* Inputs */}
                                        <div className="flex items-end gap-3 p-3 flex-wrap">

                                            {/* From */}
                                            <div className="flex-1 min-w-[110px]">
                                                <label className="text-[10px] text-slate-400 block mb-1">از ساعت</label>
                                                <Input
                                                    type="time"
                                                    value={range.from}
                                                    onChange={e => patchRange(schedule.id, range.id, { from: e.target.value })}
                                                    className="border-slate-200 rounded-lg text-sm h-9"
                                                />
                                            </div>

                                            <span className="text-slate-400 text-sm pb-2 flex-shrink-0">تا</span>

                                            {/* To */}
                                            <div className="flex-1 min-w-[110px]">
                                                <label className="text-[10px] text-slate-400 block mb-1">تا ساعت</label>
                                                <Input
                                                    type="time"
                                                    value={range.to}
                                                    onChange={e => patchRange(schedule.id, range.id, { to: e.target.value })}
                                                    className="border-slate-200 rounded-lg text-sm h-9"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="w-44 flex-shrink-0">
                                                <label className="text-[10px] text-slate-400 block mb-1">قیمت هر نوبت (تومان)</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        value={range.price || ''}
                                                        onChange={e => patchRange(schedule.id, range.id, { price: +e.target.value })}
                                                        className="border-slate-200 rounded-lg text-sm h-9 pl-12"
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">تومان</span>
                                                </div>
                                            </div>

                                            {schedule.ranges.length > 1 && (
                                                <button
                                                    onClick={() => removeRange(schedule.id, range.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Slot preview */}
                                        {isInvalid ? (
                                            <div className="px-3 pb-3">
                                                <p className="text-[11px] text-red-400">⚠️ ساعت شروع باید قبل از ساعت پایان باشد.</p>
                                            </div>
                                        ) : slots.length > 0 ? (
                                            <div className="px-3 pb-3 border-t border-slate-100 pt-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                                        پیش‌نمایش نوبت‌ها — {slots.length} نوبت
                                                    </p>
                                                    {range.price > 0 && (
                                                        <span className="text-[10px] text-emerald-600 font-semibold">
                                                            هر نوبت: {range.price.toLocaleString('fa-IR')} تومان
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {slots.map((slot, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-medium"
                                                        >
                                                            <Clock className="w-2.5 h-2.5" />
                                                            {slot}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            })}

                            {/* Add range */}
                            <button
                                type="button"
                                onClick={() => addRange(schedule.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 text-xs font-medium transition-colors hover:bg-indigo-50"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                افزودن بازه زمانی با قیمت متفاوت
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add schedule group */}
            <button
                type="button"
                onClick={addSchedule}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 text-indigo-400 hover:text-indigo-600 text-sm font-medium transition-colors hover:bg-indigo-50"
            >
                <Plus className="w-4 h-4" />
                افزودن گروه زمانبندی جدید
            </button>
        </div>
    )
}

/* ===================== Page ===================== */

export default function CreateVenuePage() {
    const router = useRouter()
    const { toast, ToastViewport } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '', description: '', address: '',
        capacity: 0, price: 0, type: '',
        billing_type: 'hourly', isActive: true,
    })

    const [additionals, setAdditionals] = useState<Additional[]>([])
    const [images, setImages] = useState<VenueImage[]>([])
    const [schedules, setSchedules] = useState<TimeSchedule[]>([])

    /* Images */
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

    /* Submit */
    const handleSubmit = async () => {

        console.log(formData.name ,formData.address ,formData.type)
        if (!formData.name || !formData.address || !formData.type) {
            toast({
                title: 'خطا',
                description: 'لطفاً فیلدهای اجباری را تکمیل کنید ⚠️',
                variant: 'destructive'
            })
            return
        }


        // Clean schedules before sending
        const cleanedSchedules = schedules
            .map(schedule => ({
                interval_minutes: schedule.interval_minutes,
                ranges: schedule.ranges
                    .filter(r =>
                        r.from &&
                        r.to &&
                        r.price >= 0 &&
                        r.from < r.to
                    )
                    .map(r => ({
                        from: r.from,
                        to: r.to,
                        price: r.price || 0
                    }))
            }))
            .filter(s => s.ranges.length > 0)

        const payload = {
            name: formData.name,
            description: formData.description,
            address: formData.address,
            capacity: Number(formData.capacity) || 0,
            price: Number(formData.price) || 0,
            type: formData.type,
            billing_type: formData.billing_type,
            is_active: formData.isActive ? 1 : 0,
            additionals: additionals.map(a => ({
                option_name: a.option_name,
                option_price: Number(a.option_price) || 0,
                is_active: a.is_active
            })),
            time_schedules:
                formData.billing_type === 'hourly'
                    ? cleanedSchedules
                    : [],
            calendars_id: selectedDays
        }

        setIsSaving(true)

        try {
            const response = await venuesApi.createVenue(payload)

            const newId = response.data.data.id

            // Upload images separately
            if (images.length > 0) {
                const formDataImg = new FormData()

                images.forEach(img => {
                    if (img.file instanceof File) {
                        formDataImg.append('photo[]', img.file)
                    }
                })

                await venuesApi.updateVenuePhoto(newId, formDataImg)
            }

            toast({
                title: 'عملیات موفق',
                description: 'سالن با موفقیت ایجاد شد ✅',
                variant: 'success'
            })

            router.push(`/admin/venues/${newId}`)

        } catch (error: any) {

            console.error(error)

            toast({
                title: 'خطا',
                description:
                    error?.response?.data?.message ||
                    'خطا در ایجاد سالن ❌',
                variant: 'destructive'
            })

        } finally {
            setIsSaving(false)
        }
    }
    const SaveBtn = () => (
        <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 text-sm font-semibold gap-2"
        >
            {isSaving
                ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                : <Save className="w-4 h-4" />}
            ایجاد سالن
        </Button>
    )


    const [days, setDays] = useState<CalendarDay[]>([])
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [isLoadingDays, setIsLoadingDays] = useState(false)

    const fetchDays = async () => {
        try {
            setIsLoadingDays(true)

            const response = await venuesApi.getCalendarData()
            setDays(response.data.data)

        } catch (error) {
            console.error('Days fetch error:', error)
            setDays([])
        } finally {
            setIsLoadingDays(false)
        }
    }

    useEffect(() => {
        fetchDays()
    }, [])

    const toggleDaySelection = (id: number) => {
        setSelectedDays(prev =>
            prev.includes(id)
                ? prev.filter(dayId => dayId !== id)
                : [...prev, id]
        )
    }

    return (
        <div dir="rtl" className="min-h-screen bg-slate-50 font-sans"
             style={{ fontFamily: "'Vazirmatn', 'Segoe UI', sans-serif" }}>
            <ToastViewport />

            {/* Top Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>مدیریت سالن‌ها</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-slate-800">ایجاد سالن جدید</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, isActive: !f.isActive }))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            formData.isActive
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {formData.isActive ? 'فعال' : 'غیرفعال'}
                    </button>
                    <SaveBtn />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Hero */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">سالن جدید</p>
                                <h1 className="text-2xl font-bold">{formData.name || 'نام سالن را وارد کنید...'}</h1>
                            </div>
                            {formData.type && (
                                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                                    {sportTypeLabels[formData.type]}
                                </Badge>
                            )}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-5 text-sm text-indigo-100">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-300" />
                                {formData.address || 'آدرس وارد نشده'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-300" />
                                {formData.capacity || 0} نفر ظرفیت
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-300" />
                                {BILLING_TYPES.find(b => b.value === formData.billing_type)?.label || '—'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <Section icon={Building2} title="اطلاعات سالن" subtitle="مشخصات اصلی سالن را وارد کنید">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div className="md:col-span-2">
                            <Field label="نام سالن" required>
                                <Input placeholder="مثال: سالن ورزشی آزادی" value={formData.name}
                                       onChange={e => setFormData({ ...formData, name: e.target.value })}
                                       className="border-slate-200 focus:border-indigo-400 rounded-lg" />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="توضیحات">
                                <Textarea placeholder="توضیح مختصری از سالن..." value={formData.description}
                                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                                          rows={3} className="border-slate-200 focus:border-indigo-400 rounded-lg resize-none" />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="آدرس" required>
                                <Input placeholder="آدرس دقیق سالن" value={formData.address}
                                       onChange={e => setFormData({ ...formData, address: e.target.value })}
                                       className="border-slate-200 focus:border-indigo-400 rounded-lg" />
                            </Field>
                        </div>

                        <Field label="ظرفیت (نفر)" hint="حداکثر تعداد افراد مجاز">
                            <Input type="number" placeholder="0" value={formData.capacity || ''}
                                   onChange={e => setFormData({ ...formData, capacity: +e.target.value })}
                                   className="border-slate-200 focus:border-indigo-400 rounded-lg" />
                        </Field>

                        <Field label="قیمت پایه (تومان)" hint="پیش‌فرض — در صورت تعریف نوبت‌های ساعتی اختیاری است">
                            <Input type="number" placeholder="0" value={formData.price || ''}
                                   onChange={e => setFormData({ ...formData, price: +e.target.value })}
                                   className="border-slate-200 focus:border-indigo-400 rounded-lg" />
                        </Field>

                        <Field label="نوع ورزش" required>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {SPORT_TYPES.map(([value, label]) => (
                                    <button key={value} type="button"
                                            onClick={() => setFormData({ ...formData, type: value })}
                                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                                formData.type === value
                                                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}>{label}</button>
                                ))}
                            </div>
                        </Field>

                        <Field label="نوع صورتحساب" required>
                            <div className="flex gap-2 pt-1">
                                {BILLING_TYPES.map(bt => (
                                    <button key={bt.value} type="button"
                                            onClick={() => setFormData({ ...formData, billing_type: bt.value })}
                                            className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                                                formData.billing_type === bt.value
                                                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                                            }`}>{bt.label}</button>
                                ))}
                            </div>
                        </Field>

                    </div>
                </Section>

                {/* Time Schedules — only for hourly */}
                {formData.billing_type === 'hourly' && (
                    <Section icon={AlarmClock} title="زمانبندی نوبت‌ها" subtitle="بازه‌های زمانی و قیمت هر نوبت را تعریف کنید">
                        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700 leading-relaxed">
                            💡 می‌توانید چند گروه زمانبندی با فاصله و قیمت‌های مجزا تعریف کنید.
                            مثلاً از <strong>۱۰:۰۰ تا ۱۴:۰۰</strong> با فاصله ۱.۵ ساعته (۴ نوبت) با قیمت ۵۰۰,۰۰۰ تومان،
                            و <strong>۱۴:۰۰ تا ۰۰:۰۰</strong> با قیمت ۸۰۰,۰۰۰ تومان.
                        </div>
                        <TimeScheduleSection schedules={schedules} onChange={setSchedules} />
                    </Section>
                )}

                <Section
                    icon={Calendar}
                    title="انتخاب تاریخ‌ها"
                    subtitle="می‌توانید چند تاریخ را انتخاب کنید"
                >
                    <div className="space-y-4">

                        {/* Loading */}
                        {isLoadingDays && (
                            <p className="text-sm text-slate-400">
                                در حال دریافت تاریخ‌ها...
                            </p>
                        )}

                        {/* Days Grid */}
                        {!isLoadingDays && (
                            <>
                                {days.length === 0 ? (
                                    <p className="text-sm text-red-400">
                                        تاریخی موجود نیست
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                                        {days.map(day => {
                                            const isSelected = selectedDays.includes(day.id)
                                            const isHoliday = day.holiday === 1

                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => toggleDaySelection(day.id)}
                                                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-center
                    ${
                                                        isSelected
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : isHoliday
                                                                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                    }
                  `}
                                                >
                                                    <div>{day.day_jalali}</div>

                                                    <div className="text-xs mt-1 opacity-80">
                                                        {isHoliday ? 'تعطیل' : 'عادی'}
                                                    </div>
                                                </button>
                                            )
                                        })}

                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </Section>

                {/* Gallery */}
                <Section icon={ImagePlus} title="گالری تصاویر" subtitle="تصاویر برای نمایش به کاربران">
                    <div
                        onDrop={e => { e.preventDefault(); handleImageFiles(e.dataTransfer.files) }}
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
                        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                               onChange={e => handleImageFiles(e.target.files)} />
                    </div>

                    {images.length > 0 && (
                        <>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {images.map((img, idx) => (
                                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <a href={img.preview} target="_blank" rel="noreferrer"
                                               className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                                               onClick={e => e.stopPropagation()}>
                                                <Eye className="w-4 h-4 text-slate-700" />
                                            </a>
                                            <button onClick={e => { e.stopPropagation(); removeImage(img.id) }}
                                                    className="w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center hover:bg-red-500">
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                        {idx === 0 && (
                                            <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">اصلی</span>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                        className="aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 flex flex-col items-center justify-center gap-1 transition-colors">
                                    <Plus className="w-5 h-5 text-slate-400" />
                                    <span className="text-xs text-slate-400">افزودن</span>
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">
                                {images.length} تصویر انتخاب شده — اولین تصویر به عنوان تصویر اصلی نمایش داده می‌شود.
                            </p>
                        </>
                    )}
                </Section>

                {/* Additionals */}
                <Section icon={ToggleLeft} title="افزودنی‌ها" subtitle="گزینه‌های اضافی قابل فعال‌سازی">
                    <div className="space-y-3">
                        {additionals.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">هیچ افزودنی‌ای ثبت نشده است.</p>
                        )}
                        {additionals.map((a, i) => (
                            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                                a.is_active ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                <Input placeholder="نام گزینه" value={a.option_name}
                                       onChange={e => { const u = [...additionals]; u[i].option_name = e.target.value; setAdditionals(u) }}
                                       className="flex-1 border-slate-200 rounded-lg bg-white text-sm" />
                                <div className="relative flex-shrink-0 w-36">
                                    <Input placeholder="قیمت" type="number" value={a.option_price}
                                           onChange={e => { const u = [...additionals]; u[i].option_price = +e.target.value; setAdditionals(u) }}
                                           className="border-slate-200 rounded-lg bg-white text-sm pl-12" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">تومان</span>
                                </div>
                                <button type="button"
                                        onClick={() => { const u = [...additionals]; u[i].is_active = !u[i].is_active; setAdditionals(u) }}
                                        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${a.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${a.is_active ? 'translate-x-1' : 'translate-x-5'}`} />
                                </button>
                                <button onClick={() => setAdditionals(prev => prev.filter((_, idx) => idx !== i))}
                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button type="button"
                                onClick={() => setAdditionals(prev => [...prev, { option_name: '', option_price: 0, is_active: false }])}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors hover:bg-indigo-50">
                            <Plus className="w-4 h-4" />
                            افزودن گزینه جدید
                        </button>
                    </div>
                </Section>

                {/* Footer */}
                <div className="flex justify-end gap-3 pb-8">
                    <Button variant="outline" onClick={() => router.back()} className="rounded-lg px-5 py-2 text-sm">
                        انصراف
                    </Button>
                    <SaveBtn />
                </div>
            </div>
        </div>
    )
}