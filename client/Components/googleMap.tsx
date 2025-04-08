import React, { useEffect, useRef } from "react";
import { initMap } from "@/pages/api/mapUtils";
import { useUser } from "@clerk/nextjs";

const GoogleMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleMapsRef = useRef<google.maps.Map | null>(null);
  const { user } = useUser()
  

  // Function to initialize the map and set user's location
  const initializeMap = () => {
    if (window.google && window.google.maps) {
      googleMapsRef.current = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 8,
          center: { lat: 37.7749, lng: -122.4194 }, // Example: San Francisco
        }
      );
      // Call initMap from mapUtils once the map is initialized
      initMap("map", true, user); // Pass correct parameters based on your app's logic
    }
  };

  const loadGoogleMapsScript = () => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // Load the Google Maps script if not already loaded
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&callback=initializeMap`;
      script.async = true;
      script.defer = true;

      // Make initializeMap globally accessible
      window.initializeMap = initializeMap;

      document.head.appendChild(script);
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
