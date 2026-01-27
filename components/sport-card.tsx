import React from "react"
import Link from 'next/link'
import type { SportType } from '@/lib/types'
import { sportTypeLabels } from '@/lib/types'

interface SportCardProps {
    sportType: SportType
    venueCount: number
}

const sportImages: Record<SportType, { bg: string; icon: React.ReactNode }> = {
    futsal: {
        bg: 'from-emerald-500 to-emerald-700',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white/90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>
        ),
    },
    volleyball: {
        bg: 'from-orange-500 to-orange-700',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white/90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M50 5 C50 50, 95 50, 95 50" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 95 C50 50, 5 50, 5 50" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 15 C50 30, 80 30, 80 85" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    },
    basketball: {
        bg: 'from-amber-500 to-amber-700',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white/90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M50 5 L50 95" stroke="currentColor" strokeWidth="2" />
                <path d="M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
                <path d="M15 20 C50 35, 50 65, 15 80" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M85 20 C50 35, 50 65, 85 80" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    },
    badminton: {
        bg: 'from-sky-500 to-sky-700',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white/90">
                <ellipse cx="50" cy="25" rx="15" ry="20" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M35 25 L65 25" stroke="currentColor" strokeWidth="1.5" />
                <path d="M38 18 L62 18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M38 32 L62 32" stroke="currentColor" strokeWidth="1.5" />
                <path d="M50 45 L50 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="50" cy="90" rx="8" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    },
    gym: {
        bg: 'from-rose-500 to-rose-700',
        icon: (
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-white/90">
                <rect x="10" y="40" width="10" height="20" rx="2" fill="currentColor" />
                <rect x="80" y="40" width="10" height="20" rx="2" fill="currentColor" />
                <rect x="20" y="35" width="8" height="30" rx="2" fill="currentColor" />
                <rect x="72" y="35" width="8" height="30" rx="2" fill="currentColor" />
                <rect x="28" y="45" width="44" height="10" rx="2" fill="currentColor" />
            </svg>
        ),
    },
}

export function SportCard({ sportType, venueCount }: SportCardProps) {
    const { bg, icon } = sportImages[sportType]

    return (
        <Link href={`/venues?sport=${sportType}`}>
            <div className={`sport-card group relative overflow-hidden rounded-2xl bg-gradient-to-br ${bg} p-6 h-52 flex flex-col justify-between cursor-pointer`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id={`pattern-${sportType}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="2" fill="white" />
                        </pattern>
                        <rect width="100" height="100" fill={`url(#pattern-${sportType})`} />
                    </svg>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />

                {/* Animated Corner Accent */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150" />

                {/* Icon - Animated */}
                <div className="absolute top-4 left-4 opacity-30 group-hover:opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                    {icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{sportTypeLabels[sportType]}</h3>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <span className="text-white/90 text-sm font-medium">{venueCount} سالن فعال</span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium group-hover:bg-white group-hover:text-gray-800 transition-all duration-300 flex items-center gap-1">
            <span>مشاهده</span>
            <svg className="w-4 h-4 transform rotate-180 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
                </div>
            </div>
        </Link>
    )
}
