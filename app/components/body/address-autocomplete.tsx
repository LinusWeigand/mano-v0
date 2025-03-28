"use client"

import { useRef, useEffect } from "react"
import { AlertCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  onSelect: (data: { address: string; lat: number; lng: number }) => void
  formData: string,
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  locationError: string
}

export function AddressAutocomplete({ onSelect, formData, handleChange, locationError }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add custom styles for the Google autocomplete dropdown
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
        /* Style the "Powered by Google" text */
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

    if (window.google && window.google.maps && inputRef.current) {
      // Initialize the autocomplete functionality on the input field
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"], // Restrict results to addresses
      })

      // Add listener to handle when the user selects an address
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) {
          console.error("No details available for input: ", place.name)
          return
        }
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        // Pass the selected address details back to the parent component
        onSelect({
          address: place.formatted_address,
          lat,
          lng,
        })
      })

      // Add custom rendering for the dropdown items
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const pacItems = document.querySelectorAll(".pac-item")
            pacItems.forEach((item) => {
              if (!item.querySelector(".custom-pin-container")) {
                // Create container for the pin icon
                const pinContainer = document.createElement("div")
                pinContainer.className = "custom-pin-container"

                // Create the pin icon
                const pinIcon = document.createElement("div")
                pinIcon.className = "custom-pin-icon"
                pinIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin" style="color: #333;">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                `

                // Add the pin icon to the container
                pinContainer.appendChild(pinIcon)

                // Add the container to the item
                item.insertBefore(pinContainer, item.firstChild)
              }
            })
          }
        })
      })

      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      // Clean up the style element when component unmounts
      document.head.removeChild(style)
    }
  }, [onSelect])

  return (

    <div className="relative">
      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

      <input
        ref={inputRef}
        id="location"
        name="location"
        maxLength={100}
        placeholder="Geben Sie Ihren Standort an"
        defaultValue={formData}
        onBlur={handleChange}
        className={`w-full text-[16px] rounded-md bg-white border-2 h-12 pl-12 pr-4 outline-none focus:border-primary ${locationError ? "border-red-300 focus:ring-red-300" : "border-gray-200"
          }`}
      />

      {locationError && (
        <div className="absolute right-3 top-3.5 text-red-500">
          <AlertCircle className="h-5 w-5" />
        </div>
      )}
    </div>
  )
}

