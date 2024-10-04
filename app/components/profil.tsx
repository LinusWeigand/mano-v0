"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
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
  Camera,
  Plus,
  Building2,
  X,
  Globe,
  Instagram,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

interface ProfilProps {
  onClose: any;
}

export default function Profil({ onClose }: ProfilProps) {
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState<"personal" | "professional">(
    "personal"
  );
  const [skills, setSkills] = useState<string[]>([
    "Holzmöbel",
    "Küchen",
    "Badezimmer",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [location, setLocation] = useState(center);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 3;
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    setLocation({
      lat: e.latLng?.lat() || center.lat,
      lng: e.latLng?.lng() || center.lng,
    });
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const removePhoto = (photoToRemove: string) => {
    setPhotos(photos.filter((photo) => photo !== photoToRemove));
  };

  const handleFinish = () => {
    onClose(false);
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
              className={`h-1 w-full rounded-none ${
                index + 1 <= step ? "bg-primary" : "bg-gray-300"
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
                placeholder={
                  profileType === "personal" ? "Max Zimmer" : "Holzrausch GmbH."
                }
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
                className="text-[16px]"
                placeholder={
                  profileType === "personal"
                    ? "Erzähl uns über dich und dein Handwerk..."
                    : "Erzähl uns über dein Gewerk und dessen Spezialitäten..."
                }
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
                    src={photo}
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
            <div className="space-y-2">
              <Label htmlFor="portfolio-description">
                Portfolio Beschreibung
              </Label>
              <Textarea
                id="portfolio-description"
                className="text-[16px]"
                placeholder={
                  profileType === "personal"
                    ? "Beschreibe dein bestes Projekt..."
                    : "Beschreibe dein bestes Projekt..."
                }
              />
            </div>
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
          <Button onClick={handleFinish} className="ml-auto">
            Profil abschließen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
