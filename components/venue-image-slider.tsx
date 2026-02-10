'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    images: { uuid: string }[]
}

export function VenueImageSlider({ images }: Props) {
    const [index, setIndex] = useState(0)

    if (!images || images.length === 0) return null

    const next = () => setIndex((i) => (i + 1) % images.length)
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/getFile/${images[index].uuid}`

    return (
        <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden group">
            <Image
                src={imageUrl}
                alt="venue image"
                fill
                unoptimized
            />

            {images.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                    >
                        <ChevronLeft />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
                    >
                        <ChevronRight />
                    </Button>
                </>
            )}

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                            i === index ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
