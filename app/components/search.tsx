"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Hammer } from "lucide-react";
import { useProfiles } from "@/context/ProfilesContext";

export default function SearchBar() {
  const [activeField, setActiveField] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [craft, setCraft] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");

  const [skills, setAvailableSkills] = useState<string[] | null>(null);
  const [crafts, setAvailableCrafts] = useState<string[] | null>(null);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingCrafts, setLoadingCrafts] = useState(true);

  const { setProfiles } = useProfiles();

  useEffect(() => {
    // Fetch skills
    setLoadingSkills(true);
    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch skills");
        }
        return res.json();
      })
      .then((data) => {
        // data.data should be an array of objects with { name }
        const skillsArray = data.data.map((item: { name: string }) => item.name);
        setAvailableSkills(skillsArray);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingSkills(false);
      });

    // Fetch crafts
    setLoadingCrafts(true);
    fetch("/api/crafts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch crafts");
        }
        return res.json();
      })
      .then((data) => {
        // data.data should be an array of objects with { name }
        const craftsArray = data.data.map((item: { name: string }) => item.name);
        setAvailableCrafts(craftsArray);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingCrafts(false);
      });
  }, []);

  const handleSubmit = async () => {
    const payload: any = {};

    // Only send fields that have actual values
    if (name.trim()) payload.name = name;
    if (craft.trim()) payload.craft = craft;
    if (location.trim()) payload.location = location;
    if (skill.trim()) payload.skill = skill;

    // If nothing is filled out, just return (or handle differently if you want)
    if (Object.keys(payload).length === 0) {
      console.log("No search parameters provided.");
      return;
    }

    try {
      // Use relative path so it matches your Next.js api route domain
      const response = await fetch("/api/profiles/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profiles.");
      }

      const result = await response.json();
      const profiles = result.data.map((profile: any) => ({
        id: profile.id,
        viewer_id: profile.viewer_id,
        name: profile.name,
        craft: profile.craft,
        location: profile.location,
        website: profile.website,
        instagram: profile.instagram,
        bio: profile.bio,
        experience: profile.experience,
        google_ratings: profile.google_ratings,
        skills: profile.skills || [],
        photos: [], // initially empty; will be filled by `load_profile_photos`
      }));

      // Immediately set the profiles from search
      setProfiles(profiles);

      // Now, fetch the photos for each profile
      profiles.forEach((profile) => {
        load_profile_photos(profile.id);
      });
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const load_profile_photos = async (profileId: string) => {
    try {
      // Use relative fetch again (avoid mixing localhost if you are deployed):
      const response = await fetch(`/api/profile-photos/${profileId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get profile photos");
      }

      // The backend returns: { data: [ { id, url }, { id, url }... ] }
      const result = await response.json();
      const photos = result.data;

      // Convert each URL to a Blob → object URL
      const photoObjectUrls: string[] = await Promise.all(
        photos.map(async (photo: { id: string; url: string }) => {
          const photoRes = await fetch(photo.url);
          if (!photoRes.ok) {
            throw new Error("Failed to get profile photo");
          }
          const photoBlob = await photoRes.blob();
          return URL.createObjectURL(photoBlob);
        }),
      );

      // Update the correct profile in context
      setProfiles((prevProfiles: ProfileModel[]) =>
        prevProfiles.map((profile: ProfileModel) =>
          profile.id === profileId
            ? { ...profile, photos: photoObjectUrls }
            : profile
        )
      );
    } catch (error) {
      console.error(
        `Error occurred while fetching photos for profile ${profileId}:`,
        error
      );
    }
  };

  return (
    <section className="pt-5 pb-8 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col lg:max-w-xl mx-auto items-center">
          <h1 className="text-4xl font-bold text-center mb-8 w-[300px] sm:w-full">
            Finde erfahrene Handwerker
          </h1>
          <div className="flex mt-2 justify-center ">
            <Card className="self-center sm:w-full w-[300px] shadow-lg sm:rounded-[4rem] overflow-hidden">
              <CardContent className="p-0 items-center">
                {/* Important: ensure type="submit" so form submission is triggered */}
                <form
                  className="flex flex-col sm:flex-row sm:items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  {/* Name field */}
                  <div
                    className={`flex-1 p-2 transition-colors py-4 pl-8 md:pl-10 lg:w-[300px]
                      ${activeField === "name"
                        ? "bg-white hover:bg-white"
                        : activeField === null
                          ? "bg-white hover:bg-[#ebebeb]"
                          : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("name")}
                  >
                    <label
                      htmlFor="craft"
                      className="block text-sm font-medium h-full text-foreground"
                    >
                      Name
                    </label>
                    <Input
                      id="craft"
                      type="text"
                      placeholder="Gewerke suchen"
                      className="w-full border-none bg-transparent text-[16px] mt-[1px]"
                      onFocus={() => setActiveField("name")}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Crafts select */}
                  <div
                    className={`flex flex-row items-center
                      ${activeField === "craft"
                        ? "bg-white hover:bg-white"
                        : activeField === null
                          ? "bg-white hover:bg-[#ebebeb]"
                          : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("craft")}
                  >
                    {crafts && (
                      <div className="flex-1 flex flex-col p-2 transition-colors py-4 pl-8 md:pr-12">
                        <label
                          htmlFor="craft"
                          className="block text-sm font-medium text-foreground h-full"
                        >
                          Handwerk
                        </label>
                        <Select
                          onOpenChange={() => setActiveField("craft")}
                          onValueChange={(value) => setCraft(value)}
                        >
                          <SelectTrigger className="mt-[1px] w-full border-none bg-transparent focus:ring-0 text-[16px]">
                            <div className="flex items-center">
                              <Hammer className="h-5 w-5 text-muted-foreground mr-2" />
                              <SelectValue
                                className="w-full border-none bg-transparent focus:ring-0 text-[16px] !placeholder:text-muted-foreground !text-muted-foreground"
                                placeholder="Handwerk aussuchen"
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {crafts.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Location input */}
                  <div
                    className={`flex-1 p-2 transition-colors py-4 pl-8 md:pr-12
                      ${activeField === "location"
                        ? "bg-white hover:bg-white"
                        : activeField === null
                          ? "bg-white hover:bg-[#ebebeb]"
                          : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("location")}
                  >
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium h-full text-forground"
                    >
                      Standort
                    </label>
                    <div className="flex items-center mt-[1px] w-full">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Ort suchen"
                        className="w-full border-none bg-transparent focus:ring-0 text-[16px]"
                        onFocus={() => setActiveField("location")}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Skills select + submit button */}
                  <div
                    className={`flex flex-row items-center
                      ${activeField === "skill"
                        ? "bg-white hover:bg-white"
                        : activeField === null
                          ? "bg-white hover:bg-[#ebebeb]"
                          : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("skill")}
                  >
                    {skills && (
                      <div className="flex-1 flex flex-col p-2 transition-colors py-4 pl-8 md:pr-12">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-foreground h-full"
                        >
                          Spezialität
                        </label>
                        <Select
                          onOpenChange={() => setActiveField("skill")}
                          onValueChange={(value) => setSkill(value)}
                        >
                          <SelectTrigger className="mt-[1px] w-full border-none bg-transparent focus:ring-0 text-[16px]">
                            <div className="flex items-center">
                              <Hammer className="h-5 w-5 text-muted-foreground mr-2" />
                              <SelectValue
                                className="w-full border-none bg-transparent focus:ring-0 text-[16px] !placeholder:text-muted-foreground !text-muted-foreground"
                                placeholder="Spezialität aussuchen"
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {skills.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {/* Add type="submit" so the form is actually submitted */}
                    <div
                      className={`p-2 md:p-2 ${activeField === null
                          ? "rounded-b-[4rem] md:rounded-r-[4rem] md:rounded-bl-none"
                          : ""
                        }`}
                    >
                      <Button
                        type="submit"
                        className="mr-1 rounded-full bg-[#FF385C] hover:bg-[#FF385C]/90 text-white h-12 w-12 flex items-center justify-center"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
