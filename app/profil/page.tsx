"use client";

import { useState, useCallback } from "react";
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

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

export default function CraftsmanProfile() {
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
  const totalSteps = 4;

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
                    profileType === "personal"
                      ? "Max Zimmer"
                      : "Holzrausch GmbH."
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">
                  {profileType === "personal" ? "Handwerk" : "Handwerk"}
                </Label>
                <Input
                  id="profession"
                  placeholder={
                    profileType === "personal"
                      ? "e.g. Schreiner, Zimmerer"
                      : "e.g. Schreinerei, Zimmerei"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Webseite (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-1 top-1 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    className="pl-8"
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
                    className="pl-8"
                    placeholder="@nutzername"
                  />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">
                  {profileType === "personal" ? "Über mich" : "Über das Gewerk"}
                </Label>
                <Textarea
                  id="bio"
                  placeholder={
                    profileType === "personal"
                      ? "Erzähl uns über dich und dein Handwerk..."
                      : "Erzähl uns über dein Gewerk und dessen Spezialitäten..."
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">
                  {profileType === "personal"
                    ? "Erfahrungsjahre"
                    : "Geschäftsjahre"}
                </Label>
                <Input id="experience" type="number" placeholder="10" />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">
                {profileType === "personal" ? "Skills" : "Services"}
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
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Hinzufügen{" "}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Add{" "}
                        {profileType === "personal" ? "Fähigkeit" : "Service"}
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
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={addSkill}>Hinzufügen</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">
                  {profileType === "personal" ? "Spezialitäten" : "Kompetenzen"}
                </Label>
                <Textarea
                  id="specialties"
                  placeholder={
                    profileType === "personal"
                      ? "Beschreibe deine einzigartigen Fähigkeiten und Techniken..."
                      : "Beschreibe die einzigarten Fähigkeiten und Angebotr deines Gewerks..."
                  }
                />
              </div>
              {profileType === "professional" && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Gewerks Standort</h3>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={location}
                      zoom={10}
                      onClick={onMapClick}
                    >
                      <Marker position={location} />
                    </GoogleMap>
                  ) : (
                    <div className="h-[200px] bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Klicke auf die Karte und setze dein Gewerks Standort
                  </p>
                </div>
              )}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Portfolio</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="aspect-square bg-gray-200 rounded flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-description">
                  Portfolio Beschreibung
                </Label>
                <Textarea
                  id="portfolio-description"
                  placeholder={
                    profileType === "personal"
                      ? "Beschreibe deine beste Arbeit..."
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
            <Button className="ml-auto">Complete Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
