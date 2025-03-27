"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, ChevronLeft, ChevronRight, Heart, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import Modal from "./modal"
import Details from "./details"
import { useProfiles } from "@/context/ProfilesContext"
import ProfileSkeleton from "./BodySkeleton"
import Image from "next/image"
import type { ProfileModel } from "@/types/ProfileModel"
import type { BackendReference } from "@/types/BackendReference"
import { cn, getBaseUrl, myLoader } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// A new component for the carousel-enabled profile card
function ProfileCard({ profile }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Use photos if available, otherwise a default placeholder image
  const images =
    profile.photos && profile.photos.length > 0
      ? profile.photos
      : ["/placeholder.svg?height=400&width=600"]

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
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
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(i)
                }}
                className={cn(
                  "h-2 w-2 rounded-full cursor-pointer",
                  i === currentIndex ? "bg-white" : "bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{profile.name || "Schneizlreuth, Deutschland"}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs">★</span>
            <span className="text-xs font-medium">4,84</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{profile.craft || "Gewerbliche:r Vermieter:in"}</p>
      </CardContent>
    </Card>
  )
}

export default function Body() {
  const { profiles, setProfiles } = useProfiles()

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const get_profiles = async () => {
    try {
      const response = await fetch("/api/profiles", { method: "GET" })
      if (!response.ok) {
        throw new Error("Failed to get profiles")
      }
      const result = await response.json()
      const profileFetches = (result.data as BackendReference[]).map(async (profileRef) => {
        const selfUrl = profileRef._links.self
        const res = await fetch(selfUrl)
        if (!res.ok) {
          throw new Error(`Failed to fetch full profile from URL ${selfUrl}`)
        }
        const profileResult = await res.json()
        return profileResult.data.profile
      })
      const fullProfiles: ProfileModel[] = await Promise.all(profileFetches)
      setProfiles(fullProfiles)

      await Promise.all(
        fullProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id!))
      )

      setIsLoading(false)
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error)
      setIsLoading(false)
    }
  }

  const load_profile_photos = async (profileId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${profileId}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to get profile photos")
      }

      const result = await response.json()
      const photos = result.data
      const photoUrls: string[] = photos.map((photo: BackendReference) => photo._links.self)

      setProfiles((prevProfiles: ProfileModel[]) =>
        prevProfiles.map((profile: ProfileModel) => {
          if (profile.id === profileId) {
            return {
              ...profile,
              photos: photoUrls,
            }
          }
          return profile
        })
      )
    } catch (error) {
      console.error(`Error occurred while fetching photos for profile ${profileId}:`, error)
    }
  }

  useEffect(() => {
    get_profiles()
  }, [])

  const skeletons = Array(8)
    .fill(0)
    .map((_, index) => <ProfileSkeleton key={`skeleton-${index}`} />)

  const NoProfilesFound = () => (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <Card className="w-full max-w-md overflow-hidden border-dashed border-2 bg-muted/50">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Keine Handwerker gefunden</h3>
          <p className="text-muted-foreground mb-6">
            Wir konnten keine Handwerker finden, die Ihren Kriterien entsprechen. Versuchen Sie, Ihre Suche anzupassen oder schauen Sie später wieder vorbei.
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setIsLoading(true)
              get_profiles()
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <main className="flex-grow">
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{skeletons}</div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {profiles.map((profile, index) => (
                // Wrap each card in a container that opens the modal on click
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProfileId(profile.id)
                    setIsDetailsModalOpen(true)
                  }}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          ) : (
            <NoProfilesFound />
          )}
        </div>
      </section>
      {isDetailsModalOpen && selectedProfileId && (
        <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
          <Details
            {...profiles.find((p) => p.id === selectedProfileId)!}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        </Modal>
      )}
    </main>
  )
}
