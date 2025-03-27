import { Suspense, useState } from "react";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { Plus, Minus, Navigation } from "lucide-react";

const sampleLocations = [
  { id: "1", lat: 47.3769, lng: 8.5417, price: 121 }, // Zurich
  { id: "2", lat: 46.8182, lng: 8.2275, price: 177 }, // Central Switzerland
  { id: "3", lat: 46.5197, lng: 9.8522, price: 98 }, // St. Moritz area
  { id: "4", lat: 47.0502, lng: 9.4801, price: 1592 }, // Liechtenstein
  { id: "5", lat: 46.6863, lng: 7.8632, price: 1180 }, // Interlaken area
  { id: "6", lat: 47.0599, lng: 9.0587, price: 434 }, // Eastern Switzerland
  { id: "7", lat: 47.2692, lng: 11.4041, price: 159 }, // Innsbruck area
  { id: "8", lat: 47.5622, lng: 13.6493, price: 227 }, // Salzburg area
  { id: "9", lat: 47.2667, lng: 11.3833, price: 308 }, // Innsbruck
  { id: "10", lat: 47.4245, lng: 10.9801, price: 413 }, // Garmisch area
  { id: "11", lat: 47.0502, lng: 10.2677, price: 477 }, // Tyrol
  { id: "12", lat: 46.4908, lng: 11.3398, price: 334 }, // Bolzano area
  { id: "13", lat: 46.6406, lng: 14.3095, price: 494 }, // Carinthia
  { id: "14", lat: 47.8095, lng: 13.055, price: 104 }, // Salzburg
  { id: "15", lat: 46.7712, lng: 12.8882, price: 132 }, // Lienz area
  { id: "16", lat: 46.6228, lng: 14.2692, price: 153 }, // Klagenfurt area
  { id: "17", lat: 46.7224, lng: 13.8469, price: 127 }, // Spittal area
  { id: "18", lat: 46.2214, lng: 10.1699, price: 190 }, // Stelvio National Park
];

interface Location {
  id: string;
  lat: number;
  lng: number;
  price: number;
}

interface AirbnbMapProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  locations?: Location[];
  onMarkerClick?: (location: Location) => void;
  onShowListClick?: () => void;
}

function AirbnbMap({
  apiKey,
  center = { lat: 47.3769, lng: 8.5417 },
  zoom = 8,
  locations = [],
  onMarkerClick,
}: AirbnbMapProps) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  const containerStyle = { width: "100%", height: "100%" };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        mapId: "298cbf7b9c015966", // Your published Map ID
        disableDefaultUI: true,
        clickableIcons: false,
      }}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {/* Custom price markers as overlays */}
      {locations.map((location) => (
        <OverlayView
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => onMarkerClick && onMarkerClick(location)}
            className="relative flex items-center justify-center bg-white rounded-full px-3 py-1 shadow-md min-w-[60px] h-[30px] font-medium text-sm hover:z-10 hover:scale-105 transition-transform cursor-pointer"
          >
            {location.price} €
          </div>
        </OverlayView>
      ))}

      {/* Custom map controls */}
      <div className="absolute top-4 right-6 flex flex-col gap-2">
        <button
          onClick={() => {
            if (map) map.setZoom(map.getZoom() ?? 0 + 1);
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => {
            if (map) map.setZoom(map.getZoom() ?? 0 - 1);
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => {
            // Add navigation logic if needed
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Navigate"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </GoogleMap>
  );
}

function MapLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-medium">Loading map...</div>
    </div>
  );
}

export default function MapBody() {
  const apiKey = "AIzaSyD1D5qzwgPA5guVgv6QWJFjtdhRUpqAwus";

  if (!apiKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Irgendwas ist schiefgelaufen</h1>
          <p className="mb-4">Bitte versuche es später noch einmal.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={<MapLoading />}>
        <div className="w-full h-screen">
          <AirbnbMap
            apiKey={apiKey}
            locations={sampleLocations}
            onMarkerClick={(location) =>
              console.log("Clicked location:", location)
            }
          />
        </div>
      </Suspense>
    </main>
  );
}
