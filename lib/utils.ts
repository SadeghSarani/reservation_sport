import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes safely
 * Usage: cn('px-2', condition && 'bg-red-500')
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(
    date: Date | string,
    locale: string = 'fa-IR'
) {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

/**
 * Truncate long text
 */
export function truncate(text: string, length: number = 50) {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
}
