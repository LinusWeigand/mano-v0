"use client"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useProfiles } from "@/context/ProfilesContext"
import { Button } from "@/components/ui/button"
import { ProfileModel } from "@/types/ProfileModel"
import { BackendReference } from "@/types/BackendReference"
import { useAuth } from "@/context/AuthContext"
import ProfileSkeleton from "../components/BodySkeleton"
import ProfileCard from "../components/ProfileCard"
import Modal from "../components/modal"
import Details from "../components/details"

export default function FavoritesList() {
  const { profiles, setProfiles, isLoading, setIsLoading } = useProfiles()
  const { isLoggedIn } = useAuth()
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const get_favorites = async () => {
    try {
      // Fetch favorite references only
      const favResponse = await fetch("/api/favorites", { method: "GET" })
      if (!favResponse.ok) {
        throw new Error("Failed to get favorites")
      }
      const favResult = await favResponse.json()

      // Fetch full profile details for each favorite reference
      const profileFetches = (favResult.data as BackendReference[]).map(
        async (favRef) => {
          const selfUrl = favRef._links.self
          const res = await fetch(selfUrl)
          if (!res.ok) {
            throw new Error(`Failed to fetch full profile from URL ${selfUrl}`)
          }
          const profileResult = await res.json()
          return profileResult.data.profile as ProfileModel
        }
      )
      const favoriteProfiles: ProfileModel[] = await Promise.all(profileFetches)

      // Mark all favorite profiles as favorite
      const updatedProfiles = favoriteProfiles.map(profile => ({
        ...profile,
        isFavorite: true
      }))
      setProfiles(updatedProfiles)

      // Fetch photos for each profile
      await Promise.all(
        updatedProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id))
      )

      setIsLoading(false)
    } catch (error) {
      console.error("Error occurred in get_favorites: ", error)
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
      const photoUrls: string[] = photos.map(
        (photo: BackendReference) => photo._links.self
      )

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
    get_favorites()
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
          <h3 className="text-xl font-semibold mb-2">Keine favorisierten Handwerker gefunden</h3>
          <p className="text-muted-foreground mb-6">
            Es wurden keine favorisierten Handwerker gefunden. Bitte fügen Sie welche hinzu oder versuchen Sie es später noch einmal.
          </p>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              setIsLoading(true)
              get_favorites()
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
