'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { VenueCard } from '@/components/venue-card'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { Label } from '@radix-ui/react-label'
import type { SportType, Venue } from '@/lib/types'
import { sportTypeLabels } from '@/lib/types'
import {venuesApi} from "@/app/api/services/venues.api";

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
    const [showFilters, setShowFilters] = useState(false)

    // Fetch venues from API whenever filters change
    useEffect(() => {
        const fetchVenues = async () => {
            setLoading(true)

            try {
                const params: Record<string, string> = {}

                if (searchQuery) {
                    params['filters[name][$eq]'] = searchQuery
                }

                if (selectedSport !== 'all') {
                    params['filters[type][$eq]'] = selectedSport
                }

                if (sortBy && sortBy !== 'name') {
                    params.sort = sortBy
                }

                const response = await venuesApi.getVenues(params)

                // Extract venues array from paginated response
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

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">سالن‌های ورزشی</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            از بین {venues.length} سالن ورزشی فعال، بهترین گزینه را انتخاب کنید
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="border-b border-border bg-card sticky top-16 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    placeholder="جستجو در سالن‌ها..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pr-10 input"
                                />
                            </div>

                            {/* Desktop Filters */}
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm whitespace-nowrap">رشته ورزشی:</Label>
                                    <Select value={selectedSport} onValueChange={(v) => setSelectedSport(v as SportType | 'all')}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">همه</SelectItem>
                                            {(Object.keys(sportTypeLabels) as SportType[]).map((sport) => (
                                                <SelectItem key={sport} value={sport}>
                                                    {sportTypeLabels[sport]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label className="text-sm whitespace-nowrap">مرتب‌سازی:</Label>
                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">نام</SelectItem>
                                            <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                                            <SelectItem value="price-desc">گران‌ترین</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                                        <X className="w-4 h-4" />
                                        پاک کردن
                                    </Button>
                                )}
                            </div>

                            {/* Mobile Filter Toggle */}
                            <Button
                                variant="outline"
                                className="lg:hidden gap-2 bg-transparent"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4" />
                                فیلترها
                                {hasActiveFilters && (
                                    <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">!</span>
                                )}
                            </Button>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden pt-4 space-y-4 border-t border-border mt-4">
                                <div className="space-y-2">
                                    <Label>رشته ورزشی</Label>
                                    <Select value={selectedSport} onValueChange={(v) => setSelectedSport(v as SportType | 'all')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">همه</SelectItem>
                                            {(Object.keys(sportTypeLabels) as SportType[]).map((sport) => (
                                                <SelectItem key={sport} value={sport}>{sportTypeLabels[sport]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>مرتب‌سازی</Label>
                                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="name">نام</SelectItem>
                                            <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                                            <SelectItem value="price-desc">گران‌ترین</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {hasActiveFilters && (
                                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full gap-1 bg-transparent">
                                        <X className="w-4 h-4" />
                                        پاک کردن فیلترها
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Venues Grid */}
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-16">در حال بارگذاری...</div>
                        ) : venues.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4 opacity-50">
                                    <Search className="w-16 h-16 mx-auto text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">سالنی یافت نشد</h2>
                                <p className="text-muted-foreground mb-4">با تغییر فیلترها دوباره جستجو کنید</p>
                                <Button variant="outline" onClick={clearFilters}>پاک کردن فیلترها</Button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 text-sm text-muted-foreground">{venues.length} سالن یافت شد</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {venues.map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
