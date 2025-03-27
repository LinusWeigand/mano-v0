"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn, myLoader } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ProfileCard({ profile }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Use available photos or fallback to a placeholder image.
  const images =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : ["/placeholder.svg?height=400&width=600"]

  const totalImages = images.length
  // Only show 5 dots if there are more than 5 images; otherwise, show all dots.
  const dotsCount = totalImages > 5 ? 5 : totalImages
  // Calculate a sliding window that always includes the active image.
  const windowStart =
    totalImages > 5
      ? Math.max(0, Math.min(currentIndex - Math.floor(dotsCount / 2), totalImages - dotsCount))
      : 0

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="w-full max-w-md border-0">
      <div className="relative">
        {/* Image carousel */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <Image
            loader={myLoader}
            src={images[currentIndex] || "/placeholder.svg"}
            width={600}
            height={400}
            quality={75}
            alt={profile.name}
            className="h-full w-full object-cover rounded-t-xl"
          />

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Favorite button */}
          <button
            className="absolute right-4 top-4 text-white"
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
          >
            <Heart className={cn("h-7 w-7", isFavorite ? "fill-white" : "")} />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
            {Array.from({ length: dotsCount }, (_, i) => {
              // Each dot represents an image with index = windowStart + i.
              const dotIndex = windowStart + i
              // Calculate the difference from the active dot.
              const diff = Math.abs(currentIndex - dotIndex)
              // Define sizes: active dot is 12px, then decrease 2px per step.
              const size = 12 - diff * 2
              return (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(dotIndex)
                  }}
                  style={{ width: `${size}px`, height: `${size}px` }}
                  className={cn(
                    "rounded-full cursor-pointer",
                    dotIndex === currentIndex ? "bg-white" : "bg-white/60"
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">
            {profile.name || "Schneizlreuth, Deutschland"}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs">★</span>
            <span className="text-xs font-medium">4,84</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {profile.craft || "Gewerbliche:r Vermieter:in"}
        </p>
      </CardContent>
    </Card>
  )
}
