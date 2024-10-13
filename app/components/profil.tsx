"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Globe,
  Instagram,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

interface ProfilProps {
  onClose: any;
}

export default function Profil({ onClose }: ProfilProps) {
  const [step, setStep] = useState(1);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);
  const [profileType, setProfileType] = useState<"personal" | "professional">(
    "personal"
  );
  const [newSkill, setNewSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 3;
  const { setBanner } = useBanner();

  const [photos, setPhotos] = useState<{ file: File, preview: string }[]>([]);
  const [name, setName] = useState("");
  const [craft, setCraft] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [googleRatings, setGoogleRatings] = useState("");
  const [instagram, setInstagram] = useState("");
  const [skills, setSkills] = useState<string[]>([
    "Holzmöbel",
    "Küchen",
    "Badezimmer",
  ]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState(10);
  const [isLoading, setIsLoading] = useState(false)
  const [showInternalError, setShowInternalError] = useState(false)

  const email = "linus@couchtec.com";

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  useEffect(() => {
    if (step === 1 && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (step === 2 && bioInputRef.current) {
      bioInputRef.current.focus();
    }

  }, [step])

  const handleFinish = async () => {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos_${index}`, photo.file);
      });
      formData.append('name', name);
      formData.append('craft', craft);
      formData.append('location', location);
      formData.append('website', website);
      formData.append('google_ratings', googleRatings);
      formData.append('instagram', instagram);
      formData.append('skills', JSON.stringify(skills));
      formData.append('bio', bio);
      formData.append('experience', experience.toString());


      const response = await fetch("http://localhost/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      setBanner(BannerType.ProfilCreated);
      onClose();

    } catch (error) {
      console.error("Error uploading profile: ", error);
    }
  }


  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      let new_skills = [...skills, newSkill.trim()];
      setSkills(new_skills);
      localStorage.setItem("skills", JSON.stringify(new_skills));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    let new_skills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(new_skills);
    localStorage.setItem("skills", JSON.stringify(new_skills));
  };


  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const removePhoto = (photoToRemove: { file: File, preview: string }) => {
    setPhotos((prevPhotos) => {
      URL.revokeObjectURL(photoToRemove.preview);
      return prevPhotos.filter((photo) => photo.preview !== photoToRemove.preview);
    });
  };

  const handleNameChange = (name: string) => {
    setName(name);
    localStorage.setItem("name", name);
  }

  const handleCraftChange = (craft: string) => {
    setCraft(craft);
    localStorage.setItem("craft", craft);
  }

  const handleLocationChange = (location: string) => {
    setLocation(location);
    localStorage.setItem("location", location);
  }

  const handleWebsiteChange = (website: string) => {
    setWebsite(website);
    localStorage.setItem("website", website);
  }

  const handleGoogleRatingsChange = (website: string) => {
    setGoogleRatings(googleRatings);
    localStorage.setItem("google_ratings", website);
  }

  const handleInstagramChange = (instagram: string) => {
    setInstagram(instagram);
    localStorage.setItem("instagram", instagram);
  }

  const handleBioChange = (bio: string) => {
    setBio(bio);
    localStorage.setItem("bio", bio);
  }

  const handleExperienceChange = (experience: number) => {
    if (isNaN(experience)) {
      return;
    }
    setExperience(experience);
    localStorage.setItem("experience", experience.toString());
  }
  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      nextStep();
    }
  };


  return (
    <Card className="w-screen sm:w-[550px] relative">
      <div className="absolute left-4 top-4 hover:cursor-pointer rounded-full hover:bg-gray-100 p-1">
        <X onClick={() => onClose(false)} />
      </div>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center bg-muted p-1 rounded-full">
            <Button
              variant={profileType === "personal" ? "default" : "ghost"}
              size="sm"
              onClick={() => setProfileType("personal")}
              className="rounded-full"
            >
              Handwerker
            </Button>
            <div className="w-px h-4 bg-border mx-2" />
            <Button
              variant={profileType === "professional" ? "default" : "ghost"}
              size="sm"
              onClick={() => setProfileType("professional")}
              className="rounded-full"
            >
              Gewerk
            </Button>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {profileType === "personal" ? "Profil" : "Profil"}
        </CardTitle>
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`h-1 w-full rounded-none ${index + 1 <= step ? "bg-primary" : "bg-gray-300"
                } ${index > 0 ? "ml-1" : ""}`}
              onClick={() => setStep(index + 1)}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {profileType === "personal" ? "Name" : "Gewerks Name"}
              </Label>
              <Input
                id="name"
                ref={nameInputRef}
                className="text-[16px]"
                placeholder={
                  profileType === "personal" ? "Max Zimmer" : "Holzrausch GmbH."
                }
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">
                {profileType === "personal" ? "Handwerk" : "Handwerk"}
              </Label>
              <Input
                id="profession"
                className="text-[16px]"
                placeholder={
                  profileType === "personal"
                    ? "e.g. Schreiner, Zimmerer"
                    : "e.g. Schreinerei, Zimmerei"
                }
                onChange={(e) => handleCraftChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standort">Standort</Label>
              <div className="flex flex-row">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                <Input
                  id="standort"
                  className="text-[16px]"
                  placeholder="München"
                  onChange={(e) => handleLocationChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Webseite (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-1 top-1 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-8 text-[16px]"
                  placeholder="https://deine-webseite.de"
                  onChange={(e) => handleWebsiteChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_ratings">Google Maps Rating Link (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-1 top-1 h-4 w-4 text-muted-foreground" />
                <Input
                  id="google_ratings"
                  className="pl-8 text-[16px]"
                  placeholder="https://google.com/maps/mylink"
                  onChange={(e) => handleGoogleRatingsChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram (Optional)</Label>
              <div className="relative">
                <Instagram className="absolute left-1 top-1 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  className="pl-8 text-[16px]"
                  placeholder="@nutzername"
                  onChange={(e) => handleInstagramChange(e.target.value)}
                  onKeyDown={handle_key_down}
                />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">
              {profileType === "personal" ? "Fähigkeiten" : "Services"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  className="group"
                >
                  {skill}
                  <X
                    className="w-4 h-4 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSkill(skill);
                    }}
                  />
                </Button>
              ))}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Hinzufügen{" "}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[425px] dialog-content absolute top-[200px] "
                  onClick={(e) => e.stopPropagation()}
                >
                  <DialogHeader>
                    <DialogTitle>
                      Add {profileType === "personal" ? "Fähigkeit" : "Service"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new-skill" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="new-skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="col-span-3 text-[16px]"
                      />
                    </div>
                  </div>
                  <Button onClick={addSkill}>Hinzufügen</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                {profileType === "personal" ? "Über mich" : "Über das Gewerk"}
              </h3>
              <Textarea
                id="bio"
                ref={bioInputRef}
                className="text-[16px]"
                placeholder={
                  profileType === "personal"
                    ? "Erzähl uns über dich und dein Handwerk..."
                    : "Erzähl uns über dein Gewerk und dessen Spezialitäten..."
                }
                onChange={(e) => handleBioChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">
                {profileType === "personal"
                  ? "Erfahrungsjahre"
                  : "Geschäftsjahre"}
              </h3>
              <Input
                id="experience"
                type="number"
                placeholder="10"
                className="text-[16px]"
                onChange={(e) => handleExperienceChange(Number(e.target.value))}
                onKeyDown={handle_key_down}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Portfolio</h3>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(photo)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <Button
                  variant="outline"
                  className="aspect-square flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-6 h-6 mb-1" />
                  Fotos hinzufügen
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
            {showInternalError && (
              <div className="bg-white rounded-lg shadow-md p-4 my-4 flex items-start">
                <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
                  <AlertCircle className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Irgendwas ist schiefgelaufen.</h4>
                  <p className="text-gray-600">Versuche es später noch einmal.</p>
                </div>
              </div>
            )}
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button onClick={prevStep} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-1" /> Zurück
          </Button>
        )}
        {step < totalSteps ? (
          <Button onClick={nextStep} className="ml-auto">
            Weiter <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <>

            {isLoading ?
              < Button className="ml-auto gap-[6px] bg-gray-300 hover:bg-gray-300">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] -m-"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
              </Button>
              :
              < Button onClick={handleFinish} className="ml-auto">
                Profil abschließen
              </Button>
            }
          </>
        )}

      </CardFooter>
    </Card >
  );
}
