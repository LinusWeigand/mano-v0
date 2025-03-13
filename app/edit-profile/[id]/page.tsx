"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/app/components/ProfileForm";

interface PhotoObject {
  id: string;
  url: string;
}

interface ProfileData {
  name: string;
  craft: string;
  experience: string;
  location: string;
  bio: string;
  website: string;
  instagram: string;
  google_ratings: string;
  skills: string[];
  photos: PhotoObject[];
  profile_id: string;
}

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<ProfileData | null>(null);

  // Fetch the JSON containing photo IDs and URLs
  const loadProfilePhotos = async (profileId: string) => {
    const response = await fetch(`/api/profile-photos/${profileId}`);
    if (!response.ok) throw new Error("Failed to fetch profile photos");

    const result = await response.json();
    // result.data is an array of { id, url }
    return result.data as PhotoObject[];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const result = await res.json();
        const profileData = result.data.profile;

        // Now 'photos' will be an array of {id, url}
        const photoRecords = await loadProfilePhotos(params.id);

        setInitialData({
          ...profileData,
          photos: photoRecords,
          profile_id: params.id
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (!initialData) {
    return <p className="py-10">Profil wird geladen...</p>;
  }

  return (
    <div className="py-10">
      <ProfileForm
        initialData={initialData}
        isEditing={true}
      />
    </div>
  );
}
