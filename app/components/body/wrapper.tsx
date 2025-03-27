"use client"

import { useState } from "react"
import { List, Map } from "lucide-react"
import ListBody from "./ListBody"
import { Button } from "@/components/ui/button"
import MapBody from "./Map"

export default function BodyWrapper() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "map" : "list")
  }

  return (
    <div className="relative">
      {viewMode === "list" ? (
      <ListBody />
      ) : (
      <MapBody />

      )}

      <div className="fixed bottom-9 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={toggleView}
          className="rounded-full px-6 py-7 shadow-lg bg-[#222222] hover:bg-[#222222] text-primary-foreground transition-all transform hover:scale-[1.04] active:scale-100 duration-0"
        >
          {viewMode === "list" ? (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold">Karte anzeigen</span>
              <Map style={{ width: "20px", height: "20px" }} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold">Liste anzeigen</span>
              <List style={{ width: "20px", height: "20px" }} />
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
