"use client"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import Modal from "../modal"
import Details from "../details"
import { useProfiles } from "@/context/ProfilesContext"
import ProfileSkeleton from "../BodySkeleton"
import { Button } from "@/components/ui/button"
import ProfileCard from "../ProfileCard"
import { ProfileModel } from "@/types/ProfileModel"
import { BackendReference } from "@/types/BackendReference"
import { useAuth } from "@/context/AuthContext"

export default function ListBody() {
  const { profiles, setProfiles, isLoading, setIsLoading } = useProfiles()
  const { isLoggedIn } = useAuth()
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const get_profiles = async () => {
    try {
      // Fetch profile references
      const response = await fetch("/api/profiles", { method: "GET" })
      if (!response.ok) {
        throw new Error("Failed to get profiles")
      }
      const result = await response.json()

      // Fetch full profile details for each reference
      const profileFetches = (result.data as BackendReference[]).map(async (profileRef) => {
        const selfUrl = profileRef._links.self
        const res = await fetch(selfUrl)
        if (!res.ok) {
          throw new Error(`Failed to fetch full profile from URL ${selfUrl}`)
        }
        const profileResult = await res.json()
        return profileResult.data.profile as ProfileModel
      })
      const fullProfiles: ProfileModel[] = await Promise.all(profileFetches)

      // If logged in, fetch favorites once and match on client side.
      if (isLoggedIn) {
        const favResponse = await fetch("/api/favorites", { method: "GET" })
        if (favResponse.ok) {
          const favResult = await favResponse.json()
          // Assuming favResult.data is an array of objects with property profile_id
          const favoriteProfileIds: string[] = favResult.data.map((fav: BackendReference) => fav.id)
          const updatedProfiles = fullProfiles.map(profile => ({
            ...profile,
            isFavorite: favoriteProfileIds.includes(profile.id)
          }))
          setProfiles(updatedProfiles)
        } else {
          setProfiles(fullProfiles)
        }
      } else {
        setProfiles(fullProfiles.map(profile => ({ ...profile, isFavorite: false })))
      }

      // Fetch photos for each profile
      await Promise.all(
        fullProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id))
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

  // Initial load on mount
  useEffect(() => {
    setIsLoading(true)
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
      <section className="pt-8 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{skeletons}</div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {profiles.map((profile, index) => (
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
