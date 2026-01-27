export type UserRole = 'user' | 'admin' | 'superadmin'

export type SportType = 'futsal' | 'volleyball' | 'basketball' | 'badminton' | 'gym'

export type ReservationType = 'hourly' | 'monthly'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface User {
    id: string
    name: string
    email: string
    phone: string
    role: UserRole
    createdAt: string
    avatar?: string
    managedVenueId?: string // For admin role - which venue they manage
}

export interface Venue {
    id: string
    name: string
    sportType: SportType
    description: string
    address: string
    city: string
    images: string[]
    hourlyPrice: number
    monthlyPrice: number
    openTime: string // "06:00"
    closeTime: string // "23:00"
    availableDays: number[] // 0-6 (Saturday to Friday in Persian calendar)
    capacity: number
    amenities: string[]
    isActive: boolean
    adminId?: string
    createdAt: string
}

export interface TimeSlot {
    id: string
    venueId: string
    date: string // YYYY-MM-DD
    startTime: string // HH:mm
    endTime: string // HH:mm
    isAvailable: boolean
    reservationId?: string
}

export interface Reservation {
    id: string
    userId: string
    venueId: string
    type: ReservationType
    status: ReservationStatus
    date: string
    startTime?: string // For hourly
    endTime?: string // For hourly
    monthStart?: string // For monthly
    monthEnd?: string // For monthly
    totalPrice: number
    paymentStatus: PaymentStatus
    paymentId?: string
    createdAt: string
    notes?: string
}

export interface Payment {
    id: string
    reservationId: string
    userId: string
    amount: number
    status: PaymentStatus
    gateway: 'zarinpal'
    authority?: string
    refId?: string
    createdAt: string
}

export interface DashboardStats {
    totalReservations: number
    totalRevenue: number
    activeVenues: number
    totalUsers: number
    pendingReservations: number
    todayReservations: number
}

// Persian translations
export const sportTypeLabels: Record<SportType, string> = {
    futsal: 'فوتسال',
    volleyball: 'والیبال',
    basketball: 'بسکتبال',
    badminton: 'بدمینتون',
    gym: 'باشگاه بدنسازی',
}

export const sportTypeIcons: Record<SportType, string> = {
    futsal: '⚽',
    volleyball: '🏐',
    basketball: '🏀',
    badminton: '🏸',
    gym: '🏋️',
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
    pending: 'در انتظار تایید',
    confirmed: 'تایید شده',
    cancelled: 'لغو شده',
    completed: 'تکمیل شده',
}

export const paymentStatusLabels: Record<PaymentStatus, string> = {
    pending: 'در انتظار پرداخت',
    paid: 'پرداخت شده',
    failed: 'ناموفق',
    refunded: 'بازگشت وجه',
}

export const roleLabels: Record<UserRole, string> = {
    user: 'کاربر',
    admin: 'مدیر سالن',
    superadmin: 'مدیر کل',
}

export const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

export const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
]
