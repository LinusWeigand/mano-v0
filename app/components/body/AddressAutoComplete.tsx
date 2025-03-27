"use client"

import { useState, useRef, useEffect } from "react"
import Script from "next/script"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface AddressData {
  address: string
  lat: number
  lng: number
}

export default function ReliableAddressAutocomplete() {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const apiKey = "AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus"

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) {
        console.error("No geometry for selected place:", place.name)
        return
      }

      setSelectedAddress({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })
    })

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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin" style="color: #333;">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              `

              pinContainer.appendChild(pinIcon)
              item.insertBefore(pinContainer, item.firstChild)
            }
          })
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .pac-container {
        border-radius: 12px;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        margin-top: 8px;
        padding: 8px;
        background: white;
        font-family: inherit;
      }
      .pac-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: none;
        border-radius: 8px;
        margin-bottom: 4px;
        cursor: pointer;
        background-color: #f2f2f2;
      }
      .pac-item:hover {
        background-color: #e9e9e9;
      }
      .pac-icon {
        display: none;
      }
      .pac-item-query {
        font-size: 16px;
        color: #333;
        padding-right: 4px;
      }
      .pac-matched {
        font-weight: 500;
      }
      .pac-item span:not(.pac-item-query) {
        font-size: 16px;
        color: #444;
      }
      .pac-container:after {
        font-size: 10px;
        color: #999;
        padding: 4px 8px;
        text-align: right;
        opacity: 0.7;
      }
      .custom-pin-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        min-width: 48px;
        background-color: #e0e0e0;
        border-radius: 12px;
        margin-right: 16px;
      }
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

        <Label htmlFor="location" className="text-base font-medium">
          Standort<span className="text-red-500 ml-1">*</span>
        </Label>
        <div className="relative text-base">
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Geben Sie Ihren Standort an"
            className={cn(
              "w-full pl-12 pr-4 py-3 border-2 rounded-md focus:outline-none focus:ring-0 focus:ring-primary",
              isFocused ? "border-primary" : "border-gray-300"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {selectedAddress && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold">Selected Address</h2>
              <p className="text-gray-700">{selectedAddress.address}</p>
              <p className="text-sm text-gray-500 mt-2">
                Latitude: {selectedAddress.lat.toFixed(6)}, Longitude: {selectedAddress.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
