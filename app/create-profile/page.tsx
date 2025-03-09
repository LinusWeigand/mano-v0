
"use client"

import type React from "react"
import { useRef, useState } from "react"
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

export default function ProfileForm() {
  const totalSteps = 5
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    website: "",
    instagram: "",
    yearsOfExperience: "1",
    googleMapsLink: "",
    skills: [] as string[],

  })
  const [errors, setErrors] = useState({
    name: "",
    profession: "",
    website: "",
    instagram: "",
    yearsOfExperience: "",
    googleMapsLink: "",
    skills: "",
  })

  const availableSkills = [
    "Carpentry",
    "Plumbing",
    "Electrical",
    "Masonry",
    "Painting",
    "Tiling",
    // add more skills as needed
  ]

  // Define your predefined options
  const professionOptions = [
    { value: '', label: 'Select your profession' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'other', label: 'Other' },
  ];

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
  }

  const validateStep1 = () => {
    let isValid = true
    const newErrors = {
      name: "",
      profession: "",
      website: "",
      instagram: "",
      yearsOfExperience: "",
      googleMapsLink: "",
      skills: "",
    }

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      isValid = false
    }

    const years = Number(formData.yearsOfExperience)
    if (!formData.yearsOfExperience || isNaN(years) || years <= 0) {
      newErrors.yearsOfExperience = "Please enter a valid positive number."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const validateStep2 = () => {
    let isValid = true
    const newErrors = {
      name: "",
      website: "",
      instagram: "",
      yearsOfExperience: "",
      googleMapsLink: "",
      skills: "",
    }

    if (
      formData.website &&
      !formData.website.match(
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
      )
    ) {
      newErrors.website = "Please enter a valid URL."
      isValid = false
    }

    
    if (
      formData.googleMapsLink &&
      !formData.googleMapsLink.match(
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
      )
    ) {
      newErrors.googleMapsLink = "Please enter a valid URL."
      isValid = false
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return isValid
  }

  const validateStep3 = () => {
    let isValid = true
    const newErrors = {
      name: "",
      website: "",
      instagram: "",
      yearsOfExperience: "",
      googleMapsLink: "",
      skills: "",
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill."
      isValid = false
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return isValid
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills }
    })
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // You can add additional validation here if needed before submitting.
    setIsSubmitting(true)
    try {
      const data = new FormData()
      // Append uploaded photos
      photos.forEach((photo, index) => {
        data.append(`photos_${index}`, photo.file)
      })
      // Append the rest of the form fields
      data.append("name", formData.name)
      data.append("website", formData.website)
      data.append("instagram", formData.instagram)
      data.append("yearsOfExperience", formData.yearsOfExperience)
      data.append("googleMapsLink", formData.googleMapsLink)
      data.append("skills", JSON.stringify(formData.skills))

      // Send the form data to the backend
      const response = await fetch("http://localhost/api/profile", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Failed to create profile")
      }

      console.log("Profile created successfully!")
      setIsSuccess(true)
      // Optionally, clear the form or trigger a success banner/redirect here.
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.yearsOfExperience) || 1
      const newValue = currentValue > 1 ? currentValue - 1 : 1
      return { ...prev, yearsOfExperience: newValue.toString() }
    })
  }

  const handleIncrement = () => {
    setFormData((prev) => {
      const currentValue = Number(prev.yearsOfExperience) || 1
      const newValue = currentValue + 1
      return { ...prev, yearsOfExperience: newValue.toString() }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Profile Created!</h2>
        <p className="text-center text-muted-foreground">
          Your profile has been successfully created.
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setFormData({
              name: "",
              profession: "",
              website: "",
              instagram: "",
              yearsOfExperience: "1",
              googleMapsLink: "",
              skills: [],
            })
            setPhotos([])
            setStep(1)
          }}
          className="w-full h-12 text-base mt-6"
        >
          Create Another Profile
        </Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-2">
      <CardHeader className="bg-muted/50 border-b pb-4">
        <CardTitle className="text-2xl text-center">
          {step === 1
            ? "Create Profile"
            : step === 2
            ? "Additional Details"
            : step === 3
            ? "Select Your Skills"
            : "Portfolio"}
        </CardTitle>
        <CardDescription className="text-center pt-1">
          {step === 1
            ? "Fill in your details to create a new profile."
            : step === 2
            ? "Provide additional details for your profile."
            : step === 3
            ? "Select the skills relevant to your craft."
            : "Upload your portfolio photos."}
        </CardDescription>
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
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 h-12 pl-4 ${
                      errors.name
                        ? "border-red-300 focus-visible:ring-red-300"
                        : "focus-visible:border-primary"
                    }`}
                  />
                  {errors.name && (
                    <div className="absolute right-3 top-3 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  This is your public display name.
                </p>
              </div>




<div className="space-y-3 pt-2 flex flex-col">
  <Label htmlFor="profession" className="text-base font-medium">
    Profession <span className="text-red-500 ">*</span>
  </Label>
  <div className="relative">
    <select
      id="profession"
      name="profession"
      value={formData.profession}
      onChange={handleChange}
      className="block w-full appearance-none rounded-md bg-white border-2 h-12 pl-4 pr-10 focus:border-black focus:ring-0 focus:outline-none"
    >
      {professionOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
    </div>
  </div>
  {errors.profession && (
    <p className="text-sm text-red-500 flex items-center gap-1">
      {errors.profession}
    </p>
  )}
  <p className="text-sm text-muted-foreground">
    Please select your current profession.
  </p>
</div>
<div className="space-y-3">
                <Label
                  htmlFor="yearsOfExperience"
                  className="text-base font-medium flex items-center"
                >
                  Years of Experience{" "}
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
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.yearsOfExperience}
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

                {errors.yearsOfExperience && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.yearsOfExperience}
                  </p>
                )}
              </div>



              <Button
                type="submit"
                className="w-full h-12 text-base mt-6"
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>

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
                    id="website"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${
                      errors.website
                        ? "border-red-300 focus-visible:ring-red-300"
                        : "focus-visible:border-primary"
                    }`}
                  />
                  {errors.website && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {errors.website && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.website}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your personal or professional website.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="website" className="text-base font-medium">
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
                  placeholder="username"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="!border-2 !border-gray-300 !border-l-0 h-12 bg-white pl-3 rounded-r-md"
                />
              </div>
              </div>
              <div className="space-y-3 pt-2">
                <Label
                  htmlFor="googleMapsLink"
                  className="text-base font-medium"
                >
                  Google Maps Link{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="googleMapsLink"
                    name="googleMapsLink"
                    placeholder="https://maps.google.com/..."
                    value={formData.googleMapsLink}
                    onChange={handleChange}
                    className={`rounded-md bg-white border-2 focus:outline-none h-12 pl-12 ${
                      errors.googleMapsLink
                        ? "border-red-300 focus-visible:ring-red-300"
                        : "focus-visible:border-primary"
                    }`}
                  />
                  {errors.googleMapsLink && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {errors.googleMapsLink && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.googleMapsLink}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="pt-2">
                <Label className="text-base font-medium mb-2">
                  Skills <span className="text-red-500 ml-1">*</span>
                </Label>
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
                    )
                  })}
                </div>
                {errors.skills && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    {errors.skills}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  Next
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
                      <Image
                        src={photo.preview}
                        alt={`Portfolio ${index + 1}`}
                        width={200}
                        height={200}
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
                    className="w-[130px] h-[130px] flex items-center justify-center bg-gray-200 rounded cursor-pointer hover:border-2 hover:border-gray-400"
                  >
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
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
              <div className="flex justify-between gap-4">
                <Button onClick={prevStep} variant="outline" className="h-12">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                </Button>
                <Button type="submit" className="w-full h-12 text-base">
                  {isSubmitting ? "Creating..." : "Create Profile"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6 bg-muted/30">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="mr-2 h-4 w-4" />
          Your profile information is stored securely
        </div>
      </CardFooter>
    </Card>
  )
}
