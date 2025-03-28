"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MapPin, AlertCircle } from "lucide-react";

interface ReliableAddressAutocompleteProps {
  /**
   * The current string value of the address input.
   */
  value?: string;
  /**
   * A callback to notify the parent when the user selects an address.
   */
  onChange: (address: string, lat: number, lng: number) => void;

  /**
   * ID for the input element.
   */
  id?: string;
  /**
   * Name for the input element.
   */
  name?: string;
  /**
   * Placeholder text.
   */
  placeholder?: string;

  /**
   * An optional label to display above the input.
   * If omitted, no label is shown.
   */
  label?: string;
  /**
   * Whether the field is required (adds a red asterisk when `label` is used).
   */
  required?: boolean;
  /**
   * An optional error message to display below the input (in red).
   * If omitted, no error message or red border is shown.
   */
  errorMessage?: string;

  /**
   * Allows you to add custom class names to the container.
   */
  className?: string;
  /**
   * Whether to show the small MapPin icon inside the input on the left.
   */
  showIcon?: boolean;
}

/**
 * A reusable Google-Places-powered address autocomplete input
 * that can optionally show a label, a required indicator, and an error message.
 */
export default function ReliableAddressAutocomplete({
  value = "",
  onChange,
  id = "location",
  name = "location",
  placeholder = "Geben Sie Ihren Standort an",
  label,
  required = false,
  errorMessage,
  className,
  showIcon = true,
}: ReliableAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Keep the input's value in sync with external `value`.
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  // Initialize Google Places Autocomplete once Google Maps is available.
  useEffect(() => {
    let interval: number | null = null;

    const maybeInitAutocomplete = () => {
      if (!window.google || !window.google.maps) return;
      if (!inputRef.current) return;

      // Initialize once only
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

      setHasInitialized(true);

      // Inject custom styling/icons inside the suggestion dropdown.
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const pacItems = document.querySelectorAll(".pac-item");
            pacItems.forEach((item) => {
              // Insert a custom icon container if not present
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

              // Wrap the text nodes in a .pac-item-text-wrapper for easy styling
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
    };

    // Poll every 300ms until `window.google` is ready
    interval = window.setInterval(() => {
      if (!hasInitialized) {
        maybeInitAutocomplete();
      }
    }, 300);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [onChange, hasInitialized]);

  // Prevent the Enter key from reloading the page if no suggestion is selected.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const selectedItem = document.querySelector(".pac-item-selected");
        // If no item is highlighted, prevent default
        if (!selectedItem) {
          e.preventDefault();
        }
      }
    };
    el.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Inject the custom CSS for styling the .pac-container, etc.
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

        width: 500px !important;
        min-width: 400px !important;
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
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
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

    // Cleanup
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Conditionally show label if passed in */}
      {label && (
        <label htmlFor={id} className="text-base font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative text-base mt-2">
        {showIcon && (
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        )}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          className={cn(
            "w-full py-3 pr-4 border-2 rounded-md focus:outline-none focus:ring-0 transition-colors",
            showIcon ? "pl-12" : "pl-4",
            isFocused
              ? "border-primary"
              : errorMessage
                ? "border-red-300 focus-visible:ring-red-300"
                : "border-gray-300"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Error icon on the right if there's an errorMessage */}
        {errorMessage && (
          <div className="absolute right-3 top-3.5 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Error message below */}
      {errorMessage && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
