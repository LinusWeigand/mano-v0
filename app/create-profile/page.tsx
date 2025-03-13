"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import ProfileForm from "../components/ProfileForm"

export default function CreateProfilePage() {
  const router = useRouter()
  const { isLoggedIn, hasProfile, setHasProfile } = useAuth()

  React.useEffect(() => {
    if (!isLoggedIn) router.push("/login")
    else if (hasProfile) router.push("/")
  }, [isLoggedIn, hasProfile, router])

  return (
    <div className="py-10">
      <ProfileForm
      />
    </div>
  )
}
