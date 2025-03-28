"use client"

import { useState, useEffect } from "react";
import { List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListBody from "./ListBody";
import MapBody from "./Map";
import { SearchBarForm } from "../search/SearchBar";

interface BodyWrapperProps {
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
}

export default function BodyWrapper({ viewMode, setViewMode }: BodyWrapperProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "map" : "list");
  };

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth < 768 ? 440 : 200;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - threshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {viewMode === "list" ? <ListBody /> : <MapBody />}

      {/* For map view, render the absolute search bar at the top center */}
      {viewMode === "map" && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <SearchBarForm />
        </div>
      )}

      {/* Toggle view button */}
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
