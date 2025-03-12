"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronLeft, User } from "lucide-react";

export default function ProfileForm({ initialData, profileId }: { initialData?: any; profileId?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    craft: initialData?.craft || "",
    experience: initialData?.experience?.toString() || "1",
    location: initialData?.location || "",
    bio: initialData?.bio || "",
    website: initialData?.website || "",
    instagram: initialData?.instagram || "",
    google_ratings: initialData?.google_ratings || "",
    skills: initialData?.skills || [],
  });

  // Load crafts, skills, etc. similarly as you have done previously

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = initialData
      ? `/api/profiles/${profileId}`
      : "/api/profiles";

    const method = initialData ? "PUT" : "POST";

    const data = new FormData();
    data.append("name", formData.name);
    data.append("craft", formData.craft);
    data.append("location", formData.location);
    data.append("website", formData.website);
    data.append("google_ratings", formData.google_ratings);
    data.append("instagram", formData.instagram);
    data.append("bio", formData.bio);
    data.append("experience", formData.experience);
    data.append("skills", JSON.stringify(formData.skills));

    const response = await fetch(endpoint, {
      method,
      body: data,
    });

    if (!response.ok) {
      setIsSuccess(false);
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    setIsSubmitting(false);
    router.push("/");
  }

  if (isSuccess) {
    return (
      <div className="text-center p-4">
        <CheckCircle2 className="text-green-600 h-8 w-8 mx-auto" />
        <h2>Profil erfolgreich gespeichert!</h2>
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{initialData ? "Profil Bearbeiten" : "Profil Erstellen"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          {/* Repeat for other form fields like craft, experience, location, bio, website, etc. */}
          {/* Add your existing step-by-step logic if desired */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Speichert..." : "Speichern"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <User className="mr-2 h-4 w-4" />
        Ihre Daten werden sicher gespeichert.
      </CardFooter>
    </Card>
  );
}
