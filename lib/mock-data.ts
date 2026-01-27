import type { User, Venue, Reservation, Payment, SportType } from './type'

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'علی احمدی',
        email: 'ali@example.com',
        phone: '09121234567',
        role: 'superadmin',
        createdAt: '2024-01-01',
        avatar: undefined,
    },
    {
        id: '2',
        name: 'محمد رضایی',
        email: 'mohammad@example.com',
        phone: '09129876543',
        role: 'admin',
        createdAt: '2024-02-15',
        managedVenueId: '1',
    },
    {
        id: '3',
        name: 'زهرا حسینی',
        email: 'zahra@example.com',
        phone: '09123456789',
        role: 'admin',
        createdAt: '2024-03-10',
        managedVenueId: '2',
    },
    {
        id: '4',
        name: 'رضا کریمی',
        email: 'reza@example.com',
        phone: '09127654321',
        role: 'user',
        createdAt: '2024-04-20',
    },
    {
        id: '5',
        name: 'مریم موسوی',
        email: 'maryam@example.com',
        phone: '09125551234',
        role: 'user',
        createdAt: '2024-05-05',
    },
]

export const mockVenues: Venue[] = [
    {
        id: '1',
        name: 'سالن فوتسال المپیک',
        sportType: 'futsal',
        description: 'سالن فوتسال مجهز با کفپوش استاندارد و سیستم روشنایی حرفه‌ای',
        address: 'خیابان ولیعصر، نرسیده به میدان ونک',
        city: 'تهران',
        images: ['/venues/futsal-1.jpg'],
        hourlyPrice: 500000,
        monthlyPrice: 8000000,
        openTime: '06:00',
        closeTime: '23:00',
        availableDays: [0, 1, 2, 3, 4, 5, 6],
        capacity: 14,
        amenities: ['رختکن', 'دوش', 'پارکینگ', 'بوفه'],
        isActive: true,
        adminId: '2',
        createdAt: '2024-01-10',
    },
    {
        id: '2',
        name: 'سالن والیبال آزادی',
        sportType: 'volleyball',
        description: 'سالن والیبال با استانداردهای بین‌المللی و تور حرفه‌ای',
        address: 'مجموعه ورزشی آزادی',
        city: 'تهران',
        images: ['/venues/volleyball-1.jpg'],
        hourlyPrice: 400000,
        monthlyPrice: 6500000,
        openTime: '07:00',
        closeTime: '22:00',
        availableDays: [0, 1, 2, 3, 4, 5],
        capacity: 16,
        amenities: ['رختکن', 'دوش', 'پارکینگ'],
        isActive: true,
        adminId: '3',
        createdAt: '2024-01-15',
    },
    {
        id: '3',
        name: 'سالن بسکتبال نور',
        sportType: 'basketball',
        description: 'زمین بسکتبال با کفپوش چوبی و حلقه‌های استاندارد NBA',
        address: 'خیابان شریعتی، نبش خیابان میرداماد',
        city: 'تهران',
        images: ['/venues/basketball-1.jpg'],
        hourlyPrice: 450000,
        monthlyPrice: 7000000,
        openTime: '08:00',
        closeTime: '22:00',
        availableDays: [0, 1, 2, 3, 4, 5, 6],
        capacity: 12,
        amenities: ['رختکن', 'دوش', 'پارکینگ', 'کافه'],
        isActive: true,
        createdAt: '2024-02-01',
    },
    {
        id: '4',
        name: 'سالن بدمینتون پارسیان',
        sportType: 'badminton',
        description: 'سالن بدمینتون با 4 زمین استاندارد و ارتفاع مناسب',
        address: 'خیابان پاسداران، نبش گلستان',
        city: 'تهران',
        images: ['/venues/badminton-1.jpg'],
        hourlyPrice: 300000,
        monthlyPrice: 5000000,
        openTime: '06:00',
        closeTime: '21:00',
        availableDays: [0, 1, 2, 3, 4, 5],
        capacity: 8,
        amenities: ['رختکن', 'دوش', 'فروشگاه تجهیزات'],
        isActive: true,
        createdAt: '2024-02-15',
    },
    {
        id: '5',
        name: 'باشگاه بدنسازی قهرمان',
        sportType: 'gym',
        description: 'باشگاه مجهز با دستگاه‌های حرفه‌ای و مربیان مجرب',
        address: 'خیابان جردن، خیابان آفریقا',
        city: 'تهران',
        images: ['/venues/gym-1.jpg'],
        hourlyPrice: 150000,
        monthlyPrice: 2500000,
        openTime: '05:00',
        closeTime: '23:00',
        availableDays: [0, 1, 2, 3, 4, 5, 6],
        capacity: 50,
        amenities: ['رختکن', 'دوش', 'سونا', 'استخر', 'کافه سالم'],
        isActive: true,
        createdAt: '2024-03-01',
    },
    {
        id: '6',
        name: 'سالن فوتسال ستارگان',
        sportType: 'futsal',
        description: 'سالن فوتسال با چمن مصنوعی درجه یک',
        address: 'شهرک غرب، فاز 2',
        city: 'تهران',
        images: ['/venues/futsal-2.jpg'],
        hourlyPrice: 600000,
        monthlyPrice: 9000000,
        openTime: '07:00',
        closeTime: '24:00',
        availableDays: [0, 1, 2, 3, 4, 5, 6],
        capacity: 14,
        amenities: ['رختکن', 'دوش', 'پارکینگ', 'بوفه', 'سیستم صوتی'],
        isActive: true,
        createdAt: '2024-03-15',
    },
]

export const mockReservations: Reservation[] = [
    {
        id: '1',
        userId: '4',
        venueId: '1',
        type: 'hourly',
        status: 'confirmed',
        date: '2026-01-27',
        startTime: '18:00',
        endTime: '19:00',
        totalPrice: 500000,
        paymentStatus: 'paid',
        paymentId: '1',
        createdAt: '2026-01-25',
    },
    {
        id: '2',
        userId: '5',
        venueId: '2',
        type: 'hourly',
        status: 'pending',
        date: '2026-01-28',
        startTime: '16:00',
        endTime: '17:00',
        totalPrice: 400000,
        paymentStatus: 'pending',
        createdAt: '2026-01-26',
    },
    {
        id: '3',
        userId: '4',
        venueId: '5',
        type: 'monthly',
        status: 'confirmed',
        date: '2026-01-01',
        monthStart: '2026-01-01',
        monthEnd: '2026-01-31',
        totalPrice: 2500000,
        paymentStatus: 'paid',
        paymentId: '2',
        createdAt: '2025-12-28',
    },
    {
        id: '4',
        userId: '5',
        venueId: '3',
        type: 'hourly',
        status: 'completed',
        date: '2026-01-20',
        startTime: '10:00',
        endTime: '11:00',
        totalPrice: 450000,
        paymentStatus: 'paid',
        paymentId: '3',
        createdAt: '2026-01-18',
    },
    {
        id: '5',
        userId: '4',
        venueId: '4',
        type: 'hourly',
        status: 'cancelled',
        date: '2026-01-22',
        startTime: '14:00',
        endTime: '15:00',
        totalPrice: 300000,
        paymentStatus: 'refunded',
        createdAt: '2026-01-21',
    },
]

export const mockPayments: Payment[] = [
    {
        id: '1',
        reservationId: '1',
        userId: '4',
        amount: 500000,
        status: 'paid',
        gateway: 'zarinpal',
        authority: 'A00000000000000000000000000123456789',
        refId: '123456789',
        createdAt: '2026-01-25',
    },
    {
        id: '2',
        reservationId: '3',
        userId: '4',
        amount: 2500000,
        status: 'paid',
        gateway: 'zarinpal',
        authority: 'A00000000000000000000000000987654321',
        refId: '987654321',
        createdAt: '2025-12-28',
    },
    {
        id: '3',
        reservationId: '4',
        userId: '5',
        amount: 450000,
        status: 'paid',
        gateway: 'zarinpal',
        authority: 'A00000000000000000000000000111222333',
        refId: '111222333',
        createdAt: '2026-01-18',
    },
]

// Helper function to format price in Persian
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
}

// Helper function to format date in Persian
export function formatPersianDate(dateStr: string): string {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}

// Generate time slots for a venue
export function generateTimeSlots(venue: Venue, date: string): { time: string; available: boolean }[] {
    const slots: { time: string; available: boolean }[] = []
    const openHour = parseInt(venue.openTime.split(':')[0])
    const closeHour = parseInt(venue.closeTime.split(':')[0])

    for (let hour = openHour; hour < closeHour; hour++) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`
        // Check if there's a reservation for this slot
        const isReserved = mockReservations.some(
            (r) => r.venueId === venue.id && r.date === date && r.startTime === timeStr && r.status !== 'cancelled'
        )
        slots.push({
            time: timeStr,
            available: !isReserved,
        })
    }

    return slots
}

// Get venues by sport type
export function getVenuesBySport(sportType: SportType): Venue[] {
    return mockVenues.filter((v) => v.sportType === sportType && v.isActive)
}

// Get user reservations
export function getUserReservations(userId: string): Reservation[] {
    return mockReservations.filter((r) => r.userId === userId)
}

// Get venue reservations (for admin)
export function getVenueReservations(venueId: string): Reservation[] {
    return mockReservations.filter((r) => r.venueId === venueId)
}
