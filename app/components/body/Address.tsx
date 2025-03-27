// pages/address.js

import { useState, useRef, useEffect } from "react";
import Script from "next/script";

function AddressAutocomplete({ onSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps && inputRef.current) {
      // Initialize the autocomplete functionality on the input field.
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"], // Restrict results to addresses
        // Optionally, restrict to a specific country:
        // componentRestrictions: { country: "us" },
      });

      // Add listener to handle when the user selects an address.
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error("No details available for input: ", place.name);
          return;
        }
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Pass the selected address details back to the parent component.
        onSelect({
          address: place.formatted_address,
          lat,
          lng,
        });
      });
    }
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter your address"
      className="border p-2 rounded w-full"
    />
  );
}

export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const apiKey = "AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus";

  return (
    <>
      {/* Load the Google Maps JavaScript API with the Places library */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        strategy="beforeInteractive"
      />

      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Enter Your Address</h1>
        <AddressAutocomplete onSelect={(data) => setSelectedAddress(data)} />

        {selectedAddress && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Selected Address</h2>
            <p>{selectedAddress.address}</p>
            <p>
              Latitude: {selectedAddress.lat}, Longitude: {selectedAddress.lng}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
