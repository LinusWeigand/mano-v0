"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, AlertCircle } from "lucide-react";

interface ReliableAddressAutocompleteProps {
  onChange: (address: string, lat: number, lng: number) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  locationError?: string;
}

export default function ReliableAddressAutocomplete({
  onChange,
  id = "location",
  name = "location",
  placeholder = "Geben Sie Ihren Standort an",
  locationError = "",
}: ReliableAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    function maybeInitAutocomplete() {
      if (!window.google || !window.google.maps) return;
      if (!inputRef.current) return;

      // Only want to init once
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["address"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location || !place.formatted_address) {
          return;
        }
        onChange(
          place.formatted_address,
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      });

      // ----- Here is the observer logic from your old code -----
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const pacItems = document.querySelectorAll(".pac-item");
            pacItems.forEach((item) => {
              // Insert the custom icon container if not present
              if (!item.querySelector(".custom-pin-container")) {
                const pinContainer = document.createElement("div");
                pinContainer.className = "custom-pin-container";

                const pinIcon = document.createElement("div");
                pinIcon.className = "custom-pin-icon";
                pinIcon.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="lucide lucide-map-pin" style="color: #333;">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                `;
                pinContainer.appendChild(pinIcon);
                item.insertBefore(pinContainer, item.firstChild);
              }

              // Wrap the existing text nodes in a .pac-item-text-wrapper
              if (!item.querySelector(".pac-item-text-wrapper")) {
                const textWrapper = document.createElement("div");
                textWrapper.className = "pac-item-text-wrapper";
                
                const children = Array.from(item.childNodes).filter(
                  (node) =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    !(node as Element).classList.contains("custom-pin-container")
                );
                children.forEach((child) => textWrapper.appendChild(child));
                item.appendChild(textWrapper);
              }
            });
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setHasInitialized(true);
    }

    // Poll every 300ms until google.maps is defined
    interval = setInterval(() => {
      if (!hasInitialized) {
        maybeInitAutocomplete();
      }
    }, 300);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onChange, hasInitialized]);

  // The rest of your Enter-blocking logic, etc.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        const selectedItem = document.querySelector(".pac-item-selected");
        if (!selectedItem) {
          e.preventDefault();
        }
      }
    }

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, []);

useEffect(() => {
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .pac-container {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      margin-top: 8px;
      padding: 8px;
      background: white;
      font-family: inherit;
    }
    .pac-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
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
    .pac-item-text-wrapper {
      display: flex;
      flex-direction: row; /* changed from column */
      flex-wrap: wrap;     /* let it wrap if too wide */
      align-items: center;
      gap: 4px;            /* or 2px, however much space you like */
      font-size: 16px;
      color: #333;
      overflow-wrap: anywhere;
    }
    .pac-item-query,
    .pac-item span:not(.pac-item-query) {
      font-size: 16px;
      color: #333;
      font-weight: 400 !important;
    }
    .pac-matched {
      font-weight: 500 !important;
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
    }
  `;
  document.head.appendChild(styleEl);
  return () => {
    document.head.removeChild(styleEl);
  };
}, []);

  return (
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
        <p className="text-sm text-red-500 flex items-center gap-1">
          {locationError}
        </p>
      )}
    </div>
  );
}
