// components/GoogleMap.tsx
import React, { useEffect, useRef } from "react";
import initMap from "./map"

// Extend the Window interface to include initMap
declare global {
  interface Window {
    initMap: () => void;
  }
}

const GoogleMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to initialize the map
  const initializeMap = () => {
    if (!mapRef.current && document.getElementById("map")) {
      mapRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 10,
        }
      );
      initMap();
    }
  };

  const loadGoogleMapsScript = () => {
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = initializeMap;
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  return (
    <div id="map" style={{ height: "400px", width: "100%" }} className="rounded-lg shadow-lg" />
  );
};

export default GoogleMap;
