// /context/GoogleScriptContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

interface GoogleScriptContextProps {
  isLoaded: boolean
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

// Create the context
const GoogleScriptContext = createContext<GoogleScriptContextProps | undefined>(undefined)

// Create a provider
export function GoogleScriptContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    // If window.google is already present (user navigated from a page where it loaded),
    // set isLoaded immediately.
    if (typeof window !== "undefined" && (window as any).google) {
      setIsLoaded(true)
    }
  }, [])

  return (
    <GoogleScriptContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </GoogleScriptContext.Provider>
  )
}

// Custom hook for convenience
export function useGoogleScript() {
  const context = useContext(GoogleScriptContext)
  if (!context) {
    throw new Error("useGoogleScript must be used within a GoogleScriptContextProvider")
  }
  return context
}
