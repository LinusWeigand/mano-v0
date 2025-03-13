"use client"

import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  CheckCircle2,
  Globe,
  Instagram,
  AlertCircle,
  MapPin,
  ChevronLeft,
  Minus,
  Plus,
  X,
  ChevronDownIcon,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function ProfileForm() {
  const router = useRouter()
  const totalSteps = 5
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    craft: "",
    experience: "1",
    location: "",
    bio: "",
    website: "",
    instagram: "",
    google_ratings: "",
    skills: [] as string[],
  })

  const [nameError, setNameError] = useState("");
  const [craftError, setCraftError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [bioError, setBioError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [googleRatingsError, setGoogleRatingsError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [photosError, setPhotosError] = useState("");
  const [missingFieldsError, setMissingFieldsError] = useState("");
  const [invalidURLSError, setInvalidURLSError] = useState("");
  const [showInternalError, setShowInternalError] = useState(false);

  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [availableCrafts, setAvailableCrafts] = useState<string[]>([])
  const [loadingCrafts, setLoadingCrafts] = useState(true)

  const { isLoggedIn, hasProfile, setHasProfile } = useAuth();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setTimeout(async () => {
      if (!isLoggedIn) {
        router.push("/login")
      }
      if (hasProfile) {
        router.push("")
      }
    }, 500);


    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }

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
        setAvailableSkills(skillsArray)
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
        setAvailableCrafts(craftsArray)
      })
      .catch((error) => {
        console.error(error)
        setCraftError("Failed to load skills")
      })
      .finally(() => {
        setLoadingCrafts(false)
      })
  }, [])

  useEffect(() => {
    let fields = [];
    let field_count = 0;
    if (nameError) {
      fields.push("Name")
      field_count += 1
    }
    if (craftError) {
      fields.push("Handwerk")
      field_count += 1
    }
    if (experienceError) {
      fields.push("Erfahrung")
      field_count += 1
    }
    if (locationError) {
      fields.push("Standort")
      field_count += 1
    }
    if (bioError) {
      fields.push("Beschreibung")
      field_count += 1
    }
    if (skillsError) {
      fields.push("Fähigkeiten")
      field_count += 1
    }
    let message = "";
    if (field_count === 1) {
      message = "Folgendes Feld muss noch angegeben werden: " + fields.join(", ") + "."
    } else if (field_count > 1) {
      message = "Folgende Felder müssen noch angegeben werden: " + fields.join(", ") + "."
    }
    setMissingFieldsError(message)

    fields = []
    field_count = 0
    if (websiteError) {
      fields.push("Webseite")
      field_count += 1
    }
    if (instagramError) {
      fields.push("Instagram")
      field_count += 1
    }
    if (googleRatingsError) {
      fields.push("Google Bewertungen")
      field_count += 1
    }
    if (field_count === 1) {
      message = "Folgender Link ist noch inkorrekt: " + fields.join(", ") + "."
    } else if (field_count > 1) {
      message = "Folgende Links sind noch inkorrekt: " + fields.join(", ") + "."
    }
    setInvalidURLSError(message)
  }, [nameError, craftError, experienceError, locationError, bioError, websiteError, instagramError, googleRatingsError, skillsError])

  const removePhoto = (photoToRemove: { file: File; preview: string }) => {
    setPhotos((prevPhotos) => {
      URL.revokeObjectURL(photoToRemove.preview)
      return prevPhotos.filter(
        (photo) => photo.preview !== photoToRemove.preview
      )
    })
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPhotos = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos])
    }
    setPhotosError("")
  }

  const validateStep1 = () => {
    let isValid = true

    if (!formData.name || formData.name.length < 2) {
      setNameError("Der Name muss mindestens 2 Charktere enthalten.")
      isValid = false
    }

    if (!formData.craft) {
      setCraftError("Bitte wählen Sie Ihr Handwerk aus.")
      isValid = false
    }

    const exp = Number(formData.experience)
    if (!formData.experience || isNaN(exp) || exp <= 0) {
      setExperienceError("Bitte geben Sie eine positive Zahl an.")
      isValid = false
    }

    return isValid
  }

  const validateStep2 = () => {
    let isValid = true

    if (!formData.location) {
      setLocationError("Bitte geben Sie einen Standort an.")
      isValid = false
    }

    if (!formData.bio) {
      setBioError("Bitte geben Sie eine Beschreibung an.")
      isValid = false
    }

    return isValid
  }

  const validateStep3 = () => {
    let isValid = true

    if (
      formData.website &&
      !formData.website.match(
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
      )
    ) {
      setWebsiteError("Bitte geben Sie eine korrekte URL an.")
      isValid = false
    }

    if (
      formData.google_ratings &&
      !formData.google_ratings.match(
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
      )
    ) {
      setGoogleRatingsError("Bitte geben Sie eine korrekte URL an.")
      isValid = false
    }

    return isValid
  }

  const validateStep4 = () => {
    let isValid = true

    if (formData.skills.length < 1) {
      setSkillsError("Bitte geben Sie mindestens eine Fähigkeit an.");
      isValid = false
    }

    return isValid
  }

  const validateStep5 = () => {
    let isValid = true

    if (photos.length < 1) {
      setPhotosError("Bitte laden Sie mindestens ein Foto hoch.")
      isValid = false
    }

    return isValid
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    switch (name) {
      case "name":
        setNameError("");
        break;
      case "craft":
        setCraftError("");
        break;
      case "experience":
        setExperienceError("");
        break;
      case "location":
        setLocationError("");
        break;
      case "bio":
        setBioError("");
        break;
      case "website":
        setWebsiteError("");
        break;
      case "instagram":
        setInstagramError("");
        break;
      case "google_ratings":
        setGoogleRatingsError("");
        break;
      case "skills":
        setSkillsError("");
        break;
      default:
        break;
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills }
    })
    setSkillsError("");
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && validateStep1()) {
      setStep(2)
      setTimeout(() => {
        if (locationInputRef.current) {
          locationInputRef.current.focus();
        }
      }, 100);
    } else if (step === 2 && validateStep2()) {
      setStep(3)
      setTimeout(() => {
        if (websiteInputRef.current) {
          websiteInputRef.current.focus();
        }
      }, 100);
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    } else if (step === 4 && validateStep4()) {
      setStep(5)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const step1 = validateStep1()
    const step2 = validateStep2()
    const step3 = validateStep3()
    const step4 = validateStep4()
    const step5 = validateStep5()


    if (!step1 || !step2 || !step3 || !step4 || !step5) {
      setIsSubmitting(false)
      return
    }

    try {
      const data = new FormData()
      // photos.forEach((photo, index) => {
      //   data.append(`photos_${index}`, photo.file)
      // })
      data.append("name", formData.name)
      data.append("craft", formData.craft)
      data.append("location", formData.location)
      data.append("website", formData.website)
      data.append("google_ratings", formData.google_ratings)
      data.append("instagram", formData.instagram)
      data.append("bio", formData.bio)
      data.append("experience", formData.experience)
      data.append("skills", JSON.stringify(formData.skills))

      photos.forEach((photo) => {
        data.append("photos", photo.file)
      })

      const response = await fetch("http://localhost/api/profile", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        setShowInternalError(true)
        throw new Error("Failed to create profile")
      }

      setShowInternalError(false)
      setIsSuccess(true)
      setHasProfile(true)
    } catch (error) {
      setShowInternalError(true);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.experience) || 1
      const newValue = currentValue > 1 ? currentValue - 1 : 1
      return { ...prev, experience: newValue.toString() }
    })
  }

  const handleIncrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.experience) || 1
      const newValue = currentValue + 1
      return { ...prev, experience: newValue.toString() }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Profil erstellt!</h2>
        <p className="text-center text-muted-foreground">
          Ihr Profil wurde erfolgreich erstellt.
        </p>

        <Button onClick={() => { router.push("/") }} className="w-[200px] h-12 text-base"> Zurück zur Startseite</Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2">
      <CardHeader className="bg-muted/50 border-b pb-4">
        <CardTitle className="text-2xl text-center">
          {step === 1
            ? "Profil Erstellen"
            : step === 2
              ? "Zusätzliche Details"
              : step === 3
                ? "Soziale Links"
                : step === 4
                  ? "Fähigkeiten"
                  : "Portfolio"}
        </CardTitle>
        <CardDescription className="text-center pt-1">
          {step === 1
            ? "Geben Sie Ihre Daten ein, um ein neues Profil zu erstellen."
            : step === 2
              ? "Geben Sie zusätzliche Details zu Ihrem Profil an."
              : step === 3
                ? "Fügen Sie Ihre sozialen Links hinzu."
                : step === 4
                  ? "Wählen Sie die für Ihre Handwerk relevanten Fähigkeiten aus."
                  : "Laden Sie Fotos Ihrer letzten Arbeiten hoch."}
        </CardDescription>
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
      <CardContent className="pt-6">
        <form
          onSubmit={step === totalSteps ? handleSubmit : handleNext}
          className="space-y-6"
        >
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-base font-medium flex items-center"
                >
                  Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={nameInputRef}
                    id="name"
                    name="name"
                    placeholder="Geben Sie Ihren Namen ein"
                    value={formData.name}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 h-12 pl-4 ${nameError
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus-visible:border-primary"
                      }`}
                  />
                  {nameError && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {nameError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {nameError}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Dies ist Ihr öffentlicher Anzeigename.
                </p>
              </div>

              <div className="space-y-3 pt-2 flex flex-col">
                <Label htmlFor="craft" className="text-base font-medium">
                  Handwerk <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  {loadingCrafts ?
                    <p> Fähigkeiten laden... </p>
                    : (
                      <select
                        id="craft"
                        name="craft"
                        value={formData.craft}
                        onChange={handleChange}
                        className={`block w-full appearance-none rounded-md bg-white border-2 h-12 pl-4 pr-10 ${craftError
                          ? "border-red-300 focus-visible:ring-red-300"
                          : "focus:border-black"
                          } focus:ring-0 focus:outline-none`}
                      >
                        {availableCrafts.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  {craftError ? (
                    <div className="absolute right-3 top-3 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {craftError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {craftError}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="experience"
                  className="text-base font-medium flex items-center"
                >
                  Jahre der Erfahrung{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleDecrement}
                    variant="outline"
                    className="w-12 h-12 flex items-center justify-center text-gray-600"
                  >
                    <Minus className="w-10 h-10" />
                  </Button>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.experience}
                    onChange={handleChange}
                    className="h-12 w-28 rounded-sm border-gray-200 sm:text-sm text-center appearance-none pr-2 pl-6"
                  />
                  <Button
                    type="button"
                    onClick={handleIncrement}
                    variant="outline"
                    className="w-12 h-12 flex items-center justify-center text-gray-600"
                  >
                    <Plus className="w-10 h-10" />
                  </Button>
                </div>
                {experienceError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {experienceError}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base mt-6">
                Weiter
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3 pt-2">
                <Label htmlFor="location" className="text-base font-medium">
                  Standort<span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={locationInputRef}
                    id="location"
                    name="location"
                    placeholder="Geben Sie Ihren Standort an"
                    value={formData.location}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${locationError
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus-visible:border-primary"
                      }`}
                  />
                  {locationError && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {locationError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {locationError}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="bio" className="text-base font-medium">
                  Beschreibung<span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="relative text-muted-foreground">
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Beschreiben Sie Ihre Arbeit..."
                    value={formData.bio}
                    onChange={handleChange}
                    className={`w-full rounded-md border-2 h-24 p-2 text-muted-foreground ${bioError
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus:border-black"
                      } focus:ring-0 focus:outline-none`}
                  />
                  {bioError && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {bioError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {bioError}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  Weiter
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-3 pt-2">
                <Label htmlFor="website" className="text-base font-medium">
                  Website{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={websiteInputRef}
                    id="website"
                    name="website"
                    placeholder="https://deine-webseite.de"
                    value={formData.website}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${websiteError
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus-visible:border-primary"
                      }`}
                  />
                  {websiteError && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {websiteError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {websiteError}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Ihre persönliche oder berufliche Webseite.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="instagram" className="text-base font-medium">
                  Instagram{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <div className="flex items-center">
                  <div className="bg-muted flex items-center px-3 py-3 rounded-l-md !border-2 !border-gray-300 border-r-0">
                    <Instagram className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="instagram"
                    name="instagram"
                    placeholder="nutzername"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="!border-2 !border-gray-300 !border-l-0 h-12 bg-white pl-3 rounded-r-md"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Label htmlFor="google_ratings" className="text-base font-medium">
                  Google Bewertungen{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="google_ratings"
                    name="google_ratings"
                    placeholder="https://ratings.google.com/..."
                    value={formData.google_ratings}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${googleRatingsError
                      ? "border-red-300 focus-visible:ring-red-300"
                      : "focus-visible:border-primary"
                      }`}
                  />
                  {googleRatingsError && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {googleRatingsError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {googleRatingsError}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  Weiter
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="pt-2">
                <Label className="text-base font-medium mb-2">
                  Fähigkeiten <span className="text-red-500 ml-1">*</span>
                </Label>
                {loadingSkills ?
                  <p> Fähigkeiten laden... </p>
                  : (
                    <div className="flex flex-wrap gap-3">
                      {availableSkills.map((skill) => {
                        const isSelected = formData.skills.includes(skill)
                        return (
                          <Button
                            key={skill}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => handleSkillToggle(skill)}
                            className="px-4 py-2"
                          >
                            {skill}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                {skillsError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    {skillsError}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  Weiter
                </Button>
              </div>
            </>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Portfolio</h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative group w-[130px] h-[130px]"
                  >
                    {photo.preview.startsWith("blob:") ? (
                      <img
                        src={photo.preview}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <img
                        src={photo.preview}
                        alt={`Portfolio ${index + 1}`}
                        className="object-cover rounded"
                      />
                    )}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(photo)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`${photosError ? "!border-red-500" : "hover:border-gray-400"}  border-gray-200 relative w-[130px] h-[130px] flex items-center justify-center bg-gray-200 rounded cursor-pointer border-2 `}
                  >
                    {photosError && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <AlertCircle className="text-red-500 h-5 w-5" />
                      </div>
                    )}
                    <Plus className="w-6 h-6 text-gray-600" />

                  </div>

                )}
              </div>
              <p className="text-sm text-red-500 flex items-center gap-1">
                {photosError}
              </p>
              <p className="text-sm text-red-500 flex items-center gap-1">
                {missingFieldsError}
              </p>
              <p className="text-sm text-red-500 flex items-center gap-1">
                {invalidURLSError}
              </p>

              {showInternalError && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-start">
                  <div className="bg-red-400 rounded-full mr-3 flex-shrink-0 border-transparent">
                    <AlertCircle className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Irgendwas ist schiefgelaufen.</h4>
                    <p className="text-gray-600">Versuche es später noch einmal.</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  {isSubmitting ? "Erstellen..." : "Profil erstellen"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6 bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-2 h-4 w-4" />
          Ihre Profilinformationen werden sicher gespeichert
        </div>
      </CardFooter>
    </Card>
  )
}
