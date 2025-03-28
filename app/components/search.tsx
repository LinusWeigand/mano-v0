"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Hammer } from "lucide-react"
import { useProfiles } from "@/context/ProfilesContext"
import type { ProfileModel } from "@/types/ProfileModel"
import type { BackendReference } from "@/types/BackendReference"
import ReliableAddressAutocomplete from "./AddressAutoComplete"

export default function SearchBar() {
  const [activeField, setActiveField] = useState<string | null>(null)
  const [showRangeSelector, setShowRangeSelector] = useState(false)

  const [name, setName] = useState("")
  const [craft, setCraft] = useState("")
  const [location, setLocation] = useState("")
  const [skill, setSkill] = useState("")
  const [range, setRange] = useState<number>(10)
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [skills, setAvailableSkills] = useState<string[] | null>(null)
  const [crafts, setAvailableCrafts] = useState<string[] | null>(null)

  const { setProfiles } = useProfiles()

  useEffect(() => {
    // Handle clicks outside the location field to close the range selector
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".location-field-container")) {
        setShowRangeSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Fetch skills
    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch skills")
        }
        return res.json()
      })
      .then((data) => {
        // data.data should be an array of objects with { name }
        const skillsArray = data.data.map((item: { name: string }) => item.name)
        setAvailableSkills(skillsArray)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {})

    // Fetch crafts
    fetch("/api/crafts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch crafts")
        }
        return res.json()
      })
      .then((data) => {
        // data.data should be an array of objects with { name }
        const craftsArray = data.data.map((item: { name: string }) => item.name)
        setAvailableCrafts(craftsArray)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {})
  }, [])

const handleSubmit = async () => {
  // Use a Record<string, string | number> or you can keep it as "any"
  const payload: Record<string, string | number> = {};

  if (name.trim()) {
    payload.name = name;
  }
  if (craft.trim()) {
    payload.craft = craft;
  }
  // If location is set, include location, range, and lat/lng (if they’re not null)
  if (location.trim()) {
    payload.location = location;
    payload.range = range; // Add the range parameter

    if (lat !== null && lng !== null) {
      payload.lat = lat;
      payload.lng = lng;
    }
  }
  if (skill.trim()) {
    payload.skill = skill;
  }

  // If no parameters, don't bother making a request
  if (Object.keys(payload).length === 0) {
    console.log("No search parameters provided.");
    return;
  }

  try {
    const response = await fetch("/api/profiles/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profiles.");
    }

    const result = await response.json();
    const profileFetches = result.data.map(async (profile: BackendReference) => {
      const selfUrl = profile._links.self;
      const res = await fetch(selfUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch full profile from URL ${selfUrl}`);
      }
      const profileResult = await res.json();
      return profileResult.data.profile;
    });

    const fullProfiles = await Promise.all(profileFetches);
    setProfiles(fullProfiles);

    await Promise.all(
      fullProfiles
        .filter((profile) => profile.id)
        .map((profile) => load_profile_photos(profile.id!))
    );
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }
};


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
        }),
      )
    } catch (error) {
      console.error(`Error occurred while fetching photos for profile ${profileId}:`, error)
    }
  }

  return (
    <section className="pt-5 pb-8 border-b">
      <div className="container mx-auto px-4 lg:px-6 lg:px-8 ">
        <div className="flex flex-col lg:max-w-xl mx-auto items-center">
          <h1 className="text-4xl font-bold text-center mb-8 w-[300px] lg:w-full">Finde erfahrene Handwerker</h1>
          <div className="flex mt-2 justify-center ">
            <Card className="self-center sm:w-full w-[300px] shadow-lg lg:rounded-[4rem]">
              <CardContent className="p-0 items-center">
                <form
                  className="flex flex-col lg:flex-row lg:items-center"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                >
                  {/* Name field */}
                  <div
                    className={`flex-1 p-2 transition-colors py-4 pl-8 lg:pl-10 lg:w-[300px] rounded-l-full

                      ${
                        activeField === "name"
                          ? "bg-white hover:bg-white"
                          : activeField === null
                            ? "bg-white hover:bg-[#ebebeb]"
                            : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("name")}
                  >
                    <label htmlFor="craft" className="block text-sm font-medium h-full text-foreground">
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

                  <div
                    className={`flex flex-row items-center                       
                      ${
                        activeField === "craft"
                          ? "bg-white hover:bg-white"
                          : activeField === null
                            ? "bg-white hover:bg-[#ebebeb]"
                            : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("craft")}
                  >
                    {!crafts ? (
                      <div className="flex-1 flex flex-col  transition-colors pt-2 pl-8 lg:pr-8 w-[265px]">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse "></div>
                        <div className="flex items-center mt-[1px] w-full h-9">
                          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col p-2 transition-colors py-4 pl-8 lg:pr-8 w-[265px]">
                        <label htmlFor="craft" className="block text-sm font-medium text-foreground h-full">
                          Handwerk
                        </label>
                        <Select onOpenChange={() => setActiveField("craft")} onValueChange={(value) => setCraft(value)}>
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
                    className={`flex-1 p-2 transition-colors py-4 pl-8 md:pr-12 relative location-field-container
                      ${
                        activeField === "location"
                          ? "bg-white hover:bg-white"
                          : activeField === null
                            ? "bg-white hover:bg-[#ebebeb]"
                            : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => {
                      setActiveField("location")
                      if (location) {
                        setShowRangeSelector(true)
                      }
                    }}
                  >
                    <label htmlFor="location" className="block text-sm font-medium h-full text-forground">
                      Standort
                    </label>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                      <ReliableAddressAutocomplete
                        variant="search"
                        placeholder="Ort suchen"
                        value={location}
                        showIcon={false}
                        label=""
                        className="text-[16px] w-full"
                        onChange={(address, lat, lng) => {
                          setLocation(address)
                          setLat(lat)
                          setLng(lng)
                          if (address) {
                            setShowRangeSelector(true)
                          }
                        }}
                      />
                    </div>

                    {/* Absolute positioned range selector */}
                    {location && showRangeSelector && (
                      <div className="absolute left-0 right-0 top-full z-10 bg-white shadow-lg rounded-b-lg p-4 border border-t-0">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Umkreis:</span>
                          <span>{range} km</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={range}
                          onChange={(e) => setRange(Number.parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Skills select + submit button */}
                  <div
                    className={`flex flex-row items-center rounded-r-full
                      ${
                        activeField === "skill"
                          ? "bg-white hover:bg-white"
                          : activeField === null
                            ? "bg-white hover:bg-[#ebebeb]"
                            : "bg-muted hover:bg-[#dddddd]"
                      }`}
                    onClick={() => setActiveField("skill")}
                  >
                    {!skills ? (
                      <div className="flex-1 flex flex-col  transition-colors pt-2 pl-8 lg:pr-8 w-[248px]">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse "></div>
                        <div className="flex items-center mt-[1px] w-full h-9">
                          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse mr-2"></div>
                          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col p-2 transition-colors py-4 pl-8 md:pr-4 w-[248px]">
                        <label htmlFor="date" className="block text-sm font-medium text-foreground h-full">
                          Spezialität
                        </label>
                        <Select onOpenChange={() => setActiveField("skill")} onValueChange={(value) => setSkill(value)}>
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
                      className={`p-2 md:p-2 ${
                        activeField === null ? "rounded-b-[4rem] md:rounded-r-[4rem] md:rounded-bl-none" : ""
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
  )
}

