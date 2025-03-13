"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfiles } from "@/context/ProfilesContext"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("crafts")
  const [newCraft, setNewCraft] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [crafts, setCrafts] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [isSubmittingCraft, setIsSubmittingCraft] = useState(false)
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false)
  const [craftDialogOpen, setCraftDialogOpen] = useState(false)
  const [skillDialogOpen, setSkillDialogOpen] = useState(false)

  const [loadingSkills, setLoadingSkills] = useState(true)
  const [loadingCrafts, setLoadingCrafts] = useState(true)
  const [loadingProfiles, setLoadingProfiles] = useState(true)

  const [skillsError, setSkillsError] = useState("")
  const [craftError, setCraftError] = useState("")
  const [profileError, setProfileError] = useState("")

  const [editingCraft, setEditingCraft] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editedCraftName, setEditedCraftName] = useState("")
  const [editedSkillName, setEditedSkillName] = useState("")

  const router = useRouter();

  const { profiles, setProfiles } = useProfiles();

  useEffect(() => {
    setLoadingSkills(true)
    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch skills")
        }
        return res.json()
      })
      .then((data) => {
        const skillsArray = data.data.map((item: { name: string }) => item.name)
        setSkills(skillsArray)
      })
      .catch((error) => {
        console.error(error)
        setSkillsError("Failed to load skills")
      })
      .finally(() => {
        setLoadingSkills(false)
      })

    setLoadingCrafts(true)
    fetch("/api/crafts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch crafts")
        }
        return res.json()
      })
      .then((data) => {
        const craftsArray = data.data.map((item: { name: string }) => item.name)
        setCrafts(craftsArray)
      })
      .catch((error) => {
        console.error(error)
        setCraftError("Failed to load skills")
      })
      .finally(() => {
        setLoadingCrafts(false)
      })

    setLoadingProfiles(true)
    get_profiles()
  }, [])

  const get_profiles = async () => {
    try {
      const response = await fetch("http://localhost/api/profiles", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get profiles");
      }

      const result = await response.json();
      const data = result.data;

      const initialProfiles: ProfileModel[] = data.map(
        (profile_object: any) => ({
          id: profile_object.id,
          viewer_id: profile_object.viewer_id,
          name: profile_object.name,
          craft: profile_object.craft,
          location: profile_object.location,
          website: profile_object.website,
          google_ratings: profile_object.google_ratings,
          instagram: profile_object.instagram,
          bio: profile_object.bio,
          experience: profile_object.experience,
          skills: profile_object.skills,
          photos: [],
        }),
      );

      setProfiles(initialProfiles);

      initialProfiles.forEach((profile) => {
        load_profile_photos(profile.id);
      });

      console.log("Profiles fetched successfully.");
      setLoadingProfiles(false)
    } catch (error) {
      console.error("Error occurred in get_profiles: ", error);
      setLoadingProfiles(false)
    }
  };

  const load_profile_photos = async (profileId: string) => {
    try {
      const response = await fetch(
        `http://localhost/api/profile-photos/${profileId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get profile photos");
      }

      const result = await response.json();
      const photoUrls = result.data;

      const photoObjectUrls: string[] = await Promise.all(
        photoUrls.map(async (url: string) => {
          const response = await fetch(url, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Failed to get profile photo");
          }

          const photoBlob = await response.blob();
          const photoObjectUrl = URL.createObjectURL(photoBlob);
          return photoObjectUrl;
        }),
      );

      setProfiles((prevProfiles: ProfileModel[]) =>
        prevProfiles.map((profile: ProfileModel) => {
          if (profile.id === profileId) {
            return {
              ...profile,
              photos: photoObjectUrls,
            };
          }
          return profile;
        }),
      );
    } catch (error) {
      console.error(
        `Error occurred while fetching photos for profile ${profileId}:`,
        error,
      );
    }
  };

  const handleAddCraft = async () => {
    if (!newCraft.trim()) return

    setIsSubmittingCraft(true)

    try {
      const response = await fetch("/api/crafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCraft }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to add craft")
      }

      setCrafts((prev) => [...prev, result.data.name])
      setNewCraft("")
      setCraftDialogOpen(false)
    } catch (error) {
      console.error("Failed to add craft:", error)
      setCraftError(error.message)
    } finally {
      setIsSubmittingCraft(false)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return

    setIsSubmittingSkill(true)

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to add skill")
      }

      setSkills((prev) => [...prev, result.data.name])
      setNewSkill("")
      setSkillDialogOpen(false)
    } catch (error) {
      console.error("Failed to add skill:", error)
      setSkillsError(error.message)
    } finally {
      setIsSubmittingSkill(false)
    }
  }

  const handleUpdateCraft = async (oldName, newName) => {
    try {
      const response = await fetch("/api/crafts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_name: oldName, new_name: newName }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update craft")
      }

      setCrafts((prev) => prev.map((craft) => (craft === oldName ? result.data.name : craft)))
    } catch (error) {
      console.error("Failed to update craft:", error)
      setCraftError(error.message)
    }
  }

  // Similarly, implement handleUpdateSkill
  const handleUpdateSkill = async (oldName, newName) => {
    try {
      const response = await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_name: oldName, new_name: newName }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update skill")
      }

      setSkills((prev) => prev.map((skill) => (skill === oldName ? result.data.name : skill)))
    } catch (error) {
      console.error("Failed to update skill:", error)
      setSkillsError(error.message)
    }
  }
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="crafts" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="crafts">Handwerke</TabsTrigger>
              <TabsTrigger value="skills">Fähigkeiten</TabsTrigger>
              <TabsTrigger value="users">Profile</TabsTrigger>
            </TabsList>

            {activeTab === "crafts" ? (
              <Dialog open={craftDialogOpen} onOpenChange={setCraftDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Handwerk hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Craft</DialogTitle>
                    <DialogDescription>Enter the name of the craft you want to add to the system.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="craft-name">Craft Name</Label>
                      <Input
                        id="craft-name"
                        value={newCraft}
                        onChange={(e) => setNewCraft(e.target.value)}
                        placeholder="e.g. Carpenter"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddCraft} disabled={isSubmittingCraft || !newCraft.trim()}>
                      {isSubmittingCraft ? "Adding..." : "Add Craft"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : activeTab === "skills" ? (
              <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Fähigkeit hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fähigkeit hinzufügen</DialogTitle>
                    <DialogDescription>Gebe den Namen der Fähigkeit an, welchen du zum System hinzufügen möchtest.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="skill-name">Fähigkeit Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g. Woodworking"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSkill} disabled={isSubmittingSkill || !newSkill.trim()}>
                      {isSubmittingSkill ? "Adding..." : "Add Skill"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button asChild>
                <Link href="/create-profile">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Profil erstellen
                </Link>
              </Button>
            )}
          </div>

          <TabsContent value="crafts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Handwerksliste</CardTitle>
                <CardDescription>Verwalte die Handwerke verfügbar im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCrafts ? (
                  <p> Handwerke laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {crafts.map((craft, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        {editingCraft === craft ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editedCraftName}
                              onChange={(e) => setEditedCraftName(e.target.value)}
                              className="max-w-xs"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleUpdateCraft(craft, editedCraftName)
                                  setEditingCraft(null)
                                }}
                                disabled={!editedCraftName.trim() || editedCraftName === craft}
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingCraft(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span>{craft}</span>
                        )}
                        {editingCraft !== craft && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCraft(craft)
                              setEditedCraftName(craft)
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {craftError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    Handwerk konnte nicht geladen werden.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fähigkeitsliste</CardTitle>
                <CardDescription>Verwalte die Fähigkeiten verfügbar im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSkills ? (
                  <p> Fähigkeiten laden... </p>
                ) : (
                  <div className="grid gap-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        {editingSkill === skill ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editedSkillName}
                              onChange={(e) => setEditedSkillName(e.target.value)}
                              className="max-w-xs"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleUpdateSkill(skill, editedSkillName)
                                  setEditingSkill(null)
                                }}
                                disabled={!editedSkillName.trim() || editedSkillName === skill}
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span>{skill}</span>
                        )}
                        {editingSkill !== skill && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSkill(skill)
                              setEditedSkillName(skill)
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {skillsError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    Fähigkeiten konnten nicht geladen werden.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profilliste</CardTitle>
                <CardDescription>Verwalte die Profile im System.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingProfiles ? (
                  <p> Profile laden... </p>
                ) : (
                <div className="grid gap-4">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.name}</span>
                        <span className="text-sm text-muted-foreground">{profile.craft}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {profile.viewer_id ? (
                          <div className="flex items-center gap-1 text-sm px-2 py-1 bg-green-100 text-green-800 rounded-md">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Verifiziert
                          </div>
                        ) : (
                          <span className="text-sm px-2 py-1 bg-muted rounded-md">Nicht Verifiziert</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/edit-profile/${profile.id}`)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
                {profileError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    Profile konnten nicht geladen werden.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

