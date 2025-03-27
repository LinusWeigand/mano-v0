"use client"

import { useState } from "react"
import Script from "next/script"
import { AddressAutocomplete } from "./address-autocomplete-original"

interface AddressData {
  address: string
  lat: number
  lng: number
}

export default function AddressPage() {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null)
  const apiKey = "AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus"

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
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold">Selected Address</h2>
            <p className="text-gray-700">{selectedAddress.address}</p>
            <p className="text-sm text-gray-500 mt-2">
              Latitude: {selectedAddress.lat.toFixed(6)}, Longitude: {selectedAddress.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

