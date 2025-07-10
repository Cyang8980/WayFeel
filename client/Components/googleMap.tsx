// components/GoogleMap.tsx
import React, { useEffect, useRef, useCallback } from "react";
import initMap from "@/components/map"

declare global {
  interface Window {
    initMap: () => void;
    google: typeof google;
  }
}

const GoogleMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current && document.getElementById("map") && window.google?.maps) {
      mapRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 10,
        }
      );
      initMap(); // Remove this if not needed separately
    }
  }, []);

  const loadGoogleMapsScript = useCallback(() => {
    if (window.google?.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Set initMap globally for callback
      window.initMap = initializeMap;

      document.head.appendChild(script);
    }
  }, [initializeMap]);

  useEffect(() => {
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  return (
    <div
      id="map"
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-lg"
    />
  );
};

export default GoogleMap;
