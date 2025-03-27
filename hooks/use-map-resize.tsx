import { useEffect } from "react";

export function useMapResize(map: google.maps.Map | null) {
  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      // Trigger the resize event on the map instance
      window.google.maps.event.trigger(map, "resize");
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);
}
