"use client"

import { useState, useRef, useEffect } from "react"
import Script from "next/script"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { MapPin, AlertCircle } from "lucide-react"

interface ReliableAddressAutocompleteProps {
  value: string
  onChange: (value: string, lat: number, lng: number) => void
  id?: string
  name?: string
  placeholder?: string
  locationError?: string
}

export default function ReliableAddressAutocomplete({
  value,
  onChange,
  id = "location",
  name = "location",
  placeholder = "Geben Sie Ihren Standort an",
  locationError = "",
}: ReliableAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const apiKey = "AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus"

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return

    // Initialize
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
    })

    // Listen for a place being selected or “invalidly” submitted
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()

      // If no geometry, user typed something invalid or partial
      if (!place.geometry || !place.formatted_address || !place.geometry.location) {
        console.error("Invalid place data:", place)
        
        // Optionally refocus, highlight, or show an error, but DO NOT
        // clear the input or re-initialize. Just let user keep typing.
        if (inputRef.current) {
          inputRef.current.focus()
          // e.g., inputRef.current.classList.add('border-red-300')
        }
        return
      }

      // Otherwise, a valid place was selected. Call the parent onChange.
      onChange(
        place.formatted_address,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      )
    })

    // The rest is your MutationObserver for styling the dropdown items, etc.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const pacItems = document.querySelectorAll(".pac-item")
          pacItems.forEach((item) => {
            if (!item.querySelector(".custom-pin-container")) {
              const pinContainer = document.createElement("div")
              pinContainer.className = "custom-pin-container"

              const pinIcon = document.createElement("div")
              pinIcon.className = "custom-pin-icon"
              pinIcon.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="lucide lucide-map-pin" style="color: #333;">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            `
              pinContainer.appendChild(pinIcon)
              item.insertBefore(pinContainer, item.firstChild)
            }

            if (!item.querySelector(".pac-item-text-wrapper")) {
              const textWrapper = document.createElement("div")
              textWrapper.className = "pac-item-text-wrapper"

              const children = Array.from(item.childNodes).filter(
                (node) => node.nodeType === Node.ELEMENT_NODE &&
                  !(node as Element).classList.contains("custom-pin-container")
              )

              children.forEach((child) => textWrapper.appendChild(child))
              item.appendChild(textWrapper)
            }
          })
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  // Load the Google script and init once
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .pac-container { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-top: 8px; padding: 8px; background: white; font-family: inherit; }
      .pac-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 4px; cursor: pointer; background-color: #f2f2f2; }
      .pac-item:hover { background-color: #e9e9e9; }
      .pac-icon { display: none; }
      .pac-item-text-wrapper { display: flex; flex-direction: column; gap: 2px; font-size: 16px; color: #333; overflow-wrap: anywhere; }
      .pac-item-query, .pac-item span:not(.pac-item-query) { font-size: 16px; color: #333; font-weight: 400 !important; }
      .pac-matched { font-weight: 500 !important; }
      .custom-pin-container { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; min-width: 48px; background-color: #e0e0e0; border-radius: 12px; }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        strategy="afterInteractive"
        onLoad={initializeAutocomplete}
      />

      <div className="space-y-3 pt-2">
        <Label htmlFor={id} className="text-base font-medium">
          Standort<span className="text-red-500 ml-1">*</span>
        </Label>
        <div className="relative text-base">
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            className={cn(
              "w-full pl-12 pr-4 py-3 border-2 rounded-md focus:outline-none focus:ring-0",
              isFocused
                ? "border-primary"
                : locationError
                  ? "border-red-300 focus-visible:ring-red-300"
                  : "border-gray-300"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {locationError && (
            <div className="absolute right-3 top-3.5 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        {locationError && (
          <p className="text-sm text-red-500 flex items-center gap-1">{locationError}</p>
        )}
      </div>
    </>
  )
}
