
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn, myLoader } from "@/lib/utils"
import { ProfileModel } from "@/types/ProfileModel"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProfileCardProps {
  profile: ProfileModel
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const images =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : ["/placeholder.svg?height=400&width=600"]

  const totalImages = images.length
  const dotsCount = totalImages > 5 ? 5 : totalImages
  const windowStart =
    totalImages > 5
      ? Math.max(0, Math.min(currentIndex - Math.floor(dotsCount / 2), totalImages - dotsCount))
      : 0

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <div className="relative group">
        {/* Image carousel */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
          <Image
            loader={myLoader}
            src={images[currentIndex] || "/placeholder.svg"}
            width={600}
            height={600}
            quality={75}
            alt={profile.name}
            className="h-full w-full object-cover rounded-xl"  // Fully rounded image
          />

          {/* Navigation buttons (only visible on hover) */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 hover:bg-white/90 shadow-md invisible group-hover:visible"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {currentIndex < totalImages - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 hover:bg-white/90 shadow-md invisible group-hover:visible"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Favorite button */}
          <button
            className="absolute hover:right-[14px] hover:top-[14px] right-4 top-4 text-white"
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
          >
            <Heart className={cn("h-7 w-7 fill-black/20 hover:h-8 hover:w-8", isFavorite ? "fill-white" : "")} />
          </button>

          {/* Pagination dots (container remains at the bottom) */}
          <div className="absolute bottom-4 left-1/2 flex items-center gap-[6px] -translate-x-1/2">
            {Array.from({ length: dotsCount }, (_, i) => {
              // Each dot represents an image with index = windowStart + i.
              const dotIndex = windowStart + i
              // Calculate the difference from the active dot.
              const diff = Math.abs(currentIndex - dotIndex)
              // Use a smaller base size and decrement so the dots are all smaller.
              const baseSize = 7
              const decrement = 0.5
              const size = baseSize - diff * decrement
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

      <CardContent className="!py-3 p-0 w-full">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{profile.name}</h3>
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg mb-1">★</span>
            <span className="text-md font-medium">4,84</span>
          </div>
        </div>
        <p className="text-md text-muted-foreground">{profile.craft}</p>
      </CardContent>
    </Card>
  )
}
