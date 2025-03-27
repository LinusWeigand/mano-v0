"use client"

import { useEffect, useState } from "react"
import ProfileForm from "@/app/components/ProfileForm"
import ProfileSkeleton from "@/app/components/ProfileSkeleton"
import { BackendReference } from "@/types/BackendReference";

interface ProfileData {
  id: string;
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
  photos: BackendReference[]
  handwerks_karten_nummer: string
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the JSON containing photo IDs and URLs
  const loadProfilePhotos = async (profileId: string) => {
    const response = await fetch(`/api/profile-photos/${profileId}`)
    if (!response.ok) throw new Error("Failed to fetch profile photos")

    const result = await response.json()
    return result.data as BackendReference[]
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/profile/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch profile")

        const result = await res.json()
        const profileData = result.data.profile

        const photoRecords = await loadProfilePhotos(params.id)

        console.log("photo Records: ", photoRecords)

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
      {initialData ? (
        <ProfileForm initialData={initialData} isEditing={true} />
      ) : (
        <ProfileSkeleton />
      )}
    </div>
  )
}

