"use client";

import React, { useEffect } from "react";
import Footer from "./components/footer";
import SearchBar from "./components/search";
import BodyWrapper from "./components/body/wrapper";
import { useProfiles } from "@/context/ProfilesContext";
import { BackendReference } from "@/types/BackendReference";
import { ProfileModel } from "@/types/ProfileModel";
import Script from "next/script";


export default function ManoLandingPage() {
  const { setProfiles, setIsLoading } = useProfiles();

  const get_profiles = async () => {
    try {
      const response = await fetch("/api/profiles", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to get profiles");
      }
      const result = await response.json();
      const profileFetches = (result.data as BackendReference[]).map(
        async (profileRef) => {
          const selfUrl = profileRef._links.self;
          const res = await fetch(selfUrl);
          if (!res.ok) {
            throw new Error(`Failed to fetch full profile from URL ${selfUrl}`);
          }
          const profileResult = await res.json();
          return profileResult.data.profile;
        }
      );
      const fullProfiles: ProfileModel[] = await Promise.all(profileFetches);
      setProfiles(fullProfiles);

      await Promise.all(
        fullProfiles
          .filter((profile) => profile.id)
          .map((profile) => load_profile_photos(profile.id!))
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error);
      setIsLoading(false);
    }
  };

  const load_profile_photos = async (profileId: string) => {
    try {
      const response = await fetch(`/api/profile-photos/${profileId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get profile photos");
      }

      const result = await response.json();
      const photos = result.data;
      const photoUrls: string[] = photos.map(
        (photo: BackendReference) => photo._links.self
      );

      setProfiles((prevProfiles: ProfileModel[]) =>
        prevProfiles.map((profile: ProfileModel) => {
          if (profile.id === profileId) {
            return {
              ...profile,
              photos: photoUrls,
            };
          }
          return profile;
        })
      );
    } catch (error) {
      console.error(
        `Error occurred while fetching photos for profile ${profileId}:`,
        error
      );
    }
  };

  useEffect(() => {
    get_profiles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <SearchBar />
      <BodyWrapper />
      <Footer />
    </div>
  );
}
