import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Venue } from '@/lib/types'
import { sportTypeLabels } from '@/lib/types'
import { formatPrice } from '@/lib/mock-data'
import { MapPin, Clock, Users } from 'lucide-react'

interface VenueCardProps {
    venue: Venue
}

const sportGradients: Record<string, string> = {
    futsal: 'from-emerald-500 to-emerald-600',
    volleyball: 'from-orange-500 to-orange-600',
    basketball: 'from-amber-500 to-amber-600',
    badminton: 'from-sky-500 to-sky-600',
    gym: 'from-rose-500 to-rose-600',
}

export function VenueCard({ venue }: VenueCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Image/Gradient Header */}
            <div className={`h-40 bg-gradient-to-br ${sportGradients[venue.sportType]} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 right-3">
                    <Badge variant="info" className="bg-white/90 text-foreground">
                        {sportTypeLabels[venue.sportType]}
                    </Badge>
                </div>
                <div className="absolute bottom-3 right-3 left-3">
                    <h3 className="text-xl font-bold text-white truncate">{venue.name}</h3>
                </div>
            </div>

            <CardContent className="p-4 space-y-4">
                {/* Location */}
                <div className="flex items-start gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{venue.address}، {venue.city}</span>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{venue.openTime} - {venue.closeTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{venue.capacity} نفر</span>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1">
                    {(venue.amenities || []).slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="warning" className="text-xs">
                            {amenity}
                        </Badge>
                    ))}
                    {venue.amenities && venue.amenities.length > 3 && (
                        <Badge variant="default" className="text-xs">
                            +{venue.amenities.length - 3}
                        </Badge>
                    )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                        <div className="text-xs text-muted-foreground">شروع از</div>
                        <div className="text-lg font-bold text-primary">
                            {formatPrice(venue.price)}
                            <span className="text-xs font-normal text-muted-foreground mr-1">/ ساعت</span>
                        </div>
                    </div>
                    <Link href={`/venues/${venue.id}`}>
                        <Button size="sm" className="group-hover:bg-primary/90">
                            رزرو کنید
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
