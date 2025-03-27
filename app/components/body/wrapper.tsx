"use client"

import { useState, useEffect } from "react"
import { List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import ListBody from "./ListBody"
import MapBody from "./Map"

export default function BodyWrapper() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [isAtBottom, setIsAtBottom] = useState(false)

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "map" : "list")
  }

  useEffect(() => {
    const handleScroll = () => {
      // Use 500 for mobile width and 200 for wider screens.
      const threshold = window.innerWidth < 768 ? 440 : 200;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    // Run initially in case the page is already scrolled
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
       {viewMode === "list" ? <ListBody /> : <MapBody />}

      {!isAtBottom && (
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
      )}
    </div>
  );
}
