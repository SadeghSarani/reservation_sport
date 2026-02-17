'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { VenueCard } from '@/components/venue-card'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, SlidersHorizontal, ChevronDown, LayoutGrid } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Label } from '@radix-ui/react-label'
import type { SportType, Venue } from '@/lib/types'
import { sportTypeLabels } from '@/lib/types'
import { venuesApi } from '@/app/api/services/venues.api'

/* ─── Skeleton card ──────────────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded-lg w-3/4" />
                <div className="h-3 bg-muted rounded-lg w-1/2" />
                <div className="flex gap-2 pt-1">
                    <div className="h-6 bg-muted rounded-full w-16" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                </div>
                <div className="h-9 bg-muted rounded-xl w-full mt-2" />
            </div>
        </div>
    )
}

/* ─── Native select wrapper (theme-aware) ───────────────────────── */
function NativeSelect({
                          value,
                          onChange,
                          children,
                          className = '',
                      }: {
    value: string
    onChange: (v: string) => void
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="
                    w-full appearance-none
                    bg-background border border-border
                    text-foreground text-sm font-medium
                    rounded-xl px-4 py-2.5 pr-10
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                    transition-colors cursor-pointer
                "
                dir="rtl"
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
    )
}

/* ─── Sport pill chip ────────────────────────────────────────────── */
function SportPill({
                       label,
                       active,
                       onClick,
                   }: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
                ${active
                ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            }
            `}
        >
            {label}
        </button>
    )
}

/* ─── Empty state ────────────────────────────────────────────────── */
function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                <Search className="w-9 h-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">سالنی یافت نشد</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                فیلترهای فعال نتیجه‌ای نداشتند. فیلترها را پاک کنید و دوباره امتحان کنید.
            </p>
            <Button
                variant="outline"
                onClick={onClear}
                className="gap-2 rounded-xl border-2 bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
                <X className="w-4 h-4" />
                پاک کردن فیلترها
            </Button>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function VenuesPage() {
    const searchParams = useSearchParams()
    const initialSport = searchParams.get('sport') as SportType | null
    const initialSearch = searchParams.get('q') || ''
    const initialSort = (searchParams.get('sort') as 'price-asc' | 'price-desc' | 'name') || 'name'

    const [venues, setVenues] = useState<Venue[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [selectedSport, setSelectedSport] = useState<SportType | 'all'>(initialSport || 'all')
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>(initialSort)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    /* ─── Fetch ───────────────────────────────────────────────────── */
    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true)
            try {
                const params: Record<string, string> = {}
                if (searchQuery) params['filters[name][$eq]'] = searchQuery
                if (selectedSport !== 'all') params['filters[type][$eq]'] = selectedSport
                if (sortBy && sortBy !== 'name') params.sort = sortBy

                const response = await venuesApi.getVenues(params)
                setVenues(response.data.data.data)
            } catch (err) {
                console.error('Failed to fetch venues', err)
                setVenues([])
            } finally {
                setLoading(false)
            }
        }
        fetchVenues()
    }, [searchQuery, selectedSport, sortBy])

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedSport('all')
        setSortBy('name')
    }

    const hasActiveFilters = searchQuery || selectedSport !== 'all' || sortBy !== 'name'

    /* ─── Render ──────────────────────────────────────────────────── */
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
            <Header />

            <main className="flex-1">

                {/* ════════ HERO ════════ */}
                <section className="relative overflow-hidden py-14 border-b border-border">
                    {/* Ambient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5 pointer-events-none" />
                    <div className="absolute top-0 right-[20%] w-64 h-64 bg-primary/6 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-[10%] w-48 h-48 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

                    {/* Dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.035] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            کاتالوگ سالن‌ها
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 leading-tight">
                            سالن‌های ورزشی
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed">
                            {loading
                                ? 'در حال بارگذاری سالن‌ها...'
                                : `از بین ${venues.length} سالن ورزشی فعال، بهترین گزینه را انتخاب کنید`
                            }
                        </p>
                    </div>
                </section>

                {/* ════════ STICKY FILTER BAR ════════ */}
                <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
                    <div className="container mx-auto px-4 py-3">

                        {/* Main filter row */}
                        <div className="flex items-center gap-3">

                            {/* Search input */}
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                <input
                                    placeholder="جستجو در سالن‌ها..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="
                                        w-full pr-10 pl-4 py-2.5 text-sm
                                        bg-muted/50 border border-border rounded-xl
                                        text-foreground placeholder:text-muted-foreground
                                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                        transition-colors
                                    "
                                    dir="rtl"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Desktop: sort select */}
                            <div className="hidden lg:block">
                                <NativeSelect
                                    value={sortBy}
                                    onChange={v => setSortBy(v as typeof sortBy)}
                                    className="w-40"
                                >
                                    <option value="name">مرتب‌سازی: نام</option>
                                    <option value="price-asc">ارزان‌ترین</option>
                                    <option value="price-desc">گران‌ترین</option>
                                </NativeSelect>
                            </div>

                            {/* Clear filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-3 py-2.5 transition-colors hover:border-foreground/30"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    پاک کردن
                                </button>
                            )}

                            {/* Mobile filter toggle */}
                            <button
                                type="button"
                                onClick={() => setShowMobileFilters(v => !v)}
                                className={`
                                    lg:hidden flex items-center gap-2 text-sm font-medium
                                    border rounded-xl px-4 py-2.5 transition-all duration-200
                                    ${showMobileFilters
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-foreground border-border'
                                }
                                `}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                فیلترها
                                {hasActiveFilters && (
                                    <span className="bg-primary-foreground text-primary w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                                        !
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Sport pills row — desktop always visible */}
                        <div className="hidden lg:flex items-center gap-2 mt-3 flex-wrap">
                            <SportPill
                                label="همه رشته‌ها"
                                active={selectedSport === 'all'}
                                onClick={() => setSelectedSport('all')}
                            />
                            {(Object.keys(sportTypeLabels) as SportType[]).map(sport => (
                                <SportPill
                                    key={sport}
                                    label={sportTypeLabels[sport]}
                                    active={selectedSport === sport}
                                    onClick={() => setSelectedSport(sport)}
                                />
                            ))}
                        </div>

                        {/* Mobile filter panel */}
                        {showMobileFilters && (
                            <div className="lg:hidden mt-3 pt-3 border-t border-border space-y-4">
                                {/* Sport pills */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">رشته ورزشی</p>
                                    <div className="flex flex-wrap gap-2">
                                        <SportPill
                                            label="همه"
                                            active={selectedSport === 'all'}
                                            onClick={() => setSelectedSport('all')}
                                        />
                                        {(Object.keys(sportTypeLabels) as SportType[]).map(sport => (
                                            <SportPill
                                                key={sport}
                                                label={sportTypeLabels[sport]}
                                                active={selectedSport === sport}
                                                onClick={() => setSelectedSport(sport)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">مرتب‌سازی</p>
                                    <NativeSelect
                                        value={sortBy}
                                        onChange={v => setSortBy(v as typeof sortBy)}
                                        className="w-full"
                                    >
                                        <option value="name">نام</option>
                                        <option value="price-asc">ارزان‌ترین</option>
                                        <option value="price-desc">گران‌ترین</option>
                                    </NativeSelect>
                                </div>

                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="w-full gap-2 rounded-xl bg-transparent border-2"
                                    >
                                        <X className="w-4 h-4" />
                                        پاک کردن همه فیلترها
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ════════ RESULTS ════════ */}
                <section className="py-8">
                    <div className="container mx-auto px-4">

                        {/* Result count */}
                        {!loading && venues.length > 0 && (
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{venues.length}</span> سالن یافت شد
                                </p>
                                {hasActiveFilters && (
                                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                                        <Filter className="w-3 h-3" />
                                        فیلتر فعال
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Loading — skeleton grid */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && venues.length === 0 && (
                            <EmptyState onClear={clearFilters} />
                        )}

                        {/* Venue grid */}
                        {!loading && venues.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {venues.map((venue, index) => (
                                    <div
                                        key={venue.id}
                                        className="opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]"
                                        style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}
                                    >
                                        <VenueCard venue={venue} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <Footer />

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}