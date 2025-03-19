"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileForm from "@/app/components/ProfileForm"
import ProfileSkeleton from "@/app/components/ProfileSkeleton"

interface PhotoObject {
  id: string
  url: string
}

interface ProfileData {
  name: string
  rechtsform_name: string
  rechtsform_explain_name: string
  email: string
  telefon: string
  craft: string
  experience: string
  location: string
  bio: string
  website: string
  instagram: string
  skills: string[]
  photos: PhotoObject[]
  profile_id: string
  register_number: string
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the JSON containing photo IDs and URLs
  const loadProfilePhotos = async (profileId: string) => {
    const response = await fetch(`/api/profile-photos/${profileId}`)
    if (!response.ok) throw new Error("Failed to fetch profile photos")

    const result = await response.json()
    // result.data is an array of { id, url }
    return result.data as PhotoObject[]
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/profile/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch profile")

        const result = await res.json()
        const profileData = result.data.profile

        // Now 'photos' will be an array of {id, url}
        const photoRecords = await loadProfilePhotos(params.id)

        setInitialData({
          ...profileData,
          photos: photoRecords,
          profile_id: params.id,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="py-10">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className="py-10">
      <ProfileForm initialData={initialData} isEditing={true} />
    </div>
  )
}

